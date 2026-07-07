import { Calendar, Sparkles, BookOpen, CheckCircle } from 'lucide-react';

interface Planner52WeeksProps {
  onSelectPreset: (presetId: string) => void;
  onSetGeneratorConfig: (config: { day: number; weekday: string; theme: string }) => void;
  currentDayNumber: number;
}

interface DayPlan {
  day: number;
  weekday: string;
  theme: string;
  presetId?: string;
  suggestedTopic: string;
}

export function Planner52Weeks({
  onSelectPreset,
  onSetGeneratorConfig,
  currentDayNumber,
}: Planner52WeeksProps) {
  
  // Weekday definitions mapped to weekly themes
  const weekdayMapping = [
    { day: '월요일', theme: '위로 (Comfort)', topic: '슬픔 속에 있는 이들에게 주는 위안' },
    { day: '화요일', theme: '감사 (Gratitude)', topic: '범사에 감사하는 믿음' },
    { day: '수요일', theme: '지혜 (Wisdom)', topic: '솔로몬의 지혜와 분별력' },
    { day: '목요일', theme: '순종 (Obedience)', topic: '말씀에 대한 온전한 순종' },
    { day: '금요일', theme: '소망 (Hope)', topic: '절망을 이기는 그리스도의 소망' },
    { day: '토요일', theme: '사랑 (Love)', topic: '이웃을 향한 참된 사랑' },
    { day: '일요일', theme: '예배 (Worship)', topic: '하나님을 향한 온전한 예배' }
  ];

  // Local preset mappings (Days 1 to 4 correspond to our presets)
  const localPresets: Record<number, string> = {
    1: 'psalm23',
    2: 'philippians4',
    3: 'isaiah41',
    4: 'romans8'
  };

  // Generate 52 days plan
  const dayPlans: DayPlan[] = Array.from({ length: 52 }, (_, idx) => {
    const dayNum = idx + 1;
    const mappingIdx = idx % 7;
    const mapping = weekdayMapping[mappingIdx];
    return {
      day: dayNum,
      weekday: mapping.day,
      theme: mapping.theme,
      presetId: localPresets[dayNum],
      suggestedTopic: mapping.topic
    };
  });

  // Group by week (7 days per week)
  const weeks = Array.from({ length: 8 }, (_, idx) => {
    const weekNum = idx + 1;
    const startIdx = idx * 7;
    const endIdx = Math.min(startIdx + 7, 52);
    return {
      week: weekNum,
      plans: dayPlans.slice(startIdx, endIdx)
    };
  });

  return (
    <div
      className="glass-panel"
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
          <Calendar size={20} style={{ color: 'var(--primary)' }} /> 52주 성경 쇼츠 플래너 (52-Week Content Planner)
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          요일별 테마 스케줄러
        </span>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
        체계적인 52주 업로드를 위한 요일별 테마 로드맵입니다. 
        <strong> Day 1~4</strong>는 즉시 로딩 가능한 오프라인 대본 템플릿이 들어있으며, 
        그 외의 날짜는 해당하는 요일 테마와 함께 AI 생성 설정에 자동 반영됩니다.
      </p>

      {/* Week Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '550px', overflowY: 'auto', paddingRight: '6px' }}>
        {weeks.map((weekData) => (
          <div key={weekData.week} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--primary)', marginBottom: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} /> {weekData.week}주차 스케줄 (Week {weekData.week})
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '12px',
              }}
            >
              {weekData.plans.map((plan) => {
                const isPreset = !!plan.presetId;
                const isCurrent = plan.day === currentDayNumber;

                return (
                  <div
                    key={plan.day}
                    style={{
                      backgroundColor: isCurrent ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                      border: '1px solid',
                      borderColor: isCurrent ? 'var(--primary)' : 'var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Day Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: isCurrent ? 'var(--primary)' : '#FFF' }}>
                        Day {plan.day}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{plan.weekday}</span>
                    </div>

                    {/* Theme Badge */}
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isPreset ? 'var(--primary)' : 'var(--text-secondary)',
                      }}
                    >
                      {plan.theme.split(' ')[0]}
                    </div>

                    {/* Status indicator */}
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                      {isPreset ? '🎁 대본 프리셋 탑재' : `💡 ${plan.suggestedTopic}`}
                    </div>

                    {/* Action buttons */}
                    {isPreset ? (
                      <button
                        onClick={() => onSelectPreset(plan.presetId!)}
                        className="glowing-btn-primary"
                        style={{
                          padding: '6px 8px',
                          fontSize: '11px',
                          borderRadius: 'var(--radius-sm)',
                          marginTop: 'auto',
                          width: '100%',
                        }}
                      >
                        <CheckCircle size={10} /> 프리셋 로드
                      </button>
                    ) : (
                      <button
                        onClick={() => onSetGeneratorConfig({ day: plan.day, weekday: plan.weekday, theme: plan.theme })}
                        className="glowing-btn-secondary"
                        style={{
                          padding: '6px 8px',
                          fontSize: '11px',
                          borderRadius: 'var(--radius-sm)',
                          marginTop: 'auto',
                          width: '100%',
                        }}
                      >
                        <Sparkles size={10} /> 생성 설정
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
