import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/announcements
 * Get all announcements (admin only)
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
    const status = url.searchParams.get("status");

    let query = supabase
      .from("announcements")
      .select("*, creator:profiles!created_by(full_name, email)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: announcements, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ announcements: announcements || [] });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/announcements
 * Create a new announcement
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
      title,
      content,
      summary,
      target_audience = "all",
      announcement_type = "info",
      priority = "normal",
      show_banner = false,
      banner_color,
      status = "draft",
      expires_at,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const announcementData: Record<string, unknown> = {
      title,
      content,
      summary: summary || null,
      target_audience,
      announcement_type,
      priority,
      show_banner,
      banner_color: banner_color || null,
      status,
      expires_at: expires_at || null,
      created_by: user.id,
    };

    // If publishing immediately, set published_at
    if (status === "published") {
      announcementData.published_at = new Date().toISOString();
    }

    const { data: announcement, error } = await supabase
      .from("announcements")
      .insert(announcementData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}
