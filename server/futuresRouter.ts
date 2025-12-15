import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Crop types for perennial energy crops
const PERENNIAL_CROP_TYPES = [
  "bamboo",
  "rotation_forestry",
  "eucalyptus",
  "poplar",
  "willow",
  "miscanthus",
  "switchgrass",
  "arundo_donax",
  "hemp",
  "other_perennial",
] as const;

const AUSTRALIAN_STATES = [
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "NT",
  "ACT",
] as const;

const LAND_STATUS = [
  "owned",
  "leased",
  "under_negotiation",
  "planned_acquisition",
] as const;

const FUTURES_STATUS = [
  "draft",
  "active",
  "partially_contracted",
  "fully_contracted",
  "expired",
  "cancelled",
] as const;

const EOI_STATUS = [
  "pending",
  "under_review",
  "accepted",
  "declined",
  "expired",
  "withdrawn",
] as const;

const DELIVERY_FREQUENCIES = [
  "monthly",
  "quarterly",
  "semi-annual",
  "annual",
  "flexible",
] as const;

const PAYMENT_TERMS = [
  "net_30",
  "net_60",
  "net_90",
  "on_delivery",
  "advance",
  "negotiable",
] as const;

export const futuresRouter = router({
  // ============================================================================
  // SUPPLIER OPERATIONS
  // ============================================================================

  // Create new futures listing
  create: protectedProcedure
    .input(
      z.object({
        cropType: z.enum(PERENNIAL_CROP_TYPES),
        cropVariety: z.string().optional(),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        state: z.enum(AUSTRALIAN_STATES),
        region: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        landAreaHectares: z.number().positive("Land area must be positive"),
        landStatus: z.enum(LAND_STATUS).optional(),
        projectionStartYear: z.number().int().min(2024),
        projectionEndYear: z.number().int(),
        plantingDate: z.date().optional(),
        firstHarvestYear: z.number().int().optional(),
        indicativePricePerTonne: z.number().positive().optional(),
        priceEscalationPercent: z.number().min(0).max(20).optional(),
        pricingNotes: z.string().optional(),
        expectedCarbonIntensity: z.number().optional(),
        expectedMoistureContent: z.number().optional(),
        expectedEnergyContent: z.number().optional(),
        status: z.enum(["draft", "active"]).default("draft"),
        // Initial projections (optional, can be added separately)
        projections: z
          .array(
            z.object({
              projectionYear: z.number().int(),
              projectedTonnes: z.number().positive(),
              confidencePercent: z.number().min(0).max(100).optional(),
              harvestSeason: z.string().optional(),
              notes: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get supplier profile
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      if (!supplier) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only suppliers can create futures listings",
        });
      }

      // Validate projection years
      if (input.projectionEndYear < input.projectionStartYear) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "End year must be after start year",
        });
      }
      if (input.projectionEndYear - input.projectionStartYear > 25) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Projection period cannot exceed 25 years",
        });
      }

      // Generate futures ID
      const futuresId = await db.generateFuturesId();

      const { projections, ...futuresData } = input;

      // Create futures record
      const id = await db.createFutures({
        ...futuresData,
        futuresId,
        supplierId: supplier.id,
        landAreaHectares: futuresData.landAreaHectares.toString(),
        indicativePricePerTonne:
          futuresData.indicativePricePerTonne?.toString(),
        priceEscalationPercent:
          futuresData.priceEscalationPercent?.toString() || "2.5",
        expectedCarbonIntensity:
          futuresData.expectedCarbonIntensity?.toString(),
        expectedMoistureContent:
          futuresData.expectedMoistureContent?.toString(),
        expectedEnergyContent: futuresData.expectedEnergyContent?.toString(),
        publishedAt: input.status === "active" ? new Date() : undefined,
      });

      // If projections provided, save them
      if (projections && projections.length > 0) {
        await db.bulkUpsertProjections(
          id,
          projections.map(p => ({
            ...p,
            projectedTonnes: p.projectedTonnes.toString(),
          }))
        );
      }

      return { id, futuresId };
    }),

  // Update futures listing
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        region: z.string().optional(),
        landAreaHectares: z.number().positive().optional(),
        landStatus: z.enum(LAND_STATUS).optional(),
        indicativePricePerTonne: z.number().positive().optional(),
        priceEscalationPercent: z.number().min(0).max(20).optional(),
        pricingNotes: z.string().optional(),
        expectedCarbonIntensity: z.number().optional(),
        expectedMoistureContent: z.number().optional(),
        expectedEnergyContent: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      if (!supplier) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only suppliers can update futures listings",
        });
      }

      const futures = await db.getFuturesById(input.id);
      if (!futures) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }
      if (futures.supplierId !== supplier.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own futures listings",
        });
      }

      const { id, ...updates } = input;
      await db.updateFutures(id, {
        ...updates,
        landAreaHectares: updates.landAreaHectares?.toString(),
        indicativePricePerTonne: updates.indicativePricePerTonne?.toString(),
        priceEscalationPercent: updates.priceEscalationPercent?.toString(),
        expectedCarbonIntensity: updates.expectedCarbonIntensity?.toString(),
        expectedMoistureContent: updates.expectedMoistureContent?.toString(),
        expectedEnergyContent: updates.expectedEnergyContent?.toString(),
      });

      return { success: true };
    }),

  // List supplier's futures
  list: protectedProcedure.query(async ({ ctx }) => {
    const supplier = await db.getSupplierByUserId(ctx.user.id);
    if (!supplier) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Supplier profile required",
      });
    }

    const futures = await db.getFuturesBySupplierId(supplier.id);

    // Get EOI counts for each futures
    const futuresWithCounts = await Promise.all(
      futures.map(async f => {
        const eoiCounts = await db.countEOIsByFuturesId(f.id);
        return { ...f, eoiCounts };
      })
    );

    return futuresWithCounts;
  }),

  // Get single futures by ID (for supplier view)
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const futures = await db.getFuturesById(input.id);
      if (!futures) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }

      // Get projections
      const projections = await db.getProjectionsByFuturesId(input.id);

      // Check if user owns this futures
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      const isOwner = supplier?.id === futures.supplierId;

      // Get supplier info
      const supplierInfo = await db.getSupplierById(futures.supplierId);

      return { futures, projections, isOwner, supplier: supplierInfo };
    }),

  // Publish futures (change status to active)
  publish: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      if (!supplier) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Supplier profile required",
        });
      }

      const futures = await db.getFuturesById(input.id);
      if (!futures) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }
      if (futures.supplierId !== supplier.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only publish your own futures listings",
        });
      }

      // Check if there are projections
      const projections = await db.getProjectionsByFuturesId(input.id);
      if (projections.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Add yield projections before publishing",
        });
      }

      await db.updateFutures(input.id, {
        status: "active",
        publishedAt: new Date(),
      });

      return { success: true };
    }),

  // Unpublish (set back to draft)
  unpublish: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      if (!supplier) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Supplier profile required",
        });
      }

      const futures = await db.getFuturesById(input.id);
      if (!futures) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }
      if (futures.supplierId !== supplier.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only unpublish your own futures listings",
        });
      }

      await db.updateFutures(input.id, { status: "draft" });

      return { success: true };
    }),

  // Delete futures (draft only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      if (!supplier) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Supplier profile required",
        });
      }

      const futures = await db.getFuturesById(input.id);
      if (!futures) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }
      if (futures.supplierId !== supplier.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own futures listings",
        });
      }
      if (futures.status !== "draft") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only draft futures can be deleted",
        });
      }

      await db.deleteFutures(input.id);

      return { success: true };
    }),

  // Save yield projections
  saveProjections: protectedProcedure
    .input(
      z.object({
        futuresId: z.number(),
        projections: z.array(
          z.object({
            projectionYear: z.number().int(),
            projectedTonnes: z.number().nonnegative(),
            confidencePercent: z.number().min(0).max(100).optional(),
            harvestSeason: z.string().optional(),
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      if (!supplier) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Supplier profile required",
        });
      }

      const futures = await db.getFuturesById(input.futuresId);
      if (!futures) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }
      if (futures.supplierId !== supplier.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You can only update projections for your own futures listings",
        });
      }

      await db.bulkUpsertProjections(
        input.futuresId,
        input.projections.map(p => ({
          ...p,
          projectedTonnes: p.projectedTonnes.toString(),
        }))
      );

      return { success: true };
    }),

  // ============================================================================
  // BUYER OPERATIONS (MARKETPLACE)
  // ============================================================================

  // Search active futures (public)
  search: publicProcedure
    .input(
      z.object({
        state: z.array(z.enum(AUSTRALIAN_STATES)).optional(),
        cropType: z.array(z.enum(PERENNIAL_CROP_TYPES)).optional(),
        minVolume: z.number().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return await db.searchActiveFutures({
        state: input.state,
        cropType: input.cropType,
        minVolume: input.minVolume,
        limit: input.limit,
        offset: input.offset,
      });
    }),

  // Get public futures detail
  getPublic: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const futures = await db.getFuturesById(input.id);
      if (!futures) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }

      // Only return active futures publicly
      if (futures.status !== "active") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }

      // Get projections
      const projections = await db.getProjectionsByFuturesId(input.id);

      // Get supplier info
      const supplier = await db.getSupplierById(futures.supplierId);

      // Check if logged-in user has existing EOI
      let existingEOI = null;
      if (ctx.user) {
        const buyer = await db.getBuyerByUserId(ctx.user.id);
        if (buyer) {
          existingEOI = await db.getEOIByFuturesAndBuyer(input.id, buyer.id);
        }
      }

      return { futures, projections, supplier, existingEOI };
    }),

  // ============================================================================
  // EOI OPERATIONS
  // ============================================================================

  // Submit EOI (buyers only)
  submitEOI: protectedProcedure
    .input(
      z.object({
        futuresId: z.number(),
        interestStartYear: z.number().int(),
        interestEndYear: z.number().int(),
        annualVolumeTonnes: z
          .number()
          .positive("Annual volume must be positive"),
        offeredPricePerTonne: z.number().positive().optional(),
        priceTerms: z.string().optional(),
        deliveryLocation: z.string().optional(),
        deliveryFrequency: z.enum(DELIVERY_FREQUENCIES).default("quarterly"),
        logisticsNotes: z.string().optional(),
        paymentTerms: z.enum(PAYMENT_TERMS).default("negotiable"),
        additionalTerms: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get buyer profile
      const buyer = await db.getBuyerByUserId(ctx.user.id);
      if (!buyer) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only buyers can submit EOIs",
        });
      }

      // Check if futures exists and is active
      const futures = await db.getFuturesById(input.futuresId);
      if (!futures) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }
      if (futures.status !== "active") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This futures listing is not accepting EOIs",
        });
      }

      // Check if buyer already has EOI for this futures
      const existingEOI = await db.getEOIByFuturesAndBuyer(
        input.futuresId,
        buyer.id
      );
      if (existingEOI) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already submitted an EOI for this futures",
        });
      }

      // Validate year range
      if (input.interestEndYear < input.interestStartYear) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "End year must be after start year",
        });
      }
      if (
        input.interestStartYear < futures.projectionStartYear ||
        input.interestEndYear > futures.projectionEndYear
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Interest period must be within the futures projection period",
        });
      }

      // Calculate total volume
      const yearsOfInterest =
        input.interestEndYear - input.interestStartYear + 1;
      const totalVolumeTonnes = input.annualVolumeTonnes * yearsOfInterest;

      // Check against available volume
      const availableTonnes = parseFloat(futures.totalAvailableTonnes || "0");
      if (totalVolumeTonnes > availableTonnes) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Requested volume exceeds available supply (${availableTonnes.toLocaleString()}t)`,
        });
      }

      // Generate EOI reference
      const eoiReference = await db.generateEOIReference();

      const eoiId = await db.createEOI({
        ...input,
        eoiReference,
        buyerId: buyer.id,
        annualVolumeTonnes: input.annualVolumeTonnes.toString(),
        totalVolumeTonnes: totalVolumeTonnes.toString(),
        offeredPricePerTonne: input.offeredPricePerTonne?.toString(),
      });

      return { id: eoiId, eoiReference };
    }),

  // Get buyer's EOIs
  myEOIs: protectedProcedure.query(async ({ ctx }) => {
    const buyer = await db.getBuyerByUserId(ctx.user.id);
    if (!buyer) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Buyer profile required",
      });
    }

    const eois = await db.getEOIsByBuyerId(buyer.id);

    // Get futures info for each EOI
    const eoisWithFutures = await Promise.all(
      eois.map(async eoi => {
        const futures = await db.getFuturesById(eoi.futuresId);
        return { ...eoi, futures };
      })
    );

    return eoisWithFutures;
  }),

  // Get EOIs for a futures listing (supplier only)
  getEOIsForFutures: protectedProcedure
    .input(z.object({ futuresId: z.number() }))
    .query(async ({ ctx, input }) => {
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      if (!supplier) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Supplier profile required",
        });
      }

      const futures = await db.getFuturesById(input.futuresId);
      if (!futures) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }
      if (futures.supplierId !== supplier.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view EOIs for your own futures listings",
        });
      }

      const eois = await db.getEOIsByFuturesId(input.futuresId);

      // Get buyer info for each EOI
      const eoisWithBuyers = await Promise.all(
        eois.map(async eoi => {
          const buyer = await db.getBuyerById(eoi.buyerId);
          return { ...eoi, buyer };
        })
      );

      return eoisWithBuyers;
    }),

  // Respond to EOI (supplier only)
  respondToEOI: protectedProcedure
    .input(
      z.object({
        eoiId: z.number(),
        status: z.enum(["under_review", "accepted", "declined"]),
        response: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      if (!supplier) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Supplier profile required",
        });
      }

      const eoi = await db.getEOIById(input.eoiId);
      if (!eoi) {
        throw new TRPCError({ code: "NOT_FOUND", message: "EOI not found" });
      }

      const futures = await db.getFuturesById(eoi.futuresId);
      if (!futures) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Futures listing not found",
        });
      }
      if (futures.supplierId !== supplier.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only respond to EOIs for your own futures listings",
        });
      }

      await db.updateEOIStatus(input.eoiId, input.status, input.response);

      // If accepted, could potentially update contracted tonnage (future enhancement)

      return { success: true };
    }),

  // Withdraw EOI (buyer only)
  withdrawEOI: protectedProcedure
    .input(z.object({ eoiId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const buyer = await db.getBuyerByUserId(ctx.user.id);
      if (!buyer) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Buyer profile required",
        });
      }

      const eoi = await db.getEOIById(input.eoiId);
      if (!eoi) {
        throw new TRPCError({ code: "NOT_FOUND", message: "EOI not found" });
      }
      if (eoi.buyerId !== buyer.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only withdraw your own EOIs",
        });
      }

      // Only pending or under_review EOIs can be withdrawn
      if (!["pending", "under_review"].includes(eoi.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only pending EOIs can be withdrawn",
        });
      }

      await db.updateEOIStatus(input.eoiId, "withdrawn");

      return { success: true };
    }),
});
