"""
오늘의커피 E2E 검증 명세서: 02. 일일 카페인 섭취량 경계값 분석(BVA) 및 위험 경고 UI (POM 적용)
- test_caffeine_boundary_warning_badge_transition: 일일 권장량 400mg 이하(안전) vs 450mg 초과(위험) 경계값 전이 시 삼각 경고 배지(TriangleAlert) 노출 검증
- test_caffeine_tracker_modal_limit_gauge_and_sleep_guide: 400mg 초과 시 트래커 모달 내 113% 초과 게이지 바 및 숙면 안심 가이드(상한선 도달) 경고 상태 검증
"""

from playwright.sync_api import Page, expect
from tests.e2e.pages.base_page import BasePage
from tests.e2e.pages.drink_detail_modal import DrinkDetailModal
from tests.e2e.pages.tracker_modal import TrackerModal


def test_caffeine_boundary_warning_badge_transition(clean_page: Page):
    """
    [BVA 1] 150mg(안전) -> 300mg(안전) -> 450mg(400mg 초과) 경계 돌파 시 삼각 경고 아이콘 상태 전이 검증
    """
    base = BasePage(clean_page)
    drink_modal = DrinkDetailModal(clean_page)

    # 1. 첫 번째 음료 담기 (150mg)
    base.open_drink_detail("카페 아메리카노 (Tall)")
    drink_modal.submit_and_wait_close()

    # 400mg 이하 안전 구간 검증
    expect(base.tracker_button).to_contain_text("150")
    expect(base.tracker_warning_icon).not_to_be_visible()

    # 2. 두 번째, 세 번째 음료 담기 (누적 450mg -> 400mg 초과 경계 돌파!)
    for _ in range(2):
        base.open_drink_detail("카페 아메리카노 (Tall)")
        drink_modal.submit_and_wait_close()

    # 400mg 초과 위험 구간 검증 (450mg 갱신 및 삼각 경고 아이콘 활성화)
    expect(base.tracker_button).to_contain_text("450")
    expect(base.tracker_warning_icon).to_be_visible()


def test_caffeine_tracker_modal_limit_gauge_and_sleep_guide(clean_page: Page):
    """
    [BVA 2] 권장량 초과 상태에서 트래커 상세 모달 오픈 시 초과 게이지 바 및 숙면 안심 가이드 경고 연동 검증
    """
    base = BasePage(clean_page)
    drink_modal = DrinkDetailModal(clean_page)
    tracker_modal = TrackerModal(clean_page)

    # 450mg 만들기 (3잔 담기)
    for _ in range(3):
        base.open_drink_detail("카페 아메리카노 (Tall)")
        drink_modal.submit_and_wait_close()

    # 우측 상단 트래커 클릭하여 모달 열기
    base.open_tracker_modal()

    # 모달 헤딩 노출 확인
    expect(tracker_modal.title_heading).to_be_visible()

    # 모달 내부 초과 게이지 퍼센트 확인 (450/400 = 113%)
    expect(tracker_modal.limit_ratio_text).to_contain_text("113%")
    expect(tracker_modal.over_limit_badge).to_be_visible()

    # 숙면 안심 가이드 위험 경고 문구 확인
    expect(tracker_modal.sleep_guide_warning).to_be_visible()
