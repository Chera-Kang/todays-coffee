"""
원두 가이드 탭(BeanGuidePage) 페이지 객체
- BasePage를 상속받아 글로벌 탭 이동 및 카드 그리드(grid_cards)를 재사용하고,
  원두 취향 프리셋 필터, 접이식 상세 스펙 아코디언, 필터 초기화 액션을 캡슐화합니다.
"""

import re
from playwright.sync_api import Locator, Page
from tests.e2e.pages.base_page import BasePage


class BeanGuidePage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.title_heading = page.get_by_role("heading", name="원두 프로필 & 테이스팅 가이드")
        self.filter_active_badge = page.get_by_text("(필터 적용 중)")
        self.reset_button = page.get_by_role("button", name="초기화")
        self.detail_spec_accordion = page.get_by_role("button", name=re.compile(r"상세 스펙"))

    def open(self) -> None:
        """'원두 가이드' 탭으로 이동"""
        self.navigate_to_tab("원두 가이드")

    def select_filter_option(self, option_name: str) -> None:
        """취향 알약 필터 또는 아코디언 내부 스펙 필터 버튼 클릭"""
        self.page.get_by_role("button", name=option_name).click()

    def open_detail_spec(self) -> None:
        """접이식 상세 스펙 아코디언 버튼 클릭"""
        self.detail_spec_accordion.click()

    def reset_filters(self) -> None:
        """초기화 버튼 클릭"""
        self.reset_button.click()

    @property
    def first_bean_card(self) -> Locator:
        """그리드 내 첫 번째 원두 카드 로케이터 반환"""
        return self.grid_cards.first

