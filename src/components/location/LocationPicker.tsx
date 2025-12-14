"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Search, Loader2, X, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  (typeof window !== "undefined" ? (window as any).VITE_GOOGLE_MAPS_API_KEY : "") || "";

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationPickerProps {
  value?: LocationCoordinates | null;
  onChange?: (location: LocationCoordinates | null) => void;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
  placeholder?: string;
  label?: string;
  description?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

// Australian center coordinates
const AUSTRALIA_CENTER = { lat: -25.2744, lng: 133.7751 };
const DEFAULT_ZOOM = 4;

const containerStyle = {
  width: "100%",
  height: "350px",
};

export function LocationPicker({
  value,
  onChange,
  defaultCenter = AUSTRALIA_CENTER,
  defaultZoom = DEFAULT_ZOOM,
  placeholder = "Click to select location",
  label,
  description,
  className,
  required = false,
  disabled = false,
}: LocationPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(
    value || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<google.maps.places.AutocompletePrediction[]>([]);

  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  // Initialize services when loaded
  useEffect(() => {
    if (isLoaded && typeof google !== "undefined") {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      geocoder.current = new google.maps.Geocoder();
    }
  }, [isLoaded]);

  // Map load callback
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (typeof google !== "undefined") {
      placesService.current = new google.maps.places.PlacesService(map);
    }
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Handle map click
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // Reverse geocode to get address
    const address = await reverseGeocode(lat, lng);

    setSelectedLocation({
      latitude: lat,
      longitude: lng,
      address,
    });
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number): Promise<string | undefined> => {
    if (!geocoder.current) return undefined;

    try {
      const response = await geocoder.current.geocode({
        location: { lat, lng },
      });

      if (response.results && response.results.length > 0) {
        return response.results[0].formatted_address;
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
    return undefined;
  };

  // Search for locations
  const handleSearch = async () => {
    if (!searchQuery.trim() || !autocompleteService.current) return;

    setIsSearching(true);
    try {
      autocompleteService.current.getPlacePredictions(
        {
          input: searchQuery,
          componentRestrictions: { country: "au" },
        },
        (predictions, status) => {
          setIsSearching(false);
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSearchResults(predictions);
          } else {
            setSearchResults([]);
          }
        }
      );
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Select a search result
  const selectSearchResult = (result: google.maps.places.AutocompletePrediction) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      { placeId: result.place_id },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(14);
          }

          setSelectedLocation({
            latitude: lat,
            longitude: lng,
            address: place.formatted_address,
          });

          setSearchResults([]);
          setSearchQuery("");
        }
      }
    );
  };

  // Confirm selection
  const handleConfirm = () => {
    onChange?.(selectedLocation);
    setIsOpen(false);
  };

  // Clear selection
  const handleClear = () => {
    setSelectedLocation(null);
    onChange?.(null);
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        if (mapRef.current) {
          mapRef.current.panTo({ lat: latitude, lng: longitude });
          mapRef.current.setZoom(14);
        }

        const address = await reverseGeocode(latitude, longitude);
        setSelectedLocation({
          latitude,
          longitude,
          address,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-auto py-3",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <MapPin className="mr-2 h-4 w-4 shrink-0" />
            <div className="flex-1 truncate">
              {value?.address || value
                ? `${value.latitude?.toFixed(4)}, ${value.longitude?.toFixed(4)}`
                : placeholder}
            </div>
            {value && (
              <X
                className="ml-2 h-4 w-4 shrink-0 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Select Location</DialogTitle>
            <DialogDescription>
              Search for an address or click on the map to select a location
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search for an address in Australia..."
                  className="pr-10"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleUseCurrentLocation} title="Use current location">
                <Navigation className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardContent className="p-2">
                  <ul className="space-y-1">
                    {searchResults.map((result) => (
                      <li key={result.place_id}>
                        <button
                          onClick={() => selectSearchResult(result)}
                          className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                            <span className="line-clamp-2">{result.description}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Map Container */}
            {isLoaded ? (
              <div className="rounded-lg border overflow-hidden">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={
                    selectedLocation
                      ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
                      : defaultCenter
                  }
                  zoom={selectedLocation ? 12 : defaultZoom}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  onClick={handleMapClick}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: true,
                    fullscreenControl: true,
                  }}
                >
                  {selectedLocation && (
                    <Marker
                      position={{
                        lat: selectedLocation.latitude,
                        lng: selectedLocation.longitude,
                      }}
                    />
                  )}
                </GoogleMap>
              </div>
            ) : (
              <div className="w-full h-[350px] rounded-lg border flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}

            {/* Selected Location Info */}
            {selectedLocation && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      {selectedLocation.address && (
                        <p className="text-sm font-medium truncate">
                          {selectedLocation.address}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Lat: {selectedLocation.latitude.toFixed(6)}, Lng:{" "}
                        {selectedLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedLocation}>
                Confirm Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

// Mini map display component (read-only)
interface LocationDisplayProps {
  location: LocationCoordinates;
  className?: string;
  height?: number;
}

export function LocationDisplay({
  location,
  className,
  height = 200,
}: LocationDisplayProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const containerStyle = {
    width: "100%",
    height: `${height}px`,
  };

  if (!isLoaded) {
    return (
      <div
        className={cn("rounded-lg border overflow-hidden flex items-center justify-center", className)}
        style={{ height }}
      >
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border overflow-hidden", className)}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: location.latitude, lng: location.longitude }}
        zoom={12}
        options={{
          disableDefaultUI: true,
          draggable: false,
          zoomControl: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
        }}
      >
        <Marker position={{ lat: location.latitude, lng: location.longitude }} />
      </GoogleMap>
    </div>
  );
}

// Coordinates input component (manual entry)
interface CoordinatesInputProps {
  value?: LocationCoordinates | null;
  onChange?: (location: LocationCoordinates | null) => void;
  label?: string;
  className?: string;
}

export function CoordinatesInput({
  value,
  onChange,
  label,
  className,
}: CoordinatesInputProps) {
  const [lat, setLat] = useState(value?.latitude?.toString() || "");
  const [lng, setLng] = useState(value?.longitude?.toString() || "");

  const handleUpdate = (newLat: string, newLng: string) => {
    const latitude = parseFloat(newLat);
    const longitude = parseFloat(newLng);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      onChange?.({
        latitude,
        longitude,
      });
    } else if (newLat === "" && newLng === "") {
      onChange?.(null);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Latitude</Label>
          <Input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => {
              setLat(e.target.value);
              handleUpdate(e.target.value, lng);
            }}
            placeholder="-25.2744"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Longitude</Label>
          <Input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => {
              setLng(e.target.value);
              handleUpdate(lat, e.target.value);
            }}
            placeholder="133.7751"
          />
        </div>
      </div>
    </div>
  );
}
