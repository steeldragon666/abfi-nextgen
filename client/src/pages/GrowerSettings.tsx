/**
 * Grower Settings Page
 *
 * Allows growers to manage their account settings, preferences,
 * notifications, and privacy options.
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Bell,
  Shield,
  Building2,
  Mail,
  Phone,
  MapPin,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Globe,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { H1, H2, H3, Body, MetricValue, DataLabel } from "@/components/Typography";

export default function GrowerSettings() {
  const [saving, setSaving] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({
    businessName: "Murray Valley Farms",
    abn: "12 345 678 901",
    contactName: "John Smith",
    email: "john@murrayvalleyfarms.com.au",
    phone: "+61 3 1234 5678",
    address: "123 Farm Road, Shepparton VIC 3630",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailInquiries: true,
    emailContracts: true,
    emailMarketUpdates: false,
    emailNewsletter: true,
    pushNewInquiry: true,
    pushContractUpdate: true,
    pushPriceAlerts: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showInDirectory: true,
    showContactDetails: false,
    showProductionVolumes: true,
    allowAnonymousViews: true,
    dataRetentionMonths: "36",
  });

  // Display preferences
  const [display, setDisplay] = useState({
    language: "en-AU",
    timezone: "Australia/Melbourne",
    dateFormat: "dd/MM/yyyy",
    currency: "AUD",
    units: "metric",
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("Settings saved successfully");
  };

  const handleExportData = () => {
    toast.info("Preparing data export...");
    // Simulate data export
    setTimeout(() => {
      toast.success("Data export ready for download");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container-default py-4">
          <div className="flex items-center gap-4">
            <Link href="/grower">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <H1 className="text-2xl font-bold">Settings</H1>
              <Body className="text-muted-foreground text-sm">
                Manage your account preferences
              </Body>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-default py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Display</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Your registered business details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={profile.businessName}
                      onChange={(e) =>
                        setProfile({ ...profile, businessName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abn">ABN</Label>
                    <Input
                      id="abn"
                      value={profile.abn}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Contact support to update your ABN
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Details
                </CardTitle>
                <CardDescription>
                  How buyers and platform can reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={profile.contactName}
                      onChange={(e) =>
                        setProfile({ ...profile, contactName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-9"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        className="pl-9"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        className="pl-9"
                        value={profile.address}
                        onChange={(e) =>
                          setProfile({ ...profile, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Control which emails you receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "emailInquiries",
                    label: "New Inquiries",
                    description: "Get notified when buyers send inquiries",
                  },
                  {
                    key: "emailContracts",
                    label: "Contract Updates",
                    description: "Updates on contract status and renewals",
                  },
                  {
                    key: "emailMarketUpdates",
                    label: "Market Updates",
                    description: "Weekly digest of market trends and prices",
                  },
                  {
                    key: "emailNewsletter",
                    label: "ABFI Newsletter",
                    description: "Platform news, features, and industry insights",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <H3 className="font-medium">{item.label}</H3>
                      <Body className="text-sm text-muted-foreground">
                        {item.description}
                      </Body>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
                <CardDescription>
                  Real-time alerts on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "pushNewInquiry",
                    label: "New Inquiry Alert",
                    description: "Instant notification when you receive an inquiry",
                  },
                  {
                    key: "pushContractUpdate",
                    label: "Contract Status Changes",
                    description: "Updates when contracts are signed or expire",
                  },
                  {
                    key: "pushPriceAlerts",
                    label: "Price Alerts",
                    description: "When feedstock prices match your thresholds",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <H3 className="font-medium">{item.label}</H3>
                      <Body className="text-sm text-muted-foreground">
                        {item.description}
                      </Body>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Profile Visibility
                </CardTitle>
                <CardDescription>
                  Control what information is visible to others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "showInDirectory",
                    label: "Show in Supplier Directory",
                    description: "Allow buyers to find you in the marketplace",
                  },
                  {
                    key: "showContactDetails",
                    label: "Display Contact Details",
                    description: "Show email and phone on your public profile",
                  },
                  {
                    key: "showProductionVolumes",
                    label: "Display Production Volumes",
                    description: "Show your annual production capacity",
                  },
                  {
                    key: "allowAnonymousViews",
                    label: "Allow Anonymous Views",
                    description: "Let non-logged-in users see your listings",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <H3 className="font-medium">{item.label}</H3>
                      <Body className="text-sm text-muted-foreground">
                        {item.description}
                      </Body>
                    </div>
                    <Switch
                      checked={privacy[item.key as keyof typeof privacy] as boolean}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Manage your data and account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Data Retention Period</Label>
                  <Select
                    value={privacy.dataRetentionMonths}
                    onValueChange={(value) =>
                      setPrivacy({ ...privacy, dataRetentionMonths: value })
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="60">5 years</SelectItem>
                      <SelectItem value="forever">Keep forever</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How long to keep your historical data
                  </p>
                </div>

                <Separator />

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete
                          your account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Settings
                </CardTitle>
                <CardDescription>
                  Customize date, time, and currency formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={display.language}
                      onValueChange={(value) =>
                        setDisplay({ ...display, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-AU">English (Australia)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={display.timezone}
                      onValueChange={(value) =>
                        setDisplay({ ...display, timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Australia/Sydney">
                          Sydney (AEST/AEDT)
                        </SelectItem>
                        <SelectItem value="Australia/Melbourne">
                          Melbourne (AEST/AEDT)
                        </SelectItem>
                        <SelectItem value="Australia/Brisbane">
                          Brisbane (AEST)
                        </SelectItem>
                        <SelectItem value="Australia/Perth">Perth (AWST)</SelectItem>
                        <SelectItem value="Australia/Adelaide">
                          Adelaide (ACST/ACDT)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select
                      value={display.dateFormat}
                      onValueChange={(value) =>
                        setDisplay({ ...display, dateFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Units</Label>
                    <Select
                      value={display.units}
                      onValueChange={(value) =>
                        setDisplay({ ...display, units: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (tonnes, km)</SelectItem>
                        <SelectItem value="imperial">
                          Imperial (tons, miles)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
