export type PostType =
  | 'municipal_post' // 市局网安支队 - 审核岗 (互联网独立版)
  | 'province_post' // 省厅网安总队 - 指挥岗 (公安内网版)
  | 'district_gusu_post' // 姑苏分局网安大队 - 经办岗 (互联网独立版)
  | 'district_shuyang_post' // 沭阳县局网安大队 - 经办岗 (公安内网未采购版)
  | 'district_guichi_post' // 兼容别名
  | 'district_susong_post'; // 兼容别名

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
  levelText?: string; // 如 '一级 (特急)' | '二级 (高)' | '三级 (中)' | '四级 (低)'
  author: string;
  authorId: string;
  fansCount?: number;
  region: string; // 如 姑苏区
  platform: '抖音app' | '微博' | '今日头条' | '快手';
  publishTime: string;
  initialResearch: string; // 如 初研 1 / 初研 发现
  aiSummary: string;
  aiJudgment: string;
  manualOpinion?: string; // 人工研判意见
  sourceType: string; // 快捷指令 / 日常上报 / 系统上报
  reportTime: string;
  reporterUnit: string; // 姑苏分局 - [张警官]
  provinceTag?: string; // 江苏省
  cityTag?: string; // 苏州市
  categoryTag?: string; // 涉稳舆情 / 公共安全事故
  noVideoWarning?: boolean; // 未上传视频
  statusText: '未处置' | '处置中' | '已处置';
  
  // 跨租户流转属性
  syncToProvince: boolean;
  auditStatus: '待审核' | '已通过' | '已驳回' | '仅保留地市自办' | '无须审核';
  firstReportStatus?: '全省首报' | '重复归并';
  parentReportCode?: string;
  sourceUnitTag?: string; // 数据来源Tag，如 '[苏州市公安局上报]'
  instructionStatus?: string; // 如 '已下发指令 (苏州市公安局处置中)'
  instructionCode?: string; // 如 'ZL20260911001'
  dispatchTargetUnit?: string;
  isThirdPartyRouted?: boolean; // 是否第三方商采·模型自动分流
  fullRegionPath?: string; // 涉事属地路径，如 '江苏省 - 宿迁市 - 沭阳县'
  localWorkOrderCode?: string; // 本地核查工单号，如 'SY20260911001'
  localWorkOrderStatus?: string; // 如 '已转为本地核查 (城关派出所办理中)'
  originalContentUrl?: string;
  isIgnored?: boolean;
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
  assignedStatus?: '待处理' | '已转派';
  isProvinceSupervised?: boolean; // 是否省厅督办指令
  provinceSourceNote?: string; // 原指令来源，如 '省厅网安总队 (要求 24 小时内办结)'
  cityDirectives?: string[]; // 指令动作
  cityInstructionRemark?: string; // 市局批示
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
  opinionIndex: number; // 35.0 / 28.5 / 42.5
  assignedToDistrict?: string; // 转派区县，如 姑苏分局
}

export interface DepartmentNode {
  key: string;
  title: string;
  phone?: string;
  location?: string;
  isSubordinate?: boolean; // 开关：开启后为下级单位，未开启为上级部门
  unitType?: '市局单位' | '区县单位';
  requireAudit?: boolean; // 开关：上报需审核
  targetAuditDept?: string; // 审核目标部门
  superiorAuditDept?: string;
  requireCityAudit?: boolean;
  children?: DepartmentNode[];
}


export interface DeptUserItem {
  id: string;
  serialNumber: number;
  userName: string;
  department: string;
  role: string;
  wechatNick: string;
  idCard: string;
  phone: string;
  activeStatus: '已激活' | '未激活';
  inviteCode: string;
}

