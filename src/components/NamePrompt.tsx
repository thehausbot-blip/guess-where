import { useState } from 'react';
import { AVATAR_OPTIONS } from '../types';
import { useI18n } from '../i18n/useI18n';

interface NamePromptProps {
  onSave: (name: string, avatar: string) => void;
  onGoogleSignIn?: () => Promise<void>;
  isFirebaseConfigured?: boolean;
  mapEmoji?: string;
  welcomeText?: string;
}

export function NamePrompt({ onSave, onGoogleSignIn, isFirebaseConfigured, mapEmoji = '🗺️', welcomeText }: NamePromptProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🤠');
  const [signingIn, setSigningIn] = useState(false);
  const { t } = useI18n();

  const displayWelcome = welcomeText || t('name.welcome');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onSave(trimmed, avatar);
  };

  const handleGoogle = async () => {
    if (!onGoogleSignIn) return;
    setSigningIn(true);
    try {
      await onGoogleSignIn();
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#001a45] border border-white/20 rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <h2 className="text-white text-xl font-bold mb-2">{mapEmoji} {displayWelcome}</h2>
        <p className="text-blue-200 text-sm mb-4">
          {t('name.chooseAvatar')}
        </p>

        {/* Google Sign-In */}
        {isFirebaseConfigured && onGoogleSignIn && (
          <div className="mb-4">
            <button
              onClick={handleGoogle}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white hover:bg-gray-100 text-gray-800 font-medium transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {signingIn ? 'Signing in...' : 'Sign in with Google'}
            </button>
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-blue-200/40 text-xs">or play as guest</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>
          </div>
        )}
        
        {/* Avatar Picker */}
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

        <form onSubmit={handleSubmit} className="flex gap-2">
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
      </div>
    </div>
  );
}
