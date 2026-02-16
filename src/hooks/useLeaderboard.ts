import { useState, useEffect, useCallback } from 'react';
import type { LeaderboardEntry } from '../types';
import { getTodayString } from '../utils';

// Player name/avatar are global (shared across all maps)
const PLAYER_NAME_KEY = 'guesser-player-name';
const PLAYER_AVATAR_KEY = 'guesser-player-avatar';

export function useLeaderboard(storagePrefix: string) {
  const LEADERBOARD_KEY = `${storagePrefix}-leaderboard`;

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerAvatar, setPlayerAvatar] = useState<string>('🤠');

  useEffect(() => {
    const name = localStorage.getItem(PLAYER_NAME_KEY);
    if (name) setPlayerName(name);

    const avatar = localStorage.getItem(PLAYER_AVATAR_KEY);
    if (avatar) setPlayerAvatar(avatar);
  }, []);

  // Reload leaderboard entries when map changes
  useEffect(() => {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch { setEntries([]); }
    } else {
      setEntries([]);
    }
  }, [LEADERBOARD_KEY]);

  const savePlayerName = useCallback((name: string, avatar: string) => {
    setPlayerName(name);
    setPlayerAvatar(avatar);
    localStorage.setItem(PLAYER_NAME_KEY, name);
    localStorage.setItem(PLAYER_AVATAR_KEY, avatar);
  }, []);

  const saveAvatar = useCallback((avatar: string) => {
    setPlayerAvatar(avatar);
    localStorage.setItem(PLAYER_AVATAR_KEY, avatar);
  }, []);

  const addEntry = useCallback((entry: Omit<LeaderboardEntry, 'playerName' | 'playerAvatar' | 'date' | 'timestamp'>) => {
    const newEntry: LeaderboardEntry = {
      ...entry,
      playerName,
      playerAvatar,
      date: getTodayString(),
      timestamp: Date.now(),
    };

    setEntries(prev => {
      const filtered = prev.filter(
        e => !(e.playerName === playerName && e.date === newEntry.date)
      );
      const updated = [...filtered, newEntry];
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [playerName, playerAvatar, LEADERBOARD_KEY]);

  const todayEntries = entries
    .filter(e => e.date === getTodayString())
    .sort((a, b) => {
      if (a.highestTier !== b.highestTier) return b.highestTier - a.highestTier;
      if (a.totalGuesses !== b.totalGuesses) return a.totalGuesses - b.totalGuesses;
      return a.timestamp - b.timestamp;
    });

  const bestEntry = entries
    .filter(e => e.playerName === playerName)
    .sort((a, b) => {
      if (a.highestTier !== b.highestTier) return b.highestTier - a.highestTier;
      return a.totalGuesses - b.totalGuesses;
    })[0] || null;

  return {
    entries,
    todayEntries,
    bestEntry,
    playerName,
    playerAvatar,
    savePlayerName,
    saveAvatar,
    addEntry,
    needsName: !playerName,
  };
}
