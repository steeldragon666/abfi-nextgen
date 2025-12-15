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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  MessageSquare,
  Package,
  Calendar,
  DollarSign,
  Truck,
} from "lucide-react";
import { formatDate } from "@/const";

export default function InquiryResponse() {
  const { inquiryId } = useParams<{ inquiryId: string }>();
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const [response, setResponse] = useState("");
  const [pricePerTonne, setPricePerTonne] = useState("");
  const [availableVolume, setAvailableVolume] = useState("");
  const [deliveryTimeframe, setDeliveryTimeframe] = useState("");
  const [deliveryTerms, setDeliveryTerms] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [responseStatus, setResponseStatus] = useState<
    "accept" | "decline" | "negotiate"
  >("accept");

  const { data: inquiry, isLoading } = trpc.inquiries.getById.useQuery(
    { id: parseInt(inquiryId!) },
    { enabled: !!inquiryId && !!user }
  );

  const respondMutation = trpc.inquiries.respond.useMutation({
    onSuccess: () => {
      setLocation("/inquiries/supplier");
    },
    onError: error => {
      setError(error.message || "Failed to send response");
    },
  });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  if (isLoading) {
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

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Inquiry not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!response.trim()) {
      setError("Please provide a response message");
      return;
    }

    respondMutation.mutate({
      inquiryId: parseInt(inquiryId!),
      response: response.trim(),
      pricePerTonne: pricePerTonne ? parseFloat(pricePerTonne) : undefined,
      availableVolume: availableVolume ? parseInt(availableVolume) : undefined,
      deliveryTimeframe,
      deliveryTerms,
      minimumOrder: minimumOrder ? parseInt(minimumOrder) : undefined,
      status: responseStatus === "decline" ? "closed" : "responded",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/inquiries/supplier")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inquiries
        </Button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inquiry Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Inquiry Details
                  </CardTitle>
                  <CardDescription className="mt-2">
                    From: Anonymous Buyer
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(inquiry.status)}>
                  {inquiry.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{inquiry.subject}</h4>
                <p className="text-sm text-muted-foreground">
                  Received on {formatDate(inquiry.createdAt)}
                </p>
              </div>

              <div className="grid gap-3 text-sm">
                {inquiry.feedstockId && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Feedstock:</span>{" "}
                      <span className="font-medium">
                        ABFI-{inquiry.feedstockId}
                      </span>
                    </div>
                  </div>
                )}

                {inquiry.volumeRequired && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">
                        Volume Needed:
                      </span>{" "}
                      <span className="font-medium">
                        {inquiry.volumeRequired.toLocaleString()} tonnes
                      </span>
                    </div>
                  </div>
                )}

                {inquiry.deliveryLocation && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">
                        Delivery To:
                      </span>{" "}
                      <span className="font-medium">
                        {inquiry.deliveryLocation}
                      </span>
                    </div>
                  </div>
                )}

                {inquiry.deliveryTimeframeStart && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">
                        Target Date:
                      </span>{" "}
                      <span className="font-medium">
                        {formatDate(inquiry.deliveryTimeframeStart)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {inquiry.message && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    Buyer's Message:
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {inquiry.message}
                  </p>
                </div>
              )}

              {inquiry.responseMessage && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2 text-green-900">
                    Your Previous Response:
                  </div>
                  <p className="text-sm text-green-800 whitespace-pre-wrap">
                    {inquiry.responseMessage}
                  </p>
                  {inquiry.respondedAt && (
                    <div className="text-xs text-green-600 mt-2">
                      Sent on {formatDate(inquiry.respondedAt)}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Response Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Response</CardTitle>
              <CardDescription>
                Provide details about your offering to the buyer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="responseType">Response Type</Label>
                  <Select
                    value={responseStatus}
                    onValueChange={(value: any) => setResponseStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accept">
                        Accept - Can fulfill request
                      </SelectItem>
                      <SelectItem value="negotiate">
                        Negotiate - Partial fulfillment or different terms
                      </SelectItem>
                      <SelectItem value="decline">
                        Decline - Cannot fulfill
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {responseStatus !== "decline" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pricePerTonne">
                          <DollarSign className="h-4 w-4 inline mr-1" />
                          Price per Tonne (AUD)
                        </Label>
                        <Input
                          id="pricePerTonne"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 450.00"
                          value={pricePerTonne}
                          onChange={e => setPricePerTonne(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availableVolume">
                          <Package className="h-4 w-4 inline mr-1" />
                          Available Volume (tonnes)
                        </Label>
                        <Input
                          id="availableVolume"
                          type="number"
                          placeholder="e.g., 5000"
                          value={availableVolume}
                          onChange={e => setAvailableVolume(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deliveryTimeframe">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Delivery Timeframe
                        </Label>
                        <Input
                          id="deliveryTimeframe"
                          placeholder="e.g., 2-4 weeks"
                          value={deliveryTimeframe}
                          onChange={e => setDeliveryTimeframe(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minimumOrder">
                          <Package className="h-4 w-4 inline mr-1" />
                          Minimum Order (tonnes)
                        </Label>
                        <Input
                          id="minimumOrder"
                          type="number"
                          placeholder="e.g., 500"
                          value={minimumOrder}
                          onChange={e => setMinimumOrder(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryTerms">
                        <Truck className="h-4 w-4 inline mr-1" />
                        Delivery Terms
                      </Label>
                      <Input
                        id="deliveryTerms"
                        placeholder="e.g., FOB, CIF, Ex-Works"
                        value={deliveryTerms}
                        onChange={e => setDeliveryTerms(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="response">
                    Response Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="response"
                    rows={6}
                    placeholder={
                      responseStatus === "decline"
                        ? "Explain why you cannot fulfill this request..."
                        : "Provide additional details about your offering, payment terms, quality specifications, etc..."
                    }
                    value={response}
                    onChange={e => setResponse(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This message will be sent to the buyer along with your
                    pricing and terms
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={respondMutation.isPending}
                    className="flex-1"
                  >
                    {respondMutation.isPending ? "Sending..." : "Send Response"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/inquiries/supplier")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
