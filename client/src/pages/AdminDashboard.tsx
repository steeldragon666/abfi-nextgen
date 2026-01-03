import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatsCard,
} from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Leaf,
  Shield,
  XCircle,
  Building2,
  Package,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Link, Redirect } from "wouter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { H1, H3, Body, MetricValue } from "@/components/Typography";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();

  const {
    data: pendingSuppliers,
    isLoading: loadingSuppliers,
    refetch: refetchSuppliers,
  } = trpc.admin.getPendingSuppliers.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const {
    data: pendingFeedstocks,
    isLoading: loadingFeedstocks,
    refetch: refetchFeedstocks,
  } = trpc.admin.getPendingFeedstocks.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const verifySupplierMutation = trpc.admin.verifySupplier.useMutation({
    onSuccess: () => {
      toast.success("Supplier verified successfully");
      refetchSuppliers();
    },
    onError: (error: any) => {
      toast.error(error.message || "Verification failed");
    },
  });

  const verifyFeedstockMutation = trpc.admin.verifyFeedstock.useMutation({
    onSuccess: () => {
      toast.success("Feedstock verified successfully");
      refetchFeedstocks();
    },
    onError: (error: any) => {
      toast.error(error.message || "Verification failed");
    },
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-48" />
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#D4AF37]/10">
            <Shield className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <div>
            <H1 className="text-2xl">Admin Dashboard</H1>
            <Body className="text-gray-600">
              Manage verifications and platform operations
            </Body>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Pending Suppliers"
            value={loadingSuppliers ? "..." : pendingSuppliers?.length || 0}
            description="Awaiting verification"
            icon={<Building2 className="h-5 w-5" />}
            variant="warning"
          />

          <StatsCard
            title="Pending Feedstocks"
            value={loadingFeedstocks ? "..." : pendingFeedstocks?.length || 0}
            description="Awaiting verification"
            icon={<Package className="h-5 w-5" />}
            variant="warning"
          />

          <StatsCard
            title="Total Queue"
            value={
              (pendingSuppliers?.length || 0) + (pendingFeedstocks?.length || 0)
            }
            description="Total pending items"
            icon={<Clock className="h-5 w-5" />}
            variant="info"
          />

          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    Platform Status
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2.5 w-2.5 bg-success rounded-full animate-pulse"></div>
                    <span className="font-medium text-success">
                      All Systems Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Last checked: Just now
                  </p>
                </div>
                <div className="rounded-lg bg-success/10 p-2.5 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Tabs */}
        <Tabs defaultValue="suppliers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="suppliers">
              Pending Suppliers ({pendingSuppliers?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="feedstocks">
              Pending Feedstocks ({pendingFeedstocks?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers">
            {loadingSuppliers ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : pendingSuppliers && pendingSuppliers.length > 0 ? (
              <div className="space-y-4">
                {pendingSuppliers.map(supplier => (
                  <Card key={supplier.id} hover className="group">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-warning/10">
                            <Building2 className="h-5 w-5 text-warning" />
                          </div>
                          <div>
                            <CardTitle className="group-hover:text-[#D4AF37] transition-colors">
                              {supplier.companyName}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              ABN: {supplier.abn}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="pending" className="shrink-0">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(supplier.createdAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Contact Email
                          </p>
                          <p className="font-medium">{supplier.contactEmail}</p>
                        </div>
                        {supplier.contactPhone && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                              Contact Phone
                            </p>
                            <p className="font-medium">
                              {supplier.contactPhone}
                            </p>
                          </div>
                        )}
                        {supplier.addressLine1 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                              Address
                            </p>
                            <p className="font-medium">
                              {supplier.addressLine1}
                              {supplier.city && `, ${supplier.city}`}
                              {supplier.state && ` ${supplier.state}`}
                            </p>
                          </div>
                        )}
                        {supplier.website && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                              Website
                            </p>
                            <a
                              href={supplier.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-[#D4AF37] hover:underline"
                            >
                              {supplier.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {supplier.description && (
                        <div className="mb-4 p-3 rounded-lg bg-muted/50">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                            Description
                          </p>
                          <p className="text-sm">{supplier.description}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            verifySupplierMutation.mutate({
                              supplierId: supplier.id,
                              approved: true,
                            })
                          }
                          disabled={verifySupplierMutation.isPending}
                          loading={verifySupplierMutation.isPending}
                          leftIcon={<CheckCircle2 className="h-4 w-4" />}
                        >
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            verifySupplierMutation.mutate({
                              supplierId: supplier.id,
                              approved: false,
                            })
                          }
                          disabled={verifySupplierMutation.isPending}
                          leftIcon={<XCircle className="h-4 w-4" />}
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="outlined" className="border-dashed">
                <CardContent className="py-12 text-center">
                  <div className="p-3 rounded-full bg-success/10 w-fit mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                  <H3 className="mb-2 !text-lg">All Caught Up!</H3>
                  <p className="text-gray-600">
                    No pending supplier verifications
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Feedstocks Tab */}
          <TabsContent value="feedstocks">
            {loadingFeedstocks ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : pendingFeedstocks && pendingFeedstocks.length > 0 ? (
              <div className="space-y-4">
                {pendingFeedstocks.map(feedstock => (
                  <Card key={feedstock.id} hover className="group">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-warning/10">
                            <Package className="h-5 w-5 text-warning" />
                          </div>
                          <div>
                            <CardTitle className="group-hover:text-[#D4AF37] transition-colors">
                              {feedstock.type}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              <span className="font-mono text-xs">
                                {feedstock.abfiId}
                              </span>{" "}
                              • {feedstock.category}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="pending" className="shrink-0">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate((feedstock as any).createdAt || (feedstock as any).updatedAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Location
                          </p>
                          <p className="font-medium">{feedstock.state}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Annual Capacity
                          </p>
                          <p className="font-medium font-mono">
                            {feedstock.annualCapacityTonnes.toLocaleString()}{" "}
                            <span className="text-gray-600 text-xs">
                              tonnes
                            </span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Available Now
                          </p>
                          <p className="font-medium font-mono">
                            {feedstock.availableVolumeCurrent.toLocaleString()}{" "}
                            <span className="text-gray-600 text-xs">
                              tonnes
                            </span>
                          </p>
                        </div>
                      </div>

                      {feedstock.description && (
                        <div className="mb-4 p-3 rounded-lg bg-muted/50">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                            Description
                          </p>
                          <p className="text-sm">{feedstock.description}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            verifyFeedstockMutation.mutate({
                              feedstockId: feedstock.id,
                              approved: true,
                            })
                          }
                          disabled={verifyFeedstockMutation.isPending}
                          loading={verifyFeedstockMutation.isPending}
                          leftIcon={<CheckCircle2 className="h-4 w-4" />}
                        >
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<AlertCircle className="h-4 w-4" />}
                        >
                          Request More Info
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="outlined" className="border-dashed">
                <CardContent className="py-12 text-center">
                  <div className="p-3 rounded-full bg-success/10 w-fit mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                  <H3 className="mb-2 !text-lg">All Caught Up!</H3>
                  <p className="text-gray-600">
                    No pending feedstock verifications
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
