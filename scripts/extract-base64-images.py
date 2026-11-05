#!/usr/bin/env python3
"""
extract-base64-images.py
将 markdown 文件中的 base64 内嵌图片提取为独立文件，替换为相对路径引用。

用法:
  python3 extract-base64-images.py <markdown文件路径> [--image-dir <图片输出目录>]

特性:
  - 幂等执行：重复运行不会产生重复文件，已提取的引用不会被二次处理
  - 自动检测图片格式（png/jpg/gif/webp/svg）
  - 使用内容哈希命名，避免重复存储相同图片
  - 支持任意 markdown 文件

示例:
  # 处理 eagle_datastory 的 prd.md
  python3 extract-base64-images.py src/prototypes/eagle_datastory/prd.md

  # 指定图片输出目录
  python3 extract-base64-images.py src/docs/我的文档.md --image-dir src/docs/assets/images
"""

import re
import os
import sys
import hashlib
import base64
import argparse

# base64 图片正则
BASE64_IMG_PATTERN = re.compile(
    r'!\[([^\]]*)\]\(data:image/([a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=\s]+)\)'
)

# 扩展名映射
EXT_MAP = {
    'png': '.png',
    'jpeg': '.jpg',
    'jpg': '.jpg',
    'gif': '.gif',
    'webp': '.webp',
    'svg+xml': '.svg',
}


def get_image_extension(mime_type: str) -> str:
    return EXT_MAP.get(mime_type.lower(), '.png')


def content_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:16]


def extract_images(md_path: str, image_dir: str) -> dict:
    """
    提取 markdown 中的 base64 图片为独立文件。

    Returns:
        dict: { 'new_md_size': int, 'images_extracted': int, 'images_skipped': int, 'image_dir': str }
    """
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if not BASE64_IMG_PATTERN.search(content):
        print(f'  未发现 base64 内嵌图片，无需处理。')
        return {
            'new_md_size': len(content.encode('utf-8')),
            'images_extracted': 0,
            'images_skipped': 0,
            'image_dir': image_dir,
        }

    os.makedirs(image_dir, exist_ok=True)

    extracted = 0
    skipped = 0

    def replace_match(m):
        nonlocal extracted, skipped
        alt_text = m.group(1)
        mime_type = m.group(2)
        b64_data = m.group(3).strip()

        # 解码 base64
        try:
            img_bytes = base64.b64decode(b64_data)
        except Exception as e:
            print(f'  ⚠️  base64 解码失败，跳过: {alt_text[:30]}... ({e})')
            skipped += 1
            return m.group(0)

        # 生成文件名
        ext = get_image_extension(mime_type)
        h = content_hash(img_bytes)
        filename = f'img-{h}{ext}'
        filepath = os.path.join(image_dir, filename)

        # 写入文件（幂等：已存在则跳过）
        if os.path.exists(filepath):
            skipped += 1
        else:
            with open(filepath, 'wb') as img_file:
                img_file.write(img_bytes)
            extracted += 1
            size_kb = len(img_bytes) / 1024
            print(f'  ✅ 提取: {filename} ({size_kb:.1f} KB)')

        # 计算相对路径（从 md 文件所在目录到图片目录）
        md_dir = os.path.dirname(os.path.abspath(md_path))
        abs_image_dir = os.path.abspath(image_dir)
        rel_path = os.path.relpath(abs_image_dir, md_dir)
        rel_path = rel_path.replace(os.sep, '/')
        if not rel_path.startswith('.'):
            rel_path = './' + rel_path

        return f'![{alt_text}]({rel_path}/{filename})'

    new_content = BASE64_IMG_PATTERN.sub(replace_match, content)

    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    new_size = len(new_content.encode('utf-8'))
    print(f'\n  📊 结果:')
    print(f'     提取图片: {extracted} 张（新增）')
    print(f'     跳过图片: {skipped} 张（已存在或解码失败）')
    print(f'     Markdown: {new_size / 1024:.1f} KB')
    print(f'     图片目录: {image_dir}')

    return {
        'new_md_size': new_size,
        'images_extracted': extracted,
        'images_skipped': skipped,
        'image_dir': image_dir,
    }


def main():
    parser = argparse.ArgumentParser(
        description='提取 markdown 中的 base64 内嵌图片为独立文件'
    )
    parser.add_argument('md_file', help='markdown 文件路径')
    parser.add_argument(
        '--image-dir',
        help='图片输出目录（默认: 与 md 文件同级的 assets/images/）',
        default=None,
    )
    args = parser.parse_args()

    md_path = args.md_file
    if not os.path.exists(md_path):
        print(f'❌ 文件不存在: {md_path}')
        sys.exit(1)

    # 默认图片目录：与 md 文件同级的 assets/images/
    if args.image_dir:
        image_dir = args.image_dir
    else:
        md_dir = os.path.dirname(md_path)
        image_dir = os.path.join(md_dir, 'assets', 'images')

    print(f'📄 处理文件: {md_path}')
    print(f'📁 图片目录: {image_dir}')
    print()

    result = extract_images(md_path, image_dir)
    print(f'\n✨ 完成！')


if __name__ == '__main__':
    main()
