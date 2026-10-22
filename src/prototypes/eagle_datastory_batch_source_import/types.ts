// 数据与场景类型定义
export type ScenarioId =
  | 'scenario_1' // 入口触发与文件上传
  | 'scenario_2' // 理想链路 - 精准匹配与批量建库 (1:1)
  | 'scenario_3' // 异常消歧 - 多实体冲突手动裁决 (1:N)
  | 'scenario_4' // 兜底链路 - 未命中提取与异步补采
  | 'scenario_5'; // 闭环通知 - 采集完成后下次登录提醒

export interface MatchedAccount {
  id: string;
  uid: string;
  name: string;
  avatar: string;
  avatarColor: string;
  avatarLetter: string;
  platform: 'douyin' | 'kuaishou' | 'weibo' | 'xiaohongshu' | 'bilibili' | 'wechat';
  platformName: string;
  platformColor: string;
  verifyType: string; // PGC | OGC | UGC | 自媒体 | 官方机构
  followersDisplay: string;
  followers: number;
  originUrl: string;
  location: string;
  selected?: boolean;
}

export interface CandidateAccount {
  id: string;
  uid: string;
  name: string;
  avatar: string;
  avatarColor: string;
  avatarLetter: string;
  platform: 'douyin' | 'kuaishou' | 'weibo' | 'xiaohongshu';
  platformName: string;
  platformColor: string;
  followersDisplay: string;
  indexedAt: string; // 入库时间，如 2024-11
  description: string;
  isLatest?: boolean;
}

export interface ConflictItem {
  id: string;
  originUrl: string;
  reason: string;
  candidates: [CandidateAccount, CandidateAccount];
  selectedOption: 'candidate_0' | 'candidate_1' | 'skip' | null;
}

export interface UnhitLinkItem {
  id: string;
  url: string;
  platformGuess: string;
  reason: string;
}

export interface SourceDirectory {
  id: string;
  name: string;
  currentCount: number;
  maxLimit: number;
  isDefault?: boolean;
  visibility: 'public' | 'dept' | 'private';
}
