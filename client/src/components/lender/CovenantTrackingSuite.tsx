/**
 * CovenantTrackingSuite - Real-time covenant monitoring with traffic-light indicators
 *
 * Spec: Supply Security (75% threshold), Concentration Risk (HHI 1,500/2,500),
 * Counterparty Quality (>70% investment grade)
 * 90-day forward-looking breach prediction with probability percentages
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
import {
  Shield,
  PieChart,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Lock,
  ExternalLink,
  Clock,
  Calendar,
  ChevronRight,
  FileText,
  RefreshCw,
  Info,
  BarChart3,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CovenantStatus = "compliant" | "warning" | "breach";

interface CovenantMetric {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  threshold: number;
  thresholdType: "min" | "max"; // min = value must be >= threshold, max = value must be <= threshold
  unit: string;
  status: CovenantStatus;
  trend: "improving" | "stable" | "declining";
  lastUpdated: Date;
  verificationSource: string;
  breachProbability90Day: number;
  historicalData: number[];
}

interface CovenantCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  metrics: CovenantMetric[];
  overallStatus: CovenantStatus;
}

interface Project {
  id: string;
  name: string;
  covenants: CovenantCategory[];
}

interface CovenantTrackingSuiteProps {
  projectId?: string;
  className?: string;
}

const DEMO_PROJECT: Project = {
  id: "1",
  name: "Burdekin Renewable Fuels",
  covenants: [
    {
      id: "supply_security",
      name: "Supply Security Covenant",
      icon: <Shield className="h-5 w-5" />,
      description: "Contracted feedstock volume as percentage of required capacity",
      overallStatus: "compliant",
      metrics: [
        {
          id: "contracted_volume",
          name: "Contracted Volume Ratio",
          description: "Percentage of required feedstock under binding contracts",
          currentValue: 82,
          threshold: 75,
          thresholdType: "min",
          unit: "%",
          status: "compliant",
          trend: "improving",
          lastUpdated: new Date(),
          verificationSource: "ABARES Production Forecast + Contract Registry",
          breachProbability90Day: 8,
          historicalData: [72, 74, 76, 78, 79, 80, 79, 81, 82, 81, 82, 82],
        },
        {
          id: "contract_tenor",
          name: "Weighted Avg Contract Tenor",
          description: "Average remaining contract term weighted by volume",
          currentValue: 6.8,
          threshold: 5,
          thresholdType: "min",
          unit: "years",
          status: "compliant",
          trend: "stable",
          lastUpdated: new Date(),
          verificationSource: "Contract Registry",
          breachProbability90Day: 5,
          historicalData: [6.2, 6.3, 6.5, 6.4, 6.6, 6.7, 6.7, 6.8, 6.8, 6.8, 6.8, 6.8],
        },
        {
          id: "replacement_coverage",
          name: "Replacement Coverage",
          description: "Pipeline volume vs. contracts expiring within 24 months",
          currentValue: 135,
          threshold: 100,
          thresholdType: "min",
          unit: "%",
          status: "compliant",
          trend: "improving",
          lastUpdated: new Date(),
          verificationSource: "Contract Pipeline + Expiry Analysis",
          breachProbability90Day: 12,
          historicalData: [110, 112, 118, 120, 122, 125, 128, 130, 132, 133, 135, 135],
        },
      ],
    },
    {
      id: "concentration_risk",
      name: "Concentration Risk Covenant",
      icon: <PieChart className="h-5 w-5" />,
      description: "Supplier diversification requirements to mitigate single-source risk",
      overallStatus: "warning",
      metrics: [
        {
          id: "hhi_index",
          name: "HHI Index",
          description: "Herfindahl-Hirschman Index measuring market concentration",
          currentValue: 1650,
          threshold: 1500,
          thresholdType: "max",
          unit: "",
          status: "warning",
          trend: "improving",
          lastUpdated: new Date(),
          verificationSource: "Supplier Volume Analysis",
          breachProbability90Day: 22,
          historicalData: [1850, 1820, 1780, 1750, 1720, 1700, 1690, 1680, 1670, 1660, 1655, 1650],
        },
        {
          id: "max_supplier",
          name: "Max Single Supplier",
          description: "Largest supplier share of total contracted volume",
          currentValue: 17.5,
          threshold: 20,
          thresholdType: "max",
          unit: "%",
          status: "compliant",
          trend: "stable",
          lastUpdated: new Date(),
          verificationSource: "Supplier Contract Analysis",
          breachProbability90Day: 15,
          historicalData: [19.2, 19.0, 18.8, 18.5, 18.2, 18.0, 17.8, 17.6, 17.5, 17.5, 17.5, 17.5],
        },
        {
          id: "top_5_concentration",
          name: "Top 5 Supplier Concentration",
          description: "Combined market share of top 5 suppliers",
          currentValue: 58,
          threshold: 70,
          thresholdType: "max",
          unit: "%",
          status: "compliant",
          trend: "improving",
          lastUpdated: new Date(),
          verificationSource: "Supplier Analysis",
          breachProbability90Day: 8,
          historicalData: [65, 64, 63, 62, 61, 60, 60, 59, 59, 58, 58, 58],
        },
      ],
    },
    {
      id: "counterparty_quality",
      name: "Counterparty Quality Covenant",
      icon: <Users className="h-5 w-5" />,
      description: "Credit quality requirements for contracted suppliers",
      overallStatus: "compliant",
      metrics: [
        {
          id: "investment_grade",
          name: "Investment Grade %",
          description: "Percentage of volume from investment-grade counterparties",
          currentValue: 76,
          threshold: 70,
          thresholdType: "min",
          unit: "%",
          status: "compliant",
          trend: "improving",
          lastUpdated: new Date(),
          verificationSource: "ASIC + Credit Bureau + Internal Rating",
          breachProbability90Day: 10,
          historicalData: [68, 69, 70, 71, 72, 73, 74, 74, 75, 75, 76, 76],
        },
        {
          id: "verified_suppliers",
          name: "Verified Suppliers",
          description: "Suppliers with complete verification (ABN, ASIC, Credit, Land Title)",
          currentValue: 94,
          threshold: 85,
          thresholdType: "min",
          unit: "%",
          status: "compliant",
          trend: "stable",
          lastUpdated: new Date(),
          verificationSource: "Verification Engine",
          breachProbability90Day: 3,
          historicalData: [88, 89, 90, 91, 92, 93, 93, 94, 94, 94, 94, 94],
        },
        {
          id: "default_rate",
          name: "12-Month Default Rate",
          description: "Rolling 12-month supplier default rate",
          currentValue: 1.2,
          threshold: 5,
          thresholdType: "max",
          unit: "%",
          status: "compliant",
          trend: "improving",
          lastUpdated: new Date(),
          verificationSource: "Payment History Analysis",
          breachProbability90Day: 2,
          historicalData: [2.1, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.3, 1.2, 1.2, 1.2],
        },
      ],
    },
  ],
};

export function CovenantTrackingSuite({
  projectId,
  className,
}: CovenantTrackingSuiteProps) {
  const [project] = useState<Project>(DEMO_PROJECT);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getStatusConfig = (status: CovenantStatus) => {
    switch (status) {
      case "compliant":
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: "Compliant",
          bg: "bg-[#28A745]",
          text: "text-[#28A745]",
          lightBg: "bg-[#28A745]/10",
          border: "border-[#28A745]",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: "Warning",
          bg: "bg-[#FFC107]",
          text: "text-[#FFC107]",
          lightBg: "bg-[#FFC107]/10",
          border: "border-[#FFC107]",
        };
      case "breach":
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: "Breach",
          bg: "bg-[#DC3545]",
          text: "text-[#DC3545]",
          lightBg: "bg-[#DC3545]/10",
          border: "border-[#DC3545]",
        };
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

  const getBreachProbabilityColor = (prob: number) => {
    if (prob < 15) return "text-[#28A745]";
    if (prob < 30) return "text-[#FFC107]";
    return "text-[#DC3545]";
  };

  const filteredCategories = selectedCategory === "all"
    ? project.covenants
    : project.covenants.filter((c) => c.id === selectedCategory);

  // Calculate overall covenant health
  const overallHealth = useMemo(() => {
    const allMetrics = project.covenants.flatMap((c) => c.metrics);
    const compliantCount = allMetrics.filter((m) => m.status === "compliant").length;
    return (compliantCount / allMetrics.length) * 100;
  }, [project]);

  const maxSparklineValue = (data: number[]) => Math.max(...data);
  const minSparklineValue = (data: number[]) => Math.min(...data);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0A1931]" style={{ fontFamily: "Georgia, serif" }}>
            Covenant Tracking Suite
          </h2>
          <p className="text-sm text-[#6C757D]">
            {project.name} • Real-time covenant monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Covenants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Covenants</SelectItem>
              <SelectItem value="supply_security">Supply Security</SelectItem>
              <SelectItem value="concentration_risk">Concentration Risk</SelectItem>
              <SelectItem value="counterparty_quality">Counterparty Quality</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Overall Covenant Health */}
      <Card className="border-2 border-[#0A1931]">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-8 border-[#E9ECEF] flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full border-8"
                    style={{
                      borderColor: overallHealth >= 80 ? "#28A745" : overallHealth >= 60 ? "#FFC107" : "#DC3545",
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                      transform: `rotate(${(overallHealth / 100) * 360 - 90}deg)`,
                    }}
                  />
                  <span className="text-2xl font-bold text-[#0A1931]" style={{ fontFamily: "monospace" }}>
                    {overallHealth.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0A1931]">Overall Covenant Health</h3>
                <p className="text-sm text-[#6C757D]">
                  {project.covenants.flatMap((c) => c.metrics).filter((m) => m.status === "compliant").length} of{" "}
                  {project.covenants.flatMap((c) => c.metrics).length} metrics compliant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {project.covenants.map((category) => {
                const config = getStatusConfig(category.overallStatus);
                return (
                  <div key={category.id} className="text-center">
                    <div className={cn("w-4 h-4 rounded-full mx-auto mb-1", config.bg)} />
                    <span className="text-xs text-[#6C757D]">{category.name.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Covenant Categories */}
      {filteredCategories.map((category) => {
        const statusConfig = getStatusConfig(category.overallStatus);
        return (
          <Card key={category.id} className={cn("border-2", statusConfig.border)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", statusConfig.lightBg, statusConfig.text)}>
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {category.name}
                      <Badge className={cn("text-white", statusConfig.bg)}>
                        {statusConfig.icon}
                        <span className="ml-1">{statusConfig.label}</span>
                      </Badge>
                    </CardTitle>
                    <p className="text-xs text-[#6C757D]">{category.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-[#4682B4]">
                  <FileText className="h-4 w-4 mr-1" />
                  View Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.metrics.map((metric) => {
                const metricConfig = getStatusConfig(metric.status);
                const range = maxSparklineValue(metric.historicalData) - minSparklineValue(metric.historicalData);
                const normalizedData = metric.historicalData.map(
                  (v) => ((v - minSparklineValue(metric.historicalData)) / (range || 1)) * 100
                );

                return (
                  <div
                    key={metric.id}
                    className={cn("p-4 rounded-lg border", metricConfig.lightBg, metricConfig.border)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-[#0A1931]">{metric.name}</span>
                          {getTrendIcon(metric.trend)}
                          <Badge variant="outline" className={cn("text-xs", metricConfig.text, metricConfig.border)}>
                            {metricConfig.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#6C757D]">{metric.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn("text-2xl font-bold", metricConfig.text)}
                            style={{ fontFamily: "monospace" }}
                          >
                            {metric.currentValue.toLocaleString()}{metric.unit}
                          </span>
                        </div>
                        <p className="text-xs text-[#6C757D]">
                          Threshold: {metric.thresholdType === "min" ? "≥" : "≤"} {metric.threshold}{metric.unit}
                        </p>
                      </div>
                    </div>

                    {/* Progress towards threshold */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-[#6C757D] mb-1">
                        <span>Performance vs. Threshold</span>
                        <span>
                          {metric.thresholdType === "min"
                            ? `${((metric.currentValue / metric.threshold) * 100).toFixed(0)}% of minimum`
                            : `${((metric.currentValue / metric.threshold) * 100).toFixed(0)}% of maximum`}
                        </span>
                      </div>
                      <div className="relative h-3 bg-[#E9ECEF] rounded-full overflow-hidden">
                        {/* Threshold marker */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-[#0A1931] z-10"
                          style={{
                            left: metric.thresholdType === "min"
                              ? `${(metric.threshold / Math.max(metric.currentValue, metric.threshold) * 1.2) * 100}%`
                              : `${(metric.threshold / (metric.threshold * 1.5)) * 100}%`,
                          }}
                        />
                        <div
                          className={cn("h-full rounded-full transition-all", metricConfig.bg)}
                          style={{
                            width: metric.thresholdType === "min"
                              ? `${Math.min((metric.currentValue / (metric.threshold * 1.2)) * 100, 100)}%`
                              : `${Math.min((metric.currentValue / (metric.threshold * 1.5)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Sparkline and 90-day prediction */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Mini sparkline */}
                        <div className="flex items-end gap-0.5 h-6">
                          {normalizedData.map((value, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-1.5 rounded-t transition-all",
                                i === normalizedData.length - 1 ? metricConfig.bg : "bg-[#6C757D]/30"
                              )}
                              style={{ height: `${Math.max(value, 10)}%` }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#6C757D]">12-month trend</span>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* 90-day breach probability */}
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-[#6C757D]" />
                          <span className="text-xs text-[#6C757D]">90-day breach risk:</span>
                          <span
                            className={cn("text-sm font-bold", getBreachProbabilityColor(metric.breachProbability90Day))}
                            style={{ fontFamily: "monospace" }}
                          >
                            {metric.breachProbability90Day}%
                          </span>
                        </div>

                        {/* Verification source */}
                        <div className="flex items-center gap-1 text-xs text-[#4682B4]">
                          <Lock className="h-3 w-3" />
                          <span>{metric.verificationSource}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {/* 90-Day Forward Prediction Summary */}
      <Card className="bg-[#0A1931] text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#B8860B]" />
            90-Day Forward-Looking Breach Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {project.covenants.map((category) => {
              const avgBreachProb = category.metrics.reduce((acc, m) => acc + m.breachProbability90Day, 0) / category.metrics.length;
              return (
                <div key={category.id} className="text-center">
                  <div className="text-3xl font-bold mb-1" style={{ fontFamily: "monospace" }}>
                    <span className={getBreachProbabilityColor(avgBreachProb)}>
                      {avgBreachProb.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-white/70">{category.name.split(" ").slice(0, 2).join(" ")}</p>
                  <p className="text-xs text-white/50">Breach Probability</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Info className="h-3 w-3" />
              <span>Predictions based on BoM climate data, ABARES forecasts, and historical patterns</span>
            </div>
            <Button variant="ghost" size="sm" className="text-[#B8860B] hover:bg-white/10">
              <BarChart3 className="h-4 w-4 mr-1" />
              View Methodology
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Provenance Footer */}
      <div className="flex items-center justify-between text-xs text-[#6C757D] border-t pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Triple-source verified
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last updated: {new Date().toLocaleString("en-AU")}
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

export default CovenantTrackingSuite;
