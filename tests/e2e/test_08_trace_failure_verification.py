"""
오늘의커피 E2E 검증 명세서: 08. [품질 메타 검증] 실패 시 블랙박스 트레이스 자동 수집 파이프라인 검증 (POM 적용)
- test_trace_capture_on_assertion_failure: 의도적인 단언 불일치(999mg)를 유도하여, conftest.py의 Retain-on-Failure 정책에 따라 test-results/trace_*.zip 파일이 정상 자동 추출되는지 검증
"""

from playwright.sync_api import Page, expect
from tests.e2e.pages.base_page import BasePage
from tests.e2e.pages.drink_detail_modal import DrinkDetailModal


def test_trace_capture_on_assertion_failure(clean_page: Page):
    """
    [품질 인프라 메타 테스트]
    실패 발생 시 Playwright Trace Viewer(블랙박스 녹화 파일)가 정상 생성되는지 검증하기 위한 의도적 실패 케이스
    """
    base = BasePage(clean_page)
    drink_modal = DrinkDetailModal(clean_page)

    # 1. 카페 아메리카노 상세 모달 열기
    base.open_drink_detail("카페 아메리카노 (Tall)")

    # 2. 모달 내부의 카페인 수치(실제: 150mg)를 타겟팅하고, 파이프라인 실패 유도를 위해 999mg 단언(Assertion)
    caffeine_badge = drink_modal.get_caffeine_badge("150")
    expect(caffeine_badge).to_contain_text("999", timeout=3000)

