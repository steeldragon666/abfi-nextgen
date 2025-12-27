import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Map,
  Layers,
  Leaf,
  Wheat,
  TreeDeciduous,
  Droplets,
  Factory,
  MapPin,
  Info,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Types
interface LandUseClass {
  code: string;
  name: string;
  color: string;
  level: number;
  parent?: string;
  children?: LandUseClass[];
  feedstockPotential?: {
    feedstocks: string[];
    potential: string;
  };
}

interface FeedstockRegion {
  id: string;
  name: string;
  state: string;
  bounds: { north: number; south: number; east: number; west: number };
  center: { lat: number; lon: number };
  primaryFeedstock: string;
  secondaryFeedstocks: string[];
  landUseCode: string;
  area: number;
  annualProduction: number;
  existingInfrastructure: string[];
  bioenergyPotential: string;
}

const COLORS = ["#1a472a", "#2d5a3d", "#c4a35a", "#4a90d9", "#d45500", "#0077be"];

const LAND_USE_ICONS: Record<string, React.ReactNode> = {
  "1": <TreeDeciduous className="h-4 w-4" />,
  "2": <TreeDeciduous className="h-4 w-4" />,
  "3": <Wheat className="h-4 w-4" />,
  "4": <Droplets className="h-4 w-4" />,
  "5": <Factory className="h-4 w-4" />,
  "6": <Droplets className="h-4 w-4" />,
};

export default function ABARESLandUse() {
  const [classification, setClassification] = useState<LandUseClass[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [feedstockRegions, setFeedstockRegions] = useState<FeedstockRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedState, setSelectedState] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState<FeedstockRegion | null>(null);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set(["3"]));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [classRes, statsRes, regionsRes] = await Promise.all([
        fetch("/api/australian-data/abares/classification"),
        fetch("/api/australian-data/abares/statistics"),
        fetch("/api/australian-data/abares/feedstock-regions"),
      ]);

      if (classRes.ok) {
        const data = await classRes.json();
        setClassification(data.classification || []);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStatistics(data);
      }
      if (regionsRes.ok) {
        const data = await regionsRes.json();
        setFeedstockRegions(data.regions || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatArea = (hectares: number) => {
    if (hectares >= 1000000) {
      return `${(hectares / 1000000).toFixed(1)}M ha`;
    }
    if (hectares >= 1000) {
      return `${(hectares / 1000).toFixed(0)}K ha`;
    }
    return `${hectares.toLocaleString()} ha`;
  };

  const formatTonnes = (tonnes: number) => {
    if (tonnes >= 1000000) {
      return `${(tonnes / 1000000).toFixed(1)}M t`;
    }
    if (tonnes >= 1000) {
      return `${(tonnes / 1000).toFixed(0)}K t`;
    }
    return `${tonnes.toLocaleString()} t`;
  };

  const toggleExpand = (code: string) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedClasses(newExpanded);
  };

  const openRegionDetails = (region: FeedstockRegion) => {
    setSelectedRegion(region);
    setRegionDialogOpen(true);
  };

  const filteredRegions = selectedState === "all"
    ? feedstockRegions
    : feedstockRegions.filter((r) => r.state === selectedState);

  const getPotentialBadge = (potential: string) => {
    switch (potential.toLowerCase()) {
      case "high":
        return <Badge className="bg-green-100 text-green-800">High</Badge>;
      case "medium-high":
        return <Badge className="bg-lime-100 text-lime-800">Medium-High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge>{potential}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">ABARES Land Use Mapping</h1>
          <p className="text-gray-600">
            Catchment Scale Land Use of Australia (CLUM) - Bioenergy feedstock analysis
          </p>
        </div>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Map className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Land Area</p>
                <p className="text-2xl font-bold">
                  {statistics ? formatArea(statistics.national?.totalArea || 0) : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Wheat className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Agricultural Land</p>
                <p className="text-2xl font-bold">
                  {statistics ? formatArea(statistics.national?.agriculturalLand?.total || 0) : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Leaf className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Feedstock Potential</p>
                <p className="text-2xl font-bold">
                  {statistics ? formatTonnes(statistics.bioenergyPotential?.availableForBioenergy || 0) : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Energy Potential</p>
                <p className="text-2xl font-bold">
                  {statistics?.bioenergyPotential?.energyPotential || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="regions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="regions">Feedstock Regions</TabsTrigger>
          <TabsTrigger value="classification">Land Use Classes</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="states">State Analysis</TabsTrigger>
        </TabsList>

        {/* Feedstock Regions Tab */}
        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    Bioenergy Feedstock Regions
                  </CardTitle>
                  <CardDescription>Key agricultural regions with feedstock production potential</CardDescription>
                </div>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="NSW">NSW</SelectItem>
                    <SelectItem value="VIC">VIC</SelectItem>
                    <SelectItem value="QLD">QLD</SelectItem>
                    <SelectItem value="WA">WA</SelectItem>
                    <SelectItem value="SA">SA</SelectItem>
                    <SelectItem value="TAS">TAS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRegions.map((region) => (
                  <Card
                    key={region.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openRegionDetails(region)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{region.name}</h3>
                          <Badge variant="outline" className="mt-1">{region.state}</Badge>
                        </div>
                        {getPotentialBadge(region.bioenergyPotential)}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span className="text-gray-600">Primary:</span>
                          <span className="font-medium">{region.primaryFeedstock}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Area:</span>
                          <span className="font-medium">{formatArea(region.area)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Annual Production:</span>
                          <span className="font-medium">{formatTonnes(region.annualProduction)}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex flex-wrap gap-1">
                          {region.secondaryFeedstocks.slice(0, 2).map((fs, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {fs}
                            </Badge>
                          ))}
                          {region.secondaryFeedstocks.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{region.secondaryFeedstocks.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Land Use Classification Tab */}
        <TabsContent value="classification">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Australian Land Use Classification (ALUM)
              </CardTitle>
              <CardDescription>
                Hierarchical land use classification with bioenergy feedstock potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {classification.map((level1) => (
                  <div key={level1.code} className="border rounded-lg">
                    <div
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleExpand(level1.code)}
                    >
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: level1.color }}
                      />
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          expandedClasses.has(level1.code) ? "rotate-90" : ""
                        }`}
                      />
                      <span className="font-medium">{level1.code}. {level1.name}</span>
                      {LAND_USE_ICONS[level1.code]}
                    </div>

                    {expandedClasses.has(level1.code) && level1.children && (
                      <div className="border-t bg-gray-50">
                        {level1.children.map((level2) => (
                          <div key={level2.code}>
                            <div
                              className="flex items-center gap-3 p-3 pl-10 cursor-pointer hover:bg-gray-100"
                              onClick={() => toggleExpand(level2.code)}
                            >
                              <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: level2.color }}
                              />
                              {level2.children && level2.children.length > 0 && (
                                <ChevronRight
                                  className={`h-3 w-3 transition-transform ${
                                    expandedClasses.has(level2.code) ? "rotate-90" : ""
                                  }`}
                                />
                              )}
                              <span className="text-sm">{level2.code} {level2.name}</span>
                              {level2.feedstockPotential && (
                                <Badge
                                  className={`ml-auto text-xs ${
                                    level2.feedstockPotential.potential === "high"
                                      ? "bg-green-100 text-green-800"
                                      : level2.feedstockPotential.potential === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {level2.feedstockPotential.potential} potential
                                </Badge>
                              )}
                            </div>

                            {expandedClasses.has(level2.code) && level2.children && (
                              <div className="bg-white border-t">
                                {level2.children.map((level3) => (
                                  <div
                                    key={level3.code}
                                    className="flex items-center gap-3 p-2 pl-16 text-sm border-b last:border-b-0"
                                  >
                                    <div
                                      className="w-2 h-2 rounded"
                                      style={{ backgroundColor: level3.color }}
                                    />
                                    <span className="text-gray-700">{level3.code} {level3.name}</span>
                                    {level3.feedstockPotential && (
                                      <div className="ml-auto flex gap-1">
                                        {level3.feedstockPotential.feedstocks.map((fs, i) => (
                                          <Badge key={i} variant="outline" className="text-xs">
                                            {fs}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Land Use Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Land Use Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statistics?.national?.byPrimaryClass ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statistics.national.byPrimaryClass}
                        dataKey="area"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percentage }) =>
                          percentage > 5 ? `${percentage.toFixed(0)}%` : ""
                        }
                      >
                        {statistics.national.byPrimaryClass.map((_: any, index: number) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatArea(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">Loading...</p>
                )}
              </CardContent>
            </Card>

            {/* Agricultural Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="h-5 w-5" />
                  Agricultural Land Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statistics?.national?.agriculturalLand ? (
                  <div className="space-y-4">
                    {Object.entries(statistics.national.agriculturalLand)
                      .filter(([key]) => key !== "total")
                      .map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{key}</span>
                            <span className="font-medium">{formatArea(value as number)}</span>
                          </div>
                          <Progress
                            value={
                              ((value as number) / statistics.national.agriculturalLand.total) * 100
                            }
                            className="h-2"
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Loading...</p>
                )}
              </CardContent>
            </Card>

            {/* Bioenergy Potential */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Bioenergy Feedstock Potential
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statistics?.bioenergyPotential ? (
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-700">
                        {formatTonnes(statistics.bioenergyPotential.totalResidues)}
                      </p>
                      <p className="text-sm text-green-600">Total Residues/year</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-700">
                        {formatTonnes(statistics.bioenergyPotential.currentlyUtilized)}
                      </p>
                      <p className="text-sm text-blue-600">Currently Utilized</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-700">
                        {formatTonnes(statistics.bioenergyPotential.availableForBioenergy)}
                      </p>
                      <p className="text-sm text-purple-600">Available for Bioenergy</p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <p className="text-3xl font-bold text-amber-700">
                        {statistics.bioenergyPotential.energyPotential}
                      </p>
                      <p className="text-sm text-amber-600">Energy Potential</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* State Analysis Tab */}
        <TabsContent value="states">
          <Card>
            <CardHeader>
              <CardTitle>State-Level Land Use Analysis</CardTitle>
              <CardDescription>Agricultural land and feedstock potential by state</CardDescription>
            </CardHeader>
            <CardContent>
              {statistics?.states ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State</TableHead>
                      <TableHead>Total Area</TableHead>
                      <TableHead>Agricultural</TableHead>
                      <TableHead>Cropping</TableHead>
                      <TableHead>Grazing</TableHead>
                      <TableHead>Top Crops</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(statistics.states).map(([state, data]: [string, any]) => (
                      <TableRow key={state}>
                        <TableCell>
                          <Badge variant="outline">{state}</Badge>
                        </TableCell>
                        <TableCell>{formatArea(data.totalArea)}</TableCell>
                        <TableCell>{formatArea(data.agriculturalArea)}</TableCell>
                        <TableCell>{formatArea(data.cropping)}</TableCell>
                        <TableCell>{formatArea(data.grazing)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {data.topCrops.slice(0, 3).map((crop: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {crop}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500">Loading...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Region Details Dialog */}
      <Dialog open={regionDialogOpen} onOpenChange={setRegionDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedRegion && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedRegion.name}
                  <Badge variant="outline">{selectedRegion.state}</Badge>
                </DialogTitle>
                <DialogDescription>Bioenergy feedstock region analysis</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="flex items-center gap-4">
                  {getPotentialBadge(selectedRegion.bioenergyPotential)}
                  <Badge className="bg-blue-100 text-blue-800">
                    Land Use: {selectedRegion.landUseCode}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Area</p>
                    <p className="text-2xl font-bold">{formatArea(selectedRegion.area)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Annual Production</p>
                    <p className="text-2xl font-bold">{formatTonnes(selectedRegion.annualProduction)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Primary Feedstock
                  </h4>
                  <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
                    {selectedRegion.primaryFeedstock}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Secondary Feedstocks</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegion.secondaryFeedstocks.map((fs, i) => (
                      <Badge key={i} variant="outline">
                        {fs}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Factory className="h-4 w-4" />
                    Existing Infrastructure
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegion.existingInfrastructure.map((inf, i) => (
                      <Badge key={i} variant="secondary">
                        {inf}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Location
                  </h4>
                  <p className="text-sm text-gray-600">
                    Center: {selectedRegion.center.lat.toFixed(2)}°S, {selectedRegion.center.lon.toFixed(2)}°E
                  </p>
                  <p className="text-sm text-gray-600">
                    Bounds: {selectedRegion.bounds.north.toFixed(1)}°N to {selectedRegion.bounds.south.toFixed(1)}°S,{" "}
                    {selectedRegion.bounds.west.toFixed(1)}°W to {selectedRegion.bounds.east.toFixed(1)}°E
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" asChild>
                    <a
                      href="https://www.agriculture.gov.au/abares/aclump/land-use"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on ABARES
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
