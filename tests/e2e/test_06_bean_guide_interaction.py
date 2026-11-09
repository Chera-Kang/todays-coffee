"""
오늘의커피 E2E 검증 명세서: 06. 원두 가이드 탭 취향 필터링, 도트 레이팅 및 아코디언 상세 스펙
- test_bean_taste_preset_filter_and_dot_meters: 1차 취향 알약 필터('고소·견과류') 및 로스팅/산미/바디감 3대 도트 레이팅 시각화 미터 검증
- test_bean_collapsible_accordion_detailed_spec_filter: 2차 접이식 아코디언 필터 열기 토글 및 바디감 세부 필터링 인터랙션 검증
"""

import re
from playwright.sync_api import Page, expect


def test_bean_taste_preset_filter_and_dot_meters(clean_page: Page):
    """
    [원두 1] 직관적 취향 알약 필터 및 3대 도트 레이팅(로스팅/산미/바디감) 시각화 렌더링 검증
    """
    clean_page.locator("header nav").get_by_role("button", name="원두 가이드").click()
    expect(clean_page.get_by_role("heading", name="원두 프로필 & 테이스팅 가이드")).to_be_visible()

    # '고소·견과류 (산미 없음)' 클릭
    clean_page.get_by_role("button", name="고소·견과류 (산미 없음)").click()
    expect(clean_page.get_by_text("(필터 적용 중)")).to_be_visible()

    # 첫 번째 원두 카드의 3대 도트 레이팅 라벨 검증
    first_bean_card = clean_page.locator("main div.grid > div").first
    expect(first_bean_card).to_be_visible()
    expect(first_bean_card.get_by_text("로스팅 정도 (Roast)")).to_be_visible()
    expect(first_bean_card.get_by_text("산미 (Acidity)")).to_be_visible()
    expect(first_bean_card.get_by_text("바디감 (Body)")).to_be_visible()

    # 필터 초기화
    clean_page.get_by_role("button", name="초기화").click()
    expect(clean_page.get_by_text("(필터 적용 중)")).not_to_be_visible()


def test_bean_collapsible_accordion_detailed_spec_filter(clean_page: Page):
    """
    [원두 2 - 아코디언 인터랙션] 상세 스펙 접이식 패널 오픈 및 세부 바디감 필터링 검증
    """
    clean_page.locator("header nav").get_by_role("button", name="원두 가이드").click()

    # 접이식 상세 스펙 버튼 클릭
    accordion_btn = clean_page.get_by_role("button", name=re.compile(r"상세 스펙"))
    accordion_btn.click()

    # 아코디언 내부 바디감 필터 중 '가벼움 (Lv.1~2)' 클릭
    clean_page.get_by_role("button", name="가벼움 (Lv.1~2)").click()

    # 상세 필터 적용 중 상태 뱃지 노출 확인
    expect(clean_page.get_by_text("(필터 적용 중)")).to_be_visible()
    expect(clean_page.get_by_role("button", name="초기화")).to_be_visible()

