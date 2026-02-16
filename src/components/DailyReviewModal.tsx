import type { DailyReviewData } from '../types';
import { TIER_LABELS, TIER_ORDER } from '../types';
import { useI18n } from '../i18n/useI18n';

const DIFF_I18N: Record<string, string> = {
  veryEasy: 'diff.veryEasy', easy: 'diff.easy',
  hard: 'diff.hard', insane: 'diff.insane',
};

interface DailyReviewModalProps {
  review: DailyReviewData;
  onDismiss: () => void;
}

export function DailyReviewModal({ review, onDismiss }: DailyReviewModalProps) {
  const { t } = useI18n();
  const completedCount = review.tiers.filter(tr => tr.completed).length;
  const isChampion = completedCount >= TIER_ORDER.length;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#001a45] border border-white/20 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-white text-xl font-bold mb-1 text-center">
          {isChampion ? '🏆' : '📊'} {t('game.dailyChallenge')}
        </h2>
        {isChampion && (
          <p className="text-yellow-400 text-center font-bold mb-3">{t('result.champion')}</p>
        )}

        <div className="space-y-2 mb-4">
          {review.tiers.map((tier, idx) => {
            const info = TIER_LABELS[tier.difficulty];
            const isGaveUpTier = review.gaveUp && idx === review.gaveUpTierIndex;

            return (
              <div
                key={tier.difficulty}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${
                  tier.completed
                    ? 'bg-green-900/40 border border-green-500/30'
                    : isGaveUpTier
                      ? 'bg-red-900/40 border border-red-500/30'
                      : !tier.reached
                        ? 'bg-white/5 border border-white/5 opacity-50'
                        : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{info.emoji}</span>
                  <div>
                    <span className="text-white font-medium text-sm">{t(DIFF_I18N[tier.difficulty])}</span>
                    {tier.completed && <span className="text-green-400 ml-2 text-xs">✅</span>}
                    {isGaveUpTier && <span className="text-red-400 ml-2 text-xs">❌</span>}
                  </div>
                </div>
                <div className="text-right text-sm">
                  {tier.completed ? (
                    <div>
                      <span className="text-green-300">{tier.guessCount} {tier.guessCount !== 1 ? t('game.guesses') : t('game.guess_singular')}</span>
                      <div className="text-blue-200/60 text-xs">{tier.mysteryCity}</div>
                    </div>
                  ) : isGaveUpTier ? (
                    <div>
                      <span className="text-red-300 text-xs">{t('result.answerWas')}: <strong>{tier.mysteryCity}</strong></span>
                    </div>
                  ) : !tier.reached ? (
                    <span className="text-white/30 text-xs">—</span>
                  ) : (
                    <span className="text-white/50 text-xs">{tier.mysteryCity}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center border-t border-white/10 pt-3 mb-4">
          <span className="text-blue-200 text-sm">
            {t('game.total')}: <strong className="text-white">{review.totalGuesses}</strong> {t('game.guesses')} •{' '}
            <strong className="text-white">{completedCount}/6</strong>
          </span>
        </div>

        <button
          onClick={onDismiss}
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
