/**
 * Admin Audit Logs
 *
 * View and search system audit logs for compliance and security monitoring.
 * Essential Eight requirement for audit logging.
 */

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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Search,
  Download,
  Filter,
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
} from "lucide-react";
import { Link } from "wouter";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { H1, Body, MetricValue } from "@/components/Typography";

// Mock data
const auditLogs = [
  {
    id: "log-001",
    timestamp: new Date("2025-12-28T14:32:15"),
    user: "john.smith@example.com",
    userId: "usr-123",
    action: "LOGIN",
    resource: "auth",
    resourceId: null,
    ipAddress: "203.45.123.78",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0",
    status: "success",
    details: { method: "password", mfaUsed: true },
  },
  {
    id: "log-002",
    timestamp: new Date("2025-12-28T14:28:45"),
    user: "admin@abfi.io",
    userId: "usr-001",
    action: "UPDATE",
    resource: "user",
    resourceId: "usr-456",
    ipAddress: "10.0.0.1",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1",
    status: "success",
    details: { field: "role", oldValue: "grower", newValue: "developer" },
  },
  {
    id: "log-003",
    timestamp: new Date("2025-12-28T14:15:22"),
    user: "sarah.jones@grower.com",
    userId: "usr-789",
    action: "CREATE",
    resource: "feedstock",
    resourceId: "fs-1234",
    ipAddress: "118.92.45.67",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)",
    status: "success",
    details: { type: "wheat_straw", quantity: 5000 },
  },
  {
    id: "log-004",
    timestamp: new Date("2025-12-28T13:58:10"),
    user: "unknown",
    userId: null,
    action: "LOGIN",
    resource: "auth",
    resourceId: null,
    ipAddress: "185.234.67.89",
    userAgent: "Python-requests/2.28.0",
    status: "failure",
    details: { reason: "invalid_credentials", attempts: 3 },
  },
  {
    id: "log-005",
    timestamp: new Date("2025-12-28T13:45:33"),
    user: "mark.developer@bioenergy.com",
    userId: "usr-321",
    action: "DELETE",
    resource: "supply_agreement",
    resourceId: "sa-567",
    ipAddress: "202.14.89.23",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0",
    status: "success",
    details: { reason: "contract_cancelled" },
  },
  {
    id: "log-006",
    timestamp: new Date("2025-12-28T13:30:00"),
    user: "system",
    userId: "system",
    action: "SCHEDULED_JOB",
    resource: "covenant_check",
    resourceId: null,
    ipAddress: "127.0.0.1",
    userAgent: "ABFI-Scheduler/1.0",
    status: "success",
    details: { projectsChecked: 45, breachesFound: 2 },
  },
  {
    id: "log-007",
    timestamp: new Date("2025-12-28T12:15:45"),
    user: "jane.lender@bank.com",
    userId: "usr-654",
    action: "VIEW",
    resource: "project",
    resourceId: "proj-789",
    ipAddress: "120.45.78.90",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0",
    status: "success",
    details: { section: "bankability_report" },
  },
  {
    id: "log-008",
    timestamp: new Date("2025-12-28T11:45:22"),
    user: "admin@abfi.io",
    userId: "usr-001",
    action: "EXPORT",
    resource: "report",
    resourceId: "rpt-quarterly",
    ipAddress: "10.0.0.1",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1",
    status: "success",
    details: { format: "pdf", size: "2.4MB" },
  },
];

const actionIcons: Record<string, React.ReactNode> = {
  LOGIN: <LogIn className="h-4 w-4" />,
  LOGOUT: <LogOut className="h-4 w-4" />,
  CREATE: <Plus className="h-4 w-4" />,
  UPDATE: <FileEdit className="h-4 w-4" />,
  DELETE: <Trash2 className="h-4 w-4" />,
  VIEW: <Eye className="h-4 w-4" />,
  EXPORT: <Download className="h-4 w-4" />,
  SCHEDULED_JOB: <RefreshCw className="h-4 w-4" />,
};

const actionColors: Record<string, string> = {
  LOGIN: "bg-blue-100 text-blue-800",
  LOGOUT: "bg-gray-100 text-gray-800",
  CREATE: "bg-green-100 text-green-800",
  UPDATE: "bg-amber-100 text-amber-800",
  DELETE: "bg-red-100 text-red-800",
  VIEW: "bg-purple-100 text-purple-800",
  EXPORT: "bg-cyan-100 text-cyan-800",
  SCHEDULED_JOB: "bg-indigo-100 text-indigo-800",
};

export default function AdminAuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedLog, setSelectedLog] = useState<(typeof auditLogs)[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;

    const matchesDate =
      log.timestamp >= dateRange.from && log.timestamp <= dateRange.to;

    return matchesSearch && matchesAction && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    // In production, this would generate a CSV/JSON export
    const data = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container-default py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <H1 className="text-2xl">Audit Logs</H1>
                <Body size="sm" className="text-muted-foreground">
                  System activity and security monitoring
                </Body>
              </div>
            </div>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-default py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <MetricValue size="md">{auditLogs.length}</MetricValue>
                  <Body size="sm" className="text-muted-foreground">Total Events</Body>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {auditLogs.filter((l) => l.status === "success").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Successful</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {auditLogs.filter((l) => l.status === "failure").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {auditLogs.filter((l) => l.action === "LOGIN" && l.status === "failure").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Failed Logins</p>
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
                    placeholder="Search by user, resource, or IP..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="LOGOUT">Logout</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                  <SelectItem value="VIEW">View</SelectItem>
                  <SelectItem value="EXPORT">Export</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
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
              Showing {paginatedLogs.length} of {filteredLogs.length} events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {format(log.timestamp, "MMM d, HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("gap-1", actionColors[log.action])}>
                        {actionIcons[log.action]}
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{log.resource.replace("_", " ")}</span>
                      {log.resourceId && (
                        <span className="text-muted-foreground text-xs ml-1">
                          ({log.resourceId})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                    <TableCell>
                      {log.status === "success" ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Success
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )}
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
                                  {format(log.timestamp, "PPpp")}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  User
                                </p>
                                <p className="text-sm">{log.user}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Action
                                </p>
                                <Badge className={actionColors[log.action]}>
                                  {log.action}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Resource
                                </p>
                                <p className="text-sm capitalize">
                                  {log.resource.replace("_", " ")}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  IP Address
                                </p>
                                <p className="font-mono text-sm">{log.ipAddress}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Status
                                </p>
                                <Badge
                                  className={
                                    log.status === "success"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {log.status}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">
                                User Agent
                              </p>
                              <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                                {log.userAgent}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">
                                Details
                              </p>
                              <pre className="text-xs font-mono bg-muted p-2 rounded overflow-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
