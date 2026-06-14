"""
本草·养身 — 桌面版启动器
使用 pywebview，借助系统自带的 Edge WebView2 内核，在独立原生窗口中运行本应用。
开发运行：  py desktop_app.py
打包 exe ： 见 build_exe.bat
"""
import os
import sys
import webview


def resource_path(rel):
    """兼容 PyInstaller 打包：打包后资源解压到 sys._MEIPASS，开发时为脚本所在目录。"""
    base = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base, rel)


def main():
    index = resource_path("index.html")
    webview.create_window(
        title="本草·养身 — 中药熏香养生",
        url=index,
        width=1040,
        height=860,
        min_size=(720, 600),
    )
    webview.start()


if __name__ == "__main__":
    main()
