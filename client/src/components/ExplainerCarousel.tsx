import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExplainerPanel {
  src: string;
  alt: string;
}

interface ExplainerCarouselProps {
  title: string;
  description?: string;
  panels: ExplainerPanel[];
  className?: string;
}

export function ExplainerCarousel({
  title,
  description,
  panels,
  className = "",
}: ExplainerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? panels.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === panels.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
      {/* Header */}
      <div className="p-6 pb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <h3 className="text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
        {description && (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {description}
          </p>
        )}
      </div>

      {/* Image Display */}
      <div className="relative">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={panels[currentIndex].src}
            alt={panels[currentIndex].alt}
            className="w-full h-full object-contain"
            style={{ background: "var(--bg-primary)" }}
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Panel Counter */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            color: "white"
          }}
        >
          {currentIndex + 1} / {panels.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="p-4 flex gap-2 overflow-x-auto" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        {panels.map((panel, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden transition-all ${
              idx === currentIndex ? "ring-2 ring-offset-2 ring-amber-500" : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={panel.src}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// Pre-configured explainer sets
export const EXPLAINER_SETS = {
  sha256: {
    title: "SHA-256 Evidence Hashing",
    description: "How cryptographic hashing ensures data integrity and tamper detection",
    panels: [
      { src: "/images/explainers/sha256/panel_1_the_problem.png", alt: "The Problem: Data Trust" },
      { src: "/images/explainers/sha256/panel_2_hashing_fingerprint.png", alt: "Hashing Creates a Fingerprint" },
      { src: "/images/explainers/sha256/panel_3_tamper_evidence.png", alt: "Tamper Evidence" },
      { src: "/images/explainers/sha256/panel_4_verification_workflow.png", alt: "Verification Workflow" },
      { src: "/images/explainers/sha256/panel_5_audit_trail.png", alt: "Audit Trail" },
      { src: "/images/explainers/sha256/panel_6_lender_ready_evidence.png", alt: "Lender-Ready Evidence" },
    ],
  },
  weather: {
    title: "Weather Intelligence",
    description: "Real-time weather monitoring and its impact on feedstock supply",
    panels: [
      { src: "/images/explainers/weather/panel_1_weather_disrupts_supply.png", alt: "Weather Disrupts Supply" },
      { src: "/images/explainers/weather/panel_2_data_integration.png", alt: "Data Integration" },
      { src: "/images/explainers/weather/panel_3_crop_sensitivity_windows.png", alt: "Crop Sensitivity Windows" },
      { src: "/images/explainers/weather/panel_4_confidence_scored_outputs.png", alt: "Confidence Scored Outputs" },
      { src: "/images/explainers/weather/panel_5_smart_alerts.png", alt: "Smart Alerts" },
      { src: "/images/explainers/weather/panel_6_portfolio_protection.png", alt: "Portfolio Protection" },
    ],
  },
  supplyShock: {
    title: "Supply Shock Detection",
    description: "Proactive monitoring and early warning for supply chain disruptions",
    panels: [
      { src: "/images/explainers/supply-shock/panel_1_threat_vectors.png", alt: "Threat Vectors" },
      { src: "/images/explainers/supply-shock/panel_2_continuous_monitoring.png", alt: "Continuous Monitoring" },
      { src: "/images/explainers/supply-shock/panel_3_deterministic_detection.png", alt: "Deterministic Detection" },
      { src: "/images/explainers/supply-shock/panel_4_impact_assessment.png", alt: "Impact Assessment" },
      { src: "/images/explainers/supply-shock/panel_5_alternative_matching.png", alt: "Alternative Matching" },
      { src: "/images/explainers/supply-shock/panel_6_proactive_notification.png", alt: "Proactive Notification" },
    ],
  },
  futuresMarketplace: {
    title: "Futures Marketplace",
    description: "Long-term feedstock contracting for perennial crops like bamboo",
    panels: [
      { src: "/images/explainers/futures-marketplace/panel_1_perennial_crop_projections.png", alt: "Perennial Crop Projections" },
      { src: "/images/explainers/futures-marketplace/panel_2_supplier_creates_listing.png", alt: "Supplier Creates Listing" },
      { src: "/images/explainers/futures-marketplace/panel_3_marketplace_browse.png", alt: "Marketplace Browse" },
      { src: "/images/explainers/futures-marketplace/panel_4_expression_of_interest.png", alt: "Expression of Interest" },
      { src: "/images/explainers/futures-marketplace/panel_5_negotiation_contract.png", alt: "Negotiation & Contract" },
      { src: "/images/explainers/futures-marketplace/panel_6_long_term_partnership.png", alt: "Long-Term Partnership" },
    ],
  },
  rsieArchitecture: {
    title: "RSIE Data Architecture",
    description: "Real-time Supply Intelligence Engine powering risk analytics",
    panels: [
      { src: "/images/explainers/rsie-architecture/panel1_data_sources.png", alt: "Data Sources" },
      { src: "/images/explainers/rsie-architecture/panel2_provenance_tracking.png", alt: "Provenance Tracking" },
      { src: "/images/explainers/rsie-architecture/panel3_risk_event_detection.png", alt: "Risk Event Detection" },
      { src: "/images/explainers/rsie-architecture/panel4_exposure_calculation.png", alt: "Exposure Calculation" },
      { src: "/images/explainers/rsie-architecture/panel5_contract_impact.png", alt: "Contract Impact" },
      { src: "/images/explainers/rsie-architecture/panel6_intelligence_feed.png", alt: "Intelligence Feed" },
    ],
  },
};

export default ExplainerCarousel;
