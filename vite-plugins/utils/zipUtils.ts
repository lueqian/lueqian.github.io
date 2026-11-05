import type archiver from 'archiver';

const JUNK_ENTRY_PATTERNS = [
  /(?:^|[\\/])\.DS_Store$/i,
  /(?:^|[\\/])\._.*$/i,
  /(?:^|[\\/])Thumbs\.db$/i,
  /(?:^|[\\/])ehthumbs\.db$/i,
  /(?:^|[\\/])desktop\.ini$/i,
  /(?:^|[\\/])__MACOSX(?:\/|$)/i,
];

/**
 * 判断 zip 条目是否属于系统产生的冗余垃圾文件（如 macOS 的 .DS_Store、._* 或 Windows 的 Thumbs.db）
 */
export function isJunkZipEntry(name: string): boolean {
  if (!name) return false;
  const normalized = name.replace(/\\/g, '/');
  return JUNK_ENTRY_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * archiver.directory 的 dataFunction 过滤器：
 * 过滤掉 .DS_Store、Thumbs.db、__MACOSX 等跨平台垃圾文件，返回 false 阻止其压入 ZIP
 */
export function filterCleanZipEntry(entry: archiver.EntryData): archiver.EntryData | false {
  if (isJunkZipEntry(entry.name)) {
    return false;
  }
  return entry;
}
