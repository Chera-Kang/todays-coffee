"""
오늘의커피 E2E 검증 명세서: 02. 일일 카페인 섭취량 경계값 분석(BVA) 및 위험 경고 UI
- test_caffeine_boundary_warning_badge_transition: 일일 권장량 400mg 이하(안전) vs 450mg 초과(위험) 경계값 전이 시 삼각 경고 배지(TriangleAlert) 노출 검증
- test_caffeine_tracker_modal_limit_gauge_and_sleep_guide: 400mg 초과 시 트래커 모달 내 113% 초과 게이지 바 및 숙면 안심 가이드(상한선 도달) 경고 상태 검증
"""

from playwright.sync_api import Page, expect


def test_caffeine_boundary_warning_badge_transition(clean_page: Page):
    """
    [BVA 1] 150mg(안전) -> 300mg(안전) -> 450mg(400mg 초과) 경계 돌파 시 삼각 경고 아이콘 상태 전이 검증
    """
    header_tracker = clean_page.locator("header").get_by_role("button").filter(has_text="오늘 섭취량")

    # 1. 첫 번째 음료 담기 (150mg)
    clean_page.get_by_role("heading", name="카페 아메리카노 (Tall)").click()
    clean_page.get_by_role("button", name="오늘 마신 커피에 담기").click()
    expect(clean_page.get_by_text("담기 완료!")).not_to_be_visible()

    # 400mg 이하 안전 구간 검증
    expect(header_tracker).to_contain_text("150")
    expect(header_tracker.locator("svg.lucide-triangle-alert")).not_to_be_visible()

    # 2. 두 번째 음료 담기 (누적 300mg)
    clean_page.get_by_role("heading", name="카페 아메리카노 (Tall)").click()
    clean_page.get_by_role("button", name="오늘 마신 커피에 담기").click()
    expect(clean_page.get_by_text("담기 완료!")).not_to_be_visible()

    # 3. 세 번째 음료 담기 (누적 450mg -> 400mg 초과 경계 돌파!)
    clean_page.get_by_role("heading", name="카페 아메리카노 (Tall)").click()
    clean_page.get_by_role("button", name="오늘 마신 커피에 담기").click()
    expect(clean_page.get_by_text("담기 완료!")).not_to_be_visible()

    # 400mg 초과 위험 구간 검증 (450mg 갱신 및 삼각 경고 아이콘 활성화)
    expect(header_tracker).to_contain_text("450")
    expect(header_tracker.locator("svg.lucide-triangle-alert")).to_be_visible()


def test_caffeine_tracker_modal_limit_gauge_and_sleep_guide(clean_page: Page):
    """
    [BVA 2] 권장량 초과 상태에서 트래커 상세 모달 오픈 시 초과 게이지 바 및 숙면 안심 가이드 경고 연동 검증
    """
    # 450mg 만들기 (3잔 담기)
    for _ in range(3):
        clean_page.get_by_role("heading", name="카페 아메리카노 (Tall)").click()
        clean_page.get_by_role("button", name="오늘 마신 커피에 담기").click()
        expect(clean_page.get_by_text("담기 완료!")).not_to_be_visible()

    # 우측 상단 트래커 클릭하여 모달 열기
    clean_page.locator("header").get_by_role("button").filter(has_text="오늘 섭취량").click()

    # 모달 헤딩 노출 확인
    modal = clean_page.locator("div.fixed")
    expect(modal.get_by_role("heading", name="오늘 마신 음료 기록")).to_be_visible()

    # 모달 내부 초과 게이지 퍼센트 확인 (450/400 = 113%, 헤더와의 Strict Mode 충돌 방지)
    expect(modal.get_by_text("권장량 대비")).to_contain_text("113%")
    expect(modal.get_by_text("(초과)")).to_be_visible()

    # 숙면 안심 가이드 위험 경고 문구 확인
    expect(modal.get_by_text("카페인 상한선 도달 / 초과 주의")).to_be_visible()

