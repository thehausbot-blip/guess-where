import { useState, useEffect, useCallback } from 'react';
import type { LeaderboardEntry } from '../types';
import { getTodayString } from '../utils';
import { saveDailyResult, fetchDailyLeaderboard, isConfigured } from '../firebase';

// Player name/avatar are global (shared across all maps)
const PLAYER_NAME_KEY = 'guesser-player-name';
const PLAYER_AVATAR_KEY = 'guesser-player-avatar';

export function useLeaderboard(storagePrefix: string, mapId?: string) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerAvatar, setPlayerAvatar] = useState<string>('🤠');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem(PLAYER_NAME_KEY);
    if (name) setPlayerName(name);
    const avatar = localStorage.getItem(PLAYER_AVATAR_KEY);
    if (avatar) setPlayerAvatar(avatar);
  }, []);

  // Fetch leaderboard from Firestore on mount and when map changes
  const fetchLeaderboard = useCallback(async () => {
    const effectiveMapId = mapId || storagePrefix;
    if (!isConfigured) return;
    setLoading(true);
    try {
      const today = getTodayString();
      const results = await fetchDailyLeaderboard(effectiveMapId, today);
      const firestoreEntries: LeaderboardEntry[] = results.map(r => ({
        playerName: r.displayName,
        playerAvatar: r.avatar,
        highestTier: r.highestTier,
        totalGuesses: r.totalGuesses,
        tierGuesses: r.tierGuesses,
        date: today,
        timestamp: 0,
      }));
      setEntries(firestoreEntries);
    } catch (err) {
      console.error('Leaderboard fetch failed:', err);
      // Fallback to localStorage
      const LEADERBOARD_KEY = `${storagePrefix}-leaderboard`;
      const saved = localStorage.getItem(LEADERBOARD_KEY);
      if (saved) {
        try { setEntries(JSON.parse(saved)); } catch { setEntries([]); }
      }
    } finally {
      setLoading(false);
    }
  }, [mapId, storagePrefix]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

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

  const addEntry = useCallback(async (
    entry: Omit<LeaderboardEntry, 'playerName' | 'playerAvatar' | 'date' | 'timestamp'>,
    uid?: string
  ) => {
    const today = getTodayString();
    const newEntry: LeaderboardEntry = {
      ...entry,
      playerName,
      playerAvatar,
      date: today,
      timestamp: Date.now(),
    };

    // Save to localStorage as fallback
    const LEADERBOARD_KEY = `${storagePrefix}-leaderboard`;
    setEntries(prev => {
      const filtered = prev.filter(
        e => !(e.playerName === playerName && e.date === today)
      );
      const updated = [...filtered, newEntry];
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
      return updated;
    });

    // Save to Firestore
    const effectiveMapId = mapId || storagePrefix;
    const odGuestId = uid || `guest_${playerName.replace(/\s+/g, '_').toLowerCase()}`;
    try {
      await saveDailyResult(odGuestId, effectiveMapId, {
        displayName: playerName,
        avatar: playerAvatar,
        highestTier: entry.highestTier,
        totalGuesses: entry.totalGuesses,
        tierGuesses: entry.tierGuesses,
        date: today,
      });
      // Re-fetch to get everyone's scores
      await fetchLeaderboard();
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
    }
  }, [playerName, playerAvatar, storagePrefix, mapId, fetchLeaderboard]);

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
    loading,
    refresh: fetchLeaderboard,
  };
}
