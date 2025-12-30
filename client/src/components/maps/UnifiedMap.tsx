/**
 * UnifiedMap - Consolidated map component with role-based layers
 * Replaces: MapView, FeedstockMap, MarketIntelligence, AustralianDataExplorer
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { MapView as GoogleMapView } from '@/components/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import {
  Layers,
  Filter,
  MapPin,
  Leaf,
  Factory,
  TrendingUp,
  Truck,
  Zap,
  Satellite,
  Globe,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  RefreshCw,
  Maximize2,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { SatelliteDataPanel } from './SatelliteDataPanel';
import {
  AUSTRALIAN_STATES,
  FEEDSTOCK_CATEGORIES,
  formatPrice,
} from '@/const';

// Layer configuration with role visibility
interface MapLayer {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  roles: string[];
  enabled: boolean;
}

const DEFAULT_LAYERS: MapLayer[] = [
  {
    id: 'feedstocks',
    label: 'Feedstock Supply',
    icon: Leaf,
    color: '#22c55e',
    roles: ['buyer', 'admin', 'auditor', 'lender'],
    enabled: true,
  },
  {
    id: 'demand',
    label: 'Demand Signals',
    icon: TrendingUp,
    color: '#f97316',
    roles: ['grower', 'supplier', 'admin', 'auditor'],
    enabled: true,
  },
  {
    id: 'roadmapView',
    label: 'Roadmap',
    icon: MapPin,
    color: '#64748b',
    roles: ['buyer', 'supplier', 'grower', 'admin', 'auditor', 'lender'],
    enabled: true,
  },
  {
    id: 'satelliteImagery',
    label: 'Satellite Imagery',
    icon: Globe,
    color: '#0ea5e9',
    roles: ['buyer', 'supplier', 'grower', 'admin', 'auditor', 'lender'],
    enabled: false,
  },
  {
    id: 'hybridView',
    label: 'Hybrid View',
    icon: Layers,
    color: '#6366f1',
    roles: ['buyer', 'supplier', 'grower', 'admin', 'auditor', 'lender'],
    enabled: false,
  },
  {
    id: 'terrainView',
    label: 'Terrain View',
    icon: TrendingUp,
    color: '#84cc16',
    roles: ['buyer', 'supplier', 'grower', 'admin', 'auditor', 'lender'],
    enabled: false,
  },
  {
    id: 'satellite',
    label: 'Satellite Data',
    icon: Satellite,
    color: '#06b6d4',
    roles: ['buyer', 'supplier', 'grower', 'admin', 'auditor', 'lender'],
    enabled: false,
  },
  {
    id: 'projects',
    label: 'My Projects',
    icon: Factory,
    color: '#3b82f6',
    roles: ['grower', 'supplier'],
    enabled: true,
  },
  {
    id: 'logistics',
    label: 'Logistics Hubs',
    icon: Truck,
    color: '#8b5cf6',
    roles: ['buyer', 'supplier', 'admin'],
    enabled: false,
  },
  {
    id: 'powerStations',
    label: 'Power Stations',
    icon: Zap,
    color: '#eab308',
    roles: ['buyer', 'lender', 'admin'],
    enabled: false,
  },
];

// Australia center coordinates
const AUSTRALIA_CENTER = { lat: -25.2744, lng: 133.7751 };
const DEFAULT_ZOOM = 4;

interface UnifiedMapProps {
  className?: string;
  onEntitySelect?: (entity: any) => void;
  initialFilters?: {
    categories?: string[];
    states?: string[];
  };
}

export function UnifiedMap({
  className,
  onEntitySelect,
  initialFilters,
}: UnifiedMapProps) {
  const { user } = useAuth();
  const userRole = user?.role || 'buyer';

  // Map references
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // UI state
  const [layers, setLayers] = useState<MapLayer[]>(() =>
    DEFAULT_LAYERS.filter((layer) => layer.roles.includes(userRole))
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [satelliteCoords, setSatelliteCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Check if satellite layer is enabled
  const isSatelliteLayerEnabled = layers.find((l) => l.id === 'satellite')?.enabled ?? false;
  const isRoadmapViewEnabled = layers.find((l) => l.id === 'roadmapView')?.enabled ?? false;
  const isSatelliteImageryEnabled = layers.find((l) => l.id === 'satelliteImagery')?.enabled ?? false;
  const isHybridViewEnabled = layers.find((l) => l.id === 'hybridView')?.enabled ?? false;
  const isTerrainViewEnabled = layers.find((l) => l.id === 'terrainView')?.enabled ?? false;

  // Toggle map type based on enabled view layer
  useEffect(() => {
    if (mapRef.current) {
      const mapType = isHybridViewEnabled
        ? 'hybrid'
        : isSatelliteImageryEnabled
          ? 'satellite'
          : isTerrainViewEnabled
            ? 'terrain'
            : 'roadmap';
      mapRef.current.setMapTypeId(mapType);
    }
  }, [isRoadmapViewEnabled, isSatelliteImageryEnabled, isHybridViewEnabled, isTerrainViewEnabled]);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories || []
  );
  const [selectedStates, setSelectedStates] = useState<string[]>(
    initialFilters?.states || []
  );
  const [minScore, setMinScore] = useState<number>(0);
  const [maxCarbonIntensity, setMaxCarbonIntensity] = useState<number>(100);

  // Data queries
  const { data: feedstocks, isLoading: feedstocksLoading } =
    trpc.feedstocks.search.useQuery(
      {
        category:
          selectedCategories.length > 0 ? selectedCategories : undefined,
        state: selectedStates.length > 0 ? selectedStates : undefined,
        minAbfiScore: minScore > 0 ? minScore : undefined,
        maxCarbonIntensity: maxCarbonIntensity < 100 ? maxCarbonIntensity : undefined,
        limit: 500,
      },
      {
        enabled: layers.some((l) => l.id === 'feedstocks' && l.enabled),
      }
    );

  const { data: demandSignals, isLoading: demandLoading } =
    trpc.demandSignals.list.useQuery(
      { status: 'published' },
      {
        enabled: layers.some((l) => l.id === 'demand' && l.enabled),
      }
    );

  // Map view layers are mutually exclusive
  const MAP_VIEW_LAYERS = ['roadmapView', 'satelliteImagery', 'hybridView', 'terrainView'];

  // Toggle layer visibility
  const toggleLayer = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id === layerId) {
          return { ...layer, enabled: !layer.enabled };
        }
        // If toggling on a map view layer, disable other map view layers
        if (MAP_VIEW_LAYERS.includes(layerId) && MAP_VIEW_LAYERS.includes(layer.id)) {
          return { ...layer, enabled: false };
        }
        return layer;
      })
    );
  }, []);

  // Map initialization
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();

    // Add click listener for satellite data
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSatelliteCoords({ lat, lng });
      }
    });
  }, []);

  // Marker color based on score
  const getMarkerColor = (score: number | null, type: string): string => {
    if (type === 'demand') return '#f97316';
    if (type === 'project') return '#3b82f6';
    if (!score) return '#9ca3af';
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    return '#ef4444';
  };

  // Update markers when data or layers change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    let hasMarkers = false;

    // Add feedstock markers
    if (
      layers.find((l) => l.id === 'feedstocks')?.enabled &&
      feedstocks?.length
    ) {
      feedstocks.forEach((feedstock) => {
        if (feedstock.latitude && feedstock.longitude) {
          const position = {
            lat: parseFloat(feedstock.latitude),
            lng: parseFloat(feedstock.longitude),
          };

          const marker = new google.maps.Marker({
            position,
            map: mapRef.current!,
            title: feedstock.type,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: getMarkerColor(feedstock.abfiScore, 'feedstock'),
              fillOpacity: 0.85,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });

          marker.addListener('click', () => {
            const entity = {
              ...feedstock,
              type: 'feedstock',
              name: feedstock.type,
              location: feedstock.state,
            };
            setSelectedEntity(entity);
            onEntitySelect?.(entity);

            // Set satellite coordinates for this feedstock location
            setSatelliteCoords(position);

            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(
                createInfoWindowContent(entity)
              );
              infoWindowRef.current.open(mapRef.current!, marker);
            }
          });

          markersRef.current.push(marker);
          bounds.extend(position);
          hasMarkers = true;
        }
      });
    }

    // Add demand signal markers
    if (
      layers.find((l) => l.id === 'demand')?.enabled &&
      demandSignals?.length
    ) {
      demandSignals.forEach((signal: any) => {
        if (signal.latitude && signal.longitude) {
          const position = {
            lat: parseFloat(signal.latitude),
            lng: parseFloat(signal.longitude),
          };

          const marker = new google.maps.Marker({
            position,
            map: mapRef.current!,
            title: signal.title || 'Demand Signal',
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 8,
              fillColor: '#f97316',
              fillOpacity: 0.85,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              rotation: 180,
            },
          });

          marker.addListener('click', () => {
            const entity = {
              ...signal,
              type: 'demand',
              name: signal.title,
            };
            setSelectedEntity(entity);
            onEntitySelect?.(entity);

            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(
                createInfoWindowContent(entity)
              );
              infoWindowRef.current.open(mapRef.current!, marker);
            }
          });

          markersRef.current.push(marker);
          bounds.extend(position);
          hasMarkers = true;
        }
      });
    }

    // Fit bounds if we have markers
    if (hasMarkers && mapRef.current) {
      mapRef.current.fitBounds(bounds);
      // Don't zoom in too far
      const listener = google.maps.event.addListener(
        mapRef.current,
        'idle',
        () => {
          if (mapRef.current!.getZoom()! > 12) {
            mapRef.current!.setZoom(12);
          }
          google.maps.event.removeListener(listener);
        }
      );
    }
  }, [feedstocks, demandSignals, layers, onEntitySelect]);

  // Create info window content
  const createInfoWindowContent = (entity: any): string => {
    if (entity.type === 'feedstock') {
      return `
        <div style="padding: 12px; max-width: 280px; font-family: system-ui, sans-serif;">
          <h3 style="font-weight: 600; margin-bottom: 4px; color: #111;">${entity.name}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 12px;">${entity.abfiId || ''}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
            <div>
              <span style="color: #666;">Score</span>
              <div style="font-weight: 600; color: ${getMarkerColor(entity.abfiScore, 'feedstock')}">${entity.abfiScore || 'N/A'}</div>
            </div>
            <div>
              <span style="color: #666;">Available</span>
              <div style="font-weight: 600;">${(entity.availableVolumeCurrent || 0).toLocaleString()} t</div>
            </div>
            ${entity.pricePerTonne && entity.priceVisibility === 'public' ? `
            <div>
              <span style="color: #666;">Price</span>
              <div style="font-weight: 600;">${formatPrice(entity.pricePerTonne)}/t</div>
            </div>
            ` : ''}
            ${entity.carbonIntensityValue ? `
            <div>
              <span style="color: #666;">CI</span>
              <div style="font-weight: 600;">${entity.carbonIntensityValue} gCO2e/MJ</div>
            </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    return `
      <div style="padding: 12px; max-width: 280px; font-family: system-ui, sans-serif;">
        <h3 style="font-weight: 600; margin-bottom: 4px; color: #111;">${entity.name || entity.title}</h3>
        <p style="font-size: 13px; color: #666;">${entity.description || ''}</p>
      </div>
    `;
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStates([]);
    setMinScore(0);
    setMaxCarbonIntensity(100);
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedStates.length +
    (minScore > 0 ? 1 : 0) +
    (maxCarbonIntensity < 100 ? 1 : 0);

  const isLoading = feedstocksLoading || demandLoading;
  const totalMarkers = markersRef.current.length;

  return (
    <div className={cn('relative flex flex-col h-full', className)}>
      {/* Map Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Layer Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm" className="shadow-md">
                <Layers className="h-4 w-4 mr-2" />
                Layers
                <Badge variant="outline" className="ml-2 text-xs">
                  {layers.filter((l) => l.enabled).length}
                </Badge>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Map Layers
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Data Layers */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Data Layers</h4>
                  <div className="space-y-2">
                    {layers
                      .filter((l) => !MAP_VIEW_LAYERS.includes(l.id))
                      .map((layer) => {
                        const Icon = layer.icon;
                        return (
                          <div
                            key={layer.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2 rounded-full"
                                style={{ backgroundColor: `${layer.color}20` }}
                              >
                                <Icon
                                  className="h-4 w-4"
                                  color={layer.color}
                                />
                              </div>
                              <span className="font-medium">{layer.label}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleLayer(layer.id)}
                            >
                              {layer.enabled ? (
                                <Eye className="h-4 w-4 text-primary" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Map View Layers */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Map View</h4>
                  <div className="space-y-2">
                    {layers
                      .filter((l) => MAP_VIEW_LAYERS.includes(l.id))
                      .map((layer) => {
                        const Icon = layer.icon;
                        return (
                          <div
                            key={layer.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2 rounded-full"
                                style={{ backgroundColor: `${layer.color}20` }}
                              >
                                <Icon
                                  className="h-4 w-4"
                                  color={layer.color}
                                />
                              </div>
                              <span className="font-medium">{layer.label}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleLayer(layer.id)}
                            >
                              {layer.enabled ? (
                                <Eye className="h-4 w-4 text-primary" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <Separator className="my-6" />
              <div>
                <h4 className="font-medium mb-3">ABFI Score Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Excellent (80-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Good (60-79)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Fair (&lt;60)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <span>Not Rated</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Filters Toggle */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm" className="shadow-md">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 text-xs">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Category Filter */}
                <div>
                  <Label className="mb-3 block font-medium">
                    Feedstock Category
                  </Label>
                  <div className="space-y-2">
                    {FEEDSTOCK_CATEGORIES.map((cat) => (
                      <label
                        key={cat.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedCategories.includes(cat.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories((prev) => [
                                ...prev,
                                cat.value,
                              ]);
                            } else {
                              setSelectedCategories((prev) =>
                                prev.filter((c) => c !== cat.value)
                              );
                            }
                          }}
                        />
                        <span className="text-sm">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* State Filter */}
                <div>
                  <Label className="mb-3 block font-medium">State</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {AUSTRALIAN_STATES.map((state) => (
                      <label
                        key={state.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedStates.includes(state.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStates((prev) => [
                                ...prev,
                                state.value,
                              ]);
                            } else {
                              setSelectedStates((prev) =>
                                prev.filter((s) => s !== state.value)
                              );
                            }
                          }}
                        />
                        <span className="text-sm">{state.value}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Score Filter */}
                <div>
                  <Label className="mb-3 block font-medium">
                    Minimum ABFI Score: {minScore}
                  </Label>
                  <Slider
                    value={[minScore]}
                    onValueChange={([value]) => setMinScore(value)}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>

                {/* Carbon Intensity Filter */}
                <div>
                  <Label className="mb-3 block font-medium">
                    Max Carbon Intensity: {maxCarbonIntensity} gCO2e/MJ
                  </Label>
                  <Slider
                    value={[maxCarbonIntensity]}
                    onValueChange={([value]) => setMaxCarbonIntensity(value)}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {isLoading && (
            <Badge variant="secondary" className="shadow-md">
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Loading...
            </Badge>
          )}
          {!isLoading && (
            <Badge variant="secondary" className="shadow-md">
              <MapPin className="h-3 w-3 mr-1" />
              {totalMarkers} locations
            </Badge>
          )}
          <Button
            variant="secondary"
            size="icon"
            className="shadow-md h-8 w-8"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <GoogleMapView
          className="w-full h-full"
          initialCenter={AUSTRALIA_CENTER}
          initialZoom={DEFAULT_ZOOM}
          onMapReady={handleMapReady}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading map data...</p>
            </div>
          </div>
        )}
      </div>

      {/* Satellite Data Panel - shows when satellite layer enabled OR when a feedstock is selected */}
      {(isSatelliteLayerEnabled || satelliteCoords) && (
        <div className="absolute top-20 right-4 z-10">
          <SatelliteDataPanel
            coordinates={satelliteCoords}
            onClose={() => setSatelliteCoords(null)}
            className="shadow-xl"
          />
        </div>
      )}

      {/* Selected Entity Card (Mobile-friendly) */}
      {selectedEntity && (
        <Card className="absolute bottom-4 left-4 right-4 md:right-auto md:left-4 md:w-80 shadow-xl z-10">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">
                  {selectedEntity.name || selectedEntity.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedEntity.location || selectedEntity.state}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSelectedEntity(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              {selectedEntity.abfiScore && (
                <div>
                  <span className="text-muted-foreground">Score</span>
                  <p className="font-medium">{selectedEntity.abfiScore}</p>
                </div>
              )}
              {selectedEntity.availableVolumeCurrent && (
                <div>
                  <span className="text-muted-foreground">Available</span>
                  <p className="font-medium">
                    {selectedEntity.availableVolumeCurrent.toLocaleString()} t
                  </p>
                </div>
              )}
            </div>
            <Button className="w-full" size="sm">
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default UnifiedMap;
