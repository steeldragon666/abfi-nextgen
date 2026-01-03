/**
 * Carbon Collateral Valuation Module
 *
 * Live ACCU pricing, LVR calculations, and volatility monitoring
 * for institutional lenders managing carbon-backed agricultural loans.
 *
 * Data Sources:
 * - Clean Energy Regulator (ACCU spot prices)
 * - ASX Carbon Market (forward curves)
 * - Portfolio carbon holdings from verified grower contracts
 *
 * Design: Bloomberg Terminal meets APRA regulatory dashboard
 * Colors: Deep Navy (#0A1931), Institutional Gold (#B8860B), Steel Blue (#4682B4)
 * Typography: SF Mono for numerical data, Inter for captions
 */

import React, { useState, useMemo } from "react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ACCUPricing {
  spotPrice: number;
  previousClose: number;
  dayChange: number;
  dayChangePercent: number;
  weekHigh: number;
  weekLow: number;
  monthHigh: number;
  monthLow: number;
  volume: number;
  lastUpdated: string;
  source: string;
}

interface ForwardCurve {
  tenor: string;
  price: number;
  change: number;
  impliedYield: number;
}

interface CarbonHolding {
  id: string;
  projectName: string;
  growerName: string;
  accuBalance: number;
  verifiedDate: string;
  vintageYear: number;
  methodology: string;
  marketValue: number;
  loanExposure: number;
  lvr: number;
  lvrStatus: "healthy" | "caution" | "elevated";
}

interface VolatilityAlert {
  id: string;
  type: "price_spike" | "price_drop" | "volume_surge" | "lvr_breach";
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  priceImpact: number;
  lvrImpact: number;
  acknowledged: boolean;
}

interface PortfolioSummary {
  totalACCUs: number;
  totalMarketValue: number;
  totalLoanExposure: number;
  weightedAvgLVR: number;
  avgVintageYear: number;
  projectCount: number;
}

// ============================================================================
// DESIGN SYSTEM CONSTANTS
// ============================================================================

const COLORS = {
  deepNavy: "#0A1931",
  institutionalGold: "#B8860B",
  steelBlue: "#4682B4",
  panelBg: "#F8F9FA",
  cardBorder: "#E5E7EB",
  textPrimary: "#1A1A2E",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  positive: "#059669",
  negative: "#DC2626",
  warning: "#D97706",
  // LVR status colors (distinct from covenant traffic lights)
  lvrHealthy: "#059669",
  lvrCaution: "#D97706",
  lvrElevated: "#DC2626",
};

const TYPOGRAPHY = {
  mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  serif: "'Georgia', 'Tiempos Headline', serif",
};

// ============================================================================
// MOCK DATA
// ============================================================================

const mockACCUPricing: ACCUPricing = {
  spotPrice: 35.75,
  previousClose: 34.90,
  dayChange: 0.85,
  dayChangePercent: 2.44,
  weekHigh: 36.20,
  weekLow: 33.50,
  monthHigh: 38.10,
  monthLow: 32.80,
  volume: 127450,
  lastUpdated: "2024-01-15T14:32:00+11:00",
  source: "Clean Energy Regulator",
};

const mockForwardCurve: ForwardCurve[] = [
  { tenor: "1M", price: 36.10, change: 0.35, impliedYield: 3.9 },
  { tenor: "3M", price: 37.25, change: 1.50, impliedYield: 4.2 },
  { tenor: "6M", price: 38.90, change: 3.15, impliedYield: 4.4 },
  { tenor: "12M", price: 41.50, change: 5.75, impliedYield: 4.0 },
  { tenor: "24M", price: 45.80, change: 10.05, impliedYield: 3.5 },
];

const mockCarbonHoldings: CarbonHolding[] = [
  {
    id: "CH001",
    projectName: "Darling Downs Solar Farm",
    growerName: "Queensland Cotton Co",
    accuBalance: 125000,
    verifiedDate: "2024-01-10",
    vintageYear: 2023,
    methodology: "Soil Carbon",
    marketValue: 4468750,
    loanExposure: 3200000,
    lvr: 71.6,
    lvrStatus: "healthy",
  },
  {
    id: "CH002",
    projectName: "Moree Grain Collective",
    growerName: "Northern Grains Ltd",
    accuBalance: 89500,
    verifiedDate: "2024-01-08",
    vintageYear: 2023,
    methodology: "Vegetation",
    marketValue: 3199562,
    loanExposure: 2400000,
    lvr: 75.0,
    lvrStatus: "caution",
  },
  {
    id: "CH003",
    projectName: "Riverina Cattle Station",
    growerName: "Southern Pastoral Holdings",
    accuBalance: 67200,
    verifiedDate: "2024-01-12",
    vintageYear: 2022,
    methodology: "Avoided Deforestation",
    marketValue: 2402400,
    loanExposure: 1800000,
    lvr: 74.9,
    lvrStatus: "healthy",
  },
  {
    id: "CH004",
    projectName: "Atherton Tablelands",
    growerName: "FNQ Agri Partners",
    accuBalance: 43800,
    verifiedDate: "2024-01-05",
    vintageYear: 2023,
    methodology: "Soil Carbon",
    marketValue: 1565850,
    loanExposure: 1350000,
    lvr: 86.2,
    lvrStatus: "elevated",
  },
  {
    id: "CH005",
    projectName: "Wimmera Wheat Belt",
    growerName: "Victorian Grain Growers",
    accuBalance: 156700,
    verifiedDate: "2024-01-14",
    vintageYear: 2023,
    methodology: "Soil Carbon",
    marketValue: 5602025,
    loanExposure: 4000000,
    lvr: 71.4,
    lvrStatus: "healthy",
  },
];

const mockVolatilityAlerts: VolatilityAlert[] = [
  {
    id: "VA001",
    type: "price_spike",
    severity: "info",
    message: "ACCU spot price increased 2.44% intraday, above 7-day average volatility",
    timestamp: "2024-01-15T14:30:00+11:00",
    priceImpact: 0.85,
    lvrImpact: -1.7,
    acknowledged: false,
  },
  {
    id: "VA002",
    type: "lvr_breach",
    severity: "warning",
    message: "Atherton Tablelands LVR approaching 90% threshold - monitor closely",
    timestamp: "2024-01-15T09:15:00+11:00",
    priceImpact: 0,
    lvrImpact: 2.3,
    acknowledged: false,
  },
  {
    id: "VA003",
    type: "volume_surge",
    severity: "info",
    message: "Trading volume 45% above 30-day average - increased market activity",
    timestamp: "2024-01-15T11:00:00+11:00",
    priceImpact: 0,
    lvrImpact: 0,
    acknowledged: true,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat("en-AU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

const formatPercent = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getLVRStatusColor = (status: CarbonHolding["lvrStatus"]): string => {
  switch (status) {
    case "healthy":
      return COLORS.lvrHealthy;
    case "caution":
      return COLORS.lvrCaution;
    case "elevated":
      return COLORS.lvrElevated;
  }
};

const getAlertSeverityStyle = (severity: VolatilityAlert["severity"]) => {
  switch (severity) {
    case "critical":
      return { bg: "#FEE2E2", border: "#DC2626", text: "#991B1B" };
    case "warning":
      return { bg: "#FEF3C7", border: "#D97706", text: "#92400E" };
    case "info":
      return { bg: "#DBEAFE", border: "#3B82F6", text: "#1E40AF" };
  }
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

const SpotPricePanel: React.FC<{ pricing: ACCUPricing }> = ({ pricing }) => {
  const isPositive = pricing.dayChange >= 0;

  return (
    <div
      style={{
        background: COLORS.deepNavy,
        borderRadius: "8px",
        padding: "24px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              opacity: 0.7,
              marginBottom: "4px",
            }}
          >
            ACCU Spot Price
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: "42px",
              fontWeight: 600,
              letterSpacing: "-1px",
            }}
          >
            ${pricing.spotPrice.toFixed(2)}
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            padding: "8px 12px",
            background: isPositive
              ? "rgba(5, 150, 105, 0.2)"
              : "rgba(220, 38, 38, 0.2)",
            borderRadius: "6px",
          }}
        >
          <div
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: "18px",
              fontWeight: 600,
              color: isPositive ? "#34D399" : "#F87171",
            }}
          >
            {isPositive ? "+" : ""}${pricing.dayChange.toFixed(2)}
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: "14px",
              color: isPositive ? "#34D399" : "#F87171",
            }}
          >
            {formatPercent(pricing.dayChangePercent)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          paddingTop: "16px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div>
          <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "4px" }}>
            7D High
          </div>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "14px" }}>
            ${pricing.weekHigh.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "4px" }}>
            7D Low
          </div>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "14px" }}>
            ${pricing.weekLow.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "4px" }}>
            Volume
          </div>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "14px" }}>
            {formatNumber(pricing.volume)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "4px" }}>
            Last Update
          </div>
          <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "14px" }}>
            {formatTime(pricing.lastUpdated)}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "16px",
          fontSize: "11px",
          opacity: 0.5,
          fontFamily: TYPOGRAPHY.sans,
        }}
      >
        Source: {pricing.source}
      </div>
    </div>
  );
};

const ForwardCurvePanel: React.FC<{ curve: ForwardCurve[] }> = ({ curve }) => {
  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: "16px",
          fontFamily: TYPOGRAPHY.serif,
        }}
      >
        ACCU Forward Curve
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Tenor", "Price", "Change", "Implied Yield"].map((header) => (
              <th
                key={header}
                style={{
                  textAlign: header === "Tenor" ? "left" : "right",
                  padding: "8px 12px",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: COLORS.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: `1px solid ${COLORS.cardBorder}`,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {curve.map((point) => (
            <tr key={point.tenor}>
              <td
                style={{
                  padding: "10px 12px",
                  fontFamily: TYPOGRAPHY.mono,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                  borderBottom: `1px solid ${COLORS.cardBorder}`,
                }}
              >
                {point.tenor}
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  textAlign: "right",
                  fontFamily: TYPOGRAPHY.mono,
                  fontSize: "13px",
                  color: COLORS.textPrimary,
                  borderBottom: `1px solid ${COLORS.cardBorder}`,
                }}
              >
                ${point.price.toFixed(2)}
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  textAlign: "right",
                  fontFamily: TYPOGRAPHY.mono,
                  fontSize: "13px",
                  color: point.change >= 0 ? COLORS.positive : COLORS.negative,
                  borderBottom: `1px solid ${COLORS.cardBorder}`,
                }}
              >
                +${point.change.toFixed(2)}
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  textAlign: "right",
                  fontFamily: TYPOGRAPHY.mono,
                  fontSize: "13px",
                  color: COLORS.textSecondary,
                  borderBottom: `1px solid ${COLORS.cardBorder}`,
                }}
              >
                {point.impliedYield.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PortfolioSummaryPanel: React.FC<{ summary: PortfolioSummary }> = ({
  summary,
}) => {
  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: "20px",
          fontFamily: TYPOGRAPHY.serif,
        }}
      >
        Carbon Collateral Summary
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              color: COLORS.textSecondary,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Total ACCUs
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: "24px",
              fontWeight: 600,
              color: COLORS.textPrimary,
            }}
          >
            {formatNumber(summary.totalACCUs)}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: "11px",
              color: COLORS.textSecondary,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Market Value
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: "24px",
              fontWeight: 600,
              color: COLORS.institutionalGold,
            }}
          >
            {formatCurrency(summary.totalMarketValue)}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: "11px",
              color: COLORS.textSecondary,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Weighted Avg LVR
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: "24px",
              fontWeight: 600,
              color:
                summary.weightedAvgLVR < 75
                  ? COLORS.lvrHealthy
                  : summary.weightedAvgLVR < 85
                  ? COLORS.lvrCaution
                  : COLORS.lvrElevated,
            }}
          >
            {summary.weightedAvgLVR.toFixed(1)}%
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: "11px",
              color: COLORS.textSecondary,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Loan Exposure
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: "18px",
              fontWeight: 500,
              color: COLORS.textPrimary,
            }}
          >
            {formatCurrency(summary.totalLoanExposure)}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: "11px",
              color: COLORS.textSecondary,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Avg Vintage
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: "18px",
              fontWeight: 500,
              color: COLORS.textPrimary,
            }}
          >
            {summary.avgVintageYear}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: "11px",
              color: COLORS.textSecondary,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Projects
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: "18px",
              fontWeight: 500,
              color: COLORS.textPrimary,
            }}
          >
            {summary.projectCount}
          </div>
        </div>
      </div>
    </div>
  );
};

const HoldingsTable: React.FC<{ holdings: CarbonHolding[] }> = ({
  holdings,
}) => {
  const [sortField, setSortField] = useState<keyof CarbonHolding>("lvr");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedHoldings = useMemo(() => {
    return [...holdings].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [holdings, sortField, sortDirection]);

  const handleSort = (field: keyof CarbonHolding) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const columns: { key: keyof CarbonHolding; label: string; align: string }[] =
    [
      { key: "projectName", label: "Project", align: "left" },
      { key: "growerName", label: "Grower", align: "left" },
      { key: "accuBalance", label: "ACCUs", align: "right" },
      { key: "marketValue", label: "Market Value", align: "right" },
      { key: "loanExposure", label: "Loan Exposure", align: "right" },
      { key: "lvr", label: "LVR", align: "right" },
      { key: "methodology", label: "Methodology", align: "left" },
    ];

  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${COLORS.cardBorder}`,
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: COLORS.textPrimary,
            fontFamily: TYPOGRAPHY.serif,
          }}
        >
          Carbon Holdings by Project
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: COLORS.panelBg }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    textAlign: col.align as any,
                    padding: "12px 16px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: COLORS.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.label}
                  {sortField === col.key && (
                    <span style={{ marginLeft: "4px" }}>
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedHoldings.map((holding, index) => (
              <tr
                key={holding.id}
                style={{
                  background: index % 2 === 0 ? "white" : COLORS.panelBg,
                }}
              >
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: COLORS.textPrimary,
                  }}
                >
                  {holding.projectName}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: "13px",
                    color: COLORS.textSecondary,
                  }}
                >
                  {holding.growerName}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    textAlign: "right",
                    fontFamily: TYPOGRAPHY.mono,
                    fontSize: "13px",
                    color: COLORS.textPrimary,
                  }}
                >
                  {formatNumber(holding.accuBalance)}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    textAlign: "right",
                    fontFamily: TYPOGRAPHY.mono,
                    fontSize: "13px",
                    color: COLORS.textPrimary,
                  }}
                >
                  {formatCurrency(holding.marketValue)}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    textAlign: "right",
                    fontFamily: TYPOGRAPHY.mono,
                    fontSize: "13px",
                    color: COLORS.textPrimary,
                  }}
                >
                  {formatCurrency(holding.loanExposure)}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontFamily: TYPOGRAPHY.mono,
                      fontSize: "13px",
                      fontWeight: 600,
                      color: getLVRStatusColor(holding.lvrStatus),
                    }}
                  >
                    {holding.lvr.toFixed(1)}%
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: "12px",
                    color: COLORS.textSecondary,
                  }}
                >
                  <span
                    style={{
                      background: COLORS.panelBg,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: `1px solid ${COLORS.cardBorder}`,
                    }}
                  >
                    {holding.methodology}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VolatilityAlertPanel: React.FC<{
  alerts: VolatilityAlert[];
  onAcknowledge: (id: string) => void;
}> = ({ alerts, onAcknowledge }) => {
  const unacknowledged = alerts.filter((a) => !a.acknowledged);

  if (unacknowledged.length === 0) {
    return (
      <div
        style={{
          background: "white",
          border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          color: COLORS.textSecondary,
        }}
      >
        <div style={{ fontSize: "24px", marginBottom: "8px" }}>✓</div>
        <div style={{ fontSize: "13px" }}>No active volatility alerts</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${COLORS.cardBorder}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: COLORS.textPrimary,
            fontFamily: TYPOGRAPHY.serif,
          }}
        >
          Volatility Alerts
        </div>
        <div
          style={{
            background: COLORS.warning,
            color: "white",
            fontSize: "11px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "12px",
          }}
        >
          {unacknowledged.length} Active
        </div>
      </div>

      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {unacknowledged.map((alert) => {
          const style = getAlertSeverityStyle(alert.severity);
          return (
            <div
              key={alert.id}
              style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${COLORS.cardBorder}`,
                borderLeft: `4px solid ${style.border}`,
                background: style.bg,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: style.text,
                    fontWeight: 500,
                    flex: 1,
                  }}
                >
                  {alert.message}
                </div>
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  style={{
                    background: "white",
                    border: `1px solid ${COLORS.cardBorder}`,
                    borderRadius: "4px",
                    padding: "4px 10px",
                    fontSize: "11px",
                    cursor: "pointer",
                    marginLeft: "12px",
                    color: COLORS.textSecondary,
                  }}
                >
                  Acknowledge
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  fontSize: "11px",
                  color: COLORS.textSecondary,
                }}
              >
                <span>{formatTime(alert.timestamp)}</span>
                {alert.priceImpact !== 0 && (
                  <span>
                    Price Impact:{" "}
                    <span
                      style={{
                        fontFamily: TYPOGRAPHY.mono,
                        color:
                          alert.priceImpact > 0
                            ? COLORS.positive
                            : COLORS.negative,
                      }}
                    >
                      {alert.priceImpact > 0 ? "+" : ""}$
                      {alert.priceImpact.toFixed(2)}
                    </span>
                  </span>
                )}
                {alert.lvrImpact !== 0 && (
                  <span>
                    LVR Impact:{" "}
                    <span
                      style={{
                        fontFamily: TYPOGRAPHY.mono,
                        color:
                          alert.lvrImpact < 0
                            ? COLORS.positive
                            : COLORS.negative,
                      }}
                    >
                      {alert.lvrImpact > 0 ? "+" : ""}
                      {alert.lvrImpact.toFixed(1)}%
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CarbonCollateralValuation: React.FC = () => {
  const [alerts, setAlerts] = useState(mockVolatilityAlerts);

  const portfolioSummary: PortfolioSummary = useMemo(() => {
    const totalACCUs = mockCarbonHoldings.reduce(
      (sum, h) => sum + h.accuBalance,
      0
    );
    const totalMarketValue = mockCarbonHoldings.reduce(
      (sum, h) => sum + h.marketValue,
      0
    );
    const totalLoanExposure = mockCarbonHoldings.reduce(
      (sum, h) => sum + h.loanExposure,
      0
    );
    const weightedAvgLVR = (totalLoanExposure / totalMarketValue) * 100;
    const avgVintageYear = Math.round(
      mockCarbonHoldings.reduce((sum, h) => sum + h.vintageYear, 0) /
        mockCarbonHoldings.length
    );

    return {
      totalACCUs,
      totalMarketValue,
      totalLoanExposure,
      weightedAvgLVR,
      avgVintageYear,
      projectCount: mockCarbonHoldings.length,
    };
  }, []);

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  return (
    <div
      style={{
        fontFamily: TYPOGRAPHY.sans,
        background: COLORS.panelBg,
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: TYPOGRAPHY.serif,
              fontSize: "28px",
              fontWeight: 600,
              color: COLORS.deepNavy,
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Carbon Collateral Valuation
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: COLORS.textSecondary,
              margin: 0,
            }}
          >
            Real-time ACCU pricing, portfolio LVR monitoring, and volatility
            alerts
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              background: "white",
              border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: "6px",
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: 500,
              color: COLORS.textPrimary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>📊</span> LVR Stress Test
          </button>
          <button
            style={{
              background: COLORS.deepNavy,
              border: "none",
              borderRadius: "6px",
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: 500,
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>↓</span> Export Report
          </button>
        </div>
      </div>

      {/* Top Row: Spot Price + Forward Curve + Alerts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <SpotPricePanel pricing={mockACCUPricing} />
        <ForwardCurvePanel curve={mockForwardCurve} />
        <VolatilityAlertPanel
          alerts={alerts}
          onAcknowledge={handleAcknowledgeAlert}
        />
      </div>

      {/* Portfolio Summary */}
      <div style={{ marginBottom: "20px" }}>
        <PortfolioSummaryPanel summary={portfolioSummary} />
      </div>

      {/* Holdings Table */}
      <HoldingsTable holdings={mockCarbonHoldings} />

      {/* Footer */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px 20px",
          background: "white",
          border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "12px", color: COLORS.textSecondary }}>
          <span style={{ fontWeight: 500 }}>Data Sources:</span> Clean Energy
          Regulator (spot pricing) • ASX Carbon Market (forward curves) •
          Verified Grower Registry (holdings)
        </div>
        <div
          style={{
            fontSize: "11px",
            color: COLORS.textMuted,
            fontFamily: TYPOGRAPHY.mono,
          }}
        >
          Last refresh: {formatTime(mockACCUPricing.lastUpdated)} AEST
        </div>
      </div>
    </div>
  );
};

export default CarbonCollateralValuation;
