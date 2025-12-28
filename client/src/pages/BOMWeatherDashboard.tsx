import { useState, useEffect } from "react";
import { H1, H2, H3, H4, Body, MetricValue, DataLabel } from "@/components/Typography";
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
import { Progress } from "@/components/ui/progress";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  AlertTriangle,
  Flame,
  RefreshCw,
  AlertCircle,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Leaf,
  ExternalLink,
  CloudLightning,
  Snowflake,
} from "lucide-react";
import { format } from "date-fns";

// Weather condition icons
const getWeatherIcon = (conditions: string) => {
  const lower = conditions.toLowerCase();
  if (lower.includes("storm") || lower.includes("thunder")) return <CloudLightning className="h-5 w-5 text-purple-500" />;
  if (lower.includes("rain") || lower.includes("shower")) return <CloudRain className="h-5 w-5 text-blue-500" />;
  if (lower.includes("cloudy") || lower.includes("overcast")) return <Cloud className="h-5 w-5 text-gray-500" />;
  if (lower.includes("sunny") || lower.includes("fine") || lower.includes("clear")) return <Sun className="h-5 w-5 text-yellow-500" />;
  return <Cloud className="h-5 w-5 text-gray-400" />;
};

// Fire danger colors
const getFireDangerColor = (rating: number) => {
  switch (rating) {
    case 0: return "bg-gray-100 text-gray-800";
    case 1: return "bg-green-100 text-green-800";
    case 2: return "bg-yellow-100 text-yellow-800";
    case 3: return "bg-orange-100 text-orange-800";
    case 4: return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Drought status colors
const getDroughtStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "drought declared": return "bg-red-100 text-red-800";
    case "drought watch": return "bg-orange-100 text-orange-800";
    case "below average": return "bg-yellow-100 text-yellow-800";
    case "recovering": return "bg-blue-100 text-blue-800";
    case "normal": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function BOMWeatherDashboard() {
  const [observations, setObservations] = useState<any[]>([]);
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [fireDanger, setFireDanger] = useState<any>(null);
  const [drought, setDrought] = useState<any>(null);
  const [warnings, setWarnings] = useState<any>(null);
  const [agSummary, setAgSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedState, setSelectedState] = useState("all");

  useEffect(() => {
    fetchData();
  }, [selectedState]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const stateParam = selectedState !== "all" ? `?state=${selectedState}` : "";

      const [obsRes, forecastRes, fireRes, droughtRes, warningsRes, agRes] = await Promise.all([
        fetch(`/api/australian-data/bom/observations${stateParam}`),
        fetch(`/api/australian-data/bom/forecast${stateParam}`),
        fetch(`/api/australian-data/bom/fire-danger${stateParam}`),
        fetch("/api/australian-data/bom/drought"),
        fetch(`/api/australian-data/bom/warnings${stateParam}`),
        fetch("/api/australian-data/bom/agriculture-summary"),
      ]);

      if (obsRes.ok) {
        const data = await obsRes.json();
        setObservations(data.observations || []);
      }
      if (forecastRes.ok) {
        const data = await forecastRes.json();
        setForecasts(data.forecasts || []);
      }
      if (fireRes.ok) {
        const data = await fireRes.json();
        setFireDanger(data);
      }
      if (droughtRes.ok) {
        const data = await droughtRes.json();
        setDrought(data);
      }
      if (warningsRes.ok) {
        const data = await warningsRes.json();
        setWarnings(data);
      }
      if (agRes.ok) {
        const data = await agRes.json();
        setAgSummary(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold mb-2">BOM Weather Dashboard</h1>
          <p className="text-gray-600">
            Bureau of Meteorology weather data for agricultural planning
          </p>
        </div>
        <div className="flex gap-2">
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
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
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

      {/* Active Warnings Banner */}
      {warnings && warnings.activeCount > 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-800">
                    {warnings.activeCount} Active Weather Warning{warnings.activeCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-amber-700">
                    {Object.entries(warnings.byType).map(([type, count]) => `${count} ${type}`).join(", ")}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-amber-300">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Stations</p>
                <p className="text-2xl font-bold">{observations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Fire Danger</p>
                <p className="text-2xl font-bold">
                  {fireDanger?.summary?.statesWithExtreme?.length || 0} Extreme
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Drought Areas</p>
                <p className="text-2xl font-bold">{drought?.summary?.areasInDrought || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Season</p>
                <p className="text-2xl font-bold">{agSummary?.season || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="observations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="observations">Current</TabsTrigger>
          <TabsTrigger value="forecasts">7-Day Forecast</TabsTrigger>
          <TabsTrigger value="fire">Fire Danger</TabsTrigger>
          <TabsTrigger value="drought">Drought</TabsTrigger>
          <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
        </TabsList>

        {/* Current Observations Tab */}
        <TabsContent value="observations">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {observations.map((obs, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {obs.station.name}
                    </span>
                    <Badge variant="outline">{obs.station.state}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-8 w-8 text-red-500" />
                      <span className="text-3xl font-bold">{obs.observation.temperature}°C</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Feels like</p>
                      <p className="font-medium">{obs.observation.apparentTemp}°C</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>Humidity: {obs.observation.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span>{obs.observation.windSpeed} km/h {obs.observation.windDirection}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4 text-blue-500" />
                      <span>Rain 24h: {obs.observation.rainfall24h}mm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-gray-400" />
                      <span>{obs.observation.cloud}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Agriculture Impact</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={obs.agricultureImpact.heatStress === "High" ? "bg-red-100 text-red-800" : obs.agricultureImpact.heatStress === "Moderate" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                        Heat: {obs.agricultureImpact.heatStress}
                      </Badge>
                      {obs.agricultureImpact.frostRisk !== "None" && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Snowflake className="h-3 w-3 mr-1" />
                          Frost: {obs.agricultureImpact.frostRisk}
                        </Badge>
                      )}
                      <Badge className={obs.agricultureImpact.irrigationNeed === "High" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
                        Irrigation: {obs.agricultureImpact.irrigationNeed}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 7-Day Forecast Tab */}
        <TabsContent value="forecasts">
          {forecasts.map((stationForecast, sIndex) => (
            <Card key={sIndex} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {stationForecast.station.name}
                  <Badge variant="outline">{stationForecast.station.state}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="flex gap-4 min-w-max">
                    {stationForecast.forecasts.map((day: any, dIndex: number) => (
                      <div key={dIndex} className="flex-shrink-0 w-32 text-center p-3 border rounded-lg">
                        <p className="font-medium text-sm">{day.dayName.slice(0, 3)}</p>
                        <p className="text-xs text-gray-500">{format(new Date(day.date), "d MMM")}</p>
                        <div className="my-2">
                          {getWeatherIcon(day.conditions)}
                        </div>
                        <p className="text-xs text-gray-600">{day.conditions}</p>
                        <div className="mt-2">
                          <span className="text-lg font-bold text-red-600">{day.maxTemp}°</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-blue-600">{day.minTemp}°</span>
                        </div>
                        {day.rainChance > 0 && (
                          <div className="mt-1 text-xs text-blue-600">
                            <Droplets className="h-3 w-3 inline mr-1" />
                            {day.rainChance}%
                          </div>
                        )}
                        <div className="mt-2 text-xs">
                          <Badge
                            variant="outline"
                            className={
                              day.agricultureOutlook.harvestConditions === "Good"
                                ? "text-green-600 border-green-300"
                                : day.agricultureOutlook.harvestConditions === "Poor"
                                  ? "text-red-600 border-red-300"
                                  : "text-yellow-600 border-yellow-300"
                            }
                          >
                            {day.agricultureOutlook.harvestConditions}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Fire Danger Tab */}
        <TabsContent value="fire">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  Fire Danger Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {fireDanger && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-3xl font-bold">{fireDanger.summary.totalDistricts}</p>
                        <p className="text-sm text-gray-600">Total Districts</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg text-center">
                        <p className="text-3xl font-bold text-red-600">
                          {fireDanger.summary.statesWithExtreme?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">States with Extreme</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Rating Distribution</p>
                      {Object.entries(fireDanger.summary.byRating || {}).map(([level, count]) => (
                        <div key={level} className="flex items-center justify-between py-1">
                          <span className="text-sm">{level}</span>
                          <Badge variant="outline">{count as number}</Badge>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Rating Legend</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(fireDanger.ratingLegend || {}).map(([key, val]: [string, any]) => (
                          <Badge key={key} style={{ backgroundColor: val.color, color: "#fff" }}>
                            {val.level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>District Ratings</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fireDanger?.districts?.slice(0, 15).map((district: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{district.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{district.state}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getFireDangerColor(district.rating)}>
                            {district.ratingInfo?.level}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Drought Tab */}
        <TabsContent value="drought">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-amber-600" />
                  Drought Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {drought && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{drought.summary.areasInDrought}%</p>
                        <p className="text-xs text-gray-600">In Drought</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{drought.summary.areasRecovering}%</p>
                        <p className="text-xs text-gray-600">Recovering</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{drought.summary.areasNormal}%</p>
                        <p className="text-xs text-gray-600">Normal</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Bioenergy Impact</p>
                      <div className="space-y-2">
                        {drought.bioenergyImpact?.affectedFeedstockRegions?.map((region: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium">{region.region}</p>
                              <p className="text-xs text-gray-500">{region.feedstock}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={region.impactLevel === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                                {region.impactLevel}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">-{region.productionReduction}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Conditions</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  {drought?.regions?.map((region: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{region.name}</p>
                          <Badge variant="outline" className="text-xs">{region.state}</Badge>
                        </div>
                        <Badge className={getDroughtStatusColor(region.status)}>
                          {region.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>Rainfall: {region.rainfallDeficiency}%</div>
                        <div>Water: {region.waterStorages}%</div>
                      </div>
                      {region.impactedCrops.length > 0 && (
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {region.impactedCrops.map((crop: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">{crop}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agriculture Summary Tab */}
        <TabsContent value="agriculture">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  National Outlook
                </CardTitle>
                <CardDescription>{agSummary?.season} Season</CardDescription>
              </CardHeader>
              <CardContent>
                {agSummary && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-800">Temperature</p>
                        <p className="text-sm text-red-600">{agSummary.nationalOutlook.temperature}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Rainfall</p>
                        <p className="text-sm text-blue-600">{agSummary.nationalOutlook.rainfall}</p>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <p className="text-sm font-medium text-amber-800">Soil Moisture</p>
                        <p className="text-sm text-amber-600">{agSummary.nationalOutlook.soilMoisture}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Key Dates</p>
                      <div className="space-y-2">
                        {agSummary.keyDates?.map((date: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{date.event}:</span>
                            <span className="text-gray-600">{date.timing}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedstock Implications</CardTitle>
              </CardHeader>
              <CardContent>
                {agSummary?.feedstockImplications && (
                  <div className="space-y-4">
                    {Object.entries(agSummary.feedstockImplications).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-3 border rounded-lg">
                        <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Availability</p>
                            <Badge className={
                              value.availability.includes("Below") ? "bg-red-100 text-red-800" :
                              value.availability.includes("Above") ? "bg-green-100 text-green-800" :
                              "bg-gray-100 text-gray-800"
                            }>
                              {value.availability}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-gray-500">Price Outlook</p>
                            <Badge variant="outline">{value.priceOutlook}</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{value.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Regional Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {agSummary?.regionalConditions?.map((region: any, i: number) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{region.region}</p>
                        <Badge className={
                          region.outlook === "Favorable" ? "bg-green-100 text-green-800" :
                          region.outlook === "Challenging" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          {region.outlook}
                        </Badge>
                      </div>
                      <div className="flex gap-1 flex-wrap mb-2">
                        {region.states.map((s: string) => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Key Risks:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {region.keyRisks.map((risk: string, ri: number) => (
                          <li key={ri} className="flex items-start gap-1">
                            <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Source Attribution */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Data sourced from{" "}
          <a
            href="http://www.bom.gov.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            Bureau of Meteorology
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  );
}
