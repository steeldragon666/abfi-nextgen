import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";

export const metadata = {
  title: "Notification Preferences",
};

export default async function BuyerNotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify user is a buyer
  const { data: buyer } = await supabase
    .from("buyers")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!buyer) {
    redirect("/buyer/settings");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Notification Preferences
        </h1>
        <p className="text-muted-foreground">
          Control how and when you receive notifications from the platform
        </p>
      </div>

      <NotificationPreferences />
    </div>
  );
}
