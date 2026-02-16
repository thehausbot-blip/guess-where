// City data types
export interface City {
  name: string;
  lat: number;
  lng: number;
  population: number;
  type?: string;
}

export interface CityData {
  cities: City[];
  count: number;
  difficulties: {
    easy: DifficultyTier;
    hard: DifficultyTier;
    insane: DifficultyTier;
  };
}

export interface DifficultyTier {
  min_pop: number;
  count: number;
}

export type Difficulty = 'veryEasy' | 'easy' | 'hard' | 'insane';

export type GameMode = 'daily' | 'freeplay';

// Game state types
export interface Guess {
  city: City;
  distance: number; // in miles
  color: GuessColor;
  timestamp: number;
  outOfBand?: boolean; // city exists but not in current difficulty pool
}

export type GuessColor = 'correct' | 'hot' | 'warm' | 'medium' | 'cool' | 'cold';

export interface GameState {
  mysteryCity: City | null;
  guesses: Guess[];
  isComplete: boolean;
  difficulty: Difficulty;
  dayNumber: number;
  mode: GameMode;
  // Daily challenge specific
  currentTier: number; // 0-3 index into TIER_ORDER
  totalGuesses: number; // across all tiers
  tierGuesses: number[]; // guesses per tier
  dailyComplete: boolean; // finished daily (won all or gave up)
  dailyGaveUp: boolean;
  // Level-up popup
  showLevelUp: boolean;
  levelUpCity: string | null;
  levelUpTier: number; // tier index that was just completed
  // Winning cities from previous tiers (kept on map)
  tierWinners: Guess[];
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[]; // index 0 = won in 1 guess, etc.
}

// Leaderboard types
export interface LeaderboardEntry {
  playerName: string;
  playerAvatar?: string;
  highestTier: number; // 0-3
  totalGuesses: number;
  timestamp: number;
  date: string; // YYYY-MM-DD
  tierGuesses: number[];
}

// Daily review types
export interface DailyReviewData {
  date: string;
  tiers: DailyReviewTier[];
  totalGuesses: number;
  gaveUp: boolean;
  gaveUpTierIndex: number; // -1 if completed all or champion
}

export interface DailyReviewTier {
  difficulty: Difficulty;
  mysteryCity: string;
  completed: boolean;
  guessCount: number; // 0 if not reached
  reached: boolean;
}

// Distance color thresholds (in miles)
export const DISTANCE_THRESHOLDS = {
  hot: 25,      // 0-25 miles
  warm: 75,     // 26-75 miles  
  medium: 150,  // 76-150 miles
  cool: 300,    // 151-300 miles
  cold: Infinity // 301+ miles
} as const;

// Difficulty population thresholds (defaults for Texas)
export const DIFFICULTY_THRESHOLDS: Record<Difficulty, number> = {
  veryEasy: 500000,
  easy: 25000,
  hard: 1000,
  insane: 0
};

// Tier order for daily challenge (4 tiers)
export const TIER_ORDER: Difficulty[] = ['veryEasy', 'easy', 'hard', 'insane'];

export const TIER_LABELS: Record<Difficulty, { label: string; emoji: string; popRange: string; description: string }> = {
  veryEasy: { label: 'Very Easy', emoji: '⭐', popRange: '500K+', description: 'Cities with population > 500,000' },
  easy: { label: 'Easy', emoji: '🟢', popRange: '25K+', description: 'Cities with population > 25,000' },
  hard: { label: 'Hard', emoji: '🟠', popRange: '1K+', description: 'Cities with population > 1,000' },
  insane: { label: 'Insane', emoji: '🧠', popRange: 'All', description: 'All cities' },
};

// Avatar options
export const AVATAR_OPTIONS = [
  // Texan
  '🤠', '🐴', '🦬', '🌵', '🛢️', '🏜️', '🤙',
  // Puerto Rican
  '🇵🇷', '🐸', '🌺', '🥥', '🦜',
  // Animals
  '🦅', '🐍', '🦎', '🦁', '🐊', '🦈', '🐺', '🦇', '🐉', '🦖',
  '🐙', '🦂', '🐻', '🦊', '🐯', '🦉', '🐋', '🦩',
  // Mythic / Power
  '🏛️', '⚡', '👑', '🔱', '💀', '👻', '👽', '🤖', '🧙', '🥷',
  '🧛', '🧟', '🦸', '🦹', '🫅',
  // Food & Fun
  '🌮', '🍕', '🌶️', '🍔', '🧁', '🍩', '🥑',
  // Sports & Games
  '🎯', '🏆', '🎮', '🎲', '⭐', '🔥', '💎', '🚀', '🛸',
  // Map & Explorer
  '🗺️', '🧭', '🏴‍☠️', '⛵', '🧳', '🌍',
];
