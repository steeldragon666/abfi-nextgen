import { cn } from "@/lib/utils";
import { AlertTriangle, Info, Shield } from "lucide-react";

interface LegalDisclaimerProps {
  variant?: "certificate" | "report" | "assessment" | "general";
  snapshotDate?: Date | string;
  className?: string;
  compact?: boolean;
}

const DISCLAIMERS = {
  certificate: {
    title: "Certificate Disclaimer",
    icon: Shield,
    content: [
      "ABFI scores and ratings represent assessments based on evidence provided as of the snapshot date indicated.",
      "This certificate does not constitute financial advice, investment recommendation, or guarantee of supply performance.",
      "Reliance on this certificate is subject to ABFI Platform Terms of Service.",
      "Past performance and current assessments do not guarantee future results.",
      "Users should conduct their own due diligence and seek independent professional advice.",
    ],
  },
  report: {
    title: "Report Disclaimer",
    icon: Info,
    content: [
      "This report is provided for informational purposes only.",
      "The data and analysis contained herein are based on information available at the time of preparation.",
      "ABFI makes no representations or warranties regarding the accuracy, completeness, or reliability of this information.",
      "This report should not be relied upon as the sole basis for any decision.",
      "Recipients should verify all information independently.",
    ],
  },
  assessment: {
    title: "Assessment Disclaimer",
    icon: AlertTriangle,
    content: [
      "Bankability assessments are point-in-time evaluations based on available evidence.",
      "Assessment scores may change as new information becomes available or market conditions evolve.",
      "This assessment does not guarantee project viability, financing approval, or supply security.",
      "Lenders and investors should conduct independent due diligence.",
      "ABFI is not liable for decisions made based on assessment results.",
    ],
  },
  general: {
    title: "Legal Notice",
    icon: Info,
    content: [
      "Information provided on this platform is for general informational purposes only.",
      "ABFI does not provide financial, legal, or investment advice.",
      "Use of this platform is subject to our Terms of Service and Privacy Policy.",
      "Users are responsible for their own compliance with applicable laws and regulations.",
    ],
  },
};

export function LegalDisclaimer({
  variant = "general",
  snapshotDate,
  className,
  compact = false,
}: LegalDisclaimerProps) {
  const disclaimer = DISCLAIMERS[variant];
  const Icon = disclaimer.icon;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (compact) {
    return (
      <div
        className={cn(
          "text-xs text-muted-foreground border-t pt-4 mt-6",
          className
        )}
      >
        <p className="flex items-center gap-1 mb-1">
          <Icon className="h-3 w-3" />
          <span className="font-medium">{disclaimer.title}</span>
        </p>
        <p>
          {disclaimer.content[0]}{" "}
          {snapshotDate && (
            <span className="font-medium">
              Snapshot date: {formatDate(snapshotDate)}.
            </span>
          )}{" "}
          See full Terms of Service for details.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-slate-50 dark:bg-slate-900/50 border rounded-lg p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h4 className="font-semibold text-sm">{disclaimer.title}</h4>
      </div>

      {snapshotDate && (
        <p className="text-sm text-muted-foreground mb-3">
          <span className="font-medium">Assessment Date:</span>{" "}
          {formatDate(snapshotDate)}
        </p>
      )}

      <ul className="space-y-2">
        {disclaimer.content.map((item, index) => (
          <li key={index} className="text-xs text-muted-foreground flex gap-2">
            <span className="text-muted-foreground/50">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t text-xs text-muted-foreground/70">
        <p>
          For full legal terms, please refer to the{" "}
          <a href="/terms" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export function EvidenceProvenance({
  issuerName,
  issuerCredentials,
  issueDate,
  expiryDate,
  verificationMethod,
  lastVerificationDate,
  className,
}: {
  issuerName: string;
  issuerCredentials?: string;
  issueDate: Date | string;
  expiryDate?: Date | string;
  verificationMethod: "self_declared" | "third_party" | "audited" | "abfi_certified";
  lastVerificationDate?: Date | string;
  className?: string;
}) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getVerificationLabel = (method: string) => {
    switch (method) {
      case "self_declared":
        return { label: "Self-Declared", color: "text-amber-600 bg-amber-50" };
      case "third_party":
        return { label: "Third-Party Verified", color: "text-blue-600 bg-blue-50" };
      case "audited":
        return { label: "Independently Audited", color: "text-purple-600 bg-purple-50" };
      case "abfi_certified":
        return { label: "ABFI Certified", color: "text-emerald-600 bg-emerald-50" };
      default:
        return { label: "Unknown", color: "text-gray-600 bg-gray-50" };
    }
  };

  const verification = getVerificationLabel(verificationMethod);

  return (
    <div
      className={cn(
        "bg-white border rounded-lg p-4 shadow-sm",
        className
      )}
    >
      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        Evidence Provenance
      </h4>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Issuer</p>
          <p className="font-medium">{issuerName}</p>
          {issuerCredentials && (
            <p className="text-xs text-muted-foreground">{issuerCredentials}</p>
          )}
        </div>

        <div>
          <p className="text-muted-foreground text-xs">Verification</p>
          <span
            className={cn(
              "inline-block px-2 py-0.5 rounded text-xs font-medium",
              verification.color
            )}
          >
            {verification.label}
          </span>
        </div>

        <div>
          <p className="text-muted-foreground text-xs">Issue Date</p>
          <p className="font-mono text-xs">{formatDate(issueDate)}</p>
        </div>

        {expiryDate && (
          <div>
            <p className="text-muted-foreground text-xs">Expiry Date</p>
            <p className="font-mono text-xs">{formatDate(expiryDate)}</p>
          </div>
        )}

        {lastVerificationDate && (
          <div className="col-span-2">
            <p className="text-muted-foreground text-xs">Last Verified</p>
            <p className="font-mono text-xs">{formatDate(lastVerificationDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function DataRetentionNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "text-xs text-muted-foreground bg-muted/30 rounded p-3",
        className
      )}
    >
      <p className="font-medium mb-1">Data Retention Policy</p>
      <ul className="space-y-1 text-muted-foreground/80">
        <li>• Transaction records: Retained for 7 years</li>
        <li>• Audit logs: Retained for 10 years</li>
        <li>• User data: Retained while account is active + 2 years</li>
        <li>• Evidence files: Retained for certificate validity + 5 years</li>
      </ul>
      <p className="mt-2">
        For data deletion requests, contact{" "}
        <a href="mailto:privacy@abfi.io" className="underline">
          privacy@abfi.io
        </a>
      </p>
    </div>
  );
}
