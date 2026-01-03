/**
 * ConcentrationRiskAnalyzer - Dynamic supplier portfolio tracking with HHI calculation
 *
 * Spec: Real-time HHI calculation with visual risk gauge
 * Green <1,500, Amber 1,500-2,500, Red >2,500
 * Max single supplier threshold: 20% redline
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Trash2,
  Plus,
  Play,
  RefreshCw,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Supplier {
  id: string;
  name: string;
  volumeTonnes: number;
  percentage: number;
  reliabilityScore: number;
  region: string;
}

interface ConcentrationData {
  hhi: number;
  maxSupplierPercentage: number;
  supplierCount: number;
  totalVolume: number;
  suppliers: Supplier[];
  prediction90Day: {
    breachLikelihood: number;
    riskFactors: string[];
  };
}

interface ConcentrationRiskAnalyzerProps {
  projectId?: string;
  className?: string;
}

// Demo supplier data
const DEMO_SUPPLIERS: Supplier[] = [
  { id: "1", name: "Burdekin Agri Co", volumeTonnes: 85000, percentage: 17, reliabilityScore: 92, region: "QLD North" },
  { id: "2", name: "Pioneer Farms Ltd", volumeTonnes: 72000, percentage: 14.4, reliabilityScore: 88, region: "QLD Central" },
  { id: "3", name: "Coastal Cane Growers", volumeTonnes: 68000, percentage: 13.6, reliabilityScore: 95, region: "QLD North" },
  { id: "4", name: "Mackay Sugar Suppliers", volumeTonnes: 55000, percentage: 11, reliabilityScore: 82, region: "QLD Central" },
  { id: "5", name: "Tablelands Produce", volumeTonnes: 48000, percentage: 9.6, reliabilityScore: 90, region: "QLD North" },
  { id: "6", name: "Herbert Valley Farms", volumeTonnes: 42000, percentage: 8.4, reliabilityScore: 87, region: "QLD North" },
  { id: "7", name: "Proserpine Growers Assoc", volumeTonnes: 38000, percentage: 7.6, reliabilityScore: 91, region: "QLD Central" },
  { id: "8", name: "Bundaberg Cane Ltd", volumeTonnes: 32000, percentage: 6.4, reliabilityScore: 85, region: "QLD South" },
  { id: "9", name: "Other (12 suppliers)", volumeTonnes: 60000, percentage: 12, reliabilityScore: 78, region: "Various" },
];

export function ConcentrationRiskAnalyzer({
  projectId,
  className,
}: ConcentrationRiskAnalyzerProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(DEMO_SUPPLIERS);
  const [scenarioMode, setScenarioMode] = useState(false);
  const [removedSuppliers, setRemovedSuppliers] = useState<string[]>([]);
  const [showAllSuppliers, setShowAllSuppliers] = useState(false);

  // Calculate HHI (Herfindahl-Hirschman Index)
  const calculateHHI = (supplierList: Supplier[]) => {
    const totalVolume = supplierList.reduce((acc, s) => acc + s.volumeTonnes, 0);
    return supplierList.reduce((acc, supplier) => {
      const marketShare = (supplier.volumeTonnes / totalVolume) * 100;
      return acc + marketShare * marketShare;
    }, 0);
  };

  // Current metrics
  const activeSuppliers = useMemo(
    () => suppliers.filter((s) => !removedSuppliers.includes(s.id)),
    [suppliers, removedSuppliers]
  );

  const totalVolume = useMemo(
    () => activeSuppliers.reduce((acc, s) => acc + s.volumeTonnes, 0),
    [activeSuppliers]
  );

  const suppliersWithPercentage = useMemo(() => {
    return activeSuppliers.map((s) => ({
      ...s,
      percentage: (s.volumeTonnes / totalVolume) * 100,
    }));
  }, [activeSuppliers, totalVolume]);

  const hhi = useMemo(() => calculateHHI(activeSuppliers), [activeSuppliers]);

  const maxSupplierPercentage = useMemo(
    () => Math.max(...suppliersWithPercentage.map((s) => s.percentage)),
    [suppliersWithPercentage]
  );

  // Risk status
  const getHHIStatus = (value: number) => {
    if (value < 1500) return { color: "green", label: "Low Concentration", bg: "bg-green-500" };
    if (value < 2500) return { color: "amber", label: "Moderate Concentration", bg: "bg-amber-500" };
    return { color: "red", label: "High Concentration", bg: "bg-red-500" };
  };

  const hhiStatus = getHHIStatus(hhi);

  const isMaxSupplierBreached = maxSupplierPercentage > 20;

  const prediction90Day = useMemo(() => {
    const riskFactors: string[] = [];
    let breachLikelihood = 10;

    if (hhi > 2000) {
      breachLikelihood += 25;
      riskFactors.push("HHI approaching critical threshold");
    }
    if (maxSupplierPercentage > 18) {
      breachLikelihood += 20;
      riskFactors.push("Single supplier nearing 20% limit");
    }
    if (activeSuppliers.length < 10) {
      breachLikelihood += 15;
      riskFactors.push("Low supplier count increases concentration risk");
    }

    return { breachLikelihood: Math.min(breachLikelihood, 95), riskFactors };
  }, [hhi, maxSupplierPercentage, activeSuppliers]);

  const handleRemoveSupplier = (id: string) => {
    setRemovedSuppliers([...removedSuppliers, id]);
  };

  const resetScenario = () => {
    setRemovedSuppliers([]);
    setScenarioMode(false);
  };

  const displayedSuppliers = showAllSuppliers
    ? suppliersWithPercentage
    : suppliersWithPercentage.slice(0, 5);

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-[#0A1931]" />
            <CardTitle className="text-lg">Concentration Risk Analyzer</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {scenarioMode && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Scenario Mode
              </Badge>
            )}
            <Button
              variant={scenarioMode ? "default" : "outline"}
              size="sm"
              onClick={() => scenarioMode ? resetScenario() : setScenarioMode(true)}
            >
              {scenarioMode ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  What-If
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* HHI Gauge */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Herfindahl-Hirschman Index (HHI)
              </h4>
              <p className="text-xs text-gray-500">
                Market concentration measure (0-10,000 scale)
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold tabular-nums">
                {Math.round(hhi).toLocaleString()}
              </span>
              <Badge
                className={cn(
                  "ml-2",
                  hhiStatus.color === "green" && "bg-green-100 text-green-800",
                  hhiStatus.color === "amber" && "bg-amber-100 text-amber-800",
                  hhiStatus.color === "red" && "bg-red-100 text-red-800"
                )}
              >
                {hhiStatus.label}
              </Badge>
            </div>
          </div>

          {/* Visual HHI gauge */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-amber-500 to-red-500"
              style={{ width: "100%" }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-6 bg-[#0A1931] rounded-sm shadow-lg"
              style={{ left: `${Math.min((hhi / 4000) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className="text-green-600">1,500</span>
            <span className="text-amber-600">2,500</span>
            <span className="text-red-600">4,000+</span>
          </div>
        </div>

        {/* Max Supplier Alert */}
        <div
          className={cn(
            "rounded-lg p-3 flex items-start gap-3",
            isMaxSupplierBreached
              ? "bg-red-50 border border-red-200"
              : "bg-green-50 border border-green-200"
          )}
        >
          {isMaxSupplierBreached ? (
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
          )}
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                isMaxSupplierBreached ? "text-red-800" : "text-green-800"
              )}
            >
              Max Single Supplier: {maxSupplierPercentage.toFixed(1)}%
            </p>
            <p
              className={cn(
                "text-xs",
                isMaxSupplierBreached ? "text-red-600" : "text-green-600"
              )}
            >
              {isMaxSupplierBreached
                ? "BREACH: Exceeds 20% concentration limit"
                : "Within 20% threshold - compliant"}
            </p>
          </div>
        </div>

        {/* 90-Day Prediction */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-purple-900">
              90-Day Breach Prediction
            </h4>
            <Badge className="bg-purple-100 text-purple-800">
              {prediction90Day.breachLikelihood}% likelihood
            </Badge>
          </div>
          {prediction90Day.riskFactors.length > 0 ? (
            <ul className="text-xs text-purple-700 space-y-1">
              {prediction90Day.riskFactors.map((factor, i) => (
                <li key={i} className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {factor}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-purple-700">
              No significant risk factors detected
            </p>
          )}
        </div>

        {/* Supplier Portfolio */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Supplier Portfolio ({activeSuppliers.length} active)
            </h4>
            <span className="text-sm text-gray-500">
              Total: {totalVolume.toLocaleString()} t
            </span>
          </div>

          <div className="space-y-2">
            {displayedSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border transition-all",
                  supplier.percentage > 20
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-white",
                  scenarioMode && "hover:bg-gray-50"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {supplier.name}
                    </span>
                    {supplier.percentage > 20 && (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{supplier.region}</span>
                    <span>•</span>
                    <span>{supplier.volumeTonnes.toLocaleString()} t</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "text-lg font-bold tabular-nums",
                      supplier.percentage > 20 ? "text-red-600" : "text-gray-900"
                    )}
                  >
                    {supplier.percentage.toFixed(1)}%
                  </span>
                </div>
                {scenarioMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSupplier(supplier.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {suppliersWithPercentage.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllSuppliers(!showAllSuppliers)}
              className="w-full"
            >
              {showAllSuppliers
                ? "Show Less"
                : `Show ${suppliersWithPercentage.length - 5} More`}
            </Button>
          )}
        </div>

        {/* Scenario Results */}
        {scenarioMode && removedSuppliers.length > 0 && (
          <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">
              Scenario Impact Analysis
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-purple-700">Suppliers Removed:</span>
                <span className="font-semibold ml-2">{removedSuppliers.length}</span>
              </div>
              <div>
                <span className="text-purple-700">New HHI:</span>
                <span className="font-semibold ml-2">{Math.round(hhi).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-purple-700">Volume Lost:</span>
                <span className="font-semibold ml-2">
                  {suppliers
                    .filter((s) => removedSuppliers.includes(s.id))
                    .reduce((acc, s) => acc + s.volumeTonnes, 0)
                    .toLocaleString()}{" "}
                  t
                </span>
              </div>
              <div>
                <span className="text-purple-700">Max Supplier:</span>
                <span className="font-semibold ml-2">
                  {maxSupplierPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Data Source */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
          <Info className="h-3 w-3" />
          <span>HHI calculated per ACCC Merger Guidelines methodology</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ConcentrationRiskAnalyzer;
