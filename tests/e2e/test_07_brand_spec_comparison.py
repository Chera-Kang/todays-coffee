"""
오늘의커피 E2E 검증 명세서: 07. 8대 프랜차이즈 브랜드 인포그래픽 및 가성비(단가) 비교 분석 (POM 적용)
- test_brand_comparison_grid_rendering: 국내 8대 커피 프랜차이즈 브랜드 카드 전수 렌더링 검증
- test_brand_americano_kpi_and_cost_efficiency_bar: 스타벅스 vs 메가커피 아메리카노 기준 용량/가격 및 100ml당 가성비 인포그래픽 바 차트 검증
"""

from playwright.sync_api import Page, expect
from tests.e2e.pages.brand_compare_page import BrandComparePage


def test_brand_comparison_grid_rendering(clean_page: Page):
    """
    [비교 1] 8대 프랜차이즈 브랜드 카드 전수 노출 검증
    """
    brand_compare = BrandComparePage(clean_page)
    brand_compare.open()
    expect(brand_compare.title_heading).to_be_visible()

    brands = ["스타벅스", "메가커피", "컴포즈커피", "폴바셋", "투썸플레이스", "이디야커피", "빽다방", "할리스"]
    for brand_name in brands:
        expect(brand_compare.get_brand_heading(brand_name)).to_be_visible()


def test_brand_americano_kpi_and_cost_efficiency_bar(clean_page: Page):
    """
    [비교 2] 스타벅스 vs 메가커피 아메리카노 기준 용량, 가격, 100ml당 가성비 바 차트 인포그래픽 검증
    """
    brand_compare = BrandComparePage(clean_page)
    brand_compare.open()

    # 1. 스타벅스 카드 (고급형 기준: 4,700원, 355ml, 가성비 바)
    sbux_card = brand_compare.get_brand_card("스타벅스")
    expect(sbux_card.get_by_text("4,700원", exact=True)).to_be_visible()
    expect(sbux_card.get_by_text("355ml", exact=True)).to_be_visible()
    expect(sbux_card.get_by_text("용량 대비 가성비 비교")).to_be_visible()

    # 2. 메가커피 카드 (가성비 대용량 기준: 2,000원, 680ml)
    mega_card = brand_compare.get_brand_card("메가커피")
    expect(mega_card.get_by_text("680ml", exact=True)).to_be_visible()
    expect(mega_card.get_by_text("2,000원", exact=True)).to_be_visible()

