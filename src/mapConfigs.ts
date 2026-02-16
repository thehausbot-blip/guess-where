import type { LatLngBoundsExpression } from 'leaflet';
import type { Difficulty } from './types';

export interface MapConfig {
  id: string;
  name: string;
  emoji: string;
  flag?: string;
  iconUrl?: string; // optional image icon (overrides emoji in UI)
  entityName?: string; // what to call the things being guessed (default: "cities")
  center: [number, number];
  zoom: number;
  minZoom: number;
  maxZoom: number;
  bounds: LatLngBoundsExpression;
  cityDataFile: string;
  outlineFile: string;
  boundaryFile: string | null;
  placeholder: string; // input placeholder
  welcomeText: string; // name prompt greeting
  distanceUnit: 'mi' | 'km';
  // Distance thresholds for coloring (in the map's distance unit)
  distanceThresholds: {
    hot: number;
    warm: number;
    medium: number;
    cool: number;
  };
  // Population thresholds per difficulty — maps can override
  difficultyThresholds: Record<Difficulty, number>;
  // Which tiers to include in daily challenge (skip tiers with 0 cities)
  dailyTiers: Difficulty[];
  // localStorage key prefix
  storagePrefix: string;
}

export const MAP_CONFIGS: Record<string, MapConfig> = {
  usa: {
    id: 'usa',
    name: 'United States',
    emoji: '🇺🇸',
    flag: '🇺🇸',
    center: [39.8, -98.6],
    zoom: 4,
    minZoom: 3,
    maxZoom: 10,
    bounds: [[15.0, -180.0], [72.0, -60.0]],
    cityDataFile: '/data/us_states_cities.json',
    outlineFile: '/data/us_states_boundaries.geojson',
    boundaryFile: '/data/us_states_boundaries.geojson',
    placeholder: '',
    entityName: 'states & territories',
    welcomeText: 'Welcome, American!',
    distanceUnit: 'mi',
    distanceThresholds: { hot: 50, warm: 150, medium: 400, cool: 800 },
    difficultyThresholds: {
      veryEasy: 0,
      easy: 0,
      hard: 0,
      insane: 0,
    },
    dailyTiers: ['insane'],
    storagePrefix: 'usa-guesser',
  },
  texas: {
    id: 'texas',
    name: 'Texas',
    emoji: '⭐',
    flag: '🇺🇸',
    iconUrl: '/icons/texas-flag.svg',
    center: [31.5, -99.5],
    zoom: 5,
    minZoom: 5,
    maxZoom: 13,
    bounds: [[25.8, -106.7], [36.5, -93.5]],
    cityDataFile: '/data/texas_cities_final.json',
    outlineFile: '/data/texas_outline_web.geojson',
    boundaryFile: '/data/texas_city_boundaries_web.geojson',
    placeholder: '',
    welcomeText: 'Welcome, Texan!',
    distanceUnit: 'mi',
    distanceThresholds: { hot: 25, warm: 75, medium: 150, cool: 300 },
    difficultyThresholds: {
      veryEasy: 500000,
      easy: 25000,
      hard: 1000,
      insane: 0,
    },
    dailyTiers: ['veryEasy', 'easy', 'hard', 'insane'],
    storagePrefix: 'texas-guesser',
  },
  puertoRico: {
    id: 'puertoRico',
    name: 'Puerto Rico',
    emoji: '🇵🇷',
    flag: '🇵🇷',
    center: [18.22, -66.59],
    zoom: 9,
    minZoom: 8,
    maxZoom: 14,
    bounds: [[17.5, -67.5], [18.7, -65.2]],
    cityDataFile: '/data/puerto_rico_cities.json',
    outlineFile: '/data/puerto_rico_outline.geojson',
    boundaryFile: '/data/puerto_rico_boundaries.geojson',
    placeholder: '',
    welcomeText: '¡Bienvenido, Boricua!',
    distanceUnit: 'mi',
    distanceThresholds: { hot: 5, warm: 15, medium: 30, cool: 60 },
    difficultyThresholds: {
      veryEasy: 100000,
      easy: 25000,
      hard: 5000,
      insane: 0,
    },
    dailyTiers: ['veryEasy', 'easy', 'hard', 'insane'],
    storagePrefix: 'pr-guesser',
  },
};

// Auto-register all US states from manifest
import { US_STATES_MANIFEST } from './usStatesManifest';
import { manifestToMapConfig, REGIONS } from './stateRegistry';

for (const state of US_STATES_MANIFEST) {
  if (!MAP_CONFIGS[state.id]) {
    MAP_CONFIGS[state.id] = manifestToMapConfig(state);
  }
}

export { REGIONS };
export { US_STATES_MANIFEST };

// Auto-register all world countries from manifest
import { WORLD_COUNTRIES } from './worldCountriesManifest';
import { countryToMapConfig, CONTINENTS } from './worldCountryRegistry';

for (const country of WORLD_COUNTRIES) {
  const id = `world-${country.id}`;
  if (!MAP_CONFIGS[id]) {
    MAP_CONFIGS[id] = countryToMapConfig(country);
  }
}

export { CONTINENTS, WORLD_COUNTRIES };

export const DEFAULT_MAP = 'texas';

// Featured maps shown as big cards on landing
export const FEATURED_MAPS = ['texas', 'puertoRico', 'usa'];

export function getMapConfig(id: string): MapConfig {
  return MAP_CONFIGS[id] || MAP_CONFIGS[DEFAULT_MAP];
}

export function getMapsByRegion(): Record<string, MapConfig[]> {
  const byRegion: Record<string, MapConfig[]> = {};
  
  // Add manually configured maps
  if (MAP_CONFIGS.texas) {
    (byRegion['southwest'] = byRegion['southwest'] || []).push(MAP_CONFIGS.texas);
  }
  if (MAP_CONFIGS.puertoRico) {
    (byRegion['territories'] = byRegion['territories'] || []).push(MAP_CONFIGS.puertoRico);
  }
  
  // Add auto-registered states
  for (const state of US_STATES_MANIFEST) {
    const config = MAP_CONFIGS[state.id];
    if (config) {
      const region = state.region;
      byRegion[region] = byRegion[region] || [];
      // Avoid duplicates (Texas/PR already added above)
      if (!byRegion[region].find(m => m.id === config.id)) {
        byRegion[region].push(config);
      }
    }
  }
  
  // Sort each region alphabetically
  for (const region of Object.keys(byRegion)) {
    byRegion[region].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return byRegion;
}

export function getMapsByContinent(): Record<string, MapConfig[]> {
  const byContinent: Record<string, MapConfig[]> = {};
  for (const country of WORLD_COUNTRIES) {
    const config = MAP_CONFIGS[`world-${country.id}`];
    if (config) {
      byContinent[country.continent] = byContinent[country.continent] || [];
      byContinent[country.continent].push(config);
    }
  }
  for (const continent of Object.keys(byContinent)) {
    byContinent[continent].sort((a, b) => a.name.localeCompare(b.name));
  }
  return byContinent;
}
