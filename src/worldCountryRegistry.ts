/**
 * Auto-generates MapConfig entries for all world countries
 * from the world countries manifest.
 */
import type { MapConfig } from './mapConfigs';
import type { Difficulty } from './types';
import type { CountryManifest } from './worldCountriesManifest';

function getDifficultyThresholds(cityCount: number): Record<Difficulty, number> {
  if (cityCount > 1000) return { veryEasy: 1000000, easy: 100000, hard: 10000, insane: 0 };
  if (cityCount > 500) return { veryEasy: 500000, easy: 50000, hard: 5000, insane: 0 };
  if (cityCount > 200) return { veryEasy: 200000, easy: 25000, hard: 2000, insane: 0 };
  if (cityCount > 50) return { veryEasy: 50000, easy: 10000, hard: 1000, insane: 0 };
  return { veryEasy: 25000, easy: 5000, hard: 500, insane: 0 };
}

function getDistanceThresholds(zoom: number): { hot: number; warm: number; medium: number; cool: number } {
  if (zoom >= 10) return { hot: 3, warm: 10, medium: 20, cool: 40 };
  if (zoom >= 8) return { hot: 5, warm: 15, medium: 30, cool: 60 };
  if (zoom >= 6) return { hot: 15, warm: 50, medium: 100, cool: 200 };
  if (zoom >= 4) return { hot: 50, warm: 150, medium: 400, cool: 800 };
  return { hot: 100, warm: 300, medium: 800, cool: 1500 };
}

export function countryToMapConfig(country: CountryManifest): MapConfig {
  const diffThresholds = getDifficultyThresholds(country.cityCount);
  const distThresholds = getDistanceThresholds(country.zoom);
  const useKm = country.continent !== 'americas';

  return {
    id: `world-${country.id}`,
    name: country.name,
    emoji: country.emoji,
    flag: country.emoji,
    center: country.center,
    zoom: country.zoom,
    minZoom: Math.max(country.zoom - 2, 2),
    maxZoom: 14,
    bounds: country.bounds,
    cityDataFile: `/data/world/${country.iso}_cities.json`,
    outlineFile: `/data/world/${country.iso}_outline.geojson`,
    boundaryFile: `/data/world/${country.iso}_boundaries.geojson`,
    placeholder: '',
    welcomeText: `Welcome to ${country.name}!`,
    distanceUnit: useKm ? 'km' : 'mi',
    distanceThresholds: distThresholds,
    difficultyThresholds: diffThresholds,
    dailyTiers: ['veryEasy', 'easy', 'hard', 'insane'] as Difficulty[],
    storagePrefix: `world-${country.id}-guesser`,
  };
}

export const CONTINENTS: Record<string, { label: string; emoji: string; order: number }> = {
  americas: { label: 'Americas', emoji: '🌎', order: 1 },
  europe: { label: 'Europe', emoji: '🌍', order: 2 },
  asia: { label: 'Asia', emoji: '🌏', order: 3 },
  africa: { label: 'Africa', emoji: '🌍', order: 4 },
  oceania: { label: 'Oceania', emoji: '🌏', order: 5 },
};
