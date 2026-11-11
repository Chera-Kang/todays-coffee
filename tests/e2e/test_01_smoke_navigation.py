"""
오늘의커피 E2E 검증 명세서: 01. 시스템 초기 기동 및 글로벌 네비게이션 (POM 적용)
- test_main_layout_and_branding: 메인 페이지 로드, 브라우저 탭 타이틀, 헤더 브랜딩 및 큐레이션 헤딩 정상 렌더링 검증
- test_global_navigation_tabs: 상단 글로벌 4대 탭(추천, 탐색, 원두, 비교) 및 카페인 트래커 위젯 접근성 검증
"""

import re
from playwright.sync_api import Page, expect
from tests.e2e.pages.base_page import BasePage


def test_main_layout_and_branding(clean_page: Page):
    """
    [스모크 1] 메인 화면 레이아웃 및 브랜딩 요소 정상 노출 검증
    """
    base_page = BasePage(clean_page)

    # 1. 브라우저 탭 타이틀 검증 (정규식 부분 일치)
    expect(clean_page).to_have_title(re.compile(r"오늘의커피"))

    # 2. 상단 헤더 브랜드 로고 및 텍스트 검증
    expect(base_page.brand_logo).to_be_visible()

    # 3. 메인 추천 섹션 타이틀 검증
    main_section_title = clean_page.get_by_role("heading", name="오늘 어떤 커피를 찾으시나요?")
    expect(main_section_title).to_be_visible()


def test_global_navigation_tabs(clean_page: Page):
    """
    [스모크 2] 글로벌 네비게이션 4대 탭 및 일일 섭취 트래커 위젯 접근성 검증
    """
    base_page = BasePage(clean_page)

    # 4대 탭 버튼 노출 확인
    for tab_name in ["추천 커피", "음료 탐색", "원두 가이드", "브랜드 한눈에 보기"]:
        expect(base_page.get_nav_tab(tab_name)).to_be_visible()

    # 우측 상단 카페인 트래커 위젯 버튼 확인
    expect(base_page.tracker_button).to_be_visible()
