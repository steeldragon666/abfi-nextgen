/**
 * BankabilityScoreCard - 10-minute institutional-grade supply security scoring
 *
 * Spec: Automated counterparty quality rating with APRA-compliant documentation
 * Four-pillar scoring: Contracted Volume (30%), Grower Diversification (25%),
 * Regional Capacity (25%), Climate Resilience (20%)
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  RefreshCw,
  Building2,
  Users,
  MapPin,
  CloudRain,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScorePillar {
  id: string;
  name: string;
  score: number;
  weight: number;
  trend: "up" | "down" | "stable";
  lastUpdated: Date;
  details: string;
}

interface BankabilityData {
  overallScore: number;
  grade: "Investment Grade" | "Speculative Grade";
  gradeDetail: string;
  pillars: ScorePillar[];
  forecastConfidence: number;
  lastAssessment: Date;
  nextReview: Date;
}

interface BankabilityScoreCardProps {
  projectId?: string;
  projectName?: string;
  onGenerateLenderPackage?: () => void;
  className?: string;
}

// Demo data matching spec requirements
const DEMO_BANKABILITY: BankabilityData = {
  overallScore: 78,
  grade: "Investment Grade",
  gradeDetail: "BBB+ equivalent - Adequate capacity to meet financial commitments",
  pillars: [
    {
      id: "contracted_volume",
      name: "Contracted Volume",
      score: 82,
      weight: 30,
      trend: "up",
      lastUpdated: new Date(),
      details: "450,000 tonnes under binding offtake agreements",
    },
    {
      id: "grower_diversification",
      name: "Grower Diversification",
      score: 75,
      weight: 25,
      trend: "stable",
      lastUpdated: new Date(),
      details: "47 verified growers across 3 regions",
    },
    {
      id: "regional_capacity",
      name: "Regional Capacity",
      score: 80,
      weight: 25,
      trend: "up",
      lastUpdated: new Date(),
      details: "2.1M tonnes available within 150km radius",
    },
    {
      id: "climate_resilience",
      name: "Climate Resilience",
      score: 72,
      weight: 20,
      trend: "down",
      lastUpdated: new Date(),
      details: "Moderate drought exposure; irrigation backup available",
    },
  ],
  forecastConfidence: 92,
  lastAssessment: new Date(),
  nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
};

export function BankabilityScoreCard({
  projectId,
  projectName = "Burdekin Renewable Fuels",
  onGenerateLenderPackage,
  className,
}: BankabilityScoreCardProps) {
  const [data, setData] = useState<BankabilityData>(DEMO_BANKABILITY);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getGradeColor = (grade: string) => {
    return grade === "Investment Grade"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-amber-100 text-amber-800 border-amber-300";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <span className="h-4 w-4 text-gray-400">—</span>;
    }
  };

  const getPillarIcon = (id: string) => {
    switch (id) {
      case "contracted_volume":
        return <FileText className="h-5 w-5" />;
      case "grower_diversification":
        return <Users className="h-5 w-5" />;
      case "regional_capacity":
        return <MapPin className="h-5 w-5" />;
      case "climate_resilience":
        return <CloudRain className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setData({
      ...data,
      lastAssessment: new Date(),
    });
    setIsRefreshing(false);
  };

  const weightedScore = data.pillars.reduce(
    (acc, pillar) => acc + (pillar.score * pillar.weight) / 100,
    0
  );

  return (
    <Card className={cn("border-2 border-[#0A1931]", className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-[#0A1931] to-[#1a3a5c] text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-[#D4AF37]" />
            <div>
              <CardTitle className="text-lg">Supply Security Score</CardTitle>
              <p className="text-sm text-gray-300">{projectName}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-white hover:bg-white/10"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Main Score Display */}
        <div className="flex items-center justify-between">
          <div className="relative">
            {/* Semicircular gauge */}
            <div className="relative w-40 h-20 overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-center">
                <div
                  className="w-40 h-40 rounded-full border-8 border-gray-200"
                  style={{
                    clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                  }}
                />
                <div
                  className={cn(
                    "absolute w-40 h-40 rounded-full border-8",
                    getScoreBgColor(data.overallScore)
                  )}
                  style={{
                    clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                    transform: `rotate(${(data.overallScore / 100) * 180 - 180}deg)`,
                    transformOrigin: "center center",
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pt-6">
                <span
                  className={cn(
                    "text-4xl font-bold tabular-nums",
                    getScoreColor(data.overallScore)
                  )}
                >
                  {data.overallScore}
                </span>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">out of 100</span>
            </div>
          </div>

          <div className="text-right space-y-2">
            <Badge
              className={cn("text-sm font-semibold", getGradeColor(data.grade))}
            >
              {data.grade}
            </Badge>
            <p className="text-xs text-gray-600 max-w-[200px]">
              {data.gradeDetail}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              <span>{data.forecastConfidence}% forecast confidence</span>
            </div>
          </div>
        </div>

        {/* Four Pillars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#0A1931]">
              Scoring Pillars
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>

          {data.pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-gray-50 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-[#0A1931]">{getPillarIcon(pillar.id)}</div>
                  <span className="text-sm font-medium">{pillar.name}</span>
                  <span className="text-xs text-gray-500">
                    ({pillar.weight}% weight)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(pillar.trend)}
                  <span
                    className={cn(
                      "text-lg font-bold tabular-nums",
                      getScoreColor(pillar.score)
                    )}
                  >
                    {pillar.score}
                  </span>
                </div>
              </div>
              <Progress
                value={pillar.score}
                className="h-2"
              />
              {showDetails && (
                <p className="text-xs text-gray-600 flex items-start gap-1">
                  <Info className="h-3 w-3 mt-0.5 shrink-0" />
                  {pillar.details}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Weighted Calculation */}
        <div className="bg-[#0A1931]/5 rounded-lg p-3 border border-[#0A1931]/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Weighted Score Calculation</span>
            <span className="font-mono font-semibold">
              {weightedScore.toFixed(1)} / 100
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Based on APRA-compliant four-pillar methodology
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={onGenerateLenderPackage}
            className="flex-1 bg-[#D4AF37] text-[#0A1931] hover:bg-[#D4AF37]/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Lender Package
          </Button>
        </div>

        {/* Data Provenance */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span>APRA-compliant methodology</span>
          </div>
          <span>
            Last updated:{" "}
            {data.lastAssessment.toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default BankabilityScoreCard;
