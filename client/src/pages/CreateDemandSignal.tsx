import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Send, FileText } from "lucide-react";

export default function CreateDemandSignal() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    feedstockType: "",
    feedstockCategory: "agricultural_residue" as const,
    annualVolume: "",
    volumeFlexibility: "",
    deliveryFrequency: "monthly" as const,
    minMoistureContent: "",
    maxMoistureContent: "",
    minEnergyContent: "",
    maxAshContent: "",
    maxChlorineContent: "",
    otherQualitySpecs: "",
    deliveryLocation: "",
    deliveryState: "NSW" as const,
    maxTransportDistance: "",
    deliveryMethod: "delivered" as const,
    indicativePriceMin: "",
    indicativePriceMax: "",
    pricingMechanism: "negotiable" as const,
    supplyStartDate: "",
    supplyEndDate: "",
    contractTerm: "",
    responseDeadline: "",
    sustainabilityRequirements: "",
  });

  const createMutation = trpc.demandSignals.create.useMutation({
    onSuccess: (data: { id: number; signalNumber: string }) => {
      setLocation(`/demand-signals/${data.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault();
    
    createMutation.mutate({
      ...formData,
      status,
      annualVolume: parseInt(formData.annualVolume) || 0,
      volumeFlexibility: formData.volumeFlexibility ? parseInt(formData.volumeFlexibility) : undefined,
      minMoistureContent: formData.minMoistureContent ? parseInt(formData.minMoistureContent) : undefined,
      maxMoistureContent: formData.maxMoistureContent ? parseInt(formData.maxMoistureContent) : undefined,
      minEnergyContent: formData.minEnergyContent ? parseInt(formData.minEnergyContent) : undefined,
      maxAshContent: formData.maxAshContent ? parseInt(formData.maxAshContent) : undefined,
      maxChlorineContent: formData.maxChlorineContent ? parseInt(formData.maxChlorineContent) : undefined,
      maxTransportDistance: formData.maxTransportDistance ? parseInt(formData.maxTransportDistance) : undefined,
      indicativePriceMin: formData.indicativePriceMin ? parseInt(formData.indicativePriceMin) : undefined,
      indicativePriceMax: formData.indicativePriceMax ? parseInt(formData.indicativePriceMax) : undefined,
      contractTerm: formData.contractTerm ? parseInt(formData.contractTerm) : undefined,
      supplyStartDate: new Date(formData.supplyStartDate),
      supplyEndDate: formData.supplyEndDate ? new Date(formData.supplyEndDate) : undefined,
      responseDeadline: new Date(formData.responseDeadline),
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post Demand Signal</h1>
          <p className="text-muted-foreground">
            Specify your feedstock requirements to connect with verified suppliers
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, "published")}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide an overview of your feedstock requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Signal Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g., Wheat Straw Required for Bioenergy Project"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Provide additional context about your requirements..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Feedstock Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Feedstock Specifications</CardTitle>
                <CardDescription>Define the type and category of feedstock needed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="feedstockType">Feedstock Type *</Label>
                    <Input
                      id="feedstockType"
                      value={formData.feedstockType}
                      onChange={(e) => updateField("feedstockType", e.target.value)}
                      placeholder="e.g., Wheat Straw, Bagasse"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="feedstockCategory">Category *</Label>
                    <Select
                      value={formData.feedstockCategory}
                      onValueChange={(value) => updateField("feedstockCategory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agricultural_residue">Agricultural Residue</SelectItem>
                        <SelectItem value="forestry_residue">Forestry Residue</SelectItem>
                        <SelectItem value="energy_crop">Energy Crop</SelectItem>
                        <SelectItem value="organic_waste">Organic Waste</SelectItem>
                        <SelectItem value="algae_aquatic">Algae/Aquatic</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volume Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Volume Requirements</CardTitle>
                <CardDescription>Specify quantity and delivery frequency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="annualVolume">Annual Volume (tonnes) *</Label>
                    <Input
                      id="annualVolume"
                      type="number"
                      value={formData.annualVolume}
                      onChange={(e) => updateField("annualVolume", e.target.value)}
                      placeholder="e.g., 50000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="volumeFlexibility">Flexibility (%)</Label>
                    <Input
                      id="volumeFlexibility"
                      type="number"
                      value={formData.volumeFlexibility}
                      onChange={(e) => updateField("volumeFlexibility", e.target.value)}
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryFrequency">Delivery Frequency *</Label>
                    <Select
                      value={formData.deliveryFrequency}
                      onValueChange={(value) => updateField("deliveryFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="continuous">Continuous</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="fortnightly">Fortnightly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="spot">Spot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Specifications</CardTitle>
                <CardDescription>Define quality parameters for the feedstock</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minMoistureContent">Min Moisture Content (%)</Label>
                    <Input
                      id="minMoistureContent"
                      type="number"
                      value={formData.minMoistureContent}
                      onChange={(e) => updateField("minMoistureContent", e.target.value)}
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxMoistureContent">Max Moisture Content (%)</Label>
                    <Input
                      id="maxMoistureContent"
                      type="number"
                      value={formData.maxMoistureContent}
                      onChange={(e) => updateField("maxMoistureContent", e.target.value)}
                      placeholder="e.g., 15"
                    />
                  </div>

                  <div>
                    <Label htmlFor="minEnergyContent">Min Energy Content (MJ/kg)</Label>
                    <Input
                      id="minEnergyContent"
                      type="number"
                      value={formData.minEnergyContent}
                      onChange={(e) => updateField("minEnergyContent", e.target.value)}
                      placeholder="e.g., 14"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxAshContent">Max Ash Content (%)</Label>
                    <Input
                      id="maxAshContent"
                      type="number"
                      value={formData.maxAshContent}
                      onChange={(e) => updateField("maxAshContent", e.target.value)}
                      placeholder="e.g., 8"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxChlorineContent">Max Chlorine Content (ppm)</Label>
                    <Input
                      id="maxChlorineContent"
                      type="number"
                      value={formData.maxChlorineContent}
                      onChange={(e) => updateField("maxChlorineContent", e.target.value)}
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="otherQualitySpecs">Other Quality Specifications</Label>
                  <Textarea
                    id="otherQualitySpecs"
                    value={formData.otherQualitySpecs}
                    onChange={(e) => updateField("otherQualitySpecs", e.target.value)}
                    placeholder="Any additional quality requirements..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Requirements</CardTitle>
                <CardDescription>Specify delivery location and logistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryLocation">Delivery Location *</Label>
                    <Input
                      id="deliveryLocation"
                      value={formData.deliveryLocation}
                      onChange={(e) => updateField("deliveryLocation", e.target.value)}
                      placeholder="e.g., Narrabri, NSW"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryState">State *</Label>
                    <Select
                      value={formData.deliveryState}
                      onValueChange={(value) => updateField("deliveryState", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NSW">NSW</SelectItem>
                        <SelectItem value="VIC">VIC</SelectItem>
                        <SelectItem value="QLD">QLD</SelectItem>
                        <SelectItem value="SA">SA</SelectItem>
                        <SelectItem value="WA">WA</SelectItem>
                        <SelectItem value="TAS">TAS</SelectItem>
                        <SelectItem value="NT">NT</SelectItem>
                        <SelectItem value="ACT">ACT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maxTransportDistance">Max Transport Distance (km)</Label>
                    <Input
                      id="maxTransportDistance"
                      type="number"
                      value={formData.maxTransportDistance}
                      onChange={(e) => updateField("maxTransportDistance", e.target.value)}
                      placeholder="e.g., 200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryMethod">Delivery Method *</Label>
                    <Select
                      value={formData.deliveryMethod}
                      onValueChange={(value) => updateField("deliveryMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ex_farm">Ex Farm</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="fob_port">FOB Port</SelectItem>
                        <SelectItem value="negotiable">Negotiable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Provide indicative pricing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="indicativePriceMin">Min Price (AUD/tonne)</Label>
                    <Input
                      id="indicativePriceMin"
                      type="number"
                      value={formData.indicativePriceMin}
                      onChange={(e) => updateField("indicativePriceMin", e.target.value)}
                      placeholder="e.g., 80"
                    />
                  </div>

                  <div>
                    <Label htmlFor="indicativePriceMax">Max Price (AUD/tonne)</Label>
                    <Input
                      id="indicativePriceMax"
                      type="number"
                      value={formData.indicativePriceMax}
                      onChange={(e) => updateField("indicativePriceMax", e.target.value)}
                      placeholder="e.g., 120"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pricingMechanism">Pricing Mechanism *</Label>
                    <Select
                      value={formData.pricingMechanism}
                      onValueChange={(value) => updateField("pricingMechanism", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="indexed">Indexed</SelectItem>
                        <SelectItem value="spot">Spot</SelectItem>
                        <SelectItem value="negotiable">Negotiable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Define supply period and response deadline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplyStartDate">Supply Start Date *</Label>
                    <Input
                      id="supplyStartDate"
                      type="date"
                      value={formData.supplyStartDate}
                      onChange={(e) => updateField("supplyStartDate", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="supplyEndDate">Supply End Date</Label>
                    <Input
                      id="supplyEndDate"
                      type="date"
                      value={formData.supplyEndDate}
                      onChange={(e) => updateField("supplyEndDate", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contractTerm">Contract Term (years)</Label>
                    <Input
                      id="contractTerm"
                      type="number"
                      value={formData.contractTerm}
                      onChange={(e) => updateField("contractTerm", e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="responseDeadline">Response Deadline *</Label>
                    <Input
                      id="responseDeadline"
                      type="date"
                      value={formData.responseDeadline}
                      onChange={(e) => updateField("responseDeadline", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sustainability */}
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Requirements</CardTitle>
                <CardDescription>Optional sustainability and certification requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="sustainabilityRequirements">Sustainability Requirements</Label>
                  <Textarea
                    id="sustainabilityRequirements"
                    value={formData.sustainabilityRequirements}
                    onChange={(e) => updateField("sustainabilityRequirements", e.target.value)}
                    placeholder="e.g., ISCC certified, carbon intensity < 40 gCO2e/MJ..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e as any, "draft")}
                disabled={createMutation.isPending}
              >
                <FileText className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                {createMutation.isPending ? "Publishing..." : "Publish Signal"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
