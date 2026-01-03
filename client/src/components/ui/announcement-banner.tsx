import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Megaphone, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

const announcementVariants = cva(
  "relative w-full px-4 py-3 text-sm flex items-center justify-between gap-4",
  {
    variants: {
      variant: {
        default: "bg-primary-50 text-primary-900 border-b border-primary-200",
        info: "bg-blue-50 text-blue-900 border-b border-blue-200",
        success: "bg-green-50 text-green-900 border-b border-green-200",
        warning: "bg-amber-50 text-amber-900 border-b border-amber-200",
        critical: "bg-red-50 text-red-900 border-b border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconMap = {
  default: Megaphone,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  critical: AlertTriangle,
};

export interface AnnouncementBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof announcementVariants> {
  /** The announcement message */
  message: string;
  /** Optional link URL */
  linkUrl?: string;
  /** Optional link text */
  linkText?: string;
  /** Whether the banner can be dismissed */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Optional icon override */
  icon?: React.ReactNode;
  /** Storage key for persisting dismissal (uses localStorage) */
  storageKey?: string;
}

function AnnouncementBanner({
  className,
  variant = "default",
  message,
  linkUrl,
  linkText = "Learn more",
  dismissible = true,
  onDismiss,
  icon,
  storageKey,
  ...props
}: AnnouncementBannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(() => {
    if (storageKey && typeof window !== "undefined") {
      return localStorage.getItem(`announcement-${storageKey}`) === "dismissed";
    }
    return false;
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    if (storageKey) {
      localStorage.setItem(`announcement-${storageKey}`, "dismissed");
    }
    onDismiss?.();
  };

  if (isDismissed) return null;

  const IconComponent = iconMap[variant || "default"];

  return (
    <div
      role="banner"
      aria-live="polite"
      className={cn(announcementVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon || <IconComponent className="h-4 w-4 shrink-0" />}
        <p className="text-sm font-medium truncate">{message}</p>
        {linkUrl && (
          <a
            href={linkUrl}
            className="text-sm font-semibold underline underline-offset-2 hover:no-underline shrink-0"
          >
            {linkText}
          </a>
        )}
      </div>
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 hover:bg-black/10"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export { AnnouncementBanner, announcementVariants };
