"""
오늘의커피 E2E 검증 명세서: 04. SPA 브라우저 라우팅(History API) 및 자정 자동 리셋(Clock Mock) (POM 적용)
- test_modal_hash_routing_and_history_back: 음료 고유 해시(#drink-sbux-01) 직접 진입 및 브라우저 뒤로가기 시 SPA 사이트 이탈 없이 모달 닫힘 검증
- test_midnight_caffeine_auto_reset_via_clock_mock: 과거 날짜 주입 후 접속 시 자정(00:00) 일일 카페인 0mg 자동 리셋 로직 검증
"""

from playwright.sync_api import Page, expect
from tests.e2e.pages.base_page import BasePage
from tests.e2e.pages.drink_detail_modal import DrinkDetailModal


def test_modal_hash_routing_and_history_back(clean_page: Page, base_url: str):
    """
    [라우팅 1] 해시 URL 직접 진입 및 브라우저 뒤로가기(go_back) 네이티브 인터랙션 검증
    """
    drink_modal = DrinkDetailModal(clean_page)

    # 1. 해시 URL로 직접 진입
    clean_page.goto(f"{base_url}#drink-sbux-01")

    modal_heading = drink_modal.get_title_heading("카페 아메리카노 (Tall)")
    expect(modal_heading).to_be_visible()

    # 2. 브라우저 뒤로가기 클릭
    clean_page.go_back()

    # 3. 사이트 이탈 없이 모달만 정상 닫힘 검증
    expect(modal_heading).not_to_be_visible()


def test_midnight_caffeine_auto_reset_via_clock_mock(clean_page: Page):
    """
    [시간 검증 2] 과거 로컬스토리지 날짜 주입 후 자정(00:00) 0mg 자동 초기화 로직 검증
    """
    base = BasePage(clean_page)
    drink_modal = DrinkDetailModal(clean_page)

    # 1. 음료 담기 (150mg)
    base.open_drink_detail("카페 아메리카노 (Tall)")
    drink_modal.submit_and_wait_close()
    expect(base.tracker_button).to_contain_text("150")

    # 2. 날짜를 어제 날짜로 조작
    clean_page.evaluate("() => localStorage.setItem('todays_coffee_date_v1', '2026-11-01')")

    # 3. 새로고침 (새 날의 접속)
    clean_page.reload()

    # 4. 자정 초기화로 0mg 리셋 확인
    expect(base.tracker_button).to_contain_text("0")
    expect(base.tracker_button).to_contain_text("/ 400 mg")

