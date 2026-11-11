"""
브랜드 한눈에 보기 탭(BrandComparePage) 페이지 객체
- BasePage를 상속받아 글로벌 탭 이동 및 카드 그리드(grid_cards)를 재사용하고,
  8대 프랜차이즈 브랜드별 비교 카드 조회 기능을 캡슐화합니다.
"""

from playwright.sync_api import Locator, Page
from tests.e2e.pages.base_page import BasePage


class BrandComparePage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.title_heading = page.get_by_role("heading", name="8대 커피 프랜차이즈 한눈에 비교")

    def open(self) -> None:
        """'브랜드 한눈에 보기' 탭으로 이동"""
        self.navigate_to_tab("브랜드 한눈에 보기")

    def get_brand_heading(self, brand_name: str) -> Locator:
        """브랜드명 제목(heading) 로케이터 반환"""
        return self.page.get_by_role("heading", name=brand_name)

    def get_brand_card(self, brand_name: str) -> Locator:
        """특정 브랜드의 비교 카드 로케이터 반환"""
        return self.grid_cards.filter(has_text=brand_name).first

