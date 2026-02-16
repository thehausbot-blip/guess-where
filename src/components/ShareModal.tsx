import { useState } from 'react';
import { useI18n } from '../i18n/useI18n';

interface ShareModalProps {
  text: string;
  onClose: () => void;
}

interface ShareOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: (text: string) => void;
}

function copyFallback(text: string) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

export function ShareModal({ text, onClose }: ShareModalProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(text);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      copyFallback(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
        onClose();
      } catch { /* cancelled */ }
    }
  };

  const options: ShareOption[] = [
    {
      id: 'twitter',
      label: 'X / Twitter',
      icon: '𝕏',
      color: 'bg-black hover:bg-gray-800',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank'),
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: 'f',
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encoded}`, '_blank'),
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: '💬',
      color: 'bg-[#25D366] hover:bg-[#20BD5A]',
      action: () => window.open(`https://wa.me/?text=${encoded}`, '_blank'),
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: '✈️',
      color: 'bg-[#0088CC] hover:bg-[#0077B5]',
      action: () => window.open(`https://t.me/share/url?text=${encoded}`, '_blank'),
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: '💬',
      color: 'bg-[#34C759] hover:bg-[#2DB84D]',
      action: () => { window.location.href = `sms:?body=${encoded}`; },
    },
    {
      id: 'email',
      label: 'Email',
      icon: '✉️',
      color: 'bg-gray-600 hover:bg-gray-500',
      action: () => window.open(`mailto:?subject=${encodeURIComponent('Map Guesser Result')}&body=${encoded}`, '_self'),
    },
    {
      id: 'reddit',
      label: 'Reddit',
      icon: '🤖',
      color: 'bg-[#FF4500] hover:bg-[#E03D00]',
      action: () => window.open(`https://www.reddit.com/submit?title=${encoded}&selftext=true`, '_blank'),
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: 'in',
      color: 'bg-[#0A66C2] hover:bg-[#0958A8]',
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://mapguesser.com')}&summary=${encoded}`, '_blank'),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-[#001a45] border-t sm:border border-white/20 sm:rounded-xl rounded-t-2xl p-5 w-full sm:max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">📤 {t('result.share')}</h2>
          <button onClick={onClose} className="text-blue-200/40 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Share text preview */}
        <div className="bg-white/5 rounded-lg p-3 mb-4 text-xs text-blue-200/80 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto border border-white/10">
          {text}
        </div>

        {/* Native share (mobile) */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            onClick={handleNativeShare}
            className="w-full mb-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            📱 Share...
          </button>
        )}

        {/* Share grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => { opt.action(text); }}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl ${opt.color} text-white transition-colors`}
              title={opt.label}
            >
              <span className="text-lg font-bold leading-none">{opt.icon}</span>
              <span className="text-[10px] leading-tight opacity-80">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
          }`}
        >
          {copied ? '✅' : '📋'} {copied ? t('game.copiedClipboard') : 'Copy to Clipboard'}
        </button>
      </div>
    </div>
  );
}
