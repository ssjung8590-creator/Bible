import { useState } from 'react';
import { Film, Image, Copy, Check } from 'lucide-react';
import type { ScriptSection } from '../services/gemini';

interface VisualStoryboardProps {
  sections: ScriptSection[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
}

export function VisualStoryboard({
  sections,
  activeSectionId,
  onSelectSection,
}: VisualStoryboardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'hook':
        return '#928dab';
      case 'verse':
        return '#00bcd4';
      case 'reflection':
        return '#ff9800';
      case 'outro':
        return 'var(--accent)';
      default:
        return '#D4AF37';
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Film size={20} style={{ color: 'var(--primary)' }} /> 비주얼 스토리보드 (Visual Storyboard)
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          영상/이미지 소스 프롬프트
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;
          const sectionColor = getSectionColor(section.type);

          return (
            <div
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border-light)',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isActive ? '0 8px 24px rgba(212, 175, 55, 0.1)' : 'none',
              }}
            >
              {/* Colored Thumbnail Placeholder */}
              <div
                style={{
                  height: '110px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  backgroundImage: `linear-gradient(135deg, ${sectionColor}22, ${sectionColor}11)`,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid var(--border-light)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    color: sectionColor,
                    border: `1px solid ${sectionColor}44`,
                  }}
                >
                  {section.id}
                </div>
                <Image size={24} style={{ color: `${sectionColor}88` }} />
              </div>

              {/* Storyboard Card Details */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                    대사 (Narration)
                  </div>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '36px',
                    }}
                  >
                    {section.narration}
                  </p>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                    비주얼 프롬프트 (Visual Prompt)
                  </div>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.4,
                      backgroundColor: 'var(--bg-surface-elevated)',
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      maxHeight: '80px',
                      overflowY: 'auto',
                    }}
                  >
                    {section.visualPrompt}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyPrompt(section.id, section.visualPrompt);
                  }}
                  className="glowing-btn-secondary"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12px',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '8px',
                  }}
                >
                  {copiedId === section.id ? (
                    <>
                      <Check size={14} /> 복사 완료!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> 프롬프트 복사
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginTop: '8px',
        }}
      >
        <span>💡 AI 이미지 생성기(Midjourney, Pexels 등)에 프롬프트를 바로 복사하여 사용하세요.</span>
      </div>
    </div>
  );
}
