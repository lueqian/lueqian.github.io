export type PostType = 'district_post' | 'municipal_post' | 'province_post';

export interface SnapshotRecord {
  version: number;
  versionLabel: string;
  title: string;
  sensitivity: string;
  summary: string;
  suggestions: string;
  operator: string;
  operatorDept: string;
  operateTime: string;
  remark: string;
}

export interface OpinionItem {
  id: string;
  code: string;
  title: string;
  tags: string[]; // 话题标签，如 ['消防安全隐患须重视', '夜幕下的火灾']
  isHot: boolean; // 是否热敏，false为非热敏
  stars: number; // 0.5 ~ 5 星
  author: string;
  authorId: string;
  fansCount?: number;
  region: string; // 如 渝北区
  platform: '抖音app' | '微博' | '今日头条' | '快手';
  publishTime: string;
  initialResearch: string; // 如 初研 1 / 初研 发现
  aiSummary: string;
  aiJudgment: string;
  sourceType: string; // 快捷指令 / 日常上报 / 系统上报
  reportTime: string;
  reporterUnit: string; // 梁平区 - [廖楚楚] / 总2_舆情 - 【王小虎】
  provinceTag?: string; // 重庆市 / 安徽省
  cityTag?: string; // 渝北区 / 池州市
  categoryTag?: string; // 公共安全事故 / 涉未成年人和校园安全
  noVideoWarning?: boolean; // 未上传视频
  statusText: '未处置' | '处置中' | '已处置';
  
  // 跨租户流转属性
  syncToProvince: boolean;
  auditStatus: '待审核' | '已通过' | '已驳回' | '无须审核';
  firstReportStatus?: '全省首报' | '重复归并';
  parentReportCode?: string;
  snapshots: SnapshotRecord[];

  // 指数三联
  opinionScore: number; // 舆情指数 42.5
  webIndex: number; // 网信指数 58
  ministryIndex: number; // 部级指数 61
  webChangeRate?: string;
  ministryChangeRate?: string;
}

export interface DisposalTaskItem {
  id: string;
  serialNumber: number;
  title: string;
  isHot: boolean;
  stars: number;
  status: '已处置' | '待处置';
  author: string;
  authorId: string;
  platform: '微博' | '抖音app' | '今日头条';
  publishTime: string;
  instructionCode: string;
  readCount: number;
  commentCount: number;
  forwardCount: number;
  likeCount: number;
  aiSummary: string;
  aiJudgment: string;
  initialResearchTag: string; // 初研 个人极端
  researchCountTag: string; // 第1次研判
  completedTasksTag: string; // 6个任务
  disposalSummaryTag: string; // 平台举报 +5
  opinionIndex: number; // 35.0 / 28.5
  assignedToDistrict?: string; // 转派区县，如 忠县公安局
}
