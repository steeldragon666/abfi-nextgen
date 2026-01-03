import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Button } from "./Button";
import { Badge } from "./badge";
import { ScrollArea } from "./scroll-area";
import { Sparkles, Bug, Wrench, Shield, Zap, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChangelogEntry {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  changes: {
    category: "feature" | "fix" | "improvement" | "security" | "performance";
    description: string;
  }[];
}

const categoryIcons = {
  feature: Sparkles,
  fix: Bug,
  improvement: Wrench,
  security: Shield,
  performance: Zap,
};

const categoryColors = {
  feature: "text-green-600",
  fix: "text-red-600",
  improvement: "text-blue-600",
  security: "text-purple-600",
  performance: "text-amber-600",
};

interface WhatsNewModalProps {
  /** Array of changelog entries to display */
  changelog: ChangelogEntry[];
  /** Number of recent versions to show (default: 2) */
  versionsToShow?: number;
  /** Storage key for tracking if user has seen this version */
  storageKey?: string;
  /** Whether to show the modal on mount if there's new content */
  showOnNew?: boolean;
  /** External control for open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Link to full changelog page */
  changelogUrl?: string;
}

function WhatsNewModal({
  changelog,
  versionsToShow = 2,
  storageKey = "whats-new-seen",
  showOnNew = true,
  open: controlledOpen,
  onOpenChange,
  changelogUrl = "/changelog",
}: WhatsNewModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const latestVersion = changelog[0]?.version;
  const recentChanges = changelog.slice(0, versionsToShow);

  React.useEffect(() => {
    if (showOnNew && !isControlled && latestVersion) {
      const seenVersion = localStorage.getItem(storageKey);
      if (seenVersion !== latestVersion) {
        setInternalOpen(true);
      }
    }
  }, [showOnNew, isControlled, latestVersion, storageKey]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && latestVersion) {
      localStorage.setItem(storageKey, latestVersion);
    }
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  if (recentChanges.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary-600" />
            <DialogTitle>What's New</DialogTitle>
          </div>
          <DialogDescription>
            See the latest updates and improvements to the ABFI Platform.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-6">
            {recentChanges.map((entry) => (
              <div key={entry.version} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      entry.type === "major"
                        ? "default"
                        : entry.type === "minor"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    v{entry.version}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <ul className="space-y-2">
                  {entry.changes.map((change, idx) => {
                    const Icon = categoryIcons[change.category];
                    return (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon
                          className={cn(
                            "h-4 w-4 mt-0.5 shrink-0",
                            categoryColors[change.category]
                          )}
                        />
                        <span className="text-sm">{change.description}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button
            variant="link"
            className="px-0"
            onClick={() => {
              handleOpenChange(false);
              window.location.href = changelogUrl;
            }}
          >
            View full changelog
          </Button>
          <Button onClick={() => handleOpenChange(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { WhatsNewModal };
export type { ChangelogEntry, WhatsNewModalProps };
