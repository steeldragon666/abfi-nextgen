/**
 * EarlyWarningSystem - AI-powered risk alerts with 90-day forecast horizon
 *
 * Spec: Automated detection of declining volumes, supplier non-renewals, drought forecasts
 * Alert severity classification (Low/Moderate/High) with recommended actions
 * DSCR projection under stress scenarios
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Bell,
  BellOff,
  TrendingDown,
  CloudRain,
  Users,
  DollarSign,
  Calendar,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Clock,
  Shield,
  Target,
  Zap,
  FileText,
  Send,
  Archive,
  Filter,
  RefreshCw,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AlertSeverity = "low" | "moderate" | "high";
type AlertCategory = "volume" | "supplier" | "climate" | "financial" | "covenant";
type AlertStatus = "new" | "acknowledged" | "in_progress" | "resolved" | "dismissed";

interface RiskAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  status: AlertStatus;
  projectName: string;
  projectId: string;
  detectedAt: Date;
  forecastHorizon: number; // days
  probability: number; // percentage
  potentialImpact: {
    dscr: number;
    supplySecurityScore: number;
    financialExposure: number;
  };
  riskFactors: string[];
  recommendedActions: {
    action: string;
    priority: "immediate" | "short_term" | "medium_term";
    owner: string;
  }[];
  dataSource: string;
  relatedAlerts: string[];
}

interface DSCRProjection {
  scenario: string;
  currentDSCR: number;
  projectedDSCR: number;
  probability: number;
  timeframe: string;
}

interface EarlyWarningSystemProps {
  className?: string;
}

const DEMO_ALERTS: RiskAlert[] = [
  {
    id: "1",
    title: "Severe Drought Forecast - QLD Central",
    description: "Bureau of Meteorology predicts 40% below-average rainfall for next 90 days in Mackay-Burdekin region. Historical correlation with 15-25% yield reduction.",
    severity: "high",
    category: "climate",
    status: "new",
    projectName: "Mackay Bioenergy Hub",
    projectId: "2",
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    forecastHorizon: 90,
    probability: 72,
    potentialImpact: {
      dscr: -0.18,
      supplySecurityScore: -12,
      financialExposure: 8500000,
    },
    riskFactors: [
      "El Niño pattern strengthening",
      "Soil moisture at 10-year low",
      "Reduced irrigation water allocations expected",
    ],
    recommendedActions: [
      { action: "Activate drought contingency contracts with alternative suppliers", priority: "immediate", owner: "Relationship Manager" },
      { action: "Request updated yield forecasts from growers", priority: "immediate", owner: "Operations" },
      { action: "Model DSCR impact under 20% volume reduction scenario", priority: "short_term", owner: "Risk Team" },
    ],
    dataSource: "BoM Climate Outlook + Satellite Imagery",
    relatedAlerts: ["3", "5"],
  },
  {
    id: "2",
    title: "Top Supplier Contract Non-Renewal Risk",
    description: "Burdekin Agri Co (17.5% of portfolio volume) has not responded to renewal discussions. Contract expires in 120 days.",
    severity: "high",
    category: "supplier",
    status: "acknowledged",
    projectName: "Burdekin Renewable Fuels",
    projectId: "1",
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    forecastHorizon: 120,
    probability: 45,
    potentialImpact: {
      dscr: -0.22,
      supplySecurityScore: -15,
      financialExposure: 12000000,
    },
    riskFactors: [
      "Supplier exploring alternative offtake arrangements",
      "Price renegotiation requested but not resolved",
      "Key contact personnel change at supplier",
    ],
    recommendedActions: [
      { action: "Schedule executive meeting with supplier leadership", priority: "immediate", owner: "Relationship Manager" },
      { action: "Prepare enhanced pricing proposal with volume guarantees", priority: "short_term", owner: "Commercial" },
      { action: "Identify replacement suppliers to mitigate concentration risk", priority: "short_term", owner: "Procurement" },
    ],
    dataSource: "Contract Management System + CRM Activity",
    relatedAlerts: [],
  },
  {
    id: "3",
    title: "Contracted Volume Decline Trend",
    description: "Portfolio contracted volume has declined 8% over past 6 months. Current trajectory projects breach of 75% Supply Security threshold within 60 days.",
    severity: "moderate",
    category: "volume",
    status: "in_progress",
    projectName: "Portfolio-Wide",
    projectId: "all",
    detectedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    forecastHorizon: 60,
    probability: 35,
    potentialImpact: {
      dscr: -0.15,
      supplySecurityScore: -8,
      financialExposure: 5200000,
    },
    riskFactors: [
      "3 contracts expired without renewal in Q4",
      "New contract pipeline below historical average",
      "Competitive pressure from alternative buyers",
    ],
    recommendedActions: [
      { action: "Accelerate pipeline contract negotiations", priority: "immediate", owner: "Commercial" },
      { action: "Review pricing competitiveness vs. market", priority: "short_term", owner: "Strategy" },
      { action: "Prepare covenant waiver request if breach likely", priority: "medium_term", owner: "Legal" },
    ],
    dataSource: "Contract Registry + Pipeline Analysis",
    relatedAlerts: ["1"],
  },
  {
    id: "4",
    title: "DSCR Approaching Minimum Threshold",
    description: "Wide Bay Ethanol DSCR at 0.98x, below covenant minimum of 1.15x. Immediate attention required.",
    severity: "high",
    category: "financial",
    status: "new",
    projectName: "Wide Bay Ethanol",
    projectId: "5",
    detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    forecastHorizon: 30,
    probability: 85,
    potentialImpact: {
      dscr: 0,
      supplySecurityScore: 0,
      financialExposure: 2800000,
    },
    riskFactors: [
      "Revenue shortfall due to production issues",
      "Feedstock cost increase of 12%",
      "Maintenance CapEx higher than budgeted",
    ],
    recommendedActions: [
      { action: "Request updated financial forecasts from borrower", priority: "immediate", owner: "Relationship Manager" },
      { action: "Assess covenant waiver vs. restructuring options", priority: "immediate", owner: "Credit" },
      { action: "Prepare credit committee briefing", priority: "immediate", owner: "Risk Team" },
    ],
    dataSource: "Financial Reporting + Cash Flow Analysis",
    relatedAlerts: [],
  },
  {
    id: "5",
    title: "HHI Index Trending Towards Warning Zone",
    description: "Portfolio HHI index at 1,650, trending upward from 1,580 three months ago. Approaching 1,500 preferred threshold.",
    severity: "low",
    category: "covenant",
    status: "acknowledged",
    projectName: "Portfolio-Wide",
    projectId: "all",
    detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    forecastHorizon: 90,
    probability: 25,
    potentialImpact: {
      dscr: 0,
      supplySecurityScore: -3,
      financialExposure: 0,
    },
    riskFactors: [
      "Loss of two mid-sized suppliers in Q3",
      "Top 3 suppliers increasing market share",
      "New supplier onboarding slower than expected",
    ],
    recommendedActions: [
      { action: "Accelerate new supplier diversification program", priority: "short_term", owner: "Procurement" },
      { action: "Review incentives for smaller suppliers", priority: "medium_term", owner: "Commercial" },
    ],
    dataSource: "Supplier Concentration Analysis",
    relatedAlerts: ["1"],
  },
];

const DSCR_PROJECTIONS: DSCRProjection[] = [
  { scenario: "Base Case", currentDSCR: 1.35, projectedDSCR: 1.32, probability: 60, timeframe: "90 days" },
  { scenario: "Moderate Stress", currentDSCR: 1.35, projectedDSCR: 1.18, probability: 25, timeframe: "90 days" },
  { scenario: "Severe Stress", currentDSCR: 1.35, projectedDSCR: 0.95, probability: 15, timeframe: "90 days" },
];

export function EarlyWarningSystem({ className }: EarlyWarningSystemProps) {
  const [alerts] = useState<RiskAlert[]>(DEMO_ALERTS);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<AlertCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (severityFilter !== "all" && alert.severity !== severityFilter) return false;
      if (categoryFilter !== "all" && alert.category !== categoryFilter) return false;
      if (statusFilter !== "all" && alert.status !== statusFilter) return false;
      return true;
    });
  }, [alerts, severityFilter, categoryFilter, statusFilter]);

  const alertCounts = useMemo(() => ({
    high: alerts.filter((a) => a.severity === "high" && a.status !== "resolved").length,
    moderate: alerts.filter((a) => a.severity === "moderate" && a.status !== "resolved").length,
    low: alerts.filter((a) => a.severity === "low" && a.status !== "resolved").length,
    new: alerts.filter((a) => a.status === "new").length,
  }), [alerts]);

  const getSeverityConfig = (severity: AlertSeverity) => {
    switch (severity) {
      case "high":
        return { icon: <AlertTriangle className="h-4 w-4" />, label: "High", bg: "bg-[#DC3545]", text: "text-[#DC3545]", lightBg: "bg-[#DC3545]/10" };
      case "moderate":
        return { icon: <AlertCircle className="h-4 w-4" />, label: "Moderate", bg: "bg-[#FFC107]", text: "text-[#FFC107]", lightBg: "bg-[#FFC107]/10" };
      case "low":
        return { icon: <Info className="h-4 w-4" />, label: "Low", bg: "bg-[#4682B4]", text: "text-[#4682B4]", lightBg: "bg-[#4682B4]/10" };
    }
  };

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case "volume": return <TrendingDown className="h-4 w-4" />;
      case "supplier": return <Users className="h-4 w-4" />;
      case "climate": return <CloudRain className="h-4 w-4" />;
      case "financial": return <DollarSign className="h-4 w-4" />;
      case "covenant": return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case "new":
        return <Badge className="bg-[#DC3545] text-white">New</Badge>;
      case "acknowledged":
        return <Badge className="bg-[#FFC107] text-black">Acknowledged</Badge>;
      case "in_progress":
        return <Badge className="bg-[#4682B4] text-white">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-[#28A745] text-white">Resolved</Badge>;
      case "dismissed":
        return <Badge variant="outline" className="text-[#6C757D]">Dismissed</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0A1931]" style={{ fontFamily: "Georgia, serif" }}>
            Early Warning System
          </h2>
          <p className="text-sm text-[#6C757D]">
            AI-powered risk detection • 90-day forecast horizon
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#DC3545] text-white">
            {alertCounts.new} New Alerts
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Summary Banner */}
      {alertCounts.high > 0 && (
        <div className="bg-[#DC3545] text-white rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <p className="font-semibold">
                {alertCounts.high} High Severity Alert{alertCounts.high > 1 ? "s" : ""} Require Immediate Attention
              </p>
              <p className="text-sm text-white/80">
                Credit committee notification has been triggered
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="bg-white text-[#DC3545] hover:bg-white/90">
            View High Priority
          </Button>
        </div>
      )}

      {/* Alert Severity Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className={cn("cursor-pointer transition-all", severityFilter === "high" && "ring-2 ring-[#DC3545]")}
          onClick={() => setSeverityFilter(severityFilter === "high" ? "all" : "high")}
        >
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#DC3545]/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-[#DC3545]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#DC3545]" style={{ fontFamily: "monospace" }}>
                {alertCounts.high}
              </div>
              <div className="text-sm text-[#6C757D]">High Severity</div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn("cursor-pointer transition-all", severityFilter === "moderate" && "ring-2 ring-[#FFC107]")}
          onClick={() => setSeverityFilter(severityFilter === "moderate" ? "all" : "moderate")}
        >
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFC107]/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-[#FFC107]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#FFC107]" style={{ fontFamily: "monospace" }}>
                {alertCounts.moderate}
              </div>
              <div className="text-sm text-[#6C757D]">Moderate</div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn("cursor-pointer transition-all", severityFilter === "low" && "ring-2 ring-[#4682B4]")}
          onClick={() => setSeverityFilter(severityFilter === "low" ? "all" : "low")}
        >
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4682B4]/10 flex items-center justify-center">
              <Info className="h-6 w-6 text-[#4682B4]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#4682B4]" style={{ fontFamily: "monospace" }}>
                {alertCounts.low}
              </div>
              <div className="text-sm text-[#6C757D]">Low Severity</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DSCR Stress Projections */}
      <Card className="border-2 border-[#0A1931]">
        <CardHeader className="pb-3 bg-[#0A1931] text-white rounded-t-lg">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#B8860B]" />
            Portfolio DSCR Projection Under Stress
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-4">
            {DSCR_PROJECTIONS.map((projection) => (
              <div
                key={projection.scenario}
                className={cn(
                  "p-4 rounded-lg border",
                  projection.scenario === "Severe Stress" && "border-[#DC3545] bg-[#DC3545]/5",
                  projection.scenario === "Moderate Stress" && "border-[#FFC107] bg-[#FFC107]/5",
                  projection.scenario === "Base Case" && "border-[#28A745] bg-[#28A745]/5"
                )}
              >
                <div className="text-sm font-medium mb-2">{projection.scenario}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "text-2xl font-bold",
                      projection.projectedDSCR >= 1.25 ? "text-[#28A745]" :
                      projection.projectedDSCR >= 1.0 ? "text-[#FFC107]" : "text-[#DC3545]"
                    )}
                    style={{ fontFamily: "monospace" }}
                  >
                    {projection.projectedDSCR.toFixed(2)}x
                  </span>
                  <span className="text-xs text-[#6C757D]">
                    from {projection.currentDSCR.toFixed(2)}x
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6C757D]">{projection.timeframe}</span>
                  <span className="font-medium">{projection.probability}% probability</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={categoryFilter} onValueChange={(v: any) => setCategoryFilter(v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="climate">Climate</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="covenant">Covenant</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        {severityFilter !== "all" && (
          <Button variant="ghost" size="sm" onClick={() => setSeverityFilter("all")}>
            <X className="h-4 w-4 mr-1" />
            Clear Severity Filter
          </Button>
        )}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const severityConfig = getSeverityConfig(alert.severity);
          const isExpanded = expandedAlert === alert.id;

          return (
            <Card
              key={alert.id}
              className={cn(
                "border-l-4 transition-all",
                alert.severity === "high" && "border-l-[#DC3545]",
                alert.severity === "moderate" && "border-l-[#FFC107]",
                alert.severity === "low" && "border-l-[#4682B4]",
                alert.status === "new" && "bg-[#F8F9FA]"
              )}
            >
              <CardContent className="pt-4">
                {/* Alert Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn("p-2 rounded-lg", severityConfig.lightBg)}>
                      {getCategoryIcon(alert.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#0A1931]">{alert.title}</span>
                        <Badge className={cn("text-white text-xs", severityConfig.bg)}>
                          {severityConfig.label}
                        </Badge>
                        {getStatusBadge(alert.status)}
                      </div>
                      <p className="text-sm text-[#6C757D]">{alert.description}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-[#6C757D]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(alert.detectedAt)}
                    </div>
                    <div className="mt-1">{alert.projectName}</div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="flex items-center gap-6 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#6C757D]" />
                    <span className="text-[#6C757D]">Probability:</span>
                    <span className={cn("font-bold", severityConfig.text)} style={{ fontFamily: "monospace" }}>
                      {alert.probability}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#6C757D]" />
                    <span className="text-[#6C757D]">Horizon:</span>
                    <span className="font-medium">{alert.forecastHorizon} days</span>
                  </div>
                  {alert.potentialImpact.financialExposure > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#6C757D]" />
                      <span className="text-[#6C757D]">Exposure:</span>
                      <span className="font-bold text-[#DC3545]" style={{ fontFamily: "monospace" }}>
                        {formatCurrency(alert.potentialImpact.financialExposure)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Expand/Collapse */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                  className="w-full justify-between"
                >
                  <span className="text-sm text-[#4682B4]">
                    {isExpanded ? "Hide Details" : "View Details & Recommendations"}
                  </span>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    {/* Potential Impact */}
                    <div>
                      <h4 className="text-sm font-semibold text-[#0A1931] mb-2">Potential Impact</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {alert.potentialImpact.dscr !== 0 && (
                          <div className="p-3 bg-[#F8F9FA] rounded-lg">
                            <div className="text-xs text-[#6C757D]">DSCR Impact</div>
                            <div className="text-lg font-bold text-[#DC3545]" style={{ fontFamily: "monospace" }}>
                              {alert.potentialImpact.dscr > 0 ? "+" : ""}{alert.potentialImpact.dscr.toFixed(2)}x
                            </div>
                          </div>
                        )}
                        {alert.potentialImpact.supplySecurityScore !== 0 && (
                          <div className="p-3 bg-[#F8F9FA] rounded-lg">
                            <div className="text-xs text-[#6C757D]">Supply Security</div>
                            <div className="text-lg font-bold text-[#DC3545]" style={{ fontFamily: "monospace" }}>
                              {alert.potentialImpact.supplySecurityScore > 0 ? "+" : ""}{alert.potentialImpact.supplySecurityScore}%
                            </div>
                          </div>
                        )}
                        <div className="p-3 bg-[#F8F9FA] rounded-lg">
                          <div className="text-xs text-[#6C757D]">Financial Exposure</div>
                          <div className="text-lg font-bold text-[#DC3545]" style={{ fontFamily: "monospace" }}>
                            {formatCurrency(alert.potentialImpact.financialExposure)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                      <h4 className="text-sm font-semibold text-[#0A1931] mb-2">Risk Factors</h4>
                      <ul className="space-y-1">
                        {alert.riskFactors.map((factor, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#6C757D]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DC3545] mt-1.5 shrink-0" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-[#0A1931] mb-2">Recommended Actions</h4>
                      <div className="space-y-2">
                        {alert.recommendedActions.map((action, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border",
                              action.priority === "immediate" && "border-[#DC3545] bg-[#DC3545]/5",
                              action.priority === "short_term" && "border-[#FFC107] bg-[#FFC107]/5",
                              action.priority === "medium_term" && "border-[#E9ECEF]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox />
                              <div>
                                <p className="text-sm font-medium">{action.action}</p>
                                <p className="text-xs text-[#6C757D]">Owner: {action.owner}</p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                action.priority === "immediate" && "border-[#DC3545] text-[#DC3545]",
                                action.priority === "short_term" && "border-[#FFC107] text-[#FFC107]",
                                action.priority === "medium_term" && "border-[#6C757D] text-[#6C757D]"
                              )}
                            >
                              {action.priority.replace("_", " ")}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-xs text-[#6C757D] flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Data Source: {alert.dataSource}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Archive className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                        <Button size="sm" className="bg-[#0A1931] text-white hover:bg-[#0A1931]/90">
                          <Check className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Provenance Footer */}
      <div className="flex items-center justify-between text-xs text-[#6C757D] border-t pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            AI-powered detection
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last scan: {new Date().toLocaleString("en-AU")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-[#4682B4] text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            View All History
          </Button>
          <Button variant="ghost" size="sm" className="text-[#4682B4] text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EarlyWarningSystem;
