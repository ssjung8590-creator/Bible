import type { ShortsScriptData } from './gemini';

export interface PresetItem {
  id: string;
  topic: string;
  bibleVersion: string;
  tone: string;
  data: ShortsScriptData;
}

export const PRESET_TOPICS: PresetItem[] = [
  {
    id: "psalm23",
    topic: "시편 23편 (여호와는 나의 목자시니)",
    bibleVersion: "KRV (개역한글)",
    tone: "Peaceful & Calming (평안하고 따뜻한)",
    data: {
      title: "마음이 불안할 때 듣는 시편 23편 (여호와는 나의 목자시니)",
      description: "마음이 흔들리고 두려울 때, 선한 목자 되신 하나님의 따뜻한 품을 신뢰해 보세요. 이 짧은 묵상이 당신의 마음에 참된 평안을 주기를 기도합니다. #성경 #시편23편 #성경쇼츠 #위로 #기독교 #성경묵상 #shorts",
      tags: ["성경", "시편23편", "위로", "기독교", "성경묵상"],
      script: [
        {
          id: "intro",
          type: "hook",
          narration: "혹시 마음이 불안하고 내일이 두려우신가요? 그렇다면 단 1분만 이 약속의 말씀에 귀를 기울여 보세요.",
          visualPrompt: "어두운 밤하늘에서 서서히 밝아오는 새벽 동녘, 잔잔히 흔들리는 나뭇가지와 별빛",
          duration: 6
        },
        {
          id: "verse",
          type: "verse",
          narration: "여호와는 나의 목자시니 내게 부족함이 없으리로다. 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다.",
          visualPrompt: "아침 안개 사이로 따스한 햇살이 내려앉는 넓고 평화로운 푸른 초원, 맑게 흐르는 잔잔한 시냇가",
          duration: 12
        },
        {
          id: "reflection",
          type: "reflection",
          narration: "우리는 인생이라는 길 위에서 자주 헤매고 불안해합니다. 하지만 선한 목자이신 주님은 우리보다 앞서 걸으시며 쉴 만한 곳을 마련해 주십니다. 오늘 하루 모든 무거운 짐을 그분께 다 내려놓으세요.",
          visualPrompt: "초원 위를 거니는 평화로운 양 떼와 지팡이를 든 목자의 따뜻한 실루엣, 흩날리는 아침 빛줄기",
          duration: 16
        },
        {
          id: "outro",
          type: "outro",
          narration: "오늘 하루도 목자 되신 하나님과 동행하며 깊은 평안을 누리시길 소망합니다. 은혜가 되셨다면 구독과 좋아요로 이 사랑을 나누어 주세요.",
          visualPrompt: "화면 중앙에 떠오르는 은은한 금빛 십자가 그래픽과 구독 및 좋아요 안내 애니메이션",
          duration: 6
        }
      ],
      audioSuggestion: {
        bgMusicGenre: "Ambient Peaceful Piano",
        musicMood: "Peaceful & Calming",
        voiceTone: "Warm, gentle, and comforting tone"
      },
      thumbnailIdea: {
        textOverlay: "마음이 불안할 때 듣는 말씀",
        visualDescription: "황금빛으로 빛나는 잔잔한 아침 초원 배경에 크고 굵은 흰색 및 노란색 서체로 텍스트 배치"
      }
    }
  },
  {
    id: "philippians4",
    topic: "빌립보서 4장 13절 (내게 능력 주시는 자 안에서)",
    bibleVersion: "KRV (개역한글)",
    tone: "Motivational & Inspiring (동기부여와 격려)",
    data: {
      title: "한계에 부딪혔을 때 힘이 되는 성경 말씀 (빌립보서 4:13)",
      description: "내 힘으로 아무것도 할 수 없다고 느껴질 때, 내 안에 계신 하나님의 능력을 의지하세요. 당신은 주님 안에서 모든 것을 할 수 있습니다! #빌립보서4장13절 #능력 #용기 #동기부여 #성경쇼츠 #기독교 #shorts",
      tags: ["빌립보서", "능력", "용기", "동기부여", "성경말씀"],
      script: [
        {
          id: "intro",
          type: "hook",
          narration: "자꾸만 실패하고 좌절하게 되나요? 내 능력이 한계에 도달했을 때, 이 말씀을 가슴에 품어보세요.",
          visualPrompt: "거칠고 가파른 산길을 묵묵히 올라가는 등산가의 뒷모습, 저 멀리 붉게 타오르는 일출",
          duration: 6
        },
        {
          id: "verse",
          type: "verse",
          narration: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.",
          visualPrompt: "어두운 산맥 너머로 강렬한 태양빛이 번지며 세상을 밝히는 순간, 웅장하고 힘 있는 빛의 구도",
          duration: 8
        },
        {
          id: "reflection",
          type: "reflection",
          narration: "이 말씀은 단순히 모든 일이 잘 풀린다는 뜻이 아닙니다. 어떤 역경과 가난, 고난 속에서도 내게 이겨낼 힘을 주시는 주님을 신뢰하겠다는 다짐입니다. 당신은 혼자가 아닙니다. 주님이 힘을 주십니다.",
          visualPrompt: "세찬 바람과 파도를 견뎌내며 우뚝 서 있는 등대의 모습, 밤하늘을 뚫고 지나가는 밝은 서치라이트",
          duration: 18
        },
        {
          id: "outro",
          type: "outro",
          narration: "오늘도 내게 능력 주시는 주님을 의지하며 용기 있게 나아가세요. 힘이 되셨다면 구독과 좋아요로 함께해 주세요!",
          visualPrompt: "주먹을 꽉 쥔 실루엣 위로 금빛 선들이 번지며 채널의 구독 로고가 떠오르는 모습",
          duration: 6
        }
      ],
      audioSuggestion: {
        bgMusicGenre: "Cinematic Orchestral & Brass",
        musicMood: "Powerful & Inspiring",
        voiceTone: "Confident, strong, and encouraging voice"
      },
      thumbnailIdea: {
        textOverlay: "한계에 부딪힌 당신에게",
        visualDescription: "웅장한 산 정상에서 하늘을 향해 빛이 솟구치는 일출 배경, 강렬한 노란색의 굵은 볼드 텍스트"
      }
    }
  },
  {
    id: "isaiah41",
    topic: "이사야 41장 10절 (두려워하지 말라)",
    bibleVersion: "KRV (개역한글)",
    tone: "Deep & Solemn (깊이 있고 장엄한)",
    data: {
      title: "두려움이 밀려올 때 꼭 들어야 할 하나님의 음성 (이사야 41:10)",
      description: "세상 속에 홀로 남겨진 것 같고 미래가 두려울 때, 우리를 붙드시는 하나님의 강한 손을 기억하십시오. #이사야41장10절 #두려움극복 #위로 #성경말씀 #성경쇼츠 #기독교 #shorts",
      tags: ["이사야", "두려움", "위로", "동행", "성경"],
      script: [
        {
          id: "intro",
          type: "hook",
          narration: "불확실한 미래 때문에 밤잠을 설치고 계신가요? 지금 하나님께서 당신에게 건네시는 말씀입니다.",
          visualPrompt: "거칠게 휘몰아치는 파도와 폭풍우가 몰아치는 어두운 바다 한가운데의 외로운 돛단배",
          duration: 6
        },
        {
          id: "verse",
          type: "verse",
          narration: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라 참으로 나의 의로운 오른손으로 너를 붙들리라.",
          visualPrompt: "먹구름을 뚫고 쏟아지는 찬란한 황금빛 태양 빛줄기가 거친 바다를 고요하게 비추는 장엄한 풍경",
          duration: 16
        },
        {
          id: "reflection",
          type: "reflection",
          narration: "하나님은 우리가 두려워하지 않을 이유가 '그분이 우리와 함께하시기 때문'이라고 말씀하십니다. 세상의 어떤 고난도 하나님의 강한 오른손에서 당신을 빼앗을 수 없습니다. 두려움을 주님께 맡기세요.",
          visualPrompt: "아이의 작은 손을 꽉 쥐어주는 부모의 크고 따뜻한 손, 부드러운 숲속 햇살 아래에서의 평화로운 클로즈업",
          duration: 16
        },
        {
          id: "outro",
          type: "outro",
          narration: "주님의 손을 붙잡고 평안히 눈을 감으세요. 오늘도 은혜로운 시간이 되셨다면 구독과 좋아요로 격려 부탁드립니다.",
          visualPrompt: "잔잔해진 바다 위로 노을이 지는 모습 위에 흰색 십자가 심볼과 구독 안내 텍스트 노출",
          duration: 6
        }
      ],
      audioSuggestion: {
        bgMusicGenre: "Epic Cinematic Strings & Choir",
        musicMood: "Solemn, Majestic & Deep",
        voiceTone: "Deep, calm, and highly resonant tone"
      },
      thumbnailIdea: {
        textOverlay: "두려워하지 말라",
        visualDescription: "어두운 폭풍우 속에서 쏟아지는 환한 빛줄기와 그 아래 굳건히 서 있는 인물의 실루엣, 붉은색 강렬한 포인트 텍스트"
      }
    }
  },
  {
    id: "romans8",
    topic: "로마서 8장 28절 (모든 것이 합력하여 선을 이룸)",
    bibleVersion: "KRV (개역한글)",
    tone: "Peaceful & Calming (평안하고 따뜻한)",
    data: {
      title: "고난 뒤에 숨겨진 축복의 비밀 (로마서 8:28)",
      description: "지금 겪고 있는 아픔과 이해할 수 없는 슬픔이 결국에는 선한 열매로 맺어질 것입니다. 하나님의 큰 그림을 믿으세요. #로마서8장28절 #고난 #축복 #믿음 #성경말씀 #성경쇼츠 #shorts",
      tags: ["로마서", "소망", "믿음", "인내", "성경"],
      script: [
        {
          id: "intro",
          type: "hook",
          narration: "왜 나에게 이런 시련이 오는지 이해할 수 없어 눈물 흘리고 계신가요? 이 말씀에서 해답을 찾아보세요.",
          visualPrompt: "가문 흙바닥에 떨어져 비바람을 맞고 있는 작고 보잘것없는 씨앗 하나",
          duration: 6
        },
        {
          id: "verse",
          type: "verse",
          narration: "우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라.",
          visualPrompt: "씨앗에서 새싹이 돋아나고, 마침내 탐스럽고 아름다운 열매를 맺은 거대한 생명의 나무로 자라나는 타임랩스 비주얼",
          duration: 12
        },
        {
          id: "reflection",
          type: "reflection",
          narration: "하나님은 우리의 기쁜 순간뿐만 아니라 눈물과 아픔, 실패의 파편까지도 모아 가장 아름다운 그림을 완성해 가십니다. 지금의 고난은 선한 결말을 향해 가는 과정일 뿐입니다. 안심하고 신뢰하십시오.",
          visualPrompt: "어두운 방에서 직조 기계가 실을 짜는 모습, 무수한 어두운 실들이 모여 화려하고 섬세한 황금 태피스트리가 완성되는 비주얼",
          duration: 18
        },
        {
          id: "outro",
          type: "outro",
          narration: "당신의 모든 슬픔을 기쁨으로 바꾸실 주님을 찬양합니다. 더 많은 말씀 묵상을 원하시면 구독과 좋아요를 눌러주세요.",
          visualPrompt: "바람에 흔들리는 노란 들꽃 밭 위로 비치는 은은한 태양광 위에 깔끔한 구독 유도 그래픽",
          duration: 6
        }
      ],
      audioSuggestion: {
        bgMusicGenre: "Acoustic Guitar & Flute",
        musicMood: "Warm, Hopeful & Peaceful",
        voiceTone: "Soft, friendly, and narrative style voiceover"
      },
      thumbnailIdea: {
        textOverlay: "결국은 잘 될 것입니다",
        visualDescription: "울창하고 눈부신 숲속 길에 비추는 아침 햇살, 초록과 황금이 어우러진 배경 위에 감성적이고 부드러운 화이트 폰트"
      }
    }
  }
];
