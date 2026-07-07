import { useState, useEffect } from 'react';
import { Sparkles, Settings, Play, RefreshCw, AlertCircle, Check, Download, BookOpen, Upload } from 'lucide-react';
import { generateBibleShort } from './services/gemini';
import type { ShortsScriptData, VideoFormatType } from './services/gemini';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ShortsPreview } from './components/ShortsPreview';
import { ScriptWorkspace } from './components/ScriptWorkspace';
import { MetadataGenerator } from './components/MetadataGenerator';
import { PRESET_TOPICS } from './services/presets';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [topicOrVerse, setTopicOrVerse] = useState('시편 23편 1절');
  const [tone, setTone] = useState('Peaceful (평안하고 따뜻한)');
  const [duration, setDuration] = useState(25);
  const [bibleVersion, setBibleVersion] = useState('KRV (개역한글)');
  
  const [videoFormat] = useState<VideoFormatType>('memorization');
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [weekdayTheme] = useState<string>('월요일 - 위로 (Comfort)');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Script and main verse text state
  const [scriptData, setScriptData] = useState<ShortsScriptData | null>(PRESET_TOPICS[0].data);
  const [verseText, setVerseText] = useState<string>('');

  // Sync default loaded scripture text on mount
  useEffect(() => {
    const defaultVerse = PRESET_TOPICS[0].data.script.find(s => s.type === 'verse')?.narration || '';
    setVerseText(defaultVerse);
  }, []);

  // Load API Key on Mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    setApiKey(savedKey);
  }, []);

  // Handler to load preset data directly
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_TOPICS.find((p) => p.id === presetId);
    if (preset) {
      setScriptData(JSON.parse(JSON.stringify(preset.data))); // Deep clone preset data
      const verse = preset.data.script.find(s => s.type === 'verse')?.narration || '';
      setVerseText(verse);
      setTopicOrVerse(preset.topic.split(' (')[0]);
      setBibleVersion(preset.bibleVersion);
      setTone(preset.tone);
      
      const dayMatch = preset.data.title.match(/Day (\d+)/);
      if (dayMatch) {
        setDayNumber(parseInt(dayMatch[1]));
      }
      setError(null);
    }
  };

  // Generate Script using Gemini API
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicOrVerse.trim()) return;

    if (!apiKey) {
      setIsApiModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generated = await generateBibleShort(apiKey, {
        topicOrVerse,
        tone,
        targetDuration: duration,
        bibleVersion,
        videoFormat,
        weekdayTheme,
        dayNumber,
      });
      setScriptData(generated);
      const verse = generated.script.find(s => s.type === 'verse')?.narration || '';
      setVerseText(verse);
    } catch (err: any) {
      console.error(err);
      setError('AI 스크립트 생성 중 오류가 발생했습니다. API 키가 유효한지 확인하고 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export full script package as .txt file
  const handleExportScript = () => {
    if (!scriptData) return;

    // Helper functions for TXT export output
    const getKoreanInitials = (text: string) => {
      const INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
      return text.split('').map(char => {
        const code = char.charCodeAt(0) - 0xAC00;
        if (code >= 0 && code <= 11171) return INITIALS[Math.floor(code / 588)];
        return char;
      }).join('');
    };

    const getBlankMask = (text: string) => {
      return text.split(' ').map((word, idx) => {
        if (idx % 2 === 1 && /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(word)) return word.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '_');
        return word;
      }).join(' ');
    };
    
    let content = `=========================================\n`;
    content += `ScriptureShorts AI - 말씀 암송 쇼츠 대본 패키지\n`;
    content += `=========================================\n\n`;
    content += `영상 제목: ${scriptData.title}\n\n`;
    content += `영상 설명:\n${scriptData.description}\n\n`;
    content += `태그: ${scriptData.tags.map(t => `#${t}`).join(', ')}\n\n`;
    content += `-----------------------------------------\n`;
    content += `성경 말씀 암송 3종 패키지 (Scripture Memorization)\n`;
    content += `-----------------------------------------\n\n`;
    content += `[1. 말씀 자막 (Full Scripture)]\n${verseText}\n\n`;
    content += `[2. 초성 자막 (Consonant Hints)]\n${getKoreanInitials(verseText)}\n\n`;
    content += `[3. 빈칸 자막 (Blank Mask)]\n${getBlankMask(verseText)}\n\n`;
    content += `-----------------------------------------\n`;
    content += `사운드 추천안\n`;
    content += `-----------------------------------------\n\n`;
    content += `BGM 추천 장르: ${scriptData.audioSuggestion.bgMusicGenre}\n`;
    content += `음악 무드: ${scriptData.audioSuggestion.musicMood}\n`;
    content += `성우 내레이션 톤: ${scriptData.audioSuggestion.voiceTone}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${scriptData.title.substring(0, 20).replace(/[^\w\sㄱ-힣]/g, '')}_MemorizationPackage.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import and parse ScriptureShorts package .txt file
  const handleImportScript = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        let title = '';
        let description = '';
        let tags: string[] = [];
        let verse = '';

        // Parse Title
        const titleMatch = text.match(/영상 제목:\s*(.*)/);
        if (titleMatch) title = titleMatch[1].trim();

        // Parse Description
        const descMatch = text.match(/영상 설명:\s*\n([\s\S]*?)(?=\n\n태그:|\n\n-)/);
        if (descMatch) description = descMatch[1].trim();

        // Parse Tags
        const tagsMatch = text.match(/태그:\s*(.*)/);
        if (tagsMatch) {
          tags = tagsMatch[1]
            .split(',')
            .map(t => t.replace(/#/g, '').trim())
            .filter(Boolean);
        }

        // Parse Verse Text
        const verseMatch = text.match(/\[1\. 말씀 자막 \(Full Scripture\)\]\s*\n([\s\S]*?)(?=\n\n\[2\.|$)/);
        if (verseMatch) verse = verseMatch[1].trim();

        if (!verse) {
          alert('텍스트 파일에서 말씀 자막을 찾을 수 없습니다. 올바른 패키지 파일인지 확인해 주세요.');
          return;
        }

        // Create scriptData representation from parsed fields
        const newScriptData: ShortsScriptData = {
          title: title || '가져온 말씀 쇼츠 대본',
          description: description || '',
          tags: tags.length > 0 ? tags : ['성경', '암송'],
          script: [
            {
              time: '0:00',
              type: 'intro',
              visual: '도입부 화면',
              narration: '오늘의 말씀입니다.'
            },
            {
              time: '0:03',
              type: 'verse',
              visual: '성경 구절 화면',
              narration: verse
            }
          ],
          audioSuggestion: {
            bgMusicGenre: 'Ambient',
            musicMood: 'Peaceful',
            voiceTone: 'Warm'
          }
        };

        setScriptData(newScriptData);
        setVerseText(verse);

        // Try extracting Day Number from Title
        const dayMatch = title.match(/Day\s*(\d+)/i);
        if (dayMatch) {
          setDayNumber(parseInt(dayMatch[1]));
        }

        // Try extracting Topic from Title
        const topic = title.replace(/매일 말씀\s*Day\s*\d+\s*/gi, '').replace(/_ScriptPackage/g, '').trim();
        if (topic) {
          setTopicOrVerse(topic);
        }

        alert('말씀 암송 패키지 파일을 성공적으로 가져왔습니다!');
      } catch (err) {
        console.error(err);
        alert('파일을 파싱하는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        className="glass-panel"
        style={{
          borderBottom: '1px solid var(--border-light)',
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px var(--accent-glow)',
            }}
          >
            <Play size={18} fill="#FFF" color="#FFF" />
          </div>
          <div>
            <h1 className="text-gradient-gold" style={{ fontSize: '18px', fontWeight: 800 }}>
              ScriptureShorts AI
            </h1>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              말씀 암송 유튜브 쇼츠 제작 도구
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {apiKey ? (
            <span
              style={{
                fontSize: '12px',
                color: '#2ec4b6',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(46, 196, 182, 0.08)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(46, 196, 182, 0.2)',
              }}
            >
              <Check size={12} /> Gemini API 연결됨
            </span>
          ) : (
            <span
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-surface)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
              }}
            >
              API Key 미설정
            </span>
          )}
          <label
            className="glowing-btn-secondary"
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              margin: 0
            }}
          >
            <Upload size={14} /> 패키지 가져오기 (.TXT)
            <input
              type="file"
              accept=".txt"
              onChange={handleImportScript}
              style={{ display: 'none' }}
            />
          </label>
          <button
            onClick={handleExportScript}
            disabled={!scriptData || !verseText}
            className={(scriptData && verseText) ? "glowing-btn-primary" : "glowing-btn-secondary"}
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              opacity: (scriptData && verseText) ? 1 : 0.4,
              cursor: (scriptData && verseText) ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={14} /> 패키지 내보내기 (.TXT)
          </button>
          <button
            onClick={() => setIsApiModalOpen(true)}
            className="glowing-btn-secondary"
            style={{ padding: '8px 12px', fontSize: '13px' }}
          >
            <Settings size={14} /> 설정
          </button>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main
        style={{
          flex: 1,
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '24px',
        }}
      >
        {/* Left Control Panel / Input Form */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form
            onSubmit={handleGenerate}
            className="glass-panel"
            style={{
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} style={{ color: 'var(--primary)' }} /> 암송 쇼츠 생성
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                성경 구절 또는 핵심 주제
              </label>
              <input
                type="text"
                value={topicOrVerse}
                onChange={(e) => setTopicOrVerse(e.target.value)}
                placeholder="예: 시편 23편, 요한복음 3:16"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                  성경 버전
                </label>
                <select value={bibleVersion} onChange={(e) => setBibleVersion(e.target.value)}>
                  <option>KRV (개역한글)</option>
                  <option>KLB (현대인의 성경)</option>
                  <option>NIV</option>
                  <option>ESV</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                  영상 톤 (Tone)
                </label>
                <select value={tone} onChange={(e) => setTone(e.target.value)}>
                  <option>Peaceful (평안하고 따뜻한)</option>
                  <option>Motivational (격려와 동기부여)</option>
                  <option>Deep & Solemn (장엄하고 묵직한)</option>
                  <option>Cinematic (극적이고 화려한)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                  회차 번호 (Day)
                </label>
                <input
                  type="number"
                  min="1"
                  value={dayNumber}
                  onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                  목표 시간
                </label>
                <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}>
                  <option value={20}>20초</option>
                  <option value={25}>25초</option>
                  <option value={30}>30초</option>
                  <option value={40}>40초</option>
                  <option value={50}>50초</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="glowing-btn-primary"
              disabled={isLoading || !topicOrVerse.trim()}
              style={{ marginTop: '6px' }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="spin-animation" style={{ animation: 'spinSlow 2s linear infinite' }} />
                  대본 작성 중...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> 말씀 암송 AI 생성
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Selector */}
          <div
            className="glass-panel"
            style={{
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} /> 프리셋 원클릭 로드
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PRESET_TOPICS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset.id)}
                  className="glowing-btn-secondary"
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    textAlign: 'left',
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                >
                  📖 {preset.topic.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Output Area */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {isLoading ? (
            /* Loading State Display */
            <div
              className="glass-panel"
              style={{
                flex: 1,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 24px',
                gap: '20px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '3px solid var(--border-light)',
                  borderTopColor: 'var(--primary)',
                  animation: 'spinSlow 1s linear infinite',
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <h3 className="font-heading" style={{ fontSize: '18px', color: 'var(--primary)', marginBottom: '8px' }}>
                  말씀 암송 패키지 생성 중
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  성경 구절 정독 및 암송용 필터 버전 대본을 한 번에 설계하고 있습니다...
                </p>
              </div>
            </div>
          ) : error ? (
            /* Error Display */
            <div
              className="glass-panel"
              style={{
                flex: 1,
                borderRadius: 'var(--radius-lg)',
                padding: '40px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
              }}
            >
              <AlertCircle size={48} style={{ color: 'var(--accent)' }} />
              <div>
                <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>대본 생성 실패</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                  {error}
                </p>
              </div>
              <button onClick={() => setIsApiModalOpen(true)} className="glowing-btn-primary">
                API Key 설정 확인하기
              </button>
            </div>
          ) : scriptData ? (
            /* Main Workspace - directly show preview and simplified script editor */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '340px 1fr',
                  gap: '24px',
                  alignItems: 'start',
                }}
              >
                {/* Visual Phone Mockup looping target verse text */}
                <ShortsPreview
                  verseText={verseText}
                  title={scriptData.title}
                  musicInfo={{
                    bgMusicGenre: scriptData.audioSuggestion.bgMusicGenre,
                    musicMood: scriptData.audioSuggestion.musicMood,
                  }}
                />

                {/* Edit script workspace with 1, 2, 3 outputs automatically generated */}
                <ScriptWorkspace
                  verseText={verseText}
                  onUpdateVerseText={setVerseText}
                  tone={tone}
                  dayNumber={dayNumber}
                />
              </div>

              {/* SEO Packaging details */}
              <MetadataGenerator data={scriptData} />
            </div>
          ) : null}
        </section>
      </main>

      {/* API Key settings modal */}
      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSave={(key) => setApiKey(key)}
      />
    </div>
  );
}
