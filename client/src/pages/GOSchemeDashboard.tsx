import { useAuth } from "@/_core/hooks/useAuth";
import { H1, H2, H3, H4, Body, MetricValue, DataLabel } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  Award,
  FileText,
  Leaf,
  Zap,
  Sun,
  Wind,
  Droplets,
  Plus,
  Eye,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Download,
  Send,
  AlertCircle,
  Building2,
  Calendar,
} from "lucide-react";
import { Redirect } from "wouter";
import { cn } from "@/lib/utils";
import {
  PageWrapper,
  FadeInUp,
} from "@/components/ui/motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useCallback } from "react";
import { toast } from "sonner";

// Stats card component
function StatsCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "info";
  description?: string;
}) {
  const variantStyles = {
    default: "bg-white",
    success: "bg-emerald-50 border-emerald-200",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-blue-50 border-blue-200",
  };

  const iconStyles = {
    default: "text-slate-600",
    success: "text-[#D4AF37]",
    warning: "text-[#D4AF37]",
    info: "text-blue-600",
  };

  return (
    <Card className={cn("border", variantStyles[variant])}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <p className="text-3xl font-bold mt-1 font-mono">{value}</p>
            {description && (
              <p className="text-xs text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "p-2 rounded-lg bg-slate-100",
              variant !== "default" && "bg-white/50"
            )}
          >
            <Icon className={cn("h-5 w-5", iconStyles[variant])} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Certificate status badge
function CertificateStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    issued: { label: "Issued", className: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
    transferred: { label: "Transferred", className: "bg-blue-100 text-blue-800", icon: ArrowRight },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800", icon: XCircle },
    retired: { label: "Retired", className: "bg-purple-100 text-purple-800", icon: Award },
    expired: { label: "Expired", className: "bg-slate-100 text-slate-800", icon: Clock },
  };

  const config = statusConfig[status] || { label: status, className: "bg-slate-100 text-slate-800", icon: AlertCircle };
  const Icon = config.icon;

  return (
    <Badge className={cn("font-medium flex items-center gap-1", config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

// GO Scheme badge
function GOSchemeBadge({ scheme }: { scheme: string }) {
  const schemeConfig: Record<string, { label: string; className: string }> = {
    REGO: { label: "REGO", className: "bg-green-100 text-green-800" },
    PGO: { label: "PGO", className: "bg-blue-100 text-blue-800" },
    GO_AU: { label: "GO AU", className: "bg-amber-100 text-amber-800" },
    ISCC_PLUS: { label: "ISCC+", className: "bg-purple-100 text-purple-800" },
    RSB: { label: "RSB", className: "bg-teal-100 text-teal-800" },
  };

  const config = schemeConfig[scheme] || { label: scheme, className: "bg-slate-100 text-slate-800" };

  return (
    <Badge className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

// Energy source icon
function EnergySourceIcon({ source }: { source: string }) {
  const icons: Record<string, React.ElementType> = {
    solar: Sun,
    wind: Wind,
    hydro: Droplets,
    biomass: Leaf,
    biogas: Zap,
  };
  const Icon = icons[source?.toLowerCase()] || Zap;
  return <Icon className="h-4 w-4" />;
}

// Issue Certificate Dialog
function IssueCertificateDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    goScheme: "REGO" as "REGO" | "PGO" | "GO_AU" | "ISCC_PLUS" | "RSB",
    projectId: "",
    energySourceMwh: "",
    productionPeriodStart: "",
    productionPeriodEnd: "",
  });

  const issueMutation = trpc.goScheme.issueCertificate.useMutation({
    onSuccess: (data) => {
      toast.success(`Certificate issued: ${data.goId}`);
      setOpen(false);
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to issue certificate: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    issueMutation.mutate({
      goScheme: formData.goScheme,
      projectId: parseInt(formData.projectId, 10),
      energySourceMwh: parseFloat(formData.energySourceMwh),
      productionPeriodStart: new Date(formData.productionPeriodStart),
      productionPeriodEnd: new Date(formData.productionPeriodEnd),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gold">
          <Plus className="h-4 w-4 mr-2" />
          Issue Certificate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue GO Certificate</DialogTitle>
          <DialogDescription>
            Create a new Guarantee of Origin certificate
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>GO Scheme</Label>
            <Select
              value={formData.goScheme}
              onValueChange={(v) => setFormData({ ...formData, goScheme: v as typeof formData.goScheme })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGO">REGO (UK)</SelectItem>
                <SelectItem value="PGO">PGO (EU)</SelectItem>
                <SelectItem value="GO_AU">GO AU (Australia)</SelectItem>
                <SelectItem value="ISCC_PLUS">ISCC+</SelectItem>
                <SelectItem value="RSB">RSB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Project ID</Label>
            <Input
              type="number"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Energy (MWh)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.energySourceMwh}
              onChange={(e) => setFormData({ ...formData, energySourceMwh: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Production Start</Label>
              <Input
                type="date"
                value={formData.productionPeriodStart}
                onChange={(e) => setFormData({ ...formData, productionPeriodStart: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Production End</Label>
              <Input
                type="date"
                value={formData.productionPeriodEnd}
                onChange={(e) => setFormData({ ...formData, productionPeriodEnd: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={issueMutation.isPending}>
              {issueMutation.isPending ? "Issuing..." : "Issue Certificate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Generate Audit Pack Dialog
function GenerateAuditPackDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    packType: "lender_assurance" as const,
    entityType: "project" as const,
    entityId: "",
    title: "",
    description: "",
  });

  const generateMutation = trpc.goScheme.generateAuditPack.useMutation({
    onSuccess: (data) => {
      toast.success(`Audit pack generated: ${data.packId}`);
      setOpen(false);
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to generate pack: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate({
      packType: formData.packType,
      entityType: formData.entityType,
      entityId: parseInt(formData.entityId, 10),
      title: formData.title,
      description: formData.description || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Generate Audit Pack
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Audit Pack</DialogTitle>
          <DialogDescription>
            Create a comprehensive audit documentation package
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Pack Type</Label>
            <Select
              value={formData.packType}
              onValueChange={(v) => setFormData({ ...formData, packType: v as typeof formData.packType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lender_assurance">Lender Assurance</SelectItem>
                <SelectItem value="go_application">GO Application</SelectItem>
                <SelectItem value="sustainability_audit">Sustainability Audit</SelectItem>
                <SelectItem value="compliance_review">Compliance Review</SelectItem>
                <SelectItem value="annual_report">Annual Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Entity Type</Label>
              <Select
                value={formData.entityType}
                onValueChange={(v) => setFormData({ ...formData, entityType: v as typeof formData.entityType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="consignment">Consignment</SelectItem>
                  <SelectItem value="product_batch">Product Batch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Entity ID</Label>
              <Input
                type="number"
                value={formData.entityId}
                onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Q4 2025 Lender Report"
              required
            />
          </div>

          <div>
            <Label>Description (optional)</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Quarterly compliance documentation"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={generateMutation.isPending}>
              {generateMutation.isPending ? "Generating..." : "Generate Pack"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function GOSchemeDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch stats
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.goScheme.getGOStats.useQuery();

  // Fetch certificates
  const { data: certificatesData, isLoading: certificatesLoading, refetch: refetchCertificates } = trpc.goScheme.listCertificates.useQuery({
    status: statusFilter !== "all" ? statusFilter as any : undefined,
    limit: 50,
  });

  // Fetch audit packs
  const { data: auditPacksData, isLoading: packsLoading, refetch: refetchPacks } = trpc.goScheme.listAuditPacks.useQuery({
    limit: 20,
  });

  const handleRefresh = useCallback(() => {
    refetchStats();
    refetchCertificates();
    refetchPacks();
    toast.success("Data refreshed");
  }, [refetchStats, refetchCertificates, refetchPacks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <DashboardLayout>
      <PageWrapper className="max-w-7xl">
        {/* Header */}
        <FadeInUp className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1 flex items-center gap-3">
                <Award className="h-8 w-8 text-[#D4AF37]" />
                GO Certificates
              </h1>
              <p className="text-gray-600">
                REGO, PGO, and sustainability certification management
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <IssueCertificateDialog onSuccess={() => { refetchCertificates(); refetchStats(); }} />
            </div>
          </div>
        </FadeInUp>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Total Certificates"
                value={stats?.totalCertificates || 0}
                icon={Award}
                description="All GO certificates"
              />
              <StatsCard
                title="Active Certificates"
                value={stats?.activeCertificates || 0}
                icon={CheckCircle2}
                variant="success"
                description="Currently valid"
              />
              <StatsCard
                title="Total MWh"
                value={`${((stats?.totalMwh || 0) as number).toLocaleString()}`}
                icon={Zap}
                variant="info"
                description="Energy certified"
              />
              <StatsCard
                title="Audit Packs"
                value={stats?.totalAuditPacks || 0}
                icon={FileText}
                description="Documentation packages"
              />
            </>
          )}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="certificates" className="space-y-6">
          <TabsList>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="audit-packs">Audit Packs</TabsTrigger>
            <TabsTrigger value="schemes">GO Schemes</TabsTrigger>
          </TabsList>

          <TabsContent value="certificates">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      GO Certificates
                    </CardTitle>
                    <CardDescription>
                      Guarantee of Origin certificates
                    </CardDescription>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="issued">Issued</SelectItem>
                      <SelectItem value="transferred">Transferred</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {certificatesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : certificatesData?.certificates && certificatesData.certificates.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>GO ID</TableHead>
                          <TableHead>Scheme</TableHead>
                          <TableHead>Energy (MWh)</TableHead>
                          <TableHead>Production Period</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Issued</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {certificatesData.certificates.map((cert: any) => (
                          <TableRow key={cert.id}>
                            <TableCell className="font-mono text-sm">
                              {cert.goId}
                            </TableCell>
                            <TableCell>
                              <GOSchemeBadge scheme={cert.goScheme} />
                            </TableCell>
                            <TableCell className="font-mono">
                              {parseFloat(cert.energySourceMwh || "0").toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {cert.productionPeriodStart && cert.productionPeriodEnd ? (
                                <>
                                  {new Date(cert.productionPeriodStart).toLocaleDateString()} -
                                  {new Date(cert.productionPeriodEnd).toLocaleDateString()}
                                </>
                              ) : '-'}
                            </TableCell>
                            <TableCell>
                              <CertificateStatusBadge status={cert.status} />
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-600">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No certificates found</p>
                    <p className="text-sm">Issue a new certificate to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-packs">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Audit Packs
                    </CardTitle>
                    <CardDescription>
                      Compliance documentation packages
                    </CardDescription>
                  </div>
                  <GenerateAuditPackDialog onSuccess={() => refetchPacks()} />
                </div>
              </CardHeader>
              <CardContent>
                {packsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : auditPacksData?.packs && auditPacksData.packs.length > 0 ? (
                  <div className="space-y-4">
                    {auditPacksData.packs.map((pack: any) => (
                      <div key={pack.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg">
                              <FileText className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{pack.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {pack.packType?.replace(/_/g, ' ')}
                                </Badge>
                                <span>•</span>
                                <span className="capitalize">{pack.entityType} #{pack.entityId}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              pack.status === "completed" && "bg-emerald-100 text-emerald-800",
                              pack.status === "pending" && "bg-amber-100 text-amber-800",
                              pack.status === "draft" && "bg-slate-100 text-slate-800"
                            )}>
                              {pack.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-600">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No audit packs generated</p>
                    <p className="text-sm">Generate a new audit pack to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schemes">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Supported GO Schemes</CardTitle>
                  <CardDescription>
                    Guarantee of Origin certification standards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { scheme: "REGO", name: "Renewable Energy Guarantee of Origin", region: "United Kingdom" },
                    { scheme: "PGO", name: "Proof of Green Origin", region: "European Union" },
                    { scheme: "GO_AU", name: "Australian GreenPower", region: "Australia" },
                    { scheme: "ISCC_PLUS", name: "ISCC+ Sustainability Certification", region: "Global" },
                    { scheme: "RSB", name: "Roundtable on Sustainable Biomaterials", region: "Global" },
                  ].map(({ scheme, name, region }) => (
                    <div key={scheme} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <GOSchemeBadge scheme={scheme} />
                        <div>
                          <p className="font-medium text-sm">{name}</p>
                          <p className="text-xs text-gray-600">{region}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Energy Sources</CardTitle>
                  <CardDescription>
                    Renewable energy generation types
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { source: "solar", name: "Solar PV", icon: Sun },
                    { source: "wind", name: "Wind Power", icon: Wind },
                    { source: "hydro", name: "Hydroelectric", icon: Droplets },
                    { source: "biomass", name: "Biomass", icon: Leaf },
                    { source: "biogas", name: "Biogas/Biofuel", icon: Zap },
                  ].map(({ source, name, icon: Icon }) => (
                    <div key={source} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <Icon className="h-5 w-5 text-[#D4AF37]" />
                      </div>
                      <span className="font-medium text-sm">{name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </DashboardLayout>
  );
}
