import { GoogleGenAI } from '@google/genai';

export interface ScriptSection {
  id: string;
  type: 'hook' | 'verse' | 'etymology' | 'reflection' | 'prayer' | 'question' | 'outro';
  narration: string;
  visualPrompt: string;
  duration: number; // in seconds
}

export interface ShortsScriptData {
  title: string;
  description: string;
  tags: string[];
  script: ScriptSection[];
  audioSuggestion: {
    bgMusicGenre: string;
    musicMood: string;
    voiceTone: string;
  };
  thumbnailIdea: {
    textOverlay: string;
    visualDescription: string;
  };
}

export type VideoFormatType = 'standard' | 'calligraphy' | 'meditation' | 'etymology' | 'question' | 'memorization';

/**
 * Generates a full YouTube Short script and assets based on a Bible topic, verse, format, and theme.
 * Uses gemini-2.5-flash with JSON output constraints.
 */
export async function generateBibleShort(
  apiKey: string,
  input: {
    topicOrVerse: string;
    tone: string;
    targetDuration: number;
    bibleVersion: string;
    videoFormat: VideoFormatType;
    weekdayTheme: string;
    dayNumber: number;
  }
): Promise<ShortsScriptData> {
  const ai = new GoogleGenAI({ apiKey });

  // Custom formatting prompt guidelines based on user selected video format
  let formatGuideline = '';
  switch (input.videoFormat) {
    case 'memorization':
      formatGuideline = `
- 포맷: 말씀 암송형 (말씀 구절을 효율적으로 외우기 위한 암기 트레이닝 비디오)
- 이 비디오는 시청자가 말씀을 암송하도록 돕습니다.
- 스크립트 구성:
  1. 인트로 훅 (hook)
  2. 말씀 1회독 (verse): 온전한 자막과 함께 정독 낭독.
  3. 말씀 2회독 (reflection/repetition): 오디오는 끊어 읽거나 따라할 수 있도록 속도를 늦추고, 핵심 단어들을 괄호 또는 가림 처리하라는 텍스트 팁 제공.
  4. 아웃트로 (outro): 구독 유도 및 오늘의 말씀 암송 완료 축하 멘트.
- 비주얼 연출 프롬프트는 텍스트가 화면에서 서서히 빈칸으로 사라지거나 하이라이트되는 모션 그래픽 연출을 포함해 주세요.
`;
      break;
    case 'calligraphy':
      formatGuideline = `
- 포맷: 캘리그라피형 (손글씨 작성 타임랩스 비주얼 강조)
- 비주얼 연출 프롬프트는 캘리그라피 붓이나 펜으로 종이에 성경 구절을 정성스럽게 작성하는 손 모습, 잉크 번짐 등의 클로즈업 묘사를 포함해 주세요.
- 내레이션은 부드럽고 잔잔한 톤으로 흘러야 합니다.
`;
      break;
    case 'meditation':
      formatGuideline = `
- 포맷: 묵상형 (말씀 + 30초 묵상 + 오늘의 기도 한 줄)
- 스크립트 단락 구성에 반드시 "묵상글(reflection)"과 "오늘의 기도 한 줄(prayer)" 단락을 따로 분리해 주세요.
- 기도는 "오늘의 기도"로 라벨링하고, 마음 깊이 새길 수 있는 1줄짜리 기도로 작성해 주세요.
`;
      break;
    case 'etymology':
      formatGuideline = `
- 포맷: 원어 해설형 (히브리어/헬라어 단어의 깊은 의미 곁들이기)
- 성경 구절의 핵심 단어 중 히브리어(Hebrew) 또는 헬라어(Greek) 단어를 하나 선택하여, 10초 내외의 짤막한 원어 어원 및 깊은 뜻 풀이 단락("etymology")을 대본 중간에 포함해 주세요.
`;
      break;
    case 'question':
      formatGuideline = `
- 포맷: 질문 던지기형 (적용 질문 및 댓글 소통 유도)
- 아웃트로 단락 전후에 시청자에게 생각할 거리를 제공하는 핵심 질문("question") 단락을 구성해 주세요.
- 예: "오늘 하루, 이 말씀을 내 삶에 어떻게 실천해 볼까요? 당신의 다짐을 댓글로 나누어 주세요."처럼 댓글 참여를 강하게 유도합니다.
`;
      break;
    case 'standard':
    default:
      formatGuideline = `
- 포맷: 1분 쇼츠형 (말씀 낭독 + 잔잔한 묵상 가이드 표준형)
- 인트로 훅, 본문 낭독, 묵상 및 적용, 구독 유도 아웃트로로 자연스럽게 연결되는 4단 구성.
`;
      break;
  }

  const prompt = `
You are an expert YouTube content creator specializing in highly engaging, inspiring Christian content and Bible YouTube Shorts.
Generate a high-quality vertical YouTube Short script and asset packaging for:
- Topic or Verse: "${input.topicOrVerse}"
- Day Number of Series: Day ${input.dayNumber}
- Weekday Theme: ${input.weekdayTheme} (요일 테마에 맞는 말씀 및 묵상 톤으로 제작)
- Video Format: ${input.videoFormat} (${formatGuideline})
- Tone of Voice: ${input.tone}
- Bible Version: ${input.bibleVersion}
- Target Duration: ${input.targetDuration} seconds
- Language: Korean (한국어). The output script, title, description, and visualPrompts must be in Korean.

The video title MUST follow this exact template:
"[매일 말씀 Day ${input.dayNumber}] [성경 구절 정보] - [영상 주제 핵심 7자 이내]"
Example: "[매일 말씀 Day 1] 시편 23편 1절 - 부족함이 없으리로다"

The output MUST be a JSON object matching the following structure:
{
  "title": "Generated video title following the template above",
  "description": "Short video description. Include the full scripture text, reflection summary, call-to-action, and hashtags (#매일말씀 #성경 #shorts #기독교 및 관련태그) (in Korean)",
  "tags": ["3 to 5 relevant tag strings"],
  "script": [
    {
      "id": "intro",
      "type": "hook",
      "narration": "First 3-5 seconds. '오늘의 말씀, [구절 이름] Day ${input.dayNumber}'와 같은 스크롤 스토퍼 훅으로 시작.",
      "visualPrompt": "Detailed visual layout / background recommendation for the intro hook",
      "duration": 4
    },
    {
      "id": "verse",
      "type": "verse",
      "narration": "The Bible verse reading.",
      "visualPrompt": "Visual layout description (subtitles overlay, typing animations)",
      "duration": 10
    },
    ... (add other sections according to the format selected: e.g., 'etymology', 'reflection', 'prayer', 'question', 'outro')
  ],
  "audioSuggestion": {
    "bgMusicGenre": "Suitable BG music (e.g., CCM Quiet Piano, Acoustic Guitar, Orchestral Ambient)",
    "musicMood": "Mood (e.g., Warm, Solemn, Peaceful)",
    "voiceTone": "Voiceover tone recommendation"
  },
  "thumbnailIdea": {
    "textOverlay": "Short impact text for thumbnail (e.g., '내게 부족함이 없으리로다')",
    "visualDescription": "Visual layout idea (in Korean)"
  }
}

Ensure the sum of durations of all script sections matches close to ${input.targetDuration} seconds.
Provide clean JSON output, no markdown wraps.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text?.trim() || '{}';
    const parsedData = JSON.parse(responseText) as ShortsScriptData;
    return parsedData;
  } catch (error) {
    console.error('Error generating script with Gemini:', error);
    throw error;
  }
}
