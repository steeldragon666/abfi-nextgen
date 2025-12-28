import { useState } from "react";
import { H1, H2, H3, H4, Body, MetricValue, DataLabel } from "@/components/Typography";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Globe,
  ChevronRight,
  BarChart3,
  LineChart as LineChartIcon,
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
  ComposedChart,
} from "recharts";

const COMMODITY_COLORS: Record<string, string> = {
  UCO: "#22c55e",
  Tallow: "#3b82f6",
  Canola: "#f97316",
  "Palm Oil": "#8b5cf6",
  PFAD: "#eab308",
};

const REGION_COLORS: Record<string, string> = {
  AUS: "#22c55e",
  SEA: "#3b82f6",
  EU: "#f97316",
  NA: "#8b5cf6",
  LATAM: "#eab308",
};

export default function FeedstockPriceDashboard() {
  const [selectedCommodity, setSelectedCommodity] = useState("UCO");
  const [period, setPeriod] = useState<"1M" | "3M" | "6M" | "1Y" | "2Y">("1Y");

  // tRPC queries
  const kpisQuery = trpc.prices.getKPIs.useQuery();
  const ohlcQuery = trpc.prices.getOHLC.useQuery({
    commodity: selectedCommodity,
    region: "AUS",
    period,
  });
  const heatmapQuery = trpc.prices.getHeatmap.useQuery({ commodity: selectedCommodity });
  const forwardQuery = trpc.prices.getForwardCurve.useQuery({
    commodity: selectedCommodity,
    region: "AUS",
  });
  const technicalsQuery = trpc.prices.getTechnicals.useQuery({
    commodity: selectedCommodity,
    region: "AUS",
  });

  const priceKPIs = kpisQuery.data || [];
  const ohlcData = ohlcQuery.data;
  const regionalData = heatmapQuery.data;
  const forwardCurve = forwardQuery.data;
  const technicals = technicalsQuery.data || [];

  const loading =
    kpisQuery.isLoading ||
    ohlcQuery.isLoading ||
    heatmapQuery.isLoading ||
    forwardQuery.isLoading ||
    technicalsQuery.isLoading;

  const error =
    kpisQuery.error?.message ||
    ohlcQuery.error?.message ||
    heatmapQuery.error?.message ||
    forwardQuery.error?.message ||
    technicalsQuery.error?.message;

  const loadData = () => {
    kpisQuery.refetch();
    ohlcQuery.refetch();
    heatmapQuery.refetch();
    forwardQuery.refetch();
    technicalsQuery.refetch();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getChangeIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "buy":
        return "bg-green-100 text-green-800";
      case "sell":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Transform OHLC data for candlestick-style visualization
  const chartData = ohlcData?.data.slice(-60).map((d) => ({
    date: d.date,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: d.volume,
    range: [d.low, d.high],
    body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    color: d.close >= d.open ? "#22c55e" : "#ef4444",
  })) || [];

  if (loading && !ohlcData) {
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
              <p className="text-gray-600 mb-4">{error}</p>
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
            <h1 className="text-3xl font-bold">Feedstock Price Index</h1>
            <p className="text-gray-600 mt-1">
              IOSCO-compliant pricing methodology for biofuel feedstocks
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Commodity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UCO">UCO</SelectItem>
                <SelectItem value="tallow">Tallow</SelectItem>
                <SelectItem value="canola">Canola</SelectItem>
                <SelectItem value="palm">Palm Oil</SelectItem>
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={(v) => setPeriod(v as "1M" | "3M" | "6M" | "1Y" | "2Y")}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="2Y">2 Years</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Price KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {priceKPIs.map((kpi) => (
            <Card
              key={kpi.commodity}
              className={`cursor-pointer transition-all ${
                selectedCommodity.toUpperCase() === kpi.commodity.toUpperCase()
                  ? "ring-2 ring-primary"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => setSelectedCommodity(kpi.commodity.toLowerCase())}
            >
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COMMODITY_COLORS[kpi.commodity] || "#888" }}
                  />
                  {kpi.commodity}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">
                    {formatCurrency(kpi.price)}
                  </span>
                  <span className="text-sm text-gray-600 mb-1">
                    /{kpi.unit}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(kpi.change_direction)}
                  <span
                    className={`text-sm ${
                      kpi.change_direction === "up"
                        ? "text-green-600"
                        : kpi.change_direction === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {kpi.change_pct > 0 ? "+" : ""}
                    {kpi.change_pct.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <LineChartIcon className="h-5 w-5" />
                      {selectedCommodity.toUpperCase()} Price Chart
                    </CardTitle>
                    <CardDescription>
                      OHLC data with volume overlay
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {ohlcData?.source || "ABFI Internal"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      yAxisId="price"
                      domain={["auto", "auto"]}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <YAxis
                      yAxisId="volume"
                      orientation="right"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-AU")
                      }
                      formatter={(value: any, name: string) => {
                        if (name === "volume") return [`${(value / 1000).toFixed(1)}k MT`, "Volume"];
                        return [`$${value.toFixed(2)}`, name];
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="volume"
                      dataKey="volume"
                      fill="#e5e7eb"
                      opacity={0.5}
                      name="Volume"
                    />
                    <Line
                      yAxisId="price"
                      type="monotone"
                      dataKey="high"
                      stroke="#22c55e"
                      strokeWidth={1}
                      dot={false}
                      name="High"
                    />
                    <Line
                      yAxisId="price"
                      type="monotone"
                      dataKey="low"
                      stroke="#ef4444"
                      strokeWidth={1}
                      dot={false}
                      name="Low"
                    />
                    <Line
                      yAxisId="price"
                      type="monotone"
                      dataKey="close"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      name="Close"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Forward Curve */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Forward Curve
                </CardTitle>
                <CardDescription>
                  {forwardCurve?.curve_shape
                    ? `Market structure: ${forwardCurve.curve_shape}`
                    : "Loading forward curve..."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={forwardCurve?.points || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tenor" />
                    <YAxis tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Price"]} />
                    <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                      {forwardCurve?.points.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.change_from_spot > 0
                              ? "#22c55e"
                              : entry.change_from_spot < 0
                                ? "#ef4444"
                                : "#3b82f6"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {forwardCurve && (
                  <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500" />
                      <span>Contango</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500" />
                      <span>Backwardation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500" />
                      <span>Spot</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Regional Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Prices
                </CardTitle>
                <CardDescription>
                  {selectedCommodity.toUpperCase()} prices by region
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {regionalData?.regions.map((region) => (
                  <div
                    key={region.region}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: REGION_COLORS[region.region] || "#888" }}
                      />
                      <div>
                        <div className="font-medium">{region.region_name}</div>
                        <div className="text-xs text-gray-600">
                          {region.region}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(region.price)}</div>
                      <div
                        className={`text-xs ${
                          region.change_pct >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {region.change_pct >= 0 ? "+" : ""}
                        {region.change_pct.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Technical Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {technicals.map((indicator) => (
                  <div
                    key={indicator.name}
                    className="flex items-center justify-between p-2 rounded border"
                  >
                    <div className="font-medium text-sm">{indicator.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {indicator.value.toFixed(indicator.name.includes("RSI") ? 0 : 2)}
                      </span>
                      <Badge className={getSignalColor(indicator.signal)}>
                        {indicator.signal}
                      </Badge>
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
                <Link href="/lending-sentiment">
                  <Button variant="outline" className="w-full justify-between">
                    Lending Sentiment
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/policy-carbon">
                  <Button variant="outline" className="w-full justify-between">
                    Policy & Carbon Revenue
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/procurement-scenarios">
                  <Button variant="outline" className="w-full justify-between">
                    Procurement Scenarios
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
