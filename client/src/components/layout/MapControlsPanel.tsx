/**
 * MapControlsPanel - Left panel for map layer controls, filters, and settings
 * Collapsible panel that controls the UnifiedMap via context
 */
import { useMapControls, MAP_VIEW_LAYERS } from '@/contexts/MapControlsContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Layers,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  MapPin,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useState } from 'react';
import { AUSTRALIAN_STATES, FEEDSTOCK_CATEGORIES } from '@/const';

interface MapControlsPanelProps {
  className?: string;
}

export function MapControlsPanel({ className }: MapControlsPanelProps) {
  const {
    layers,
    toggleLayer,
    selectedCategories,
    setSelectedCategories,
    selectedStates,
    setSelectedStates,
    minScore,
    setMinScore,
    maxCarbonIntensity,
    setMaxCarbonIntensity,
    controlsPanelCollapsed,
    setControlsPanelCollapsed,
    resetFilters,
  } = useMapControls();

  const [layersExpanded, setLayersExpanded] = useState(true);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [viewExpanded, setViewExpanded] = useState(true);

  // Separate layers into data layers and view layers
  const dataLayers = layers.filter((l) => !MAP_VIEW_LAYERS.includes(l.id));
  const viewLayers = layers.filter((l) => MAP_VIEW_LAYERS.includes(l.id));

  // Count active filters
  const activeFilterCount =
    selectedCategories.length +
    selectedStates.length +
    (minScore > 0 ? 1 : 0) +
    (maxCarbonIntensity < 100 ? 1 : 0);

  // Count enabled data layers
  const enabledLayerCount = dataLayers.filter((l) => l.enabled).length;

  if (controlsPanelCollapsed) {
    return (
      <aside
        className={cn(
          'w-12 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-2 shrink-0',
          className
        )}
        role="complementary"
        aria-label="Map controls (collapsed)"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setControlsPanelCollapsed(false)}
          className="h-9 w-9"
          title="Expand panel"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Separator className="w-8" />
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative"
          title={`${enabledLayerCount} layers active`}
        >
          <Layers className="h-4 w-4" />
          {enabledLayerCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[#D4AF37]">
              {enabledLayerCount}
            </Badge>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative"
          title={`${activeFilterCount} filters active`}
        >
          <Filter className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[#D4AF37]">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title="Map view options"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden',
        className
      )}
      role="complementary"
      aria-label="Map controls"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-12 px-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#D4AF37]" />
          <span className="text-sm font-semibold text-gray-900">Map Controls</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setControlsPanelCollapsed(true)}
          className="h-7 w-7"
          title="Collapse panel"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Data Layers Section */}
        <Collapsible open={layersExpanded} onOpenChange={setLayersExpanded}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Data Layers
              </span>
              <Badge variant="secondary" className="h-5 text-[10px]">
                {enabledLayerCount}/{dataLayers.length}
              </Badge>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform',
                !layersExpanded && '-rotate-90'
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3 space-y-1">
            {dataLayers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={cn(
                  'flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-sm transition-colors',
                  layer.enabled
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'h-5 w-5 rounded flex items-center justify-center',
                    layer.enabled ? 'bg-white' : 'bg-gray-100'
                  )}
                  style={{
                    borderColor: layer.color,
                    borderWidth: 2,
                  }}
                >
                  {layer.enabled && (
                    <layer.icon
                      className="h-3 w-3"
                      style={{ color: layer.color }}
                    />
                  )}
                </div>
                <span className="flex-1 text-left">{layer.label}</span>
                {layer.enabled ? (
                  <Eye className="h-3.5 w-3.5 text-gray-400" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 text-gray-300" />
                )}
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Map View Section */}
        <Collapsible open={viewExpanded} onOpenChange={setViewExpanded}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Map View
              </span>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform',
                !viewExpanded && '-rotate-90'
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3 space-y-1">
            {viewLayers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={cn(
                  'flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-sm transition-colors',
                  layer.enabled
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <layer.icon
                  className="h-4 w-4"
                  style={{ color: layer.enabled ? '#D4AF37' : '#9ca3af' }}
                />
                <span className="flex-1 text-left">{layer.label}</span>
                {layer.enabled && (
                  <Badge className="bg-[#D4AF37] text-white text-[10px] h-4 px-1.5">
                    Active
                  </Badge>
                )}
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Filters Section */}
        <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Filters
              </span>
              {activeFilterCount > 0 && (
                <Badge className="bg-[#D4AF37] text-white h-5 text-[10px]">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform',
                !filtersExpanded && '-rotate-90'
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3 space-y-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">
                Feedstock Category
              </Label>
              <Select
                value={selectedCategories[0] || 'all'}
                onValueChange={(value) =>
                  setSelectedCategories(value === 'all' ? [] : [value])
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {FEEDSTOCK_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">
                State / Territory
              </Label>
              <Select
                value={selectedStates[0] || 'all'}
                onValueChange={(value) =>
                  setSelectedStates(value === 'all' ? [] : [value])
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="All states" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All states</SelectItem>
                  {AUSTRALIAN_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ABFI Score Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-gray-700">
                  Min ABFI Score
                </Label>
                <span className="text-xs text-gray-500">{minScore}</span>
              </div>
              <Slider
                value={[minScore]}
                onValueChange={([value]) => setMinScore(value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Carbon Intensity Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-gray-700">
                  Max Carbon Intensity
                </Label>
                <span className="text-xs text-gray-500">
                  {maxCarbonIntensity} gCO2e/MJ
                </span>
              </div>
              <Slider
                value={[maxCarbonIntensity]}
                onValueChange={([value]) => setMaxCarbonIntensity(value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Reset Button */}
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="w-full h-8 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1.5" />
                Reset Filters
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Footer with summary */}
      <div className="shrink-0 px-3 py-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{enabledLayerCount} layers visible</span>
          {activeFilterCount > 0 && (
            <span className="text-[#D4AF37] font-medium">
              {activeFilterCount} filters
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}

export default MapControlsPanel;
