import { useState, useEffect } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { usePortal } from "@/contexts/PortalContext";

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const { getFilteredQuickActions, portalConfig } = usePortal();
  const quickActions = getFilteredQuickActions();

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Show on scroll up, hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (quickActions.length === 0) return null;

  return (
    <nav
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-40",
        "lg:hidden", // Only show on mobile/tablet
        "transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none",
        className
      )}
      aria-label="Quick actions"
    >
      <div
        className={cn(
          "flex items-center gap-1 p-1.5 rounded-full",
          "bg-white dark:bg-gray-900 border shadow-lg" // Solid background for legibility
        )}
      >
        {quickActions.slice(0, 3).map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              href={action.href}
              className={cn(
                "flex flex-col items-center justify-center",
                "min-h-[56px] min-w-[64px] px-3 py-2", // Larger touch targets
                "rounded-full transition-colors",
                "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                portalConfig.bgColor
              )}
              aria-label={action.label}
            >
              <Icon
                className={cn("h-5 w-5 mb-0.5", portalConfig.color)}
                aria-hidden="true"
              />
              <span className="text-[10px] font-medium text-muted-foreground">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
