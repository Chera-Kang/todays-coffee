"""
음료 상세 모달(DrinkDetailModal) 페이지 객체
- 테이스팅 메모 입력, 담기 버튼 제어, 비동기 모달 닫힘 대기(State Guard)를 캡슐화합니다.
"""

from playwright.sync_api import Locator, Page, expect


class DrinkDetailModal:
    def __init__(self, page: Page):
        self.page = page
        self.container = page.locator("div.fixed")
        self.memo_input = page.get_by_placeholder("한줄 메모 입력해주세요.")
        self.submit_button = page.get_by_role("button", name="오늘 마신 커피에 담기")
        self.success_toast = page.get_by_text("담기 완료!")

    def get_title_heading(self, drink_name: str) -> Locator:
        """모달 내부의 음료 제목(h2) 로케이터 반환"""
        return self.page.locator("h2").filter(has_text=drink_name)

    def get_caffeine_badge(self, caffeine_text: str) -> Locator:
        """모달 내 특정 카페인 수치 문단(p) 로케이터 반환"""
        return self.container.locator("p").filter(has_text=caffeine_text)

    def fill_memo(self, text: str) -> None:
        """테이스팅 메모 입력란에 텍스트 입력"""
        self.memo_input.fill(text)

    def submit_and_wait_close(self) -> None:
        """담기 버튼 클릭 후 '담기 완료!' 피드백이 사라져 모달이 완전히 닫힐 때까지 대기"""
        self.submit_button.click()
        expect(self.success_toast).not_to_be_visible()

