import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuditLogViewer } from "./client";

export const metadata = {
  title: "Audit Logs",
};

export default async function AuditLogsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          View and search system activity and user actions
        </p>
      </div>

      <AuditLogViewer />
    </div>
  );
}
