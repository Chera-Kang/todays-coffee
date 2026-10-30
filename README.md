# 오늘의커피 (Today's Coffee)

> **커피 큐레이션 웹 서비스 & Playwright E2E 검증용 QA 테스트베드**  
> 국내 대표 8대 커피 프랜차이즈의 음료 영양성분과 원두 특징을 에디토리얼 UI로 탐색하고 일일 카페인 섭취량을 기록하는 서비스이자, **경계값 분석(BVA) 및 클라이언트 상태 제어 로직을 실전 검증하기 위해 구축된 QA 테스트베드**입니다.

🌐 **웹 서비스 바로가기**: [https://todays-coffee.pages.dev/](https://todays-coffee.pages.dev/)

---

## ☕ 1. 기술 스택 (Tech Stack)
- **Frontend Core**: React 19 (Vite 8)
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **Typography & Design**: Pretendard Variable 웹폰트, Warm Cafe Minimalism (`#FAF8F5`, `#231915`)
- **Architecture**: No-Backend Architecture (8대 브랜드 45종 JSON SSOT + LocalStorage CRUD 영속화)
- **E2E Testing Target**: Playwright 기반 자동화 테스트베드 타겟

---

## 🎯 2. 주요 기능 및 특징

### ① 맞춤 추천 큐레이션 & 2-Tier 음료 탐색
- **상황별 큐레이션**: `야근·집중 부스터`(150mg↑), `식단 관리·제로슈거`(5g↓ & 50kcal↓), `오후 3시 이후 디카페인`(30mg↓), `운동 전 아메리카노`(150mg↑ & 30kcal↓)
- **독립 컴포넌트 탐색**: 6대 카테고리 필터, 8대 브랜드 칩, 실시간 검색어 완벽 교집합 연동 및 6종 복합 정렬

### ② 일일 카페인 트래커 & 숙면 가이드 (CRUD)
- **한 줄 테이스팅 메모**: 최대 30자, 공백 불가, 특수문자 제한 인라인 유효성 검증
- **숙면 안심 컷오프 가이드**: 누적 섭취량과 체내 카페인 반감기(5~6h)를 계산한 안심 시간대 안내
- **자정(00:00) 자동 초기화**: 날짜 변경선 경과 시 `localStorage` 자동 리셋 및 활성화 감지
- **권장량 초과 경고**: 400mg 초과 시 붉은 테두리 및 삼각 경고 배지 활성화

### ③ 원두 가이드 & 브랜드 비교
- **원두 가이드**: 산미/바디감/로스팅 5단계 시각화 및 테이스팅 태그 필터
- **브랜드 비교**: 8대 브랜드 아메리카노 기준 용량, 가격, 100ml당 단가(가성비 바) 인포그래픽 비교

---

## 🧪 3. QA Testability Architecture (테스트베드 검증 포인트)

본 프로젝트는 E2E 자동화 스크립트 작성 시 테스트 설계 기법과 클라이언트 엣지 케이스를 정밀하게 검증할 수 있도록 설계되었습니다:

1. **경계값 분석 (BVA - Boundary Value Analysis)**:
   - 일일 카페인 섭취량 합산이 **400mg(안전 경계)** vs **401mg 이상(초과 경고 배지 노출)**으로 바뀌는 경계선 동작 검증
   - 큐레이션 필터 경계값(카페인 `149mg/150mg`, `30mg/31mg`, 당류 `5g/6g` 등) 데이터셋 배치
2. **상태 머신 및 시간(Clock) 제어 검증**:
   - `localStorage` 기반 CRUD 상태 변경 및 브라우저 시계 조작을 통한 **자정(00:00) 자동 초기화** 시나리오 검증
   - 인라인 텍스트 메모 입력 시 30자 초과 방어 및 공백/특수문자 유효성 검증
3. **브라우저 라우팅 & 히스토리 제어**:
   - URL 해시 라우팅(`#drink-{id}`, `#tab={tab}`)을 통한 딥링크 및 모달 상태 공유 검증
   - 모바일 네이티브 뒤로가기(History API) 시 페이지 이탈 없이 열려 있던 모달만 정상 닫힘 검증

---

## 📊 4. 데이터 구조 (Data Architecture)

별도의 백엔드 서버 없이 정규화된 JSON 데이터셋을 단일 진실 공급원(SSOT)으로 사용합니다:
- `src/data/menus.json`: 8대 브랜드 45종 음료 영양성분 및 BVA(경계값) 테스트 데이터
- `src/data/beans.json`: 브랜드별 대표 원두 12종의 프로파일링 데이터
- `src/data/brands.json`: 8대 브랜드 시그니처 컬러, 기준 용량, 가격 데이터

---

## 🚀 5. 로컬 실행 방법 (Getting Started)

```bash
# 종속성 설치 (최초 1회)
npm install

# 로컬 개발 서버 실행
npm run dev

# 접속 URL
http://localhost:5173/
```
