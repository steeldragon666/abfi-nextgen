import { useState } from "react";
import { H1, H2, H3, H4, Body, MetricValue, DataLabel } from "@/components/Typography";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
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
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { PageLayout, PageContainer } from "@/components/layout";
import {
  AlertTriangle,
  TrendingDown,
  Users,
  MapPin,
  DollarSign,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  History,
  BarChart3,
  Shield,
  Lightbulb,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScoreGauge } from "@/components/ScoreCard";

const SCENARIO_TYPES = [
  {
    id: "supplier_loss",
    label: "Supplier Loss",
    icon: Users,
    description: "Simulate loss of a key supplier",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: "supply_shortfall",
    label: "Supply Shortfall",
    icon: TrendingDown,
    description: "Simulate proportional volume reduction",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "regional_shock",
    label: "Regional Event",
    icon: MapPin,
    description: "Simulate regional climate/weather event",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "price_spike",
    label: "Price Shock",
    icon: DollarSign,
    description: "Simulate feedstock cost increases",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const REGIONS = [
  { value: "QLD", label: "Queensland" },
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "SA", label: "South Australia" },
  { value: "WA", label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
];

const RATING_COLORS: Record<string, string> = {
  AAA: "bg-[#D4AF37] text-black",
  AA: "bg-green-500 text-black",
  A: "bg-lime-500 text-black",
  BBB: "bg-yellow-500 text-black",
  BB: "bg-[#D4AF37] text-black",
  B: "bg-orange-500 text-black",
  CCC: "bg-red-500 text-black",
  CC: "bg-red-700 text-black",
};

export default function StressTesting() {
  const { user, loading: authLoading } = useAuth();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>("supplier_loss");
  const [activeTab, setActiveTab] = useState<string>("run");

  // Scenario parameters
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [shortfallPercent, setShortfallPercent] = useState<number>(20);
  const [region, setRegion] = useState<string>("QLD");
  const [reductionPercent, setReductionPercent] = useState<number>(50);
  const [priceIncreasePercent, setPriceIncreasePercent] = useState<number>(40);

  // Queries
  const { data: projects, isLoading: projectsLoading } =
    trpc.bankability.getMyProjects.useQuery(undefined, { enabled: !!user });

  const { data: stressResults, isLoading: resultsLoading, refetch: refetchResults } =
    trpc.stressTesting.getProjectResults.useQuery(
      { projectId: selectedProject! },
      { enabled: !!selectedProject }
    );

  // Mutations
  const runComprehensiveTest = trpc.stressTesting.runComprehensiveTest.useMutation({
    onSuccess: () => {
      refetchResults();
      setActiveTab("history");
    },
  });

  // Note: runPriceShockAnalysis and runRegionalAnalysis are queries used within comprehensive test
  

  const selectedProjectData = projects?.find((p: any) => p.id === selectedProject);

  const handleRunTest = async () => {
    if (!selectedProject || !user) return;

    const scenarioParams: any = {};

    switch (selectedScenario) {
      case "supplier_loss":
        if (!supplierId) {
          alert("Please select a supplier");
          return;
        }
        scenarioParams.supplierId = supplierId;
        break;
      case "supply_shortfall":
        scenarioParams.shortfallPercent = shortfallPercent;
        break;
      case "regional_shock":
        scenarioParams.region = region;
        scenarioParams.reductionPercent = reductionPercent;
        break;
      case "price_spike":
        scenarioParams.priceIncreasePercent = priceIncreasePercent;
        break;
    }

    runComprehensiveTest.mutate({
      projectId: selectedProject,
      scenarioType: selectedScenario as any,
      scenarioParams,
      baseScore: 75,
      baseRating: "A",
      projectEconomics: selectedScenario === "price_spike" ? {
        baseRevenue: 50000000,
        baseCost: 35000000,
        targetMargin: 15,
      } : undefined,
    });
  };

  if (authLoading) {
    return (
      <PageLayout>
        <PageContainer>
          <div className="space-y-4 py-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          </div>
        </PageContainer>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 text-black py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-red-500/10 blur-[100px]" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[80px]" />
        </div>

        <PageContainer className="relative z-10" padding="none">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge
                  variant="outline"
                  className="border-red-400/50 text-red-300 bg-red-500/10"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Phase 6: Stress Testing
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-400/50 text-blue-300 bg-blue-500/10"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Lender-Grade Analysis
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
                Bankability Stress Testing
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Simulate adverse scenarios to test project resilience. Demonstrate
                to lenders how your supply chain performs under stress conditions.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer>
        <div className="grid lg:grid-cols-4 gap-6 -mt-8">
          {/* Project Selector */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Select Project</CardTitle>
                <CardDescription>
                  Choose a project to stress test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {projectsLoading ? (
                  <Skeleton className="h-20" />
                ) : projects?.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No projects found
                  </p>
                ) : (
                  projects?.map((project: any) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-colors",
                        selectedProject === project.id
                          ? "bg-[#D4AF37]/10 border-primary"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className="font-medium text-sm">{project.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {project.nameplateCapacity} MW • {project.state}
                      </div>
                      {project.bankabilityRating && (
                        <Badge
                          className={cn(
                            "mt-2 text-xs",
                            RATING_COLORS[project.bankabilityRating]
                          )}
                        >
                          {project.bankabilityRating}
                        </Badge>
                      )}
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {!selectedProject ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Select a Project
                  </h3>
                  <p className="text-gray-600">
                    Choose a project from the sidebar to run stress tests
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="run" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Run Stress Test
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Test History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="run" className="space-y-6 mt-6">
                  {/* Scenario Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Scenario Type</CardTitle>
                      <CardDescription>
                        Choose the type of stress scenario to simulate
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {SCENARIO_TYPES.map((scenario) => {
                          const Icon = scenario.icon;
                          return (
                            <button
                              key={scenario.id}
                              onClick={() => setSelectedScenario(scenario.id)}
                              className={cn(
                                "p-4 rounded-xl border-2 text-left transition-all",
                                selectedScenario === scenario.id
                                  ? "border-primary bg-primary/5"
                                  : "border-muted hover:border-muted-foreground/30"
                              )}
                            >
                              <div className={cn("p-2 rounded-lg w-fit mb-3", scenario.bgColor)}>
                                <Icon className={cn("h-5 w-5", scenario.color)} />
                              </div>
                              <div className="font-semibold">{scenario.label}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {scenario.description}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Scenario Parameters */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Scenario Parameters</CardTitle>
                      <CardDescription>
                        Configure the stress test parameters
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {selectedScenario === "supplier_loss" && (
                        <div className="space-y-4">
                          <Label>Select Supplier to Remove</Label>
                          <Select
                            value={supplierId?.toString() || ""}
                            onValueChange={(v) => setSupplierId(parseInt(v))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose supplier..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Top Supplier (35% of volume)</SelectItem>
                              <SelectItem value="2">Second Supplier (25% of volume)</SelectItem>
                              <SelectItem value="3">Third Supplier (20% of volume)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-gray-600">
                            Simulates complete loss of selected supplier. Tests concentration risk and backup supply adequacy.
                          </p>
                        </div>
                      )}

                      {selectedScenario === "supply_shortfall" && (
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label>Supply Shortfall Percentage</Label>
                            <span className="font-mono text-sm font-medium">
                              {shortfallPercent}%
                            </span>
                          </div>
                          <Slider
                            value={[shortfallPercent]}
                            onValueChange={([v]) => setShortfallPercent(v)}
                            min={5}
                            max={50}
                            step={5}
                          />
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>5% (Minor)</span>
                            <span>25% (Moderate)</span>
                            <span>50% (Severe)</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Applies proportional reduction to all supplier volumes. Tests overall supply resilience.
                          </p>
                        </div>
                      )}

                      {selectedScenario === "regional_shock" && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label>Affected Region</Label>
                            <Select value={region} onValueChange={setRegion}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {REGIONS.map((r) => (
                                  <SelectItem key={r.value} value={r.value}>
                                    {r.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Production Reduction</Label>
                              <span className="font-mono text-sm font-medium">
                                {reductionPercent}%
                              </span>
                            </div>
                            <Slider
                              value={[reductionPercent]}
                              onValueChange={([v]) => setReductionPercent(v)}
                              min={10}
                              max={100}
                              step={10}
                            />
                          </div>
                          <p className="text-sm text-gray-600">
                            Simulates regional climate event (drought, flood, bushfire). Tests geographic diversification.
                          </p>
                        </div>
                      )}

                      {selectedScenario === "price_spike" && (
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label>Price Increase</Label>
                            <span className="font-mono text-sm font-medium">
                              +{priceIncreasePercent}%
                            </span>
                          </div>
                          <Slider
                            value={[priceIncreasePercent]}
                            onValueChange={([v]) => setPriceIncreasePercent(v)}
                            min={10}
                            max={100}
                            step={10}
                          />
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>+10%</span>
                            <span>+50%</span>
                            <span>+100%</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Simulates feedstock commodity price shock. Tests project margin resilience and break-even thresholds.
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={handleRunTest}
                        className="w-full"
                        size="lg"
                        disabled={runComprehensiveTest.isPending}
                      >
                        {runComprehensiveTest.isPending ? (
                          <>Running Stress Test...</>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Run Stress Test
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-6 mt-6">
                  {resultsLoading ? (
                    <Skeleton className="h-64" />
                  ) : !stressResults || stressResults.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No Stress Tests Yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Run your first stress test to see results here
                        </p>
                        <Button onClick={() => setActiveTab("run")}>
                          Run a Test
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    stressResults.map((result: any) => (
                      <Card key={result.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {result.passesStressTest ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                                Stress Test Result
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {new Date(result.testDate).toLocaleString("en-AU")}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={result.passesStressTest ? "default" : "destructive"}
                            >
                              {result.passesStressTest ? "PASS" : "FAIL"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                          {/* Rating Impact */}
                          <div className="flex items-center justify-center gap-8">
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-2">
                                Base Rating
                              </div>
                              <Badge
                                className={cn(
                                  "text-lg px-4 py-1",
                                  RATING_COLORS[result.baseRating]
                                )}
                              >
                                {result.baseRating}
                              </Badge>
                              <div className="text-sm text-gray-600 mt-1">
                                Score: {result.baseScore}
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <ArrowRight className="h-6 w-6 text-gray-600" />
                              <div className={cn(
                                "text-sm font-medium mt-1",
                                result.ratingDelta < 0 ? "text-red-600" : "text-green-600"
                              )}>
                                {result.ratingDelta >= 0 ? "+" : ""}{result.ratingDelta} notches
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-2">
                                Stress Rating
                              </div>
                              <Badge
                                className={cn(
                                  "text-lg px-4 py-1",
                                  RATING_COLORS[result.stressRating]
                                )}
                              >
                                {result.stressRating}
                              </Badge>
                              <div className="text-sm text-gray-600 mt-1">
                                Score: {result.stressScore}
                              </div>
                            </div>
                          </div>

                          {/* Key Metrics */}
                          <div className="grid md:grid-cols-4 gap-4">
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                              <div className="text-xs text-gray-600">
                                Supply Shortfall
                              </div>
                              <div className="text-xl font-bold font-mono text-red-600">
                                {result.supplyShortfallPercent}%
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                              <div className="text-xs text-gray-600">
                                HHI Delta
                              </div>
                              <div className={cn(
                                "text-xl font-bold font-mono",
                                result.hhiDelta > 0 ? "text-orange-600" : "text-green-600"
                              )}>
                                {result.hhiDelta > 0 ? "+" : ""}{result.hhiDelta}
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                              <div className="text-xs text-gray-600">
                                Remaining Suppliers
                              </div>
                              <div className="text-xl font-bold font-mono">
                                {result.remainingSuppliers}
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                              <div className="text-xs text-gray-600">
                                Investment Grade
                              </div>
                              <div className="text-xl font-bold">
                                {result.minimumRatingMaintained ? (
                                  <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto" />
                                ) : (
                                  <XCircle className="h-6 w-6 text-red-600 mx-auto" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Covenant Breaches */}
                          {result.covenantBreaches && result.covenantBreaches.length > 0 && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Covenant Breaches Detected</AlertTitle>
                              <AlertDescription>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                  {result.covenantBreaches.map((breach: any, i: number) => (
                                    <li key={i}>
                                      <strong>{breach.covenantType}</strong>: {breach.actualValue} vs threshold {breach.threshold} ({breach.breachSeverity})
                                    </li>
                                  ))}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Narrative Summary */}
                          <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/50">
                            <h4 className="font-semibold flex items-center gap-2 mb-2">
                              <BarChart3 className="h-4 w-4" />
                              Analysis Summary
                            </h4>
                            <p className="text-sm text-gray-600">
                              {result.narrativeSummary}
                            </p>
                          </div>

                          {/* Recommendations */}
                          {result.recommendations && result.recommendations.length > 0 && (
                            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                              <h4 className="font-semibold flex items-center gap-2 mb-3 text-blue-900 dark:text-blue-100">
                                <Lightbulb className="h-4 w-4" />
                                Recommendations
                              </h4>
                              <ul className="space-y-2">
                                {result.recommendations.map((rec: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                                    <ArrowRight className="h-4 w-4 shrink-0 mt-0.5" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </PageContainer>
    </PageLayout>
  );
}
