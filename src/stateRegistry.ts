/**
 * Auto-generates MapConfig entries for all US states/territories
 * from a manifest + sensible defaults based on geography.
 */
import type { MapConfig } from './mapConfigs';
import type { Difficulty } from './types';

export interface StateManifest {
  id: string;
  name: string;
  abbr: string;
  emoji: string;
  region: string;
  cityCount: number;
  center: [number, number];
  zoom: number;
  minZoom: number;
  maxZoom: number;
  bounds: [[number, number], [number, number]];
  // Optional overrides
  iconUrl?: string;
  distanceThresholds?: { hot: number; warm: number; medium: number; cool: number };
  difficultyThresholds?: Record<Difficulty, number>;
}

// Difficulty presets by state size
function getDifficultyThresholds(cityCount: number): Record<Difficulty, number> {
  if (cityCount > 500) return { veryEasy: 500000, easy: 25000, hard: 1000, insane: 0 };
  if (cityCount > 200) return { veryEasy: 100000, easy: 15000, hard: 1000, insane: 0 };
  if (cityCount > 50) return { veryEasy: 50000, easy: 10000, hard: 1000, insane: 0 };
  return { veryEasy: 25000, easy: 5000, hard: 500, insane: 0 };
}

// Distance thresholds based on geographic size (zoom level as proxy)
function getDistanceThresholds(zoom: number): { hot: number; warm: number; medium: number; cool: number } {
  if (zoom >= 9) return { hot: 5, warm: 15, medium: 30, cool: 60 };     // tiny (PR, DC, small territories)
  if (zoom >= 7) return { hot: 10, warm: 30, medium: 60, cool: 120 };    // small states (CT, DE, RI)
  if (zoom >= 6) return { hot: 15, warm: 50, medium: 100, cool: 200 };   // medium states
  return { hot: 25, warm: 75, medium: 150, cool: 300 };                   // large states (TX, AK, CA)
}

export function manifestToMapConfig(state: StateManifest): MapConfig {
  const diffThresholds = state.difficultyThresholds || getDifficultyThresholds(state.cityCount);
  const distThresholds = state.distanceThresholds || getDistanceThresholds(state.zoom);

  return {
    id: state.id,
    name: state.name,
    emoji: state.emoji,
    flag: '🇺🇸',
    center: state.center,
    zoom: state.zoom,
    minZoom: state.minZoom,
    maxZoom: state.maxZoom,
    bounds: state.bounds,
    cityDataFile: `/data/${state.id}_cities.json`,
    outlineFile: `/data/${state.id}_outline.geojson`,
    iconUrl: state.iconUrl,
    boundaryFile: `/data/${state.id}_boundaries.geojson`,
    placeholder: '',
    welcomeText: `Welcome to ${state.name}!`,
    distanceUnit: 'mi',
    distanceThresholds: distThresholds,
    difficultyThresholds: diffThresholds,
    dailyTiers: ['veryEasy', 'easy', 'hard', 'insane'] as Difficulty[],
    storagePrefix: `${state.id}-guesser`,
  };
}

export const REGIONS: Record<string, { label: string; emoji: string; order: number }> = {
  northeast: { label: 'Northeast', emoji: '🏙️', order: 1 },
  southeast: { label: 'Southeast', emoji: '🌴', order: 2 },
  midwest: { label: 'Midwest', emoji: '🌾', order: 3 },
  southwest: { label: 'Southwest', emoji: '🌵', order: 4 },
  west: { label: 'West', emoji: '🏔️', order: 5 },
  territories: { label: 'Territories', emoji: '🏝️', order: 6 },
};
