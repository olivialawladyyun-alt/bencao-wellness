# -*- coding: utf-8 -*-
"""生成「本草·养身」应用图标。
- 本草养身.ico        ：Windows exe / 桌面快捷方式（圆角、透明角）
- icons/*.png         ：PWA / iPad 主屏幕图标（满版方形，由系统自行圆角）
主题：青瓷绿渐变底 + 米色草本五叶枝 + 金色叶脉。
"""
import os
import math
from PIL import Image, ImageDraw

CREAM = (244, 238, 218, 255)
GOLD = (203, 154, 75, 255)
STEM = (210, 196, 150, 255)


def make_leaf(W, length, width, fill, vein):
    pad = 24
    L = Image.new("RGBA", (width + pad * 2, length + pad * 2), (0, 0, 0, 0))
    ld = ImageDraw.Draw(L)
    cx = (width + pad * 2) / 2
    left, right = [], []
    N = 64
    for i in range(N + 1):
        t = i / N
        w = (width / 2) * 2.45 * (t ** 0.5) * ((1 - t) ** 0.85)
        y = pad + (1 - t) * length
        left.append((cx - w, y)); right.append((cx + w, y))
    ld.polygon(left + right[::-1], fill=fill)
    ld.line([(cx, pad + 3), (cx, pad + length - 3)], fill=vein, width=max(3, width // 18))
    for k in (0.30, 0.52, 0.72):
        yy = pad + (1 - k) * length
        ww = (width / 2) * 2.45 * (k ** 0.5) * ((1 - k) ** 0.85)
        ld.line([(cx, yy + 6), (cx - ww * 0.7, yy - ww * 0.4)], fill=vein, width=max(2, width // 30))
        ld.line([(cx, yy + 6), (cx + ww * 0.7, yy - ww * 0.4)], fill=vein, width=max(2, width // 30))
    return L


def paste_leaf(base, leaf_img, base_xy, angle):
    rot = leaf_img.rotate(angle, expand=True, resample=Image.BICUBIC)
    bw, bh = leaf_img.size
    anchor = (bw / 2, bh - 24)
    a = math.radians(-angle)
    ox, oy = anchor[0] - bw / 2, anchor[1] - bh / 2
    rx = ox * math.cos(a) - oy * math.sin(a)
    ry = ox * math.sin(a) + oy * math.cos(a)
    rw, rh = rot.size
    base.alpha_composite(rot, (int(base_xy[0] - (rw / 2 + rx)), int(base_xy[1] - (rh / 2 + ry))))


def draw_master(rounded):
    W = 2048
    img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    top, bot = (116, 138, 86), (78, 96, 56)
    grad = Image.new("RGBA", (W, W))
    gd = ImageDraw.Draw(grad)
    for y in range(W):
        t = y / W
        c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)) + (255,)
        gd.line([(0, y), (W, y)], fill=c)
    if rounded:
        radius = int(W * 0.225)
        mask = Image.new("L", (W, W), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, W - 1, W - 1], radius=radius, fill=255)
        img.paste(grad, (0, 0), mask)
        ImageDraw.Draw(img).rounded_rectangle(
            [int(W * 0.05)] * 2 + [int(W * 0.95)] * 2,
            radius=int(radius * 0.8), outline=(206, 158, 80, 230), width=max(2, W // 150))
    else:
        img.paste(grad, (0, 0))            # 满版，由系统自行圆角（iOS/Android）

    cx0 = W * 0.5
    ImageDraw.Draw(img).line([(cx0, W * 0.82), (cx0, W * 0.34)], fill=STEM, width=max(4, W // 90))
    leaf_top = make_leaf(W, int(W * 0.34), int(W * 0.15), CREAM, GOLD)
    leaf_side = make_leaf(W, int(W * 0.30), int(W * 0.155), CREAM, GOLD)
    paste_leaf(img, leaf_top, (cx0, W * 0.46), 0)
    paste_leaf(img, leaf_side, (W * 0.5, W * 0.58), 52)
    paste_leaf(img, leaf_side, (W * 0.5, W * 0.58), -52)
    paste_leaf(img, leaf_side, (W * 0.5, W * 0.72), 66)
    paste_leaf(img, leaf_side, (W * 0.5, W * 0.72), -66)
    return img


def resized(master, px):
    return master.resize((px, px), Image.LANCZOS)


if __name__ == "__main__":
    os.makedirs("icons", exist_ok=True)
    rounded = draw_master(True)
    square = draw_master(False)

    # Windows 图标（圆角）
    rounded.resize((512, 512), Image.LANCZOS).save(
        "本草养身.ico", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    resized(rounded, 32).save("icons/favicon-32.png")

    # PWA / iPad 主屏幕图标（满版方形）
    resized(square, 180).save("icons/apple-touch-icon.png")
    resized(square, 192).save("icons/icon-192.png")
    resized(square, 512).save("icons/icon-512.png")
    print("done: 本草养身.ico, icons/{favicon-32,apple-touch-icon,icon-192,icon-512}.png")
