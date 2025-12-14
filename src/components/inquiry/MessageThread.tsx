"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Send,
  DollarSign,
  Package,
  Clock,
  CheckCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  inquiry_id: string;
  sender_id: string;
  message_type: "message" | "system" | "offer" | "counter_offer";
  content: string;
  offered_price?: number;
  offered_volume?: number;
  attachments?: { name: string; url: string }[];
  read_at?: string;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface MessageThreadProps {
  inquiryId: string;
  initialMessage?: string;
  userRole: "buyer" | "supplier";
  inquiryStatus: string;
  onStatusChange?: () => void;
}

export function MessageThread({
  inquiryId,
  initialMessage,
  userRole,
  inquiryStatus,
  onStatusChange,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch(`/api/inquiries/${inquiryId}/messages`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (err) {
        setError("Failed to load messages");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [inquiryId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    setError(null);

    try {
      const response = await fetch(`/api/inquiries/${inquiryId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const message = await response.json();
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      onStatusChange?.();
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || "??";
  };

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case "offer":
        return (
          <Badge className="bg-green-100 text-green-800">
            <DollarSign className="mr-1 h-3 w-3" />
            Offer
          </Badge>
        );
      case "counter_offer":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <DollarSign className="mr-1 h-3 w-3" />
            Counter Offer
          </Badge>
        );
      case "system":
        return (
          <Badge variant="secondary">
            <AlertCircle className="mr-1 h-3 w-3" />
            System
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const canSendMessages =
    inquiryStatus !== "rejected" &&
    inquiryStatus !== "expired" &&
    inquiryStatus !== "accepted";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Communication History
          {messages.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {messages.length} messages
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Initial Inquiry Message */}
        {initialMessage && (
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Initial Inquiry</Badge>
              <span className="text-xs text-muted-foreground">
                From {userRole === "buyer" ? "You" : "Buyer"}
              </span>
            </div>
            <p className="text-sm">{initialMessage}</p>
          </div>
        )}

        {messages.length > 0 && initialMessage && <Separator />}

        {/* Message Thread */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {messages.map((message) => {
            const isOwnMessage =
              (userRole === "buyer" && message.sender_id !== message.inquiry_id) ||
              (userRole === "supplier" && message.sender_id !== message.inquiry_id);
            const isFromCurrentUser = message.sender?.email?.includes(userRole);

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.message_type === "system" ? "justify-center" : ""
                )}
              >
                {message.message_type === "system" ? (
                  <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-muted-foreground">
                    {message.content}
                  </div>
                ) : (
                  <>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {getInitials(
                          message.sender?.full_name,
                          message.sender?.email
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {message.sender?.full_name || message.sender?.email || "Unknown"}
                        </span>
                        {getMessageTypeLabel(message.message_type)}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.created_at), "dd MMM HH:mm")}
                        </span>
                        {message.read_at && (
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        {(message.offered_price || message.offered_volume) && (
                          <div className="mt-2 pt-2 border-t flex gap-4">
                            {message.offered_price && (
                              <div className="flex items-center gap-1 text-sm">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="font-medium">
                                  ${message.offered_price}/t
                                </span>
                              </div>
                            )}
                            {message.offered_volume && (
                              <div className="flex items-center gap-1 text-sm">
                                <Package className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">
                                  {message.offered_volume.toLocaleString()} t
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="text-xs text-muted-foreground mb-1">
                              Attachments:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {message.attachments.map((att, i) => (
                                <a
                                  key={i}
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  {att.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 0 && !initialMessage && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No messages yet</p>
            <p className="text-sm">
              {canSendMessages
                ? "Start the conversation below"
                : "This inquiry is closed"}
            </p>
          </div>
        )}

        {/* New Message Input */}
        {canSendMessages && (
          <>
            <Separator />
            <div className="space-y-3">
              {error && (
                <div className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={3}
                disabled={sending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    handleSend();
                  }
                }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Press Ctrl+Enter to send
                </span>
                <Button onClick={handleSend} disabled={!newMessage.trim() || sending}>
                  {sending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Send Message
                </Button>
              </div>
            </div>
          </>
        )}

        {!canSendMessages && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <Clock className="h-5 w-5 mx-auto mb-1" />
            This inquiry is {inquiryStatus}. Messaging is disabled.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
