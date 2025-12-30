/**
 * AppLayout - Main application layout with top navigation and map controls panel
 * New layout structure: TopNav + MapControlsPanel + Main Content
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { MapControlsProvider } from "@/contexts/MapControlsContext";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { MapControlsPanel } from "@/components/layout/MapControlsPanel";
import { useIsMobile } from "@/hooks/useMobile";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userRole = user?.role || 'buyer';
  const isMobile = useIsMobile();

  return (
    <MapControlsProvider userRole={userRole}>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        {/* Skip to main content link for keyboard accessibility */}
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>

        {/* Top Navigation Bar */}
        <TopNavigation />

        {/* Main Content Area with Map Controls Panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Map Controls Panel (left side) - hidden on mobile */}
          {!isMobile && <MapControlsPanel />}

          {/* Main Content */}
          <main
            id="main-content"
            className="flex-1 overflow-auto"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    </MapControlsProvider>
  );
}
