import { useState } from 'react';
import { Edit3, Video } from 'lucide-react';

interface ScriptWorkspaceProps {
  verseText: string;
  onUpdateVerseText: (text: string) => void;
  tone: string;
  dayNumber: number;
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

// Text wrapping utility for HTML5 Canvas rendering
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, startY: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  const lines: string[] = [];
  
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  
  // Draw all lines centered vertically around startY
  const totalHeight = lines.length * lineHeight;
  let currentY = startY - (totalHeight / 2) + (lineHeight / 2);
  
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, currentY);
    currentY += lineHeight;
  }
}

export function ScriptWorkspace({
  verseText,
  onUpdateVerseText,
  tone,
  dayNumber,
}: ScriptWorkspaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);

  // Client-side video generation function using HTML5 Canvas & MediaRecorder
  const handleExportMp4Video = () => {
    setIsRecording(true);
    setRecordProgress(0);

    const duration = 12; // Total Shorts video length: 12 seconds
    const fps = 30;
    const totalFrames = duration * fps;

    // Create high-res vertical canvas (1080x1920 standard vertical Shorts size)
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      alert('비디오 녹화 엔진을 시작할 수 없습니다. 다른 브라우저에서 시도해 주세요.');
      setIsRecording(false);
      return;
    }

    // Set up MediaStream from Canvas
    const stream = canvas.captureStream(fps);
    let mediaRecorder: MediaRecorder;
    const chunks: Blob[] = [];

    try {
      // Choose supported format (VP9/WebM is standard in Chrome/Firefox)
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000 // High-quality 5 Mbps bitrate
      });
    } catch (e) {
      try {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm'
        });
      } catch (err) {
        alert('이 브라우저는 비디오 녹화 기능을 지원하지 않습니다. Chrome 브라우저 사용을 권장합니다.');
        setIsRecording(false);
        return;
      }
    }

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      // Auto download download trigger
      const a = document.createElement('a');
      a.href = url;
      a.download = `BibleShorts_Day${dayNumber}.webm`;
      a.click();
      
      setIsRecording(false);
      setRecordProgress(0);
      alert(`성경 쇼츠 비디오 파일이 성공적으로 렌더링되어 컴퓨터에 다운로드되었습니다!\n(파일명: BibleShorts_Day${dayNumber}.webm)`);
    };

    // Start recording
    mediaRecorder.start();

    // Render loop frame-by-frame
    let frame = 0;
    const renderInterval = setInterval(() => {
      frame++;
      const progressPercent = Math.min(Math.round((frame / totalFrames) * 100), 100);
      setRecordProgress(progressPercent);

      // 1. Draw background gradient (soft pastel twilight sunset theme)
      const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
      gradient.addColorStop(0, '#16224f'); // Soft deep indigo sky
      gradient.addColorStop(0.55, '#8c5b70'); // Soft pastel rose/lavender dusk
      gradient.addColorStop(1, '#e5be9b'); // Soft warm gold horizon
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // 2. Draw subtle golden glowing borders
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.lineWidth = 16;
      ctx.strokeRect(30, 30, 1020, 1860);

      // 3. Draw watermarks / top label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`[ 매일 말씀 Day ${dayNumber} ]`, 540, 120);

      ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
      ctx.fillText('† 말씀 암송 챌린지', 540, 200);

      // 4. Draw progress bar at the top
      const barWidth = (frame / totalFrames) * 1080;
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(0, 0, barWidth, 12);

      // 5. Select active text version based on timeframe
      const ratio = frame / totalFrames;
      let textToDraw = verseText;
      let phaseLabel = '1단계: 말씀 정독';
      
      if (ratio >= 0.33 && ratio < 0.66) {
        textToDraw = getKoreanInitials(verseText);
        phaseLabel = '2단계: 초성 암송';
      } else if (ratio >= 0.66) {
        textToDraw = getBlankMask(verseText);
        phaseLabel = '3단계: 빈칸 암송';
      }

      // Draw current stage indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText(phaseLabel, 540, 340);

      // 6. Draw central wrapped bible verse text (glowing white, styled serif)
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.font = '800 64px sans-serif';
      ctx.textAlign = 'center';

      wrapText(ctx, textToDraw, 540, 960, 900, 100);

      // Reset shadows for bottom elements
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // 7. Draw channel branding watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = '500 36px sans-serif';
      ctx.fillText('@bible_shorts', 540, 1780);

      // If finished, clear interval and stop media recorder
      if (frame >= totalFrames) {
        clearInterval(renderInterval);
        mediaRecorder.stop();
      }
    }, 1000 / fps);
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
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Edit3 size={20} style={{ color: 'var(--primary)' }} /> 성경 말씀 편집기 (Script Workspace)
        </h3>
        <span
          style={{
            fontSize: '12px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-light)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
          }}
        >
          분위기: <strong style={{ color: 'var(--primary)' }}>{tone}</strong>
        </span>
      </div>

      {/* Input / Editing Textarea */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
          선택된 말씀 구절 내용
        </label>
        <textarea
          rows={4}
          value={verseText}
          onChange={(e) => onUpdateVerseText(e.target.value)}
          placeholder="여기에 성경 구절을 입력하거나 대본을 생성하세요..."
          style={{
            resize: 'vertical',
            lineHeight: '1.6',
            fontSize: '16px',
            padding: '12px',
            fontFamily: 'var(--font-body)',
          }}
        />
      </div>

      {/* Video Generation Tool Card (New '니가해줘' Solution!) */}
      <div
        style={{
          border: '1px solid var(--primary-glow)',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          padding: '18px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Video size={18} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>원스톱 쇼츠 비디오 파일로 다운로드</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          별도의 편집 프로그램 없이, 클릭 한 번으로 자막/초성/빈칸 단계가 자동으로 흘러가는 **세로형 유튜브 쇼츠 영상 파일(.webm)**을 즉시 렌더링하고 다운로드합니다.
        </p>

        {isRecording ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--primary)' }}>
              <span>브라우저 캔버스로 비디오 프레임 렌더링 및 녹화 중...</span>
              <strong>{recordProgress}%</strong>
            </div>
            <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${recordProgress}%`, backgroundColor: 'var(--primary)', transition: 'width 0.1s linear' }} />
            </div>
          </div>
        ) : (
          <button
            onClick={handleExportMp4Video}
            className="glowing-btn-primary"
            style={{
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: 'var(--primary)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Video size={14} /> 12초 말씀 암송 쇼츠 비디오 파일(.webm) 다운로드
          </button>
        )}
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
          ※ 다운로드 완료된 .webm 영상은 유튜브 업로드 시 쇼츠로 완벽 호환됩니다. 오디오(배경음/성우)는 유튜브 앱 내에서 업로드 시 삽입할 수 있습니다.
        </span>
      </div>

      {/* Copyable Subtitle, Consonant, Blank versions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px dashed var(--border-light)', paddingTop: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>
          🎯 말씀 암송용 자막 3종 복사 패키지
        </div>

        {/* Version 1: 말씀 자막 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>1. 말씀 자막 (Full Scripture)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(verseText);
                alert('말씀 자막이 클립보드에 복사되었습니다!');
              }}
              className="glowing-btn-secondary"
              style={{ padding: '4px 12px', fontSize: '12px' }}
            >
              복사
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={verseText}
            style={{ fontSize: '13px', padding: '8px 12px', backgroundColor: 'var(--bg-surface-elevated)' }}
          />
        </div>

        {/* Version 2: 초성 자막 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#00bcd4' }}>2. 초성 자막 (Consonant Hints)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getKoreanInitials(verseText));
                alert('초성 자막이 클립보드에 복사되었습니다!');
              }}
              className="glowing-btn-secondary"
              style={{ padding: '4px 12px', fontSize: '12px' }}
            >
              복사
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={getKoreanInitials(verseText)}
            style={{ fontSize: '13px', padding: '8px 12px', backgroundColor: 'var(--bg-surface-elevated)', fontFamily: 'monospace' }}
          />
        </div>

        {/* Version 3: 빈칸 자막 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#ff9800' }}>3. 빈칸 자막 (Blank Mask)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getBlankMask(verseText));
                alert('빈칸 자막이 클립보드에 복사되었습니다!');
              }}
              className="glowing-btn-secondary"
              style={{ padding: '4px 12px', fontSize: '12px' }}
            >
              복사
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={getBlankMask(verseText)}
            style={{ fontSize: '13px', padding: '8px 12px', backgroundColor: 'var(--bg-surface-elevated)' }}
          />
        </div>
      </div>

      <div
        style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '4px'
        }}
      >
        <span>글자 수: {verseText.length}자</span>
        <span>공백 제외: {verseText.replace(/\s+/g, '').length}자</span>
      </div>
    </div>
  );
}
