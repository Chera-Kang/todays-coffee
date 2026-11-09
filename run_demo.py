# -*- coding: utf-8 -*-
"""
오늘의커피(Todays-Coffee) E2E 올인원 쇼케이스 러너 (run_demo.py)
1. 브라우저 E2E 자동화 시연 (1920x1080 FHD, 700ms SlowMo)
2. Allure Report 웹 대시보드 자동 팝업 (16 Passed, 1 Failed)
3. Playwright Trace Viewer 블랙박스 디버깅 연계 팝업
"""

import subprocess
import sys
import os
import time

def main():
    print("=" * 68)
    print("  ☕ 오늘의커피(Todays-Coffee) E2E 풀 스위트 쇼케이스 러너")
    print("  - 화면 해상도: 1920x1080 (FHD 16:9)")
    print("  - 동작 템포: 0.7초 (700ms) 녹화 최적화 모드")
    print("=" * 68)
    print()
    print("[1/3] 브라우저 자동화 시연 준비가 완료되었습니다.")
    print("      OBS 화면 녹화를 시작하신 후, 엔터(Enter) 키를 누르면 시연이 시작됩니다.")
    print()
    
    input("▶ 녹화 준비 완료 후 [Enter]를 눌러주세요...")
    print()
    print("🚀 [Step 1] 17개 E2E 테스트 스위트 시연을 시작합니다...")
    print()

    # 1. pytest 실행
    venv_python = os.path.join(os.getcwd(), ".venv", "Scripts", "python.exe")
    pytest_cmd = [
        venv_python,
        "-m", "pytest",
        "tests/e2e/",
        "--alluredir=allure-results",
        "--clean-alluredir",
        "--headed",
        "--slowmo", "700"
    ]
    subprocess.run(pytest_cmd)

    print()
    print("=" * 68)
    print("🚀 [Step 2] Allure Report 품질 대시보드를 브라우저에 실행합니다.")
    print("=" * 68)
    print()

    # 2. Allure serve 실행 (백그라운드 비차단 프로세스로 구동하여 Ctrl+C 충돌 방지)
    allure_proc = None
    try:
        allure_proc = subprocess.Popen(
            ["npx.cmd" if sys.platform == "win32" else "npx", "allure", "serve", "allure-results"],
            shell=True
        )
        print("▶ Allure 대시보드가 브라우저에 열렸습니다. (16 Passed, 1 Failed)")
        print()
        input("▶ 대시보드 확인 후, [Enter]를 누르면 'Playwright Trace Viewer(블랙박스)'로 연계됩니다...")
    except KeyboardInterrupt:
        pass
    finally:
        if allure_proc:
            allure_proc.terminate()

    print()
    print("=" * 68)
    print("🚀 [Step 3] 실패한 08번 메타 테스트의 Playwright Trace Viewer를 실행합니다.")
    print("=" * 68)
    print()

    # 3. Playwright Trace Viewer 실행
    trace_path = os.path.join("test-results", "trace_test_trace_capture_on_assertion_failure_chromium.zip")
    if os.path.exists(trace_path):
        trace_cmd = [
            venv_python,
            "-m", "playwright",
            "show-trace",
            trace_path
        ]
        try:
            print(f"▶ 트레이스 파일을 로드합니다: {trace_path}")
            subprocess.run(trace_cmd)
        except KeyboardInterrupt:
            pass
    else:
        print(f"⚠️ 트레이스 파일을 찾을 수 없습니다: {trace_path}")

    print()
    print("=" * 68)
    print("🎉 모든 시연 및 리포팅 파이프라인이 성공적으로 완료되었습니다!")
    print("=" * 68)
    time.sleep(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n시연 러너가 안전하게 종료되었습니다.")
        sys.exit(0)
