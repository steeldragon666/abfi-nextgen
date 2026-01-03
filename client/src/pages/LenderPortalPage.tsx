/**
 * ABFI Lender Portal Page
 *
 * Institutional-grade portfolio monitoring dashboard featuring:
 * - Portfolio Overview with total exposure and health metrics
 * - Portfolio Projects table with traffic-light indicators
 * - Compliance Trend chart
 * - Early Warning System
 *
 * Design: Light theme with gold/navy accents per visual guide
 */

import React, { useState } from "react";

const COLORS = {
  darkNavy: "#0A1931",
  gold: "#B8860B",
  lightGold: "#FFB81C",
  white: "#FFFFFF",
  lightBg: "#F8F9FA",
  cardBg: "#FFFFFF",
  borderColor: "#E5E7EB",
  greenStatus: "#28A745",
  amberStatus: "#FFC107",
  redAlert: "#DC3545",
  textPrimary: "#1F2937",
  textMuted: "#6B7280",
  blueAccent: "#003DA5",
};

interface Project {
  name: string;
  sector: string;
  exposure: string;
  supplySecurityStatus: "Stable" | "High" | "Low";
  supplySecurityColor: string;
  concentrationRisk: "Moderate" | "Low" | "High";
  concentrationColor: string;
  counterpartyQuality: string;
  counterpartyColor: string;
}

const projects: Project[] = [
  {
    name: "Northern Bioenergy",
    sector: "Bioenergy",
    exposure: "$150M",
    supplySecurityStatus: "Stable",
    supplySecurityColor: COLORS.greenStatus,
    concentrationRisk: "Moderate",
    concentrationColor: COLORS.amberStatus,
    counterpartyQuality: "Strong, A+ Rated",
    counterpartyColor: COLORS.greenStatus,
  },
  {
    name: "Western Biomass",
    sector: "Biomass",
    exposure: "$300M",
    supplySecurityStatus: "High",
    supplySecurityColor: COLORS.greenStatus,
    concentrationRisk: "Low",
    concentrationColor: COLORS.greenStatus,
    counterpartyQuality: "Satisfactory, BBB Rated",
    counterpartyColor: COLORS.amberStatus,
  },
];

const complianceData = [
  { month: "J", value: 92 },
  { month: "F", value: 91 },
  { month: "M", value: 93 },
  { month: "A", value: 90 },
  { month: "M", value: 89 },
  { month: "J", value: 92 },
  { month: "J", value: 94 },
  { month: "A", value: 93 },
  { month: "S", value: 91 },
  { month: "O", value: 94 },
  { month: "N", value: 95 },
  { month: "D", value: 96 },
];

const creditRatings = [
  { rating: "AAA", percentage: 5 },
  { rating: "AA", percentage: 12 },
  { rating: "A", percentage: 25 },
  { rating: "BBB", percentage: 36 },
  { rating: "BB", percentage: 12 },
  { rating: "B", percentage: 6 },
  { rating: "C", percentage: 4 },
];

const watchlistAlerts = [
  { supplier: "Supplier X", alert: "Downgrade to BB", severity: "high" },
  { supplier: "Supplier Y", alert: "Outlook Negative", severity: "medium" },
  { supplier: "Supplier Z", alert: "Under Review", severity: "low" },
];

export default function LenderPortalPage() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "risk" | "early-warning">("portfolio");

  return (
    <div style={{ minHeight: "100vh", background: COLORS.lightBg }}>
      {/* Header */}
      <header
        style={{
          background: COLORS.white,
          borderBottom: `1px solid ${COLORS.borderColor}`,
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: COLORS.gold,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={COLORS.white}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={{ color: COLORS.darkNavy, fontSize: "18px", fontWeight: 600 }}>
            ABFI Lender Portal
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            style={{
              background: COLORS.gold,
              color: COLORS.white,
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Generate Lender Package
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </button>
        </div>
      </header>

      <main style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Page Title */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: COLORS.darkNavy,
            marginBottom: "24px",
            fontFamily: "'Georgia', serif",
          }}
        >
          <span style={{ color: COLORS.gold }}>Portfolio Overview</span> Dashboard
        </h1>

        {/* Top Stats Row */}
        <div
          style={{
            background: COLORS.white,
            borderRadius: "12px",
            padding: "16px 24px",
            marginBottom: "24px",
            border: `1px solid ${COLORS.borderColor}`,
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: COLORS.textMuted, fontSize: "13px" }}>Total Exposure:</span>
            <span style={{ color: COLORS.gold, fontSize: "20px", fontWeight: 700 }}>$450M</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.redAlert} strokeWidth="2">
              <path d="M7 7l9.2 9.2M7 7v10M7 7h10" />
            </svg>
          </div>
          <div style={{ width: "1px", height: "24px", background: COLORS.borderColor }} />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.darkNavy}>
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span style={{ color: COLORS.textMuted, fontSize: "13px" }}>Active Projects:</span>
            <span style={{ color: COLORS.darkNavy, fontSize: "20px", fontWeight: 700 }}>3</span>
          </div>
          <div style={{ width: "1px", height: "24px", background: COLORS.borderColor }} />
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: COLORS.greenStatus,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.white} strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <span style={{ color: COLORS.textMuted, fontSize: "13px" }}>Portfolio Health:</span>
            <span style={{ color: COLORS.greenStatus, fontSize: "18px", fontWeight: 700, fontStyle: "italic" }}>Strong</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
          {/* Left Column - Portfolio Projects */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: "12px",
              padding: "24px",
              border: `1px solid ${COLORS.borderColor}`,
            }}
          >
            <h2 style={{ color: COLORS.darkNavy, fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>
              Portfolio Projects
            </h2>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${COLORS.borderColor}` }}>
                  {["Project Name", "Sector", "Exposure ($M)", "Supply Security", "Concentration Risk", "Counterparty Quality"].map((header) => (
                    <th
                      key={header}
                      style={{
                        color: COLORS.textPrimary,
                        fontSize: "12px",
                        fontWeight: 600,
                        textAlign: "left",
                        padding: "12px 8px",
                        background: COLORS.lightBg,
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={index} style={{ borderBottom: `1px solid ${COLORS.borderColor}` }}>
                    <td style={{ color: COLORS.textPrimary, padding: "16px 8px", fontSize: "14px", fontWeight: 500 }}>
                      {project.name}
                    </td>
                    <td style={{ color: COLORS.textMuted, padding: "16px 8px", fontSize: "14px" }}>
                      {project.sector}
                    </td>
                    <td style={{ color: COLORS.textPrimary, padding: "16px 8px", fontSize: "14px", fontWeight: 600 }}>
                      {project.exposure}
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: project.supplySecurityColor,
                          }}
                        />
                        <span style={{ color: COLORS.textPrimary, fontSize: "13px" }}>{project.supplySecurityStatus}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "0",
                            height: "0",
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderBottom: `12px solid ${project.concentrationColor}`,
                          }}
                        />
                        <span style={{ color: COLORS.textPrimary, fontSize: "13px" }}>{project.concentrationRisk}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: project.counterpartyColor,
                          }}
                        />
                        <span style={{ color: COLORS.textPrimary, fontSize: "13px" }}>{project.counterpartyQuality}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Legend */}
            <div style={{ marginTop: "20px", display: "flex", gap: "24px", paddingTop: "16px", borderTop: `1px solid ${COLORS.borderColor}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS.darkNavy }} />
                <span style={{ color: COLORS.textMuted, fontSize: "11px" }}>Real-time Covenant Tracking</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS.greenStatus }} />
                <span style={{ color: COLORS.textMuted, fontSize: "11px" }}>Traffic-Light Indicators</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS.gold }} />
                <span style={{ color: COLORS.textMuted, fontSize: "11px" }}>Drill-Down Analytics</span>
              </div>
            </div>
          </div>

          {/* Right Column - Compliance Trend */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: "12px",
              padding: "24px",
              border: `1px solid ${COLORS.borderColor}`,
            }}
          >
            <h2 style={{ color: COLORS.gold, fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
              Compliance Trend (Last 12 Months)
            </h2>

            {/* Chart */}
            <div style={{ height: "180px", position: "relative", marginTop: "20px" }}>
              {/* Y-axis */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: COLORS.textMuted, fontSize: "10px" }}>
                <span>100%</span>
                <span>95%</span>
                <span>90%</span>
                <span>85%</span>
                <span>80%</span>
              </div>

              {/* Chart area */}
              <div style={{ marginLeft: "35px", height: "160px", position: "relative" }}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((pos) => (
                  <div
                    key={pos}
                    style={{
                      position: "absolute",
                      top: `${pos}%`,
                      left: 0,
                      right: 0,
                      borderTop: `1px solid ${COLORS.borderColor}`,
                    }}
                  />
                ))}

                {/* Line chart */}
                <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="complianceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={COLORS.gold} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0 ${160 - (complianceData[0].value - 80) * 8} ${complianceData.map((d, i) => `L ${(i / 11) * 100}% ${160 - (d.value - 80) * 8}`).join(" ")} V 160 H 0 Z`}
                    fill="url(#complianceGradient)"
                  />
                  <path
                    d={`M 0 ${160 - (complianceData[0].value - 80) * 8} ${complianceData.map((d, i) => `L ${(i / 11) * 100}% ${160 - (d.value - 80) * 8}`).join(" ")}`}
                    fill="none"
                    stroke={COLORS.gold}
                    strokeWidth="2"
                  />
                  {/* End point */}
                  <circle
                    cx="100%"
                    cy={160 - (complianceData[11].value - 80) * 8}
                    r="4"
                    fill={COLORS.gold}
                  />
                </svg>

                {/* 96% label */}
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    top: `${160 - (96 - 80) * 8 - 20}px`,
                    color: COLORS.greenStatus,
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  96%
                </div>
              </div>

              {/* X-axis */}
              <div style={{ marginLeft: "35px", display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                {complianceData.map((d, i) => (
                  <span key={i} style={{ color: COLORS.textMuted, fontSize: "9px" }}>
                    {d.month}
                  </span>
                ))}
              </div>
            </div>

            <p style={{ color: COLORS.textMuted, fontSize: "12px", marginTop: "16px", lineHeight: 1.5 }}>
              Overall compliance remains strong, consistently above 95% threshold.
              Minor deviations noted in Q3 are being addressed.
            </p>
          </div>
        </div>

        {/* Early Warning Section */}
        <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Counterparty Quality */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: "12px",
              padding: "24px",
              border: `1px solid ${COLORS.borderColor}`,
            }}
          >
            <h2 style={{ color: COLORS.darkNavy, fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>
              Supplier Credit Quality Dashboard
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* Rating Distribution */}
              <div>
                <h3 style={{ color: COLORS.textPrimary, fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>
                  Supplier Credit Rating Distribution
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {creditRatings.map((item) => (
                    <div key={item.rating} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "30px", color: COLORS.textPrimary, fontSize: "11px", fontWeight: 500 }}>
                        {item.rating}
                      </span>
                      <div style={{ flex: 1, height: "16px", background: COLORS.lightBg, borderRadius: "2px", overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${item.percentage * 2}%`,
                            height: "100%",
                            background: item.rating.startsWith("A") || item.rating === "BBB"
                              ? COLORS.darkNavy
                              : COLORS.textMuted,
                          }}
                        />
                      </div>
                      <span style={{ width: "30px", color: COLORS.textMuted, fontSize: "10px" }}>
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Investment Grade Threshold */}
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    background: "#F0FDF4",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: COLORS.greenStatus, fontSize: "24px", fontWeight: 700 }}>
                    78% <span style={{ fontSize: "14px", fontWeight: 500 }}>Investment Grade</span>
                  </div>
                  <div style={{ color: COLORS.textMuted, fontSize: "11px", marginTop: "4px" }}>
                    (Compliant with &gt;70% Covenant)
                  </div>
                </div>
              </div>

              {/* Credit Watchlist */}
              <div>
                <h3 style={{ color: COLORS.textPrimary, fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>
                  Credit Watchlist Alerts
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {watchlistAlerts.map((alert, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "10px 12px",
                        background: alert.severity === "high" ? "#FEF2F2" : alert.severity === "medium" ? "#FFFBEB" : COLORS.lightBg,
                        borderRadius: "6px",
                        borderLeft: `3px solid ${alert.severity === "high" ? COLORS.redAlert : alert.severity === "medium" ? COLORS.amberStatus : COLORS.textMuted}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={alert.severity === "high" ? COLORS.redAlert : alert.severity === "medium" ? COLORS.amberStatus : COLORS.textMuted}>
                        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      </svg>
                      <div>
                        <span style={{ color: COLORS.textPrimary, fontSize: "12px", fontWeight: 500 }}>
                          {alert.supplier}:
                        </span>
                        <span style={{ color: COLORS.textMuted, fontSize: "12px", marginLeft: "4px" }}>
                          {alert.alert}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Due Diligence */}
                <div style={{ marginTop: "16px" }}>
                  <h3 style={{ color: COLORS.textPrimary, fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>
                    Due Diligence Log: Automated Checks
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {[
                      { label: "ASIC Status", status: "Active" },
                      { label: "ABR Verification", status: "Valid" },
                      { label: "Credit Score", status: "Stable" },
                    ].map((check, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: COLORS.greenStatus,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={COLORS.white} strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                        <span style={{ color: COLORS.textPrimary, fontSize: "12px" }}>
                          <strong>{check.label}:</strong> {check.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Early Warning System */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: "12px",
              padding: "24px",
              border: `1px solid ${COLORS.borderColor}`,
            }}
          >
            <h2 style={{ color: COLORS.darkNavy, fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>
              Early Warning Alert
            </h2>

            {/* Alert Banner */}
            <div
              style={{
                background: "#FEF3C7",
                border: `1px solid ${COLORS.amberStatus}`,
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={COLORS.amberStatus}>
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
              <span style={{ color: COLORS.textPrimary, fontSize: "14px", fontWeight: 600 }}>
                Potential Covenant Breach Detected
              </span>
            </div>

            {/* 90-Day Forecast */}
            <h3 style={{ color: COLORS.textPrimary, fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>
              90-Day Forecast
            </h3>

            <div style={{ height: "120px", position: "relative", marginBottom: "16px" }}>
              {/* Y-axis */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: COLORS.textMuted, fontSize: "9px", lineHeight: 1 }}>
                <span>100</span>
                <span>0</span>
              </div>

              {/* Chart */}
              <div style={{ marginLeft: "25px", height: "100px", position: "relative", background: COLORS.lightBg, borderRadius: "4px" }}>
                {/* Covenant threshold line */}
                <div
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: 0,
                    right: 0,
                    borderTop: `2px dashed ${COLORS.redAlert}`,
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "28%",
                    right: "4px",
                    color: COLORS.redAlert,
                    fontSize: "9px",
                    transform: "translateY(-100%)",
                  }}
                >
                  Covenant Breach Threshold
                </span>

                {/* Forecast line */}
                <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                  <path
                    d="M 0 20 Q 50 25, 100 35 T 180 55 T 280 70"
                    fill="none"
                    stroke={COLORS.blueAccent}
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* X-axis labels */}
              <div style={{ marginLeft: "25px", display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ color: COLORS.textMuted, fontSize: "9px" }}>Current</span>
                <span style={{ color: COLORS.textMuted, fontSize: "9px" }}>Oct 2024</span>
                <span style={{ color: COLORS.textMuted, fontSize: "9px" }}>Nov 2024</span>
                <span style={{ color: COLORS.textMuted, fontSize: "9px" }}>Dec 2024</span>
                <span style={{ color: COLORS.textMuted, fontSize: "9px" }}>Apr 17</span>
              </div>
            </div>

            {/* Risk Factors & Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <h4 style={{ color: COLORS.textPrimary, fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                  Key Risk Factors
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={COLORS.redAlert}>
                      <path d="M12 19V5M5 12l7-7 7 7" transform="rotate(180 12 12)" />
                    </svg>
                    <span style={{ color: COLORS.textMuted, fontSize: "11px" }}>Declining Contracted Volumes</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={COLORS.amberStatus}>
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span style={{ color: COLORS.textMuted, fontSize: "11px" }}>Supplier Non-Renewals</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={COLORS.amberStatus}>
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <span style={{ color: COLORS.textMuted, fontSize: "11px" }}>Drought Forecast</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ color: COLORS.textPrimary, fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                  Recommended Action
                </h4>
                <button
                  style={{
                    background: COLORS.gold,
                    color: COLORS.white,
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Review Supplier Mix
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
