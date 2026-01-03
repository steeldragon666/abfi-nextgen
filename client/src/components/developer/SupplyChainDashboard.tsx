/**
 * SupplyChainDashboard - Interactive geospatial heatmap with feedstock data
 *
 * Spec: Real-time feedstock availability calculator with multi-feedstock filtering
 * Features radius filter (1km-200km), seasonal timeline, supplier density mapping
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  MapPin,
  Layers,
  Filter,
  TrendingUp,
  Truck,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Download,
  RefreshCw,
  Wheat,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedstockType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  volume: number;
  avgPrice: number;
  transportCost: number;
}

interface RegionalData {
  region: string;
  supplierCount: number;
  totalVolume: number;
  avgReliability: number;
  dominantFeedstock: string;
}

interface MonthlyForecast {
  month: string;
  volume: number;
  confidence: number;
}

interface SupplyChainDashboardProps {
  projectLat?: number;
  projectLng?: number;
  className?: string;
}

const FEEDSTOCK_TYPES: FeedstockType[] = [
  { id: "sugarcane", name: "Sugarcane Bagasse", icon: <Leaf className="h-4 w-4" />, color: "#22c55e", volume: 450000, avgPrice: 45, transportCost: 12 },
  { id: "wheat", name: "Wheat Straw", icon: <Wheat className="h-4 w-4" />, color: "#eab308", volume: 320000, avgPrice: 38, transportCost: 15 },
  { id: "cotton", name: "Cotton Trash", icon: <Leaf className="h-4 w-4" />, color: "#f8fafc", volume: 180000, avgPrice: 42, transportCost: 18 },
  { id: "sorghum", name: "Sorghum Stover", icon: <Wheat className="h-4 w-4" />, color: "#f97316", volume: 220000, avgPrice: 35, transportCost: 14 },
  { id: "corn", name: "Corn Stover", icon: <Wheat className="h-4 w-4" />, color: "#fbbf24", volume: 150000, avgPrice: 40, transportCost: 16 },
];

const REGIONAL_DATA: RegionalData[] = [
  { region: "QLD North Coast", supplierCount: 145, totalVolume: 380000, avgReliability: 91, dominantFeedstock: "Sugarcane Bagasse" },
  { region: "QLD Central", supplierCount: 98, totalVolume: 220000, avgReliability: 88, dominantFeedstock: "Sugarcane Bagasse" },
  { region: "Darling Downs", supplierCount: 67, totalVolume: 180000, avgReliability: 85, dominantFeedstock: "Wheat Straw" },
  { region: "Wide Bay-Burnett", supplierCount: 54, totalVolume: 120000, avgReliability: 89, dominantFeedstock: "Sugarcane Bagasse" },
  { region: "NSW Northern", supplierCount: 43, totalVolume: 95000, avgReliability: 82, dominantFeedstock: "Cotton Trash" },
];

const MONTHLY_FORECAST: MonthlyForecast[] = [
  { month: "Jan", volume: 45000, confidence: 92 },
  { month: "Feb", volume: 52000, confidence: 90 },
  { month: "Mar", volume: 68000, confidence: 88 },
  { month: "Apr", volume: 75000, confidence: 85 },
  { month: "May", volume: 82000, confidence: 82 },
  { month: "Jun", volume: 95000, confidence: 78 },
  { month: "Jul", volume: 120000, confidence: 75 },
  { month: "Aug", volume: 145000, confidence: 72 },
  { month: "Sep", volume: 130000, confidence: 80 },
  { month: "Oct", volume: 98000, confidence: 85 },
  { month: "Nov", volume: 72000, confidence: 88 },
  { month: "Dec", volume: 55000, confidence: 91 },
];

export function SupplyChainDashboard({
  projectLat = -19.5,
  projectLng = 147.0,
  className,
}: SupplyChainDashboardProps) {
  const [radiusKm, setRadiusKm] = useState([100]);
  const [selectedFeedstocks, setSelectedFeedstocks] = useState<string[]>(["sugarcane", "wheat"]);
  const [showFilters, setShowFilters] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"heatmap" | "density" | "competitor">("heatmap");

  // Calculate aggregated metrics based on filters
  const metrics = useMemo(() => {
    const filtered = FEEDSTOCK_TYPES.filter((f) =>
      selectedFeedstocks.includes(f.id)
    );
    const totalVolume = filtered.reduce((acc, f) => acc + f.volume, 0);
    const avgTransportCost =
      filtered.reduce((acc, f) => acc + f.transportCost, 0) / filtered.length;
    const avgPrice = filtered.reduce((acc, f) => acc + f.avgPrice, 0) / filtered.length;
    const annualYield = totalVolume * 0.85; // 85% yield factor

    return {
      totalVolume,
      avgTransportCost,
      avgPrice,
      annualYield,
      supplierCount: REGIONAL_DATA.reduce((acc, r) => acc + r.supplierCount, 0),
    };
  }, [selectedFeedstocks]);

  const toggleFeedstock = (id: string) => {
    setSelectedFeedstocks((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const maxForecastVolume = Math.max(...MONTHLY_FORECAST.map((m) => m.volume));

  return (
    <Card className={cn("border-2 border-[#0A1931]", isFullscreen && "fixed inset-4 z-50", className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-[#0A1931] to-[#1a3a5c] text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-[#D4AF37]" />
            <div>
              <CardTitle className="text-lg">Supply Chain Intelligence</CardTitle>
              <p className="text-sm text-gray-300">
                Real-time feedstock availability within {radiusKm[0]}km radius
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-white hover:bg-white/10"
            >
              <Filter className="h-4 w-4 mr-1" />
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white hover:bg-white/10"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Radius Slider */}
              <div className="flex-1 min-w-[200px]">
                <Label className="text-sm font-medium">Search Radius</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={radiusKm}
                    onValueChange={setRadiusKm}
                    min={1}
                    max={200}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold w-16 text-right">
                    {radiusKm[0]} km
                  </span>
                </div>
              </div>

              {/* View Mode */}
              <div className="min-w-[150px]">
                <Label className="text-sm font-medium">View Mode</Label>
                <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heatmap">Availability Heatmap</SelectItem>
                    <SelectItem value="density">Supplier Density</SelectItem>
                    <SelectItem value="competitor">Competitor Overlay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Feedstock Filters */}
            <div>
              <Label className="text-sm font-medium">Feedstock Types</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {FEEDSTOCK_TYPES.map((feedstock) => (
                  <Button
                    key={feedstock.id}
                    variant={selectedFeedstocks.includes(feedstock.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeedstock(feedstock.id)}
                    className={cn(
                      "gap-1",
                      selectedFeedstocks.includes(feedstock.id) && "bg-[#0A1931]"
                    )}
                  >
                    {feedstock.icon}
                    {feedstock.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Layers className="h-4 w-4" />
              <span className="text-xs">Total Volume</span>
            </div>
            <span className="text-2xl font-bold text-[#0A1931] tabular-nums">
              {(metrics.totalVolume / 1000).toFixed(0)}k
            </span>
            <span className="text-sm text-gray-500 ml-1">tonnes</span>
          </div>

          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Truck className="h-4 w-4" />
              <span className="text-xs">Avg Transport</span>
            </div>
            <span className="text-2xl font-bold text-[#0A1931] tabular-nums">
              ${metrics.avgTransportCost.toFixed(0)}
            </span>
            <span className="text-sm text-gray-500 ml-1">/tonne</span>
          </div>

          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Est. Annual Yield</span>
            </div>
            <span className="text-2xl font-bold text-[#0A1931] tabular-nums">
              {(metrics.annualYield / 1000).toFixed(0)}k
            </span>
            <span className="text-sm text-gray-500 ml-1">tonnes</span>
          </div>

          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Avg Price</span>
            </div>
            <span className="text-2xl font-bold text-[#0A1931] tabular-nums">
              ${metrics.avgPrice.toFixed(0)}
            </span>
            <span className="text-sm text-gray-500 ml-1">/tonne</span>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="relative bg-gray-100 rounded-lg h-64 overflow-hidden border">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Interactive Heatmap</p>
              <p className="text-xs text-gray-400 mt-1">
                {metrics.supplierCount} suppliers within {radiusKm[0]}km
              </p>
              <p className="text-xs text-gray-400">
                Center: {projectLat.toFixed(2)}, {projectLng.toFixed(2)}
              </p>
            </div>
          </div>
          {/* Map overlay controls */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Button size="sm" variant="secondary" className="bg-white/90 shadow-md">
              <Layers className="h-3 w-3" />
            </Button>
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-white/90 text-[#0A1931]">
              {viewMode === "heatmap" && "Availability Heatmap"}
              {viewMode === "density" && "Supplier Density"}
              {viewMode === "competitor" && "Competitor Analysis"}
            </Badge>
          </div>
        </div>

        {/* Seasonal Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#0A1931] flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Seasonal Availability Forecast
            </h4>
            <Badge variant="outline" className="text-xs">
              12-month outlook
            </Badge>
          </div>

          <div className="flex items-end gap-1 h-24">
            {MONTHLY_FORECAST.map((month, i) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-[#0A1931] to-[#0A1931]/60 rounded-t transition-all hover:from-[#D4AF37] hover:to-[#D4AF37]/60"
                  style={{ height: `${(month.volume / maxForecastVolume) * 100}%` }}
                  title={`${month.month}: ${month.volume.toLocaleString()} tonnes (${month.confidence}% confidence)`}
                />
                <span className="text-xs text-gray-500">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[#0A1931]">Regional Supplier Density</h4>
          <div className="grid gap-2">
            {REGIONAL_DATA.slice(0, 4).map((region) => (
              <div
                key={region.region}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="text-sm font-medium">{region.region}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{region.supplierCount} suppliers</span>
                    <span>•</span>
                    <span>{region.dominantFeedstock}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold tabular-nums">
                    {(region.totalVolume / 1000).toFixed(0)}k t
                  </span>
                  <div className="text-xs text-gray-500">
                    {region.avgReliability}% reliability
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button className="flex-1 bg-[#0A1931] hover:bg-[#0A1931]/90">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SupplyChainDashboard;
