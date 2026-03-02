---
name: pdf2image
description: Convert PDF pages to images using Python pdf2image library. Usage: say "pdf转图片" or "convert pdf to image" to convert PDF file to images.
---

# PDF 转图片技能 - 执行指令

## 触发条件
用户说以下内容时触发此技能：
- "pdf转图片"
- "convert pdf to image"
- "pdf转换成图片"
- "把pdf转成图片"
- "提取pdf页面为图片"

---

## 功能说明

**pdf2image** 是一个 Python 库，可以将 PDF 的每一页转换为 PIL 图片对象。

### 主要功能
- 将 PDF 文件转换为图片列表
- 支持指定页码范围
- 支持 DPI 设置
- 支持多种输出格式（PPM、JPEG、PNG）
- 支持灰度转换
- 支持自定义输出尺寸

---

## 前置要求

### 1. 安装 Python 依赖

```bash
pip install pdf2image
```

### 2. 安装 Poppler

**Mac (Homebrew)**:
```bash
brew install poppler
```

**Linux**:
```bash
sudo apt-get install poppler-utils
```

**Windows**:
1. 下载 poppler for Windows: https://github.com/oschwartz10612/poppler-windows/releases/
2. 解压到指定目录（如 `C:\poppler-xx`）
3. 添加 `bin/` 文件夹到 PATH，或在代码中指定 `poppler_path`

---

## 使用方法

### 基本用法

```python
from pdf2image import convert_from_path

# 将整个 PDF 转换为图片列表
images = convert_from_path('example.pdf')

# 保存图片
for i, image in enumerate(images):
    image.save(f'page_{i + 1}.jpg')
```

### 高级用法

```python
from pdf2image import convert_from_path, convert_from_bytes

# 1. 指定 DPI（默认 200）
images = convert_from_path('example.pdf', dpi=300)

# 2. 只转换指定页面（第 1-5 页）
images = convert_from_path('example.pdf', first_page=1, last_page=5)

# 3. 转换为 JPEG 格式（更快，文件更小）
images = convert_from_path('example.pdf', fmt='jpeg')

# 4. 转换为灰度
images = convert_from_path('example.pdf', grayscale=True)

# 5. 自定义输出尺寸
images = convert_from_path('example.pdf', size=400)  # 适应 400x400
images = convert_from_path('example.pdf', size=(800, 600))  # 固定尺寸

# 6. 从字节数据转换（适用于上传的文件）
with open('example.pdf', 'rb') as f:
    pdf_bytes = f.read()
    images = convert_from_bytes(pdf_bytes)

# 7. 指定输出文件夹（节省内存）
import tempfile
with tempfile.TemporaryDirectory() as path:
    images = convert_from_path('example.pdf', output_folder=path)
    # 图片已保存到输出文件夹
```

---

## 完整脚本

创建一个脚本 `pdf_to_images.py`：

```python
#!/usr/bin/env python3
"""
PDF 转图片脚本
用法: python pdf_to_images.py <pdf文件路径> [输出文件夹]
"""

import sys
import os
from pathlib import Path
from pdf2image import convert_from_path

def convert_pdf_to_images(pdf_path, output_folder=None, dpi=200):
    """
    将 PDF 转换为图片

    Args:
        pdf_path: PDF 文件路径
        output_folder: 输出文件夹（默认与 PDF 同目录）
        dpi: 输出图片 DPI（默认 200）
    """
    pdf_path = Path(pdf_path)

    if not pdf_path.exists():
        print(f"错误: 文件不存在: {pdf_path}")
        return

    # 默认输出文件夹
    if output_folder is None:
        output_folder = pdf_path.parent / f"{pdf_path.stem}_images"
    else:
        output_folder = Path(output_folder)

    output_folder.mkdir(exist_ok=True)
    print(f"输出文件夹: {output_folder}")

    # 转换 PDF
    print(f"正在转换: {pdf_path.name}")
    images = convert_from_path(pdf_path, dpi=dpi)

    # 保存图片
    for i, image in enumerate(images):
        output_path = output_folder / f"page_{i + 1:03d}.jpg"
        image.save(output_path, 'JPEG')
        print(f"  已保存: {output_path.name}")

    print(f"\n完成！共转换 {len(images)} 页")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python pdf_to_images.py <pdf文件路径> [输出文件夹]")
        sys.exit(1)

    pdf_file = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else None
    dpi = 200  # 可以修改这个值来调整输出质量

    convert_pdf_to_images(pdf_file, out_dir, dpi)
```

### 使用脚本

```bash
# 基本用法
python pdf_to_images.py example.pdf

# 指定输出文件夹
python pdf_to_images.py example.pdf ./output_images

# 修改 DPI 为 300（更高清）
# 编辑脚本中的 dpi = 200 为 dpi = 300
```

---

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pdf_path` | str | 必填 | PDF 文件路径 |
| `dpi` | int | 200 | 输出图片 DPI，越大越清晰 |
| `output_folder` | str | None | 输出文件夹，None 则返回 PIL 对象 |
| `first_page` | int | None | 起始页码（从 1 开始） |
| `last_page` | int | None | 结束页码 |
| `fmt` | str | 'ppm' | 输出格式：'ppm', 'jpeg', 'png' |
| `grayscale` | bool | False | 是否转换为灰度 |
| `size` | int/tuple | None | 输出尺寸 |
| `thread_count` | int | 1 | 线程数（建议不超过 4） |

---

## 常见问题

### Q1: 提示 "poppler not found"
**A**: 需要安装 poppler 工具，见上方「前置要求」

### Q2: 内存溢出
**A**: 使用 `output_folder` 参数，避免将所有图片加载到内存：
```python
convert_from_path('large.pdf', output_folder='./temp')
```

### Q3: 转换速度慢
**A**:
- 使用 `fmt='jpeg'` 格式
- 使用 `output_folder` 参数（SSD 上更快）
- 调低 `dpi` 值

### Q4: Windows 下报错
**A**: 指定 poppler 路径：
```python
convert_from_path('example.pdf', poppler_path=r'C:\poppler-23\bin')
```

---

## 完成后提醒

转换完成后，用户可以：
- 在输出文件夹查看转换后的图片
- 使用图片处理软件进一步编辑
- 上传到文档或分享平台
