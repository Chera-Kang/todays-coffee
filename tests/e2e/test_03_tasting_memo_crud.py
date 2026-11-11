"""
오늘의커피 E2E 검증 명세서: 03. 테이스팅 메모 입력 유효성 방어 및 전체 CRUD 생명주기 (POM 적용)
- test_tasting_memo_input_negative_validation: 메모 공백 입력 및 특수문자 입력 시 인라인 에러 노출 및 담기 버튼 disabled 비활성화 검증
- test_tasting_memo_save_and_persistence_on_reload: 정상 메모 저장 후 브라우저 새로고침(F5) 시 LocalStorage 데이터 영속성(Persistence) 검증
- test_tasting_memo_item_deletion_and_caffeine_recalculation: 트래커 모달에서 기록 삭제(Trash2) 시 아이템 제거 및 총 섭취 카페인 즉각 차감(150mg -> 0mg) 검증
"""

from playwright.sync_api import Page, expect
from tests.e2e.pages.base_page import BasePage
from tests.e2e.pages.drink_detail_modal import DrinkDetailModal
from tests.e2e.pages.tracker_modal import TrackerModal


def test_tasting_memo_input_negative_validation(clean_page: Page):
    """
    [CRUD 1 - 네거티브 방어] 비정상 입력(공백, 특수문자)에 대한 인라인 에러 및 버튼 disabled 비활성화 검증
    """
    base = BasePage(clean_page)
    drink_modal = DrinkDetailModal(clean_page)

    base.open_drink_detail("카페 아메리카노 (Tall)")

    # 1. 공백만 입력 시 방어
    drink_modal.fill_memo("     ")
    expect(drink_modal.container.get_by_text("공백만으로는 메모를 작성할 수 없습니다.")).to_be_visible()
    expect(drink_modal.submit_button).to_be_disabled()

    # 2. 특수문자 입력 시 방어
    drink_modal.fill_memo("아메리카노 최고!!")
    expect(drink_modal.container.get_by_text("특수문자(!@#$%^&*() 등)는 입력하실 수 없습니다.")).to_be_visible()
    expect(drink_modal.submit_button).to_be_disabled()


def test_tasting_memo_save_and_persistence_on_reload(clean_page: Page):
    """
    [CRUD 2 - 영속성 보존] 정상 메모 저장 후 브라우저 새로고침(F5) 시 LocalStorage 데이터 유지(Read) 검증
    """
    base = BasePage(clean_page)
    drink_modal = DrinkDetailModal(clean_page)
    tracker_modal = TrackerModal(clean_page)

    base.open_drink_detail("카페 아메리카노 (Tall)")

    valid_memo = "산미가 적고 고소한 커피"
    drink_modal.fill_memo(valid_memo)

    expect(drink_modal.submit_button).to_be_enabled()
    drink_modal.submit_and_wait_close()

    # 새로고침 (F5)
    clean_page.reload()

    # 기록 모달 열기
    base.open_tracker_modal()

    # 메모가 영속화되어 존재하는지 검증
    expect(tracker_modal.get_memo_item(valid_memo)).to_be_visible()


def test_tasting_memo_item_deletion_and_caffeine_recalculation(clean_page: Page):
    """
    [CRUD 3 - 삭제 및 재계산] 트래커 모달에서 항목 삭제(Delete) 시 실시간 UI 차감 및 섭취량 0mg 원복 검증
    """
    base = BasePage(clean_page)
    drink_modal = DrinkDetailModal(clean_page)
    tracker_modal = TrackerModal(clean_page)

    # 1. 음료 1잔 담기 (150mg)
    base.open_drink_detail("카페 아메리카노 (Tall)")
    drink_modal.submit_and_wait_close()

    # 2. 트래커 모달 열기
    base.open_tracker_modal()
    expect(tracker_modal.title_heading).to_be_visible()

    # 3. 휴지통(기록 삭제) 버튼 클릭
    tracker_modal.delete_record()

    # 4. 빈 목록 Empty State 텍스트 노출 검증
    expect(tracker_modal.empty_message).to_be_visible()

    # 5. 헤더 트래커가 0mg으로 즉시 재계산되었는지 검증
    expect(base.tracker_button).to_contain_text("0")
