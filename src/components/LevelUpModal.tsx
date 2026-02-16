import { TIER_ORDER, TIER_LABELS } from '../types';
import { useI18n } from '../i18n/useI18n';

const DIFF_I18N: Record<string, string> = {
  veryEasy: 'diff.veryEasy', easy: 'diff.easy',
  hard: 'diff.hard', insane: 'diff.insane',
};

function getGuessMessage(count: number): { emoji: string; text: string } {
  if (count === 1) return { emoji: '🤯', text: 'First try! Incredible!' };
  if (count <= 3) return { emoji: '🔥', text: 'Amazing! You nailed it!' };
  if (count <= 5) return { emoji: '💪', text: 'Great job!' };
  if (count <= 10) return { emoji: '👍', text: 'Nice work!' };
  if (count <= 15) return { emoji: '😅', text: 'You worked for that one!' };
  if (count <= 25) return { emoji: '🧭', text: 'The scenic route, but you made it!' };
  return { emoji: '🗺️', text: 'Every guess was a learning experience!' };
}

interface LevelUpModalProps {
  cityName: string;
  tierIndex: number;
  onContinue: () => void;
  singleTier?: boolean;
  guessCount?: number;
}

export function LevelUpModal({ cityName, tierIndex, onContinue, singleTier, guessCount = 0 }: LevelUpModalProps) {
  const { t } = useI18n();
  const tierInfo = TIER_LABELS[TIER_ORDER[tierIndex]];
  const isChampion = tierIndex >= TIER_ORDER.length - 1;

  if (singleTier) {
    const msg = getGuessMessage(guessCount);
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
        <div className="bg-[#001a45] border-2 border-green-500 rounded-xl p-8 max-w-sm w-full shadow-2xl text-center animate-bounce-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Correct! <span className="text-red-400">{cityName}</span>!
          </h2>
          <p className="text-4xl my-3">{msg.emoji}</p>
          <p className="text-blue-200 text-lg mb-2">
            {guessCount} {guessCount === 1 ? 'guess' : 'guesses'}
          </p>
          <p className="text-yellow-300 text-lg font-semibold mb-6">
            {msg.text}
          </p>
          <button
            onClick={onContinue}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-lg transition-colors"
          >
            🏆 Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#001a45] border-2 border-yellow-500 rounded-xl p-8 max-w-sm w-full shadow-2xl text-center animate-bounce-in">
        {isChampion ? (
          <>
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">{t('result.champion')}</h2>
            <p className="text-white text-lg mb-2">
              🎉 {t('guessList.correct')} <span className="font-bold text-red-400">{cityName}</span>!
            </p>
            <p className="text-blue-200 mb-2">
              {tierInfo.emoji} {t(DIFF_I18N[TIER_ORDER[tierIndex]])} ✅
            </p>
            <p className="text-yellow-300 text-lg font-semibold mb-6">
              🤠🇨🇱
            </p>
            <button
              onClick={onContinue}
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-bold text-lg transition-colors"
            >
              🏆 {t('result.review')}
            </button>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('guessList.correct')} <span className="text-red-400">{cityName}</span>!
            </h2>
            <p className="text-blue-200 text-lg mb-2">
              {tierInfo.emoji} {t(DIFF_I18N[TIER_ORDER[tierIndex]])} ✅
            </p>
            <div className="my-4 py-3 px-4 bg-white/10 rounded-lg border border-white/10">
              <p className="text-xl font-bold text-white">
                {TIER_LABELS[TIER_ORDER[tierIndex + 1]].emoji}{' '}
                {t(DIFF_I18N[TIER_ORDER[tierIndex + 1]])}
              </p>
            </div>
            <button
              onClick={onContinue}
              className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-lg transition-colors"
            >
              🚀
            </button>
          </>
        )}
      </div>
    </div>
  );
}
