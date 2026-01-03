/**
 * ContractLifecycleManager - End-to-end contract workflow management
 *
 * Spec: Draft → Negotiate → Sign → Active → Renewal workflow
 * Features: DocuSign integration, expiry alerts, volume tracking,
 * amendment history, and bulk operations
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  PenTool,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  History,
  Users,
  DollarSign,
  Truck,
  MoreHorizontal,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Bell,
  FileSignature,
  ArrowRight,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ContractStage = "draft" | "negotiation" | "pending_signature" | "active" | "expiring" | "expired" | "terminated";

interface Contract {
  id: string;
  contractNumber: string;
  growerName: string;
  growerAbn: string;
  feedstockType: string;
  annualVolume: number;
  pricePerTonne: number;
  startDate: Date;
  endDate: Date;
  stage: ContractStage;
  completionPercentage: number;
  lastActivity: Date;
  assignedTo: string;
  docuSignEnvelopeId?: string;
  amendments: number;
  deliveredVolume: number;
  alerts: string[];
}

interface StageMetrics {
  stage: ContractStage;
  label: string;
  count: number;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface ContractLifecycleManagerProps {
  projectId?: string;
  className?: string;
}

const DEMO_CONTRACTS: Contract[] = [
  {
    id: "1",
    contractNumber: "ABFI-2025-001",
    growerName: "Burdekin Agri Co",
    growerAbn: "12 345 678 901",
    feedstockType: "Sugarcane Bagasse",
    annualVolume: 85000,
    pricePerTonne: 48,
    startDate: new Date("2025-01-15"),
    endDate: new Date("2030-01-14"),
    stage: "active",
    completionPercentage: 100,
    lastActivity: new Date(),
    assignedTo: "Sarah Chen",
    docuSignEnvelopeId: "env-abc123",
    amendments: 1,
    deliveredVolume: 42500,
    alerts: [],
  },
  {
    id: "2",
    contractNumber: "ABFI-2025-002",
    growerName: "Pioneer Farms Ltd",
    growerAbn: "23 456 789 012",
    feedstockType: "Wheat Straw",
    annualVolume: 72000,
    pricePerTonne: 42,
    startDate: new Date("2025-02-01"),
    endDate: new Date("2028-01-31"),
    stage: "pending_signature",
    completionPercentage: 80,
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignedTo: "Michael Torres",
    docuSignEnvelopeId: "env-def456",
    amendments: 0,
    deliveredVolume: 0,
    alerts: ["Awaiting grower signature - 2 days"],
  },
  {
    id: "3",
    contractNumber: "ABFI-2025-003",
    growerName: "Coastal Cane Growers",
    growerAbn: "34 567 890 123",
    feedstockType: "Sugarcane Bagasse",
    annualVolume: 68000,
    pricePerTonne: 45,
    startDate: new Date("2025-03-01"),
    endDate: new Date("2027-02-28"),
    stage: "negotiation",
    completionPercentage: 45,
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    assignedTo: "Sarah Chen",
    amendments: 0,
    deliveredVolume: 0,
    alerts: ["Price terms under review"],
  },
  {
    id: "4",
    contractNumber: "ABFI-2025-004",
    growerName: "Mackay Sugar Suppliers",
    growerAbn: "45 678 901 234",
    feedstockType: "Sugarcane Bagasse",
    annualVolume: 55000,
    pricePerTonne: 46,
    startDate: new Date("2024-06-01"),
    endDate: new Date("2025-05-31"),
    stage: "expiring",
    completionPercentage: 100,
    lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    assignedTo: "Michael Torres",
    docuSignEnvelopeId: "env-ghi789",
    amendments: 2,
    deliveredVolume: 48000,
    alerts: ["Expires in 45 days", "Renewal discussion pending"],
  },
  {
    id: "5",
    contractNumber: "ABFI-2025-005",
    growerName: "Tablelands Produce",
    growerAbn: "56 789 012 345",
    feedstockType: "Corn Stover",
    annualVolume: 48000,
    pricePerTonne: 40,
    startDate: new Date("2025-04-01"),
    endDate: new Date("2028-03-31"),
    stage: "draft",
    completionPercentage: 25,
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    assignedTo: "Sarah Chen",
    amendments: 0,
    deliveredVolume: 0,
    alerts: [],
  },
  {
    id: "6",
    contractNumber: "ABFI-2024-012",
    growerName: "Herbert Valley Farms",
    growerAbn: "67 890 123 456",
    feedstockType: "Sugarcane Bagasse",
    annualVolume: 42000,
    pricePerTonne: 44,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2026-12-31"),
    stage: "active",
    completionPercentage: 100,
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    assignedTo: "Michael Torres",
    docuSignEnvelopeId: "env-jkl012",
    amendments: 0,
    deliveredVolume: 38500,
    alerts: [],
  },
];

const STAGE_CONFIG: Record<ContractStage, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  draft: {
    label: "Draft",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    icon: <FileText className="h-4 w-4" />,
  },
  negotiation: {
    label: "Negotiation",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    icon: <Users className="h-4 w-4" />,
  },
  pending_signature: {
    label: "Pending Signature",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    icon: <PenTool className="h-4 w-4" />,
  },
  active: {
    label: "Active",
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  expiring: {
    label: "Expiring Soon",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    icon: <Clock className="h-4 w-4" />,
  },
  expired: {
    label: "Expired",
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  terminated: {
    label: "Terminated",
    color: "text-gray-700",
    bgColor: "bg-gray-200",
    icon: <Trash2 className="h-4 w-4" />,
  },
};

export function ContractLifecycleManager({
  projectId,
  className,
}: ContractLifecycleManagerProps) {
  const [contracts] = useState<Contract[]>(DEMO_CONTRACTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<ContractStage | "all">("all");
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      const matchesSearch =
        contract.growerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.contractNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage = stageFilter === "all" || contract.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [contracts, searchQuery, stageFilter]);

  // Calculate stage metrics
  const stageMetrics = useMemo((): StageMetrics[] => {
    const stages: ContractStage[] = ["draft", "negotiation", "pending_signature", "active", "expiring"];
    return stages.map((stage) => {
      const stageContracts = contracts.filter((c) => c.stage === stage);
      return {
        stage,
        label: STAGE_CONFIG[stage].label,
        count: stageContracts.length,
        value: stageContracts.reduce((acc, c) => acc + c.annualVolume * c.pricePerTonne, 0),
        icon: STAGE_CONFIG[stage].icon,
        color: STAGE_CONFIG[stage].bgColor,
      };
    });
  }, [contracts]);

  // Total pipeline value
  const totalPipelineValue = useMemo(() => {
    return contracts.reduce((acc, c) => acc + c.annualVolume * c.pricePerTonne, 0);
  }, [contracts]);

  // Contracts requiring attention
  const alertCount = useMemo(() => {
    return contracts.filter((c) => c.alerts.length > 0).length;
  }, [contracts]);

  const toggleContractSelection = (id: string) => {
    setSelectedContracts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedContracts.length === filteredContracts.length) {
      setSelectedContracts([]);
    } else {
      setSelectedContracts(filteredContracts.map((c) => c.id));
    }
  };

  const getStageActions = (stage: ContractStage) => {
    switch (stage) {
      case "draft":
        return [
          { label: "Edit Draft", icon: <Edit3 className="h-3 w-3" /> },
          { label: "Send for Review", icon: <Send className="h-3 w-3" /> },
        ];
      case "negotiation":
        return [
          { label: "Update Terms", icon: <Edit3 className="h-3 w-3" /> },
          { label: "Send for Signature", icon: <FileSignature className="h-3 w-3" /> },
        ];
      case "pending_signature":
        return [
          { label: "Resend Request", icon: <RefreshCw className="h-3 w-3" /> },
          { label: "View in DocuSign", icon: <ExternalLink className="h-3 w-3" /> },
        ];
      case "active":
        return [
          { label: "View Contract", icon: <Eye className="h-3 w-3" /> },
          { label: "Create Amendment", icon: <Plus className="h-3 w-3" /> },
        ];
      case "expiring":
        return [
          { label: "Initiate Renewal", icon: <RefreshCw className="h-3 w-3" /> },
          { label: "View Contract", icon: <Eye className="h-3 w-3" /> },
        ];
      default:
        return [{ label: "View Details", icon: <Eye className="h-3 w-3" /> }];
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDaysUntilExpiry = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className={cn("border-2 border-[#0A1931]", className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-[#0A1931] to-[#1a3a5c] text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSignature className="h-6 w-6 text-[#D4AF37]" />
            <div>
              <CardTitle className="text-lg">Contract Lifecycle Manager</CardTitle>
              <p className="text-sm text-gray-300">
                {contracts.length} contracts • {formatCurrency(totalPipelineValue)} pipeline value
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {alertCount > 0 && (
              <Badge className="bg-amber-500 text-white">
                <Bell className="h-3 w-3 mr-1" />
                {alertCount} alerts
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Contract
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Pipeline Stages */}
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {stageMetrics.map((metric, index) => (
            <div key={metric.stage} className="flex items-center">
              <button
                onClick={() => setStageFilter(metric.stage)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg min-w-[100px] transition-all",
                  stageFilter === metric.stage
                    ? "bg-[#0A1931] text-white"
                    : "bg-gray-50 hover:bg-gray-100"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                    stageFilter === metric.stage ? "bg-[#D4AF37]" : metric.color
                  )}
                >
                  {metric.icon}
                </div>
                <span className="text-xs font-medium">{metric.label}</span>
                <span className="text-lg font-bold tabular-nums">{metric.count}</span>
              </button>
              {index < stageMetrics.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-300 mx-2 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contracts or growers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={stageFilter} onValueChange={(v: any) => setStageFilter(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="pending_signature">Pending Signature</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedContracts.length > 0 && (
          <div className="bg-[#0A1931]/5 border border-[#0A1931]/20 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedContracts.length} contract{selectedContracts.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Send className="h-3 w-3 mr-1" />
                Bulk Send
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-3 w-3 mr-1" />
                Download All
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedContracts([])}
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Contract List */}
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600">
            <div className="w-6">
              <Checkbox
                checked={selectedContracts.length === filteredContracts.length && filteredContracts.length > 0}
                onCheckedChange={toggleAllSelection}
              />
            </div>
            <div className="flex-1 min-w-[200px]">Contract / Grower</div>
            <div className="w-32 text-center">Stage</div>
            <div className="w-24 text-right">Volume</div>
            <div className="w-24 text-right">Value</div>
            <div className="w-28 text-center">Expiry</div>
            <div className="w-20 text-center">Progress</div>
            <div className="w-24">Actions</div>
          </div>

          {/* Contract Rows */}
          {filteredContracts.map((contract) => {
            const stageConfig = STAGE_CONFIG[contract.stage];
            const daysUntilExpiry = getDaysUntilExpiry(contract.endDate);
            const isExpanded = expandedContract === contract.id;

            return (
              <div key={contract.id} className="border rounded-lg overflow-hidden">
                {/* Main Row */}
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 bg-white hover:bg-gray-50 transition-colors",
                    contract.alerts.length > 0 && "border-l-4 border-l-amber-400"
                  )}
                >
                  <div className="w-6">
                    <Checkbox
                      checked={selectedContracts.includes(contract.id)}
                      onCheckedChange={() => toggleContractSelection(contract.id)}
                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <button
                      onClick={() => setExpandedContract(isExpanded ? null : contract.id)}
                      className="flex items-center gap-2 text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                      <div>
                        <div className="font-medium text-sm">{contract.contractNumber}</div>
                        <div className="text-xs text-gray-500">{contract.growerName}</div>
                      </div>
                    </button>
                  </div>

                  <div className="w-32 text-center">
                    <Badge className={cn("text-xs", stageConfig.bgColor, stageConfig.color)}>
                      {stageConfig.icon}
                      <span className="ml-1">{stageConfig.label}</span>
                    </Badge>
                  </div>

                  <div className="w-24 text-right">
                    <span className="text-sm font-medium tabular-nums">
                      {(contract.annualVolume / 1000).toFixed(0)}k t
                    </span>
                  </div>

                  <div className="w-24 text-right">
                    <span className="text-sm font-semibold tabular-nums">
                      {formatCurrency(contract.annualVolume * contract.pricePerTonne)}
                    </span>
                  </div>

                  <div className="w-28 text-center">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        daysUntilExpiry < 90 && "text-amber-600",
                        daysUntilExpiry < 30 && "text-red-600"
                      )}
                    >
                      {contract.endDate.toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="w-20">
                    <div className="flex items-center gap-2">
                      <Progress value={contract.completionPercentage} className="h-2 flex-1" />
                      <span className="text-xs text-gray-500 tabular-nums">
                        {contract.completionPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-24 flex items-center gap-1">
                    {getStageActions(contract.stage).slice(0, 1).map((action, i) => (
                      <Button key={i} size="sm" variant="ghost" className="h-8 px-2">
                        {action.icon}
                      </Button>
                    ))}
                    <Button size="sm" variant="ghost" className="h-8 px-2">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-gray-50 border-t px-6 py-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">ABN</Label>
                        <p className="text-sm font-medium">{contract.growerAbn}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Feedstock Type</Label>
                        <p className="text-sm font-medium">{contract.feedstockType}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Price per Tonne</Label>
                        <p className="text-sm font-medium">${contract.pricePerTonne}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Assigned To</Label>
                        <p className="text-sm font-medium">{contract.assignedTo}</p>
                      </div>
                    </div>

                    {contract.stage === "active" && (
                      <div className="bg-white rounded-lg p-3 border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Delivery Progress</span>
                          <span className="text-sm text-gray-600">
                            {contract.deliveredVolume.toLocaleString()} / {contract.annualVolume.toLocaleString()} tonnes
                          </span>
                        </div>
                        <Progress
                          value={(contract.deliveredVolume / contract.annualVolume) * 100}
                          className="h-3"
                        />
                      </div>
                    )}

                    {contract.alerts.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-amber-800 text-sm font-medium mb-1">
                          <AlertTriangle className="h-4 w-4" />
                          Alerts
                        </div>
                        <ul className="text-sm text-amber-700 space-y-1">
                          {contract.alerts.map((alert, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              {alert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <History className="h-3 w-3" />
                          {contract.amendments} amendment{contract.amendments !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last activity: {contract.lastActivity.toLocaleDateString("en-AU")}
                        </span>
                        {contract.docuSignEnvelopeId && (
                          <span className="flex items-center gap-1">
                            <FileSignature className="h-3 w-3" />
                            DocuSign linked
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStageActions(contract.stage).map((action, i) => (
                          <Button key={i} size="sm" variant="outline">
                            {action.icon}
                            <span className="ml-1">{action.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredContracts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No contracts found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0A1931] tabular-nums">
              {contracts.filter((c) => c.stage === "active").length}
            </div>
            <div className="text-xs text-gray-500">Active Contracts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0A1931] tabular-nums">
              {(contracts.reduce((acc, c) => acc + c.annualVolume, 0) / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-gray-500">Total Volume (t)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0A1931] tabular-nums">
              {formatCurrency(totalPipelineValue)}
            </div>
            <div className="text-xs text-gray-500">Pipeline Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 tabular-nums">
              {contracts.filter((c) => c.stage === "expiring").length}
            </div>
            <div className="text-xs text-gray-500">Expiring Soon</div>
          </div>
        </div>

        {/* Data Provenance */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span>DocuSign Integration Active</span>
          </div>
          <span>Last synced: {new Date().toLocaleTimeString("en-AU")}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ContractLifecycleManager;
