# NH농협생명 안내장 자동 검수 데모

Upstage Document Parse · Information Extraction · Solar LLM 기반 보험 안내장 자동 검수 시연 페이지.

## 폴더 구성

```
nh-life-review-demo.html   ← 단일 HTML (모든 코드 포함)
assets/
  pages/                   ← 백세팔팔NH건강보험 안내장 9p 미리보기 (샘플)
  안내장.pdf               ← 샘플 PDF
  upstage-logo.png
  pvtable_sample.txt
README.md                  ← 이 문서
```

## 로컬 실행

`nh-life-review-demo.html`을 더블 클릭하여 브라우저에서 바로 열면 됩니다. 별도 서버 불필요.

## 호스팅 (Vercel 권장)

### ⭐ A) Vercel (권장 — CORS 자동 해결)

`/api/parse` 서버리스 프록시가 포함되어 있어 Upstage API 호출 시 CORS가 자동 해결됩니다.

**방법 1: GitHub 연동 (가장 깔끔, 영구)**

```bash
# 1. GitHub에 저장소 생성 후 push
cd "/path/to/nh-demo"
git init
git add .
git commit -m "NH life review demo"
git branch -M main
git remote add origin https://github.com/<your-id>/<repo>.git
git push -u origin main
```

```text
2. https://vercel.com 로그인 (GitHub 계정)
3. "Add New Project" → Import → <your-id>/<repo> 선택
4. Framework Preset: Other (변경 X)  Build Command: (비워두기)  Output Directory: (비워두기)
5. Deploy 클릭 → 1분 후 https://<repo>-<id>.vercel.app URL 생성
6. 이후 git push 할 때마다 자동 재배포
```

**방법 2: Vercel CLI (1분, 즉시)**

```bash
npm i -g vercel
cd "/path/to/nh-demo"
vercel       # 안내 따라 Y → URL 발급
vercel --prod  # 프로덕션 배포
```

발급된 URL 예시: `https://nh-life-review-demo.vercel.app` 형식

### B) Netlify Drop (1분, 임시 데모용)

ZIP을 드래그하면 즉시 URL 생성. `/api/parse`는 Netlify Functions로 별도 변환 필요(이 패키지는 Vercel용).

1. `nh-demo.zip` 준비
2. https://app.netlify.com/drop 접속
3. ZIP 드래그&드롭 → `https://xxxxx.netlify.app` URL 발급

### C) GitHub Pages (무료, 정적만)

```bash
git init && git add . && git commit -m "demo"
git remote add origin https://github.com/<id>/<repo>.git
git push -u origin main
# Settings → Pages → main branch → Save
# https://<id>.github.io/<repo>/nh-life-review-demo.html
```
⚠️ GitHub Pages는 서버리스 함수 미지원 → API 호출은 CORS로 차단될 수 있음 (Vercel 권장)

## 사용자 업로드 기능

페이지에는 두 가지 업로드 영역이 있습니다.

| 위치 | 용도 | 지원 형식 |
|---|---|---|
| **원본 문서 파싱 결과** 탭 | 약관·사방서·PV 등 원본 문서 업로드 | PDF, HWP, TXT |
| **안내장 파싱 결과** 탭 | 검수 대상 안내장 업로드 | PDF |

업로드 흐름:
1. 사이드바의 업로드 영역을 클릭하거나 파일을 드래그&드롭
2. **PDF**: PDF.js로 페이지별 미리보기 즉시 렌더 → API 키가 설정되어 있으면 Upstage Document Parse 자동 호출 → element + bbox 결과 표시
3. **HWP/TXT**: 텍스트 추출 (HWP는 클라이언트 한계로 일부만, TXT는 줄 단위)
4. 업로드된 문서는 사이드바에 추가되어 언제든 클릭하여 다시 볼 수 있음

## API 키 설정

페이지 우상단 ⚙ **API 설정** → "실제 API 호출" 모드 선택 → Upstage API 키 입력 → 저장.

키 발급: https://console.upstage.ai → API Keys

## ⚠️ CORS 안내

브라우저에서 직접 Upstage API를 호출할 때 CORS 정책으로 차단될 수 있습니다.

**해결 방법:**

1. **Vercel Serverless Function 프록시 추가** (가장 권장):
   ```js
   // api/parse.js
   export default async function handler(req, res) {
     const response = await fetch('https://api.upstage.ai/v1/document-digitization', {
       method: 'POST',
       headers: { 'Authorization': req.headers.authorization },
       body: req.body
     });
     const json = await response.json();
     res.status(response.status).json(json);
   }
   ```
   그리고 HTML의 fetch URL을 `/api/parse`로 변경

2. **Cloudflare Workers 사용** — 무료 100K req/day
3. **사내 백엔드 프록시** — Nginx reverse proxy 등

CORS 문제 시에도 mock 데이터로 데모는 정상 작동합니다.

## 탭 구성

| 탭 | 내용 |
|---|---|
| 📚 **원본 문서 파싱 결과** | 약관·사방서·PV테이블의 페이지 + element bbox + Preview/HTML/JSON |
| 📄 **안내장 파싱 결과** | 안내장 PDF + element bbox + Preview/HTML/JSON |
| ⌬ **비교 및 검수 결과** | 안내장 vs 원본 정합성 검수 — 카테고리별 일치/경고/불일치 카드 |

## 검수 카테고리

- 보장내용·그림 (vs 약관)
- 선택특약·급부 (vs 약관)
- 가입나이·납입 (vs 사업방법서)
- 보험료·해약환급 (vs PV테이블)

## 문의

sooji.oh@upstage.ai
