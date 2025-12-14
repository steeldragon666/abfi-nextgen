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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Megaphone,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  Archive,
  Loader2,
  AlertCircle,
  Info,
  AlertTriangle,
  Wrench,
  Sparkles,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  target_audience: "all" | "suppliers" | "buyers" | "auditors" | "admins";
  announcement_type: "info" | "warning" | "maintenance" | "feature" | "policy";
  priority: "low" | "normal" | "high" | "critical";
  show_banner: boolean;
  banner_color: string | null;
  status: "draft" | "scheduled" | "published" | "archived";
  published_at: string | null;
  expires_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator?: {
    full_name: string | null;
    email: string;
  };
}

const ANNOUNCEMENT_TYPES = [
  { value: "info", label: "Information", icon: Info },
  { value: "warning", label: "Warning", icon: AlertTriangle },
  { value: "maintenance", label: "Maintenance", icon: Wrench },
  { value: "feature", label: "Feature", icon: Sparkles },
  { value: "policy", label: "Policy", icon: FileText },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const AUDIENCES = [
  { value: "all", label: "All Users" },
  { value: "suppliers", label: "Suppliers Only" },
  { value: "buyers", label: "Buyers Only" },
  { value: "auditors", label: "Auditors Only" },
  { value: "admins", label: "Admins Only" },
];

export function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    target_audience: "all" as const,
    announcement_type: "info" as const,
    priority: "normal" as const,
    show_banner: false,
    banner_color: "",
    expires_at: "",
  });

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/admin/announcements");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAnnouncements(data.announcements);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      summary: "",
      target_audience: "all",
      announcement_type: "info",
      priority: "normal",
      show_banner: false,
      banner_color: "",
      expires_at: "",
    });
  };

  const handleCreate = async (status: "draft" | "published") => {
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status }),
      });

      if (!response.ok) throw new Error("Failed to create");

      toast.success(
        status === "published"
          ? "Announcement published!"
          : "Draft saved successfully"
      );
      resetForm();
      setIsCreateOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to create announcement:", error);
      toast.error("Failed to create announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Announcement>) => {
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast.success("Announcement updated");
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to update announcement:", error);
      toast.error("Failed to update announcement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Announcement deleted");
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      toast.error("Failed to delete announcement");
    }
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      summary: announcement.summary || "",
      target_audience: announcement.target_audience,
      announcement_type: announcement.announcement_type,
      priority: announcement.priority,
      show_banner: announcement.show_banner,
      banner_color: announcement.banner_color || "",
      expires_at: announcement.expires_at ? announcement.expires_at.split("T")[0] : "",
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAnnouncement) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/announcements/${editingAnnouncement.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast.success("Announcement updated");
      setIsEditOpen(false);
      setEditingAnnouncement(null);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error("Failed to update announcement");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = ANNOUNCEMENT_TYPES.find((t) => t.value === type);
    if (!typeConfig) return <Info className="h-4 w-4" />;
    const Icon = typeConfig.icon;
    return <Icon className="h-4 w-4" />;
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (activeTab === "all") return true;
    return a.status === activeTab;
  });

  const stats = {
    total: announcements.length,
    published: announcements.filter((a) => a.status === "published").length,
    draft: announcements.filter((a) => a.status === "draft").length,
    archived: announcements.filter((a) => a.status === "archived").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.published}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="text-2xl text-gray-600">{stats.draft}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Archived</CardDescription>
            <CardTitle className="text-2xl text-muted-foreground">{stats.archived}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Announcements</CardTitle>
            <CardDescription>
              Create and manage announcements visible to users
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>
                  Create a new announcement for platform users
                </DialogDescription>
              </DialogHeader>
              <AnnouncementForm
                formData={formData}
                setFormData={setFormData}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleCreate("draft")}
                  disabled={saving}
                >
                  Save as Draft
                </Button>
                <Button onClick={() => handleCreate("published")} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Publish Now
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredAnnouncements.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No announcements found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Audience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnnouncements.map((announcement) => (
                        <TableRow key={announcement.id}>
                          <TableCell>
                            <div className="font-medium">{announcement.title}</div>
                            {announcement.summary && (
                              <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                                {announcement.summary}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(announcement.announcement_type)}
                              <span className="capitalize">
                                {announcement.announcement_type}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">
                            {announcement.target_audience === "all"
                              ? "All Users"
                              : announcement.target_audience}
                          </TableCell>
                          <TableCell>{getStatusBadge(announcement.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(announcement.created_at), "dd MMM yyyy")}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openEditDialog(announcement)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {announcement.status === "draft" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdate(announcement.id, { status: "published" })
                                    }
                                  >
                                    <Send className="mr-2 h-4 w-4" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
                                {announcement.status === "published" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdate(announcement.id, { status: "archived" })
                                    }
                                  >
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDelete(announcement.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>Update the announcement details</DialogDescription>
          </DialogHeader>
          <AnnouncementForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface FormData {
  title: string;
  content: string;
  summary: string;
  target_audience: "all" | "suppliers" | "buyers" | "auditors" | "admins";
  announcement_type: "info" | "warning" | "maintenance" | "feature" | "policy";
  priority: "low" | "normal" | "high" | "critical";
  show_banner: boolean;
  banner_color: string;
  expires_at: string;
}

function AnnouncementForm({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  return (
    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          placeholder="Announcement title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary (optional)</Label>
        <Input
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData((p) => ({ ...p, summary: e.target.value }))}
          placeholder="Brief summary shown in lists"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
          placeholder="Full announcement content..."
          rows={5}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.announcement_type}
            onValueChange={(v) =>
              setFormData((p) => ({ ...p, announcement_type: v as FormData["announcement_type"] }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ANNOUNCEMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(v) =>
              setFormData((p) => ({ ...p, priority: v as FormData["priority"] }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Target Audience</Label>
          <Select
            value={formData.target_audience}
            onValueChange={(v) =>
              setFormData((p) => ({ ...p, target_audience: v as FormData["target_audience"] }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUDIENCES.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Expires On (optional)</Label>
          <Input
            type="date"
            value={formData.expires_at}
            onChange={(e) => setFormData((p) => ({ ...p, expires_at: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <div className="font-medium">Show as Banner</div>
          <div className="text-sm text-muted-foreground">
            Display prominently at the top of the dashboard
          </div>
        </div>
        <Switch
          checked={formData.show_banner}
          onCheckedChange={(c) => setFormData((p) => ({ ...p, show_banner: c }))}
        />
      </div>

      {formData.show_banner && (
        <div className="space-y-2">
          <Label>Banner Color</Label>
          <div className="flex gap-2">
            {["#3b82f6", "#eab308", "#ef4444", "#22c55e", "#8b5cf6"].map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  "w-8 h-8 rounded-lg border-2",
                  formData.banner_color === color ? "border-black" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
                onClick={() => setFormData((p) => ({ ...p, banner_color: color }))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
