/**
 * PortfolioOverviewDashboard - Executive summary for institutional lenders
 *
 * Spec: Total exposure, active projects, portfolio health distribution
 * Multi-project compliance trend, counterparty exposure matrix
 * Real-time covenant compliance aggregated across all investments
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  PieChart,
  Users,
  DollarSign,
  BarChart3,
  RefreshCw,
  Download,
  ExternalLink,
  Lock,
  Clock,
  Eye,
  FileText,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  location: string;
  exposure: number;
  supplySecurityScore: number;
  concentrationRisk: number; // HHI
  counterpartyQuality: number;
  covenantStatus: "compliant" | "warning" | "breach";
  dscr: number;
  carbonCollateral: number;
  trend: "improving" | "stable" | "declining";
}

interface PortfolioMetrics {
  totalExposure: number;
  activeProjects: number;
  healthyCount: number;
  watchlistCount: number;
  criticalCount: number;
  avgSupplySecurityScore: number;
  avgHHI: number;
  investmentGradePercent: number;
  totalCarbonCollateral: number;
}

interface ComplianceTrend {
  month: string;
  supplySecurityAvg: number;
  concentrationRiskAvg: number;
  counterpartyQualityAvg: number;
}

interface PortfolioOverviewDashboardProps {
  className?: string;
}

const DEMO_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Burdekin Renewable Fuels",
    location: "QLD North",
    exposure: 85000000,
    supplySecurityScore: 82,
    concentrationRisk: 1450,
    counterpartyQuality: 78,
    covenantStatus: "compliant",
    dscr: 1.45,
    carbonCollateral: 2400000,
    trend: "improving",
  },
  {
    id: "2",
    name: "Mackay Bioenergy Hub",
    location: "QLD Central",
    exposure: 120000000,
    supplySecurityScore: 76,
    concentrationRisk: 1850,
    counterpartyQuality: 72,
    covenantStatus: "warning",
    dscr: 1.28,
    carbonCollateral: 3100000,
    trend: "stable",
  },
  {
    id: "3",
    name: "Darling Downs SAF",
    location: "QLD South",
    exposure: 65000000,
    supplySecurityScore: 88,
    concentrationRisk: 1200,
    counterpartyQuality: 85,
    covenantStatus: "compliant",
    dscr: 1.62,
    carbonCollateral: 1800000,
    trend: "improving",
  },
  {
    id: "4",
    name: "Northern Rivers Biogas",
    location: "NSW North",
    exposure: 45000000,
    supplySecurityScore: 68,
    concentrationRisk: 2100,
    counterpartyQuality: 65,
    covenantStatus: "warning",
    dscr: 1.15,
    carbonCollateral: 950000,
    trend: "declining",
  },
  {
    id: "5",
    name: "Wide Bay Ethanol",
    location: "QLD Central",
    exposure: 55000000,
    supplySecurityScore: 58,
    concentrationRisk: 2650,
    counterpartyQuality: 62,
    covenantStatus: "breach",
    dscr: 0.98,
    carbonCollateral: 1200000,
    trend: "declining",
  },
];

const COMPLIANCE_TREND: ComplianceTrend[] = [
  { month: "Feb", supplySecurityAvg: 72, concentrationRiskAvg: 1680, counterpartyQualityAvg: 70 },
  { month: "Mar", supplySecurityAvg: 73, concentrationRiskAvg: 1650, counterpartyQualityAvg: 71 },
  { month: "Apr", supplySecurityAvg: 74, concentrationRiskAvg: 1620, counterpartyQualityAvg: 72 },
  { month: "May", supplySecurityAvg: 73, concentrationRiskAvg: 1640, counterpartyQualityAvg: 71 },
  { month: "Jun", supplySecurityAvg: 75, concentrationRiskAvg: 1600, counterpartyQualityAvg: 73 },
  { month: "Jul", supplySecurityAvg: 76, concentrationRiskAvg: 1580, counterpartyQualityAvg: 74 },
  { month: "Aug", supplySecurityAvg: 77, concentrationRiskAvg: 1560, counterpartyQualityAvg: 75 },
  { month: "Sep", supplySecurityAvg: 76, concentrationRiskAvg: 1590, counterpartyQualityAvg: 74 },
  { month: "Oct", supplySecurityAvg: 78, concentrationRiskAvg: 1550, counterpartyQualityAvg: 76 },
  { month: "Nov", supplySecurityAvg: 79, concentrationRiskAvg: 1520, counterpartyQualityAvg: 77 },
  { month: "Dec", supplySecurityAvg: 80, concentrationRiskAvg: 1500, counterpartyQualityAvg: 78 },
  { month: "Jan", supplySecurityAvg: 78, concentrationRiskAvg: 1540, counterpartyQualityAvg: 76 },
];

export function PortfolioOverviewDashboard({
  className,
}: PortfolioOverviewDashboardProps) {
  const [projects] = useState<Project[]>(DEMO_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate portfolio metrics
  const metrics = useMemo((): PortfolioMetrics => {
    const totalExposure = projects.reduce((acc, p) => acc + p.exposure, 0);
    const healthyCount = projects.filter((p) => p.covenantStatus === "compliant").length;
    const watchlistCount = projects.filter((p) => p.covenantStatus === "warning").length;
    const criticalCount = projects.filter((p) => p.covenantStatus === "breach").length;
    const avgSupplySecurityScore = projects.reduce((acc, p) => acc + p.supplySecurityScore, 0) / projects.length;
    const avgHHI = projects.reduce((acc, p) => acc + p.concentrationRisk, 0) / projects.length;
    const investmentGradePercent = (projects.filter((p) => p.counterpartyQuality >= 70).length / projects.length) * 100;
    const totalCarbonCollateral = projects.reduce((acc, p) => acc + p.carbonCollateral, 0);

    return {
      totalExposure,
      activeProjects: projects.length,
      healthyCount,
      watchlistCount,
      criticalCount,
      avgSupplySecurityScore,
      avgHHI,
      investmentGradePercent,
      totalCarbonCollateral,
    };
  }, [projects]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const getStatusBadge = (status: "compliant" | "warning" | "breach") => {
    switch (status) {
      case "compliant":
        return (
          <Badge className="bg-[#28A745] text-white">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Compliant
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-[#FFC107] text-black">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      case "breach":
        return (
          <Badge className="bg-[#DC3545] text-white">
            <XCircle className="h-3 w-3 mr-1" />
            Breach
          </Badge>
        );
    }
  };

  const getTrendIcon = (trend: "improving" | "stable" | "declining") => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-[#28A745]" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-[#DC3545]" />;
      default:
        return <span className="text-[#6C757D]">—</span>;
    }
  };

  const getHHIStatus = (hhi: number) => {
    if (hhi < 1500) return { label: "Preferred", color: "text-[#28A745]", bg: "bg-[#28A745]" };
    if (hhi < 2500) return { label: "Moderate", color: "text-[#FFC107]", bg: "bg-[#FFC107]" };
    return { label: "High Risk", color: "text-[#DC3545]", bg: "bg-[#DC3545]" };
  };

  const maxTrendScore = Math.max(...COMPLIANCE_TREND.map((t) => t.supplySecurityAvg));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Verification Badges */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1931]" style={{ fontFamily: "Georgia, serif" }}>
            Portfolio Overview
          </h1>
          <p className="text-sm text-[#6C757D]">
            Bioenergy Investment Portfolio • Last updated: {new Date().toLocaleString("en-AU")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-[#0A1931] text-[#0A1931]">
            <Building2 className="h-3 w-3 mr-1" />
            NAB Partner
          </Badge>
          <Badge variant="outline" className="border-[#28A745] text-[#28A745]">
            <Shield className="h-3 w-3 mr-1" />
            APRA Compliant
          </Badge>
          <Badge variant="outline" className="border-[#B8860B] text-[#B8860B]">
            <Leaf className="h-3 w-3 mr-1" />
            CER Endorsed
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {metrics.criticalCount > 0 && (
        <div className="bg-[#DC3545] text-white rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <XCircle className="h-6 w-6" />
            <div>
              <p className="font-semibold">
                {metrics.criticalCount} Project{metrics.criticalCount > 1 ? "s" : ""} in Covenant Breach
              </p>
              <p className="text-sm text-white/80">
                Immediate attention required. Credit committee notification sent.
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="bg-white text-[#DC3545] hover:bg-white/90">
            View Breaches
          </Button>
        </div>
      )}

      {/* Portfolio Health Summary - 6 Panel Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Exposure */}
        <Card className="border-2 border-[#0A1931]">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-[#6C757D] text-xs mb-1">
              <DollarSign className="h-4 w-4" />
              Total Exposure
            </div>
            <div className="text-2xl font-bold text-[#0A1931]" style={{ fontFamily: "monospace" }}>
              {formatCurrency(metrics.totalExposure)}
            </div>
            <div className="text-xs text-[#6C757D] mt-1">
              {metrics.activeProjects} active projects
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Health Gauge */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-[#6C757D] text-xs mb-2">
              <PieChart className="h-4 w-4" />
              Portfolio Health
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 rounded-full bg-[#E9ECEF] overflow-hidden flex">
                <div
                  className="h-full bg-[#28A745]"
                  style={{ width: `${(metrics.healthyCount / metrics.activeProjects) * 100}%` }}
                />
                <div
                  className="h-full bg-[#FFC107]"
                  style={{ width: `${(metrics.watchlistCount / metrics.activeProjects) * 100}%` }}
                />
                <div
                  className="h-full bg-[#DC3545]"
                  style={{ width: `${(metrics.criticalCount / metrics.activeProjects) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-[#28A745]">{metrics.healthyCount} Healthy</span>
              <span className="text-[#FFC107]">{metrics.watchlistCount} Watch</span>
              <span className="text-[#DC3545]">{metrics.criticalCount} Critical</span>
            </div>
          </CardContent>
        </Card>

        {/* Supply Security Score */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-[#6C757D] text-xs mb-1">
              <Shield className="h-4 w-4" />
              Avg Supply Security
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-2xl font-bold",
                  metrics.avgSupplySecurityScore >= 75 ? "text-[#28A745]" : "text-[#FFC107]"
                )}
                style={{ fontFamily: "monospace" }}
              >
                {metrics.avgSupplySecurityScore.toFixed(0)}%
              </span>
              <TrendingUp className="h-4 w-4 text-[#28A745]" />
            </div>
            <div className="text-xs text-[#6C757D] mt-1">
              Threshold: 75%
            </div>
          </CardContent>
        </Card>

        {/* HHI Index */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-[#6C757D] text-xs mb-1">
              <BarChart3 className="h-4 w-4" />
              Avg HHI Index
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn("text-2xl font-bold", getHHIStatus(metrics.avgHHI).color)}
                style={{ fontFamily: "monospace" }}
              >
                {metrics.avgHHI.toFixed(0)}
              </span>
              <Badge className={cn("text-xs", getHHIStatus(metrics.avgHHI).bg, "text-white")}>
                {getHHIStatus(metrics.avgHHI).label}
              </Badge>
            </div>
            <div className="text-xs text-[#6C757D] mt-1">
              &lt;1,500 Preferred
            </div>
          </CardContent>
        </Card>

        {/* Investment Grade */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-[#6C757D] text-xs mb-1">
              <Users className="h-4 w-4" />
              Investment Grade
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-2xl font-bold",
                  metrics.investmentGradePercent >= 70 ? "text-[#28A745]" : "text-[#FFC107]"
                )}
                style={{ fontFamily: "monospace" }}
              >
                {metrics.investmentGradePercent.toFixed(0)}%
              </span>
            </div>
            <div className="text-xs text-[#6C757D] mt-1">
              Threshold: &gt;70%
            </div>
          </CardContent>
        </Card>

        {/* Carbon Collateral */}
        <Card className="border-[#B8860B]">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-[#6C757D] text-xs mb-1">
              <Leaf className="h-4 w-4 text-[#B8860B]" />
              Carbon Collateral
            </div>
            <div className="text-2xl font-bold text-[#B8860B]" style={{ fontFamily: "monospace" }}>
              {formatCurrency(metrics.totalCarbonCollateral)}
            </div>
            <div className="text-xs text-[#6C757D] mt-1">
              ACCU holdings value
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#0A1931]" />
              12-Month Compliance Trend
            </CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-[#0A1931]" />
                Supply Security
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-[#4682B4]" />
                Counterparty Quality
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-32">
            {COMPLIANCE_TREND.map((point) => (
              <div key={point.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end h-24">
                  <div
                    className="flex-1 bg-[#0A1931] rounded-t transition-all"
                    style={{ height: `${(point.supplySecurityAvg / maxTrendScore) * 100}%` }}
                    title={`Supply Security: ${point.supplySecurityAvg}%`}
                  />
                  <div
                    className="flex-1 bg-[#4682B4] rounded-t transition-all"
                    style={{ height: `${(point.counterpartyQualityAvg / maxTrendScore) * 100}%` }}
                    title={`Counterparty Quality: ${point.counterpartyQualityAvg}%`}
                  />
                </div>
                <span className="text-xs text-[#6C757D]">{point.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Counterparty Exposure Matrix */}
      <Card>
        <CardHeader className="pb-2 bg-[#0A1931] text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#B8860B]" />
              Counterparty Exposure Matrix
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-1" />
                APRA Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F9FA] border-b">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6C757D]">Project</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6C757D]">Exposure</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#6C757D]">Supply Security</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#6C757D]">HHI</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#6C757D]">Counterparty</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#6C757D]">DSCR</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#6C757D]">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#6C757D]">Trend</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#6C757D]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const hhiStatus = getHHIStatus(project.concentrationRisk);
                  return (
                    <tr
                      key={project.id}
                      className={cn(
                        "border-b hover:bg-[#F8F9FA] transition-colors",
                        project.covenantStatus === "breach" && "bg-[#DC3545]/5"
                      )}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-sm text-[#0A1931]">{project.name}</div>
                          <div className="text-xs text-[#6C757D]">{project.location}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-sm font-semibold">
                          {formatCurrency(project.exposure)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "font-mono text-sm font-semibold",
                            project.supplySecurityScore >= 75 ? "text-[#28A745]" :
                            project.supplySecurityScore >= 60 ? "text-[#FFC107]" : "text-[#DC3545]"
                          )}
                        >
                          {project.supplySecurityScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("font-mono text-sm font-semibold", hhiStatus.color)}>
                          {project.concentrationRisk.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "font-mono text-sm font-semibold",
                            project.counterpartyQuality >= 70 ? "text-[#28A745]" : "text-[#FFC107]"
                          )}
                        >
                          {project.counterpartyQuality}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "font-mono text-sm font-semibold",
                            project.dscr >= 1.25 ? "text-[#28A745]" :
                            project.dscr >= 1.0 ? "text-[#FFC107]" : "text-[#DC3545]"
                          )}
                        >
                          {project.dscr.toFixed(2)}x
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(project.covenantStatus)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getTrendIcon(project.trend)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Data Provenance Footer */}
      <div className="flex items-center justify-between text-xs text-[#6C757D] border-t pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            All data auto-verified
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            ABARES: 24h • BoM: 6h • Satellite: 48h
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-[#4682B4] text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            View Audit Trail
          </Button>
          <Button variant="ghost" size="sm" className="text-[#4682B4] text-xs">
            <FileText className="h-3 w-3 mr-1" />
            APRA Export
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PortfolioOverviewDashboard;
