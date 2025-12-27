import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  DollarSign,
  Building2,
  Calendar,
  ExternalLink,
  Download,
  Eye,
  Leaf,
  Zap,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

// Grant program types
const GRANT_PROGRAMS = [
  { value: "arena", label: "ARENA", fullName: "Australian Renewable Energy Agency", color: "bg-green-100 text-green-800" },
  { value: "cefc", label: "CEFC", fullName: "Clean Energy Finance Corporation", color: "bg-blue-100 text-blue-800" },
  { value: "accu", label: "ACCU", fullName: "Australian Carbon Credit Units", color: "bg-purple-100 text-purple-800" },
  { value: "eis", label: "EIS", fullName: "Emissions Intensive Sector", color: "bg-amber-100 text-amber-800" },
  { value: "powering", label: "Powering", fullName: "Powering the Regions Fund", color: "bg-cyan-100 text-cyan-800" },
];

const GRANT_STATUS = [
  { value: "submitted", label: "Submitted", icon: Clock, color: "bg-gray-100 text-gray-800" },
  { value: "under_review", label: "Under Review", icon: Eye, color: "bg-blue-100 text-blue-800" },
  { value: "approved", label: "Approved", icon: CheckCircle2, color: "bg-green-100 text-green-800" },
  { value: "conditionally_approved", label: "Conditionally Approved", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800" },
  { value: "active", label: "Active", icon: Zap, color: "bg-emerald-100 text-emerald-800" },
  { value: "completed", label: "Completed", icon: CheckCircle2, color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", icon: XCircle, color: "bg-red-100 text-red-800" },
];

// Mock grant applications data
const MOCK_GRANTS = [
  {
    id: "GR-2024-001",
    projectName: "Mallee Eucalyptus Biomass Project",
    applicant: "EcoFuels Australia Pty Ltd",
    abn: "12 345 678 901",
    program: "arena",
    status: "active",
    submittedDate: "2024-03-15",
    approvedDate: "2024-05-20",
    totalFunding: 2500000,
    disbursed: 1250000,
    milestones: [
      { name: "Project Initiation", status: "completed", amount: 500000, date: "2024-06-01" },
      { name: "Site Preparation", status: "completed", amount: 750000, date: "2024-08-15" },
      { name: "Equipment Installation", status: "in_progress", amount: 750000, date: "2024-12-01" },
      { name: "Commissioning", status: "pending", amount: 500000, date: "2025-03-01" },
    ],
    location: "Mildura, VIC",
    feedstockType: "Mallee eucalyptus",
    carbonReduction: 15000,
    jobsCreated: 45,
    compliance: {
      financialReporting: "compliant",
      environmentalAssessment: "compliant",
      progressReports: "compliant",
      communityEngagement: "attention_required",
    },
  },
  {
    id: "GR-2024-002",
    projectName: "Canola Stubble Biofuel Initiative",
    applicant: "GrainPower Solutions",
    abn: "98 765 432 109",
    program: "cefc",
    status: "approved",
    submittedDate: "2024-06-10",
    approvedDate: "2024-09-05",
    totalFunding: 1800000,
    disbursed: 0,
    milestones: [
      { name: "Feasibility Study", status: "pending", amount: 200000, date: "2024-11-01" },
      { name: "Pilot Plant Construction", status: "pending", amount: 800000, date: "2025-03-01" },
      { name: "Commercial Operations", status: "pending", amount: 800000, date: "2025-09-01" },
    ],
    location: "Wagga Wagga, NSW",
    feedstockType: "Canola stubble",
    carbonReduction: 8500,
    jobsCreated: 28,
    compliance: {
      financialReporting: "pending",
      environmentalAssessment: "compliant",
      progressReports: "pending",
      communityEngagement: "pending",
    },
  },
  {
    id: "GR-2024-003",
    projectName: "Sugarcane Bagasse Processing Facility",
    applicant: "Tropical BioEnergy Co",
    abn: "45 678 901 234",
    program: "powering",
    status: "under_review",
    submittedDate: "2024-10-01",
    approvedDate: null,
    totalFunding: 4200000,
    disbursed: 0,
    milestones: [],
    location: "Mackay, QLD",
    feedstockType: "Sugarcane bagasse",
    carbonReduction: 22000,
    jobsCreated: 65,
    compliance: {
      financialReporting: "pending",
      environmentalAssessment: "under_review",
      progressReports: "not_applicable",
      communityEngagement: "pending",
    },
  },
  {
    id: "GR-2023-015",
    projectName: "Wheat Straw Bioethanol Plant",
    applicant: "AusBio Industries",
    abn: "33 444 555 666",
    program: "arena",
    status: "completed",
    submittedDate: "2023-02-20",
    approvedDate: "2023-05-15",
    totalFunding: 3100000,
    disbursed: 3100000,
    milestones: [
      { name: "Project Initiation", status: "completed", amount: 600000, date: "2023-06-01" },
      { name: "Construction Phase 1", status: "completed", amount: 1000000, date: "2023-10-01" },
      { name: "Construction Phase 2", status: "completed", amount: 1000000, date: "2024-02-01" },
      { name: "Final Commissioning", status: "completed", amount: 500000, date: "2024-06-01" },
    ],
    location: "Geraldton, WA",
    feedstockType: "Wheat straw",
    carbonReduction: 18500,
    jobsCreated: 52,
    compliance: {
      financialReporting: "compliant",
      environmentalAssessment: "compliant",
      progressReports: "compliant",
      communityEngagement: "compliant",
    },
  },
  {
    id: "GR-2024-004",
    projectName: "Forestry Residue Pellet Production",
    applicant: "TimberGreen Energy",
    abn: "77 888 999 000",
    program: "accu",
    status: "conditionally_approved",
    submittedDate: "2024-07-22",
    approvedDate: "2024-10-10",
    totalFunding: 1500000,
    disbursed: 0,
    milestones: [
      { name: "Conditions Fulfillment", status: "in_progress", amount: 0, date: "2024-12-15" },
      { name: "Equipment Procurement", status: "pending", amount: 600000, date: "2025-02-01" },
      { name: "Operations Launch", status: "pending", amount: 900000, date: "2025-06-01" },
    ],
    location: "Albany, WA",
    feedstockType: "Forestry residue",
    carbonReduction: 12000,
    jobsCreated: 35,
    compliance: {
      financialReporting: "pending",
      environmentalAssessment: "attention_required",
      progressReports: "pending",
      communityEngagement: "compliant",
    },
  },
];

export default function GrantVerification() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedGrant, setSelectedGrant] = useState<typeof MOCK_GRANTS[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filter grants
  const filteredGrants = MOCK_GRANTS.filter((grant) => {
    const matchesSearch =
      grant.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.abn.includes(searchQuery);
    const matchesProgram = selectedProgram === "all" || grant.program === selectedProgram;
    const matchesStatus = selectedStatus === "all" || grant.status === selectedStatus;
    return matchesSearch && matchesProgram && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalGrants: MOCK_GRANTS.length,
    totalFunding: MOCK_GRANTS.reduce((sum, g) => sum + g.totalFunding, 0),
    totalDisbursed: MOCK_GRANTS.reduce((sum, g) => sum + g.disbursed, 0),
    activeGrants: MOCK_GRANTS.filter((g) => g.status === "active").length,
    underReview: MOCK_GRANTS.filter((g) => g.status === "under_review").length,
    totalCarbonReduction: MOCK_GRANTS.reduce((sum, g) => sum + g.carbonReduction, 0),
    totalJobs: MOCK_GRANTS.reduce((sum, g) => sum + g.jobsCreated, 0),
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = GRANT_STATUS.find((s) => s.value === status);
    if (!statusConfig) return <Badge>{status}</Badge>;
    const Icon = statusConfig.icon;
    return (
      <Badge className={`${statusConfig.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const getProgramBadge = (program: string) => {
    const programConfig = GRANT_PROGRAMS.find((p) => p.value === program);
    if (!programConfig) return <Badge>{program}</Badge>;
    return <Badge className={programConfig.color}>{programConfig.label}</Badge>;
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "attention_required":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "non_compliant":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "under_review":
        return <Eye className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const openGrantDetails = (grant: typeof MOCK_GRANTS[0]) => {
    setSelectedGrant(grant);
    setDetailsOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Grant Verification</h1>
        <p className="text-gray-600">
          Verify and monitor government grant applications and disbursements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Grants</p>
                <p className="text-2xl font-bold">{stats.totalGrants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Funding</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalFunding)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Disbursed</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalDisbursed)}</p>
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
                <p className="text-sm text-gray-600">CO2 Reduction</p>
                <p className="text-2xl font-bold">{stats.totalCarbonReduction.toLocaleString()} t</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by project, applicant, ID, or ABN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {GRANT_PROGRAMS.map((program) => (
                    <SelectItem key={program.value} value={program.value}>
                      {program.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {GRANT_STATUS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Grants ({MOCK_GRANTS.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.activeGrants})</TabsTrigger>
          <TabsTrigger value="review">Under Review ({stats.underReview})</TabsTrigger>
          <TabsTrigger value="programs">By Program</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Grant Applications</CardTitle>
              <CardDescription>
                {filteredGrants.length} grant{filteredGrants.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grant ID</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Funding</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrants.map((grant) => (
                    <TableRow key={grant.id}>
                      <TableCell className="font-mono text-sm">{grant.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{grant.projectName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {grant.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{grant.applicant}</p>
                          <p className="text-xs text-gray-500">ABN: {grant.abn}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getProgramBadge(grant.program)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(grant.totalFunding)}</p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(grant.disbursed)} disbursed
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <Progress
                            value={(grant.disbursed / grant.totalFunding) * 100}
                            className="h-2"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round((grant.disbursed / grant.totalFunding) * 100)}%
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(grant.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openGrantDetails(grant)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
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

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Grants</CardTitle>
              <CardDescription>Grants currently receiving disbursements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_GRANTS.filter((g) => g.status === "active").map((grant) => (
                  <div
                    key={grant.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => openGrantDetails(grant)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-gray-500">{grant.id}</span>
                          {getProgramBadge(grant.program)}
                        </div>
                        <h3 className="font-semibold">{grant.projectName}</h3>
                        <p className="text-sm text-gray-600">{grant.applicant}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(grant.totalFunding)}</p>
                        <p className="text-sm text-green-600">
                          {formatCurrency(grant.disbursed)} disbursed
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Disbursement Progress</span>
                        <span>{Math.round((grant.disbursed / grant.totalFunding) * 100)}%</span>
                      </div>
                      <Progress value={(grant.disbursed / grant.totalFunding) * 100} className="h-2" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {grant.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Leaf className="h-4 w-4" />
                        {grant.carbonReduction.toLocaleString()} t CO2
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {grant.jobsCreated} jobs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Under Review</CardTitle>
              <CardDescription>Applications pending assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_GRANTS.filter((g) => g.status === "under_review").map((grant) => (
                  <div
                    key={grant.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => openGrantDetails(grant)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-gray-500">{grant.id}</span>
                          {getProgramBadge(grant.program)}
                          {getStatusBadge(grant.status)}
                        </div>
                        <h3 className="font-semibold">{grant.projectName}</h3>
                        <p className="text-sm text-gray-600">{grant.applicant}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {format(new Date(grant.submittedDate), "d MMM yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(grant.totalFunding)}</p>
                        <p className="text-sm text-gray-500">Requested</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {grant.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Leaf className="h-4 w-4" />
                          {grant.feedstockType}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
                {MOCK_GRANTS.filter((g) => g.status === "under_review").length === 0 && (
                  <p className="text-center text-gray-500 py-8">No applications under review</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GRANT_PROGRAMS.map((program) => {
              const programGrants = MOCK_GRANTS.filter((g) => g.program === program.value);
              const totalFunding = programGrants.reduce((sum, g) => sum + g.totalFunding, 0);
              const totalDisbursed = programGrants.reduce((sum, g) => sum + g.disbursed, 0);

              return (
                <Card key={program.value}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={program.color}>{program.label}</Badge>
                    </CardTitle>
                    <CardDescription>{program.fullName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Grants</p>
                          <p className="text-2xl font-bold">{programGrants.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Funding</p>
                          <p className="text-lg font-bold">{formatCurrency(totalFunding)}</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Disbursement</span>
                          <span>
                            {totalFunding > 0
                              ? Math.round((totalDisbursed / totalFunding) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                        <Progress
                          value={totalFunding > 0 ? (totalDisbursed / totalFunding) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{formatCurrency(totalDisbursed)} of {formatCurrency(totalFunding)} disbursed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Grant Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGrant && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm text-gray-500">{selectedGrant.id}</span>
                  {getProgramBadge(selectedGrant.program)}
                  {getStatusBadge(selectedGrant.status)}
                </DialogTitle>
                <DialogDescription>{selectedGrant.projectName}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Applicant Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Applicant Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{selectedGrant.applicant}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>ABN: {selectedGrant.abn}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedGrant.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-gray-400" />
                        <span>Feedstock: {selectedGrant.feedstockType}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Funding Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Funding</span>
                          <span className="font-bold">
                            {formatCurrency(selectedGrant.totalFunding)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Disbursed</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(selectedGrant.disbursed)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remaining</span>
                          <span className="font-medium">
                            {formatCurrency(selectedGrant.totalFunding - selectedGrant.disbursed)}
                          </span>
                        </div>
                        <Progress
                          value={(selectedGrant.disbursed / selectedGrant.totalFunding) * 100}
                          className="h-2 mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Project Impact */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Project Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Leaf className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-700">
                          {selectedGrant.carbonReduction.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-600">Tonnes CO2 Reduction</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-700">
                          {selectedGrant.jobsCreated}
                        </p>
                        <p className="text-sm text-blue-600">Jobs Created</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <Zap className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-700">
                          {selectedGrant.feedstockType}
                        </p>
                        <p className="text-sm text-purple-600">Feedstock Type</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Milestones */}
                {selectedGrant.milestones.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Milestones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedGrant.milestones.map((milestone, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {milestone.status === "completed" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : milestone.status === "in_progress" ? (
                                <Clock className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Clock className="h-5 w-5 text-gray-400" />
                              )}
                              <div>
                                <p className="font-medium">{milestone.name}</p>
                                <p className="text-sm text-gray-500">
                                  Due: {format(new Date(milestone.date), "d MMM yyyy")}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(milestone.amount)}</p>
                              <Badge
                                variant={
                                  milestone.status === "completed"
                                    ? "default"
                                    : milestone.status === "in_progress"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {milestone.status === "completed"
                                  ? "Completed"
                                  : milestone.status === "in_progress"
                                    ? "In Progress"
                                    : "Pending"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Compliance Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        {getComplianceIcon(selectedGrant.compliance.financialReporting)}
                        <div>
                          <p className="text-sm font-medium">Financial Reporting</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {selectedGrant.compliance.financialReporting.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        {getComplianceIcon(selectedGrant.compliance.environmentalAssessment)}
                        <div>
                          <p className="text-sm font-medium">Environmental</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {selectedGrant.compliance.environmentalAssessment.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        {getComplianceIcon(selectedGrant.compliance.progressReports)}
                        <div>
                          <p className="text-sm font-medium">Progress Reports</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {selectedGrant.compliance.progressReports.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        {getComplianceIcon(selectedGrant.compliance.communityEngagement)}
                        <div>
                          <p className="text-sm font-medium">Community</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {selectedGrant.compliance.communityEngagement.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Registry
                  </Button>
                  <Button>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Verify Grant
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
