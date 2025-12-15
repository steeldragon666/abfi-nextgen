import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  Award,
  FileText,
  TrendingUp,
  Shield,
  Calendar,
} from "lucide-react";

export default function GrowerQualification() {
  const { supplierId } = useParams<{ supplierId: string }>();
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [operatingHistoryScore, setOperatingHistoryScore] = useState(0);
  const [financialStrengthScore, setFinancialStrengthScore] = useState(0);
  const [landTenureScore, setLandTenureScore] = useState(0);
  const [productionCapacityScore, setProductionCapacityScore] = useState(0);
  const [creditScore, setCreditScore] = useState(0);
  const [insuranceScore, setInsuranceScore] = useState(0);
  const [assessmentNotes, setAssessmentNotes] = useState("");
  const [validityYears, setValidityYears] = useState("1");
  const [error, setError] = useState<string | null>(null);

  const { data: supplier, isLoading: supplierLoading } =
    trpc.suppliers.getById.useQuery(
      { id: parseInt(supplierId!) },
      { enabled: !!supplierId }
    );

  const createQualificationMutation =
    trpc.bankability.createGrowerQualification.useMutation({
      onSuccess: () => {
        setLocation(`/bankability`);
      },
      onError: error => {
        setError(error.message || "Failed to create qualification");
      },
    });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  if (supplierLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Supplier not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate composite score (average of all criteria)
  const compositeScore = Math.round(
    (operatingHistoryScore +
      financialStrengthScore +
      landTenureScore +
      productionCapacityScore +
      creditScore +
      insuranceScore) /
      6
  );

  // Determine qualification level based on composite score
  const getQualificationLevel = (
    score: number
  ): { level: string; name: string; color: string } => {
    if (score >= 85)
      return { level: "GQ1", name: "Premier", color: "text-green-600" };
    if (score >= 70)
      return { level: "GQ2", name: "Qualified", color: "text-blue-600" };
    if (score >= 55)
      return { level: "GQ3", name: "Developing", color: "text-yellow-600" };
    return { level: "GQ4", name: "Provisional", color: "text-orange-600" };
  };

  const qualification = getQualificationLevel(compositeScore);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (compositeScore === 0) {
      setError("Please provide scores for all criteria");
      return;
    }

    const validFrom = new Date();
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + parseInt(validityYears));

    createQualificationMutation.mutate({
      supplierId: parseInt(supplierId!),
      level: qualification.level as "GQ1" | "GQ2" | "GQ3" | "GQ4",
      levelName: qualification.name,
      operatingHistoryScore,
      financialStrengthScore,
      landTenureScore,
      productionCapacityScore,
      creditScore,
      insuranceScore,
      compositeScore,
      assessmentNotes,
      validFrom,
      validUntil,
      status: "approved",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/bankability")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Assessment Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Grower Qualification Assessment
                </CardTitle>
                <CardDescription>
                  Assess supplier: {supplier.companyName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Operating History */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold">Operating History</Label>
                      <span className="text-sm font-medium">
                        {operatingHistoryScore}/100
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Years in operation, track record, consistency of supply
                    </p>
                    <Slider
                      value={[operatingHistoryScore]}
                      onValueChange={v => setOperatingHistoryScore(v[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Financial Strength */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold">
                        Financial Strength
                      </Label>
                      <span className="text-sm font-medium">
                        {financialStrengthScore}/100
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Revenue, profitability, debt levels, working capital
                    </p>
                    <Slider
                      value={[financialStrengthScore]}
                      onValueChange={v => setFinancialStrengthScore(v[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Land Tenure */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold">
                        Land Tenure Security
                      </Label>
                      <span className="text-sm font-medium">
                        {landTenureScore}/100
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ownership vs lease, tenure length, encumbrances
                    </p>
                    <Slider
                      value={[landTenureScore]}
                      onValueChange={v => setLandTenureScore(v[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Production Capacity */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold">
                        Production Capacity
                      </Label>
                      <span className="text-sm font-medium">
                        {productionCapacityScore}/100
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scale, equipment, infrastructure, growth potential
                    </p>
                    <Slider
                      value={[productionCapacityScore]}
                      onValueChange={v => setProductionCapacityScore(v[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Credit Rating */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold">Credit Rating</Label>
                      <span className="text-sm font-medium">
                        {creditScore}/100
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Credit history, payment terms compliance, defaults
                    </p>
                    <Slider
                      value={[creditScore]}
                      onValueChange={v => setCreditScore(v[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Insurance Coverage */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold">
                        Insurance Coverage
                      </Label>
                      <span className="text-sm font-medium">
                        {insuranceScore}/100
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Liability, property, crop insurance adequacy
                    </p>
                    <Slider
                      value={[insuranceScore]}
                      onValueChange={v => setInsuranceScore(v[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Assessment Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Assessment Notes</Label>
                    <Textarea
                      id="notes"
                      rows={4}
                      placeholder="Provide detailed notes about the assessment, key strengths, areas for improvement, and any conditions..."
                      value={assessmentNotes}
                      onChange={e => setAssessmentNotes(e.target.value)}
                    />
                  </div>

                  {/* Validity Period */}
                  <div className="space-y-2">
                    <Label htmlFor="validity">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Qualification Validity
                    </Label>
                    <Select
                      value={validityYears}
                      onValueChange={setValidityYears}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Year</SelectItem>
                        <SelectItem value="2">2 Years</SelectItem>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={createQualificationMutation.isPending}
                      className="flex-1"
                    >
                      {createQualificationMutation.isPending
                        ? "Saving..."
                        : "Save Qualification"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/bankability")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Score Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Qualification Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <div
                    className={`text-6xl font-bold mb-2 ${qualification.color}`}
                  >
                    {compositeScore}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Composite Score
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                    <Award className="h-5 w-5" />
                    <span className="font-semibold">{qualification.level}</span>
                    <span className="text-muted-foreground">•</span>
                    <span>{qualification.name}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Operating History
                    </span>
                    <span className="font-medium">{operatingHistoryScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Financial Strength
                    </span>
                    <span className="font-medium">
                      {financialStrengthScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Land Tenure</span>
                    <span className="font-medium">{landTenureScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Production Capacity
                    </span>
                    <span className="font-medium">
                      {productionCapacityScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credit Rating</span>
                    <span className="font-medium">{creditScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insurance</span>
                    <span className="font-medium">{insuranceScore}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Qualification Levels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold text-green-600">
                    GQ1 - Premier (85-100)
                  </div>
                  <p className="text-muted-foreground">
                    Highest tier. Suitable for Tier 1 core agreements with
                    minimal security requirements.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-blue-600">
                    GQ2 - Qualified (70-84)
                  </div>
                  <p className="text-muted-foreground">
                    Strong growers suitable for Tier 1 or Tier 2 with moderate
                    security.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-yellow-600">
                    GQ3 - Developing (55-69)
                  </div>
                  <p className="text-muted-foreground">
                    Emerging growers suitable for Tier 2 or options with
                    enhanced security.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-orange-600">
                    GQ4 - Provisional (&lt;55)
                  </div>
                  <p className="text-muted-foreground">
                    New or unproven growers. Require substantial security and
                    monitoring.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
