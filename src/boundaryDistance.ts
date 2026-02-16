import * as turf from '@turf/turf';

export interface BoundaryMap {
  [cityNameLower: string]: GeoJSON.Feature[];
}

/**
 * Pick the closest boundary feature to the given city coordinates.
 */
function resolveBoundary(
  city: { lat: number; lng: number },
  features: GeoJSON.Feature[] | undefined
): GeoJSON.Feature | undefined {
  if (!features || features.length === 0) return undefined;
  if (features.length === 1) return features[0];
  let best: GeoJSON.Feature | undefined;
  let bestDist = Infinity;
  for (const feat of features) {
    try {
      const c = turf.centroid(feat as turf.AllGeoJSON);
      const [lng, lat] = c.geometry.coordinates;
      const dx = lng - city.lng;
      const dy = lat - city.lat;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) { bestDist = dist; best = feat; }
    } catch { /* skip */ }
  }
  return best;
}

/**
 * Calculate border-to-border distance between two cities in miles.
 * If boundary data exists for both, uses nearest points on polygon edges.
 * If boundaries overlap or one contains the other, returns 0.
 * Falls back to centroid-to-centroid for missing boundaries.
 */
export function calculateBorderDistance(
  guessCity: { name: string; lat: number; lng: number },
  mysteryCity: { name: string; lat: number; lng: number },
  boundaries: BoundaryMap
): number {
  const guessBoundary = resolveBoundary(guessCity, boundaries[guessCity.name.toLowerCase()]);
  const mysteryBoundary = resolveBoundary(mysteryCity, boundaries[mysteryCity.name.toLowerCase()]);

  // If both boundaries exist, compute border-to-border
  if (guessBoundary && mysteryBoundary) {
    try {
      // Check if they overlap/intersect
      const overlap = turf.booleanOverlap(guessBoundary, mysteryBoundary);
      if (overlap) return 0;

      // Check containment
      const guessCentroid = turf.centroid(guessBoundary);
      const mysteryCentroid = turf.centroid(mysteryBoundary);
      if (turf.booleanPointInPolygon(guessCentroid, mysteryBoundary as any)) return 0;
      if (turf.booleanPointInPolygon(mysteryCentroid, guessBoundary as any)) return 0;

      // Sample points along both boundaries and find minimum distance
      const guessPoints = sampleBoundaryPoints(guessBoundary);
      const mysteryPoints = sampleBoundaryPoints(mysteryBoundary);

      let minDist = Infinity;
      for (const gp of guessPoints) {
        for (const mp of mysteryPoints) {
          const d = turf.distance(gp, mp, { units: 'miles' });
          if (d < minDist) minDist = d;
        }
      }
      return minDist;
    } catch {
      // Fall back to centroid distance
    }
  }

  // Fallback: centroid-to-centroid (Haversine)
  const from = turf.point([guessCity.lng, guessCity.lat]);
  const to = turf.point([mysteryCity.lng, mysteryCity.lat]);
  return turf.distance(from, to, { units: 'miles' });
}

/**
 * Sample points along a polygon/multipolygon boundary for distance comparison.
 * Returns an array of [lng, lat] turf points.
 */
function sampleBoundaryPoints(feature: GeoJSON.Feature): any[] {
  const points: any[] = [];
  const coords = extractCoords(feature);
  
  for (const ring of coords) {
    // Sample every few vertices to keep computation reasonable
    const step = Math.max(1, Math.floor(ring.length / 30));
    for (let i = 0; i < ring.length; i += step) {
      points.push(turf.point(ring[i]));
    }
  }
  return points;
}

function extractCoords(feature: GeoJSON.Feature): number[][][] {
  const geom = feature.geometry;
  if (geom.type === 'Polygon') {
    return (geom as GeoJSON.Polygon).coordinates;
  } else if (geom.type === 'MultiPolygon') {
    const result: number[][][] = [];
    for (const poly of (geom as GeoJSON.MultiPolygon).coordinates) {
      result.push(...poly);
    }
    return result;
  }
  return [];
}
