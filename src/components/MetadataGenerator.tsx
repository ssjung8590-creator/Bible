import { useState } from 'react';
import { Tag, Copy, Check, Music, Image as ImageIcon } from 'lucide-react';
import type { ShortsScriptData } from '../services/gemini';

interface MetadataGeneratorProps {
  data: ShortsScriptData | null;
}

export function MetadataGenerator({ data }: MetadataGeneratorProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!data) return null;

  const handleCopyText = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div
      className="glass-panel animate-fade-in-up"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag size={20} style={{ color: 'var(--primary)' }} /> YouTube 업로드 패키징 (SEO & Assets)
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          SEO 최적화 메타데이터
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Left Column: SEO Metadata (Title & Desc) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                영상 제목 (YouTube Title)
              </label>
              <button
                onClick={() => handleCopyText('title', data.title)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                }}
              >
                {copiedField === 'title' ? <Check size={12} style={{ color: 'var(--primary)' }} /> : <Copy size={12} />}
                {copiedField === 'title' ? '복사됨' : '복사'}
              </button>
            </div>
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#FFF',
              }}
            >
              {data.title}
            </div>
          </div>

          {/* Description */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                영상 설명 (YouTube Description)
              </label>
              <button
                onClick={() => handleCopyText('description', data.description)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                }}
              >
                {copiedField === 'description' ? <Check size={12} style={{ color: 'var(--primary)' }} /> : <Copy size={12} />}
                {copiedField === 'description' ? '복사됨' : '복사'}
              </button>
            </div>
            <textarea
              readOnly
              rows={5}
              value={data.description}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                resize: 'none',
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>
              추천 태그 (Keywords)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 12px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Audio & Thumbnail Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Audio Setup */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              padding: '16px',
            }}
          >
            <h4
              style={{
                fontSize: '14px',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                fontWeight: 600,
              }}
            >
              <Music size={16} /> 사운드 연출 제안 (Audio Strategy)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>배경음악 장르:</span>
                <span style={{ color: '#FFF', fontWeight: 500 }}>{data.audioSuggestion.bgMusicGenre}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>음악 분위기:</span>
                <span style={{ color: '#FFF', fontWeight: 500 }}>{data.audioSuggestion.musicMood}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>성우/나레이션 톤:</span>
                <span style={{ color: '#FFF', fontWeight: 500 }}>{data.audioSuggestion.voiceTone}</span>
              </div>
            </div>
          </div>

          {/* Thumbnail Setup */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4
                style={{
                  fontSize: '14px',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                }}
              >
                <ImageIcon size={16} /> 썸네일 디자인 기획 (Thumbnail Idea)
              </h4>
              <button
                onClick={() => handleCopyText('thumbnail', `[텍스트 문구]\n${data.thumbnailIdea.textOverlay}\n\n[비주얼 구도]\n${data.thumbnailIdea.visualDescription}`)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                }}
              >
                {copiedField === 'thumbnail' ? <Check size={12} style={{ color: 'var(--primary)' }} /> : <Copy size={12} />}
                {copiedField === 'thumbnail' ? '복사됨' : '복사'}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                  썸네일 텍스트 문구
                </span>
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    color: 'var(--accent)',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  {data.thumbnailIdea.textOverlay}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                  썸네일 이미지 구도
                </span>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    lineHeight: 1.4,
                  }}
                >
                  {data.thumbnailIdea.visualDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
