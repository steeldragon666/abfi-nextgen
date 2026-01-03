/**
 * ABFI Grower Portal Page
 *
 * Dashboard for Queensland farmers featuring:
 * - Active Contracts table
 * - Earnings Summary (YTD)
 * - Delivery Calendar
 * - Market Intelligence with Regional Pricing Trends
 *
 * Design: Dark navy theme with gold accents per visual guide
 */

import React, { useState } from "react";

const COLORS = {
  darkNavy: "#0A1931",
  gold: "#FFB81C",
  darkGold: "#B8860B",
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  cardBg: "#1A2942",
  borderColor: "#2D3F5A",
  greenStatus: "#28A745",
  amberStatus: "#FFC107",
  textMuted: "#94A3B8",
};

interface Contract {
  id: string;
  feedstockType: string;
  volume: number;
  status: "In Progress" | "Scheduled" | "Completed";
  dueDate: string;
}

const contracts: Contract[] = [
  { id: "CTR-2301", feedstockType: "Wheat Straw", volume: 500, status: "In Progress", dueDate: "Oct 25" },
  { id: "CTR-2302", feedstockType: "Corn Stover", volume: 350, status: "Scheduled", dueDate: "Nov 10" },
  { id: "CTR-2303", feedstockType: "Sugarcane Bagasse", volume: 700, status: "In Progress", dueDate: "Nov 18" },
];

const calendarDays = {
  october: [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, null, null],
  ],
  november: [
    [null, null, null, null, null, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
  ],
};

const pricingData = [
  { month: "Last", feedstock: 45, carbon: 18 },
  { month: "6 months", feedstock: 65, carbon: 22 },
];

export default function GrowerPortalPage() {
  const [selectedMonth] = useState<"october" | "november">("october");

  const totalVolume = contracts.reduce((sum, c) => sum + c.volume, 0);

  const getStatusStyle = (status: Contract["status"]) => {
    switch (status) {
      case "In Progress":
        return { background: "#10472A", color: COLORS.greenStatus };
      case "Scheduled":
        return { background: "#3D3314", color: COLORS.amberStatus };
      default:
        return { background: COLORS.cardBg, color: COLORS.textMuted };
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.darkNavy }}>
      {/* Header */}
      <header
        style={{
          background: COLORS.darkNavy,
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
              fontWeight: 700,
              color: COLORS.darkNavy,
              fontSize: "14px",
            }}
          >
            A
          </div>
          <span style={{ color: COLORS.white, fontSize: "18px", fontWeight: 600 }}>
            ABFI Grower Portal
          </span>
        </div>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: `2px solid ${COLORS.borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.textMuted,
            cursor: "pointer",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Active Contracts */}
            <div
              style={{
                background: COLORS.cardBg,
                borderRadius: "12px",
                padding: "20px",
                border: `1px solid ${COLORS.borderColor}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ color: COLORS.gold, fontSize: "16px", fontWeight: 600, margin: 0 }}>
                  Active Contracts
                </h2>
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    color: COLORS.textMuted,
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  ...
                </button>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.borderColor}` }}>
                    {["Contract ID", "Feedstock Type", "Volume (Tonnes)", "Status", "Due Date"].map((header) => (
                      <th
                        key={header}
                        style={{
                          color: COLORS.textMuted,
                          fontSize: "12px",
                          fontWeight: 500,
                          textAlign: "left",
                          padding: "12px 8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} style={{ borderBottom: `1px solid ${COLORS.borderColor}` }}>
                      <td style={{ color: COLORS.white, padding: "14px 8px", fontSize: "14px" }}>
                        {contract.id}
                      </td>
                      <td style={{ color: COLORS.white, padding: "14px 8px", fontSize: "14px" }}>
                        {contract.feedstockType}
                      </td>
                      <td style={{ color: COLORS.white, padding: "14px 8px", fontSize: "14px" }}>
                        {contract.volume}
                      </td>
                      <td style={{ padding: "14px 8px" }}>
                        <span
                          style={{
                            ...getStatusStyle(contract.status),
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 500,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {contract.status === "In Progress" && (
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: COLORS.greenStatus }} />
                          )}
                          {contract.status === "Scheduled" && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                          )}
                          {contract.status}
                        </span>
                      </td>
                      <td style={{ color: COLORS.white, padding: "14px 8px", fontSize: "14px" }}>
                        {contract.dueDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: "16px", color: COLORS.textMuted, fontSize: "13px" }}>
                Total Active Volume: <span style={{ color: COLORS.white, fontWeight: 600 }}>{totalVolume.toLocaleString()} Tonnes</span>
              </div>
            </div>

            {/* Delivery Calendar */}
            <div
              style={{
                background: COLORS.cardBg,
                borderRadius: "12px",
                padding: "20px",
                border: `1px solid ${COLORS.borderColor}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ color: COLORS.white, fontSize: "16px", fontWeight: 600, margin: 0 }}>
                  Delivery Calendar
                </h2>
                <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>...</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* October */}
                <div>
                  <h3 style={{ color: COLORS.white, fontSize: "14px", fontWeight: 500, marginBottom: "12px" }}>
                    October 2024
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <div
                        key={i}
                        style={{
                          color: COLORS.textMuted,
                          fontSize: "11px",
                          textAlign: "center",
                          padding: "4px",
                        }}
                      >
                        {day}
                      </div>
                    ))}
                    {calendarDays.october.flat().map((day, i) => (
                      <div
                        key={i}
                        style={{
                          color: day === 25 ? COLORS.darkNavy : day ? COLORS.white : "transparent",
                          fontSize: "12px",
                          textAlign: "center",
                          padding: "6px",
                          borderRadius: "4px",
                          background: day === 25 ? COLORS.gold : "transparent",
                          fontWeight: day === 25 ? 600 : 400,
                        }}
                      >
                        {day || ""}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "8px", height: "8px", background: COLORS.gold, borderRadius: "2px" }} />
                    <span style={{ color: COLORS.textMuted, fontSize: "11px" }}>Wheat Straw Delivery</span>
                  </div>
                </div>

                {/* November */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h3 style={{ color: COLORS.white, fontSize: "14px", fontWeight: 500, margin: 0 }}>
                      November 2024
                    </h3>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>{"<"}</button>
                      <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>{">"}</button>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <div
                        key={i}
                        style={{
                          color: COLORS.textMuted,
                          fontSize: "11px",
                          textAlign: "center",
                          padding: "4px",
                        }}
                      >
                        {day}
                      </div>
                    ))}
                    {calendarDays.november.flat().map((day, i) => {
                      const isDelivery = day === 10 || day === 18;
                      const isCornDelivery = day === 10;
                      const isCarbonCredit = day === 19;
                      return (
                        <div
                          key={i}
                          style={{
                            color: isDelivery || isCarbonCredit ? COLORS.darkNavy : day ? COLORS.white : "transparent",
                            fontSize: "12px",
                            textAlign: "center",
                            padding: "6px",
                            borderRadius: "4px",
                            background: isCornDelivery ? COLORS.gold : isCarbonCredit ? COLORS.greenStatus : isDelivery ? COLORS.gold : "transparent",
                            fontWeight: isDelivery || isCarbonCredit ? 600 : 400,
                          }}
                        >
                          {day || ""}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "8px", height: "8px", background: COLORS.gold, borderRadius: "2px" }} />
                      <span style={{ color: COLORS.textMuted, fontSize: "11px" }}>Corn Stover Delivery</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "8px", height: "8px", background: COLORS.greenStatus, borderRadius: "2px" }} />
                      <span style={{ color: COLORS.textMuted, fontSize: "11px" }}>Carbon Credit Verification</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Earnings Summary */}
            <div
              style={{
                background: COLORS.cardBg,
                borderRadius: "12px",
                padding: "20px",
                border: `1px solid ${COLORS.borderColor}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ color: COLORS.gold, fontSize: "16px", fontWeight: 600, margin: 0 }}>
                  Earnings Summary (YTD)
                </h2>
              </div>

              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: COLORS.gold,
                  marginBottom: "20px",
                  fontFamily: "'SF Mono', 'Monaco', monospace",
                }}
              >
                $125,500.00 <span style={{ fontSize: "18px", fontWeight: 500 }}>AUD</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: COLORS.textMuted, fontSize: "14px" }}>Feedstock: $95,000.00</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "100px", height: "6px", background: COLORS.borderColor, borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "76%", height: "100%", background: COLORS.gold }} />
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.greenStatus} strokeWidth="2">
                      <path d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: COLORS.textMuted, fontSize: "14px" }}>Carbon Credits: $30,500.00</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "100px", height: "6px", background: COLORS.borderColor, borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: "24%", height: "100%", background: COLORS.greenStatus }} />
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.greenStatus} strokeWidth="2">
                      <path d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </div>
                </div>
              </div>

              <p style={{ color: COLORS.textMuted, fontSize: "13px", marginTop: "16px", lineHeight: 1.5 }}>
                Your farm's revenue stream is growing. Feedstock contribution is significant.
              </p>
            </div>

            {/* Market Intelligence */}
            <div
              style={{
                background: COLORS.cardBg,
                borderRadius: "12px",
                padding: "20px",
                border: `1px solid ${COLORS.borderColor}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ color: COLORS.white, fontSize: "16px", fontWeight: 600, margin: 0 }}>
                  Market Intelligence
                </h2>
                <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>...</button>
              </div>

              <h3 style={{ color: COLORS.textMuted, fontSize: "12px", fontWeight: 500, marginBottom: "8px" }}>
                Regional Pricing Trends
              </h3>

              <div style={{ display: "flex", gap: "16px", marginBottom: "12px", fontSize: "11px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "12px", height: "3px", background: COLORS.gold }} />
                  <span style={{ color: COLORS.textMuted }}>Feedstock Price (AUD/Tonne)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "12px", height: "3px", background: COLORS.greenStatus }} />
                  <span style={{ color: COLORS.textMuted }}>Carbon Credit Price (AUD/Tonne)</span>
                </div>
              </div>

              <div style={{ position: "relative", height: "120px", marginBottom: "8px" }}>
                {/* Y-axis labels */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: COLORS.textMuted, fontSize: "10px" }}>
                  <span>$60</span>
                  <span>$40</span>
                  <span>$20</span>
                  <span>0</span>
                </div>

                {/* Chart area */}
                <div style={{ marginLeft: "35px", height: "100%", position: "relative" }}>
                  {/* Grid lines */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, borderTop: `1px dashed ${COLORS.borderColor}` }} />
                  <div style={{ position: "absolute", top: "33%", left: 0, right: 0, borderTop: `1px dashed ${COLORS.borderColor}` }} />
                  <div style={{ position: "absolute", top: "66%", left: 0, right: 0, borderTop: `1px dashed ${COLORS.borderColor}` }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: `1px dashed ${COLORS.borderColor}` }} />

                  {/* Current prices annotation */}
                  <div style={{ position: "absolute", right: "20px", top: "10px" }}>
                    <div style={{ color: COLORS.gold, fontSize: "11px", fontWeight: 600 }}>
                      Current Feedstock: $65/T
                    </div>
                  </div>
                  <div style={{ position: "absolute", right: "20px", top: "55px" }}>
                    <div style={{ color: COLORS.greenStatus, fontSize: "11px", fontWeight: 600 }}>
                      Current Carbon Credits: $22/T
                    </div>
                  </div>

                  {/* Simplified line representation */}
                  <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                    {/* Feedstock line */}
                    <path
                      d="M 20 80 Q 100 70, 180 30"
                      fill="none"
                      stroke={COLORS.gold}
                      strokeWidth="2"
                    />
                    {/* Carbon credit line */}
                    <path
                      d="M 20 95 Q 100 90, 180 65"
                      fill="none"
                      stroke={COLORS.greenStatus}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "35px", color: COLORS.textMuted, fontSize: "10px" }}>
                <span>Last</span>
                <span>6 months</span>
              </div>

              <p style={{ color: COLORS.greenStatus, fontSize: "12px", marginTop: "12px" }}>
                Both markets show favorable upward trends in your region.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
