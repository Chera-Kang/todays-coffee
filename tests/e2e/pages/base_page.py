"""
모든 페이지 객체(Page Object)가 공통으로 상속받는 부모 클래스 (BasePage)
- 글로벌 상단 헤더, 4대 탭 네비게이션, 일일 카페인 트래커 위젯 등 전 페이지 공통 요소를 관리합니다.
"""

from playwright.sync_api import Locator, Page


class BasePage:
    def __init__(self, page: Page):
        self.page = page

        # 1. 상단 헤더 영역 공통 로케이터
        self.header = page.locator("header")
        self.brand_logo = self.header.get_by_text("오늘의커피", exact=True)
        self.nav = page.locator("header nav")

        # 2. 우측 상단 카페인 트래커 위젯 공통 로케이터
        self.tracker_button = self.header.get_by_role("button").filter(has_text="오늘 섭취량")
        self.tracker_warning_icon = self.tracker_button.locator("svg.lucide-triangle-alert")

        # 3. 메인 본문 영역 공통 로케이터
        self.main_area = page.get_by_role("main")
        self.grid_cards = page.locator("main div.grid > div")

    def get_nav_tab(self, tab_name: str) -> Locator:
        """상단 네비게이션 탭 버튼 로케이터 반환"""
        return self.nav.get_by_role("button", name=tab_name)

    def navigate_to_tab(self, tab_name: str) -> None:
        """지정한 글로벌 탭('추천 커피', '음료 탐색', '원두 가이드', '브랜드 한눈에 보기')으로 이동"""
        self.get_nav_tab(tab_name).click()

    def open_tracker_modal(self) -> None:
        """우측 상단 카페인 트래커 위젯을 클릭하여 기록 모달 오픈"""
        self.tracker_button.click()

    def open_drink_detail(self, drink_name: str) -> None:
        """메인 영역에서 특정 이름의 음료 카드를 클릭하여 상세 모달 오픈"""
        self.main_area.get_by_role("heading", name=drink_name).click()

