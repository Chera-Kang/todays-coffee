"""
음료 탐색 탭(ExplorePage) 페이지 객체
- BasePage를 상속받아 글로벌 네비게이션 및 카드 그리드(grid_cards)를 재사용하고,
  브랜드 필터, 빠른 큐레이션, 정렬 드롭다운, 검색 기능을 캡슐화합니다.
"""

import re
from playwright.sync_api import Locator, Page
from tests.e2e.pages.base_page import BasePage


class ExplorePage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.filter_active_badge = page.get_by_text("(필터 적용 중)")
        self.reset_filter_button = page.get_by_role("button", name="필터 초기화")
        self.search_input = page.get_by_placeholder(re.compile(r"검색어|음료명"))

    def open(self) -> None:
        """'음료 탐색' 탭으로 이동"""
        self.navigate_to_tab("음료 탐색")

    def get_result_count(self, count: int | None = None) -> Locator:
        """검색 결과 개수 문구 로케이터 반환 (count 미지정 시 전체 숫자 패턴 매칭)"""
        if count is not None:
            return self.page.get_by_text(f"검색 결과: {count}개 음료")
        return self.page.get_by_text(re.compile(r"검색 결과: \d+개 음료"))

    def select_brand(self, brand_name: str) -> None:
        """특정 브랜드 필터 버튼 클릭"""
        self.page.get_by_role("button", name=brand_name).click()

    def select_curation_preset(self, preset_pattern: str) -> None:
        """목적별 빠른 큐레이션 프리셋 버튼 클릭"""
        self.page.get_by_role("button", name=re.compile(preset_pattern)).click()

    def get_sort_button(self, label: str) -> Locator:
        """메인 영역 내 현재 정렬 기준 버튼 로케이터 반환"""
        return self.main_area.get_by_role("button").filter(has_text=label)

    def sort_by(self, sort_option: str, current_label: str = "기본순") -> None:
        """정렬 드롭다운을 열고 지정한 정렬 옵션 클릭"""
        self.get_sort_button(current_label).click()
        self.page.get_by_role("button", name=sort_option).click()

    def search_drink(self, keyword: str) -> None:
        """음료 검색창에 키워드 입력"""
        self.search_input.fill(keyword)

    def reset_filters(self) -> None:
        """필터 초기화 버튼 클릭"""
        self.reset_filter_button.click()

