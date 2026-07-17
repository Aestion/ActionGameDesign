@echo off
chcp 65001 >nul
cd /d "%~dp0"
call npm run build
if errorlevel 1 (
  echo.
  echo 生成失败，上一可用版本已保留。
  pause
  exit /b 1
)
echo.
echo 知识库已更新：%cd%\dist\index.html
pause
