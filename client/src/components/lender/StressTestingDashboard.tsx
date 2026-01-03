/**
 * Stress Testing Dashboard
 *
 * Pre-built and custom scenario modeling for portfolio stress testing.
 * Enables lenders to simulate drought, price volatility, supply disruption,
 * and climate events to understand portfolio resilience.
 *
 * Features:
 * - Pre-built APRA-aligned stress scenarios
 * - Custom scenario builder with adjustable parameters
 * - Sensitivity analysis across key variables
 * - Impact visualization on DSCR, LVR, and covenant compliance
 *
 * Design: Bloomberg Terminal meets APRA regulatory dashboard
 * Colors: Deep Navy (#0A1931), Institutional Gold (#B8860B), Steel Blue (#4682B4)
 */

import React, { useState, useMemo } from "react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ScenarioSeverity = "mild" | "moderate" | "severe" | "extreme";
type ScenarioCategory = "climate" | "market" | "supply" | "regulatory" | "custom";

interface StressScenario {
  id: string;
  name: string;
  category: ScenarioCategory;
  severity: ScenarioSeverity;
  description: string;
  parameters: ScenarioParameter[];
  isPrebuilt: boolean;
  apraAligned: boolean;
}

interface ScenarioParameter {
  id: string;
  name: string;
  baseValue: number;
  stressedValue: number;
  unit: string;
  minValue: number;
  maxValue: number;
}

interface StressResult {
  scenarioId: string;
  scenarioName: string;
  severity: ScenarioSeverity;
  portfolioImpact: {
    dscrBefore: number;
    dscrAfter: number;
    dscrChange: number;
    lvrBefore: number;
    lvrAfter: number;
    lvrChange: number;
    covenantBreaches: number;
    totalBreachExposure: number;
  };
  projectImpacts: ProjectImpact[];
  riskRating: "minimal" | "manageable" | "elevated" | "critical";
  mitigationActions: string[];
}

interface ProjectImpact {
  projectId: string;
  projectName: string;
  dscrBefore: number;
  dscrAfter: number;
  covenantStatus: "compliant" | "warning" | "breach";
  primaryRisk: string;
}

interface SensitivityPoint {
  variable: string;
  change: number;
  dscrImpact: number;
  lvrImpact: number;
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
  // Severity colors
  mild: "#10B981",
  moderate: "#F59E0B",
  severe: "#EF4444",
  extreme: "#7C2D12",
  // Risk rating colors
  minimal: "#10B981",
  manageable: "#3B82F6",
  elevated: "#F59E0B",
  critical: "#DC2626",
};

const TYPOGRAPHY = {
  mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  serif: "'Georgia', 'Tiempos Headline', serif",
};

// ============================================================================
// MOCK DATA
// ============================================================================

const prebuiltScenarios: StressScenario[] = [
  {
    id: "S001",
    name: "El Niño Drought Event",
    category: "climate",
    severity: "severe",
    description: "Simulates a severe El Niño drought affecting eastern Australian agricultural regions with 40% yield reduction.",
    isPrebuilt: true,
    apraAligned: true,
    parameters: [
      { id: "P1", name: "Yield Reduction", baseValue: 0, stressedValue: -40, unit: "%", minValue: -80, maxValue: 0 },
      { id: "P2", name: "Supply Security Score", baseValue: 85, stressedValue: 55, unit: "pts", minValue: 0, maxValue: 100 },
      { id: "P3", name: "Operating Costs", baseValue: 0, stressedValue: 25, unit: "%", minValue: 0, maxValue: 100 },
    ],
  },
  {
    id: "S002",
    name: "Carbon Price Collapse",
    category: "market",
    severity: "moderate",
    description: "Models a 35% decline in ACCU spot prices due to policy uncertainty or market oversupply.",
    isPrebuilt: true,
    apraAligned: true,
    parameters: [
      { id: "P4", name: "ACCU Price Change", baseValue: 35.75, stressedValue: 23.24, unit: "$/unit", minValue: 10, maxValue: 50 },
      { id: "P5", name: "Collateral Value", baseValue: 0, stressedValue: -35, unit: "%", minValue: -80, maxValue: 0 },
      { id: "P6", name: "LVR Impact", baseValue: 0, stressedValue: 15, unit: "pts", minValue: 0, maxValue: 30 },
    ],
  },
  {
    id: "S003",
    name: "Major Supplier Default",
    category: "supply",
    severity: "moderate",
    description: "Simulates the default of top 3 suppliers representing 45% of contracted volume.",
    isPrebuilt: true,
    apraAligned: true,
    parameters: [
      { id: "P7", name: "Volume Loss", baseValue: 0, stressedValue: -45, unit: "%", minValue: -100, maxValue: 0 },
      { id: "P8", name: "Concentration Index", baseValue: 1450, stressedValue: 2800, unit: "HHI", minValue: 500, maxValue: 5000 },
      { id: "P9", name: "Replacement Cost Premium", baseValue: 0, stressedValue: 20, unit: "%", minValue: 0, maxValue: 50 },
    ],
  },
  {
    id: "S004",
    name: "Interest Rate Shock",
    category: "regulatory",
    severity: "mild",
    description: "Models a 200bp increase in reference rates impacting debt servicing capacity.",
    isPrebuilt: true,
    apraAligned: true,
    parameters: [
      { id: "P10", name: "Rate Increase", baseValue: 0, stressedValue: 200, unit: "bps", minValue: 0, maxValue: 500 },
      { id: "P11", name: "Interest Expense", baseValue: 0, stressedValue: 25, unit: "%", minValue: 0, maxValue: 100 },
      { id: "P12", name: "DSCR Pressure", baseValue: 0, stressedValue: -0.15, unit: "x", minValue: -0.5, maxValue: 0 },
    ],
  },
  {
    id: "S005",
    name: "Combined Climate + Market",
    category: "climate",
    severity: "extreme",
    description: "Worst-case scenario combining drought conditions with carbon price decline and rate increases.",
    isPrebuilt: true,
    apraAligned: true,
    parameters: [
      { id: "P13", name: "Yield Reduction", baseValue: 0, stressedValue: -50, unit: "%", minValue: -80, maxValue: 0 },
      { id: "P14", name: "ACCU Price Change", baseValue: 0, stressedValue: -40, unit: "%", minValue: -80, maxValue: 0 },
      { id: "P15", name: "Rate Increase", baseValue: 0, stressedValue: 150, unit: "bps", minValue: 0, maxValue: 500 },
    ],
  },
];

const mockStressResults: StressResult[] = [
  {
    scenarioId: "S001",
    scenarioName: "El Niño Drought Event",
    severity: "severe",
    portfolioImpact: {
      dscrBefore: 1.42,
      dscrAfter: 1.08,
      dscrChange: -0.34,
      lvrBefore: 73.4,
      lvrAfter: 78.2,
      lvrChange: 4.8,
      covenantBreaches: 2,
      totalBreachExposure: 4750000,
    },
    projectImpacts: [
      { projectId: "P1", projectName: "Darling Downs Solar Farm", dscrBefore: 1.45, dscrAfter: 1.12, covenantStatus: "warning", primaryRisk: "Yield reduction" },
      { projectId: "P2", projectName: "Moree Grain Collective", dscrBefore: 1.38, dscrAfter: 0.95, covenantStatus: "breach", primaryRisk: "Operating cost increase" },
      { projectId: "P3", projectName: "Riverina Cattle Station", dscrBefore: 1.52, dscrAfter: 1.18, covenantStatus: "compliant", primaryRisk: "Supply disruption" },
      { projectId: "P4", projectName: "Atherton Tablelands", dscrBefore: 1.28, dscrAfter: 0.92, covenantStatus: "breach", primaryRisk: "Volume shortfall" },
    ],
    riskRating: "elevated",
    mitigationActions: [
      "Activate drought contingency reserves for affected projects",
      "Engage alternative suppliers from unaffected regions",
      "Review insurance coverage adequacy",
      "Prepare covenant waiver requests for borderline accounts",
    ],
  },
  {
    scenarioId: "S002",
    scenarioName: "Carbon Price Collapse",
    severity: "moderate",
    portfolioImpact: {
      dscrBefore: 1.42,
      dscrAfter: 1.35,
      dscrChange: -0.07,
      lvrBefore: 73.4,
      lvrAfter: 88.6,
      lvrChange: 15.2,
      covenantBreaches: 1,
      totalBreachExposure: 1350000,
    },
    projectImpacts: [
      { projectId: "P1", projectName: "Darling Downs Solar Farm", dscrBefore: 1.45, dscrAfter: 1.38, covenantStatus: "compliant", primaryRisk: "Collateral devaluation" },
      { projectId: "P4", projectName: "Atherton Tablelands", dscrBefore: 1.28, dscrAfter: 1.22, covenantStatus: "warning", primaryRisk: "LVR breach risk" },
    ],
    riskRating: "manageable",
    mitigationActions: [
      "Request additional collateral from high-LVR borrowers",
      "Consider partial carbon hedging for portfolio",
      "Review margin call triggers in loan documentation",
    ],
  },
];

const sensitivityData: SensitivityPoint[] = [
  { variable: "ACCU Price", change: -10, dscrImpact: -0.02, lvrImpact: 3.2 },
  { variable: "ACCU Price", change: -20, dscrImpact: -0.05, lvrImpact: 6.8 },
  { variable: "ACCU Price", change: -30, dscrImpact: -0.08, lvrImpact: 11.4 },
  { variable: "Yield", change: -10, dscrImpact: -0.08, lvrImpact: 0.5 },
  { variable: "Yield", change: -20, dscrImpact: -0.18, lvrImpact: 1.2 },
  { variable: "Yield", change: -30, dscrImpact: -0.28, lvrImpact: 2.1 },
  { variable: "Interest Rate", change: 100, dscrImpact: -0.06, lvrImpact: 0 },
  { variable: "Interest Rate", change: 200, dscrImpact: -0.12, lvrImpact: 0 },
  { variable: "Interest Rate", change: 300, dscrImpact: -0.19, lvrImpact: 0 },
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

const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

const getSeverityColor = (severity: ScenarioSeverity): string => {
  return COLORS[severity];
};

const getRiskRatingColor = (rating: StressResult["riskRating"]): string => {
  return COLORS[rating];
};

const getCategoryIcon = (category: ScenarioCategory): string => {
  switch (category) {
    case "climate": return "🌡️";
    case "market": return "📉";
    case "supply": return "🔗";
    case "regulatory": return "📋";
    case "custom": return "⚙️";
  }
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

const ScenarioCard: React.FC<{
  scenario: StressScenario;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ scenario, isSelected, onSelect }) => {
  const severityColor = getSeverityColor(scenario.severity);

  return (
    <div
      onClick={onSelect}
      style={{
        background: isSelected ? COLORS.deepNavy : "white",
        border: `2px solid ${isSelected ? COLORS.institutionalGold : COLORS.cardBorder}`,
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>{getCategoryIcon(scenario.category)}</span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: isSelected ? "white" : COLORS.textPrimary,
            }}
          >
            {scenario.name}
          </span>
        </div>
        <div
          style={{
            padding: "3px 8px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            background: `${severityColor}20`,
            color: severityColor,
          }}
        >
          {scenario.severity}
        </div>
      </div>

      <p
        style={{
          fontSize: "12px",
          color: isSelected ? "rgba(255,255,255,0.7)" : COLORS.textSecondary,
          margin: 0,
          marginBottom: "12px",
          lineHeight: 1.5,
        }}
      >
        {scenario.description}
      </p>

      <div style={{ display: "flex", gap: "8px" }}>
        {scenario.apraAligned && (
          <span
            style={{
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "3px",
              background: isSelected ? "rgba(255,255,255,0.1)" : COLORS.panelBg,
              color: isSelected ? "rgba(255,255,255,0.7)" : COLORS.textSecondary,
            }}
          >
            APRA Aligned
          </span>
        )}
        <span
          style={{
            fontSize: "10px",
            padding: "2px 6px",
            borderRadius: "3px",
            background: isSelected ? "rgba(255,255,255,0.1)" : COLORS.panelBg,
            color: isSelected ? "rgba(255,255,255,0.7)" : COLORS.textSecondary,
          }}
        >
          {scenario.parameters.length} Variables
        </span>
      </div>
    </div>
  );
};

const ParameterSlider: React.FC<{
  parameter: ScenarioParameter;
  value: number;
  onChange: (value: number) => void;
}> = ({ parameter, value, onChange }) => {
  const range = parameter.maxValue - parameter.minValue;
  const percentage = ((value - parameter.minValue) / range) * 100;

  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: 500, color: COLORS.textPrimary }}>
          {parameter.name}
        </span>
        <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "12px", color: COLORS.institutionalGold, fontWeight: 600 }}>
          {formatNumber(value, parameter.unit === "%" || parameter.unit === "bps" ? 0 : 2)} {parameter.unit}
        </span>
      </div>
      <div style={{ position: "relative", height: "24px" }}>
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: 0,
            right: 0,
            height: "4px",
            background: COLORS.cardBorder,
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: 0,
            width: `${percentage}%`,
            height: "4px",
            background: COLORS.deepNavy,
            borderRadius: "2px",
          }}
        />
        <input
          type="range"
          min={parameter.minValue}
          max={parameter.maxValue}
          step={(range) / 100}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "24px",
            opacity: 0,
            cursor: "pointer",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "4px",
            left: `calc(${percentage}% - 8px)`,
            width: "16px",
            height: "16px",
            background: COLORS.deepNavy,
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <span style={{ fontSize: "10px", color: COLORS.textMuted }}>
          Base: {formatNumber(parameter.baseValue, 0)} {parameter.unit}
        </span>
        <span style={{ fontSize: "10px", color: COLORS.textMuted }}>
          Stressed: {formatNumber(parameter.stressedValue, 0)} {parameter.unit}
        </span>
      </div>
    </div>
  );
};

const ResultsPanel: React.FC<{ result: StressResult }> = ({ result }) => {
  const riskColor = getRiskRatingColor(result.riskRating);

  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${COLORS.cardBorder}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.textPrimary, fontFamily: TYPOGRAPHY.serif }}>
            Stress Test Results
          </div>
          <div style={{ fontSize: "12px", color: COLORS.textSecondary, marginTop: "4px" }}>
            {result.scenarioName}
          </div>
        </div>
        <div
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            background: `${riskColor}15`,
            color: riskColor,
          }}
        >
          {result.riskRating} Risk
        </div>
      </div>

      {/* Portfolio Impact Summary */}
      <div style={{ padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "11px", color: COLORS.textSecondary, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              DSCR Impact
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "24px", fontWeight: 600, color: COLORS.textPrimary }}>
                {formatNumber(result.portfolioImpact.dscrAfter)}x
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.mono,
                  fontSize: "14px",
                  color: result.portfolioImpact.dscrChange < 0 ? COLORS.negative : COLORS.positive,
                }}
              >
                ({result.portfolioImpact.dscrChange > 0 ? "+" : ""}{formatNumber(result.portfolioImpact.dscrChange)}x)
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: COLORS.textSecondary, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              LVR Impact
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "24px", fontWeight: 600, color: COLORS.textPrimary }}>
                {formatNumber(result.portfolioImpact.lvrAfter, 1)}%
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.mono,
                  fontSize: "14px",
                  color: result.portfolioImpact.lvrChange > 0 ? COLORS.negative : COLORS.positive,
                }}
              >
                (+{formatNumber(result.portfolioImpact.lvrChange, 1)}%)
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: COLORS.textSecondary, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Covenant Breaches
            </div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "24px", fontWeight: 600, color: result.portfolioImpact.covenantBreaches > 0 ? COLORS.negative : COLORS.positive }}>
              {result.portfolioImpact.covenantBreaches}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: COLORS.textSecondary, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Exposure at Risk
            </div>
            <div style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "24px", fontWeight: 600, color: COLORS.textPrimary }}>
              {formatCurrency(result.portfolioImpact.totalBreachExposure)}
            </div>
          </div>
        </div>

        {/* Project Impacts */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textPrimary, marginBottom: "12px" }}>
            Project-Level Impacts
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Project", "DSCR Before", "DSCR After", "Status", "Primary Risk"].map((header, i) => (
                  <th
                    key={header}
                    style={{
                      textAlign: i === 0 || i === 4 ? "left" : "center",
                      padding: "10px 12px",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: COLORS.textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: `1px solid ${COLORS.cardBorder}`,
                      background: COLORS.panelBg,
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.projectImpacts.map((project) => (
                <tr key={project.projectId}>
                  <td style={{ padding: "12px", fontSize: "13px", fontWeight: 500, color: COLORS.textPrimary, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                    {project.projectName}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontFamily: TYPOGRAPHY.mono, fontSize: "13px", color: COLORS.textPrimary, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                    {formatNumber(project.dscrBefore)}x
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontFamily: TYPOGRAPHY.mono, fontSize: "13px", color: project.dscrAfter < 1.15 ? COLORS.negative : COLORS.textPrimary, fontWeight: project.dscrAfter < 1.15 ? 600 : 400, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                    {formatNumber(project.dscrAfter)}x
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: project.covenantStatus === "compliant" ? "#28A745" : project.covenantStatus === "warning" ? "#FFC107" : "#DC3545",
                      }}
                    />
                  </td>
                  <td style={{ padding: "12px", fontSize: "12px", color: COLORS.textSecondary, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                    {project.primaryRisk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mitigation Actions */}
        <div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textPrimary, marginBottom: "12px" }}>
            Recommended Mitigation Actions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {result.mitigationActions.map((action, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px",
                  background: COLORS.panelBg,
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: COLORS.textPrimary,
                }}
              >
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.mono,
                    fontSize: "11px",
                    fontWeight: 600,
                    color: COLORS.institutionalGold,
                    background: `${COLORS.institutionalGold}15`,
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  {index + 1}
                </span>
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SensitivityChart: React.FC<{ data: SensitivityPoint[] }> = ({ data }) => {
  const variables = [...new Set(data.map((d) => d.variable))];

  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.textPrimary, marginBottom: "20px", fontFamily: TYPOGRAPHY.serif }}>
        Sensitivity Analysis
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
        {variables.map((variable) => {
          const varData = data.filter((d) => d.variable === variable);
          return (
            <div key={variable}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: COLORS.textSecondary, marginBottom: "12px" }}>
                {variable}
              </div>
              {varData.map((point) => (
                <div
                  key={point.change}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: `1px solid ${COLORS.cardBorder}`,
                  }}
                >
                  <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "12px", color: COLORS.textSecondary }}>
                    {point.change > 0 ? "+" : ""}{point.change}{variable === "Interest Rate" ? "bp" : "%"}
                  </span>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "12px", color: point.dscrImpact < 0 ? COLORS.negative : COLORS.positive }}>
                      DSCR: {point.dscrImpact > 0 ? "+" : ""}{formatNumber(point.dscrImpact)}x
                    </span>
                    {point.lvrImpact !== 0 && (
                      <span style={{ fontFamily: TYPOGRAPHY.mono, fontSize: "12px", color: point.lvrImpact > 0 ? COLORS.warning : COLORS.positive }}>
                        LVR: +{formatNumber(point.lvrImpact, 1)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
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

export const StressTestingDashboard: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<StressScenario | null>(prebuiltScenarios[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const currentResult = useMemo(() => {
    if (!selectedScenario) return null;
    return mockStressResults.find((r) => r.scenarioId === selectedScenario.id) || mockStressResults[0];
  }, [selectedScenario]);

  const handleRunStressTest = () => {
    setIsRunning(true);
    setShowResults(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 1500);
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
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
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
            Stress Testing Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.textSecondary, margin: 0 }}>
            APRA-aligned scenario modeling and portfolio resilience analysis
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
            <span>➕</span> Custom Scenario
          </button>
          <button
            onClick={handleRunStressTest}
            disabled={!selectedScenario || isRunning}
            style={{
              background: isRunning ? COLORS.textSecondary : COLORS.deepNavy,
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 500,
              color: "white",
              cursor: isRunning ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isRunning ? (
              <>
                <span style={{ animation: "spin 1s linear infinite" }}>⟳</span> Running...
              </>
            ) : (
              <>
                <span>▶</span> Run Stress Test
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px" }}>
        {/* Scenario Selection Panel */}
        <div>
          <div
            style={{
              background: "white",
              border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.textPrimary, marginBottom: "16px", fontFamily: TYPOGRAPHY.serif }}>
              Pre-Built Scenarios
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {prebuiltScenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  isSelected={selectedScenario?.id === scenario.id}
                  onSelect={() => setSelectedScenario(scenario)}
                />
              ))}
            </div>
          </div>

          {/* Parameter Adjustment */}
          {selectedScenario && (
            <div
              style={{
                background: "white",
                border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.textPrimary, marginBottom: "16px", fontFamily: TYPOGRAPHY.serif }}>
                Scenario Parameters
              </div>
              {selectedScenario.parameters.map((param) => (
                <ParameterSlider
                  key={param.id}
                  parameter={param}
                  value={param.stressedValue}
                  onChange={() => {}}
                />
              ))}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div>
          {showResults && currentResult ? (
            <>
              <ResultsPanel result={currentResult} />
              <div style={{ marginTop: "20px" }}>
                <SensitivityChart data={sensitivityData} />
              </div>
            </>
          ) : (
            <div
              style={{
                background: "white",
                border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: "8px",
                padding: "80px 40px",
                textAlign: "center",
              }}
            >
              {isRunning ? (
                <>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
                  <div style={{ fontSize: "16px", fontWeight: 500, color: COLORS.textPrimary, marginBottom: "8px" }}>
                    Running Stress Analysis...
                  </div>
                  <div style={{ fontSize: "13px", color: COLORS.textSecondary }}>
                    Calculating portfolio impacts across {selectedScenario?.parameters.length || 0} variables
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
                  <div style={{ fontSize: "16px", fontWeight: 500, color: COLORS.textPrimary, marginBottom: "8px" }}>
                    Select a Scenario to Begin
                  </div>
                  <div style={{ fontSize: "13px", color: COLORS.textSecondary }}>
                    Choose from pre-built APRA-aligned scenarios or create a custom stress test
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

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
          <span style={{ fontWeight: 500 }}>Methodology:</span> Stress scenarios aligned with APRA Prudential Practice Guide CPG 229 (Climate Change Financial Risks)
        </div>
        <div style={{ fontSize: "11px", color: COLORS.textMuted, fontFamily: TYPOGRAPHY.mono }}>
          Model version: 2.3.1 | Last validated: Jan 2024
        </div>
      </div>
    </div>
  );
};

export default StressTestingDashboard;
