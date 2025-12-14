"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Mail,
  Smartphone,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationPrefs {
  email_enabled: boolean;
  email_inquiry_received: boolean;
  email_inquiry_response: boolean;
  email_verification_updates: boolean;
  email_new_matches: boolean;
  email_price_alerts: boolean;
  email_weekly_digest: boolean;
  inapp_enabled: boolean;
  inapp_inquiry_updates: boolean;
  inapp_system_alerts: boolean;
  inapp_feedstock_updates: boolean;
  digest_frequency: "instant" | "daily" | "weekly" | "never";
}

const defaultPrefs: NotificationPrefs = {
  email_enabled: true,
  email_inquiry_received: true,
  email_inquiry_response: true,
  email_verification_updates: true,
  email_new_matches: true,
  email_price_alerts: true,
  email_weekly_digest: false,
  inapp_enabled: true,
  inapp_inquiry_updates: true,
  inapp_system_alerts: true,
  inapp_feedstock_updates: true,
  digest_frequency: "instant",
};

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialPrefs, setInitialPrefs] = useState<NotificationPrefs>(defaultPrefs);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const response = await fetch("/api/user/notification-preferences");
        if (response.ok) {
          const data = await response.json();
          setPrefs(data);
          setInitialPrefs(data);
        }
      } catch (err) {
        console.error("Failed to fetch preferences:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPreferences();
  }, []);

  const handleToggle = (key: keyof NotificationPrefs) => {
    setPrefs((prev) => {
      const newPrefs = { ...prev, [key]: !prev[key] };
      setHasChanges(JSON.stringify(newPrefs) !== JSON.stringify(initialPrefs));
      return newPrefs;
    });
    setSaved(false);
  };

  const handleFrequencyChange = (value: NotificationPrefs["digest_frequency"]) => {
    setPrefs((prev) => {
      const newPrefs = { ...prev, digest_frequency: value };
      setHasChanges(JSON.stringify(newPrefs) !== JSON.stringify(initialPrefs));
      return newPrefs;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/user/notification-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      if (!response.ok) throw new Error("Failed to save preferences");

      const data = await response.json();
      setPrefs(data);
      setInitialPrefs(data);
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("Failed to save preferences. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Control which emails you receive from the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_enabled" className="text-base">
                Enable Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Master toggle for all email notifications
              </p>
            </div>
            <Switch
              id="email_enabled"
              checked={prefs.email_enabled}
              onCheckedChange={() => handleToggle("email_enabled")}
            />
          </div>

          <Separator />

          <div
            className={cn(
              "space-y-4 transition-opacity",
              !prefs.email_enabled && "opacity-50 pointer-events-none"
            )}
          >
            <PreferenceToggle
              id="email_inquiry_received"
              label="Inquiry Received"
              description="Get notified when you receive new inquiries"
              checked={prefs.email_inquiry_received}
              onToggle={() => handleToggle("email_inquiry_received")}
            />

            <PreferenceToggle
              id="email_inquiry_response"
              label="Inquiry Response"
              description="Get notified when suppliers respond to your inquiries"
              checked={prefs.email_inquiry_response}
              onToggle={() => handleToggle("email_inquiry_response")}
            />

            <PreferenceToggle
              id="email_verification_updates"
              label="Verification Updates"
              description="Status updates about your verification requests"
              checked={prefs.email_verification_updates}
              onToggle={() => handleToggle("email_verification_updates")}
            />

            <PreferenceToggle
              id="email_new_matches"
              label="New Matches"
              description="New feedstocks matching your saved preferences"
              checked={prefs.email_new_matches}
              onToggle={() => handleToggle("email_new_matches")}
            />

            <PreferenceToggle
              id="email_price_alerts"
              label="Price Alerts"
              description="Alerts when prices change for watched feedstocks"
              checked={prefs.email_price_alerts}
              onToggle={() => handleToggle("email_price_alerts")}
            />

            <PreferenceToggle
              id="email_weekly_digest"
              label="Weekly Digest"
              description="Weekly summary of platform activity"
              checked={prefs.email_weekly_digest}
              onToggle={() => handleToggle("email_weekly_digest")}
            />
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
          <CardDescription>
            Control notifications you see within the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="inapp_enabled" className="text-base">
                Enable In-App Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Master toggle for all in-app notifications
              </p>
            </div>
            <Switch
              id="inapp_enabled"
              checked={prefs.inapp_enabled}
              onCheckedChange={() => handleToggle("inapp_enabled")}
            />
          </div>

          <Separator />

          <div
            className={cn(
              "space-y-4 transition-opacity",
              !prefs.inapp_enabled && "opacity-50 pointer-events-none"
            )}
          >
            <PreferenceToggle
              id="inapp_inquiry_updates"
              label="Inquiry Updates"
              description="Real-time updates on inquiry status changes"
              checked={prefs.inapp_inquiry_updates}
              onToggle={() => handleToggle("inapp_inquiry_updates")}
            />

            <PreferenceToggle
              id="inapp_system_alerts"
              label="System Alerts"
              description="Important system notifications and announcements"
              checked={prefs.inapp_system_alerts}
              onToggle={() => handleToggle("inapp_system_alerts")}
            />

            <PreferenceToggle
              id="inapp_feedstock_updates"
              label="Feedstock Updates"
              description="Updates on feedstocks you're watching"
              checked={prefs.inapp_feedstock_updates}
              onToggle={() => handleToggle("inapp_feedstock_updates")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Frequency
          </CardTitle>
          <CardDescription>
            Choose how often you want to receive notification digests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="digest_frequency">Digest Frequency</Label>
              <Select
                value={prefs.digest_frequency}
                onValueChange={(v) =>
                  handleFrequencyChange(v as NotificationPrefs["digest_frequency"])
                }
              >
                <SelectTrigger id="digest_frequency" className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {prefs.digest_frequency === "instant" &&
                  "Receive notifications as they happen"}
                {prefs.digest_frequency === "daily" &&
                  "Receive a daily summary of all notifications"}
                {prefs.digest_frequency === "weekly" &&
                  "Receive a weekly summary of all notifications"}
                {prefs.digest_frequency === "never" &&
                  "Only receive critical system alerts"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              Preferences saved
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
        <Button onClick={handleSave} disabled={saving || !hasChanges}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  );
}

interface PreferenceToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

function PreferenceToggle({
  id,
  label,
  description,
  checked,
  onToggle,
}: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}
