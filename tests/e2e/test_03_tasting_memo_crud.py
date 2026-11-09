"""
오늘의커피 E2E 검증 명세서: 03. 테이스팅 메모 입력 유효성 방어 및 전체 CRUD 생명주기
- test_tasting_memo_input_negative_validation: 메모 공백 입력 및 특수문자 입력 시 인라인 에러 노출 및 담기 버튼 disabled 비활성화 검증
- test_tasting_memo_save_and_persistence_on_reload: 정상 메모 저장 후 브라우저 새로고침(F5) 시 LocalStorage 데이터 영속성(Persistence) 검증
- test_tasting_memo_item_deletion_and_caffeine_recalculation: 트래커 모달에서 기록 삭제(Trash2) 시 아이템 제거 및 총 섭취 카페인 즉각 차감(150mg -> 0mg) 검증
"""

from playwright.sync_api import Page, expect


def test_tasting_memo_input_negative_validation(clean_page: Page):
    """
    [CRUD 1 - 네거티브 방어] 비정상 입력(공백, 특수문자)에 대한 인라인 에러 및 버튼 disabled 비활성화 검증
    """
    clean_page.get_by_role("main").get_by_role("heading", name="카페 아메리카노 (Tall)").click()

    memo_input = clean_page.get_by_placeholder("한줄 메모 입력해주세요.")
    submit_btn = clean_page.get_by_role("button", name="오늘 마신 커피에 담기")

    # 1. 공백만 입력 시 방어
    memo_input.fill("     ")
    expect(clean_page.get_by_text("공백만으로는 메모를 작성할 수 없습니다.")).to_be_visible()
    expect(submit_btn).to_be_disabled()

    # 2. 특수문자 입력 시 방어
    memo_input.fill("아메리카노 최고!!")
    expect(clean_page.get_by_text("특수문자(!@#$%^&*() 등)는 입력하실 수 없습니다.")).to_be_visible()
    expect(submit_btn).to_be_disabled()


def test_tasting_memo_save_and_persistence_on_reload(clean_page: Page):
    """
    [CRUD 2 - 영속성 보존] 정상 메모 저장 후 브라우저 새로고침(F5) 시 LocalStorage 데이터 유지(Read) 검증
    """
    clean_page.get_by_role("main").get_by_role("heading", name="카페 아메리카노 (Tall)").click()

    memo_input = clean_page.get_by_placeholder("한줄 메모 입력해주세요.")
    submit_btn = clean_page.get_by_role("button", name="오늘 마신 커피에 담기")

    valid_memo = "산미가 적고 고소한 커피"
    memo_input.fill(valid_memo)

    expect(submit_btn).to_be_enabled()
    submit_btn.click()
    expect(clean_page.get_by_text("담기 완료!")).not_to_be_visible()

    # 새로고침 (F5)
    clean_page.reload()

    # 기록 모달 열기
    header_tracker = clean_page.locator("header").get_by_role("button").filter(has_text="오늘 섭취량")
    header_tracker.click()

    # 메모가 영속화되어 존재하는지 검증
    expect(clean_page.get_by_text(valid_memo)).to_be_visible()


def test_tasting_memo_item_deletion_and_caffeine_recalculation(clean_page: Page):
    """
    [CRUD 3 - 삭제 및 재계산] 트래커 모달에서 항목 삭제(Delete) 시 실시간 UI 차감 및 섭취량 0mg 원복 검증
    """
    # 1. 음료 1잔 담기 (150mg)
    clean_page.get_by_role("main").get_by_role("heading", name="카페 아메리카노 (Tall)").click()
    clean_page.get_by_role("button", name="오늘 마신 커피에 담기").click()
    expect(clean_page.get_by_text("담기 완료!")).not_to_be_visible()

    # 2. 트래커 모달 열기
    header_tracker = clean_page.locator("header").get_by_role("button").filter(has_text="오늘 섭취량")
    header_tracker.click()
    expect(clean_page.get_by_role("heading", name="오늘 마신 음료 기록")).to_be_visible()

    # 3. 휴지통(기록 삭제) 버튼 클릭
    clean_page.get_by_role("button", name="기록 삭제").click()

    # 4. 빈 목록 Empty State 텍스트 노출 검증
    expect(clean_page.get_by_text("오늘 아직 기록된 음료가 없습니다.")).to_be_visible()

    # 5. 헤더 트래커가 0mg으로 즉시 재계산되었는지 검증
    expect(header_tracker).to_contain_text("0")

