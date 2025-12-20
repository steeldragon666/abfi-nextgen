import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  FileText,
  Calendar,
  ChevronRight,
  Calculator,
  Leaf,
  Scale,
  Clock,
  ExternalLink,
  Building,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";
import {
  policyApi,
  type PolicyKPI,
  type PolicyTimelineEvent,
  type PolicyKanbanItem,
  type MandateScenario,
  type CarbonCalculatorInput,
  type CarbonCalculatorResult,
  type OfftakeAgreement,
} from "@/lib/intelligenceApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const JURISDICTION_COLORS: Record<string, string> = {
  Federal: "#3b82f6",
  NSW: "#22c55e",
  VIC: "#8b5cf6",
  QLD: "#f97316",
  SA: "#eab308",
  WA: "#ef4444",
  TAS: "#06b6d4",
  NT: "#ec4899",
  ACT: "#6366f1",
};

const STATUS_COLORS: Record<string, string> = {
  proposed: "bg-yellow-100 text-yellow-800 border-yellow-300",
  review: "bg-blue-100 text-blue-800 border-blue-300",
  enacted: "bg-green-100 text-green-800 border-green-300",
  expired: "bg-gray-100 text-gray-800 border-gray-300",
};

const EVENT_COLORS: Record<string, string> = {
  enacted: "#22c55e",
  consultation_open: "#3b82f6",
  expected_decision: "#f97316",
};

export default function PolicyCarbonDashboard() {
  const [activeTab, setActiveTab] = useState("policy");
  const [policyKPIs, setPolicyKPIs] = useState<PolicyKPI[]>([]);
  const [timeline, setTimeline] = useState<PolicyTimelineEvent[]>([]);
  const [kanban, setKanban] = useState<{
    proposed: PolicyKanbanItem[];
    review: PolicyKanbanItem[];
    enacted: PolicyKanbanItem[];
  } | null>(null);
  const [mandateScenarios, setMandateScenarios] = useState<MandateScenario[]>([]);
  const [offtakeMarket, setOfftakeMarket] = useState<OfftakeAgreement[]>([]);
  const [accuPrice, setAccuPrice] = useState<{
    price: number;
    change: number;
    change_pct: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carbon calculator state
  const [calcInput, setCalcInput] = useState<CarbonCalculatorInput>({
    project_type: "bioenergy_plant",
    annual_output_tonnes: 50000,
    emission_factor: 0.85,
    baseline_year: 2025,
    carbon_price: 34.5,
  });
  const [calcResult, setCalcResult] = useState<CarbonCalculatorResult | null>(null);
  const [calculating, setCalculating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpis, timelineData, kanbanData, scenarios, offtake, accu] =
        await Promise.all([
          policyApi.getKPIs(),
          policyApi.getTimeline(2025),
          policyApi.getKanban(),
          policyApi.getMandateScenarios(),
          policyApi.getOfftakeMarket(),
          policyApi.getACCUPrice(),
        ]);
      setPolicyKPIs(kpis);
      setTimeline(timelineData);
      setKanban(kanbanData);
      setMandateScenarios(scenarios);
      setOfftakeMarket(offtake);
      setAccuPrice(accu);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateCarbon = async () => {
    setCalculating(true);
    try {
      const result = await policyApi.calculateCarbon(calcInput);
      setCalcResult(result);
    } catch (err) {
      console.error("Calculation error:", err);
    } finally {
      setCalculating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    });
  };

  // Group timeline events by month
  const timelineByMonth = timeline.reduce(
    (acc, event) => {
      const month = new Date(event.date).toLocaleDateString("en-AU", {
        month: "short",
        year: "numeric",
      });
      if (!acc[month]) acc[month] = [];
      acc[month].push(event);
      return acc;
    },
    {} as Record<string, PolicyTimelineEvent[]>
  );

  if (loading && !kanban) {
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
            <h1 className="text-3xl font-bold">Policy & Carbon Revenue</h1>
            <p className="text-muted-foreground mt-1">
              Track Australian bioenergy policy and calculate carbon revenue projections
            </p>
          </div>
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {policyKPIs.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardDescription>{kpi.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">
                    {kpi.label === "ACCU Price" ? `$${kpi.value}` : kpi.value}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {kpi.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="policy" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Policy Tracker
            </TabsTrigger>
            <TabsTrigger value="carbon" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Carbon Calculator
            </TabsTrigger>
            <TabsTrigger value="mandates" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Mandate Scenarios
            </TabsTrigger>
          </TabsList>

          {/* Policy Tracker Tab */}
          <TabsContent value="policy" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Timeline */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      2025 Policy Timeline
                    </CardTitle>
                    <CardDescription>
                      Key policy events by jurisdiction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(timelineByMonth).map(([month, events]) => (
                        <div key={month}>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                            {month}
                          </h4>
                          <div className="space-y-2">
                            {events.map((event, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor:
                                      JURISDICTION_COLORS[event.jurisdiction] || "#888",
                                  }}
                                />
                                <Badge variant="outline">{event.jurisdiction}</Badge>
                                <span className="flex-1 font-medium text-sm">
                                  {event.title}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={
                                    event.event_type === "enacted"
                                      ? "bg-green-100 text-green-800"
                                      : event.event_type === "consultation_open"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-orange-100 text-orange-800"
                                  }
                                >
                                  {event.event_type.replace("_", " ")}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(event.date)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Kanban */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      Proposed ({kanban?.proposed.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {kanban?.proposed.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 rounded border bg-yellow-50 border-yellow-200"
                      >
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.jurisdiction}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      In Review ({kanban?.review.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {kanban?.review.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 rounded border bg-blue-50 border-blue-200"
                      >
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.jurisdiction}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Scale className="h-4 w-4 text-green-600" />
                      Enacted ({kanban?.enacted.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {kanban?.enacted.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 rounded border bg-green-50 border-green-200"
                      >
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.jurisdiction}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Carbon Calculator Tab */}
          <TabsContent value="carbon" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Calculator Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Carbon Revenue Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate ACCU credits and revenue for your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Project Type</Label>
                    <Select
                      value={calcInput.project_type}
                      onValueChange={(v) =>
                        setCalcInput({ ...calcInput, project_type: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bioenergy_plant">
                          Bioenergy Plant
                        </SelectItem>
                        <SelectItem value="waste_to_energy">
                          Waste-to-Energy
                        </SelectItem>
                        <SelectItem value="biogas_facility">
                          Biogas Facility
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Annual Output: {calcInput.annual_output_tonnes.toLocaleString()}{" "}
                      tonnes
                    </Label>
                    <Slider
                      value={[calcInput.annual_output_tonnes]}
                      onValueChange={([v]) =>
                        setCalcInput({ ...calcInput, annual_output_tonnes: v })
                      }
                      min={10000}
                      max={200000}
                      step={5000}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Emission Factor: {calcInput.emission_factor} tCO2e/tonne
                    </Label>
                    <Slider
                      value={[calcInput.emission_factor * 100]}
                      onValueChange={([v]) =>
                        setCalcInput({ ...calcInput, emission_factor: v / 100 })
                      }
                      min={40}
                      max={150}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Carbon Price: ${calcInput.carbon_price}/tCO2</Label>
                    <Slider
                      value={[calcInput.carbon_price]}
                      onValueChange={([v]) =>
                        setCalcInput({ ...calcInput, carbon_price: v })
                      }
                      min={20}
                      max={80}
                      step={0.5}
                    />
                    {accuPrice && (
                      <p className="text-xs text-muted-foreground">
                        Current ACCU spot: ${accuPrice.price} (
                        {accuPrice.change >= 0 ? "+" : ""}
                        {accuPrice.change_pct.toFixed(1)}%)
                      </p>
                    )}
                  </div>

                  <Button onClick={calculateCarbon} className="w-full" disabled={calculating}>
                    {calculating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Revenue
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Calculator Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    Projected Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {calcResult ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                          <div className="text-sm text-green-700 mb-1">
                            ACCU Credits
                          </div>
                          <div className="text-2xl font-bold text-green-900">
                            {calcResult.accu_credits.toLocaleString()}
                          </div>
                          <div className="text-xs text-green-600">tCO2e/year</div>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="text-sm text-blue-700 mb-1">
                            ACCU Revenue
                          </div>
                          <div className="text-2xl font-bold text-blue-900">
                            {formatCurrency(calcResult.accu_revenue)}
                          </div>
                          <div className="text-xs text-blue-600">per year</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">
                          Safeguard Mechanism Benefit
                        </div>
                        <div className="text-xl font-bold">
                          {formatCurrency(calcResult.safeguard_benefit)}
                        </div>
                      </div>

                      <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="text-sm text-primary mb-1">
                          Total Annual Carbon Revenue
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          {formatCurrency(calcResult.total_annual_revenue)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 rounded border">
                          <div className="text-xs text-muted-foreground">
                            Low Scenario (-20%)
                          </div>
                          <div className="font-semibold text-red-600">
                            {formatCurrency(calcResult.sensitivity_low)}
                          </div>
                        </div>
                        <div className="p-3 rounded border">
                          <div className="text-xs text-muted-foreground">
                            High Scenario (+20%)
                          </div>
                          <div className="font-semibold text-green-600">
                            {formatCurrency(calcResult.sensitivity_high)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Configure your project parameters and click calculate</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mandate Scenarios Tab */}
          <TabsContent value="mandates" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Mandate Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Mandate Scenario Comparison</CardTitle>
                  <CardDescription>
                    Revenue impact under different mandate levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mandateScenarios} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                      />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Revenue Impact",
                        ]}
                      />
                      <Bar dataKey="revenue_impact" radius={[0, 4, 4, 0]}>
                        {mandateScenarios.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.mandate_level === "B20"
                                ? "#22c55e"
                                : entry.mandate_level === "B10"
                                  ? "#3b82f6"
                                  : entry.mandate_level === "B5"
                                    ? "#f97316"
                                    : "#888"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Offtake Market */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Offtake Market Intelligence
                  </CardTitle>
                  <CardDescription>
                    Current offtake agreements and premiums
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {offtakeMarket.map((agreement, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{agreement.offtaker}</div>
                            <div className="text-sm text-muted-foreground">
                              {agreement.mandate}
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {agreement.premium}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{agreement.volume}</span>
                          <span>{agreement.term}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Related Tools</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Link href="/lending-sentiment">
                  <Button variant="outline">
                    Lending Sentiment
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/feedstock-prices">
                  <Button variant="outline">
                    Feedstock Prices
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/stress-testing">
                  <Button variant="outline">
                    Stress Testing
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
