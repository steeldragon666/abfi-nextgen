/**
 * Map Data Export Utilities
 * Exports visible/filtered facilities as GeoJSON or CSV
 */

export interface ExportOptions {
  layers: string[];
  stateFilter: string[];
  capacityRanges: Record<string, { min: number; max: number }>;
}

/**
 * Fetch and filter GeoJSON data based on current map state
 */
export async function getFilteredFeatures(options: ExportOptions) {
  const allFeatures: any[] = [];

  // Layer source mapping
  const layerSources: Record<string, string> = {
    "sugar-mills": "/geojson/sugar_mills.json",
    "grain-regions": "/geojson/grain_regions.json",
    "forestry-regions": "/geojson/forestry_regions.json",
    "biogas-facilities": "/geojson/biogas_facilities.json",
    "biofuel-plants": "/geojson/biofuel_plants.json",
    "transport-infrastructure": "/geojson/transport_infrastructure.json",
  };

  // Fetch data for visible layers
  for (const layerId of options.layers) {
    const source = layerSources[layerId];
    if (!source) continue;

    try {
      const response = await fetch(source);
      const data = await response.json();
      
      // Filter features by state
      const filtered = data.features.filter((feature: any) => {
        const state = feature.properties.state;
        if (state && !options.stateFilter.includes(state)) {
          return false;
        }

        // Apply capacity filters
        if (layerId === "sugar-mills") {
          const capacity = feature.properties.crushing_capacity_tonnes || 0;
          const range = options.capacityRanges["sugar-mills"];
          if (range && (capacity < range.min || capacity > range.max)) {
            return false;
          }
        } else if (layerId === "biogas-facilities") {
          const capacity = feature.properties.capacity_mw || 0;
          const range = options.capacityRanges["biogas-facilities"];
          if (range && (capacity < range.min || capacity > range.max)) {
            return false;
          }
        } else if (layerId === "biofuel-plants") {
          const capacity = feature.properties.capacity_ml_per_year || 0;
          const range = options.capacityRanges["biofuel-plants"];
          if (range && (capacity < range.min || capacity > range.max)) {
            return false;
          }
        } else if (layerId === "transport-infrastructure") {
          if (feature.properties.type === "port") {
            const capacity = feature.properties.annual_throughput_mt || 0;
            const range = options.capacityRanges["transport-infrastructure"];
            if (range && (capacity < range.min || capacity > range.max)) {
              return false;
            }
          }
        }

        return true;
      });

      allFeatures.push(...filtered);
    } catch (error) {
      console.error(`Failed to fetch ${layerId}:`, error);
    }
  }

  return allFeatures;
}

/**
 * Export filtered features as GeoJSON file
 */
export async function exportAsGeoJSON(options: ExportOptions) {
  console.log("[exportAsGeoJSON] Starting export with options:", options);
  const features = await getFilteredFeatures(options);
  console.log("[exportAsGeoJSON] Fetched features:", features.length);

  const geojson = {
    type: "FeatureCollection",
    features: features,
    metadata: {
      exportDate: new Date().toISOString(),
      filters: {
        states: options.stateFilter,
        layers: options.layers,
      },
      featureCount: features.length,
    },
  };

  const geojsonString = JSON.stringify(geojson, null, 2);
  console.log("[exportAsGeoJSON] GeoJSON string length:", geojsonString.length);
  const blob = new Blob([geojsonString], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `abfi-feedstock-map-${new Date().toISOString().split("T")[0]}.geojson`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return features.length;
}

/**
 * Export filtered features as CSV file
 */
export async function exportAsCSV(options: ExportOptions) {
  const features = await getFilteredFeatures(options);

  // Extract all unique property keys
  const allKeys = new Set<string>();
  features.forEach((feature) => {
    Object.keys(feature.properties).forEach((key) => allKeys.add(key));
  });

  // Add geometry columns
  allKeys.add("longitude");
  allKeys.add("latitude");
  allKeys.add("geometry_type");

  const headers = Array.from(allKeys);
  
  // Build CSV rows
  const rows = features.map((feature) => {
    const row: Record<string, any> = { ...feature.properties };
    
    // Add geometry info
    if (feature.geometry.type === "Point") {
      row.longitude = feature.geometry.coordinates[0];
      row.latitude = feature.geometry.coordinates[1];
      row.geometry_type = "Point";
    } else if (feature.geometry.type === "Polygon") {
      // Use centroid for polygons
      const coords = feature.geometry.coordinates[0];
      const avgLng = coords.reduce((sum: number, c: number[]) => sum + c[0], 0) / coords.length;
      const avgLat = coords.reduce((sum: number, c: number[]) => sum + c[1], 0) / coords.length;
      row.longitude = avgLng;
      row.latitude = avgLat;
      row.geometry_type = "Polygon";
    } else if (feature.geometry.type === "LineString") {
      // Use first point for lines
      row.longitude = feature.geometry.coordinates[0][0];
      row.latitude = feature.geometry.coordinates[0][1];
      row.geometry_type = "LineString";
    }

    return headers.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) return "";
      // Escape commas and quotes
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `abfi-feedstock-map-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return features.length;
}
