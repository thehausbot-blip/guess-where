import { useState, useEffect } from 'react';
import { FEATURED_MAPS, getMapsByRegion, REGIONS, MAP_CONFIGS, getMapsByContinent, CONTINENTS } from '../mapConfigs';
import { AVATAR_OPTIONS } from '../types';
import { useI18n } from '../i18n/useI18n';
import { LanguageSelector } from './LanguageSelector';

const WELCOME_CYCLE = [
  { text: 'Welcome, friend!', flag: '🇺🇸' },
  { text: '¡Bienvenidos, amigo!', flag: '🇪🇸' },
  { text: 'Bem-vindo, amigo!', flag: '🇧🇷' },
  { text: 'Bienvenue, ami!', flag: '🇫🇷' },
  { text: 'Willkommen, Freund!', flag: '🇩🇪' },
  { text: 'ようこそ、友よ！', flag: '🇯🇵' },
  { text: '환영합니다, 친구!', flag: '🇰🇷' },
  { text: '欢迎，朋友！', flag: '🇨🇳' },
];

interface LandingPageProps {
  onSelectMap: (mapId: string) => void;
  onGuestLogin: (name: string, avatar: string) => void;
  onGoogleSignIn?: () => Promise<void>;
  onEmailSignIn?: (email: string, password: string) => Promise<void>;
  onEmailSignUp?: (email: string, password: string, displayName: string) => Promise<void>;
  onLogout: () => void;
  isFirebaseConfigured?: boolean;
  isSignedIn: boolean;
  playerName: string;
  playerAvatar: string;
  pendingMapId?: string | null;
  onAvatarChange?: (avatar: string) => void;
}

function HowToPlayInline({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-white text-2xl font-bold mb-4 text-center">📖 {t('howTo.title')}</h2>
      <div className="space-y-3 text-blue-100 text-sm">
        <div className="bg-white/5 rounded-lg p-3">
          <h3 className="text-white font-semibold mb-1">🎯 {t('howTo.goal')}</h3>
          <p>{t('howTo.goalText')}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <h3 className="text-white font-semibold mb-1">🗺️ {t('howTo.map')}</h3>
          <p>{t('howTo.mapText')}</p>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-500 inline-block" /> <strong>Red</strong> — {t('howTo.red')}</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-orange-500 inline-block" /> <strong>Orange</strong> — {t('howTo.orange')}</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-yellow-500 inline-block" /> <strong>Yellow</strong> — {t('howTo.yellow')}</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#CC9966] inline-block" /> <strong>Brown</strong> — {t('howTo.brown')}</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-300 inline-block" /> <strong>White</strong> — {t('howTo.white')}</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-500 inline-block" /> <strong>Gray</strong> — {t('howTo.gray')}</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-500 inline-block" /> <strong>Green</strong> — {t('howTo.green')}</div>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <h3 className="text-white font-semibold mb-1">📊 {t('howTo.difficulty')}</h3>
          <p className="mb-2">{t('howTo.difficultyText')}</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">⭐ <strong>{t('diff.veryEasy')}</strong> — {t('howTo.bandVeryEasy')}</div>
            <div className="flex items-center gap-2">🟢 <strong>{t('diff.easy')}</strong> — {t('howTo.bandEasy')}</div>
            <div className="flex items-center gap-2">🟠 <strong>{t('diff.hard')}</strong> — {t('howTo.bandHard')}</div>
            <div className="flex items-center gap-2">🧠 <strong>{t('diff.insane')}</strong> — {t('howTo.bandInsane')}</div>
          </div>
          <p className="mt-2 text-xs text-blue-200/70">{t('howTo.oobText')}</p>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <h3 className="text-white font-semibold mb-1">🏆 {t('howTo.daily')}</h3>
          <p>{t('howTo.dailyText')}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <h3 className="text-white font-semibold mb-1">🎮 {t('howTo.freePlay')}</h3>
          <p>{t('howTo.freePlayText')}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <h3 className="text-white font-semibold mb-1">💡 {t('howTo.tips')}</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>{t('howTo.tip1')}</li>
            <li>{t('howTo.tip2')}</li>
            <li>{t('howTo.tip3')}</li>
            <li>{t('howTo.tip4')}</li>
          </ul>
        </div>
      </div>
      <button onClick={onBack} className="w-full mt-6 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20">
        ← {t('howTo.back')}
      </button>
    </div>
  );
}

function ProfileSetup({ currentAvatar, onSave }: { currentAvatar: string; onSave: (avatar: string) => void }) {
  const [avatar, setAvatar] = useState(currentAvatar);
  const { t } = useI18n();

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-white text-xl font-bold mb-2 text-center">✨ Welcome!</h2>
      <p className="text-blue-200/60 text-sm mb-4 text-center">
        Customize your profile before playing
      </p>

      {/* Language selector */}
      <div className="mb-4">
        <LanguageSelector />
      </div>

      <div className="mb-4">
        <label className="text-blue-200 text-sm font-medium mb-2 block">{t('name.pickAvatar')}</label>
        <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto">
          {AVATAR_OPTIONS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setAvatar(emoji)}
              className={`text-2xl p-2 rounded-lg transition-all ${
                avatar === emoji
                  ? 'bg-red-600 ring-2 ring-red-400 scale-110'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onSave(avatar)}
        className="w-full px-6 py-3 rounded-lg font-bold bg-red-600 text-white hover:bg-red-500 text-lg"
      >
        🎮 Let&apos;s Play!
      </button>
    </div>
  );
}

function GuestSetup({ onSave, onBack }: { onSave: (name: string, avatar: string) => void; onBack: () => void }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🤠');
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onSave(trimmed, avatar);
  };

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-white text-xl font-bold mb-2 text-center">🎮 {t('landing.playAsGuest')}</h2>
      <p className="text-blue-200/60 text-sm mb-4 text-center">
        {t('landing.guestStatsLocal')}
      </p>

      {/* Language selector */}
      <div className="mb-4">
        <LanguageSelector />
      </div>

      <div className="mb-4">
        <label className="text-blue-200 text-sm font-medium mb-2 block">{t('name.pickAvatar')}</label>
        <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto">
          {AVATAR_OPTIONS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setAvatar(emoji)}
              className={`text-2xl p-2 rounded-lg transition-all ${
                avatar === emoji
                  ? 'bg-red-600 ring-2 ring-red-400 scale-110'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 focus-within:border-red-400">
          <span className="text-2xl">{avatar}</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('name.yourName')}
            maxLength={20}
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-blue-200/40 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-6 py-3 rounded-lg font-bold bg-red-600 text-white hover:bg-red-500 disabled:opacity-50"
        >
          {t('name.go')}
        </button>
      </form>

      <button onClick={onBack} className="w-full px-4 py-2 text-sm text-blue-200/50 hover:text-blue-200 transition-colors">
        ← {t('landing.back')}
      </button>
    </div>
  );
}

export function LandingPage({ onSelectMap, onGuestLogin, onGoogleSignIn, onEmailSignIn, onEmailSignUp, onLogout, isFirebaseConfigured, isSignedIn, playerName, playerAvatar, pendingMapId, onAvatarChange }: LandingPageProps) {
  const [page, setPage] = useState<'main' | 'howto' | 'guest' | 'profile-setup'>('main');
  const [welcomeIdx, setWelcomeIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const { t } = useI18n();
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [showAllStates, setShowAllStates] = useState(false);
  const [showWorldCountries, setShowWorldCountries] = useState(false);
  const [expandedContinent, setExpandedContinent] = useState<string | null>(null);
  const isLoggedIn = isSignedIn || !!playerName;

  // Auto-navigate to pending map when user completes sign-in (skip if on profile setup)
  useEffect(() => {
    if (pendingMapId && isLoggedIn && playerName && page !== 'profile-setup' && page !== 'guest') {
      onSelectMap(pendingMapId);
    }
  }, [pendingMapId, isLoggedIn, playerName, page]);
  const featured = FEATURED_MAPS.map(id => MAP_CONFIGS[id]).filter(Boolean);
  const mapsByRegion = getMapsByRegion();
  const regionOrder = Object.entries(REGIONS).sort((a, b) => a[1].order - b[1].order);
  const mapsByContinent = getMapsByContinent();
  const continentOrder = Object.entries(CONTINENTS).sort((a, b) => a[1].order - b[1].order);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWelcomeIdx(prev => (prev + 1) % WELCOME_CYCLE.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleSignIn = async () => {
    if (!onGoogleSignIn) return;
    setSigningIn(true);
    try {
      await onGoogleSignIn();
      setPage('profile-setup');
    } finally {
      setSigningIn(false);
    }
  };

  if (page === 'howto') {
    return (
      <div className="min-h-screen py-8 px-4">
        <HowToPlayInline onBack={() => setPage('main')} />
      </div>
    );
  }

  if (page === 'profile-setup') {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <ProfileSetup
          currentAvatar={playerAvatar || '🤠'}
          onSave={(avatar) => {
            onAvatarChange?.(avatar);
            if (pendingMapId) { onSelectMap(pendingMapId); } else { setPage('main'); }
          }}
        />
      </div>
    );
  }

  if (page === 'guest') {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <GuestSetup onSave={(name, avatar) => { onGuestLogin(name, avatar); if (pendingMapId) { onSelectMap(pendingMapId); } else { setPage('main'); } }} onBack={() => setPage('main')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full text-center">
        {/* Language selector top-right */}
        <div className="flex justify-center mb-4">
          <LanguageSelector />
        </div>

        {/* Logo / Title */}
        <h1 className="text-5xl font-bold text-white mb-2">
          🗺️ <span className="text-red-500">{t('landing.title')}</span>
        </h1>
        <p className={`text-blue-200 text-lg mb-2 transition-opacity duration-400 ${fade ? 'opacity-100' : 'opacity-0'}`}>
          {WELCOME_CYCLE[welcomeIdx].flag} {WELCOME_CYCLE[welcomeIdx].text}
        </p>
        <p className="text-blue-200/50 text-sm mb-6">
          {t('landing.subtitle')}
        </p>

        {/* Not logged in: Sign In / Guest buttons */}
        {!isLoggedIn && (
          <div className="mb-8 space-y-3">
            {isFirebaseConfigured && (
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-medium transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {signingIn ? t('landing.signingIn') : t('landing.signInGoogle')}
              </button>
            )}
            {isFirebaseConfigured && !showEmailForm && (
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all"
              >
                ✉️ {t('landing.signInEmail')}
              </button>
            )}

            {showEmailForm && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setEmailError('');
                  setEmailLoading(true);
                  try {
                    if (emailMode === 'signup') {
                      if (!displayName.trim()) { setEmailError('Name is required'); setEmailLoading(false); return; }
                      await onEmailSignUp?.(email, password, displayName.trim());
                    } else {
                      await onEmailSignIn?.(email, password);
                    }
                    setPage('profile-setup');
                  } catch (err: any) {
                    const code = err?.code || '';
                    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') setEmailError('Account not found. Try signing up.');
                    else if (code === 'auth/wrong-password') setEmailError('Wrong password.');
                    else if (code === 'auth/email-already-in-use') setEmailError('Email already in use. Try signing in.');
                    else if (code === 'auth/weak-password') setEmailError('Password must be at least 6 characters.');
                    else if (code === 'auth/invalid-email') setEmailError('Invalid email address.');
                    else setEmailError(err?.message || 'Sign-in failed.');
                  } finally {
                    setEmailLoading(false);
                  }
                }}
                className="w-full space-y-2 bg-white/5 border border-white/20 rounded-xl p-4"
              >
                {emailMode === 'signup' && (
                  <input
                    type="text"
                    placeholder="Display name"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {emailLoading ? '...' : emailMode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
                <p className="text-center text-xs text-blue-200/50">
                  {emailMode === 'signin' ? (
                    <>No account? <button type="button" onClick={() => { setEmailMode('signup'); setEmailError(''); }} className="text-red-400 underline">Sign up</button></>
                  ) : (
                    <>Have an account? <button type="button" onClick={() => { setEmailMode('signin'); setEmailError(''); }} className="text-red-400 underline">Sign in</button></>
                  )}
                  {' · '}
                  <button type="button" onClick={() => setShowEmailForm(false)} className="text-blue-200/40 underline">Cancel</button>
                </p>
              </form>
            )}

            <button
              onClick={() => setPage('guest')}
              className="w-full px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all"
            >
              🎮 {t('landing.playAsGuest')}
            </button>
            {isFirebaseConfigured && (
              <p className="text-blue-200/30 text-xs">
                {t('landing.signInBenefit')}
              </p>
            )}
          </div>
        )}

        {/* Logged in: show player + map selection */}
        {isLoggedIn && (
          <>
            <div className="text-blue-200/60 text-sm mb-6 flex items-center justify-center gap-2 flex-wrap">
              <span>
                {playerAvatar} {t('landing.playingAs')} <strong className="text-white">{playerName}</strong>
                {!isSignedIn && <span className="ml-1 text-blue-200/30">({t('landing.guest')})</span>}
              </span>
              <button
                onClick={onLogout}
                className="text-red-400/60 hover:text-red-400 text-xs underline transition-colors"
              >
                {isSignedIn ? t('profile.signOut') : t('profile.switchPlayer')}
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-4">{t('landing.chooseMap')}</h2>
              
              {/* Featured maps — big cards */}
              <div className="grid gap-3 mb-6">
                {featured.map(map => (
                  <button
                    key={map.id}
                    onClick={() => onSelectMap(map.id)}
                    className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all group"
                  >
                    {map.iconUrl ? (
                      <img src={map.iconUrl} alt={map.name} className="w-12 h-8 object-contain group-hover:scale-110 transition-transform rounded" />
                    ) : (
                      <span className="text-4xl group-hover:scale-110 transition-transform">{map.emoji}</span>
                    )}
                    <div className="text-left flex-1">
                      <div className="text-white font-bold text-lg">{map.name}</div>
                      <div className="text-blue-200/60 text-sm">{map.name} Guesser</div>
                    </div>
                    <svg className="w-5 h-5 text-blue-200/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* All States — single collapsible line */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => { setShowAllStates(!showAllStates); setExpandedRegion(null); }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-white font-medium">
                    🇺🇸 All States &amp; Territories
                    <span className="ml-2 text-blue-200/40 text-sm font-normal">(50 states + DC + territories)</span>
                  </span>
                  <span className="text-blue-200/40 text-sm">{showAllStates ? '▲' : '▼'}</span>
                </button>
                {showAllStates && (
                  <div className="p-2 space-y-2">
                    {regionOrder.map(([regionId, regionInfo]) => {
                      const maps = mapsByRegion[regionId] || [];
                      if (maps.length === 0) return null;
                      const isOpen = expandedRegion === regionId;
                      return (
                        <div key={regionId}>
                          <button
                            onClick={() => setExpandedRegion(isOpen ? null : regionId)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <span className="text-blue-100 text-sm font-medium">
                              {regionInfo.emoji} {regionInfo.label}
                              <span className="ml-1 text-blue-200/40 text-xs">({maps.length})</span>
                            </span>
                            <span className="text-blue-200/40 text-xs">{isOpen ? '▲' : '▼'}</span>
                          </button>
                          {isOpen && (
                            <div className="grid grid-cols-2 gap-1 mt-1 ml-2">
                              {maps.map(map => (
                                <button
                                  key={map.id}
                                  onClick={() => onSelectMap(map.id)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/15 transition-colors text-left group"
                                >
                                  {map.iconUrl ? (
                                    <img src={map.iconUrl} alt={map.name} className="w-7 h-5 object-contain rounded" />
                                  ) : (
                                    <span className="text-lg">{map.emoji}</span>
                                  )}
                                  <span className="text-white text-sm font-medium truncate group-hover:text-red-400 transition-colors">{map.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* World Countries — single collapsible line */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => { setShowWorldCountries(!showWorldCountries); setExpandedContinent(null); }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-white font-medium">
                    🌍 World Countries
                    <span className="ml-2 text-blue-200/40 text-sm font-normal">(225 countries)</span>
                  </span>
                  <span className="text-blue-200/40 text-sm">{showWorldCountries ? '▲' : '▼'}</span>
                </button>
                {showWorldCountries && (
                  <div className="p-2 space-y-2">
                    {continentOrder.map(([continentId, continentInfo]) => {
                      const maps = mapsByContinent[continentId] || [];
                      if (maps.length === 0) return null;
                      const isOpen = expandedContinent === continentId;
                      return (
                        <div key={continentId}>
                          <button
                            onClick={() => setExpandedContinent(isOpen ? null : continentId)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <span className="text-blue-100 text-sm font-medium">
                              {continentInfo.emoji} {continentInfo.label}
                              <span className="ml-1 text-blue-200/40 text-xs">({maps.length})</span>
                            </span>
                            <span className="text-blue-200/40 text-xs">{isOpen ? '▲' : '▼'}</span>
                          </button>
                          {isOpen && (
                            <div className="grid grid-cols-2 gap-1 mt-1 ml-2">
                              {maps.map(map => (
                                <button
                                  key={map.id}
                                  onClick={() => onSelectMap(map.id)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/15 transition-colors text-left group"
                                >
                                  <span className="text-lg">{map.emoji}</span>
                                  <span className="text-white text-sm font-medium truncate group-hover:text-red-400 transition-colors">{map.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Actions — always visible */}
        <div className="space-y-3">
          <button
            onClick={() => setPage('howto')}
            className="w-full px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all"
          >
            📖 {t('landing.howToPlay')}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-blue-200/30 text-sm">
          <p>{t('footer.madeIn')}</p>
          <p className="mt-1">{t('footer.hausProject')}</p>
        </footer>
      </div>
    </div>
  );
}
