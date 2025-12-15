import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  AlertTriangle,
  TrendingUp,
  MapPin,
  PieChart,
  BarChart3,
} from "lucide-react";
import { useLocation } from "wouter";

export default function ConcentrationAnalysis() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  // Fetch user's projects
  const { data: projects, isLoading: projectsLoading } =
    trpc.bankability.getMyProjects.useQuery();

  // Fetch supply agreements for selected project
  const { data: agreements, isLoading: agreementsLoading } =
    trpc.bankability.getProjectAgreements.useQuery(
      { projectId: selectedProjectId! },
      { enabled: !!selectedProjectId }
    );

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid gap-6">
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate HHI (Herfindahl-Hirschman Index)
  const calculateHHI = () => {
    if (!agreements || agreements.length === 0) return 0;

    const totalVolume = agreements.reduce(
      (sum: number, a: any) => sum + (a.annualVolume || 0),
      0
    );
    if (totalVolume === 0) return 0;

    const hhi = agreements.reduce((sum: number, a: any) => {
      const marketShare = ((a.annualVolume || 0) / totalVolume) * 100;
      return sum + marketShare * marketShare;
    }, 0);

    return Math.round(hhi);
  };

  // Calculate supplier concentration metrics
  const calculateSupplierMetrics = () => {
    if (!agreements || agreements.length === 0) {
      return {
        totalSuppliers: 0,
        largestSupplierPercent: 0,
        top3SuppliersPercent: 0,
        supplierShares: [],
      };
    }

    const totalVolume = agreements.reduce(
      (sum: number, a: any) => sum + (a.annualVolume || 0),
      0
    );

    // Group by supplier
    const supplierVolumes = agreements.reduce((acc: any, a: any) => {
      const supplierId = a.supplierId;
      if (!acc[supplierId]) {
        acc[supplierId] = {
          supplierId,
          volume: 0,
          agreements: [],
        };
      }
      acc[supplierId].volume += a.annualVolume || 0;
      acc[supplierId].agreements.push(a);
      return acc;
    }, {});

    const supplierShares = Object.values(supplierVolumes)
      .map((s: any) => ({
        ...s,
        percent:
          totalVolume > 0 ? Math.round((s.volume / totalVolume) * 100) : 0,
      }))
      .sort((a: any, b: any) => b.percent - a.percent);

    const largestSupplierPercent = supplierShares[0]?.percent || 0;
    const top3SuppliersPercent = supplierShares
      .slice(0, 3)
      .reduce((sum: number, s: any) => sum + s.percent, 0);

    return {
      totalSuppliers: supplierShares.length,
      largestSupplierPercent,
      top3SuppliersPercent,
      supplierShares,
    };
  };

  // Calculate geographic distribution
  const calculateGeographicDistribution = () => {
    if (!agreements || agreements.length === 0) {
      return {
        regions: [],
        climateZones: 0,
      };
    }

    // Group by state (simplified - in real implementation would use actual location data)
    const stateVolumes = agreements.reduce((acc: any, a: any) => {
      // For now, use a placeholder - in real implementation would fetch from supplier data
      const state = "QLD"; // Placeholder
      if (!acc[state]) {
        acc[state] = {
          state,
          volume: 0,
          count: 0,
        };
      }
      acc[state].volume += a.annualVolume || 0;
      acc[state].count += 1;
      return acc;
    }, {});

    const regions = Object.values(stateVolumes);
    const climateZones = regions.length; // Simplified - would need actual climate zone mapping

    return {
      regions,
      climateZones,
    };
  };

  const hhi = calculateHHI();
  const supplierMetrics = calculateSupplierMetrics();
  const geoDistribution = calculateGeographicDistribution();

  // HHI interpretation
  const getHHIInterpretation = (hhi: number) => {
    if (hhi < 1500) {
      return {
        level: "Low Concentration",
        color: "bg-green-100 text-green-800",
        description: "Competitive market with well-distributed supply",
        icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      };
    } else if (hhi < 2500) {
      return {
        level: "Moderate Concentration",
        color: "bg-yellow-100 text-yellow-800",
        description: "Moderately concentrated supply base - monitor closely",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      };
    } else {
      return {
        level: "High Concentration",
        color: "bg-red-100 text-red-800",
        description: "Highly concentrated supply - significant risk",
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      };
    }
  };

  const hhiInterpretation = getHHIInterpretation(hhi);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <PieChart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Concentration Risk Analysis</h1>
          </div>
          <p className="text-muted-foreground">
            Analyze supplier concentration and geographic distribution for your
            bioenergy projects
          </p>
        </div>

        {/* Project Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Project</CardTitle>
            <CardDescription>
              Choose a project to analyze concentration risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedProjectId?.toString() || ""}
              onValueChange={value => setSelectedProjectId(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a project..." />
              </SelectTrigger>
              <SelectContent>
                {projects && projects.length > 0 ? (
                  projects.map((project: any) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No projects available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedProjectId && (
          <>
            {agreementsLoading ? (
              <Skeleton className="h-64" />
            ) : !agreements || agreements.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Supply Agreements
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add supply agreements to analyze concentration risk
                  </p>
                  <Button
                    onClick={() =>
                      navigate(
                        `/dashboard/projects/${selectedProjectId}/agreements`
                      )
                    }
                  >
                    Add Agreements
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* HHI Score Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          Herfindahl-Hirschman Index (HHI)
                        </CardTitle>
                        <CardDescription>
                          Measures market concentration - lower is better
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {hhiInterpretation.icon}
                        <Badge className={hhiInterpretation.color}>
                          {hhiInterpretation.level}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-4xl font-bold mb-2">{hhi}</p>
                        <p className="text-sm text-muted-foreground">
                          {hhiInterpretation.description}
                        </p>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">HHI Benchmarks</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>
                            • <strong>0-1,500:</strong> Competitive market (low
                            concentration)
                          </li>
                          <li>
                            • <strong>1,500-2,500:</strong> Moderate
                            concentration
                          </li>
                          <li>
                            • <strong>2,500+:</strong> High concentration
                            (potential antitrust concerns)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Supplier Concentration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Concentration</CardTitle>
                    <CardDescription>
                      Distribution of supply volume across suppliers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Suppliers
                        </p>
                        <p className="text-3xl font-bold">
                          {supplierMetrics.totalSuppliers}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          Largest Supplier
                        </p>
                        <p className="text-3xl font-bold">
                          {supplierMetrics.largestSupplierPercent}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          of total volume
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          Top 3 Suppliers
                        </p>
                        <p className="text-3xl font-bold">
                          {supplierMetrics.top3SuppliersPercent}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          of total volume
                        </p>
                      </div>
                    </div>

                    {/* Supplier Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Supplier Breakdown</h4>
                      {supplierMetrics.supplierShares.map(
                        (supplier: any, index: number) => (
                          <div
                            key={supplier.supplierId}
                            className="flex items-center gap-4"
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">
                                  Supplier #{supplier.supplierId}
                                </span>
                                <span className="text-sm font-semibold">
                                  {supplier.percent}%
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    index === 0
                                      ? "bg-primary"
                                      : index === 1
                                        ? "bg-blue-500"
                                        : index === 2
                                          ? "bg-green-500"
                                          : "bg-gray-400"
                                  }`}
                                  style={{ width: `${supplier.percent}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {supplier.volume.toLocaleString()} tonnes
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {supplier.agreements.length} agreement
                                {supplier.agreements.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Geographic Distribution */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <CardTitle>Geographic Distribution</CardTitle>
                    </div>
                    <CardDescription>
                      Regional spread of supply sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          Climate Zones
                        </p>
                        <p className="text-3xl font-bold">
                          {geoDistribution.climateZones}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {geoDistribution.climateZones < 2
                            ? "High geographic concentration"
                            : "Good diversification"}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          Regions
                        </p>
                        <p className="text-3xl font-bold">
                          {geoDistribution.regions.length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          states/territories
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Risk Assessment</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>
                          • <strong>Single Event Exposure:</strong>{" "}
                          {supplierMetrics.largestSupplierPercent}% of supply at
                          risk from single supplier failure
                        </li>
                        <li>
                          • <strong>Geographic Risk:</strong>{" "}
                          {geoDistribution.climateZones < 2
                            ? "High - limited geographic diversification"
                            : "Moderate - reasonable geographic spread"}
                        </li>
                        <li>
                          • <strong>Recommendation:</strong>{" "}
                          {supplierMetrics.largestSupplierPercent > 40
                            ? "Consider diversifying away from dominant supplier"
                            : "Maintain current diversification strategy"}
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {hhi > 2500 && (
                        <div className="p-4 border-l-4 border-red-500 bg-red-50">
                          <p className="font-semibold text-red-900">
                            High Concentration Risk
                          </p>
                          <p className="text-sm text-red-700 mt-1">
                            Your HHI of {hhi} indicates high supplier
                            concentration. Consider adding more suppliers to
                            reduce dependency risk and improve bankability
                            rating.
                          </p>
                        </div>
                      )}
                      {supplierMetrics.largestSupplierPercent > 50 && (
                        <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                          <p className="font-semibold text-yellow-900">
                            Dominant Supplier Risk
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Your largest supplier represents{" "}
                            {supplierMetrics.largestSupplierPercent}% of total
                            supply. Aim to reduce this to below 40% to improve
                            resilience.
                          </p>
                        </div>
                      )}
                      {geoDistribution.climateZones < 2 && (
                        <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                          <p className="font-semibold text-orange-900">
                            Geographic Concentration
                          </p>
                          <p className="text-sm text-orange-700 mt-1">
                            Supply is concentrated in{" "}
                            {geoDistribution.climateZones} climate zone(s).
                            Consider sourcing from additional regions to
                            mitigate climate-related risks.
                          </p>
                        </div>
                      )}
                      {hhi < 1500 &&
                        supplierMetrics.largestSupplierPercent < 40 && (
                          <div className="p-4 border-l-4 border-green-500 bg-green-50">
                            <p className="font-semibold text-green-900">
                              Good Diversification
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                              Your supply base shows good diversification with
                              low concentration risk. Maintain this strategy to
                              support strong bankability ratings.
                            </p>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
