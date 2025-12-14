"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  CheckCircle,
  XCircle,
  User,
  Shield,
  Database,
  Key,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  user_role: string | null;
  action: string;
  action_category: string | null;
  entity_type: string | null;
  entity_id: string | null;
  entity_name: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ACTION_CATEGORIES = [
  { value: "auth", label: "Authentication" },
  { value: "data", label: "Data" },
  { value: "admin", label: "Admin" },
  { value: "verification", label: "Verification" },
  { value: "system", label: "System" },
];

const ENTITY_TYPES = [
  { value: "user", label: "User" },
  { value: "feedstock", label: "Feedstock" },
  { value: "supplier", label: "Supplier" },
  { value: "buyer", label: "Buyer" },
  { value: "inquiry", label: "Inquiry" },
  { value: "ci_report", label: "CI Report" },
  { value: "document", label: "Document" },
];

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchAction, setSearchAction] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      });

      if (searchAction) params.set("action", searchAction);
      if (selectedCategory) params.set("action_category", selectedCategory);
      if (selectedEntityType) params.set("entity_type", selectedEntityType);

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch logs");

      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSearch = () => {
    fetchLogs(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchLogs(newPage);
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case "auth":
        return <Key className="h-4 w-4" />;
      case "data":
        return <Database className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "verification":
        return <CheckCircle className="h-4 w-4" />;
      case "system":
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "auth":
        return "bg-blue-100 text-blue-800";
      case "data":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-red-100 text-red-800";
      case "verification":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Action</label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., login, update, delete..."
                  value={searchAction}
                  onChange={(e) => setSearchAction(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {ACTION_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Entity Type</label>
              <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                <SelectTrigger>
                  <SelectValue placeholder="All entity types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All entity types</SelectItem>
                  {ENTITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            {pagination.total.toLocaleString()} total entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No audit logs found matching your criteria
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead className="w-[80px]">Status</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(log.created_at), "dd MMM yyyy HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate max-w-[150px]">
                              {log.user_email || "System"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">
                            {log.action}
                          </code>
                        </TableCell>
                        <TableCell>
                          {log.action_category && (
                            <Badge className={cn("gap-1", getCategoryColor(log.action_category))}>
                              {getCategoryIcon(log.action_category)}
                              {log.action_category}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.entity_type && (
                            <span className="text-sm">
                              {log.entity_type}
                              {log.entity_name && `: ${log.entity_name}`}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedLog(log)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Audit Log Details</DialogTitle>
                                <DialogDescription>
                                  {format(new Date(log.created_at), "PPpp")}
                                </DialogDescription>
                              </DialogHeader>
                              <LogDetailView log={log} />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LogDetailView({ log }: { log: AuditLog }) {
  return (
    <ScrollArea className="max-h-[500px]">
      <div className="space-y-6 pr-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Action</div>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {log.action}
            </code>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Category</div>
            <div className="mt-1">{log.action_category || "-"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">User</div>
            <div className="mt-1">{log.user_email || "System"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">User Role</div>
            <div className="mt-1 capitalize">{log.user_role || "-"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <div className="mt-1 flex items-center gap-2">
              {log.success ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Success</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">Failed</span>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">IP Address</div>
            <div className="mt-1">{log.ip_address || "-"}</div>
          </div>
        </div>

        {/* Entity Info */}
        {log.entity_type && (
          <>
            <Separator />
            <div>
              <div className="text-sm font-medium mb-2">Entity Information</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="capitalize">{log.entity_type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div>{log.entity_name || "-"}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">ID</div>
                  <code className="text-xs">{log.entity_id || "-"}</code>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Error Message */}
        {!log.success && log.error_message && (
          <>
            <Separator />
            <div>
              <div className="text-sm font-medium mb-2 text-red-600">Error</div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                {log.error_message}
              </div>
            </div>
          </>
        )}

        {/* Changes */}
        {(log.old_values || log.new_values) && (
          <>
            <Separator />
            <div>
              <div className="text-sm font-medium mb-2">Changes</div>
              <div className="grid grid-cols-2 gap-4">
                {log.old_values && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Before</div>
                    <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto">
                      {JSON.stringify(log.old_values, null, 2)}
                    </pre>
                  </div>
                )}
                {log.new_values && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">After</div>
                    <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto">
                      {JSON.stringify(log.new_values, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Metadata */}
        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <>
            <Separator />
            <div>
              <div className="text-sm font-medium mb-2">Additional Metadata</div>
              <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          </>
        )}

        {/* User Agent */}
        {log.user_agent && (
          <>
            <Separator />
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                User Agent
              </div>
              <div className="mt-1 text-xs text-muted-foreground break-all">
                {log.user_agent}
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
