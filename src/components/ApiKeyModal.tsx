import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, X, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
}

export function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    setApiKey(savedKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    onSave(apiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    onSave('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
    >
      <div
        className="glass-panel-glow animate-fade-in-up"
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--primary)',
              boxShadow: '0 0 15px var(--primary-glow)',
            }}
          >
            <Key size={26} />
          </div>
          <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Google Gemini API Key</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            성경 쇼츠를 생성하려면 Google AI Studio의 API 키가 필요합니다.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}
          >
            API Key 입력
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{
                paddingRight: '48px',
                letterSpacing: showKey ? 'normal' : '3px',
              }}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.05)',
            border: '1px dashed var(--border-glow)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '28px',
            fontSize: '13px',
            lineHeight: 1.5,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>
            키가 없으신가요?
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Google AI Studio에서 무료로 API 키를 발급받으실 수 있습니다.
          </p>
          <a
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Google AI Studio 바로가기 <ExternalLink size={12} />
          </a>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {apiKey && (
            <button
              onClick={handleClear}
              className="glowing-btn-secondary"
              style={{ flex: 1, padding: '10px' }}
            >
              삭제
            </button>
          )}
          <button
            onClick={handleSave}
            className="glowing-btn-primary"
            disabled={!apiKey}
            style={{ flex: 2, padding: '10px' }}
          >
            {isSaved ? <Check size={18} /> : '저장 및 적용'}
          </button>
        </div>
      </div>
    </div>
  );
}
