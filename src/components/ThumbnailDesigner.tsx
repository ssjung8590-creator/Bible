import { useState, useEffect } from 'react';
import { Palette, Download, Sparkles, Type, Sliders, Layout } from 'lucide-react';

interface ThumbnailDesignerProps {
  initialText: string;
  topic: string;
  dayNumber: number;
}

export function ThumbnailDesigner({ initialText, topic, dayNumber }: ThumbnailDesignerProps) {
  const [text, setText] = useState(initialText || '여호와는 나의 목자시니');
  const [gradientIndex, setGradientIndex] = useState(0);
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [shadowColor, setShadowColor] = useState('rgba(0,0,0,0.8)');
  const [showDayBadge, setShowDayBadge] = useState(true);

  // Sync with initial text from AI generation
  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  const gradients = [
    { name: '골드 선셋 (Gold Sunset)', val: 'linear-gradient(135deg, #1f1c2c 0%, #aa8419 100%)' },
    { name: '로얄 레드 (Royal Red)', val: 'linear-gradient(135deg, #420400 0%, #a80a00 50%, #170000 100%)' },
    { name: '미드나잇 딥 (Midnight Deep)', val: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
    { name: '성스러운 새벽 (Sacred Forest)', val: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
    { name: '시네마틱 다크 (Cinematic Dark)', val: 'linear-gradient(135deg, #0b0b0a 0%, #282824 100%)' }
  ];

  const fontSizes = [20, 24, 28, 32, 36, 40];
  const textColors = ['#FFFFFF', '#D4AF37', '#FFEB3B', '#FF5722', '#00BCD4'];

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
          <Palette size={20} style={{ color: 'var(--primary)' }} /> 실시간 썸네일 디자이너 (Thumbnail Designer)
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          쇼츠 표지 이미지 제작기
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Left Side: Mock Thumbnail Card Preview */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '240px',
              aspectRatio: '9 / 16',
              borderRadius: 'var(--radius-md)',
              background: gradients[gradientIndex].val,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5), 0 0 10px rgba(212,175,55,0.1)',
              border: '2px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              textAlign: 'center',
              transition: 'background 0.3s ease',
            }}
          >
            {/* Subtle Cross background overlay */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                fontSize: '120px',
                color: 'rgba(255,255,255,0.03)',
                fontWeight: 200,
                pointerEvents: 'none',
                fontFamily: 'var(--font-heading)',
              }}
            >
              †
            </div>

            {/* Day Badge overlay */}
            {showDayBadge && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  border: '2px solid var(--primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px var(--primary-glow)',
                  zIndex: 20,
                }}
              >
                <span style={{ fontSize: '8px', fontWeight: 600, color: 'var(--primary)', lineHeight: 1 }}>DAY</span>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>{dayNumber}</span>
              </div>
            )}

            {/* Topic label tag */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--primary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {topic ? topic.substring(0, 12) : 'BIBLE SHORTS'}
            </div>

            {/* Main Title Overlay text */}
            <div
              style={{
                color: textColor,
                fontSize: `${fontSize}px`,
                fontWeight: 800,
                lineHeight: 1.35,
                fontFamily: 'var(--font-body)',
                wordBreak: 'keep-all',
                textShadow: `0 4px 12px ${shadowColor}, 0 2px 4px ${shadowColor}`,
                zIndex: 10,
              }}
            >
              {text}
            </div>

            {/* Bottom channel branding watermark */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 500,
                letterSpacing: '0.1em',
              }}
            >
              @BIBLE_SHORTS
            </div>
          </div>
        </div>

        {/* Right Side: Editing Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Custom Text input */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--primary)',
                marginBottom: '8px',
              }}
            >
              <Type size={14} /> 썸네일 문구 입력
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="썸네일에 띄울 임팩트 있는 문구"
              maxLength={30}
            />
          </div>

          {/* Day Badge toggle */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={showDayBadge}
                onChange={(e) => setShowDayBadge(e.target.checked)}
              />
              <div className="checkmark">✓</div>
              <span style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>썸네일에 Day 배지 표시 (Day {dayNumber})</span>
            </label>
          </div>

          {/* Background Gradients */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--primary)',
                marginBottom: '8px',
              }}
            >
              <Layout size={14} /> 배경 템플릿 선택
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {gradients.map((grad, idx) => (
                <button
                  key={idx}
                  onClick={() => setGradientIndex(idx)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: grad.val,
                    border: '1px solid',
                    borderColor: gradientIndex === idx ? 'var(--primary)' : 'transparent',
                    color: '#FFF',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    textShadow: '0 1px 2px #000',
                  }}
                >
                  {grad.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Font Sizes & Colors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  marginBottom: '8px',
                }}
              >
                <Sliders size={14} /> 글자 크기
              </label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                style={{ fontSize: '13px' }}
              >
                {fontSizes.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}px
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  marginBottom: '8px',
                }}
              >
                <Sparkles size={14} /> 글자 색상
              </label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '42px' }}>
                {textColors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setTextColor(col)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: col,
                      border: textColor === col ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Shadow intensity selector */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              텍스트 뒤 그림자 대비
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { name: '부드러움', val: 'rgba(0,0,0,0.5)' },
                { name: '보통', val: 'rgba(0,0,0,0.8)' },
                { name: '강하게', val: 'rgba(0,0,0,0.95)' }
              ].map((shadow) => (
                <button
                  key={shadow.name}
                  onClick={() => setShadowColor(shadow.val)}
                  className="glowing-btn-secondary"
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    fontSize: '12px',
                    borderColor: shadowColor === shadow.val ? 'var(--primary)' : 'var(--border-light)',
                    color: shadowColor === shadow.val ? 'var(--primary)' : 'var(--text-secondary)',
                  }}
                >
                  {shadow.name}
                </button>
              ))}
            </div>
          </div>

          <button
            className="glowing-btn-primary"
            onClick={() => alert('썸네일 기획안 및 스타일 설정이 저장되었습니다. 영상 렌더링 시 이 템플릿 옵션이 적용됩니다.')}
            style={{ padding: '10px', fontSize: '13px', marginTop: 'auto' }}
          >
            <Download size={14} /> 디자인 저장
          </button>
        </div>
      </div>
    </div>
  );
}
