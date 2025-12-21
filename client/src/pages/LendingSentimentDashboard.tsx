import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Building2,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const FEAR_COLORS: Record<string, string> = {
  regulatory_risk: "#ef4444",
  technology_risk: "#f97316",
  feedstock_risk: "#eab308",
  counterparty_risk: "#22c55e",
  market_risk: "#3b82f6",
  esg_concerns: "#8b5cf6",
};

const FEAR_LABELS: Record<string, string> = {
  regulatory_risk: "Regulatory",
  technology_risk: "Technology",
  feedstock_risk: "Feedstock",
  counterparty_risk: "Counterparty",
  market_risk: "Market",
  esg_concerns: "ESG",
};

export default function LendingSentimentDashboard() {
  const [period, setPeriod] = useState<"1m" | "3m" | "6m" | "12m" | "24m">("12m");
  const [feedFilter, setFeedFilter] = useState<string>("all");

  // tRPC queries
  const indexQuery = trpc.sentiment.getIndex.useQuery();
  const trendQuery = trpc.sentiment.getTrend.useQuery({ period });
  const lendersQuery = trpc.sentiment.getLenders.useQuery({ limit: 8 });
  const docsQuery = trpc.sentiment.getDocumentFeed.useQuery({ limit: 15 });

  const sentimentIndex = indexQuery.data;
  const sentimentTrend = trendQuery.data || [];
  const lenderScores = lendersQuery.data || [];
  const documentFeed = docsQuery.data || [];

  const loading = indexQuery.isLoading || trendQuery.isLoading || lendersQuery.isLoading || docsQuery.isLoading;
  const error = indexQuery.error?.message || trendQuery.error?.message || lendersQuery.error?.message || docsQuery.error?.message;

  const loadData = () => {
    indexQuery.refetch();
    trendQuery.refetch();
    lendersQuery.refetch();
    docsQuery.refetch();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "BULLISH":
        return "bg-green-100 text-green-800";
      case "BEARISH":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "BULLISH":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "BEARISH":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const fearComponentsData = sentimentIndex
    ? Object.entries(sentimentIndex.fear_components).map(([key, value]) => ({
        name: FEAR_LABELS[key] || key,
        value: value,
        color: FEAR_COLORS[key] || "#888",
      }))
    : [];

  if (loading && !sentimentIndex) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 space-y-6">
          <Skeleton className="h-12 w-96" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/for-lenders">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Lending Sentiment Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered analysis of bioenergy lending sentiment from 47+ data sources
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={(v) => setPeriod(v as "1m" | "3m" | "6m" | "12m" | "24m")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="12m">12 Months</SelectItem>
                <SelectItem value="24m">24 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overall Sentiment Index</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-primary">
                  {sentimentIndex?.overall_index || 0}
                </span>
                {sentimentIndex?.daily_change !== undefined && (
                  <Badge
                    variant="outline"
                    className={
                      sentimentIndex.daily_change > 0
                        ? "text-green-600 border-green-600"
                        : sentimentIndex.daily_change < 0
                          ? "text-red-600 border-red-600"
                          : ""
                    }
                  >
                    {sentimentIndex.daily_change > 0 ? "+" : ""}
                    {sentimentIndex.daily_change.toFixed(1)}%
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Scale: -100 (bearish) to +100 (bullish)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Bullish Signals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <span className="text-4xl font-bold text-green-600">
                  {sentimentIndex?.bullish_count || 0}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {sentimentIndex?.weekly_change !== undefined && (
                  <>+{sentimentIndex.weekly_change.toFixed(1)}% vs last week</>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Bearish Signals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-8 w-8 text-red-600" />
                <span className="text-4xl font-bold text-red-600">
                  {sentimentIndex?.bearish_count || 0}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Risk factors tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Documents Analyzed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-4xl font-bold">
                  {(sentimentIndex?.documents_analyzed || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sentiment Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Trend</CardTitle>
                <CardDescription>
                  Bullish vs bearish sentiment over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sentimentTrend.slice(-90)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-AU")
                      }
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="bullish"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                      name="Bullish"
                    />
                    <Area
                      type="monotone"
                      dataKey="bearish"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Bearish"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Fear Component Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Fear Component Breakdown</CardTitle>
                <CardDescription>
                  Distribution of risk factors in bearish signals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={fearComponentsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {fearComponentsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Lender Comparison Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Lender Sentiment Matrix
                </CardTitle>
                <CardDescription>
                  Sentiment by lender based on recent publications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lenderScores.map((lender) => (
                    <div
                      key={lender.lender}
                      className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{lender.lender}</div>
                        <div className="text-sm text-muted-foreground">
                          {lender.documents} documents
                        </div>
                      </div>
                      <div className="w-24 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={lender.trend.map((v, i) => ({ value: v }))}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={lender.sentiment >= 0 ? "#22c55e" : "#ef4444"}
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-right w-20">
                        <div
                          className={`text-lg font-bold ${
                            lender.sentiment >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {lender.sentiment > 0 ? "+" : ""}
                          {lender.sentiment}
                        </div>
                        <div
                          className={`text-xs ${
                            lender.change_30d >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {lender.change_30d > 0 ? "+" : ""}
                          {lender.change_30d}% 30d
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Document Feed */}
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Latest Documents
                  </CardTitle>
                  <Select value={feedFilter} onValueChange={setFeedFilter}>
                    <SelectTrigger className="w-24 h-8 text-xs">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="BULLISH">Bullish</SelectItem>
                      <SelectItem value="BEARISH">Bearish</SelectItem>
                      <SelectItem value="NEUTRAL">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {documentFeed
                  .filter((doc) => feedFilter === "all" || doc.sentiment === feedFilter)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        {getSentimentIcon(doc.sentiment)}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2">
                            {doc.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {doc.source}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(doc.published_date).toLocaleDateString(
                                "en-AU",
                                { day: "numeric", month: "short" }
                              )}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getSentimentColor(doc.sentiment)}`}
                            >
                              {doc.sentiment.toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Related Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/feedstock-prices">
                  <Button variant="outline" className="w-full justify-between">
                    Feedstock Price Index
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/policy-carbon">
                  <Button variant="outline" className="w-full justify-between">
                    Policy & Carbon Revenue
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/stress-testing">
                  <Button variant="outline" className="w-full justify-between">
                    Stress Testing
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/stealth-discovery">
                  <Button variant="outline" className="w-full justify-between">
                    Stealth Discovery
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
