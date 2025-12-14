import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, MapPin, Calendar, TrendingUp, Package, Send, CheckCircle2 } from "lucide-react";

export default function DemandSignalDetail() {
  const [, params] = useRoute("/demand-signals/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const signalId = parseInt(params?.id || "0");

  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseForm, setResponseForm] = useState({
    proposedVolume: "",
    proposedPrice: "",
    proposedDeliveryMethod: "",
    proposedStartDate: "",
    proposedContractTerm: "",
    coverLetter: "",
  });

  const { data, isLoading } = trpc.demandSignals.getById.useQuery({ id: signalId });
  const signal = data?.signal;
  const isBuyer = data?.isBuyer;

  const submitResponseMutation = trpc.demandSignals.submitResponse.useMutation({
    onSuccess: () => {
      setShowResponseDialog(false);
      setResponseForm({
        proposedVolume: "",
        proposedPrice: "",
        proposedDeliveryMethod: "",
        proposedStartDate: "",
        proposedContractTerm: "",
        coverLetter: "",
      });
    },
  });

  const handleSubmitResponse = () => {
    submitResponseMutation.mutate({
      demandSignalId: signalId,
      proposedVolume: parseInt(responseForm.proposedVolume),
      proposedPrice: parseInt(responseForm.proposedPrice),
      proposedDeliveryMethod: responseForm.proposedDeliveryMethod || undefined,
      proposedStartDate: new Date(responseForm.proposedStartDate),
      proposedContractTerm: responseForm.proposedContractTerm ? parseInt(responseForm.proposedContractTerm) : undefined,
      coverLetter: responseForm.coverLetter || undefined,
    });
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      agricultural_residue: "bg-green-100 text-green-800",
      forestry_residue: "bg-amber-100 text-amber-800",
      energy_crop: "bg-blue-100 text-blue-800",
      organic_waste: "bg-purple-100 text-purple-800",
      algae_aquatic: "bg-cyan-100 text-cyan-800",
      mixed: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatCategory = (category: string) => {
    return category.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 mb-4" />
          <Skeleton className="h-48 mb-4" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Demand signal not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isExpired = new Date() > new Date(signal.responseDeadline);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/demand-signals")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Demand Signals
        </Button>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl mb-3">{signal.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getCategoryBadgeColor(signal.feedstockCategory)}>
                    {formatCategory(signal.feedstockCategory)}
                  </Badge>
                  <Badge variant="outline">{signal.feedstockType}</Badge>
                  <Badge variant={signal.status === "published" ? "default" : "secondary"}>
                    {signal.status}
                  </Badge>
                </div>
                {signal.description && (
                  <CardDescription className="text-base">{signal.description}</CardDescription>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-bold text-primary">
                  {signal.annualVolume?.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">tonnes/year</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Signal Number: <span className="font-medium text-foreground">{signal.signalNumber}</span>
              </div>
              {!isBuyer && user && !isExpired && (
                <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Response
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Submit Response</DialogTitle>
                      <DialogDescription>
                        Provide your proposal for this demand signal
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="proposedVolume">Proposed Volume (tonnes/year) *</Label>
                          <Input
                            id="proposedVolume"
                            type="number"
                            value={responseForm.proposedVolume}
                            onChange={(e) => setResponseForm(prev => ({ ...prev, proposedVolume: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="proposedPrice">Proposed Price (AUD/tonne) *</Label>
                          <Input
                            id="proposedPrice"
                            type="number"
                            value={responseForm.proposedPrice}
                            onChange={(e) => setResponseForm(prev => ({ ...prev, proposedPrice: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="proposedStartDate">Proposed Start Date *</Label>
                          <Input
                            id="proposedStartDate"
                            type="date"
                            value={responseForm.proposedStartDate}
                            onChange={(e) => setResponseForm(prev => ({ ...prev, proposedStartDate: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="proposedContractTerm">Contract Term (years)</Label>
                          <Input
                            id="proposedContractTerm"
                            type="number"
                            value={responseForm.proposedContractTerm}
                            onChange={(e) => setResponseForm(prev => ({ ...prev, proposedContractTerm: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="proposedDeliveryMethod">Delivery Method</Label>
                        <Input
                          id="proposedDeliveryMethod"
                          value={responseForm.proposedDeliveryMethod}
                          onChange={(e) => setResponseForm(prev => ({ ...prev, proposedDeliveryMethod: e.target.value }))}
                          placeholder="e.g., Delivered, Ex Farm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="coverLetter">Cover Letter</Label>
                        <Textarea
                          id="coverLetter"
                          value={responseForm.coverLetter}
                          onChange={(e) => setResponseForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                          placeholder="Introduce your capabilities and why you're a good fit..."
                          rows={5}
                        />
                      </div>
                      <Button
                        onClick={handleSubmitResponse}
                        disabled={submitResponseMutation.isPending || !responseForm.proposedVolume || !responseForm.proposedPrice || !responseForm.proposedStartDate}
                        className="w-full"
                      >
                        {submitResponseMutation.isPending ? "Submitting..." : "Submit Response"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {isExpired && (
                <Badge variant="destructive">Response Deadline Passed</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Volume Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Volume Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Annual Volume</div>
                <div className="text-lg font-semibold">{signal.annualVolume?.toLocaleString()} tonnes</div>
              </div>
              {signal.volumeFlexibility && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Flexibility</div>
                  <div className="text-lg font-semibold">±{signal.volumeFlexibility}%</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Delivery Frequency</div>
                <div className="text-lg font-semibold capitalize">{signal.deliveryFrequency?.replace("_", " ")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Specifications */}
        {(signal.minMoistureContent || signal.maxMoistureContent || signal.minEnergyContent || signal.maxAshContent || signal.maxChlorineContent || signal.otherQualitySpecs) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quality Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {signal.minMoistureContent && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Min Moisture Content</div>
                    <div className="font-semibold">{signal.minMoistureContent}%</div>
                  </div>
                )}
                {signal.maxMoistureContent && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Max Moisture Content</div>
                    <div className="font-semibold">{signal.maxMoistureContent}%</div>
                  </div>
                )}
                {signal.minEnergyContent && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Min Energy Content</div>
                    <div className="font-semibold">{signal.minEnergyContent} MJ/kg</div>
                  </div>
                )}
                {signal.maxAshContent && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Max Ash Content</div>
                    <div className="font-semibold">{signal.maxAshContent}%</div>
                  </div>
                )}
                {signal.maxChlorineContent && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Max Chlorine Content</div>
                    <div className="font-semibold">{signal.maxChlorineContent} ppm</div>
                  </div>
                )}
              </div>
              {signal.otherQualitySpecs && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-1">Other Requirements</div>
                  <p className="text-sm">{signal.otherQualitySpecs}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Delivery Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Delivery Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Delivery Location</div>
                <div className="font-semibold">{signal.deliveryLocation}{signal.deliveryState && `, ${signal.deliveryState}`}</div>
              </div>
              {signal.maxTransportDistance && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Max Transport Distance</div>
                  <div className="font-semibold">{signal.maxTransportDistance} km</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Delivery Method</div>
                <div className="font-semibold capitalize">{signal.deliveryMethod?.replace("_", " ")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {signal.indicativePriceMin && signal.indicativePriceMax && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Indicative Price Range</div>
                  <div className="text-lg font-semibold">${signal.indicativePriceMin} - ${signal.indicativePriceMax} AUD/tonne</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Pricing Mechanism</div>
                <div className="font-semibold capitalize">{signal.pricingMechanism}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Supply Start Date</div>
                <div className="font-semibold">{formatDate(signal.supplyStartDate)}</div>
              </div>
              {signal.supplyEndDate && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Supply End Date</div>
                  <div className="font-semibold">{formatDate(signal.supplyEndDate)}</div>
                </div>
              )}
              {signal.contractTerm && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Contract Term</div>
                  <div className="font-semibold">{signal.contractTerm} years</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Response Deadline</div>
                <div className="font-semibold">{formatDate(signal.responseDeadline)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability */}
        {signal.sustainabilityRequirements && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sustainability Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{signal.sustainabilityRequirements}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                {signal.responseCount || 0} response{signal.responseCount !== 1 ? "s" : ""} received
              </div>
              <div>
                {signal.viewCount || 0} view{signal.viewCount !== 1 ? "s" : ""}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
