@echo off
rem 零安装启动：用 Edge 的“应用模式”在无浏览器边框的独立窗口中打开本程序。
rem 适合还没打包 exe 时直接使用，双击本文件即可。
set "DIR=%~dp0"
set "DIR=%DIR:\=/%"
start "" msedge --app="file:///%DIR%index.html" --window-size=1040,880
