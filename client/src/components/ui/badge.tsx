import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        info: "border-transparent bg-info text-info-foreground",
        // Rating tiers (A+ through F)
        "rating-a-plus":
          "border-rating-a-plus/30 bg-rating-a-plus/10 text-rating-a-plus font-semibold",
        "rating-a":
          "border-rating-a/30 bg-rating-a/10 text-rating-a font-semibold",
        "rating-b-plus":
          "border-rating-b-plus/30 bg-rating-b-plus/10 text-rating-b-plus font-semibold",
        "rating-b":
          "border-rating-b/30 bg-rating-b/10 text-rating-b font-semibold",
        "rating-c-plus":
          "border-rating-c-plus/30 bg-rating-c-plus/10 text-rating-c-plus font-semibold",
        "rating-c":
          "border-rating-c/30 bg-rating-c/10 text-rating-c font-semibold",
        "rating-d":
          "border-rating-d/30 bg-rating-d/10 text-rating-d font-semibold",
        "rating-f":
          "border-rating-f/30 bg-rating-f/10 text-rating-f font-semibold",
        // Status variants
        draft: "border-muted bg-muted/50 text-muted-foreground",
        pending: "border-warning/30 bg-warning/10 text-warning",
        verified: "border-success/30 bg-success/10 text-success",
        rejected: "border-destructive/30 bg-destructive/10 text-destructive",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

/**
 * StatusBadge - For workflow/document statuses
 */
type StatusType =
  | "draft"
  | "pending"
  | "verified"
  | "rejected"
  | "active"
  | "expired";

const statusConfig: Record<
  StatusType,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }
> = {
  draft: { label: "Draft", variant: "draft" },
  pending: { label: "Pending Review", variant: "pending" },
  verified: { label: "Verified", variant: "verified" },
  rejected: { label: "Rejected", variant: "rejected" },
  active: { label: "Active", variant: "success" },
  expired: { label: "Expired", variant: "destructive" },
};

function StatusBadge({
  status,
  className,
  ...props
}: { status: StatusType } & Omit<React.ComponentProps<"span">, "children">) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.label}
    </Badge>
  );
}

/**
 * RatingBadge - For ABFI score ratings
 */
type RatingTier = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";

const ratingVariantMap: Record<
  RatingTier,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  "A+": "rating-a-plus",
  A: "rating-a",
  "B+": "rating-b-plus",
  B: "rating-b",
  "C+": "rating-c-plus",
  C: "rating-c",
  D: "rating-d",
  F: "rating-f",
};

function RatingBadge({
  rating,
  score,
  className,
  ...props
}: { rating: RatingTier; score?: number } & Omit<
  React.ComponentProps<"span">,
  "children"
>) {
  const variant = ratingVariantMap[rating];
  return (
    <Badge variant={variant} className={cn("font-mono", className)} {...props}>
      {rating}
      {score !== undefined && <span className="opacity-75">({score})</span>}
    </Badge>
  );
}

export { Badge, badgeVariants, StatusBadge, RatingBadge };
