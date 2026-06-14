@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   本草·养身 — 打包为 Windows 桌面应用 (.exe)
echo ============================================
echo.
echo [1/2] 安装/更新依赖 (pywebview, pyinstaller) ...
py -m pip install --upgrade pywebview pyinstaller
if errorlevel 1 ( echo 依赖安装失败，请检查网络或 Python 环境。 & pause & exit /b 1 )
echo.
echo [2/2] 正在打包 ... (首次较慢，请耐心等待)
py -m PyInstaller --noconfirm --onefile --windowed --name "本草养身" ^
  --icon "本草养身.ico" ^
  --add-data "index.html;." ^
  --add-data "css;css" ^
  --add-data "js;js" ^
  desktop_app.py
if errorlevel 1 ( echo 打包失败。 & pause & exit /b 1 )
echo.
echo ============================================
echo   完成！可执行文件： dist\本草养身.exe
echo   双击即可运行，可发送快捷方式到桌面。
echo ============================================
pause
