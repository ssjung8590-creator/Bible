# ScriptureShorts AI - Bible YouTube Shorts Creator

성경 구절 또는 특정 신앙 주제를 입력하면 유튜브 쇼츠(YouTube Shorts) 제작을 위한 인트로 훅, 성경 구절 낭독, 묵상/인생 적용점, 아웃트로(CTA) 대본과 비주얼 스토리보드 프롬프트, 그리고 클릭률(CTR)을 높여줄 SEO 제목 및 해시태그를 AI로 자동 생성하고 미리보기해 주는 프리미엄 웹 플랫폼입니다.

![App Screenshot](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 주요 기능
- **AI 스크립트 작성**: 인트로 훅, 말씀 리딩, 묵상글, 아웃트로를 타임라인으로 구조화하여 대본을 생성 및 직접 편집 가능.
- **실시간 쇼츠 프리뷰**: 수정한 대본 내레이션이 실시간 가사 자막 형식으로 흐르는 가상 스마트폰 쇼츠 플레이어 제공.
- **비주얼 스토리보드**: 각 대본 파트별 어울리는 영상 구도/이미지 프롬프트를 자동 매칭하여 Leonardo.ai, Midjourney 등에 바로 복사 사용 가능.
- **SEO 메타데이터 패키징**: 클릭률 높은 추천 제목, 영상 상세 설명란 텍스트, 해시태그, 추천 음원 장르 및 썸네일 카피 제안.
- **오프라인 체험**: API Key 없이도 시편 23편 기본 샘플 데이터를 즉시 불러와 기능 테스트 가능.

## 로컬 개발 및 실행 방법

1. **로컬 노드(Node.js) 설치 여부 확인 및 의존성 설치**:
   ```bash
   # 프로젝트 폴더로 이동 후 패키지 설치
   npm install
   ```

2. **로컬 개발 서버 실행**:
   ```bash
   npm run dev
   ```
   실행 후 터미널에 나타나는 주소(기본값: `http://localhost:5173`)를 브라우저로 엽니다.

3. **Gemini API 키 설정**:
   - 웹 앱 화면 우측 상단의 **설정** 버튼을 눌러 발급받은 Google Gemini API Key를 저장합니다.
   - 키는 안전하게 브라우저의 로컬 스토리지에만 저장됩니다.

## 깃허브 저장소에 코드 업로드 방법

생성된 프로젝트를 본인의 깃허브 저장소(`ssjung8590-creator/Bible`)에 푸시하려면 로컬 터미널에서 다음 명령어를 실행합니다.

```bash
# 1. 깃 초기화 및 기본 브랜치 지정
git init
git branch -M main

# 2. 원격 저장소 주소 추가
git remote add origin https://github.com/ssjung8590-creator/Bible.git

# 3. 변경사항 커밋 및 푸시
git add .
git commit -m "feat: Initialize ScriptureShorts AI app"
git push -u origin main
```
