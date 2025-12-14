import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { Search, MapPin, Calendar, TrendingUp, Package } from "lucide-react";

export default function BrowseDemandSignals() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [feedstockTypeFilter, setFeedstockTypeFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");

  const { data: signals, isLoading } = trpc.demandSignals.list.useQuery({
    status: "published",
    feedstockType: feedstockTypeFilter !== "all" ? feedstockTypeFilter : undefined,
    deliveryState: stateFilter !== "all" ? (stateFilter as any) : undefined,
  });

  const filteredSignals = signals?.filter((signal: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      signal.title?.toLowerCase().includes(query) ||
      signal.feedstockType?.toLowerCase().includes(query) ||
      signal.deliveryLocation?.toLowerCase().includes(query)
    );
  }) || [];

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      agricultural_residue: "bg-green-100 text-green-800",
      forestry_residue: "bg-amber-100 text-amber-800",
      energy_crop: "bg-blue-100 text-blue-800",
      organic_waste: "bg-purple-100 text-purple-800",
      algae_aquatic: "bg-cyan-100 text-cyan-800",
      mixed: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatCategory = (category: string) => {
    return category.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Demand Signals</h1>
          <p className="text-muted-foreground">
            Discover feedstock requirements from verified buyers
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, feedstock type, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={feedstockTypeFilter} onValueChange={setFeedstockTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Feedstock Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Wheat Straw">Wheat Straw</SelectItem>
                  <SelectItem value="Bagasse">Bagasse</SelectItem>
                  <SelectItem value="Grain Stubble">Grain Stubble</SelectItem>
                  <SelectItem value="Forestry Residue">Forestry Residue</SelectItem>
                  <SelectItem value="Cotton Trash">Cotton Trash</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="NSW">NSW</SelectItem>
                  <SelectItem value="VIC">VIC</SelectItem>
                  <SelectItem value="QLD">QLD</SelectItem>
                  <SelectItem value="SA">SA</SelectItem>
                  <SelectItem value="WA">WA</SelectItem>
                  <SelectItem value="TAS">TAS</SelectItem>
                  <SelectItem value="NT">NT</SelectItem>
                  <SelectItem value="ACT">ACT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        ) : filteredSignals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No demand signals found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSignals.map((signal: any) => (
              <Card
                key={signal.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setLocation(`/demand-signals/${signal.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="mb-2">{signal.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className={getCategoryBadgeColor(signal.feedstockCategory)}>
                          {formatCategory(signal.feedstockCategory)}
                        </Badge>
                        <Badge variant="outline">{signal.feedstockType}</Badge>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-primary">
                        {signal.annualVolume?.toLocaleString()} t/yr
                      </div>
                      <div className="text-xs text-muted-foreground">Annual Volume</div>
                    </div>
                  </div>
                  {signal.description && (
                    <CardDescription className="line-clamp-2">
                      {signal.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">
                        {signal.deliveryLocation}
                        {signal.deliveryState && `, ${signal.deliveryState}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>
                        Start: {formatDate(signal.supplyStartDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>
                        {signal.indicativePriceMin && signal.indicativePriceMax
                          ? `$${signal.indicativePriceMin}-${signal.indicativePriceMax}/t`
                          : signal.pricingMechanism === "negotiable"
                          ? "Price Negotiable"
                          : "Price on Request"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                      Response Deadline: <span className="font-medium text-foreground">{formatDate(signal.responseDeadline)}</span>
                    </div>
                    <div>
                      {signal.responseCount || 0} response{signal.responseCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
