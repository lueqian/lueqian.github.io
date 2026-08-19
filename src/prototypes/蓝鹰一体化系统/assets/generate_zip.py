import zipfile
import os

# 配置目录
assets_dir = os.path.dirname(os.path.abspath(__file__))
excel_zip_path = os.path.join(assets_dir, 'export_excel.zip')
std_zip_path = os.path.join(assets_dir, 'export_std.zip')

print("Starting to generate differentiated ZIP archives (Excel and std)...")

douyin_img_name = 'Snipaste_2026-08-19_11-28-41.png'
xiaohongshu_img_name = 'Snipaste_2026-08-19_11-29-09.png'
douyin_img_path = os.path.join(assets_dir, douyin_img_name)
xiaohongshu_img_path = os.path.join(assets_dir, xiaohongshu_img_name)

# 表格内容（去掉哈希列，替换为截图文件名列以对应映射）
csv_content = "\uFEFF链接,标题,作者,平台,发布时间,截图文件名\n" \
              f"https://v.douyin.com/ZMsjQ1s/,【谣言】淮安某大型购物中心发生爆炸，现场伤亡惨重,都市爆料王,抖音,2026-08-18 10:15:30,{douyin_img_name}\n" \
              f"https://www.xiaohongshu.com/discovery/item/66c22ab89fd0/,【辟谣】淮安汛情严重，苏超附近积水没过大腿？网警：假的！,小红薯5f98a2,小红书,2026-08-18 14:30:12,{xiaohongshu_img_name}\n" \
              f"https://weibo.com/56829471/Nf82Ka9/,谣言：淮安市自来水有毒，近期切勿饮用,同城生活播报,微博,2026-08-17 19:22:45,{douyin_img_name}\n" \
              f"https://mp.weixin.qq.com/s/Hz9_mN8s/,突发！某小学爆发传染性极强的流感病毒致多人死亡？,健康科普早知道,微信,2026-08-18 08:05:00,{xiaohongshu_img_name}\n"

# 1. 生成 Excel 压缩包 (内含 link_evidence_manifest.xlsx)
try:
    with zipfile.ZipFile(excel_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.writestr('link_evidence_manifest.xlsx', csv_content)
        if os.path.exists(douyin_img_path):
            zipf.write(douyin_img_path, f'screenshots/{douyin_img_name}')
        if os.path.exists(xiaohongshu_img_path):
            zipf.write(xiaohongshu_img_path, f'screenshots/{xiaohongshu_img_name}')
    print(f"Excel ZIP successfully generated at: {excel_zip_path}")
except Exception as e:
    print("Error generating Excel ZIP:", str(e))

# 2. 生成 std 压缩包 (内含 link_evidence_manifest.std)
try:
    with zipfile.ZipFile(std_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.writestr('link_evidence_manifest.std', csv_content)
        if os.path.exists(douyin_img_path):
            zipf.write(douyin_img_path, f'screenshots/{douyin_img_name}')
        if os.path.exists(xiaohongshu_img_path):
            zipf.write(xiaohongshu_img_path, f'screenshots/{xiaohongshu_img_name}')
    print(f"std ZIP successfully generated at: {std_zip_path}")
except Exception as e:
    print("Error generating std ZIP:", str(e))
