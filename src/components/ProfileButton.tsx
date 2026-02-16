import { useState } from 'react';
import { AVATAR_OPTIONS } from '../types';
import { useI18n } from '../i18n/useI18n';

import type { DistanceUnit } from '../hooks/useUnitPref';

interface ProfileButtonProps {
  playerName: string;
  playerAvatar: string;
  onAvatarChange: (avatar: string) => void;
  onLogout: () => void;
  isSignedIn?: boolean;
  distUnit: DistanceUnit;
  onToggleUnit: () => void;
}

export function ProfileButton({ playerName, playerAvatar, onAvatarChange, onLogout, isSignedIn, distUnit, onToggleUnit }: ProfileButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);
  const { t } = useI18n();

  return (
    <div className="relative">
      <button
        onClick={() => { setShowMenu(!showMenu); setShowAvatars(false); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
        title={playerName}
      >
        <span className="text-lg">{playerAvatar}</span>
        <span className="text-white text-sm font-medium">{playerName}</span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setShowMenu(false); setShowAvatars(false); }} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-[#001a45] border border-white/20 rounded-xl shadow-2xl w-72 overflow-hidden">
            {/* Player info header */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{playerAvatar}</span>
                <div>
                  <div className="text-white font-medium">{playerName}</div>
                  <div className="text-blue-200/40 text-xs">
                    {isSignedIn ? 'Google Account' : t('landing.guest')}
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar picker (collapsible) */}
            <div className="border-b border-white/10">
              <button
                onClick={() => setShowAvatars(!showAvatars)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-blue-100 hover:bg-white/10 transition-colors"
              >
                <span>🎨 {t('profile.changeAvatar')}</span>
                <span className="text-blue-200/40">{showAvatars ? '▲' : '▼'}</span>
              </button>
              {showAvatars && (
                <div className="px-3 pb-3">
                  <div className="grid grid-cols-7 gap-1.5 max-h-48 overflow-y-auto">
                    {AVATAR_OPTIONS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          onAvatarChange(emoji);
                          setShowAvatars(false);
                        }}
                        className={`text-xl p-1.5 rounded-lg transition-all ${
                          playerAvatar === emoji
                            ? 'bg-red-600 ring-2 ring-red-400'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Distance unit toggle */}
            <div className="border-b border-white/10">
              <button
                onClick={onToggleUnit}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-blue-100 hover:bg-white/10 transition-colors"
              >
                <span>📏 Distance Unit</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-medium">
                  {distUnit === 'mi' ? '🇺🇸 Miles' : '🌍 Kilometers'}
                </span>
              </button>
            </div>

            {/* Logout / Switch Player */}
            <button
              onClick={() => {
                setShowMenu(false);
                setShowAvatars(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <span>🚪</span>
              <span>{isSignedIn ? t('profile.signOut') : t('profile.switchPlayer')}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
