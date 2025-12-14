"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RatingHistoryEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  abfi_score: number | null;
  ci_rating: string | null;
  ci_value: number | null;
  sustainability_score: number | null;
  supply_reliability_score: number | null;
  quality_score: number | null;
  traceability_score: number | null;
  trigger_type: string | null;
  calculation_date: string;
}

interface ScoreTrendProps {
  entityType: "feedstock" | "supplier" | "ci_report";
  entityId: string;
  showComponents?: boolean;
  height?: number;
  className?: string;
}

export function ScoreTrend({
  entityType,
  entityId,
  showComponents = false,
  height = 300,
  className,
}: ScoreTrendProps) {
  const [history, setHistory] = useState<RatingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(
          `/api/rating-history?entity_type=${entityType}&entity_id=${entityId}`
        );
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        setHistory(data.history || []);
      } catch (err) {
        setError("Failed to load rating history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [entityType, entityId]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || history.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Score History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          {error || "No historical data available yet"}
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = history
    .slice()
    .reverse()
    .map((entry) => ({
      date: format(new Date(entry.calculation_date), "dd MMM"),
      fullDate: format(new Date(entry.calculation_date), "dd MMM yyyy"),
      abfiScore: entry.abfi_score,
      ciValue: entry.ci_value,
      sustainability: entry.sustainability_score,
      reliability: entry.supply_reliability_score,
      quality: entry.quality_score,
      traceability: entry.traceability_score,
    }));

  // Calculate trend
  const latestScore = history[0]?.abfi_score;
  const previousScore = history.length > 1 ? history[1]?.abfi_score : null;
  const scoreDiff =
    latestScore && previousScore ? latestScore - previousScore : 0;

  const getTrendIcon = () => {
    if (scoreDiff > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (scoreDiff < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendText = () => {
    if (scoreDiff > 0) return `+${scoreDiff.toFixed(1)} from last`;
    if (scoreDiff < 0) return `${scoreDiff.toFixed(1)} from last`;
    return "No change";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Score History</CardTitle>
            <CardDescription>
              ABFI score over time ({history.length} data points)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {getTrendIcon()}
            <span
              className={cn(
                scoreDiff > 0
                  ? "text-green-600"
                  : scoreDiff < 0
                    ? "text-red-600"
                    : "text-gray-500"
              )}
            >
              {getTrendText()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border rounded-lg shadow-lg p-3">
                      <div className="font-medium mb-2">{data.fullDate}</div>
                      {payload.map((entry) => (
                        <div
                          key={entry.dataKey}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-muted-foreground">
                            {entry.name}:
                          </span>
                          <span className="font-medium">
                            {typeof entry.value === "number"
                              ? entry.value.toFixed(1)
                              : "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="abfiScore"
                name="ABFI Score"
                stroke="#1B4332"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              {showComponents && (
                <>
                  <Line
                    type="monotone"
                    dataKey="sustainability"
                    name="Sustainability"
                    stroke="#22c55e"
                    strokeWidth={1}
                    dot={{ r: 2 }}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="reliability"
                    name="Reliability"
                    stroke="#3b82f6"
                    strokeWidth={1}
                    dot={{ r: 2 }}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="quality"
                    name="Quality"
                    stroke="#f59e0b"
                    strokeWidth={1}
                    dot={{ r: 2 }}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="traceability"
                    name="Traceability"
                    stroke="#8b5cf6"
                    strokeWidth={1}
                    dot={{ r: 2 }}
                    strokeDasharray="5 5"
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Compact version for dashboards
 */
export function ScoreTrendMini({
  entityType,
  entityId,
  className,
}: {
  entityType: "feedstock" | "supplier" | "ci_report";
  entityId: string;
  className?: string;
}) {
  const [history, setHistory] = useState<RatingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(
          `/api/rating-history?entity_type=${entityType}&entity_id=${entityId}&limit=10`
        );
        if (response.ok) {
          const data = await response.json();
          setHistory(data.history || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [entityType, entityId]);

  if (loading || history.length < 2) {
    return null;
  }

  const chartData = history
    .slice()
    .reverse()
    .map((entry) => ({
      score: entry.abfi_score || 0,
    }));

  const latestScore = history[0]?.abfi_score || 0;
  const previousScore = history[1]?.abfi_score || 0;
  const trending = latestScore > previousScore ? "up" : latestScore < previousScore ? "down" : "flat";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-8 w-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="score"
              stroke={trending === "up" ? "#22c55e" : trending === "down" ? "#ef4444" : "#6b7280"}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {trending === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
      {trending === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
    </div>
  );
}
