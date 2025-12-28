import { useState } from "react";
import { H1, H2, H3, H4, Body, MetricValue, DataLabel } from "@/components/Typography";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Building2,
  FileCheck,
  Factory,
  Award,
  Leaf,
  FileText,
  HardHat,
  Tag,
  MapPin,
  Hash,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Eye,
  TrendingUp,
  Zap,
  Target,
  Clock,
  Filter,
  X,
  Database,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  SIGNAL_TYPE_INFO,
  type EntitySummary,
  type EntityDetail,
  type Signal,
  type DashboardStats,
} from "@/lib/stealthDiscoveryApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// Icon mapping for signal types
const SIGNAL_ICONS: Record<string, React.ElementType> = {
  patent_biofuel_tech: FileCheck,
  permit_fuel_production: Factory,
  grant_awarded: Award,
  environmental_approval: Leaf,
  new_company_biofuel: Building2,
  permit_industrial: HardHat,
  patent_related_tech: FileText,
  company_industry_code: Tag,
  company_name_match: Search,
  location_cluster: MapPin,
  keyword_match: Hash,
};

// Score color helper
function getScoreColor(score: number): string {
  if (score >= 80) return "text-[#D4AF37]";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-[#D4AF37]";
  return "text-gray-500";
}

function getScoreBadgeColor(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
  if (score >= 40) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

// Color palette for pie chart
const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function StealthDiscovery() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minScore, setMinScore] = useState<string>("0");
  const [isIngesting, setIsIngesting] = useState(false);

  // Admin mutation for triggering data ingestion
  const triggerIngestion = trpc.stealth.triggerIngestion.useMutation({
    onSuccess: (data) => {
      toast.success(`Ingestion complete: ${data.signalsDiscovered} signals discovered, ${data.entitiesCreated} new entities`);
      loadData();
    },
    onError: (error) => {
      toast.error(`Ingestion failed: ${error.message}`);
    },
    onSettled: () => {
      setIsIngesting(false);
    },
  });

  const handleTriggerIngestion = () => {
    setIsIngesting(true);
    triggerIngestion.mutate({ sinceDays: 30 });
  };

  // tRPC queries
  const statsQuery = trpc.stealth.getDashboardStats.useQuery();
  const entitiesQuery = trpc.stealth.listEntities.useQuery({
    minScore: Number(minScore),
    limit: 20,
    search: searchQuery || undefined,
  });
  const signalsQuery = trpc.stealth.getRecentSignals.useQuery({ limit: 10 });
  const entityQuery = trpc.stealth.getEntity.useQuery(
    { id: selectedEntityId! },
    { enabled: !!selectedEntityId }
  );
  const entitySignalsQuery = trpc.stealth.getEntitySignals.useQuery(
    { entityId: selectedEntityId!, limit: 50 },
    { enabled: !!selectedEntityId }
  );

  // Map tRPC data to component format
  const stats: DashboardStats | null = statsQuery.data
    ? {
        total_entities: statsQuery.data.totalEntities,
        high_score_entities: statsQuery.data.highScoreEntities,
        new_signals_today: statsQuery.data.newSignalsToday,
        new_signals_week: statsQuery.data.newSignalsWeek,
        top_signal_types: statsQuery.data.topSignalTypes,
      }
    : null;

  const entities: EntitySummary[] = (entitiesQuery.data || []).map((e) => ({
    id: String(e.id),
    entity_type: e.entity_type,
    canonical_name: e.canonical_name,
    current_score: e.current_score,
    signal_count: e.signal_count,
    last_signal_at: e.last_signal_at,
  }));

  const recentSignals: Signal[] = (signalsQuery.data || []).map((s) => ({
    id: String(s.id),
    entity_id: String(s.entity_id),
    signal_type: s.signal_type,
    signal_weight: 1,
    confidence: 1,
    source: s.source,
    title: s.title,
    description: null,
    detected_at: s.detected_at,
  }));

  const selectedEntity: EntityDetail | null = entityQuery.data
    ? {
        id: String(entityQuery.data.id),
        entity_type: entityQuery.data.entity_type,
        canonical_name: entityQuery.data.canonical_name,
        current_score: entityQuery.data.current_score,
        signal_count: entityQuery.data.signal_count,
        last_signal_at: entityQuery.data.last_signal_at,
        all_names: entityQuery.data.all_names as string[] | null,
        identifiers: entityQuery.data.identifiers as Record<string, string[]> | null,
        metadata: entityQuery.data.metadata as Record<string, unknown> | null,
        needs_review: entityQuery.data.needsReview,
        review_notes: entityQuery.data.reviewNotes || null,
        created_at: entityQuery.data.created_at,
        updated_at: entityQuery.data.updated_at,
      }
    : null;

  const entitySignals: Signal[] = (entitySignalsQuery.data || []).map((s) => ({
    id: String(s.id),
    entity_id: String(s.entity_id),
    signal_type: s.signal_type,
    signal_weight: s.signal_weight,
    confidence: s.confidence,
    source: s.source,
    title: s.title,
    description: s.description,
    detected_at: s.detected_at,
  }));

  const loading = statsQuery.isLoading || entitiesQuery.isLoading;
  const error = statsQuery.error?.message || entitiesQuery.error?.message || null;

  const loadData = () => {
    statsQuery.refetch();
    entitiesQuery.refetch();
    signalsQuery.refetch();
  };

  const loadEntityDetails = (entityId: string) => {
    setSelectedEntityId(Number(entityId));
  };

  const handleSearch = () => {
    entitiesQuery.refetch();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateStr);
  };

  // Prepare chart data
  const signalTypesChartData = stats?.top_signal_types.map((item, index) => ({
    name: SIGNAL_TYPE_INFO[item.type]?.label || item.type,
    value: item.count,
    color: PIE_COLORS[index % PIE_COLORS.length],
  })) || [];

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 space-y-6">
          <Skeleton className="h-12 w-96" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="col-span-2 h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !stats) {
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
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Eye className="h-3 w-3 mr-1" />
                Stealth Mode
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">Stealth Discovery</h1>
            <p className="text-gray-600 mt-1">
              Surface unannounced biofuel projects through signal analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                variant="outline"
                onClick={handleTriggerIngestion}
                disabled={isIngesting}
                className="bg-purple-50 border-purple-200 hover:bg-purple-100"
              >
                <Database className={`h-4 w-4 mr-2 ${isIngesting ? "animate-pulse" : ""}`} />
                {isIngesting ? "Ingesting..." : "Ingest Data"}
              </Button>
            )}
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
              <CardDescription>Entities Tracked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-8 w-8 text-blue-600" />
                <span className="text-4xl font-bold">
                  {stats?.total_entities || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Companies & projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>High Score Entities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-[#D4AF37]" />
                <span className="text-4xl font-bold text-[#D4AF37]">
                  {stats?.high_score_entities || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Score &gt; 70
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>New Signals Today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Zap className="h-8 w-8 text-[#D4AF37]" />
                <span className="text-4xl font-bold text-[#D4AF37]">
                  {stats?.new_signals_today || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Fresh intelligence
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Weekly Activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-purple-600" />
                <span className="text-4xl font-bold">
                  {stats?.new_signals_week || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Signals this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Entity List - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search & Filters */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Discovered Entities
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={minScore} onValueChange={setMinScore}>
                      <SelectTrigger className="w-32">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Min Score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All Scores</SelectItem>
                        <SelectItem value="40">Score &gt; 40</SelectItem>
                        <SelectItem value="60">Score &gt; 60</SelectItem>
                        <SelectItem value="80">Score &gt; 80</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search Bar */}
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                    <Input
                      placeholder="Search entities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-9"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => {
                          setSearchQuery("");
                          loadData();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button onClick={handleSearch}>Search</Button>
                </div>

                {/* Entity List */}
                <div className="space-y-3">
                  {entities.map((entity) => (
                    <div
                      key={entity.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedEntity?.id === entity.id
                          ? "bg-primary/5 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => loadEntityDetails(entity.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-600" />
                            <h4 className="font-medium">{entity.canonical_name}</h4>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {entity.signal_count} signals
                            </span>
                            {entity.last_signal_at && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatRelativeTime(entity.last_signal_at)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={getScoreBadgeColor(entity.current_score)}>
                            {entity.current_score.toFixed(1)}
                          </Badge>
                          <div className="mt-2 w-24">
                            <Progress value={entity.current_score} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Signal Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Signal Type Distribution</CardTitle>
                <CardDescription>
                  Breakdown of detected signals by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={signalTypesChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                        >
                          {signalTypesChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {signalTypesChartData.map((item, index) => {
                      const Icon = SIGNAL_ICONS[stats?.top_signal_types[index]?.type || ""] || FileText;
                      return (
                        <div key={item.name} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <Icon className="h-4 w-4 text-gray-600" />
                          <span className="flex-1 text-sm">{item.name}</span>
                          <span className="text-sm font-medium">{item.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Entity Details */}
            {selectedEntity && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Entity Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedEntity.canonical_name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {selectedEntity.entity_type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Score</div>
                      <div className={`text-2xl font-bold ${getScoreColor(selectedEntity.current_score)}`}>
                        {selectedEntity.current_score.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Signals</div>
                      <div className="text-2xl font-bold">{selectedEntity.signal_count}</div>
                    </div>
                  </div>

                  {selectedEntity.identifiers && Object.keys(selectedEntity.identifiers).length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Identifiers</div>
                      <div className="space-y-1">
                        {Object.entries(selectedEntity.identifiers).map(([key, values]) => (
                          <div key={key} className="text-sm">
                            <span className="uppercase text-gray-600">{key}:</span>{" "}
                            {(values as string[]).join(", ")}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entitySignals.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Recent Signals</div>
                      <div className="space-y-2">
                        {entitySignals.slice(0, 3).map((signal) => {
                          const Icon = SIGNAL_ICONS[signal.signal_type] || FileText;
                          return (
                            <div key={signal.id} className="p-2 rounded bg-muted/50 text-sm">
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-gray-600" />
                                <span className="font-medium line-clamp-1">
                                  {signal.title || SIGNAL_TYPE_INFO[signal.signal_type]?.label || signal.signal_type}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {formatRelativeTime(signal.detected_at)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Signals Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Live Signal Feed
                </CardTitle>
                <CardDescription>Latest detected signals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {recentSignals.map((signal) => {
                  const Icon = SIGNAL_ICONS[signal.signal_type] || FileText;
                  const info = SIGNAL_TYPE_INFO[signal.signal_type];
                  return (
                    <div
                      key={signal.id}
                      className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => loadEntityDetails(signal.entity_id)}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="h-4 w-4 mt-0.5 text-gray-600" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2">
                            {signal.title || info?.label || signal.signal_type}
                          </h4>
                          {signal.description && (
                            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                              {signal.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {info?.label || signal.signal_type}
                            </Badge>
                            <span className="text-xs text-gray-600">
                              {formatRelativeTime(signal.detected_at)}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          +{signal.signal_weight}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
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
                <Link href="/feedstock-prices">
                  <Button variant="outline" className="w-full justify-between">
                    Feedstock Prices
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/policy-carbon">
                  <Button variant="outline" className="w-full justify-between">
                    Policy & Carbon
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
