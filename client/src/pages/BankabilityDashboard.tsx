import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatsCard } from "@/components/ui/card";
import { Badge, StatusBadge, RatingBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Plus, TrendingUp, AlertCircle, FileText, Users, Leaf, Bell, ArrowRight, Building2 } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { ScoreGauge } from "@/components/ScoreCard";

export default function BankabilityDashboard() {
  const { user, loading: authLoading } = useAuth();
  
  const { data: projects, isLoading: projectsLoading } = trpc.bankability.getMyProjects.useQuery(
    undefined,
    { enabled: !!user }
  );

  if (authLoading || !user) {
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
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string): "verified" | "pending" | "draft" | "rejected" | undefined => {
    switch (status) {
      case "operational": return "verified";
      case "construction":
      case "financing":
      case "development": return "pending";
      case "planning": return "draft";
      case "suspended": return "rejected";
      default: return "draft";
    }
  };

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
            <Link href="/notifications">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" size="sm">Browse Feedstocks</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="heading-1 text-foreground">Bankability Dashboard</h1>
              <p className="text-muted-foreground body-lg">
                Manage bioenergy projects and supply agreements
              </p>
            </div>
          </div>
          <Link href="/project-registration/flow">
            <Button rightIcon={<Plus className="h-4 w-4" />}>
              New Project
            </Button>
          </Link>
        </div>

        {projectsLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="space-y-6">
            {projects.map((project: any) => (
              <Card key={project.id} hover className="group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-primary transition-colors">{project.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {project.description || "No description provided"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status?.toUpperCase()}
                      </Badge>
                      {project.bankabilityRating && (
                        <RatingBadge rating={project.bankabilityRating as any} />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Project Details */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Capacity</p>
                      <p className="font-medium font-mono">
                        {project.nameplateCapacity?.toLocaleString()} <span className="text-muted-foreground text-xs">MW</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</p>
                      <p className="font-medium">
                        {project.facilityLocation || project.state || "TBD"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Target COD</p>
                      <p className="font-medium">
                        {project.targetCOD ? new Date(project.targetCOD).toLocaleDateString() : "TBD"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Debt Tenor</p>
                      <p className="font-medium">
                        {project.debtTenor ? `${project.debtTenor} years` : "TBD"}
                      </p>
                    </div>
                  </div>

                  {/* Supply Position */}
                  <div className="p-4 rounded-xl bg-muted/30 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Supply Position</h4>
                      <Badge variant="outline" size="sm">Target: 150% of capacity</Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Primary Coverage (Tier 1)</span>
                          <span className="font-medium font-mono">0% / 120%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Secondary Coverage (Tier 2)</span>
                          <span className="font-medium font-mono">0% / 30%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Bankability Score Breakdown */}
                  {project.bankabilityScore && (
                    <div className="p-4 rounded-xl border space-y-4">
                      <h4 className="font-semibold">Bankability Assessment</h4>
                      <div className="grid md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <ScoreGauge score={Math.round(project.bankabilityScore)} size="md" />
                          <div className="text-xs text-muted-foreground mt-1">Composite</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/30">
                          <div className="metric-md mb-1">--</div>
                          <div className="text-xs text-muted-foreground">Volume (30%)</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/30">
                          <div className="metric-md mb-1">--</div>
                          <div className="text-xs text-muted-foreground">Quality (25%)</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/30">
                          <div className="metric-md mb-1">--</div>
                          <div className="text-xs text-muted-foreground">Structure (20%)</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/30">
                          <div className="metric-md mb-1">--</div>
                          <div className="text-xs text-muted-foreground">Risk (15%)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Alerts */}
                  {(!project.bankabilityRating || project.bankabilityRating === "CCC") && (
                    <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-warning/20">
                        <AlertCircle className="h-4 w-4 text-warning" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-foreground">Action Required</div>
                        <div className="text-muted-foreground">
                          Complete supply agreements to improve bankability rating
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/dashboard/projects/${project.id}/agreements`}>
                      <Button variant="outline" size="sm" leftIcon={<FileText className="h-4 w-4" />}>
                        View Agreements
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" leftIcon={<Users className="h-4 w-4" />}>
                      Manage Suppliers
                    </Button>
                    <Link href={`/bankability/assess/${project.id}`}>
                      <Button size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                        Run Assessment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="outlined" className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="heading-3 mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first bioenergy project to start managing supply agreements and tracking bankability
              </p>
              <Link href="/project-registration/flow">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Create Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
