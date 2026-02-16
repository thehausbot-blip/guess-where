import { useState, useEffect, useCallback, useRef } from 'react';
import type { City, CityData, Difficulty, GameState, Guess, GameStats, GameMode, DailyReviewData, DailyReviewTier } from '../types';
import { TIER_ORDER } from '../types';
import type { MapConfig } from '../mapConfigs';
import { 
  getGuessColor, 
  getTodaysMysteryCity, 
  getDayNumber,
  filterCitiesByDifficulty,
  getDailyCity,
  getTodayString,
} from '../utils';
import { calculateBorderDistance, type BoundaryMap } from '../boundaryDistance';

interface UseGameReturn {
  gameState: GameState;
  cities: City[];
  eligibleCities: City[];
  stats: GameStats;
  makeGuess: (cityName: string) => boolean;
  changeDifficulty: (difficulty: Difficulty) => void;
  giveUp: () => void;
  newGame: (randomCity?: boolean) => void;
  setMode: (mode: GameMode) => void;
  dismissLevelUp: () => void;
  dailyReview: DailyReviewData | null;
  debugMode: boolean;
  setDebugMode: (enabled: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

function createInitialGameState(): GameState {
  return {
    mysteryCity: null,
    guesses: [],
    isComplete: false,
    difficulty: 'veryEasy',
    dayNumber: getDayNumber(),
    mode: 'daily',
    currentTier: 0,
    totalGuesses: 0,
    tierGuesses: [],
    dailyComplete: false,
    dailyGaveUp: false,
    showLevelUp: false,
    levelUpCity: null,
    levelUpTier: 0,
    tierWinners: [],
  };
}

export function useGame(mapConfig: MapConfig): UseGameReturn {
  const STORAGE_KEY = mapConfig.storagePrefix;
  const DAILY_STORAGE_KEY = `${mapConfig.storagePrefix}-daily`;
  const DAILY_REVIEW_KEY = `${mapConfig.storagePrefix}-daily-review`;
  
  const diffThresholds = mapConfig.difficultyThresholds;
  const dailyTiers = mapConfig.dailyTiers;
  const dailySalt = localStorage.getItem(`${mapConfig.storagePrefix}-daily-salt`) || '';

  const [cityData, setCityData] = useState<CityData | null>(null);
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: []
  });
  const [dailyReview, setDailyReview] = useState<DailyReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const boundariesRef = useRef<BoundaryMap>({});
  const [debugMode, setDebugMode] = useState(false);

  // Load city data when map changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setCityData(null);
    setGameState(createInitialGameState());
    setDailyReview(null);

    async function loadData() {
      try {
        const response = await fetch(mapConfig.cityDataFile);
        if (!response.ok) throw new Error('Failed to load city data');
        const raw = await response.json();
        // Support both {cities: [...]} and plain [...] formats
        const cities: City[] = Array.isArray(raw) ? raw : (raw.cities || []);
        // Clean city names: strip state suffixes like "Jacksonville city, Florida"
        for (const city of cities) {
          // Remove ", State" suffix and "city/town/village/CDP" labels
          city.name = city.name
            .replace(/\s+(city|town|village|CDP|borough|municipality),?\s*.*/i, '')
            .replace(/,\s+\w[\w\s]*$/, '')
            .trim();
        }
        const data: CityData = { cities, count: cities.length, difficulties: {} as any };
        setCityData(data);
        setIsLoading(false);

        // Load boundaries in background for distance calculations
        if (mapConfig.boundaryFile) {
          fetch(mapConfig.boundaryFile)
            .then(res => {
              if (!res.ok) throw new Error('not found');
              return res.json();
            })
            .then((geoData: GeoJSON.FeatureCollection) => {
              const bMap: BoundaryMap = {};
              for (const feature of geoData.features) {
                let name = (feature.properties as { name?: string; NAME?: string })?.name
                  || (feature.properties as { NAME?: string })?.NAME;
                if (name) {
                  name = name
                    .replace(/\s+(city|town|village|CDP|borough|municipality),?\s*.*/i, '')
                    .replace(/,\s+\w[\w\s]*$/, '')
                    .trim();
                  bMap[name.toLowerCase()] = feature;
                }
              }
              boundariesRef.current = bMap;
            })
            .catch(() => { /* boundaries not available yet */ });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    }
    loadData();
  }, [mapConfig.id]);

  // Load saved state from localStorage
  useEffect(() => {
    if (!cityData) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.stats) setStats(parsed.stats);
      } catch { console.warn('Failed to load saved state'); }
    }

    const reviewSaved = localStorage.getItem(DAILY_REVIEW_KEY);
    if (reviewSaved) {
      try {
        const parsed = JSON.parse(reviewSaved);
        if (parsed.date === getTodayString()) setDailyReview(parsed);
      } catch { /* ignore */ }
    }

    const dailySaved = localStorage.getItem(DAILY_STORAGE_KEY);
    if (dailySaved) {
      try {
        const parsed = JSON.parse(dailySaved);
        if (parsed.date === getTodayString()) {
          setGameState(prev => ({
            ...prev,
            mode: 'daily',
            currentTier: parsed.currentTier ?? 0,
            totalGuesses: parsed.totalGuesses ?? 0,
            tierGuesses: parsed.tierGuesses ?? [],
            guesses: parsed.guesses ?? [],
            isComplete: parsed.isComplete ?? false,
            dailyComplete: parsed.dailyComplete ?? false,
            dailyGaveUp: parsed.dailyGaveUp ?? false,
            tierWinners: parsed.tierWinners ?? [],
            difficulty: dailyTiers[parsed.currentTier ?? 0],
            showLevelUp: false,
            levelUpCity: null,
            levelUpTier: 0,
          }));
        }
      } catch { console.warn('Failed to load daily state'); }
    }
  }, [cityData, STORAGE_KEY, DAILY_STORAGE_KEY, DAILY_REVIEW_KEY, dailyTiers]);

  // Initialize mystery city
  useEffect(() => {
    if (!cityData) return;
    
    if (gameState.mode === 'daily') {
      if (!gameState.dailyComplete && !gameState.showLevelUp) {
        const difficulty = dailyTiers[gameState.currentTier];
        if (!difficulty) return;
        const mystery = getDailyCity(new Date(), cityData.cities, difficulty, diffThresholds, dailySalt);
        setGameState(prev => ({ ...prev, mysteryCity: mystery, difficulty }));
      }
    } else {
      const mystery = getTodaysMysteryCity(cityData.cities, gameState.difficulty, diffThresholds);
      setGameState(prev => ({ ...prev, mysteryCity: mystery }));
    }
  }, [cityData, gameState.mode, gameState.difficulty, gameState.currentTier, gameState.dailyComplete, gameState.showLevelUp, dailyTiers, diffThresholds]);

  // Save stats
  useEffect(() => {
    if (!isLoading && cityData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stats }));
    }
  }, [stats, isLoading, cityData, STORAGE_KEY]);

  // Save daily state
  useEffect(() => {
    if (!isLoading && cityData && gameState.mode === 'daily') {
      localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify({
        date: getTodayString(),
        currentTier: gameState.currentTier,
        totalGuesses: gameState.totalGuesses,
        tierGuesses: gameState.tierGuesses,
        guesses: gameState.guesses,
        isComplete: gameState.isComplete,
        dailyComplete: gameState.dailyComplete,
        dailyGaveUp: gameState.dailyGaveUp,
        tierWinners: gameState.tierWinners,
      }));
    }
  }, [gameState, isLoading, cityData, DAILY_STORAGE_KEY]);

  const buildDailyReview = useCallback((
    tierGuesses: number[],
    currentTier: number,
    totalGuesses: number,
    gaveUp: boolean,
    cities: City[]
  ): DailyReviewData => {
    const tiers: DailyReviewTier[] = dailyTiers.map((diff, idx) => {
      const mystery = getDailyCity(new Date(), cities, diff, diffThresholds, dailySalt);
      const completed = idx < tierGuesses.length;
      const reached = idx <= currentTier;
      return {
        difficulty: diff,
        mysteryCity: mystery.name,
        completed,
        guessCount: completed ? tierGuesses[idx] : 0,
        reached,
      };
    });

    const review: DailyReviewData = {
      date: getTodayString(),
      tiers,
      totalGuesses,
      gaveUp,
      gaveUpTierIndex: gaveUp ? currentTier : -1,
    };
    localStorage.setItem(DAILY_REVIEW_KEY, JSON.stringify(review));
    return review;
  }, [dailyTiers, diffThresholds, DAILY_REVIEW_KEY]);

  const makeGuess = useCallback((cityName: string): boolean => {
    if (!cityData || !gameState.mysteryCity || gameState.isComplete || gameState.showLevelUp) {
      return false;
    }
    if (gameState.mode === 'daily' && gameState.dailyComplete) {
      return false;
    }

    const normalizedName = cityName.toLowerCase().trim();
    const city = cityData.cities.find(c => c.name.toLowerCase() === normalizedName);
    if (!city) return false;

    if (gameState.guesses.some(g => g.city.name.toLowerCase() === normalizedName)) {
      return false;
    }

    const distance = calculateBorderDistance(
      city,
      gameState.mysteryCity,
      boundariesRef.current
    );
    
    // Correct only if it's actually the mystery city (not just distance === 0)
    const isCorrectCity = city.name.toLowerCase() === gameState.mysteryCity.name.toLowerCase();
    const color = isCorrectCity ? 'correct' as const : getGuessColor(distance, mapConfig.distanceThresholds);

    const minPop = diffThresholds[gameState.difficulty];
    const tierIdx = TIER_ORDER.indexOf(gameState.difficulty);
    const upperDiff = tierIdx > 0 ? TIER_ORDER[tierIdx - 1] : null;
    const maxPop = upperDiff ? diffThresholds[upperDiff] : Infinity;
    const outOfBand = gameState.difficulty === 'insane' ? false 
      : (city.population < minPop || city.population >= maxPop);

    const newGuess: Guess = {
      city,
      distance: Math.round(distance),
      color,
      timestamp: Date.now(),
      outOfBand,
    };

    const newGuesses = [...gameState.guesses, newGuess];
    const isWin = isCorrectCity;

    if (gameState.mode === 'daily') {
      const newTotalGuesses = gameState.totalGuesses + 1;
      
      if (isWin) {
        const newTierGuesses = [...gameState.tierGuesses, newGuesses.length];
        const nextTier = gameState.currentTier + 1;
        
        if (nextTier >= dailyTiers.length) {
          const review = buildDailyReview(newTierGuesses, gameState.currentTier, newTotalGuesses, false, cityData.cities);
          setDailyReview(review);
          setGameState(prev => ({
            ...prev,
            guesses: newGuesses,
            isComplete: true,
            dailyComplete: true,
            totalGuesses: newTotalGuesses,
            tierGuesses: newTierGuesses,
            showLevelUp: true,
            levelUpCity: gameState.mysteryCity!.name,
            levelUpTier: gameState.currentTier,
          }));
        } else {
          setGameState(prev => ({
            ...prev,
            guesses: newGuesses,
            totalGuesses: newTotalGuesses,
            tierGuesses: newTierGuesses,
            showLevelUp: true,
            levelUpCity: gameState.mysteryCity!.name,
            levelUpTier: gameState.currentTier,
          }));
        }
      } else {
        setGameState(prev => ({
          ...prev,
          guesses: newGuesses,
          totalGuesses: newTotalGuesses,
        }));
      }
    } else {
      const isComplete = isWin;
      setGameState(prev => ({
        ...prev,
        guesses: newGuesses,
        isComplete
      }));

      if (isComplete) {
        setStats(prev => {
          const newStats = { ...prev };
          newStats.gamesPlayed++;
          if (isWin) {
            newStats.gamesWon++;
            newStats.currentStreak++;
            newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
            while (newStats.guessDistribution.length < newGuesses.length) {
              newStats.guessDistribution.push(0);
            }
            newStats.guessDistribution[newGuesses.length - 1]++;
          } else {
            newStats.currentStreak = 0;
          }
          return newStats;
        });
      }
    }

    return true;
  }, [cityData, gameState, buildDailyReview, mapConfig.distanceThresholds, diffThresholds, dailyTiers.length]);

  const dismissLevelUp = useCallback(() => {
    const nextTier = gameState.levelUpTier + 1;
    if (nextTier >= dailyTiers.length || gameState.dailyComplete) {
      setGameState(prev => ({
        ...prev,
        showLevelUp: false,
        levelUpCity: null,
      }));
    } else {
      // Save the winning guess from this tier
      const winningGuess = gameState.guesses.find(g => g.color === 'correct');
      setGameState(prev => ({
        ...prev,
        guesses: [],
        isComplete: false,
        currentTier: nextTier,
        difficulty: dailyTiers[nextTier],
        mysteryCity: null,
        showLevelUp: false,
        levelUpCity: null,
        tierWinners: winningGuess ? [...prev.tierWinners, winningGuess] : prev.tierWinners,
      }));
    }
  }, [gameState.levelUpTier, gameState.dailyComplete, gameState.guesses, dailyTiers]);

  const changeDifficulty = useCallback((difficulty: Difficulty) => {
    if (gameState.mode === 'daily') return;
    setGameState(prev => ({
      ...prev,
      difficulty,
      guesses: [],
      isComplete: false,
      mysteryCity: null
    }));
  }, [gameState.mode]);

  const giveUp = useCallback(() => {
    if (gameState.isComplete || gameState.dailyComplete) return;
    
    if (gameState.mode === 'daily') {
      if (cityData) {
        const review = buildDailyReview(
          gameState.tierGuesses,
          gameState.currentTier,
          gameState.totalGuesses,
          true,
          cityData.cities
        );
        setDailyReview(review);
      }
      setGameState(prev => ({
        ...prev,
        isComplete: true,
        dailyComplete: true,
        dailyGaveUp: true,
      }));
    } else {
      setGameState(prev => ({ ...prev, isComplete: true }));
      setStats(prev => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        currentStreak: 0
      }));
    }
  }, [gameState, cityData, buildDailyReview]);

  const newGame = useCallback((_randomCity: boolean = false) => {
    if (!cityData) return;
    
    const difficulty = gameState.mode === 'freeplay' ? gameState.difficulty : 'easy';
    const eligible = filterCitiesByDifficulty(cityData.cities, difficulty, diffThresholds);
    const randomIndex = Math.floor(Math.random() * eligible.length);
    const mystery = eligible[randomIndex];
    
    setGameState({
      ...createInitialGameState(),
      mode: 'freeplay',
      mysteryCity: mystery,
      difficulty,
      dayNumber: Date.now(),
    });
  }, [cityData, gameState.mode, gameState.difficulty, diffThresholds]);

  const setMode = useCallback((mode: GameMode) => {
    if (!cityData) return;
    
    if (mode === 'daily') {
      const dailySaved = localStorage.getItem(DAILY_STORAGE_KEY);
      if (dailySaved) {
        try {
          const parsed = JSON.parse(dailySaved);
          if (parsed.date === getTodayString()) {
            setGameState(prev => ({
              ...prev,
              mode: 'daily',
              currentTier: parsed.currentTier ?? 0,
              totalGuesses: parsed.totalGuesses ?? 0,
              tierGuesses: parsed.tierGuesses ?? [],
              guesses: parsed.guesses ?? [],
              isComplete: parsed.isComplete ?? false,
              dailyComplete: parsed.dailyComplete ?? false,
              dailyGaveUp: parsed.dailyGaveUp ?? false,
            tierWinners: parsed.tierWinners ?? [],
              difficulty: dailyTiers[parsed.currentTier ?? 0],
              dayNumber: getDayNumber(),
              showLevelUp: false,
              levelUpCity: null,
              levelUpTier: 0,
            }));
            return;
          }
        } catch { /* ignore */ }
      }
      setGameState({
        ...createInitialGameState(),
        mode: 'daily',
      });
    } else {
      const eligible = filterCitiesByDifficulty(cityData.cities, 'easy', diffThresholds);
      const randomIndex = Math.floor(Math.random() * eligible.length);
      setGameState({
        ...createInitialGameState(),
        mode: 'freeplay',
        difficulty: 'easy',
        mysteryCity: eligible[randomIndex],
      });
    }
  }, [cityData, DAILY_STORAGE_KEY, dailyTiers, diffThresholds]);

  const cities = cityData?.cities || [];
  const eligibleCities = cityData 
    ? filterCitiesByDifficulty(cityData.cities, gameState.difficulty, diffThresholds)
    : [];

  return {
    gameState,
    cities,
    eligibleCities,
    stats,
    makeGuess,
    changeDifficulty,
    giveUp,
    newGame,
    setMode,
    dismissLevelUp,
    dailyReview,
    debugMode,
    setDebugMode,
    isLoading,
    error
  };
}
