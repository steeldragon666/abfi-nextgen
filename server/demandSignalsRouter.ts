import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const demandSignalsRouter = router({
  // Create demand signal (buyers only)
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      feedstockType: z.string(),
      feedstockCategory: z.enum(["agricultural_residue", "forestry_residue", "energy_crop", "organic_waste", "algae_aquatic", "mixed"]),
      annualVolume: z.number(),
      volumeFlexibility: z.number().optional(),
      deliveryFrequency: z.enum(["continuous", "weekly", "fortnightly", "monthly", "quarterly", "seasonal", "spot"]),
      minMoistureContent: z.number().optional(),
      maxMoistureContent: z.number().optional(),
      minEnergyContent: z.number().optional(),
      maxAshContent: z.number().optional(),
      maxChlorineContent: z.number().optional(),
      otherQualitySpecs: z.string().optional(),
      deliveryLocation: z.string(),
      deliveryState: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]).optional(),
      deliveryLatitude: z.string().optional(),
      deliveryLongitude: z.string().optional(),
      maxTransportDistance: z.number().optional(),
      deliveryMethod: z.enum(["ex_farm", "delivered", "fob_port", "negotiable"]),
      indicativePriceMin: z.number().optional(),
      indicativePriceMax: z.number().optional(),
      pricingMechanism: z.enum(["fixed", "indexed", "spot", "negotiable"]),
      supplyStartDate: z.date(),
      supplyEndDate: z.date().optional(),
      contractTerm: z.number().optional(),
      responseDeadline: z.date(),
      requiredCertifications: z.array(z.string()).optional(),
      sustainabilityRequirements: z.string().optional(),
      status: z.enum(["draft", "published"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get buyer profile
      const buyer = await db.getBuyerByUserId(ctx.user.id);
      if (!buyer) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only buyers can create demand signals' });
      }

      // Generate signal number
      const timestamp = Date.now();
      const signalNumber = `ABFI-DS-${new Date().getFullYear()}-${String(timestamp).slice(-5)}`;

      const signalId = await db.createDemandSignal({
        ...input,
        buyerId: buyer.id,
        userId: ctx.user.id,
        signalNumber,
        publishedAt: input.status === 'published' ? new Date() : undefined,
      });

      return { id: signalId, signalNumber };
    }),

  // List demand signals (public for suppliers, filtered for buyers)
  list: publicProcedure
    .input(z.object({
      status: z.enum(["draft", "published", "closed", "awarded", "cancelled"]).optional(),
      feedstockType: z.string().optional(),
      deliveryState: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]).optional(),
      mySignals: z.boolean().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const filters: any = {};
      
      if (input.status) filters.status = input.status;
      if (input.feedstockType) filters.feedstockType = input.feedstockType;
      if (input.deliveryState) filters.deliveryState = input.deliveryState;
      
      // If user is logged in and wants their own signals
      if (ctx.user && input.mySignals) {
        const buyer = await db.getBuyerByUserId(ctx.user.id);
        if (buyer) {
          filters.buyerId = buyer.id;
        }
      }
      
      // Non-logged-in users or suppliers only see published signals
      if (!ctx.user || !input.mySignals) {
        filters.status = 'published';
      }

      return await db.getAllDemandSignals(filters);
    }),

  // Get single demand signal
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const signal = await db.getDemandSignalById(input.id);
      if (!signal) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Demand signal not found' });
      }

      // Increment view count
      await db.incrementDemandSignalViewCount(input.id);

      // Check if user is the buyer (to show full details)
      let isBuyer = false;
      if (ctx.user) {
        const buyer = await db.getBuyerByUserId(ctx.user.id);
        isBuyer = buyer?.id === signal.buyerId;
      }

      return { signal, isBuyer };
    }),

  // Update demand signal (buyers only, own signals)
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["draft", "published", "closed", "awarded", "cancelled"]).optional(),
      title: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const signal = await db.getDemandSignalById(input.id);
      if (!signal) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Demand signal not found' });
      }

      const buyer = await db.getBuyerByUserId(ctx.user.id);
      if (!buyer || buyer.id !== signal.buyerId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only update your own demand signals' });
      }

      const { id, ...updates } = input;
      await db.updateDemandSignal(id, updates);

      return { success: true };
    }),

  // Submit supplier response
  submitResponse: protectedProcedure
    .input(z.object({
      demandSignalId: z.number(),
      proposedVolume: z.number(),
      proposedPrice: z.number(),
      proposedDeliveryMethod: z.string().optional(),
      proposedStartDate: z.date(),
      proposedContractTerm: z.number().optional(),
      coverLetter: z.string().optional(),
      linkedFeedstocks: z.array(z.number()).optional(),
      linkedCertificates: z.array(z.number()).optional(),
      linkedEvidence: z.array(z.number()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get supplier profile
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      if (!supplier) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only suppliers can submit responses' });
      }

      // Check if demand signal exists and is published
      const signal = await db.getDemandSignalById(input.demandSignalId);
      if (!signal) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Demand signal not found' });
      }
      if (signal.status !== 'published') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'This demand signal is not accepting responses' });
      }

      // Check if deadline has passed
      if (new Date() > new Date(signal.responseDeadline)) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Response deadline has passed' });
      }

      // Generate response number
      const timestamp = Date.now();
      const responseNumber = `ABFI-SR-${new Date().getFullYear()}-${String(timestamp).slice(-5)}`;

      // Calculate match score (simple algorithm)
      let matchScore = 50; // Base score
      
      // Volume match
      if (input.proposedVolume >= signal.annualVolume * 0.9 && input.proposedVolume <= signal.annualVolume * 1.1) {
        matchScore += 20;
      } else if (input.proposedVolume >= signal.annualVolume * 0.8) {
        matchScore += 10;
      }
      
      // Price match (if provided)
      if (signal.indicativePriceMin && signal.indicativePriceMax) {
        if (input.proposedPrice >= signal.indicativePriceMin && input.proposedPrice <= signal.indicativePriceMax) {
          matchScore += 20;
        } else if (input.proposedPrice <= signal.indicativePriceMax * 1.1) {
          matchScore += 10;
        }
      }
      
      // Has certificates/evidence
      if (input.linkedCertificates && input.linkedCertificates.length > 0) {
        matchScore += 10;
      }

      matchScore = Math.min(100, matchScore);

      const responseId = await db.createSupplierResponse({
        ...input,
        demandSignalId: input.demandSignalId,
        supplierId: supplier.id,
        userId: ctx.user.id,
        responseNumber,
        matchScore,
      });

      return { id: responseId, responseNumber, matchScore };
    }),

  // Get responses for a demand signal (buyers only, own signals)
  getResponses: protectedProcedure
    .input(z.object({ demandSignalId: z.number() }))
    .query(async ({ ctx, input }) => {
      const signal = await db.getDemandSignalById(input.demandSignalId);
      if (!signal) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Demand signal not found' });
      }

      const buyer = await db.getBuyerByUserId(ctx.user.id);
      if (!buyer || buyer.id !== signal.buyerId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only view responses to your own demand signals' });
      }

      return await db.getResponsesByDemandSignal(input.demandSignalId);
    }),

  // Get supplier's own responses
  myResponses: protectedProcedure
    .query(async ({ ctx }) => {
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      if (!supplier) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only suppliers can view their responses' });
      }

      return await db.getResponsesBySupplierId(supplier.id);
    }),

  // Update response status (buyers only)
  updateResponseStatus: protectedProcedure
    .input(z.object({
      responseId: z.number(),
      status: z.enum(["submitted", "shortlisted", "rejected", "accepted"]),
      buyerNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const response = await db.getSupplierResponseById(input.responseId);
      if (!response) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Response not found' });
      }

      const signal = await db.getDemandSignalById(response.demandSignalId);
      if (!signal) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Demand signal not found' });
      }

      const buyer = await db.getBuyerByUserId(ctx.user.id);
      if (!buyer || buyer.id !== signal.buyerId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only update responses to your own demand signals' });
      }

      await db.updateSupplierResponse(input.responseId, {
        status: input.status,
        buyerNotes: input.buyerNotes,
        viewedByBuyer: true,
        viewedAt: new Date(),
      });

      return { success: true };
    }),
});
