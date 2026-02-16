import { TIER_ORDER, TIER_LABELS } from '../types';
import { useI18n } from '../i18n/useI18n';

interface TierProgressProps {
  currentTier: number;
  tierGuesses: number[];
  totalGuesses: number;
  dailyComplete: boolean;
  dailyGaveUp: boolean;
  currentGuesses: number;
}

const DIFF_I18N_KEYS: Record<string, string> = {
  veryEasy: 'diff.veryEasy',
  easy: 'diff.easy',
  hard: 'diff.hard',
  insane: 'diff.insane',
};

export function TierProgress({ 
  currentTier, 
  tierGuesses, 
  totalGuesses, 
  dailyComplete, 
  dailyGaveUp,
  currentGuesses
}: TierProgressProps) {
  const { t } = useI18n();
  const isChampion = dailyComplete && !dailyGaveUp && tierGuesses.length >= TIER_ORDER.length;

  return (
    <div className="bg-white/10 backdrop-blur rounded-lg p-2 sm:p-4 border border-white/10">
      <div className="flex items-center justify-between mb-1 sm:mb-3">
        <h3 className="text-white font-semibold text-xs sm:text-base">
          {isChampion ? `🏆 ${t('result.champion')}` : dailyComplete ? `📊 ${t('result.review')}` : `${t('result.reachedTier', { current: String(currentTier + 1), total: String(TIER_ORDER.length) })}`}
        </h3>
        <span className="text-blue-200 text-xs sm:text-sm">
          {totalGuesses} {totalGuesses !== 1 ? t('tier.totalGuesses') : t('tier.totalGuess')}
        </span>
      </div>
      
      <div className="flex gap-1">
        {TIER_ORDER.map((diff, idx) => {
          const info = TIER_LABELS[diff];
          const completed = idx < tierGuesses.length;
          const isCurrent = idx === currentTier && !dailyComplete;
          const isLocked = idx > currentTier && !dailyComplete;
          const failed = dailyGaveUp && idx === currentTier;
          
          return (
            <div
              key={diff}
              className={`
                flex-1 rounded-md p-1 sm:p-2 text-center text-[10px] sm:text-xs font-medium transition-all
                ${completed ? 'bg-green-600/80 text-white' : ''}
                ${isCurrent ? 'bg-yellow-500/80 text-white ring-2 ring-yellow-300' : ''}
                ${failed ? 'bg-red-600/80 text-white' : ''}
                ${isLocked && !failed ? 'bg-white/5 text-white/30' : ''}
              `}
              title={completed ? `${tierGuesses[idx]} ${t('game.guesses')}` : ''}
            >
              <div className="text-sm sm:text-lg leading-none mb-0.5">{info.emoji}</div>
              <div className="truncate hidden sm:block">{t(DIFF_I18N_KEYS[diff])}</div>
              {completed && (
                <div className="text-green-200 mt-0.5">{tierGuesses[idx]}✓</div>
              )}
              {isCurrent && !dailyComplete && (
                <div className="text-yellow-200 mt-0.5">{currentGuesses}...</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
