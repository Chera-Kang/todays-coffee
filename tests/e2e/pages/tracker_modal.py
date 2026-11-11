"""
일일 카페인 트래커 기록 모달(CaffeineTrackerModal) 페이지 객체
- 권장량 대비 초과 비율, 숙면 안심 가이드 경고, 기록 삭제 및 메모 확인을 담당합니다.
"""

from playwright.sync_api import Locator, Page


class TrackerModal:
    def __init__(self, page: Page):
        self.page = page
        self.container = page.locator("div.fixed")
        self.title_heading = self.container.get_by_role("heading", name="오늘 마신 음료 기록")
        self.limit_ratio_text = self.container.get_by_text("권장량 대비")
        self.over_limit_badge = self.container.get_by_text("(초과)")
        self.sleep_guide_warning = self.container.get_by_text("카페인 상한선 도달 / 초과 주의")
        self.empty_message = self.container.get_by_text("오늘 아직 기록된 음료가 없습니다.")
        self.delete_button = self.container.get_by_role("button", name="기록 삭제")

    def delete_record(self) -> None:
        """기록된 음료 항목의 휴지통(삭제) 버튼 클릭"""
        self.delete_button.click()

    def get_memo_item(self, memo_text: str) -> Locator:
        """기록 모달 내 특정 메모 텍스트 로케이터 반환"""
        return self.container.get_by_text(memo_text)

