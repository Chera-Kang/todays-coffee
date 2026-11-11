# 오늘의커피 (Today's Coffee)

> **감각적인 커피 큐레이션 웹 서비스 & Playwright E2E 테스트베드**  
> 국내 대표 8대 프랜차이즈의 음료 영양성분과 원두 데이터를 에디토리얼 UI로 탐색하고 일일 카페인을 기록하는 서비스이자, **경계값 분석(BVA), LocalStorage CRUD 및 클라이언트 상태 제어 로직을 실전 검증하기 위해 구축된 QA 자동화 테스트베드**입니다.

🌐 **웹 서비스 바로가기**: [https://todays-coffee.pages.dev/](https://todays-coffee.pages.dev/)  
🎬 **[VOD] Playwright E2E 회귀 테스트 시연 영상 (Allure & Trace Viewer)**: [▶️ YouTube 바로보기](https://youtu.be/kdgQ6l0w_JI)  
📁 **Allure Report 및 Playwright Trace 결과 산출물**: [📂 Google Drive 바로가기](https://drive.google.com/drive/folders/1PykjxS6gSBaLlbLu98dLLxI5iT5WbGNU)

---

## ☕ 1. 기술 스택 (Tech Stack)

- **Frontend Core**: React 19 (Vite), Tailwind CSS v4, Pretendard Variable 웹폰트
- **Design System**: Warm Cafe Minimalism (`#FAF8F5`, `#2C1810`), Lucide Line Icons
- **E2E Automation**: Python 3.12, Playwright (`playwright-python`), Pytest (17 Test Cases, POM)
- **Reporting & Debugging**: Allure Report Framework, Playwright Trace Viewer
- **Architecture**: No-Backend (JSON 기반 데이터 관리 + LocalStorage) + POM 계층 설계 & BrowserContext 세션 격리

---

## 🎯 2. 주요 기능 및 특징 (Features)

### ① 맞춤 추천 & 2-Tier 음료 탐색
- **목적별 빠른 큐레이션**: `야근·집중 부스터`(150mg↑), `식단 관리·제로슈거`(5g↓ & 50kcal↓), `오후 3시 이후 디카페인`(30mg↓), `운동 전 부스터`(150mg↑ & 30kcal↓)
- **음료 탐색**: 6대 카테고리 필터, 8대 브랜드 칩, 실시간 검색어 교집합 필터링 및 6종 복합 정렬(카페인/칼로리/당류 순)

### ② 일일 카페인 트래커 & 숙면 가이드 (CRUD)
- **한 줄 테이스팅 메모**: 최대 30자, 공백 및 특수문자 제한 인라인 유효성 검증과 담기 버튼 비활성화(disabled)
- **숙면 안심 가이드**: 누적 섭취량과 체내 카페인 반감기(5~6시간)를 계산한 안심 시간대 맞춤 안내
- **자정(00:00) 자동 초기화**: 자정 경과 시 `localStorage` 자동 리셋 및 활성화 감지
- **권장량 초과 경고**: 일일 권장량(400mg) 초과 시 실시간 붉은 테두리, 삼각 경고 배지 및 초과 비율(%) 시각화

### ③ 원두 가이드 & 브랜드 한눈에 비교
- **원두 가이드**: 산미/바디감/로스팅 3대 도트 레이팅 시각화, 테이스팅 태그 및 접이식 상세 스펙 필터
- **브랜드 비교**: 8대 브랜드 아메리카노 기준 용량, 가격, 100ml당 단가(가성비 바 차트) 인포그래픽 비교

---

## 🧪 3. QA Testability & E2E 테스트베드 (17 Test Cases)

클라이언트 사이드에서 발생할 수 있는 엣지 케이스, 상태 머신 및 데이터 영속성을 전수 검증하는 **8대 E2E 테스트 스위트 (총 17 Test Cases)**를 구축했습니다:

- **Page Object Model (POM) 계층 설계 (`tests/e2e/pages/`)**:
  - **상속 기반 페이지 분리**: 공통 헤더·네비게이션·트래커를 담은 `BasePage`를 기준으로 `ExplorePage`, `BeanGuidePage`, `BrandComparePage`가 상속 확장
  - **모달 객체 캡슐화**: 재사용 모달(`DrinkDetailModal`, `TrackerModal`)의 컨테이너 스코핑 및 비동기 모달 닫힘 대기 처리를 캡슐화해 테스트 가독성과 UI 변경 대응력 확보
- **BrowserContext 세션 격리 (`scope="function"`)**: 테스트마다 독립된 세션을 생성하여 로컬스토리지 데이터 간섭과 Flaky 현상을 방지
- **Retain-on-Failure 스마트 트레이싱**: 성공한 테스트 로그는 정리하고, **실패(FAILED)한 테스트의 Trace 파일(`test-results/trace_*.zip`)만 자동 저장**하여 디버깅 시간 단축 및 스토리지 효율화
- **4대 핵심 검증 하이라이트**:
  1. **BVA 경계값 분석**: 150mg ➔ 300mg(안전) ➔ 450mg(초과) 상태 전이 시 삼각 경고 배지(TriangleAlert) 노출 및 초과 게이지 연동 검증
  2. **CRUD 전체 생명주기**: 공백/특수문자 입력 방어(Negative) ➔ 새로고침(F5) 메모 유지(Read/Persistence) ➔ 트래커 휴지통 삭제 및 섭취량 실시간 차감(Delete)
  3. **Time Travel & SPA History API**: LocalStorage 날짜 조작을 통한 자정(00:00) 0mg 자동 리셋 및 SPA 고유 해시 URL 직접 진입/뒤로가기 제어
  4. **도메인 비즈니스 규칙 & Empty State**: 부스터 음료 카페인 150mg 이상 필터링 확인 및 미등록 음료 검색 시 0개 카운트 방어 UI 검증

---

## 🚀 4. 실행 가이드 (Getting Started)

### ① 서비스 로컬 실행
```bash
npm install
npm run dev # http://localhost:5173
```

### ② E2E 테스트 및 시각적 리포팅
```bash
# 1. 전체 기능 테스트 실행 (Headless - 16개 통과)
python -m pytest tests/e2e/ --ignore=tests/e2e/test_08_trace_failure_verification.py

# 2. 브라우저 시연 모드 (Headed + SlowMo 700ms - 영상 녹화 최적화)
python -m pytest tests/e2e/ --ignore=tests/e2e/test_08_trace_failure_verification.py --headed --slowmo 700

# 3. Allure 품질 대시보드 리포트 생성 및 확인
python -m pytest tests/e2e/ --alluredir=allure-results
npx allure serve allure-results

# 4. 실패한 테스트 Trace 확인 (DOM 스냅샷 & 타임라인 디버깅)
playwright show-trace test-results/trace_<테스트명>.zip
```

---

## 📊 5. 데이터 구조 (Data Architecture)

별도 백엔드 서버 없이 정규화된 3대 JSON 데이터를 기반으로 동작합니다:
- `src/data/menus.json`: 8대 브랜드 45종 음료 영양성분 및 BVA 테스트 데이터
- `src/data/beans.json`: 브랜드별 대표 원두 12종의 테이스팅 프로파일링 데이터
- `src/data/brands.json`: 8대 프랜차이즈 시그니처 컬러, 기준 용량, 가격 데이터
