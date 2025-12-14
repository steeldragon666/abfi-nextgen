import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/audit-logs
 * Get audit logs (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const action = url.searchParams.get("action");
    const action_category = url.searchParams.get("action_category");
    const entity_type = url.searchParams.get("entity_type");
    const user_id = url.searchParams.get("user_id");
    const start_date = url.searchParams.get("start_date");
    const end_date = url.searchParams.get("end_date");
    const success = url.searchParams.get("success");

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (action) {
      query = query.ilike("action", `%${action}%`);
    }

    if (action_category) {
      query = query.eq("action_category", action_category);
    }

    if (entity_type) {
      query = query.eq("entity_type", entity_type);
    }

    if (user_id) {
      query = query.eq("user_id", user_id);
    }

    if (start_date) {
      query = query.gte("created_at", start_date);
    }

    if (end_date) {
      query = query.lte("created_at", end_date);
    }

    if (success !== null && success !== undefined) {
      query = query.eq("success", success === "true");
    }

    const { data: logs, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      logs: logs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
