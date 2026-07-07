import { useState, useEffect } from 'react';
import { Play, Pause, Heart, MessageCircle, Share2, MoreVertical, Music } from 'lucide-react';

interface ShortsPreviewProps {
  verseText: string;
  title: string;
  musicInfo: {
    bgMusicGenre: string;
    musicMood: string;
  };
}

// Utility to convert Korean syllables to initial consonants
function getKoreanInitials(text: string): string {
  const INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  
  return text.split('').map(char => {
    const code = char.charCodeAt(0) - 0xAC00;
    if (code >= 0 && code <= 11171) {
      const initialIndex = Math.floor(code / 588);
      return INITIALS[initialIndex];
    }
    return char;
  }).join('');
}

// Utility to mask words for Blank/Fill-in mode
function getBlankMask(text: string): string {
  return text.split(' ').map((word, idx) => {
    if (idx % 2 === 1 && /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(word)) {
      return word.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '_');
    }
    return word;
  }).join(' ');
}

export function ShortsPreview({
  verseText,
  title,
  musicInfo,
}: ShortsPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  
  // Manual override control
  const [manualMode, setManualMode] = useState<'full' | 'initial' | 'blank' | null>(null);

  // Auto-play progress simulation loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // When progress loops, reset manual mode override to let it auto-transition again
            setManualMode(null);
            return 0;
          }
          return prev + 1; // Loops in 10 seconds (100 ticks of 100ms)
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Compute active mode based on progress if no manual override is active
  const getActiveMode = (): 'full' | 'initial' | 'blank' => {
    if (manualMode !== null) return manualMode;
    if (progress < 33) return 'full';
    if (progress < 66) return 'initial';
    return 'blank';
  };

  const activeMode = getActiveMode();

  // Render subtitle with selected memorization filter
  const renderSubtitleText = (text: string) => {
    if (activeMode === 'initial') return getKoreanInitials(text);
    if (activeMode === 'blank') return getBlankMask(text);
    return text;
  };

  // Human-friendly description for the current training phase
  const getPhaseName = () => {
    if (activeMode === 'full') return '1단계: 말씀 정독 (Full Scripture)';
    if (activeMode === 'initial') return '2단계: 초성 연상 (Initials Recalling)';
    return '3단계: 빈칸 암기 (Blank Reciting)';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        maxWidth: '340px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          aspectRatio: '9 / 16',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          position: 'relative',
          border: '4px solid #1c1c1a',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.15)',
        }}
      >
        {/* Video Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, #16224f 0%, #8c5b70 55%, #e5be9b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Waveform background particle effect */}
          <div
            style={{
              position: 'absolute',
              width: '130%',
              height: '130%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)',
              animation: isPlaying ? 'spinSlow 20s linear infinite' : 'none',
            }}
          />

          {/* Subtitle Display */}
          <div
            className="animate-fade-in-up"
            key={activeMode}
            style={{
              zIndex: 10,
              textAlign: 'center',
              color: '#FFFFFF',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0,0,0,0.5)',
              fontWeight: 800,
              fontSize: '18px',
              lineHeight: 1.4,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(4px)',
              width: '100%',
              maxHeight: '150px',
              overflow: 'hidden',
            }}
          >
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>
              {renderSubtitleText(verseText)}
            </span>
          </div>
        </div>

        {/* Top Control Bar / Progress */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '16px 16px 24px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
            zIndex: 20,
          }}
        >
          {/* Progress bar */}
          <div
            style={{
              height: '3px',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: 'var(--primary)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--primary)',
                letterSpacing: '0.05em',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            >
              {getPhaseName()}
            </span>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                color: '#FFF',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? <Pause size={14} fill="#FFF" /> : <Play size={14} fill="#FFF" style={{ marginLeft: '2px' }} />}
            </button>
          </div>

          {/* Memorization Mode Toggles (Light up automatically based on timeline, or click to test) */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              padding: '3px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginTop: '12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            }}
          >
            {[
              { id: 'full', label: '말씀 자막' },
              { id: 'initial', label: '초성 암송' },
              { id: 'blank', label: '빈칸 암송' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setManualMode(mode.id as any)}
                style={{
                  flex: 1,
                  padding: '6px 2px',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: activeMode === mode.id ? 'var(--primary)' : 'transparent',
                  color: activeMode === mode.id ? '#121210' : '#A6A398',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Engagement Panel */}
        <div
          style={{
            position: 'absolute',
            right: '8px',
            bottom: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            zIndex: 20,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => setLiked(!liked)}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '4px',
              }}
            >
              <Heart size={20} fill={liked ? 'var(--accent)' : 'none'} color={liked ? 'var(--accent)' : '#FFF'} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#FFF' }}>{liked ? '1.2K' : '1.1K'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '4px',
              }}
            >
              <MessageCircle size={20} fill="none" color="#FFF" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#FFF' }}>384</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '4px',
              }}
            >
              <Share2 size={20} fill="none" color="#FFF" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#FFF' }}>공유</span>
          </div>

          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MoreVertical size={20} color="#FFF" />
          </div>

          {/* Sound / Music Disc */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '2px solid #FFF',
              backgroundColor: '#121210',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: isPlaying ? 'spinSlow 4s linear infinite' : 'none',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Music size={8} color="#000" />
            </div>
          </div>
        </div>

        {/* Bottom Description Panel */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: '56px',
            padding: '24px 16px 16px',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
            zIndex: 20,
            color: '#FFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#000',
                fontSize: '11px',
              }}
            >
              성경
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>@bible_shorts</span>
            <span
              style={{
                backgroundColor: 'var(--accent)',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 700,
              }}
            >
              구독
            </span>
          </div>

          <p
            style={{
              fontSize: '12px',
              color: '#ECEBE6',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              marginBottom: '8px',
            }}
          >
            {title || '성경 말씀 쇼츠'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#A6A398' }}>
            <Music size={12} />
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '120px' }}>
              <div
                style={{
                  display: 'inline-block',
                  paddingLeft: '100%',
                  animation: isPlaying ? 'marquee 12s linear infinite' : 'none',
                }}
              >
                {musicInfo.bgMusicGenre || '오리지널 사운드'} ({musicInfo.musicMood || '음악'})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
