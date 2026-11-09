"""
오늘의커피 E2E 검증 명세서: 01. 시스템 초기 기동 및 글로벌 네비게이션
- test_main_layout_and_branding: 메인 페이지 로드, 브라우저 탭 타이틀, 헤더 브랜딩 및 큐레이션 헤딩 정상 렌더링 검증
- test_global_navigation_tabs: 상단 글로벌 4대 탭(추천, 탐색, 원두, 비교) 및 카페인 트래커 위젯 접근성 검증
"""

import re
from playwright.sync_api import Page, expect


def test_main_layout_and_branding(clean_page: Page):
    """
    [스모크 1] 메인 화면 레이아웃 및 브랜딩 요소 정상 노출 검증
    """
    # 1. 브라우저 탭 타이틀 검증 (정규식 부분 일치)
    expect(clean_page).to_have_title(re.compile(r"오늘의커피"))

    # 2. 상단 헤더 브랜드 로고 및 텍스트 검증
    brand_logo = clean_page.locator("header").get_by_text("오늘의커피", exact=True)
    expect(brand_logo).to_be_visible()

    # 3. 메인 추천 섹션 타이틀 검증
    main_section_title = clean_page.get_by_role("heading", name="오늘 어떤 커피를 찾으시나요?")
    expect(main_section_title).to_be_visible()


def test_global_navigation_tabs(clean_page: Page):
    """
    [스모크 2] 글로벌 네비게이션 4대 탭 및 일일 섭취 트래커 위젯 접근성 검증
    """
    header_nav = clean_page.locator("header nav")

    # 4대 탭 버튼 노출 확인
    expect(header_nav.get_by_role("button", name="추천 커피")).to_be_visible()
    expect(header_nav.get_by_role("button", name="음료 탐색")).to_be_visible()
    expect(header_nav.get_by_role("button", name="원두 가이드")).to_be_visible()
    expect(header_nav.get_by_role("button", name="브랜드 한눈에 보기")).to_be_visible()

    # 우측 상단 카페인 트래커 위젯 버튼 확인
    header_tracker = clean_page.locator("header").get_by_role("button").filter(has_text="오늘 섭취량")
    expect(header_tracker).to_be_visible()

