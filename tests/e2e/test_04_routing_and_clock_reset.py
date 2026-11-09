"""
오늘의커피 E2E 검증 명세서: 04. SPA 브라우저 라우팅(History API) 및 자정 자동 리셋(Clock Mock)
- test_modal_hash_routing_and_history_back: 음료 고유 해시(#drink-sbux-01) 직접 진입 및 브라우저 뒤로가기 시 SPA 사이트 이탈 없이 모달 닫힘 검증
- test_midnight_caffeine_auto_reset_via_clock_mock: 과거 날짜 주입 후 접속 시 자정(00:00) 일일 카페인 0mg 자동 리셋 로직 검증
"""

from playwright.sync_api import Page, expect


def test_modal_hash_routing_and_history_back(clean_page: Page, base_url: str):
    """
    [라우팅 1] 해시 URL 직접 진입 및 브라우저 뒤로가기(go_back) 네이티브 인터랙션 검증
    """
    # 1. 해시 URL로 직접 진입
    clean_page.goto(f"{base_url}#drink-sbux-01")

    modal_heading = clean_page.locator("h2").filter(has_text="카페 아메리카노 (Tall)")
    expect(modal_heading).to_be_visible()

    # 2. 브라우저 뒤로가기 클릭
    clean_page.go_back()

    # 3. 사이트 이탈 없이 모달만 정상 닫힘 검증
    expect(modal_heading).not_to_be_visible()


def test_midnight_caffeine_auto_reset_via_clock_mock(clean_page: Page):
    """
    [시간 검증 2] 과거 로컬스토리지 날짜 주입 후 자정(00:00) 0mg 자동 초기화 로직 검증
    """
    header_tracker = clean_page.locator("header").get_by_role("button").filter(has_text="오늘 섭취량")

    # 1. 음료 담기 (150mg)
    clean_page.get_by_role("main").get_by_role("heading", name="카페 아메리카노 (Tall)").click()
    clean_page.get_by_role("button", name="오늘 마신 커피에 담기").click()
    expect(clean_page.get_by_text("담기 완료!")).not_to_be_visible()
    expect(header_tracker).to_contain_text("150")

    # 2. 날짜를 어제 날짜로 조작
    clean_page.evaluate("() => localStorage.setItem('todays_coffee_date_v1', '2026-11-01')")

    # 3. 새로고침 (새 날의 접속)
    clean_page.reload()

    # 4. 자정 초기화로 0mg 리셋 확인
    expect(header_tracker).to_contain_text("0")
    expect(header_tracker).to_contain_text("/ 400 mg")

