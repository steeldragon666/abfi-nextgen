"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import type { MapEntity, MapLayerType } from "./MarketIntelligenceMap";

// Status colors matching the main map
const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#9ca3af",
  PENDING_VERIFICATION: "#f59e0b",
  ACTIVE: "#22c55e",
  COMPLETED: "#3b82f6",
  CANCELLED: "#ef4444",
  EXPIRED: "#6b7280",
  PENDING_GROWER: "#f59e0b",
  PENDING_BUYER: "#f59e0b",
  DELIVERING: "#8b5cf6",
  DISPUTED: "#ef4444",
  SUGGESTED: "#9ca3af",
  VIEWED: "#3b82f6",
  NEGOTIATING: "#f59e0b",
  ACCEPTED: "#22c55e",
  REJECTED: "#ef4444",
  SCHEDULED: "#9ca3af",
  LOADING: "#f59e0b",
  IN_TRANSIT: "#8b5cf6",
  DELIVERED: "#22c55e",
  CONFIRMED: "#059669",
};

// Feedstock category colors
const FEEDSTOCK_COLORS: Record<string, string> = {
  oilseed: "#22c55e",
  UCO: "#f59e0b",
  tallow: "#8b5cf6",
  lignocellulosic: "#3b82f6",
  waste: "#6b7280",
  algae: "#06b6d4",
  bamboo: "#84cc16",
  other: "#9ca3af",
};

// Layer icons
const LAYER_ICONS: Record<MapLayerType, string> = {
  projects: "🌾",
  intentions: "🌱",
  demandSignals: "📍",
  matches: "🔗",
  contracts: "📄",
  deliveries: "🚛",
  priceHeatmap: "💰",
  transportRoutes: "🛤️",
  logisticsHubs: "🏭",
  powerStations: "⚡",
};

interface EntityDetailPanelProps {
  entity: MapEntity;
  userRole: string;
  userId?: string | number;
  supplierId?: number;
  buyerId?: number;
  onClose: () => void;
  onAction?: (action: string, entity: MapEntity) => void;
  className?: string;
}

export function EntityDetailPanel({
  entity,
  userRole,
  userId,
  supplierId,
  buyerId,
  onClose,
  onAction,
  className,
}: EntityDetailPanelProps) {
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showNegotiateModal, setShowNegotiateModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState("");
  const [negotiationOffer, setNegotiationOffer] = useState({
    pricePerTonne: 0,
    volumeTonnes: 0,
    message: "",
  });

  const data = entity.data;

  // Mutations for actions
  //   const expressInterest = trpc.contractMatching.expressInterest?.useMutation({
  //     onSuccess: () => {
  //       setShowInterestModal(false);
  //       onAction?.("interest_expressed", entity);
  //     },
  //   });

  const startNegotiation = trpc.contractMatching.startNegotiation?.useMutation({
    onSuccess: () => {
      setShowNegotiateModal(false);
      onAction?.("negotiation_started", entity);
    },
  });

  const calculateTransport = trpc.transport.calculateRoute?.useQuery(
    {
      origin: { lat: data.latitude, lng: data.longitude },
      destination: { lat: buyerId ? -33.8688 : -25.2744, lng: buyerId ? 151.2093 : 133.7751 },
      feedstockCategory: data.feedstockCategory,
      volumeTonnes: data.projectedVolumeTonnes || data.volumeTonnes || 1000,
    },
    { enabled: showTransportModal }
  );

  // Determine available actions based on entity type and user role
  const getAvailableActions = useCallback(() => {
    const actions: Array<{
      id: string;
      label: string;
      icon: string;
      color: string;
      onClick: () => void;
    }> = [];

    switch (entity.type) {
      case "projects":
      case "intentions":
        if (userRole === "buyer") {
          actions.push({
            id: "express_interest",
            label: "Express Interest",
            icon: "✉️",
            color: "bg-green-600 hover:bg-green-700",
            onClick: () => setShowInterestModal(true),
          });
          actions.push({
            id: "calculate_transport",
            label: "Transport Cost",
            icon: "🚛",
            color: "bg-blue-600 hover:bg-blue-700",
            onClick: () => setShowTransportModal(true),
          });
        }
        if (userRole === "admin" || userRole === "auditor") {
          actions.push({
            id: "view_audit",
            label: "Audit Trail",
            icon: "📋",
            color: "bg-gray-600 hover:bg-gray-700",
            onClick: () => onAction?.("view_audit", entity),
          });
        }
        break;

      case "demandSignals":
        if (userRole === "supplier") {
          actions.push({
            id: "express_interest",
            label: "Can Supply",
            icon: "✅",
            color: "bg-green-600 hover:bg-green-700",
            onClick: () => setShowInterestModal(true),
          });
        }
        break;

      case "matches":
        if (data.status === "SUGGESTED" || data.status === "VIEWED") {
          if (
            (userRole === "buyer" && buyerId === data.buyerId) ||
            (userRole === "supplier" && supplierId === data.supplierId)
          ) {
            actions.push({
              id: "start_negotiation",
              label: "Start Negotiation",
              icon: "💬",
              color: "bg-purple-600 hover:bg-purple-700",
              onClick: () => setShowNegotiateModal(true),
            });
          }
        }
        if (data.status === "NEGOTIATING") {
          actions.push({
            id: "view_negotiation",
            label: "View Negotiation",
            icon: "💬",
            color: "bg-purple-600 hover:bg-purple-700",
            onClick: () => onAction?.("view_negotiation", entity),
          });
        }
        break;

      case "contracts":
        if (
          (userRole === "buyer" && buyerId === data.buyerId) ||
          (userRole === "supplier" && supplierId === data.supplierId) ||
          userRole === "admin"
        ) {
          actions.push({
            id: "view_contract",
            label: "View Contract",
            icon: "📄",
            color: "bg-cyan-600 hover:bg-cyan-700",
            onClick: () => onAction?.("view_contract", entity),
          });
          if (data.status === "ACTIVE" || data.status === "DELIVERING") {
            actions.push({
              id: "schedule_delivery",
              label: "Schedule Delivery",
              icon: "📅",
              color: "bg-amber-600 hover:bg-amber-700",
              onClick: () => onAction?.("schedule_delivery", entity),
            });
          }
        }
        break;

      case "deliveries":
        if (
          userRole === "supplier" &&
          (data.status === "SCHEDULED" || data.status === "IN_TRANSIT")
        ) {
          actions.push({
            id: "update_status",
            label: "Update Status",
            icon: "🔄",
            color: "bg-blue-600 hover:bg-blue-700",
            onClick: () => onAction?.("update_delivery", entity),
          });
        }
        if (userRole === "buyer" && data.status === "DELIVERED") {
          actions.push({
            id: "confirm_delivery",
            label: "Confirm Receipt",
            icon: "✅",
            color: "bg-green-600 hover:bg-green-700",
            onClick: () => onAction?.("confirm_delivery", entity),
          });
        }
        break;

      case "logisticsHubs":
      case "powerStations":
        actions.push({
          id: "view_details",
          label: "View Details",
          icon: "🔍",
          color: "bg-gray-600 hover:bg-gray-700",
          onClick: () => onAction?.("view_details", entity),
        });
        break;
    }

    return actions;
  }, [entity, userRole, userId, supplierId, buyerId, data, onAction]);

  const actions = getAvailableActions();

  // Render entity-specific details
  const renderEntityDetails = () => {
    switch (entity.type) {
      case "projects":
      case "intentions":
        return (
          <div className="space-y-3">
            {data.feedstockCategory && (
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: FEEDSTOCK_COLORS[data.feedstockCategory] || "#9ca3af" }}
                >
                  {data.feedstockCategory}
                </span>
                {data.feedstockType && (
                  <span className="text-sm text-gray-600">{data.feedstockType}</span>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Volume</div>
                <div className="font-semibold">
                  {data.projectedVolumeTonnes?.toLocaleString() || "TBD"} t
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Asking Price</div>
                <div className="font-semibold text-green-600">
                  ${data.askingPricePerTonne || "TBD"}/t
                </div>
              </div>
              {data.availableFromDate && (
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Available From</div>
                  <div className="font-semibold">
                    {new Date(data.availableFromDate).toLocaleDateString("en-AU")}
                  </div>
                </div>
              )}
              {data.harvestEndDate && (
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Harvest End</div>
                  <div className="font-semibold">
                    {new Date(data.harvestEndDate).toLocaleDateString("en-AU")}
                  </div>
                </div>
              )}
            </div>

            {data.expectedQualitySpecs && (
              <div className="bg-blue-50 p-2 rounded text-sm">
                <div className="text-blue-700 font-medium text-xs mb-1">Quality Specs</div>
                <div className="text-blue-900">{data.expectedQualitySpecs}</div>
              </div>
            )}

            {data.deliveryTerms && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Delivery: </span>
                {data.deliveryTerms}
              </div>
            )}
          </div>
        );

      case "demandSignals":
        return (
          <div className="space-y-3">
            {data.feedstockCategory && (
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: FEEDSTOCK_COLORS[data.feedstockCategory] || "#9ca3af" }}
                >
                  {data.feedstockCategory}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Volume Range</div>
                <div className="font-semibold">
                  {data.volumeTonnesMin?.toLocaleString() || "?"} - {data.volumeTonnesMax?.toLocaleString() || "?"} t
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Max Price</div>
                <div className="font-semibold text-blue-600">
                  ${data.maxPricePerTonne || "TBD"}/t
                </div>
              </div>
              {data.deliveryWindowStart && (
                <div className="bg-gray-50 p-2 rounded col-span-2">
                  <div className="text-gray-500 text-xs">Delivery Window</div>
                  <div className="font-semibold">
                    {new Date(data.deliveryWindowStart).toLocaleDateString("en-AU")}
                    {data.deliveryWindowEnd && ` - ${new Date(data.deliveryWindowEnd).toLocaleDateString("en-AU")}`}
                  </div>
                </div>
              )}
            </div>

            {data.qualityRequirements && (
              <div className="bg-blue-50 p-2 rounded text-sm">
                <div className="text-blue-700 font-medium text-xs mb-1">Quality Requirements</div>
                <div className="text-blue-900">{data.qualityRequirements}</div>
              </div>
            )}
          </div>
        );

      case "matches":
        return (
          <div className="space-y-3">
            {data.matchScore && (
              <div className="bg-purple-50 p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-700 font-medium">Match Score</span>
                  <span
                    className={cn(
                      "text-lg font-bold",
                      data.matchScore >= 80 ? "text-green-600" :
                      data.matchScore >= 60 ? "text-amber-600" : "text-red-600"
                    )}
                  >
                    {data.matchScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      data.matchScore >= 80 ? "bg-green-500" :
                      data.matchScore >= 60 ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${data.matchScore}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Matched Volume</div>
                <div className="font-semibold">
                  {data.matchedVolumeTonnes?.toLocaleString() || "?"} t
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Suggested Price</div>
                <div className="font-semibold text-purple-600">
                  ${data.suggestedPrice || "TBD"}/t
                </div>
              </div>
            </div>

            {data.matchReasons && (
              <div className="text-sm">
                <div className="font-medium text-gray-700 mb-1">Match Factors</div>
                <div className="space-y-1">
                  {Object.entries(data.matchReasons).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "contracts":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Contract Value</div>
                <div className="font-semibold text-green-600">
                  ${((data.agreedPricePerTonne || 0) * (data.totalVolumeTonnes || 0)).toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Price/Tonne</div>
                <div className="font-semibold">
                  ${data.agreedPricePerTonne || "TBD"}/t
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Total Volume</div>
                <div className="font-semibold">
                  {data.totalVolumeTonnes?.toLocaleString() || "?"} t
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Delivered</div>
                <div className="font-semibold">
                  {data.deliveredVolumeTonnes?.toLocaleString() || 0} t
                </div>
              </div>
            </div>

            {data.totalVolumeTonnes && data.deliveredVolumeTonnes !== undefined && (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Delivery Progress</span>
                  <span>{((data.deliveredVolumeTonnes / data.totalVolumeTonnes) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: `${(data.deliveredVolumeTonnes / data.totalVolumeTonnes) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case "deliveries":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Volume</div>
                <div className="font-semibold">
                  {data.volumeTonnes?.toLocaleString() || "?"} t
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Transport Mode</div>
                <div className="font-semibold">
                  {data.transportMode || "TBD"}
                </div>
              </div>
              {data.scheduledDate && (
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Scheduled</div>
                  <div className="font-semibold">
                    {new Date(data.scheduledDate).toLocaleDateString("en-AU")}
                  </div>
                </div>
              )}
              {data.estimatedArrival && (
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Est. Arrival</div>
                  <div className="font-semibold">
                    {new Date(data.estimatedArrival).toLocaleDateString("en-AU")}
                  </div>
                </div>
              )}
            </div>

            {data.vehicleId && (
              <div className="text-sm">
                <span className="text-gray-500">Vehicle: </span>
                <span className="font-medium">{data.vehicleId}</span>
              </div>
            )}
          </div>
        );

      case "logisticsHubs":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Hub Type</div>
                <div className="font-semibold">{data.hubType || "Unknown"}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Capacity</div>
                <div className="font-semibold">
                  {data.capacityTonnesPerDay?.toLocaleString() || "?"} t/day
                </div>
              </div>
              {data.handlingCostPerTonne && (
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Handling Cost</div>
                  <div className="font-semibold text-amber-600">
                    ${data.handlingCostPerTonne}/t
                  </div>
                </div>
              )}
              {data.storageCapacityTonnes && (
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Storage</div>
                  <div className="font-semibold">
                    {data.storageCapacityTonnes.toLocaleString()} t
                  </div>
                </div>
              )}
            </div>

            {data.acceptedFeedstockCategories && (
              <div className="flex flex-wrap gap-1">
                {data.acceptedFeedstockCategories.map((cat: string) => (
                  <span
                    key={cat}
                    className="px-2 py-0.5 rounded-full text-xs text-white"
                    style={{ backgroundColor: FEEDSTOCK_COLORS[cat] || "#9ca3af" }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      case "powerStations":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Capacity</div>
                <div className="font-semibold text-red-600">
                  {data.capacityMW || "?"} MW
                </div>
              </div>
              {data.currentOutputMW !== undefined && (
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Current Output</div>
                  <div className="font-semibold text-green-600">
                    {data.currentOutputMW} MW
                  </div>
                </div>
              )}
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500 text-xs">Annual Feedstock</div>
                <div className="font-semibold">
                  {data.annualFeedstockTonnes?.toLocaleString() || "?"} t/yr
                </div>
              </div>
              {data.operator && (
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Operator</div>
                  <div className="font-semibold truncate">{data.operator}</div>
                </div>
              )}
            </div>

            {data.acceptedFeedstockCategories && (
              <div className="flex flex-wrap gap-1">
                {data.acceptedFeedstockCategories.map((cat: string) => (
                  <span
                    key={cat}
                    className="px-2 py-0.5 rounded-full text-xs text-white"
                    style={{ backgroundColor: FEEDSTOCK_COLORS[cat] || "#9ca3af" }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full",
          className
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gray-50 border-b flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{LAYER_ICONS[entity.type]}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{entity.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                {data.status && (
                  <span
                    className="px-2 py-0.5 rounded text-white text-xs font-medium"
                    style={{ backgroundColor: STATUS_COLORS[data.status] || "#9ca3af" }}
                  >
                    {data.status}
                  </span>
                )}
                {data.region && (
                  <span className="text-xs text-gray-500">{data.region}</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-4">{renderEntityDetails()}</div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="px-4 pb-4 pt-0 flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium text-white",
                  action.color
                )}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Express Interest Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {entity.type === "demandSignals" ? "Express Supply Interest" : "Express Buying Interest"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optional)
                </label>
                <textarea
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                  rows={4}
                  placeholder="Add any details about your interest..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowInterestModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // expressInterest.mutate({ entityId: entity.id, message: interestMessage });
                  setShowInterestModal(false);
                  onAction?.("interest_expressed", entity);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Submit Interest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Negotiation Modal */}
      {showNegotiateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Start Negotiation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Offer Price ($/tonne)
                </label>
                <input
                  type="number"
                  value={negotiationOffer.pricePerTonne || ""}
                  onChange={(e) =>
                    setNegotiationOffer((prev) => ({
                      ...prev,
                      pricePerTonne: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volume (tonnes)
                </label>
                <input
                  type="number"
                  value={negotiationOffer.volumeTonnes || ""}
                  onChange={(e) =>
                    setNegotiationOffer((prev) => ({
                      ...prev,
                      volumeTonnes: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="Enter volume"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={negotiationOffer.message}
                  onChange={(e) =>
                    setNegotiationOffer((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                  rows={3}
                  placeholder="Add any terms or conditions..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowNegotiateModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // startNegotiation.mutate({ matchId: entity.id, ...negotiationOffer });
                  setShowNegotiateModal(false);
                  onAction?.("negotiation_started", entity);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transport Cost Modal */}
      {showTransportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Transport Cost Estimate</h3>
            {calculateTransport.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : calculateTransport.data ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-gray-500 text-xs">Distance</div>
                    <div className="font-semibold text-lg">
                      {calculateTransport.data.distanceKm?.toFixed(0)} km
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-gray-500 text-xs">Optimal Mode</div>
                    <div className="font-semibold text-lg">
                      {calculateTransport.data.recommendedMode || "ROAD"}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded col-span-2">
                    <div className="text-blue-700 text-xs">Total Cost</div>
                    <div className="font-bold text-2xl text-blue-600">
                      ${calculateTransport.data.costs?.totalCost?.toFixed(2)}/t
                    </div>
                  </div>
                </div>
                {calculateTransport.data.costs && (
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-2">Cost Breakdown</div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transport</span>
                        <span>${calculateTransport.data.costs.baseCost?.toFixed(2)}/t</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Loading</span>
                        <span>${calculateTransport.data.costs.handlingCost?.toFixed(2)}/t</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Unloading</span>
                        <span>${calculateTransport.data.costs.tollsCost?.toFixed(2)}/t</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                Unable to calculate transport cost
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowTransportModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EntityDetailPanel;
