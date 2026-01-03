/**
 * VerifiedGrowerDirectory - 850+ pre-verified grower profiles with reliability scores
 *
 * Spec: Ranked search with ABN verification, ASIC extract, credit rating, land title
 * Features: Comparison matrix (up to 5), direct RFQ outreach, due diligence badges
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Star,
  MapPin,
  Building2,
  FileText,
  TrendingUp,
  Filter,
  SortAsc,
  SortDesc,
  Mail,
  Phone,
  ExternalLink,
  Plus,
  X,
  Scale,
  Shield,
  CreditCard,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Grower {
  id: string;
  name: string;
  abn: string;
  reliabilityScore: number;
  financialStability: "A" | "B" | "C" | "D";
  volumeCapacity: number;
  location: string;
  region: string;
  distanceKm: number;
  feedstockTypes: string[];
  historicalPerformance: number;
  verificationStatus: {
    abn: boolean;
    asic: boolean;
    credit: boolean;
    landTitle: boolean;
  };
  avgDeliveryRating: number;
  yearsActive: number;
  lastDelivery: Date;
}

interface VerifiedGrowerDirectoryProps {
  projectLocation?: { lat: number; lng: number };
  onSelectGrower?: (grower: Grower) => void;
  className?: string;
}

// Demo grower data
const DEMO_GROWERS: Grower[] = [
  {
    id: "1",
    name: "Burdekin Agri Co Pty Ltd",
    abn: "12 345 678 901",
    reliabilityScore: 94,
    financialStability: "A",
    volumeCapacity: 85000,
    location: "Ayr, QLD",
    region: "QLD North",
    distanceKm: 45,
    feedstockTypes: ["Sugarcane Bagasse"],
    historicalPerformance: 97,
    verificationStatus: { abn: true, asic: true, credit: true, landTitle: true },
    avgDeliveryRating: 4.8,
    yearsActive: 12,
    lastDelivery: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "Pioneer Farms Ltd",
    abn: "23 456 789 012",
    reliabilityScore: 88,
    financialStability: "A",
    volumeCapacity: 72000,
    location: "Mackay, QLD",
    region: "QLD Central",
    distanceKm: 120,
    feedstockTypes: ["Sugarcane Bagasse", "Wheat Straw"],
    historicalPerformance: 91,
    verificationStatus: { abn: true, asic: true, credit: true, landTitle: true },
    avgDeliveryRating: 4.5,
    yearsActive: 8,
    lastDelivery: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Coastal Cane Growers Assoc",
    abn: "34 567 890 123",
    reliabilityScore: 92,
    financialStability: "B",
    volumeCapacity: 68000,
    location: "Innisfail, QLD",
    region: "QLD North",
    distanceKm: 78,
    feedstockTypes: ["Sugarcane Bagasse"],
    historicalPerformance: 95,
    verificationStatus: { abn: true, asic: true, credit: false, landTitle: true },
    avgDeliveryRating: 4.7,
    yearsActive: 15,
    lastDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Tablelands Produce Pty Ltd",
    abn: "45 678 901 234",
    reliabilityScore: 85,
    financialStability: "B",
    volumeCapacity: 48000,
    location: "Mareeba, QLD",
    region: "QLD North",
    distanceKm: 95,
    feedstockTypes: ["Sugarcane Bagasse", "Corn Stover"],
    historicalPerformance: 88,
    verificationStatus: { abn: true, asic: true, credit: true, landTitle: false },
    avgDeliveryRating: 4.3,
    yearsActive: 6,
    lastDelivery: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    name: "Herbert Valley Farms",
    abn: "56 789 012 345",
    reliabilityScore: 91,
    financialStability: "A",
    volumeCapacity: 42000,
    location: "Ingham, QLD",
    region: "QLD North",
    distanceKm: 62,
    feedstockTypes: ["Sugarcane Bagasse"],
    historicalPerformance: 93,
    verificationStatus: { abn: true, asic: true, credit: true, landTitle: true },
    avgDeliveryRating: 4.6,
    yearsActive: 10,
    lastDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    name: "Darling Downs Grain Co",
    abn: "67 890 123 456",
    reliabilityScore: 78,
    financialStability: "C",
    volumeCapacity: 55000,
    location: "Toowoomba, QLD",
    region: "Darling Downs",
    distanceKm: 280,
    feedstockTypes: ["Wheat Straw", "Sorghum Stover"],
    historicalPerformance: 82,
    verificationStatus: { abn: true, asic: false, credit: true, landTitle: true },
    avgDeliveryRating: 4.0,
    yearsActive: 4,
    lastDelivery: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

export function VerifiedGrowerDirectory({
  projectLocation,
  onSelectGrower,
  className,
}: VerifiedGrowerDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"reliability" | "volume" | "distance" | "performance">("reliability");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Filter and sort growers
  const filteredGrowers = useMemo(() => {
    let result = [...DEMO_GROWERS];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(query) ||
          g.location.toLowerCase().includes(query) ||
          g.abn.includes(query)
      );
    }

    // Region filter
    if (regionFilter !== "all") {
      result = result.filter((g) => g.region === regionFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "reliability":
          comparison = a.reliabilityScore - b.reliabilityScore;
          break;
        case "volume":
          comparison = a.volumeCapacity - b.volumeCapacity;
          break;
        case "distance":
          comparison = a.distanceKm - b.distanceKm;
          break;
        case "performance":
          comparison = a.historicalPerformance - b.historicalPerformance;
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    return result;
  }, [searchQuery, sortBy, sortOrder, regionFilter]);

  const toggleComparison = (id: string) => {
    setSelectedForComparison((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 5
        ? [...prev, id]
        : prev
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-amber-600";
    return "text-red-600";
  };

  const getStabilityBadge = (rating: string) => {
    const colors: Record<string, string> = {
      A: "bg-green-100 text-green-800",
      B: "bg-blue-100 text-blue-800",
      C: "bg-amber-100 text-amber-800",
      D: "bg-red-100 text-red-800",
    };
    return colors[rating] || "bg-gray-100 text-gray-800";
  };

  const regions = [...new Set(DEMO_GROWERS.map((g) => g.region))];

  const comparedGrowers = DEMO_GROWERS.filter((g) =>
    selectedForComparison.includes(g.id)
  );

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#0A1931]" />
            <CardTitle className="text-lg">Verified Grower Directory</CardTitle>
            <Badge variant="outline">{DEMO_GROWERS.length}+ growers</Badge>
          </div>
          {selectedForComparison.length > 0 && (
            <Button
              onClick={() => setShowComparison(!showComparison)}
              className="bg-[#0A1931] hover:bg-[#0A1931]/90"
            >
              <Scale className="h-4 w-4 mr-2" />
              Compare ({selectedForComparison.length})
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, location, or ABN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[180px]">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[180px]">
              <SortDesc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reliability">Reliability Score</SelectItem>
              <SelectItem value="volume">Volume Capacity</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
          >
            {sortOrder === "desc" ? (
              <SortDesc className="h-4 w-4" />
            ) : (
              <SortAsc className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Comparison View */}
        {showComparison && comparedGrowers.length > 0 && (
          <div className="bg-[#0A1931]/5 border border-[#0A1931]/20 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-[#0A1931]">Supplier Comparison</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedForComparison([]);
                  setShowComparison(false);
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Metric</th>
                    {comparedGrowers.map((g) => (
                      <th key={g.id} className="text-center py-2 font-medium">
                        {g.name.split(" ").slice(0, 2).join(" ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Reliability Score</td>
                    {comparedGrowers.map((g) => (
                      <td key={g.id} className={cn("text-center font-semibold", getScoreColor(g.reliabilityScore))}>
                        {g.reliabilityScore}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Volume Capacity</td>
                    {comparedGrowers.map((g) => (
                      <td key={g.id} className="text-center">{g.volumeCapacity.toLocaleString()} t</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Financial Stability</td>
                    {comparedGrowers.map((g) => (
                      <td key={g.id} className="text-center">
                        <Badge className={getStabilityBadge(g.financialStability)}>
                          {g.financialStability}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Distance</td>
                    {comparedGrowers.map((g) => (
                      <td key={g.id} className="text-center">{g.distanceKm} km</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2">Verifications</td>
                    {comparedGrowers.map((g) => (
                      <td key={g.id} className="text-center">
                        {Object.values(g.verificationStatus).filter(Boolean).length}/4
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grower List */}
        <div className="space-y-3">
          {filteredGrowers.map((grower) => (
            <div
              key={grower.id}
              className={cn(
                "border rounded-lg p-4 transition-all hover:shadow-md",
                selectedForComparison.includes(grower.id) && "border-[#0A1931] bg-[#0A1931]/5"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedForComparison.includes(grower.id)}
                    onCheckedChange={() => toggleComparison(grower.id)}
                    disabled={
                      selectedForComparison.length >= 5 &&
                      !selectedForComparison.includes(grower.id)
                    }
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[#0A1931]">{grower.name}</h4>
                      <Badge className={getStabilityBadge(grower.financialStability)}>
                        {grower.financialStability}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {grower.location} ({grower.distanceKm} km)
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        ABN: {grower.abn}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className={cn("text-2xl font-bold", getScoreColor(grower.reliabilityScore))}>
                      {grower.reliabilityScore}
                    </span>
                    <span className="text-xs text-gray-500">/100</span>
                  </div>
                  <span className="text-xs text-gray-500">Reliability</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <span className="text-xs text-gray-500">Volume Capacity</span>
                  <p className="font-semibold">{grower.volumeCapacity.toLocaleString()} t</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Historical Performance</span>
                  <p className="font-semibold">{grower.historicalPerformance}%</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Delivery Rating</span>
                  <p className="font-semibold flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500" />
                    {grower.avgDeliveryRating}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Years Active</span>
                  <p className="font-semibold">{grower.yearsActive} years</p>
                </div>
              </div>

              {/* Verification Badges */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-gray-500">Verifications:</span>
                <div className="flex gap-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      grower.verificationStatus.abn
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-400"
                    )}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    ABN
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      grower.verificationStatus.asic
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-400"
                    )}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    ASIC
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      grower.verificationStatus.credit
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-400"
                    )}
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    Credit
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      grower.verificationStatus.landTitle
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-400"
                    )}
                  >
                    <Map className="h-3 w-3 mr-1" />
                    Title
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-[#D4AF37] text-[#0A1931] hover:bg-[#D4AF37]/90"
                  onClick={() => onSelectGrower?.(grower)}
                >
                  Send RFQ
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Results Summary */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          Showing {filteredGrowers.length} of {DEMO_GROWERS.length} verified growers
        </div>
      </CardContent>
    </Card>
  );
}

export default VerifiedGrowerDirectory;
