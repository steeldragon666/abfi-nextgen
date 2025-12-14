import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/user/notification-preferences
 * Get current user's notification preferences
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get existing preferences or return defaults
    const { data: preferences } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (preferences) {
      return NextResponse.json(preferences);
    }

    // Return default preferences if none exist
    return NextResponse.json({
      user_id: user.id,
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
    });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification preferences" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/notification-preferences
 * Update current user's notification preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Valid fields
    const validFields = [
      "email_enabled",
      "email_inquiry_received",
      "email_inquiry_response",
      "email_verification_updates",
      "email_new_matches",
      "email_price_alerts",
      "email_weekly_digest",
      "inapp_enabled",
      "inapp_inquiry_updates",
      "inapp_system_alerts",
      "inapp_feedstock_updates",
      "digest_frequency",
    ];

    // Filter to only valid fields
    const updateData: Record<string, unknown> = {};
    for (const key of validFields) {
      if (key in body) {
        updateData[key] = body[key];
      }
    }

    updateData.updated_at = new Date().toISOString();

    // Upsert preferences
    const { data, error } = await supabase
      .from("notification_preferences")
      .upsert(
        {
          user_id: user.id,
          ...updateData,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to update notification preferences" },
      { status: 500 }
    );
  }
}
