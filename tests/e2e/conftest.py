"""
Todays-Coffee E2E 테스트 공통 환경 설정 (conftest.py)

Pytest가 실행될 때 자동으로 로드되는 전역 설정 및 Fixture 정의 파일입니다.
- BrowserContext 세션 격리
- 실패(FAILED) 시점에만 Playwright Trace(블랙박스) 자동 추출 및 저장
"""

import os
import pytest
from playwright.sync_api import Browser, BrowserContext, Page

# 기본 로컬 테스트 서버 주소
DEFAULT_BASE_URL = "http://localhost:5173"


@pytest.fixture(scope="session")
def base_url() -> str:
    """
    테스트 전체 세션 동안 공유할 기본 웹 서비스 URL Fixture.
    """
    return os.environ.get("BASE_URL", DEFAULT_BASE_URL)


@pytest.fixture(scope="function")
def clean_page(browser: Browser, base_url: str, request: pytest.FixtureRequest) -> Page:
    """
    [세션 격리 + 실패 시 Trace 자동 수집 핵심 Fixture]
    1. 독립된 시크릿 창(BrowserContext)을 생성하고 새 탭(Page)을 열어 반환합니다.
    2. 테스트 시작과 동시에 백그라운드 블랙박스 트레이싱(Tracing)을 시작합니다.
    3. 테스트가 성공하면 트레이스를 조용히 폐기하고, 실패했을 때만 test-results/trace_*.zip으로 보존합니다.
    """
    # 1. 독립된 시크릿 프로필(Context) 생성
    context: BrowserContext = browser.new_context(
        viewport={"width": 1280, "height": 800},
        locale="ko-KR",
    )

    # 2. 블랙박스 녹화(Tracing) 시작 (스크린샷, DOM 스냅샷, 소스코드 포함)
    context.tracing.start(screenshots=True, snapshots=True, sources=True)

    page: Page = context.new_page()
    page.goto(base_url)

    yield page

    # 3. [Teardown] 실패(Failed) 여부 판정
    # rep_call: pytest_runtest_makereport 훅에서 주입된 실제 테스트 본문 실행 결과
    is_failed = request.node.rep_call.failed if hasattr(request.node, "rep_call") else False

    if is_failed:
        os.makedirs("test-results", exist_ok=True)
        # 파일명에서 특수문자 제거 후 안전한 파일명 생성
        safe_test_name = request.node.name.replace("[", "_").replace("]", "").replace("/", "_")
        trace_path = f"test-results/trace_{safe_test_name}.zip"
        
        # 🚨 실패했을 때만 압축 파일로 보존!
        context.tracing.stop(path=trace_path)
        print(f"\n[Trace Saved] 🚨 실패 원인 추적용 Trace가 저장되었습니다: {trace_path}")
    else:
        # 🟢 성공했을 때는 디스크 용량 절약을 위해 저장하지 않고 버림
        context.tracing.stop()

    context.close()


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    테스트의 각 단계(setup, call, teardown) 결과를 item 객체에 바인딩하여
    clean_page Fixture에서 실패 여부(item.rep_call.failed)를 판정할 수 있게 지원하는 훅
    """
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)
