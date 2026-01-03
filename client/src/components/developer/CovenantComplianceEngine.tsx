/**
 * CovenantComplianceEngine - Proactive monitoring dashboard with traffic light indicators
 *
 * Spec: Real-time covenant tracking with automated lender reporting
 * Three pillars: Supply Security, Concentration Risk, Counterparty Quality
 * Automated quarterly reports, configurable alert thresholds
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Bell,
  BellOff,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Mail,
  Smartphone,
  Clock,
  ChevronDown,
  ChevronUp,
  Settings,
  RefreshCw,
  Building2,
  Users,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CovenantMetric {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  threshold: number;
  unit: string;
  status: "green" | "amber" | "red";
  trend: "up" | "down" | "stable";
  lastUpdated: Date;
  breachRisk: number; // 0-100 probability of breach in next 90 days
}

interface CovenantCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  metrics: CovenantMetric[];
  overallStatus: "green" | "amber" | "red";
}

interface QuarterlyReport {
  quarter: string;
  year: number;
  status: "submitted" | "pending" | "draft";
  submittedDate?: Date;
  dueDate: Date;
  overallCompliance: number;
}

interface AlertConfig {
  id: string;
  metricId: string;
  threshold: number;
  enabled: boolean;
  emailNotify: boolean;
  smsNotify: boolean;
  recipients: string[];
}

interface CovenantComplianceEngineProps {
  projectId?: string;
  className?: string;
}

// Demo covenant data
const DEMO_CATEGORIES: CovenantCategory[] = [
  {
    id: "supply_security",
    name: "Supply Security",
    icon: <Shield className="h-5 w-5" />,
    overallStatus: "green",
    metrics: [
      {
        id: "contracted_volume",
        name: "Contracted Volume",
        description: "Minimum committed feedstock volume",
        currentValue: 485000,
        threshold: 400000,
        unit: "tonnes",
        status: "green",
        trend: "up",
        lastUpdated: new Date(),
        breachRisk: 5,
      },
      {
        id: "contract_tenor",
        name: "Avg Contract Tenor",
        description: "Weighted average remaining contract term",
        currentValue: 7.2,
        threshold: 5,
        unit: "years",
        status: "green",
        trend: "stable",
        lastUpdated: new Date(),
        breachRisk: 8,
      },
      {
        id: "replacement_coverage",
        name: "Replacement Coverage",
        description: "Pipeline volume vs. expiring contracts",
        currentValue: 142,
        threshold: 100,
        unit: "%",
        status: "green",
        trend: "up",
        lastUpdated: new Date(),
        breachRisk: 12,
      },
    ],
  },
  {
    id: "concentration_risk",
    name: "Concentration Risk",
    icon: <PieChart className="h-5 w-5" />,
    overallStatus: "amber",
    metrics: [
      {
        id: "hhi_index",
        name: "HHI Index",
        description: "Herfindahl-Hirschman concentration measure",
        currentValue: 1850,
        threshold: 2500,
        unit: "",
        status: "amber",
        trend: "down",
        lastUpdated: new Date(),
        breachRisk: 22,
      },
      {
        id: "max_supplier",
        name: "Max Single Supplier",
        description: "Largest supplier market share",
        currentValue: 17.5,
        threshold: 20,
        unit: "%",
        status: "amber",
        trend: "stable",
        lastUpdated: new Date(),
        breachRisk: 35,
      },
      {
        id: "top_5_concentration",
        name: "Top 5 Concentration",
        description: "Combined share of top 5 suppliers",
        currentValue: 58,
        threshold: 70,
        unit: "%",
        status: "green",
        trend: "down",
        lastUpdated: new Date(),
        breachRisk: 15,
      },
    ],
  },
  {
    id: "counterparty_quality",
    name: "Counterparty Quality",
    icon: <Users className="h-5 w-5" />,
    overallStatus: "green",
    metrics: [
      {
        id: "avg_credit_score",
        name: "Avg Credit Score",
        description: "Weighted average counterparty credit rating",
        currentValue: 72,
        threshold: 60,
        unit: "/100",
        status: "green",
        trend: "up",
        lastUpdated: new Date(),
        breachRisk: 8,
      },
      {
        id: "verified_suppliers",
        name: "Verified Suppliers",
        description: "Suppliers with full verification",
        currentValue: 94,
        threshold: 80,
        unit: "%",
        status: "green",
        trend: "up",
        lastUpdated: new Date(),
        breachRisk: 5,
      },
      {
        id: "default_rate",
        name: "Default Rate",
        description: "12-month rolling default rate",
        currentValue: 1.2,
        threshold: 5,
        unit: "%",
        status: "green",
        trend: "down",
        lastUpdated: new Date(),
        breachRisk: 3,
      },
    ],
  },
];

const DEMO_REPORTS: QuarterlyReport[] = [
  {
    quarter: "Q4",
    year: 2025,
    status: "pending",
    dueDate: new Date("2026-01-31"),
    overallCompliance: 92,
  },
  {
    quarter: "Q3",
    year: 2025,
    status: "submitted",
    submittedDate: new Date("2025-10-15"),
    dueDate: new Date("2025-10-31"),
    overallCompliance: 89,
  },
  {
    quarter: "Q2",
    year: 2025,
    status: "submitted",
    submittedDate: new Date("2025-07-12"),
    dueDate: new Date("2025-07-31"),
    overallCompliance: 87,
  },
  {
    quarter: "Q1",
    year: 2025,
    status: "submitted",
    submittedDate: new Date("2025-04-18"),
    dueDate: new Date("2025-04-30"),
    overallCompliance: 85,
  },
];

// 12-month compliance trend data
const COMPLIANCE_TREND = [
  { month: "Feb", score: 82 },
  { month: "Mar", score: 84 },
  { month: "Apr", score: 85 },
  { month: "May", score: 83 },
  { month: "Jun", score: 86 },
  { month: "Jul", score: 87 },
  { month: "Aug", score: 88 },
  { month: "Sep", score: 89 },
  { month: "Oct", score: 88 },
  { month: "Nov", score: 90 },
  { month: "Dec", score: 91 },
  { month: "Jan", score: 92 },
];

export function CovenantComplianceEngine({
  projectId,
  className,
}: CovenantComplianceEngineProps) {
  const [categories] = useState<CovenantCategory[]>(DEMO_CATEGORIES);
  const [reports] = useState<QuarterlyReport[]>(DEMO_REPORTS);
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("supply_security");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Alert configuration state
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Calculate overall compliance score
  const overallCompliance = useMemo(() => {
    const allMetrics = categories.flatMap((c) => c.metrics);
    const greenCount = allMetrics.filter((m) => m.status === "green").length;
    return Math.round((greenCount / allMetrics.length) * 100);
  }, [categories]);

  // Count statuses
  const statusCounts = useMemo(() => {
    const allMetrics = categories.flatMap((c) => c.metrics);
    return {
      green: allMetrics.filter((m) => m.status === "green").length,
      amber: allMetrics.filter((m) => m.status === "amber").length,
      red: allMetrics.filter((m) => m.status === "red").length,
    };
  }, [categories]);

  const getStatusColor = (status: "green" | "amber" | "red") => {
    switch (status) {
      case "green":
        return "bg-green-500";
      case "amber":
        return "bg-amber-500";
      case "red":
        return "bg-red-500";
    }
  };

  const getStatusBadge = (status: "green" | "amber" | "red") => {
    switch (status) {
      case "green":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Compliant
          </Badge>
        );
      case "amber":
        return (
          <Badge className="bg-amber-100 text-amber-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Watch
          </Badge>
        );
      case "red":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Breach
          </Badge>
        );
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <span className="h-4 w-4 text-gray-400">—</span>;
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGeneratingReport(false);
    // In production, this would generate and download the report
  };

  const maxTrendScore = Math.max(...COMPLIANCE_TREND.map((t) => t.score));
  const minTrendScore = Math.min(...COMPLIANCE_TREND.map((t) => t.score));

  return (
    <Card className={cn("border-2 border-[#0A1931]", className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-[#0A1931] to-[#1a3a5c] text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-[#D4AF37]" />
            <div>
              <CardTitle className="text-lg">Covenant Compliance Engine</CardTitle>
              <p className="text-sm text-gray-300">
                Real-time monitoring with automated lender reporting
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAlertSettings(!showAlertSettings)}
              className="text-white hover:bg-white/10"
            >
              {alertsEnabled ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Alert Settings Panel */}
        {showAlertSettings && (
          <div className="bg-gray-50 rounded-lg p-4 border space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alert Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="alerts-enabled" className="text-sm">
                  Alerts Enabled
                </Label>
                <Switch
                  id="alerts-enabled"
                  checked={alertsEnabled}
                  onCheckedChange={setAlertsEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-alerts" className="text-sm flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email Alerts
                </Label>
                <Switch
                  id="email-alerts"
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                  disabled={!alertsEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-alerts" className="text-sm flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  SMS Alerts
                </Label>
                <Switch
                  id="sms-alerts"
                  checked={smsAlerts}
                  onCheckedChange={setSmsAlerts}
                  disabled={!alertsEnabled}
                />
              </div>
            </div>
          </div>
        )}

        {/* Overall Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Overall Compliance</div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-[#0A1931] tabular-nums">
                {overallCompliance}%
              </span>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-xs text-green-700 mb-1">Compliant</div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-green-700 tabular-nums">
                {statusCounts.green}
              </span>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="text-xs text-amber-700 mb-1">Watch Items</div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-amber-700 tabular-nums">
                {statusCounts.amber}
              </span>
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-xs text-red-700 mb-1">Breaches</div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-red-700 tabular-nums">
                {statusCounts.red}
              </span>
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* Traffic Light Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[#0A1931]">
            Covenant Categories
          </h4>
          {categories.map((category) => (
            <div
              key={category.id}
              className="border rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      getStatusColor(category.overallStatus)
                    )}
                  />
                  <div className="text-[#0A1931]">{category.icon}</div>
                  <span className="font-medium">{category.name}</span>
                  {getStatusBadge(category.overallStatus)}
                </div>
                {expandedCategory === category.id ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {expandedCategory === category.id && (
                <div className="p-3 space-y-3 bg-white">
                  {category.metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        metric.status === "green" && "border-green-200 bg-green-50/50",
                        metric.status === "amber" && "border-amber-200 bg-amber-50/50",
                        metric.status === "red" && "border-red-200 bg-red-50/50"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {metric.name}
                            </span>
                            {getTrendIcon(metric.trend)}
                          </div>
                          <p className="text-xs text-gray-500">
                            {metric.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={cn(
                              "text-lg font-bold tabular-nums",
                              metric.status === "green" && "text-green-700",
                              metric.status === "amber" && "text-amber-700",
                              metric.status === "red" && "text-red-700"
                            )}
                          >
                            {metric.currentValue.toLocaleString()}
                            {metric.unit}
                          </span>
                          <p className="text-xs text-gray-500">
                            Threshold: {metric.threshold.toLocaleString()}
                            {metric.unit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={
                            metric.unit === "%"
                              ? (metric.currentValue / metric.threshold) * 100
                              : Math.min(
                                  (metric.currentValue / metric.threshold) * 100,
                                  100
                                )
                          }
                          className="h-2 flex-1"
                        />
                        <span className="text-xs text-gray-500 w-24 text-right">
                          {metric.breachRisk}% breach risk
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 12-Month Compliance Trend */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[#0A1931] flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            12-Month Compliance Trend
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-end gap-1 h-20">
              {COMPLIANCE_TREND.map((point, i) => (
                <div key={point.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      point.score >= 90
                        ? "bg-green-500"
                        : point.score >= 80
                        ? "bg-amber-500"
                        : "bg-red-500"
                    )}
                    style={{
                      height: `${((point.score - minTrendScore + 5) / (maxTrendScore - minTrendScore + 10)) * 100}%`,
                    }}
                    title={`${point.month}: ${point.score}%`}
                  />
                  <span className="text-xs text-gray-500">{point.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t">
              <span>Trend: +10% over 12 months</span>
              <span>Current: {COMPLIANCE_TREND[COMPLIANCE_TREND.length - 1].score}%</span>
            </div>
          </div>
        </div>

        {/* Quarterly Reports */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#0A1931] flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quarterly Lender Reports
            </h4>
            <Button
              size="sm"
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="bg-[#D4AF37] text-[#0A1931] hover:bg-[#D4AF37]/90"
            >
              {isGeneratingReport ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Download className="h-3 w-3 mr-1" />
              )}
              Generate Q4 Report
            </Button>
          </div>

          <div className="grid gap-2">
            {reports.map((report) => (
              <div
                key={`${report.quarter}-${report.year}`}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  report.status === "pending" && "bg-amber-50 border-amber-200",
                  report.status === "submitted" && "bg-green-50 border-green-200",
                  report.status === "draft" && "bg-gray-50 border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <FileText
                    className={cn(
                      "h-5 w-5",
                      report.status === "pending" && "text-amber-600",
                      report.status === "submitted" && "text-green-600",
                      report.status === "draft" && "text-gray-500"
                    )}
                  />
                  <div>
                    <span className="font-medium">
                      {report.quarter} {report.year} Report
                    </span>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {report.status === "submitted" && report.submittedDate
                        ? `Submitted ${report.submittedDate.toLocaleDateString("en-AU")}`
                        : `Due ${report.dueDate.toLocaleDateString("en-AU")}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-semibold tabular-nums">
                      {report.overallCompliance}%
                    </span>
                    <p className="text-xs text-gray-500">compliance</p>
                  </div>
                  <Badge
                    className={cn(
                      report.status === "pending" && "bg-amber-100 text-amber-800",
                      report.status === "submitted" && "bg-green-100 text-green-800",
                      report.status === "draft" && "bg-gray-100 text-gray-800"
                    )}
                  >
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Provenance */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span>APRA-compliant reporting methodology</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Last updated: {new Date().toLocaleTimeString("en-AU")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CovenantComplianceEngine;
