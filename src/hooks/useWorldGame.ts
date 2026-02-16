import { useState, useEffect, useCallback } from 'react';
import { WORLD_COUNTRIES_DATA, findCountry, type WorldCountry } from '../worldGameData';
import { getDayNumber } from '../utils';

export interface WorldGuess {
  country: WorldCountry;
  distance: number; // km
  direction: string; // arrow emoji
  color: 'correct' | 'hot' | 'warm' | 'medium' | 'cool';
  timestamp: number;
}

export interface WorldGameState {
  target: WorldCountry | null;
  guesses: WorldGuess[];
  isComplete: boolean;
  gaveUp: boolean;
  mode: 'daily' | 'freeplay';
}

const STORAGE_KEY = 'world-countries-daily';

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

function toDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

export function calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function bearingToArrow(bearing: number): string {
  const arrows = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];
  const index = Math.round(bearing / 45) % 8;
  return arrows[index];
}

export function getWorldGuessColor(distance: number): WorldGuess['color'] {
  if (distance < 1) return 'correct';
  if (distance < 1000) return 'hot';
  if (distance < 3000) return 'warm';
  if (distance < 6000) return 'medium';
  return 'cool';
}

export function getWorldColorHex(color: WorldGuess['color']): string {
  const map: Record<WorldGuess['color'], string> = {
    correct: '#22c55e',
    hot: '#ef4444',
    warm: '#f97316',
    medium: '#eab308',
    cool: '#3b82f6',
  };
  return map[color];
}

// Seeded RNG
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function mulberry32(seed: number) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function getDailyCountry(date: Date): WorldCountry {
  const dateStr = date.toISOString().split('T')[0];
  const seed = hashCode(`${dateStr}-world-daily`);
  const rng = mulberry32(seed);
  return WORLD_COUNTRIES_DATA[Math.floor(rng() * WORLD_COUNTRIES_DATA.length)];
}

interface SavedState {
  date: string;
  targetIso: string;
  guesses: { iso: string; distance: number; direction: string; color: WorldGuess['color']; timestamp: number }[];
  isComplete: boolean;
  gaveUp: boolean;
}

export function useWorldGame() {
  const [gameState, setGameState] = useState<WorldGameState>({
    target: null, guesses: [], isComplete: false, gaveUp: false, mode: 'daily',
  });

  // Initialize
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data: SavedState = JSON.parse(saved);
        if (data.date === today) {
          const target = WORLD_COUNTRIES_DATA.find(c => c.iso === data.targetIso) || getDailyCountry(new Date());
          const guesses: WorldGuess[] = data.guesses.map(g => {
            const country = WORLD_COUNTRIES_DATA.find(c => c.iso === g.iso);
            return country ? { country, distance: g.distance, direction: g.direction, color: g.color, timestamp: g.timestamp } : null;
          }).filter(Boolean) as WorldGuess[];
          setGameState({ target, guesses, isComplete: data.isComplete, gaveUp: data.gaveUp, mode: 'daily' });
          return;
        }
      } catch { /* ignore */ }
    }
    setGameState(prev => ({ ...prev, target: getDailyCountry(new Date()) }));
  }, []);

  // Save state
  useEffect(() => {
    if (!gameState.target) return;
    const data: SavedState = {
      date: new Date().toISOString().split('T')[0],
      targetIso: gameState.target.iso,
      guesses: gameState.guesses.map(g => ({
        iso: g.country.iso, distance: g.distance, direction: g.direction, color: g.color, timestamp: g.timestamp,
      })),
      isComplete: gameState.isComplete,
      gaveUp: gameState.gaveUp,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [gameState]);

  const makeGuess = useCallback((name: string): boolean => {
    const { target, guesses, isComplete } = gameState;
    if (!target || isComplete) return false;

    const country = findCountry(name);
    if (!country) return false;
    if (guesses.some(g => g.country.iso === country.iso)) return false;

    const distance = calculateDistanceKm(country.lat, country.lng, target.lat, target.lng);
    const isCorrect = country.iso === target.iso;
    const color = isCorrect ? 'correct' as const : getWorldGuessColor(distance);
    const direction = isCorrect ? '✅' : bearingToArrow(calculateBearing(country.lat, country.lng, target.lat, target.lng));

    const guess: WorldGuess = { country, distance: Math.round(distance), direction, color, timestamp: Date.now() };
    setGameState(prev => ({
      ...prev,
      guesses: [guess, ...prev.guesses],
      isComplete: isCorrect,
    }));
    return true;
  }, [gameState]);

  const giveUp = useCallback(() => {
    setGameState(prev => ({ ...prev, isComplete: true, gaveUp: true }));
  }, []);

  const newGame = useCallback(() => {
    const rng = mulberry32(Date.now());
    const target = WORLD_COUNTRIES_DATA[Math.floor(rng() * WORLD_COUNTRIES_DATA.length)];
    setGameState({ target, guesses: [], isComplete: false, gaveUp: false, mode: 'freeplay' });
  }, []);

  const generateShareText = useCallback((): string => {
    const { guesses, gaveUp: gave } = gameState;
    const dayNum = getDayNumber();
    const arrows = [...guesses].reverse().map(g => g.direction).join('');

    if (gave) {
      return `🌍 World Guesser — Daily #${dayNum}\nGave up after ${guesses.length} guesses\n${arrows}\nThink you can do better?\n👉 https://guess-where.app?map=world-countries`;
    }
    const reaction = guesses.length === 1 ? '🤯' : guesses.length <= 3 ? '🔥' : guesses.length <= 5 ? '💪' : guesses.length <= 10 ? '👍' : '😅';
    return `🌍 World Guesser — Daily #${dayNum}\nGot it in ${guesses.length} ${guesses.length === 1 ? 'guess' : 'guesses'}! ${reaction}\n${arrows}\nCan you beat my score?\n👉 https://guess-where.app?map=world-countries`;
  }, [gameState]);

  return { gameState, makeGuess, giveUp, newGame, generateShareText };
}
