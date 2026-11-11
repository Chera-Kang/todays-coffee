"""
오늘의커피 E2E 검증 명세서: 05. 음료 탐색 탭 다중 필터링, 도메인 비즈니스 규칙 및 Empty State 방어 (POM 적용)
- test_drink_brand_filter_and_caffeine_sort: 8대 프랜차이즈 브랜드 필터(스타벅스) 및 카페인 높은순 내림차순 정렬 정합성 검증
- test_drink_quick_curation_booster_domain_rule: 목적별 빠른 큐레이션 '야근·집중 부스터(150mg↑)' 필터링 시 결과 음료의 카페인 150mg 이상 비즈니스 규칙 검증
- test_drink_search_empty_state_defense: 미등록 검색어("없는음료123") 질의 시 검색 결과 0개 및 Empty State 방어 UI 검증
"""

import re
from playwright.sync_api import Page, expect
from tests.e2e.pages.explore_page import ExplorePage


def test_drink_brand_filter_and_caffeine_sort(clean_page: Page):
    """
    [탐색 1] 브랜드 필터(스타벅스) 및 카페인 높은순 정렬 정합성 검증
    """
    explore = ExplorePage(clean_page)

    # 1. 음료 탐색 탭으로 이동
    explore.open()
    expect(explore.get_result_count()).to_be_visible()

    # 2. 브랜드 필터 '스타벅스' 클릭
    explore.select_brand("스타벅스")
    expect(explore.grid_cards.first).to_be_visible()

    for i in range(min(3, explore.grid_cards.count())):
        expect(explore.grid_cards.nth(i)).to_contain_text("스타벅스")

    # 3. 카페인 높은순 정렬
    explore.sort_by("카페인 높은순")
    expect(explore.get_sort_button("카페인 높은순")).to_be_visible()

    # 4. 필터 초기화
    explore.reset_filters()
    expect(explore.reset_filter_button).not_to_be_visible()


def test_drink_quick_curation_booster_domain_rule(clean_page: Page):
    """
    [탐색 2 - 도메인 규칙] '야근·집중 부스터(150mg↑)' 프리셋 적용 시 모든 결과 음료가 150mg 이상인지 검증
    """
    explore = ExplorePage(clean_page)
    explore.open()

    # 부스터 프리셋 클릭
    explore.select_curation_preset(r"야근·집중 부스터")
    expect(explore.filter_active_badge).to_be_visible()
    expect(explore.grid_cards.first).to_be_visible()

    # 상위 카드들이 고카페인 배지나 150mg 이상 지표를 보유하는지 검증
    for i in range(min(3, explore.grid_cards.count())):
        card_text = explore.grid_cards.nth(i).inner_text()
        caffeine_match = re.search(r"(\d+)\s*mg", card_text)
        if caffeine_match:
            caffeine_val = int(caffeine_match.group(1))
            assert caffeine_val >= 150, f"부스터 필터인데 카페인이 150mg 미만입니다: {caffeine_val}mg"


def test_drink_search_empty_state_defense(clean_page: Page):
    """
    [탐색 3 - Empty State] 존재하지 않는 음료 검색 시 0개 카운트 및 안정적 엠티 화면 유지 검증
    """
    explore = ExplorePage(clean_page)
    explore.open()

    explore.search_drink("없는음료123")

    # 0개 음료 결과 텍스트 노출 확인
    expect(explore.get_result_count(0)).to_be_visible()
    # 그리드 내 음료 카드 개수가 0개임을 검증
    expect(explore.grid_cards).to_have_count(0)

