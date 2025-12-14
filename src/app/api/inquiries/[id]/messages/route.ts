import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/inquiries/[id]/messages - Get all messages for an inquiry
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user has access to this inquiry
    const { data: buyer } = await supabase
      .from("buyers")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    const { data: supplier } = await supabase
      .from("suppliers")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    const { data: inquiry } = await supabase
      .from("inquiries")
      .select("id, buyer_id, supplier_id")
      .eq("id", id)
      .single();

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const isBuyer = buyer?.id === inquiry.buyer_id;
    const isSupplier = supplier?.id === inquiry.supplier_id;

    if (!isBuyer && !isSupplier) {
      return NextResponse.json(
        { error: "Not authorized to view these messages" },
        { status: 403 }
      );
    }

    // Get messages with sender info
    const { data: messages, error } = await supabase
      .from("inquiry_messages")
      .select(
        `
        *,
        sender:profiles!sender_id(
          id,
          full_name,
          email
        )
      `
      )
      .eq("inquiry_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    // Mark unread messages as read for this user
    const unreadIds = messages
      ?.filter((m) => m.sender_id !== user.id && !m.read_at)
      .map((m) => m.id);

    if (unreadIds && unreadIds.length > 0) {
      await supabase
        .from("inquiry_messages")
        .update({ read_at: new Date().toISOString() })
        .in("id", unreadIds);
    }

    return NextResponse.json({
      messages: messages || [],
      userRole: isBuyer ? "buyer" : "supplier",
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inquiries/[id]/messages - Send a new message
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const {
      content,
      message_type = "message",
      offered_price,
      offered_volume,
      attachments,
    } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user has access to this inquiry
    const { data: buyer } = await supabase
      .from("buyers")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    const { data: supplier } = await supabase
      .from("suppliers")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    const { data: inquiry } = await supabase
      .from("inquiries")
      .select("id, buyer_id, supplier_id, status")
      .eq("id", id)
      .single();

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const isBuyer = buyer?.id === inquiry.buyer_id;
    const isSupplier = supplier?.id === inquiry.supplier_id;

    if (!isBuyer && !isSupplier) {
      return NextResponse.json(
        { error: "Not authorized to send messages on this inquiry" },
        { status: 403 }
      );
    }

    // Create message
    const messageData: Record<string, unknown> = {
      inquiry_id: id,
      sender_id: user.id,
      content,
      message_type,
    };

    if (message_type === "offer" || message_type === "counter_offer") {
      if (offered_price) messageData.offered_price = offered_price;
      if (offered_volume) messageData.offered_volume = offered_volume;
    }

    if (attachments && Array.isArray(attachments)) {
      messageData.attachments = attachments;
    }

    const { data: message, error } = await supabase
      .from("inquiry_messages")
      .insert(messageData)
      .select(
        `
        *,
        sender:profiles!sender_id(
          id,
          full_name,
          email
        )
      `
      )
      .single();

    if (error) {
      throw error;
    }

    // Update inquiry status to negotiating if it was just responded
    if (inquiry.status === "responded" || inquiry.status === "pending") {
      const newStatus = inquiry.status === "pending" && isSupplier ? "responded" : "negotiating";
      await supabase
        .from("inquiries")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(newStatus === "responded" && { responded_at: new Date().toISOString() }),
        })
        .eq("id", id);
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
