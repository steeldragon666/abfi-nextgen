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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sun,
  Wind,
  Leaf,
  Zap,
  Battery,
  Building2,
  Truck,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  PieChart,
  BarChart3,
  Users,
  Factory,
} from "lucide-react";
import { format } from "date-fns";
import {
  PieChart as RechartsPie,
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
  AreaChart,
  Area,
} from "recharts";

// Types
interface ARENAProject {
  id: string;
  name: string;
  recipient: string;
  state: string;
  technology: string;
  status: "active" | "completed" | "announced";
  arenaFunding: number;
  totalCost: number;
  startDate: string;
  completionDate: string | null;
  description: string;
  outcomes: {
    capacity?: string;
    co2Reduction?: number;
    jobsCreated?: number;
  };
}

interface CEFCInvestment {
  id: string;
  name: string;
  recipient: string;
  state: string;
  sector: string;
  investmentType: "debt" | "equity" | "guarantee";
  status: "active" | "completed" | "announced";
  cefcCommitment: number;
  totalProjectValue: number;
  interestRate?: number;
  term?: string;
  announcedDate: string;
  description: string;
  outcomes: {
    capacity?: string;
    co2Reduction?: number;
    energySavings?: string;
  };
}

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

const TECHNOLOGY_ICONS: Record<string, React.ReactNode> = {
  Bioenergy: <Leaf className="h-4 w-4" />,
  Solar: <Sun className="h-4 w-4" />,
  Wind: <Wind className="h-4 w-4" />,
  Hydrogen: <Zap className="h-4 w-4" />,
  Storage: <Battery className="h-4 w-4" />,
  Transport: <Truck className="h-4 w-4" />,
  "Energy Efficiency": <Building2 className="h-4 w-4" />,
};

export default function ARENACEFCDashboard() {
  const [arenaProjects, setArenaProjects] = useState<ARENAProject[]>([]);
  const [arenaStats, setArenaStats] = useState<any>(null);
  const [cefcInvestments, setCefcInvestments] = useState<CEFCInvestment[]>([]);
  const [cefcStats, setCefcStats] = useState<any>(null);
  const [bioenergyFunding, setBioenergyFunding] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedArenaState, setSelectedArenaState] = useState("all");
  const [selectedArenaTech, setSelectedArenaTech] = useState("all");
  const [selectedCefcSector, setSelectedCefcSector] = useState("all");
  const [selectedCefcState, setSelectedCefcState] = useState("all");

  const [selectedProject, setSelectedProject] = useState<ARENAProject | CEFCInvestment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsType, setDetailsType] = useState<"arena" | "cefc">("arena");

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [arenaRes, arenaStatsRes, cefcRes, cefcStatsRes, bioRes] = await Promise.all([
        fetch("/api/australian-data/arena/projects"),
        fetch("/api/australian-data/arena/stats"),
        fetch("/api/australian-data/cefc/investments"),
        fetch("/api/australian-data/cefc/stats"),
        fetch("/api/australian-data/bioenergy-funding"),
      ]);

      if (arenaRes.ok) {
        const data = await arenaRes.json();
        setArenaProjects(data.projects || []);
      }
      if (arenaStatsRes.ok) {
        const data = await arenaStatsRes.json();
        setArenaStats(data);
      }
      if (cefcRes.ok) {
        const data = await cefcRes.json();
        setCefcInvestments(data.investments || []);
      }
      if (cefcStatsRes.ok) {
        const data = await cefcStatsRes.json();
        setCefcStats(data);
      }
      if (bioRes.ok) {
        const data = await bioRes.json();
        setBioenergyFunding(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case "announced":
        return <Badge className="bg-amber-100 text-amber-800"><Clock className="h-3 w-3 mr-1" />Announced</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getInvestmentTypeBadge = (type: string) => {
    switch (type) {
      case "debt":
        return <Badge className="bg-blue-100 text-blue-800">Debt</Badge>;
      case "equity":
        return <Badge className="bg-purple-100 text-purple-800">Equity</Badge>;
      case "guarantee":
        return <Badge className="bg-amber-100 text-amber-800">Guarantee</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // Filter projects
  const filteredArenaProjects = arenaProjects.filter((p) => {
    const matchesState = selectedArenaState === "all" || p.state === selectedArenaState;
    const matchesTech = selectedArenaTech === "all" || p.technology === selectedArenaTech;
    return matchesState && matchesTech;
  });

  const filteredCefcInvestments = cefcInvestments.filter((i) => {
    const matchesSector = selectedCefcSector === "all" || i.sector === selectedCefcSector;
    const matchesState = selectedCefcState === "all" || i.state === selectedCefcState;
    return matchesSector && matchesState;
  });

  const openProjectDetails = (project: ARENAProject | CEFCInvestment, type: "arena" | "cefc") => {
    setSelectedProject(project);
    setDetailsType(type);
    setDetailsOpen(true);
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
          <h1 className="text-3xl font-bold mb-2">ARENA & CEFC Integration</h1>
          <p className="text-gray-600">
            Australian government clean energy funding and investment data
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
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700">ARENA Funding</p>
                <p className="text-2xl font-bold text-green-900">
                  {arenaStats ? formatCurrency(arenaStats.overview?.totalFundingCommitted || 0) : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">CEFC Commitments</p>
                <p className="text-2xl font-bold text-blue-900">
                  {cefcStats ? formatCurrency(cefcStats.overview?.totalCommitments || 0) : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Factory className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700">CO2 Avoided</p>
                <p className="text-2xl font-bold text-purple-900">
                  {arenaStats ? `${((arenaStats.impact?.co2AvoidedAnnually || 0) / 1000000).toFixed(1)}M t` : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-amber-700">Jobs Supported</p>
                <p className="text-2xl font-bold text-amber-900">
                  {arenaStats ? `${((arenaStats.impact?.jobsSupported || 0) / 1000).toFixed(1)}K` : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="arena" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="arena">ARENA Projects</TabsTrigger>
          <TabsTrigger value="cefc">CEFC Investments</TabsTrigger>
          <TabsTrigger value="bioenergy">Bioenergy Focus</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ARENA Tab */}
        <TabsContent value="arena">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <img src="https://arena.gov.au/assets/favicons/favicon-32x32.png" alt="ARENA" className="h-6 w-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                    ARENA Projects
                  </CardTitle>
                  <CardDescription>Australian Renewable Energy Agency funded projects</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedArenaState} onValueChange={setSelectedArenaState}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="State" />
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
                  <Select value={selectedArenaTech} onValueChange={setSelectedArenaTech}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Technology" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tech</SelectItem>
                      <SelectItem value="Bioenergy">Bioenergy</SelectItem>
                      <SelectItem value="Solar">Solar</SelectItem>
                      <SelectItem value="Wind">Wind</SelectItem>
                      <SelectItem value="Hydrogen">Hydrogen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Technology</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>ARENA Funding</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArenaProjects.map((project) => (
                    <TableRow key={project.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-gray-500">{project.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{project.recipient}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {TECHNOLOGY_ICONS[project.technology]}
                          <span>{project.technology}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.state}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(project.arenaFunding)}</TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openProjectDetails(project, "arena")}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CEFC Tab */}
        <TabsContent value="cefc">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                    CEFC Investments
                  </CardTitle>
                  <CardDescription>Clean Energy Finance Corporation portfolio</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCefcSector} onValueChange={setSelectedCefcSector}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      <SelectItem value="Bioenergy">Bioenergy</SelectItem>
                      <SelectItem value="Hydrogen">Hydrogen</SelectItem>
                      <SelectItem value="Storage">Storage</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Energy Efficiency">Energy Efficiency</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedCefcState} onValueChange={setSelectedCefcState}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="State" />
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
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investment</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>CEFC Commitment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCefcInvestments.map((investment) => (
                    <TableRow key={investment.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{investment.name}</p>
                          <p className="text-xs text-gray-500">{investment.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{investment.recipient}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {TECHNOLOGY_ICONS[investment.sector]}
                          <span>{investment.sector}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getInvestmentTypeBadge(investment.investmentType)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(investment.cefcCommitment)}</TableCell>
                      <TableCell>{getStatusBadge(investment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openProjectDetails(investment, "cefc")}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bioenergy Focus Tab */}
        <TabsContent value="bioenergy">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Bioenergy Sector Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bioenergyFunding ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">Total Government Support</p>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(bioenergyFunding.summary?.totalGovernmentSupport || 0)}
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">Active Projects</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {bioenergyFunding.summary?.activeProjects || 0}
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-700">SAF Capacity</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {bioenergyFunding.summary?.safProductionCapacity || 0} ML/yr
                        </p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <p className="text-sm text-amber-700">Jobs Supported</p>
                        <p className="text-2xl font-bold text-amber-900">
                          {(bioenergyFunding.summary?.bioenergyJobsSupported || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">Funding by Feedstock</h4>
                      <div className="space-y-2">
                        {bioenergyFunding.feedstockFocus?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{item.feedstock}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{item.projects} projects</Badge>
                              <span className="font-medium">{formatCurrency(item.funding)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading bioenergy data...</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Upcoming Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bioenergyFunding?.upcomingOpportunities ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">ARENA</Badge>
                        Open Funding Rounds
                      </h4>
                      <div className="space-y-3">
                        {bioenergyFunding.upcomingOpportunities.arenaCalls?.map((call: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{call.name}</p>
                                <p className="text-sm text-gray-600">{call.focus}</p>
                              </div>
                              <Badge variant="outline">{formatCurrency(call.funding)}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Closes: {format(new Date(call.closes), "d MMM yyyy")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">CEFC</Badge>
                        Priority Areas
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {bioenergyFunding.upcomingOpportunities.cefcPriorities?.map((priority: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {priority}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading opportunities...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            {/* ARENA Technology Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  ARENA Funding by Technology
                </CardTitle>
              </CardHeader>
              <CardContent>
                {arenaStats?.byTechnology ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={arenaStats.byTechnology}
                        dataKey="funding"
                        nameKey="technology"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ technology, percentage }) => `${technology}: ${percentage}%`}
                      >
                        {arenaStats.byTechnology.map((_: any, index: number) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </RechartsPie>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">Loading chart...</p>
                )}
              </CardContent>
            </Card>

            {/* CEFC Sector Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  CEFC Commitments by Sector
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cefcStats?.bySector ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cefcStats.bySector} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} />
                      <YAxis dataKey="sector" type="category" width={120} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="commitments" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">Loading chart...</p>
                )}
              </CardContent>
            </Card>

            {/* Yearly Funding Trends */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Annual Funding Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {arenaStats?.yearlyFunding && cefcStats?.yearlyActivity ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={arenaStats.yearlyFunding.map((a: any, i: number) => ({
                        year: a.year,
                        arena: a.committed,
                        cefc: cefcStats.yearlyActivity[i]?.commitments || 0,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(v) => formatCurrency(v)} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="arena"
                        name="ARENA"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="cefc"
                        name="CEFC"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500">Loading chart...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Project/Investment Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {detailsType === "arena" ? (selectedProject as ARENAProject).name : (selectedProject as CEFCInvestment).name}
                </DialogTitle>
                <DialogDescription>
                  {detailsType === "arena" ? "ARENA Funded Project" : "CEFC Investment"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedProject.status)}
                  {detailsType === "cefc" && getInvestmentTypeBadge((selectedProject as CEFCInvestment).investmentType)}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedProject.state}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {detailsType === "arena" ? "ARENA Funding" : "CEFC Commitment"}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        detailsType === "arena"
                          ? (selectedProject as ARENAProject).arenaFunding
                          : (selectedProject as CEFCInvestment).cefcCommitment
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Project Value</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        detailsType === "arena"
                          ? (selectedProject as ARENAProject).totalCost
                          : (selectedProject as CEFCInvestment).totalProjectValue
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recipient</h4>
                  <p>{selectedProject.recipient}</p>
                </div>

                {detailsType === "cefc" && (selectedProject as CEFCInvestment).interestRate && (
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Interest Rate</p>
                      <p className="font-medium">{(selectedProject as CEFCInvestment).interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Term</p>
                      <p className="font-medium">{(selectedProject as CEFCInvestment).term}</p>
                    </div>
                  </div>
                )}

                {selectedProject.outcomes && (
                  <div>
                    <h4 className="font-semibold mb-2">Expected Outcomes</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedProject.outcomes.capacity && (
                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                          <Zap className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                          <p className="text-sm font-medium">{selectedProject.outcomes.capacity}</p>
                          <p className="text-xs text-gray-500">Capacity</p>
                        </div>
                      )}
                      {selectedProject.outcomes.co2Reduction && (
                        <div className="p-3 bg-green-50 rounded-lg text-center">
                          <Leaf className="h-5 w-5 text-green-600 mx-auto mb-1" />
                          <p className="text-sm font-medium">
                            {selectedProject.outcomes.co2Reduction.toLocaleString()} t
                          </p>
                          <p className="text-xs text-gray-500">CO2 Reduction</p>
                        </div>
                      )}
                      {(selectedProject as ARENAProject).outcomes?.jobsCreated && (
                        <div className="p-3 bg-amber-50 rounded-lg text-center">
                          <Users className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                          <p className="text-sm font-medium">
                            {(selectedProject as ARENAProject).outcomes.jobsCreated}
                          </p>
                          <p className="text-xs text-gray-500">Jobs Created</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" asChild>
                    <a
                      href={detailsType === "arena" ? "https://arena.gov.au/projects/" : "https://www.cefc.com.au/where-we-invest/"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on {detailsType === "arena" ? "ARENA" : "CEFC"} Website
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
