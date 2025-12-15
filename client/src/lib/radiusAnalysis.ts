// Radius analysis utility functions

interface Feature {
  type: string;
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: any;
}

export interface AnalysisResults {
  facilities: {
    sugarMills: number;
    biogasFacilities: number;
    biofuelPlants: number;
    ports: number;
    grainHubs: number;
  };
  feedstockTonnes: {
    bagasse: number;
    grainStubble: number;
    forestryResidue: number;
    biogas: number;
    total: number;
  };
  infrastructure: {
    railLines: string[];
    ports: string[];
  };
  feasibilityScore: number;
  recommendations: string[];
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Check if a point is within radius
export function isPointInRadius(
  centerLat: number,
  centerLon: number,
  pointLat: number,
  pointLon: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon);
  return distance <= radiusKm;
}

// Check if a polygon intersects with radius circle
export function doesPolygonIntersectRadius(
  centerLat: number,
  centerLon: number,
  polygon: number[][][],
  radiusKm: number
): boolean {
  // Check if any vertex of the polygon is within the radius
  for (const ring of polygon) {
    for (const [lon, lat] of ring) {
      if (isPointInRadius(centerLat, centerLon, lat, lon, radiusKm)) {
        return true;
      }
    }
  }
  return false;
}

// Analyze all features within radius
export async function analyzeRadius(
  centerLat: number,
  centerLon: number,
  radiusKm: number
): Promise<AnalysisResults> {
  const results: AnalysisResults = {
    facilities: {
      sugarMills: 0,
      biogasFacilities: 0,
      biofuelPlants: 0,
      ports: 0,
      grainHubs: 0,
    },
    feedstockTonnes: {
      bagasse: 0,
      grainStubble: 0,
      forestryResidue: 0,
      biogas: 0,
      total: 0,
    },
    infrastructure: {
      railLines: [],
      ports: [],
    },
    feasibilityScore: 0,
    recommendations: [],
  };

  try {
    // Load and analyze sugar mills
    const sugarMills = await fetch("/geojson/sugar_mills.json").then(r =>
      r.json()
    );
    for (const feature of sugarMills.features) {
      const [lon, lat] = feature.geometry.coordinates;
      if (isPointInRadius(centerLat, centerLon, lat, lon, radiusKm)) {
        results.facilities.sugarMills++;
        results.feedstockTonnes.bagasse +=
          feature.properties.bagasse_production_tonnes || 0;
      }
    }

    // Load and analyze grain regions
    const grainRegions = await fetch("/geojson/grain_regions.json").then(r =>
      r.json()
    );
    for (const feature of grainRegions.features) {
      if (
        doesPolygonIntersectRadius(
          centerLat,
          centerLon,
          feature.geometry.coordinates,
          radiusKm
        )
      ) {
        // Estimate 30% of sustainable removal is within radius (rough approximation)
        results.feedstockTonnes.grainStubble +=
          (feature.properties.sustainable_removal_tonnes || 0) * 0.3;
      }
    }

    // Load and analyze forestry regions
    const forestryRegions = await fetch("/geojson/forestry_regions.json").then(
      r => r.json()
    );
    for (const feature of forestryRegions.features) {
      if (feature.geometry.type === "Polygon") {
        if (
          doesPolygonIntersectRadius(
            centerLat,
            centerLon,
            feature.geometry.coordinates,
            radiusKm
          )
        ) {
          // Estimate 20% of annual output is within radius
          results.feedstockTonnes.forestryResidue +=
            (feature.properties.annual_output_tonnes || 0) * 0.2;
        }
      }
    }

    // Load and analyze biogas facilities
    const biogasFacilities = await fetch(
      "/geojson/biogas_facilities.json"
    ).then(r => r.json());
    for (const feature of biogasFacilities.features) {
      const [lon, lat] = feature.geometry.coordinates;
      if (isPointInRadius(centerLat, centerLon, lat, lon, radiusKm)) {
        results.facilities.biogasFacilities++;
        // Estimate annual biogas production (MW * 8000 hours * 0.6 efficiency / 1000)
        results.feedstockTonnes.biogas +=
          ((feature.properties.capacity_mw || 0) * 8000 * 0.6) / 1000;
      }
    }

    // Load and analyze biofuel plants
    const biofuelPlants = await fetch("/geojson/biofuel_plants.json").then(r =>
      r.json()
    );
    for (const feature of biofuelPlants.features) {
      const [lon, lat] = feature.geometry.coordinates;
      if (isPointInRadius(centerLat, centerLon, lat, lon, radiusKm)) {
        results.facilities.biofuelPlants++;
      }
    }

    // Load and analyze transport infrastructure
    const transport = await fetch(
      "/geojson/transport_infrastructure.json"
    ).then(r => r.json());
    for (const feature of transport.features) {
      const [lon, lat] = feature.geometry.coordinates;
      if (isPointInRadius(centerLat, centerLon, lat, lon, radiusKm)) {
        if (feature.properties.type === "port") {
          results.facilities.ports++;
          results.infrastructure.ports.push(feature.properties.name);
        } else if (feature.properties.type === "grain_hub") {
          results.facilities.grainHubs++;
        } else if (feature.properties.type === "rail_line") {
          results.infrastructure.railLines.push(feature.properties.name);
        }
      }
    }

    // Calculate total feedstock
    results.feedstockTonnes.total =
      results.feedstockTonnes.bagasse +
      results.feedstockTonnes.grainStubble +
      results.feedstockTonnes.forestryResidue +
      results.feedstockTonnes.biogas;

    // Calculate feasibility score (0-100)
    let score = 0;

    // Feedstock availability (40 points)
    if (results.feedstockTonnes.total > 1000000) score += 40;
    else if (results.feedstockTonnes.total > 500000) score += 30;
    else if (results.feedstockTonnes.total > 100000) score += 20;
    else if (results.feedstockTonnes.total > 50000) score += 10;

    // Existing facilities (30 points)
    const totalFacilities =
      results.facilities.sugarMills +
      results.facilities.biogasFacilities +
      results.facilities.biofuelPlants;
    if (totalFacilities >= 5) score += 30;
    else if (totalFacilities >= 3) score += 20;
    else if (totalFacilities >= 1) score += 10;

    // Transport infrastructure (30 points)
    if (results.facilities.ports > 0) score += 15;
    if (results.facilities.grainHubs > 0) score += 10;
    if (results.infrastructure.railLines.length > 0) score += 5;

    results.feasibilityScore = score;

    // Generate recommendations
    if (results.feedstockTonnes.total < 50000) {
      results.recommendations.push(
        "Low feedstock availability - consider expanding radius or sourcing from multiple regions"
      );
    }
    if (results.facilities.ports === 0 && results.facilities.grainHubs === 0) {
      results.recommendations.push(
        "No bulk handling infrastructure - transport costs may be high"
      );
    }
    if (results.feedstockTonnes.total > 500000 && totalFacilities === 0) {
      results.recommendations.push(
        "High feedstock availability with no existing facilities - greenfield opportunity"
      );
    }
    if (
      results.facilities.sugarMills > 0 &&
      results.feedstockTonnes.bagasse > 200000
    ) {
      results.recommendations.push(
        "Significant bagasse supply available - consider cogeneration or pelletization"
      );
    }

    return results;
  } catch (error) {
    console.error("Error analyzing radius:", error);
    return results;
  }
}
