/**
 * Admin Audit Logs
 *
 * View and search system audit logs for compliance and security monitoring.
 * Essential Eight requirement for audit logging.
 */

import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Search,
  Download,
  Calendar as CalendarIcon,
  Eye,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  FileEdit,
  Trash2,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Database,
  Activity,
  Clock,
} from "lucide-react";
import { Link, Redirect } from "wouter";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { H1, Body, MetricValue } from "@/components/Typography";

// Action icons mapping
const actionIcons: Record<string, React.ReactNode> = {
  login: <LogIn className="h-4 w-4" />,
  login_success: <LogIn className="h-4 w-4" />,
  login_failed: <LogIn className="h-4 w-4" />,
  logout: <LogOut className="h-4 w-4" />,
  create: <Plus className="h-4 w-4" />,
  update: <FileEdit className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
  export: <Download className="h-4 w-4" />,
  scheduled_job: <RefreshCw className="h-4 w-4" />,
  default: <Activity className="h-4 w-4" />,
};

// Action colors mapping
const actionColors: Record<string, string> = {
  login: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  login_success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  login_failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  logout: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  create: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  update: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  delete: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  view: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  export: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  scheduled_job: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

function getActionIcon(action: string) {
  const normalizedAction = action.toLowerCase();
  for (const [key, icon] of Object.entries(actionIcons)) {
    if (normalizedAction.includes(key)) {
      return icon;
    }
  }
  return actionIcons.default;
}

function getActionColor(action: string) {
  const normalizedAction = action.toLowerCase();
  for (const [key, color] of Object.entries(actionColors)) {
    if (normalizedAction.includes(key)) {
      return color;
    }
  }
  return actionColors.default;
}

export default function AdminAuditLogs() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const itemsPerPage = 25;

  // tRPC queries
  const { data: logsData, isLoading: logsLoading, refetch: refetchLogs } = trpc.audit.getLogs.useQuery(
    {
      action: actionFilter !== "all" ? actionFilter : undefined,
      entityType: entityTypeFilter !== "all" ? entityTypeFilter : undefined,
      search: searchQuery || undefined,
      startDate: startOfDay(dateRange.from).toISOString(),
      endDate: endOfDay(dateRange.to).toISOString(),
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    },
    {
      enabled: isAuthenticated && user?.role === "admin",
    }
  );

  const { data: stats, isLoading: statsLoading } = trpc.audit.getStats.useQuery(
    undefined,
    {
      enabled: isAuthenticated && user?.role === "admin",
    }
  );

  // Calculate pagination
  const totalPages = logsData ? Math.ceil(logsData.total / itemsPerPage) : 1;

  // Get unique action types and entity types for filters
  const actionTypes = useMemo(() => {
    if (!stats?.actionCounts) return [];
    return Object.keys(stats.actionCounts).sort();
  }, [stats]);

  const entityTypes = useMemo(() => {
    if (!stats?.entityCounts) return [];
    return Object.keys(stats.entityCounts).sort();
  }, [stats]);

  // Handle export
  const handleExport = () => {
    if (!logsData?.logs) return;
    const data = JSON.stringify(logsData.logs, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd-HHmmss")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Redirect to="/" />;
  }

  const isLoading = logsLoading || statsLoading;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <H1 className="text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Audit Logs
                </H1>
                <Body size="sm" className="text-muted-foreground">
                  System activity and security monitoring
                </Body>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => refetchLogs()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleExport} disabled={!logsData?.logs?.length}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <MetricValue size="md">{stats?.totalLogs || 0}</MetricValue>
                  )}
                  <Body size="sm" className="text-muted-foreground">Total Events</Body>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <MetricValue size="md">{stats?.successCount || 0}</MetricValue>
                  )}
                  <Body size="sm" className="text-muted-foreground">Successful</Body>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <MetricValue size="md">{stats?.failureCount || 0}</MetricValue>
                  )}
                  <Body size="sm" className="text-muted-foreground">Failed</Body>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <MetricValue size="md">{Object.keys(stats?.userCounts || {}).length}</MetricValue>
                  )}
                  <Body size="sm" className="text-muted-foreground">Active Users</Body>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by action, entity, or IP..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <Select
                value={actionFilter}
                onValueChange={(value) => {
                  setActionFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actionTypes.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={entityTypeFilter}
                onValueChange={(value) => {
                  setEntityTypeFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entityTypes.map((entity) => (
                    <SelectItem key={entity} value={entity}>
                      {entity.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                        setCurrentPage(1);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              {logsLoading ? (
                "Loading..."
              ) : (
                `Showing ${logsData?.logs?.length || 0} of ${logsData?.total || 0} events`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !logsData?.logs?.length ? (
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No audit logs found</p>
                <p className="text-sm">Try adjusting your filters or date range</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logsData.logs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {log.createdAt
                            ? format(new Date(log.createdAt), "MMM d, HH:mm:ss")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">
                              {log.userId ? `User #${log.userId}` : "System"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("gap-1", getActionColor(log.action))}>
                            {getActionIcon(log.action)}
                            {log.action.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">
                            {log.entityType?.replace(/_/g, " ") || "N/A"}
                          </span>
                          {log.entityId && (
                            <span className="text-muted-foreground text-xs ml-1">
                              (#{log.entityId})
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.ipAddress || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedLog(log)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Log Details</DialogTitle>
                                <DialogDescription>
                                  Event ID: {log.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Timestamp
                                    </p>
                                    <p className="font-mono text-sm">
                                      {log.createdAt
                                        ? format(new Date(log.createdAt), "PPpp")
                                        : "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      User ID
                                    </p>
                                    <p className="text-sm">
                                      {log.userId || "System"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Action
                                    </p>
                                    <Badge className={getActionColor(log.action)}>
                                      {log.action.replace(/_/g, " ")}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Entity
                                    </p>
                                    <p className="text-sm capitalize">
                                      {log.entityType?.replace(/_/g, " ") || "N/A"}
                                      {log.entityId && ` #${log.entityId}`}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      IP Address
                                    </p>
                                    <p className="font-mono text-sm">
                                      {log.ipAddress || "N/A"}
                                    </p>
                                  </div>
                                </div>
                                {log.userAgent && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">
                                      User Agent
                                    </p>
                                    <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                                      {log.userAgent}
                                    </p>
                                  </div>
                                )}
                                {log.changes && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">
                                      Changes
                                    </p>
                                    <pre className="text-xs font-mono bg-muted p-2 rounded overflow-auto max-h-48">
                                      {JSON.stringify(log.changes, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
