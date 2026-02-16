import { useMemo, useState } from 'react';
import { useGame } from './hooks/useGame';
import { useLeaderboard } from './hooks/useLeaderboard';
import { useAuth } from './hooks/useAuth';
import { useUnitPref } from './hooks/useUnitPref';
import { useI18n } from './i18n/useI18n';
import { GameMap } from './components/GameMap';
import { GuessInput } from './components/GuessInput';
import { GuessList } from './components/GuessList';
import { GuessOverlay } from './components/GuessOverlay';
import { ShareModal } from './components/ShareModal';
import { DifficultySelector } from './components/DifficultySelector';
import { TierProgress } from './components/TierProgress';
import { Leaderboard } from './components/Leaderboard';
import { LevelUpModal } from './components/LevelUpModal';
import { DailyReviewModal } from './components/DailyReviewModal';
import { ProfileButton } from './components/ProfileButton';
import { LandingPage } from './components/LandingPage';
import { WorldGameView } from './components/WorldGameView';
import type { Difficulty, GameMode } from './types';
import { TIER_LABELS } from './types';
import { generateShareText, generateDailyShareText, getDayNumber } from './utils';
import { getMapConfig } from './mapConfigs';

function App() {
  const [currentMapId, setCurrentMapId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('map') || null;
  });
  const { profile, isSignedIn, isFirebaseConfigured, signIn, signInEmail, signUpEmail, signOutUser, updateAvatar } = useAuth();

  // Player name/avatar (global, always loaded)
  const tempPrefix = 'guesser-temp';
  const {
    playerName: localPlayerName,
    playerAvatar: localPlayerAvatar,
    savePlayerName,
    saveAvatar,
  } = useLeaderboard(tempPrefix);

  // Use Firebase profile if signed in, otherwise localStorage
  const playerName = isSignedIn && profile ? profile.displayName : localPlayerName;
  const playerAvatar = isSignedIn && profile ? profile.avatar : localPlayerAvatar;

  const handleSaveAvatar = (avatar: string) => {
    saveAvatar(avatar);
    if (isSignedIn) updateAvatar(avatar);
  };

  const handleGoogleSignIn = async () => {
    await signIn();
  };

  const handleLogout = () => {
    // Sign out of Firebase if signed in
    if (isSignedIn) signOutUser();
    // Clear ALL game state from localStorage
    const keysToRemove = Object.keys(localStorage).filter(k =>
      k.startsWith('guesser-') ||
      k.includes('-guesser') ||
      k.includes('-daily') ||
      k.includes('-leaderboard')
    );
    keysToRemove.forEach(k => localStorage.removeItem(k));
    // Go back to landing
    setCurrentMapId(null);
    window.location.reload();
  };

  // Show landing page if no map selected, OR if user has no name (even with ?map=)
  const needsAuth = !playerName;
  if (!currentMapId || needsAuth) {
    return (
      <LandingPage
        onSelectMap={(mapId) => setCurrentMapId(mapId)}
        onGuestLogin={savePlayerName}
        onGoogleSignIn={isFirebaseConfigured ? handleGoogleSignIn : undefined}
        onEmailSignIn={isFirebaseConfigured ? signInEmail : undefined}
        onEmailSignUp={isFirebaseConfigured ? signUpEmail : undefined}
        onLogout={handleLogout}
        isFirebaseConfigured={isFirebaseConfigured}
        isSignedIn={isSignedIn}
        playerName={playerName}
        playerAvatar={playerAvatar}
        pendingMapId={currentMapId}
        onAvatarChange={handleSaveAvatar}
      />
    );
  }

  if (currentMapId === 'world-countries') {
    return <WorldGameView onBackToLanding={() => setCurrentMapId(null)} />;
  }

  return (
    <GameView
      mapId={currentMapId}
      playerName={playerName}
      playerAvatar={playerAvatar}
      saveAvatar={handleSaveAvatar}
      onBackToLanding={() => setCurrentMapId(null)}
      onLogout={handleLogout}
      isSignedIn={isSignedIn}
    />
  );
}

interface GameViewProps {
  mapId: string;
  playerName: string;
  playerAvatar: string;
  saveAvatar: (avatar: string) => void;
  onBackToLanding: () => void;
  onLogout: () => void;
  isSignedIn?: boolean;
}

function GameView({ mapId, playerName, playerAvatar, saveAvatar, onBackToLanding, onLogout, isSignedIn }: GameViewProps) {
  const mapConfig = getMapConfig(mapId);
  const { t } = useI18n();
  const [distUnit, toggleUnit] = useUnitPref();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const {
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
  } = useGame(mapConfig);

  const {
    todayEntries,
    bestEntry,
    addEntry,
  } = useLeaderboard(mapConfig.storagePrefix);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [dailyResultSaved, setDailyResultSaved] = useState(false);
  const [showDailyReview, setShowDailyReview] = useState(false);

  const dailyTiers = mapConfig.dailyTiers;
  const diffThresholds = mapConfig.difficultyThresholds;
  const singleTier = dailyTiers.length <= 1;
  const entityLabel = mapConfig.entityName || t('game.cities');

  const cityCounts = useMemo(() => {
    const counts: Record<Difficulty, number> = {
      veryEasy: 0, easy: 0, hard: 0, insane: cities.length
    };
    for (const city of cities) {
      if (city.population >= diffThresholds.veryEasy) counts.veryEasy++;
      if (city.population >= diffThresholds.easy) counts.easy++;
      if (city.population >= diffThresholds.hard) counts.hard++;
    }
    return counts;
  }, [cities, diffThresholds]);

  // Build dynamic tier labels with band descriptions
  const tierLabels = useMemo(() => {
    const labels: Record<Difficulty, { label: string; emoji: string; description: string }> = {} as Record<Difficulty, { label: string; emoji: string; description: string }>;
    const tierOrder: Difficulty[] = ['veryEasy', 'easy', 'hard', 'insane'];
    for (let i = 0; i < tierOrder.length; i++) {
      const diff = tierOrder[i];
      const base = TIER_LABELS[diff];
      const minPop = diffThresholds[diff];
      const upperDiff = i > 0 ? tierOrder[i - 1] : null;
      const maxPop = upperDiff ? diffThresholds[upperDiff] : null;
      
      let description: string;
      if (diff === 'insane') {
        description = t('game.allCities');
      } else if (maxPop) {
        description = t('game.citiesPopRange', { min: minPop.toLocaleString(), max: maxPop.toLocaleString() });
      } else {
        description = t('game.citiesPopAbove', { min: minPop.toLocaleString() });
      }
      
      labels[diff] = { label: base.label, emoji: base.emoji, description };
    }
    return labels;
  }, [diffThresholds, t]);

  const dayNumber = getDayNumber();
  const isDaily = gameState.mode === 'daily';
  const lastGuess = gameState.guesses[gameState.guesses.length - 1];
  const wonCurrentTier = lastGuess?.color === 'correct';

  const showMystery = gameState.isComplete && 
    !wonCurrentTier &&
    gameState.mysteryCity && !gameState.showLevelUp
    ? { lat: gameState.mysteryCity.lat, lng: gameState.mysteryCity.lng, name: gameState.mysteryCity.name, population: gameState.mysteryCity.population }
    : null;

  // Save daily result to leaderboard when complete
  if (isDaily && gameState.dailyComplete && !dailyResultSaved && playerName) {
    addEntry({
      highestTier: gameState.tierGuesses.length > 0 ? gameState.tierGuesses.length - 1 : 0,
      totalGuesses: gameState.totalGuesses,
      tierGuesses: gameState.tierGuesses,
    });
    setDailyResultSaved(true);
  }

  // Compute average guesses from distribution
  const avgGuesses = stats.gamesWon > 0
    ? (stats.guessDistribution.reduce((sum, count, i) => sum + count * (i + 1), 0) / stats.gamesWon).toFixed(1)
    : '—';

  const [shareText, setShareText] = useState<string | null>(null);

  const handleShare = () => {
    const gaveUp = isDaily ? gameState.dailyGaveUp : (gameState.isComplete && !wonCurrentTier);
    let text: string;
    if (isDaily) {
      text = generateDailyShareText(
        gameState.tierGuesses.length > 0 ? gameState.tierGuesses.length - 1 : 0,
        gameState.totalGuesses,
        gameState.tierGuesses,
        dayNumber,
        mapConfig.name,
        gaveUp,
        mapConfig.emoji,
        t,
        mapConfig.id,
        singleTier
      );
    } else {
      text = generateShareText(gameState.guesses, dayNumber, gameState.difficulty, mapConfig.name, gaveUp, mapConfig.emoji, t, mapConfig.id);
    }
    setShareText(text);
  };

  const handleModeSwitch = (mode: GameMode) => {
    if (mode === 'daily' && dailyReview && (gameState.dailyComplete || gameState.dailyGaveUp)) {
      setShowDailyReview(true);
      setMode(mode);
    } else {
      setMode(mode);
    }
    setDailyResultSaved(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">{t('game.loading')} {mapConfig.name}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{t('game.error')}: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-4">
      {gameState.showLevelUp && gameState.levelUpCity && (
        <LevelUpModal
          cityName={gameState.levelUpCity}
          tierIndex={gameState.levelUpTier}
          onContinue={dismissLevelUp}
          singleTier={singleTier}
          guessCount={gameState.guesses.length}
        />
      )}

      {showDailyReview && dailyReview && (
        <DailyReviewModal
          review={dailyReview}
          onDismiss={() => setShowDailyReview(false)}
        />
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-2">
          <div className="flex items-center justify-between mb-0.5">
            <button
              onClick={onBackToLanding}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 text-xs sm:text-sm border border-white/10 transition-colors shrink-0"
            >
              ← {t('game.backToMaps')}
            </button>
            <h1 className="text-lg sm:text-2xl md:text-4xl font-bold text-white whitespace-nowrap truncate mx-2">
              {mapConfig.iconUrl ? (
                <img src={mapConfig.iconUrl} alt={mapConfig.name} className="inline w-6 h-4 sm:w-10 sm:h-7 object-contain rounded mr-1 align-middle" />
              ) : (
                <>{mapConfig.emoji}{' '}</>
              )}
              <span className="text-red-500">{mapConfig.name}</span> {t('game.guesser')}
            </h1>
            <ProfileButton
              playerName={playerName}
              playerAvatar={playerAvatar}
              onAvatarChange={saveAvatar}
              onLogout={onLogout}
              isSignedIn={isSignedIn}
              distUnit={distUnit}
              onToggleUnit={toggleUnit}
            />
          </div>
          <p className="text-blue-200 text-sm sm:text-lg">
            {t('game.day')} #{dayNumber}
          </p>
        </header>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => handleModeSwitch('daily')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              isDaily
                ? 'bg-yellow-500 text-black ring-2 ring-yellow-300'
                : 'bg-white/10 text-blue-100 hover:bg-white/20 border border-white/10'
            }`}
          >
            🏆 {t('game.dailyChallenge')}
          </button>
          <button
            onClick={() => handleModeSwitch('freeplay')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              !isDaily
                ? 'bg-red-600 text-white ring-2 ring-red-400'
                : 'bg-white/10 text-blue-100 hover:bg-white/20 border border-white/10'
            }`}
          >
            🎮 {t('game.freePlay')}
          </button>
        </div>

        {/* Daily: Tier Progress (hidden for single-tier maps) */}
        {isDaily && !singleTier && (
          <div className="mb-2 sm:mb-4">
            <TierProgress
              currentTier={gameState.currentTier}
              tierGuesses={gameState.tierGuesses}
              totalGuesses={gameState.totalGuesses}
              dailyComplete={gameState.dailyComplete}
              dailyGaveUp={gameState.dailyGaveUp}
              currentGuesses={gameState.guesses.length}
            />
          </div>
        )}

        {/* Free Play: Difficulty Selector (hidden for single-tier maps) */}
        {!isDaily && !singleTier && (
          <div className="mb-4">
            <DifficultySelector
              current={gameState.difficulty}
              onChange={changeDifficulty}
              cityCounts={cityCounts}
              disabled={gameState.guesses.length > 0}
            />
            {gameState.guesses.length > 0 && !gameState.isComplete && (
              <p className="text-center text-blue-300/50 text-sm mt-2">
                {t('game.finishToChange')}
              </p>
            )}
            <div className="text-center mt-2">
              <span className="text-blue-200 text-sm">
                {tierLabels[gameState.difficulty].emoji}{' '}
                {tierLabels[gameState.difficulty].description}{' '}
                • {eligibleCities.length} {entityLabel}
              </span>
            </div>
          </div>
        )}

        {/* Single-tier: just show count */}
        {singleTier && !gameState.isComplete && !gameState.dailyComplete && (
          <div className="text-center mb-3">
            <span className="text-blue-200 text-sm">
              {eligibleCities.length} {entityLabel}
            </span>
          </div>
        )}

        {/* Current tier info for daily (hidden for single-tier) */}
        {isDaily && !singleTier && !gameState.dailyComplete && !gameState.showLevelUp && (
          <div className="text-center mb-3">
            <span className="text-blue-200 text-sm">
              {tierLabels[dailyTiers[gameState.currentTier]]?.emoji}{' '}
              {tierLabels[dailyTiers[gameState.currentTier]]?.description}{' '}
              • {eligibleCities.length} {entityLabel}
            </span>
          </div>
        )}

        {/* Map with guess overlay */}
        <div className="mb-6 relative">
          <GameMap config={mapConfig} guesses={gameState.guesses} showMystery={showMystery} tierWinners={isDaily ? gameState.tierWinners : []} distUnit={distUnit} />
          <GuessOverlay
            guesses={gameState.guesses}
            unit={distUnit}
            totalGuesses={isDaily ? gameState.totalGuesses : undefined}
          />
        </div>

        {/* Daily Complete Message */}
        {isDaily && gameState.dailyComplete && !gameState.showLevelUp && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            !gameState.dailyGaveUp && gameState.tierGuesses.length >= dailyTiers.length
              ? 'bg-yellow-900/50 border border-yellow-500'
              : gameState.dailyGaveUp
                ? 'bg-red-900/50 border border-red-500'
                : 'bg-green-900/50 border border-green-500'
          }`}>
            {!gameState.dailyGaveUp && gameState.tierGuesses.length >= dailyTiers.length ? (
              <>
                <p className="text-3xl mb-2">🏆 {t('result.champion')}</p>
                <p className="text-white">
                  {t('result.championMsg', { count: String(dailyTiers.length), guesses: String(gameState.totalGuesses) })}
                </p>
                <p className="text-blue-200/50 text-xs mt-1">
                  📊 Avg: {avgGuesses} guesses · {stats.gamesWon}/{stats.gamesPlayed} wins
                </p>
              </>
            ) : gameState.dailyGaveUp ? (
              <>
                <p className="text-2xl mb-2">😔 {t('result.dailyOver')}</p>
                <p className="text-white">
                  {t('result.reachedTier', { current: String(gameState.tierGuesses.length + 1), total: String(dailyTiers.length) })} •{' '}
                  {t('result.answerWas')} <strong>{gameState.mysteryCity?.name}</strong>
                </p>
                <p className="text-blue-200/50 text-xs mt-1">
                  📊 Avg: {avgGuesses} guesses · {stats.gamesWon}/{stats.gamesPlayed} wins
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl mb-2">🎉 {t('result.tierComplete')}</p>
                <p className="text-white">
                  {t('result.completedTiers', { count: String(gameState.tierGuesses.length), guesses: String(gameState.totalGuesses) })}
                </p>
                <p className="text-blue-200/50 text-xs mt-1">
                  📊 Avg: {avgGuesses} guesses · {stats.gamesWon}/{stats.gamesPlayed} wins
                </p>
              </>
            )}
            <div className="flex gap-3 justify-center mt-4 flex-wrap">
              <button onClick={handleShare}
                className="px-6 py-2 bg-white hover:bg-gray-100 text-blue-900 rounded-lg font-medium">
                📤 {t('result.share')}
              </button>
              {dailyReview && (
                <button onClick={() => setShowDailyReview(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium">
                  📊 {t('result.review')}
                </button>
              )}
              <button onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-medium">
                🏆 {t('result.leaderboard')}
              </button>
              <button onClick={() => newGame()}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium">
                🎮 {t('game.freePlay')}
              </button>
            </div>
          </div>
        )}

        {/* Free Play Complete Message */}
        {!isDaily && gameState.isComplete && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            wonCurrentTier ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'
          }`}>
            {wonCurrentTier ? (
              <>
                <p className="text-2xl mb-2">🎉 {t('result.youGotIt')}</p>
                <p className="text-white">
                  {t('result.found', { city: gameState.mysteryCity?.name || '', count: String(gameState.guesses.length), plural: gameState.guesses.length !== 1 ? 's' : '' })}
                </p>
                <p className="text-blue-200/50 text-xs mt-1">
                  📊 Avg: {avgGuesses} guesses · {stats.gamesWon}/{stats.gamesPlayed} wins
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl mb-2">😔 {t('result.gameOver')}</p>
                <p className="text-white">
                  {t('result.answerWas')} <strong>{gameState.mysteryCity?.name}</strong>
                </p>
                <p className="text-blue-200/50 text-xs mt-1">
                  📊 Avg: {avgGuesses} guesses · {stats.gamesWon}/{stats.gamesPlayed} wins
                </p>
              </>
            )}
            <div className="flex gap-3 justify-center mt-4">
              <button onClick={handleShare}
                className="px-6 py-2 bg-white hover:bg-gray-100 text-blue-900 rounded-lg font-medium">
                📤 {t('result.shareResult')}
              </button>
              <button onClick={() => newGame()}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium">
                🔄 {t('result.newGame')}
              </button>
            </div>
          </div>
        )}

        {/* Guess Input */}
        {(isDaily ? !gameState.dailyComplete && !gameState.showLevelUp : !gameState.isComplete) && (
          <div className="mb-6">
            <GuessInput
              cities={cities}
              onGuess={makeGuess}
              disabled={gameState.isComplete && !isDaily}
              guessedCities={gameState.guesses.map(g => g.city.name)}
              placeholder={mapConfig.placeholder}
              entityName={mapConfig.entityName}
            />
            <div className="flex items-center justify-center gap-4 mt-3">
              <p className="text-blue-200/60 text-sm">
                {gameState.guesses.length} {gameState.guesses.length !== 1 ? t('game.guesses') : t('game.guess_singular')}
                {isDaily && gameState.totalGuesses > 0 && ` (${gameState.totalGuesses} ${t('game.total')})`}
              </p>
              <button onClick={giveUp}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded font-medium border border-white/20">
                🏳️ {t('game.giveUp')}
              </button>
            </div>
          </div>
        )}

        {/* Guess List */}
        {gameState.guesses.length > 0 && !gameState.showLevelUp && (
          <div className="mb-6">
            <h2 className="text-white font-semibold text-lg mb-3">
              {t('game.yourGuesses')} ({gameState.guesses.length})
            </h2>
            <GuessList guesses={gameState.guesses} unit={distUnit} />
          </div>
        )}

        {/* Leaderboard */}
        {(showLeaderboard || (isDaily && gameState.dailyComplete && !gameState.showLevelUp)) && (
          <div className="mb-6">
            <Leaderboard
              todayEntries={todayEntries}
              bestEntry={bestEntry}
              playerName={playerName}
            />
          </div>
        )}

        {/* Stats (free play) */}
        {!isDaily && (
          <div className="bg-white/10 backdrop-blur rounded-lg p-5 border border-white/10 mb-6">
            <h3 className="text-white font-semibold text-lg mb-4">📊 {t('stats.title')}</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{stats.gamesPlayed}</div>
                <div className="text-sm text-blue-200/60">{t('stats.played')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                </div>
                <div className="text-sm text-blue-200/60">{t('stats.winRate')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                <div className="text-sm text-blue-200/60">{t('stats.streak')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.maxStreak}</div>
                <div className="text-sm text-blue-200/60">{t('stats.best')}</div>
              </div>
            </div>
          </div>
        )}

        {/* How to Play button */}
        <div className="text-center mt-4">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 text-sm border border-white/10 transition-colors"
          >
            📖 {t('howTo.title')}
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center text-blue-200/40 text-sm mt-4">
          <p>{t('footer.madeIn')}</p>
          <p className="mt-1">{t('footer.hausProject')}</p>
          {import.meta.env.DEV && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} className="w-4 h-4 rounded" />
              <span className={debugMode ? 'text-purple-400' : 'text-slate-500'}>🧪 {t('game.debug')}</span>
            </label>
          </div>
          )}
          {import.meta.env.DEV && debugMode && gameState.mysteryCity && (
            <p className="text-purple-400 text-xs mt-1">
              🎯 {gameState.mysteryCity.name} ({t('game.pop')}: {gameState.mysteryCity.population.toLocaleString()})
            </p>
          )}
          {import.meta.env.DEV && debugMode && (
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  localStorage.removeItem(`${mapConfig.storagePrefix}-daily`);
                  localStorage.removeItem(`${mapConfig.storagePrefix}-daily-review`);
                  window.location.reload();
                }}
                className="px-3 py-1.5 text-xs bg-purple-700 hover:bg-purple-600 text-white rounded font-medium"
              >
                🔄 {t('debug.resetDaily')}
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('guesser-player-name');
                  localStorage.removeItem('guesser-player-avatar');
                  window.location.reload();
                }}
                className="px-3 py-1.5 text-xs bg-purple-700 hover:bg-purple-600 text-white rounded font-medium"
              >
                👤 {t('debug.resetProfile')}
              </button>
              <button
                onClick={() => {
                  const salt = Date.now().toString();
                  localStorage.setItem(`${mapConfig.storagePrefix}-daily-salt`, salt);
                  localStorage.removeItem(`${mapConfig.storagePrefix}-daily`);
                  localStorage.removeItem(`${mapConfig.storagePrefix}-daily-review`);
                  window.location.reload();
                }}
                className="px-3 py-1.5 text-xs bg-purple-700 hover:bg-purple-600 text-white rounded font-medium"
              >
                🎲 {t('debug.rerollTowns')}
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  // Go to landing page (strip ?map= param)
                  window.location.href = window.location.origin + window.location.pathname;
                }}
                className="px-3 py-1.5 text-xs bg-red-700 hover:bg-red-600 text-white rounded font-medium"
              >
                💣 {t('debug.resetAll')}
              </button>
            </div>
          )}
        </footer>
      </div>

      {/* Share modal */}
      {shareText && (
        <ShareModal text={shareText} onClose={() => setShareText(null)} />
      )}

      {/* How to Play modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4" onClick={() => setShowHowToPlay(false)}>
          <div className="bg-[#001a45] border border-white/20 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">📖 {t('howTo.title')}</h2>
              <button onClick={() => setShowHowToPlay(false)} className="text-white/60 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3 text-blue-100 text-sm">
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white font-semibold mb-1">🎯 {t('howTo.goal')}</h3>
                <p>{t('howTo.goalText')}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white font-semibold mb-1">🗺️ {t('howTo.map')}</h3>
                <p>{t('howTo.mapText')}</p>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> {t('howTo.red')}</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500 inline-block" /> {t('howTo.orange')}</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-500 inline-block" /> {t('howTo.yellow')}</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-400 inline-block" /> {t('howTo.blue')}</div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white font-semibold mb-1">🏆 {t('howTo.daily')}</h3>
                <p>{t('howTo.dailyText')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
