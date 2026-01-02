/**
 * Government Dashboard
 *
 * Features:
 * - Compliance monitoring overview
 * - Registry audit trail
 * - Policy impact analysis
 * - Report generation
 * - Certification verification stats
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  FileCheck,
  FileBarChart,
  Scale,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Download,
  Search,
  Eye,
  Activity,
  TrendingUp,
  Calendar,
  MapPin,
  Leaf,
  Factory,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { H1, H2, H3, Body, MetricValue, DataLabel } from "@/components/Typography";

// Quick stats
const QUICK_STATS = [
  { label: "Registered Entities", value: "1,247", change: "+48", trend: "up", icon: Building2 },
  { label: "Compliance Rate", value: "94.2%", change: "+1.3%", trend: "up", icon: Shield },
  { label: "Pending Audits", value: "23", change: "-5", trend: "down", icon: FileCheck },
  { label: "Active Policies", value: "12", change: "+2", trend: "up", icon: Scale },
];

// Compliance alerts
const COMPLIANCE_ALERTS = [
  {
    id: "1",
    severity: "high",
    title: "ISCC certification expiring",
    entity: "Southern Canola Growers",
    entityType: "Grower",
    description: "ISCC EU certification expires in 14 days - renewal pending",
    time: "2h ago",
    region: "NSW",
  },
  {
    id: "2",
    severity: "medium",
    title: "Missing documentation",
    entity: "QLD Biofuels Processing",
    entityType: "Processor",
    description: "GHG emissions report overdue by 7 days",
    time: "5h ago",
    region: "QLD",
  },
  {
    id: "3",
    severity: "low",
    title: "New registration pending",
    entity: "Green Energy Farms",
    entityType: "Grower",
    description: "Initial registration review - awaiting land use verification",
    time: "1d ago",
    region: "VIC",
  },
  {
    id: "4",
    severity: "medium",
    title: "Audit discrepancy flagged",
    entity: "Adelaide Rendering Co",
    entityType: "Processor",
    description: "Volume mismatch between reported and verified data",
    time: "3h ago",
    region: "SA",
  },
];

// Registry overview by type
const REGISTRY_OVERVIEW = [
  { type: "Growers", count: 892, compliant: 847, pending: 32, flagged: 13, icon: Leaf },
  { type: "Processors", count: 156, compliant: 148, pending: 5, flagged: 3, icon: Factory },
  { type: "Traders", count: 89, compliant: 84, pending: 3, flagged: 2, icon: Building2 },
  { type: "Developers", count: 110, compliant: 102, pending: 6, flagged: 2, icon: Factory },
];

// Recent audit activities
const AUDIT_ACTIVITIES = [
  { id: "1", action: "Certification verified", entity: "Murray Valley Farms", user: "J. Smith", time: "10m ago", status: "success" },
  { id: "2", action: "Document review completed", entity: "Riverina Ag Services", user: "M. Chen", time: "25m ago", status: "success" },
  { id: "3", action: "Compliance flag raised", entity: "QLD Biofuels Processing", user: "System", time: "1h ago", status: "warning" },
  { id: "4", action: "Registration approved", entity: "Green Energy Farms", user: "A. Patel", time: "2h ago", status: "success" },
  { id: "5", action: "Audit scheduled", entity: "Southern Oil Refining", user: "J. Smith", time: "3h ago", status: "pending" },
];

// Policy metrics
const POLICY_METRICS = [
  { label: "RFS Compliance", value: 96, target: 95, status: "on-track" },
  { label: "LCFS Alignment", value: 88, target: 90, status: "at-risk" },
  { label: "EU RED III", value: 72, target: 80, status: "behind" },
  { label: "CORSIA Eligible", value: 45, target: 50, status: "at-risk" },
];

export default function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-background overflow-hidden">
      {/* Quick Stats Bar */}
      <div className="border-b bg-card/50 shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_STATS.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <MetricValue>{stat.value}</MetricValue>
                    <span className={cn(
                      "text-xs font-medium",
                      stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                    )}>
                      {stat.trend === "up" ? "↗" : "↘"} {stat.change}
                    </span>
                  </div>
                  <DataLabel>{stat.label}</DataLabel>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b bg-card/30 shrink-0">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-12 bg-transparent border-0 p-0 gap-4">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-1"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="compliance"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-1"
              >
                Compliance
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-1"
              >
                Audit Trail
              </TabsTrigger>
              <TabsTrigger
                value="policy"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-1"
              >
                Policy
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Compliance Alerts */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        Compliance Alerts
                      </CardTitle>
                      <Link href="/government/compliance">
                        <Button variant="ghost" size="sm">
                          View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {COMPLIANCE_ALERTS.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={cn("text-xs", getSeverityColor(alert.severity))}>
                                  {alert.severity}
                                </Badge>
                                <span className="text-sm font-medium truncate">{alert.title}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">{alert.description}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {alert.entity}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {alert.region}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">{alert.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Registry Overview */}
              <div>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      Registry Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {REGISTRY_OVERVIEW.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{item.type}</span>
                            </div>
                            <span className="text-sm font-bold">{item.count}</span>
                          </div>
                          <div className="flex gap-1 h-2">
                            <div
                              className="bg-emerald-500 rounded-l"
                              style={{ width: `${(item.compliant / item.count) * 100}%` }}
                            />
                            <div
                              className="bg-amber-500"
                              style={{ width: `${(item.pending / item.count) * 100}%` }}
                            />
                            <div
                              className="bg-red-500 rounded-r"
                              style={{ width: `${(item.flagged / item.count) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span className="text-emerald-600">{item.compliant} compliant</span>
                            <span className="text-amber-600">{item.pending} pending</span>
                            <span className="text-red-600">{item.flagged} flagged</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/government/audit">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileCheck className="h-4 w-4 mr-2" />
                          Run Audit
                        </Button>
                      </Link>
                      <Link href="/government/reports">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileBarChart className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                      </Link>
                      <Link href="/certificate-verification">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Search className="h-4 w-4 mr-2" />
                          Verify Cert
                        </Button>
                      </Link>
                      <Link href="/government/policy">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Scale className="h-4 w-4 mr-2" />
                          Policy Tools
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "compliance" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Monitor</CardTitle>
                  <CardDescription>Real-time compliance status across all registered entities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Full compliance monitoring interface</p>
                    <p className="text-sm">Coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Audit Trail</CardTitle>
                      <CardDescription>Recent audit activities and verification events</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Log
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {AUDIT_ACTIVITIES.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-3 rounded-lg border"
                      >
                        {getStatusIcon(activity.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.entity} • {activity.user}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "policy" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Policy Compliance Metrics</CardTitle>
                  <CardDescription>Progress toward policy targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {POLICY_METRICS.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{metric.value}%</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                metric.status === "on-track" && "border-emerald-500 text-emerald-600",
                                metric.status === "at-risk" && "border-amber-500 text-amber-600",
                                metric.status === "behind" && "border-red-500 text-red-600"
                              )}
                            >
                              {metric.status.replace("-", " ")}
                            </Badge>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={metric.value} className="h-2" />
                          <div
                            className="absolute top-0 h-2 w-0.5 bg-gray-800"
                            style={{ left: `${metric.target}%` }}
                            title={`Target: ${metric.target}%`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Target: {metric.target}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Policy Tools</CardTitle>
                  <CardDescription>Regulatory modeling and analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Policy modeling interface</p>
                    <p className="text-sm">Coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
