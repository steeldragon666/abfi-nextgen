import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatsCard } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Award, Building2, Leaf, Package, ShoppingCart, Shield, TrendingUp, CheckCircle, Clock, FileText, Search, Bell, ArrowRight } from "lucide-react";
import { Link, Redirect } from "wouter";
import { cn } from "@/lib/utils";
import { PageWrapper, FadeInUp, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/motion";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: profile, isLoading: profileLoading } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  // Check if user has supplier or buyer profile
  const hasSupplier = !!profile?.supplier;
  const hasBuyer = !!profile?.buyer;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">ABFI</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name || user?.email}
            </span>
            <Link href="/notifications">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" size="sm">Browse Feedstocks</Button>
            </Link>
          </div>
        </div>
      </header>

      <PageWrapper className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <FadeInUp className="mb-8">
          <h1 className="heading-1 text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground body-lg">
            Welcome back, <span className="font-medium text-foreground">{user?.name || 'User'}</span>
          </p>
        </FadeInUp>

        {/* Admin Section */}
        {isAdmin && (
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Admin Access</CardTitle>
                    <CardDescription>You have administrative privileges</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-primary border-primary/30">Admin</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card hover className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-warning/10">
                        <Clock className="h-4 w-4 text-warning" />
                      </div>
                      <span className="font-medium">Pending Verifications</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review supplier and feedstock submissions
                    </p>
                    <Link href="/admin">
                      <Button className="w-full" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                        View Queue
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card hover className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-info/10">
                        <TrendingUp className="h-4 w-4 text-info" />
                      </div>
                      <span className="font-medium">Platform Stats</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Monitor marketplace activity
                    </p>
                    <Button className="w-full" size="sm" variant="outline">
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>

                <Card hover className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">Audit Logs</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review system activity
                    </p>
                    <Button className="w-full" size="sm" variant="outline">
                      View Logs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Selection */}
        {!hasSupplier && !hasBuyer ? (
          <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <StaggerItem>
              <HoverCard className="h-full">
                <Card variant="elevated" className="group h-full">
                  <CardHeader className="pb-4">
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="heading-3">Register as Supplier</CardTitle>
                    <CardDescription className="body-lg">
                      List your biofuel feedstocks and connect with buyers across Australia
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                      <li className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-success/10">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        Get ABFI-rated for your feedstocks
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-success/10">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        Manage multiple feedstock listings
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-success/10">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        Receive buyer inquiries
                      </li>
                    </ul>
                    <Link href="/supplier/register">
                      <Button className="w-full" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                        Create Supplier Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>

            <StaggerItem>
              <HoverCard className="h-full">
                <Card variant="elevated" className="group h-full">
                  <CardHeader className="pb-4">
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                      <ShoppingCart className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="heading-3">Register as Buyer</CardTitle>
                    <CardDescription className="body-lg">
                      Source verified biofuel feedstocks from trusted suppliers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                      <li className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-success/10">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        Access ABFI-rated feedstocks
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-success/10">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        Advanced search and filtering
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-success/10">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        Send RFQs to suppliers
                      </li>
                    </ul>
                    <Link href="/buyer/register">
                      <Button className="w-full" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                        Create Buyer Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
          </StaggerContainer>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Supplier Dashboard */}
            {hasSupplier && (
              <>
                <StatsCard
                  title="My Feedstocks"
                  value={0}
                  description="Active listings"
                  icon={<Package className="h-5 w-5" />}
                />

                <StatsCard
                  title="Inquiries"
                  value={0}
                  description="Pending responses"
                  icon={<FileText className="h-5 w-5" />}
                  variant="warning"
                />

                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        profile.supplier?.verificationStatus === 'verified'
                          ? "bg-success/10"
                          : "bg-warning/10"
                      )}>
                        {profile.supplier?.verificationStatus === 'verified' ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <Clock className="h-5 w-5 text-warning" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Verification Status</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {profile.supplier?.verificationStatus?.replace('_', ' ') || 'Pending'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/supplier/feedstocks" className="flex-1">
                        <Button className="w-full" size="sm" variant="outline">
                          View Feedstocks
                        </Button>
                      </Link>
                      <Link href="/feedstock/create" className="flex-1">
                        <Button className="w-full" size="sm">
                          Add New
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Buyer Dashboard */}
            {hasBuyer && (
              <>
                <StatsCard
                  title="Saved Searches"
                  value={0}
                  description="Active searches"
                  icon={<Search className="h-5 w-5" />}
                />

                <StatsCard
                  title="My Inquiries"
                  value={0}
                  description="Total inquiries"
                  icon={<FileText className="h-5 w-5" />}
                />

                <Card hover>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Leaf className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Browse Feedstocks</p>
                        <p className="text-sm text-muted-foreground">Find verified suppliers</p>
                      </div>
                    </div>
                    <Link href="/browse">
                      <Button className="w-full" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                        Start Searching
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mt-8" variant="outlined">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/browse">
                <Button variant="outline" leftIcon={<Search className="h-4 w-4" />}>
                  Browse Feedstocks
                </Button>
              </Link>
              {hasSupplier && (
                <Link href="/feedstock/create">
                  <Button variant="outline" leftIcon={<Package className="h-4 w-4" />}>
                    Add New Feedstock
                  </Button>
                </Link>
              )}
              {hasBuyer && (
                <Link href="/saved-searches">
                  <Button variant="outline" leftIcon={<Search className="h-4 w-4" />}>
                    Create Saved Search
                  </Button>
                </Link>
              )}
              <Link href="/notifications">
                <Button variant="outline" leftIcon={<Bell className="h-4 w-4" />}>
                  View Notifications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    </div>
  );
}
