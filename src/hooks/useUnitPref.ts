import { useState, useCallback } from 'react';

export type DistanceUnit = 'mi' | 'km';

const STORAGE_KEY = 'guesser-distance-unit';

export function useUnitPref(): [DistanceUnit, () => void] {
  const [unit, setUnit] = useState<DistanceUnit>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'km' ? 'km' : 'mi';
  });

  const toggle = useCallback(() => {
    setUnit(prev => {
      const next = prev === 'mi' ? 'km' : 'mi';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return [unit, toggle];
}

/** Convert miles to the display unit and round */
export function convertDistance(miles: number, unit: DistanceUnit): number {
  if (unit === 'km') return Math.round(miles * 1.60934);
  return miles; // already stored as rounded miles
}
