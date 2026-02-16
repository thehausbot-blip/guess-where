import type { LeaderboardEntry } from '../types';
import { TIER_ORDER, TIER_LABELS } from '../types';
import { useI18n } from '../i18n/useI18n';

interface LeaderboardProps {
  todayEntries: LeaderboardEntry[];
  bestEntry: LeaderboardEntry | null;
  playerName: string;
}

export function Leaderboard({ todayEntries, bestEntry, playerName }: LeaderboardProps) {
  const { t } = useI18n();

  return (
    <div className="bg-white/10 backdrop-blur rounded-lg p-5 border border-white/10">
      <h3 className="text-white font-semibold text-lg mb-4">🏆 {t('result.leaderboard')}</h3>
      
      {todayEntries.length > 0 ? (
        <div className="mb-4">
          <div className="space-y-2">
            {todayEntries.map((entry, idx) => {
              const tierInfo = TIER_LABELS[TIER_ORDER[entry.highestTier]];
              const isMe = entry.playerName === playerName;
              return (
                <div
                  key={`${entry.playerName}-${entry.timestamp}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                    isMe ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold w-6">{idx + 1}.</span>
                    <span className="text-lg">{entry.playerAvatar || '🤠'}</span>
                    <span className={`text-white ${isMe ? 'font-bold' : ''}`}>
                      {entry.playerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-200">
                      {tierInfo.emoji} {entry.highestTier + 1}/{TIER_ORDER.length}
                    </span>
                    <span className="text-white font-medium">
                      {entry.totalGuesses} {entry.totalGuesses !== 1 ? t('game.guesses') : t('game.guess_singular')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-blue-200/50 text-sm mb-4">—</p>
      )}

      {bestEntry && (
        <div className="border-t border-white/10 pt-3">
          <h4 className="text-blue-200 text-sm font-medium mb-2">⭐ {t('stats.best')}</h4>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              <span className="text-lg">{bestEntry.playerAvatar || '🤠'}</span>
              <span className="text-white">
                {TIER_LABELS[TIER_ORDER[bestEntry.highestTier]].emoji} {bestEntry.highestTier + 1}/{TIER_ORDER.length}
              </span>
            </div>
            <span className="text-blue-200 text-sm">
              {bestEntry.totalGuesses} {t('game.guesses')} • {bestEntry.date}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
