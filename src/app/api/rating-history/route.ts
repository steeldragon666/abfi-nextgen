import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/rating-history
 * Get rating history for an entity
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

    const url = new URL(request.url);
    const entity_type = url.searchParams.get("entity_type");
    const entity_id = url.searchParams.get("entity_id");
    const limit = parseInt(url.searchParams.get("limit") || "100");

    if (!entity_type || !entity_id) {
      return NextResponse.json(
        { error: "entity_type and entity_id are required" },
        { status: 400 }
      );
    }

    const validTypes = ["feedstock", "supplier", "ci_report"];
    if (!validTypes.includes(entity_type)) {
      return NextResponse.json(
        { error: "Invalid entity_type" },
        { status: 400 }
      );
    }

    const { data: history, error } = await supabase
      .from("rating_history")
      .select("*")
      .eq("entity_type", entity_type)
      .eq("entity_id", entity_id)
      .order("calculation_date", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json({ history: history || [] });
  } catch (error) {
    console.error("Error fetching rating history:", error);
    return NextResponse.json(
      { error: "Failed to fetch rating history" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rating-history
 * Manually record a rating (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

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

    const {
      entity_type,
      entity_id,
      abfi_score,
      ci_rating,
      ci_value,
      sustainability_score,
      supply_reliability_score,
      quality_score,
      traceability_score,
      trigger_type = "manual",
      trigger_notes,
    } = body;

    if (!entity_type || !entity_id) {
      return NextResponse.json(
        { error: "entity_type and entity_id are required" },
        { status: 400 }
      );
    }

    const { data: entry, error } = await supabase
      .from("rating_history")
      .insert({
        entity_type,
        entity_id,
        abfi_score,
        ci_rating,
        ci_value,
        sustainability_score,
        supply_reliability_score,
        quality_score,
        traceability_score,
        trigger_type,
        trigger_notes,
        calculated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error creating rating history entry:", error);
    return NextResponse.json(
      { error: "Failed to create rating history entry" },
      { status: 500 }
    );
  }
}
