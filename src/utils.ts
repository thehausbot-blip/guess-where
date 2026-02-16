import type { City, GuessColor, Difficulty } from './types';
import { DISTANCE_THRESHOLDS, DIFFICULTY_THRESHOLDS, TIER_ORDER } from './types';

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * 
    Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) ** 2;
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

interface DistanceThresholds {
  hot: number;
  warm: number;
  medium: number;
  cool: number;
}

/**
 * Get color based on distance — accepts optional custom thresholds
 */
export function getGuessColor(distance: number, thresholds?: DistanceThresholds): GuessColor {
  const t = thresholds || DISTANCE_THRESHOLDS;
  if (distance <= t.hot) return 'hot';
  if (distance <= t.warm) return 'warm';
  if (distance <= t.medium) return 'medium';
  if (distance <= t.cool) return 'cool';
  return 'cold';
}

/**
 * Get hex color for a guess color
 */
export function getHexColor(color: GuessColor, outOfBand?: boolean): string {
  if (outOfBand) return '#888888';
  const colors: Record<GuessColor, string> = {
    correct: '#00FF00',
    hot: '#FF0000',
    warm: '#FF6600',
    medium: '#FFCC00',
    cool: '#CC9966',
    cold: '#DDDDDD'
  };
  return colors[color];
}

/**
 * Get emoji for sharing
 */
export function getColorEmoji(color: GuessColor): string {
  const emojis: Record<GuessColor, string> = {
    correct: '🟢',
    hot: '🔴',
    warm: '🟠',
    medium: '🟡',
    cool: '🟤',
    cold: '⬜'
  };
  return emojis[color];
}

// Hash function for seeding
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Seeded random number generator
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Get a deterministic city for a given date + difficulty (daily challenge)
 */
export function getDailyCity(
  date: Date, cities: City[], difficulty: Difficulty,
  diffThresholds?: Record<Difficulty, number>,
  salt?: string
): City {
  const thresholds = diffThresholds || DIFFICULTY_THRESHOLDS;
  const dateStr = date.toISOString().split('T')[0];
  const saltStr = salt || '';
  const seed = hashCode(`${dateStr}-${difficulty}-daily${saltStr}`);
  const random = mulberry32(seed);
  
  const minPop = thresholds[difficulty];
  const nextTierIdx = TIER_ORDER.indexOf(difficulty);
  const nextDiff = nextTierIdx > 0 ? TIER_ORDER[nextTierIdx - 1] : null;
  const maxPop = nextDiff ? thresholds[nextDiff] : Infinity;
  
  const eligible = cities.filter(c => c.population >= minPop && (maxPop === Infinity || c.population < maxPop));
  if (eligible.length === 0) {
    const fallback = cities.filter(c => c.population >= minPop);
    if (fallback.length === 0) return cities[Math.floor(random() * cities.length)];
    return fallback[Math.floor(random() * fallback.length)];
  }
  return eligible[Math.floor(random() * eligible.length)];
}

/**
 * Generate deterministic daily city index based on date and difficulty
 */
export function getDailyCityIndex(
  date: Date, cities: City[], difficulty: Difficulty,
  diffThresholds?: Record<Difficulty, number>
): number {
  const thresholds = diffThresholds || DIFFICULTY_THRESHOLDS;
  const dateStr = date.toISOString().split('T')[0];
  const seed = hashCode(`${dateStr}-${difficulty}`);
  const random = mulberry32(seed);
  
  const minPop = thresholds[difficulty];
  const eligibleCities = cities.filter(c => c.population >= minPop);
  
  return Math.floor(random() * eligibleCities.length);
}

/**
 * Get today's mystery city (for free play - uses bands)
 */
export function getTodaysMysteryCity(
  cities: City[], difficulty: Difficulty,
  diffThresholds?: Record<Difficulty, number>
): City {
  const eligible = filterCitiesByDifficulty(cities, difficulty, diffThresholds);
  const today = new Date();
  const seed = hashCode(`${today.toISOString().split('T')[0]}-${difficulty}-freeplay`);
  const random = mulberry32(seed);
  return eligible[Math.floor(random() * eligible.length)];
}

/**
 * Get day number since game launch (Feb 8, 2026)
 */
export function getDayNumber(): number {
  const launchDate = new Date('2026-02-08');
  const today = new Date();
  const diffTime = today.getTime() - launchDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Filter cities by difficulty band (population between this tier and next tier up)
 * Insane = all cities, each other tier has a floor and ceiling
 */
export function filterCitiesByDifficulty(
  cities: City[], difficulty: Difficulty,
  diffThresholds?: Record<Difficulty, number>
): City[] {
  const thresholds = diffThresholds || DIFFICULTY_THRESHOLDS;
  const minPop = thresholds[difficulty];
  const tierIdx = TIER_ORDER.indexOf(difficulty);
  // Next harder tier (one index lower) provides the ceiling
  const upperDiff = tierIdx > 0 ? TIER_ORDER[tierIdx - 1] : null;
  const maxPop = upperDiff ? thresholds[upperDiff] : Infinity;
  if (difficulty === 'insane') return cities.filter(c => c.population >= 0);
  return cities.filter(c => c.population >= minPop && (maxPop === Infinity || c.population < maxPop));
}

/**
 * Filter cities by exact difficulty band
 */
export function filterCitiesByBand(
  cities: City[], difficulty: Difficulty,
  diffThresholds?: Record<Difficulty, number>
): City[] {
  const thresholds = diffThresholds || DIFFICULTY_THRESHOLDS;
  const minPop = thresholds[difficulty];
  const tierIdx = TIER_ORDER.indexOf(difficulty);
  const nextDiff = tierIdx > 0 ? TIER_ORDER[tierIdx - 1] : null;
  const maxPop = nextDiff ? thresholds[nextDiff] : Infinity;
  return cities.filter(c => c.population >= minPop && (maxPop === Infinity || c.population < maxPop));
}

/**
 * Get today's date string
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate share text for free play
 */
function getPlayLink(mapId?: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return mapId ? `${base}?map=${mapId}` : base;
}

export function generateShareText(
  guesses: { color: GuessColor }[],
  dayNumber: number,
  difficulty: Difficulty,
  mapName: string,
  gaveUp?: boolean,
  mapEmoji?: string,
  t?: (key: string, vars?: Record<string, string>) => string,
  mapId?: string
): string {
  const emojis = guesses.map(g => getColorEmoji(g.color)).join('');
  const won = guesses[guesses.length - 1]?.color === 'correct';
  const status = gaveUp ? '🏳️' : won ? `${guesses.length}` : 'X';
  const flag = mapEmoji || '🗺️';
  const guesser = t ? t('share.guesser') : 'Guesser';
  const link = getPlayLink(mapId);
  
  return `${flag} ${mapName} ${guesser} #${dayNumber} (${difficulty}) - ${status}

${emojis}${gaveUp ? ' 🏳️' : ''}
${link}`;
}

/**
 * Generate daily challenge share text
 */
export function generateDailyShareText(
  highestTier: number, 
  totalGuesses: number, 
  tierGuesses: number[], 
  dayNumber: number,
  mapName: string,
  gaveUp?: boolean,
  mapEmoji?: string,
  t?: (key: string, vars?: Record<string, string>) => string,
  mapId?: string,
  singleTier?: boolean
): string {
  const flag = mapEmoji || '🗺️';
  const guesser = t ? t('share.guesser') : 'Guesser';
  const daily = t ? t('share.daily') : 'Daily';
  const link = getPlayLink(mapId);

  if (singleTier) {
    const guessWord = t ? t('share.guesses') : 'guesses';
    const status = gaveUp ? '🏳️' : `✅ ${totalGuesses} ${guessWord}`;
    return `${flag} ${mapName} ${guesser} ${daily} #${dayNumber}
${status}
${link}`;
  }

  const tierNames = ['⭐', '🟢', '🟠', '🧠'];
  const completed = tierGuesses.map((g, i) => `${tierNames[i]}${g}`).join(' ');
  const champion = !gaveUp && highestTier >= 3;
  
  const totalTiers = tierNames.length;
  
  let header: string;
  if (champion) {
    header = t 
      ? t('share.champion', { total: String(totalTiers), guesses: String(totalGuesses) })
      : `🏆 CHAMPION! Tier ${totalTiers}/${totalTiers} • ${totalGuesses} guesses`;
  } else {
    const tierText = t
      ? t('share.tier', { current: String(highestTier + 1), total: String(totalTiers), guesses: String(totalGuesses) })
      : `Tier ${highestTier + 1}/${totalTiers} • ${totalGuesses} guesses`;
    header = gaveUp ? `🏳️ ${tierText}` : tierText;
  }

  return `${flag} ${mapName} ${guesser} ${daily} #${dayNumber}
${header}
${completed}${gaveUp ? ' 🏳️' : ''}
${link}`;
}
