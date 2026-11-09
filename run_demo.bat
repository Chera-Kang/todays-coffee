@echo off
cd /d "%~dp0"
title Todays-Coffee E2E Showcase Runner
.\.venv\Scripts\python.exe run_demo.py
exit /b 0
