/**
 * ABFI Developer Portal Page
 *
 * Supply Operations Dashboard for bioenergy project developers featuring:
 * - Scheduled Deliveries timeline
 * - Quality Control panel (weighbridge integration)
 * - Alerts panel
 * - Market Intelligence & Forecasting
 *
 * Design: Dark theme with gold accents per visual guide
 */

import React from "react";

const COLORS = {
  darkNavy: "#0A1931",
  darkerBg: "#0D1520",
  gold: "#FFB81C",
  darkGold: "#B8860B",
  white: "#FFFFFF",
  cardBg: "#1A2942",
  borderColor: "#2D3F5A",
  greenStatus: "#28A745",
  blueStatus: "#3B82F6",
  amberStatus: "#FFC107",
  redAlert: "#DC3545",
  textMuted: "#94A3B8",
};

interface Delivery {
  time: string;
  id: string;
  status: "In Transit" | "Delivered" | "Pending";
}

const deliveries: Delivery[] = [
  { time: "08:00 AM", id: "Delivery 101", status: "In Transit" },
  { time: "10:30 AM", id: "Delivery 102", status: "Delivered" },
  { time: "12:00 PM", id: "Delivery 103", status: "Pending" },
];

const qualityData = [
  { widget: "Moisture", data: "14%", icon: "droplet" },
  { widget: "Ash Content", data: "2%", icon: "sparkle" },
];

const monthlySupplyData = [
  { month: "Jan", value: 20 },
  { month: "Feb", value: 25 },
  { month: "Mar", value: 30 },
  { month: "Apr", value: 35 },
  { month: "May", value: 45 },
  { month: "Jun", value: 55 },
  { month: "Jul", value: 70 },
  { month: "Aug", value: 85 },
  { month: "Sep", value: 95 },
  { month: "Oct", value: 100 },
  { month: "Nov", value: 90 },
  { month: "Dec", value: 80 },
];

export default function DeveloperPortalPage() {
  const getStatusConfig = (status: Delivery["status"]) => {
    switch (status) {
      case "In Transit":
        return { color: COLORS.blueStatus, bg: "#1E3A5F", icon: "truck" };
      case "Delivered":
        return { color: COLORS.greenStatus, bg: "#10472A", icon: "check" };
      case "Pending":
        return { color: COLORS.amberStatus, bg: "#3D3314", icon: "clock" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.darkerBg }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={COLORS.gold}>
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
            </svg>
            <span style={{ color: COLORS.white, fontSize: "16px", fontWeight: 600 }}>
              Supply Operations Dashboard
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <div style={{ position: "relative" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                width: "8px",
                height: "8px",
                background: COLORS.gold,
                borderRadius: "50%",
              }}
            />
          </div>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: COLORS.gold,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={COLORS.darkNavy}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </header>

      <main style={{ padding: "24px 32px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Top Section - Operations Dashboard */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.darkNavy} 0%, #1A2942 100%)`,
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
            border: `1px solid ${COLORS.borderColor}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background map visualization placeholder */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.15,
              background: `radial-gradient(circle at 30% 50%, ${COLORS.blueStatus} 0%, transparent 50%)`,
            }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", position: "relative", zIndex: 1 }}>
            {/* Left - Scheduled Deliveries */}
            <div>
              <div
                style={{
                  background: COLORS.cardBg,
                  borderRadius: "12px",
                  padding: "20px",
                  border: `1px solid ${COLORS.borderColor}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ color: COLORS.white, fontSize: "16px", fontWeight: 600, margin: 0 }}>
                    Scheduled Deliveries
                  </h2>
                  <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>...</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {deliveries.map((delivery, index) => {
                    const config = getStatusConfig(delivery.status);
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <span style={{ color: COLORS.textMuted, fontSize: "13px", minWidth: "70px" }}>
                          {delivery.time}
                        </span>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: config.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {config.icon === "truck" && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2">
                              <rect x="1" y="3" width="15" height="13" rx="2" />
                              <path d="M16 8h4l3 5v5h-7V8z" />
                              <circle cx="5.5" cy="18.5" r="2.5" />
                              <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                          )}
                          {config.icon === "check" && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                          {config.icon === "clock" && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <span style={{ color: COLORS.white, fontSize: "14px" }}>
                            {delivery.id}:{" "}
                          </span>
                          <span style={{ color: config.color, fontSize: "14px" }}>
                            {delivery.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right - Quality Control & Alerts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Quality Control */}
              <div
                style={{
                  background: COLORS.cardBg,
                  borderRadius: "12px",
                  padding: "16px",
                  border: `1px solid ${COLORS.borderColor}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ color: COLORS.white, fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    Quality Control
                  </h3>
                  <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: "14px" }}>...</button>
                </div>
                <p style={{ color: COLORS.textMuted, fontSize: "11px", marginBottom: "12px" }}>
                  Real time from weighbridge integration
                </p>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.borderColor}` }}>
                      <th style={{ color: COLORS.textMuted, fontSize: "11px", textAlign: "left", padding: "8px 0", fontWeight: 500 }}>
                        Widget
                      </th>
                      <th style={{ color: COLORS.textMuted, fontSize: "11px", textAlign: "right", padding: "8px 0", fontWeight: 500 }}>
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualityData.map((item, index) => (
                      <tr key={index} style={{ borderBottom: `1px solid ${COLORS.borderColor}` }}>
                        <td style={{ padding: "10px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                          {item.icon === "droplet" && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.blueStatus}>
                              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                          )}
                          {item.icon === "sparkle" && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.amberStatus}>
                              <path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3z" />
                            </svg>
                          )}
                          <span style={{ color: COLORS.white, fontSize: "13px" }}>{item.widget}</span>
                        </td>
                        <td style={{ color: COLORS.white, fontSize: "13px", textAlign: "right", padding: "10px 0" }}>
                          {item.data}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Alerts */}
              <div
                style={{
                  background: COLORS.cardBg,
                  borderRadius: "12px",
                  padding: "16px",
                  border: `1px solid ${COLORS.borderColor}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ color: COLORS.white, fontSize: "14px", fontWeight: 600, margin: 0 }}>
                    Alerts
                  </h3>
                  <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: "14px" }}>...</button>
                </div>

                <div
                  style={{
                    background: "#3D2020",
                    borderRadius: "8px",
                    padding: "12px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: COLORS.amberStatus,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.darkNavy}>
                      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: COLORS.amberStatus, fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                      Low Volume Warning:
                    </div>
                    <div style={{ color: COLORS.textMuted, fontSize: "12px" }}>
                      Supply levels below threshold at Warehouse A
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Intelligence & Forecasting Section */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.darkNavy} 0%, #1A2942 100%)`,
            borderRadius: "16px",
            padding: "32px",
            border: `1px solid ${COLORS.borderColor}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: COLORS.gold,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: COLORS.darkNavy, fontWeight: 700, fontSize: "18px" }}>A</span>
            </div>
            <h2 style={{ color: COLORS.white, fontSize: "28px", fontWeight: 700, margin: 0 }}>
              Market Intelligence & Forecasting
            </h2>
          </div>

          {/* Market Insights Dashboard */}
          <div
            style={{
              background: COLORS.cardBg,
              borderRadius: "12px",
              padding: "24px",
              border: `1px solid ${COLORS.borderColor}`,
            }}
          >
            <h3 style={{ color: COLORS.white, fontSize: "18px", fontWeight: 600, marginBottom: "20px" }}>
              Market Insights Dashboard
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {/* Regional Supply Forecast */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ color: COLORS.gold, fontSize: "13px", fontWeight: 600 }}>Regional Supply Forecast</span>
                  <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>...</button>
                </div>
                <h4 style={{ color: COLORS.white, fontSize: "14px", fontWeight: 500, marginBottom: "16px" }}>
                  12-Month Supply Outlook
                </h4>

                {/* Bar Chart */}
                <div style={{ height: "120px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
                  {monthlySupplyData.map((item, index) => (
                    <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: "100%",
                          height: `${item.value}px`,
                          background: index >= 6 ? COLORS.gold : COLORS.blueStatus,
                          borderRadius: "2px 2px 0 0",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                  {monthlySupplyData.map((item, index) => (
                    <span key={index} style={{ color: COLORS.textMuted, fontSize: "8px" }}>
                      {item.month}
                    </span>
                  ))}
                </div>

                <p style={{ color: COLORS.textMuted, fontSize: "11px", marginTop: "16px", lineHeight: 1.5 }}>
                  <strong style={{ color: COLORS.gold }}>12-Month Supply Outlook:</strong> Projected biomass availability based on regional production and inventory.
                </p>
              </div>

              {/* Price Trend Analysis */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ color: COLORS.gold, fontSize: "13px", fontWeight: 600 }}>Price Trend Analysis</span>
                  <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>...</button>
                </div>
                <h4 style={{ color: COLORS.white, fontSize: "14px", fontWeight: 500, marginBottom: "16px" }}>
                  Real-Time Spot Pricing
                </h4>

                {/* Line Chart */}
                <div style={{ height: "120px", position: "relative" }}>
                  {/* Y-axis */}
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", color: COLORS.textMuted, fontSize: "9px" }}>
                    <span>2200</span>
                    <span>1800</span>
                    <span>1400</span>
                    <span>1000</span>
                    <span>600</span>
                  </div>

                  {/* Chart */}
                  <div style={{ marginLeft: "30px", height: "100%", position: "relative" }}>
                    <svg width="100%" height="100%">
                      {/* Area fill */}
                      <defs>
                        <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={COLORS.gold} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 100 Q 50 90, 100 70 T 200 30"
                        fill="url(#priceGradient)"
                        stroke={COLORS.gold}
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                <p style={{ color: COLORS.textMuted, fontSize: "11px", marginTop: "16px", lineHeight: 1.5 }}>
                  <strong style={{ color: COLORS.gold }}>Real-Time Spot Pricing:</strong> Analyze current and historical spot pricing trends for strategic purchasing.
                </p>
              </div>

              {/* Competitive Activity */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ color: COLORS.gold, fontSize: "13px", fontWeight: 600 }}>Competitive Activity</span>
                  <button style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>...</button>
                </div>
                <h4 style={{ color: COLORS.white, fontSize: "14px", fontWeight: 500, marginBottom: "16px" }}>
                  Demand Pipeline Analysis
                </h4>

                {/* Heatmap */}
                <div
                  style={{
                    height: "120px",
                    background: `linear-gradient(135deg,
                      ${COLORS.blueStatus}22 0%,
                      ${COLORS.blueStatus}44 20%,
                      ${COLORS.redAlert}44 40%,
                      ${COLORS.redAlert}88 50%,
                      ${COLORS.redAlert}44 60%,
                      ${COLORS.blueStatus}44 80%,
                      ${COLORS.blueStatus}22 100%
                    )`,
                    borderRadius: "8px",
                    display: "grid",
                    gridTemplateColumns: "repeat(10, 1fr)",
                    gridTemplateRows: "repeat(8, 1fr)",
                    gap: "1px",
                    padding: "4px",
                  }}
                >
                  {Array.from({ length: 80 }).map((_, i) => {
                    const row = Math.floor(i / 10);
                    const col = i % 10;
                    const centerDist = Math.sqrt(Math.pow(row - 4, 2) + Math.pow(col - 5, 2));
                    const intensity = Math.max(0, 1 - centerDist / 6);
                    return (
                      <div
                        key={i}
                        style={{
                          background: intensity > 0.7
                            ? COLORS.redAlert
                            : intensity > 0.4
                              ? COLORS.amberStatus
                              : intensity > 0.2
                                ? COLORS.blueStatus
                                : "transparent",
                          opacity: intensity * 0.8 + 0.2,
                          borderRadius: "1px",
                        }}
                      />
                    );
                  })}
                </div>

                <p style={{ color: COLORS.textMuted, fontSize: "11px", marginTop: "16px", lineHeight: 1.5 }}>
                  <strong style={{ color: COLORS.gold }}>Demand Pipeline Analysis:</strong> Visualize market density and identify emerging demand centers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
