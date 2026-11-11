"""
오늘의커피 E2E 검증 명세서: 06. 원두 가이드 탭 취향 필터링, 도트 레이팅 및 아코디언 상세 스펙 (POM 적용)
- test_bean_taste_preset_filter_and_dot_meters: 1차 취향 알약 필터('고소·견과류') 및 로스팅/산미/바디감 3대 도트 레이팅 시각화 미터 검증
- test_bean_collapsible_accordion_detailed_spec_filter: 2차 접이식 아코디언 필터 열기 토글 및 바디감 세부 필터링 인터랙션 검증
"""

from playwright.sync_api import Page, expect
from tests.e2e.pages.bean_guide_page import BeanGuidePage


def test_bean_taste_preset_filter_and_dot_meters(clean_page: Page):
    """
    [원두 1] 직관적 취향 알약 필터 및 3대 도트 레이팅(로스팅/산미/바디감) 시각화 렌더링 검증
    """
    bean_guide = BeanGuidePage(clean_page)
    bean_guide.open()
    expect(bean_guide.title_heading).to_be_visible()

    # '고소·견과류 (산미 없음)' 클릭
    bean_guide.select_filter_option("고소·견과류 (산미 없음)")
    expect(bean_guide.filter_active_badge).to_be_visible()

    # 첫 번째 원두 카드의 3대 도트 레이팅 라벨 검증
    expect(bean_guide.first_bean_card).to_be_visible()
    for label in ("로스팅 정도 (Roast)", "산미 (Acidity)", "바디감 (Body)"):
        expect(bean_guide.first_bean_card.get_by_text(label)).to_be_visible()

    # 필터 초기화
    bean_guide.reset_filters()
    expect(bean_guide.filter_active_badge).not_to_be_visible()


def test_bean_collapsible_accordion_detailed_spec_filter(clean_page: Page):
    """
    [원두 2 - 아코디언 인터랙션] 상세 스펙 접이식 패널 오픈 및 세부 바디감 필터링 검증
    """
    bean_guide = BeanGuidePage(clean_page)
    bean_guide.open()

    # 접이식 상세 스펙 버튼 클릭 후 아코디언 내부 바디감 필터 중 '가벼움 (Lv.1~2)' 클릭
    bean_guide.open_detail_spec()
    bean_guide.select_filter_option("가벼움 (Lv.1~2)")

    # 상세 필터 적용 중 상태 뱃지 노출 확인
    expect(bean_guide.filter_active_badge).to_be_visible()
    expect(bean_guide.reset_button).to_be_visible()

