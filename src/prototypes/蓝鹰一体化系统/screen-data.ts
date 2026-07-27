export type ScreenTone = 'internet-report' | 'ai-alert' | 'task' | 'pending' | 'received' | 'processing' | 'completed' | 'overdue';

export interface ScreenEvent {
  id: string;
  title: string;
  summary: string;
  area: string;
  risk: string;
  volume: number;
  trend: number[];
  tone: ScreenTone;
  time: string;
}

export interface ScreenTask {
  id: string;
  name: string;
  code: string;
  status: string;
  department: string;
  eventCount: number;
  trend: string;
}

export interface ScreenOpinion {
  id: string;
  title: string;
  area: string;
  platform: string;
  source: string;
  time: string;
  score: number;
  status: string;
  tone: ScreenTone;
  summary: string;
}

export interface ScreenInstruction {
  id: string;
  name: string;
  area: string;
  receiver: string;
  status: string;
  tone: ScreenTone;
  deadline: string;
  feedback: string;
}

export interface ScreenRegion {
  name: string;
  x: number;
  y: number;
  report: number;
  received: number;
  completed: number;
  overdue: number;
  people: number;
}

export const screenEvents: ScreenEvent[] = [
  { id: 'evt-01', title: '淮安高张花园物业纠纷舆情', summary: '居民投诉集中扩散，多个本地账号持续跟进，建议关注线下聚集风险。', area: '清江浦区', risk: '高', volume: 12860, trend: [26, 38, 44, 58, 74, 68, 86], tone: 'task', time: '10:32' },
  { id: 'evt-02', title: '淮安苏超赛事周边交通讨论', summary: '赛事相关短视频热度上涨，评论区出现出行秩序与停车指引讨论。', area: '淮安区', risk: '中', volume: 8640, trend: [32, 31, 45, 42, 55, 61, 68], tone: 'task', time: '09:48' },
  { id: 'evt-03', title: '极端天气防汛提醒传播', summary: '强对流天气预警信息在多平台转发，群众咨询集中于低洼路段通行。', area: '洪泽区', risk: '中', volume: 5420, trend: [24, 30, 36, 49, 43, 56, 60], tone: 'task', time: '08:56' },
];

export const screenTasks: ScreenTask[] = [
  { id: 'task-01', code: 'SC-0510', name: '0510淮安汛情专项监测', status: '生效中', department: '网安支队', eventCount: 18, trend: '+24%' },
  { id: 'task-02', code: 'SC-0508', name: '高张花园风险源头防控', status: '生效中', department: '清江浦大队', eventCount: 12, trend: '+12%' },
  { id: 'task-03', code: 'SC-0507', name: '淮安苏超赛事舆情守护', status: '待启动', department: '淮安区大队', eventCount: 6, trend: '+8%' },
];

export const screenOpinions: ScreenOpinion[] = [
  { id: 'op-01', title: '短视频平台出现“暴雨路段车辆被困”视频', area: '洪泽区', platform: '抖音', source: 'AI主动发现', time: '10:41', score: 92, status: '处理中', tone: 'ai-alert', summary: 'AI判断为高热度突发事件，建议核查视频拍摄时间与实际路况。' },
  { id: 'op-02', title: '网友反映清江浦区某小区停车秩序', area: '清江浦区', platform: '微博', source: '本地上报', time: '10:26', score: 76, status: '待处置', tone: 'internet-report', summary: '本地账号集中讨论，已形成 3 个关联话题。' },
  { id: 'op-03', title: '淮安区赛事周边交通提示被大量转发', area: '淮安区', platform: '微信', source: '本地上报', time: '09:58', score: 68, status: '已处置', tone: 'internet-report', summary: '官方提示已发布，舆情热度开始回落。' },
  { id: 'op-04', title: 'AI发现“学校门口聚集”旧视频二次传播', area: '淮阴区', platform: '快手', source: 'AI主动发现', time: '09:43', score: 84, status: '处理中', tone: 'ai-alert', summary: '疑似旧闻新炒，正在进行时间与地点交叉核验。' },
];

export const screenInstructions: ScreenInstruction[] = [
  { id: 'ins-01', name: '动态监测 · 核查视频时间地点', area: '洪泽区', receiver: '网安大队值班员', status: '处理中', tone: 'processing', deadline: '11:30', feedback: '已联系属地核查，等待现场回传。' },
  { id: 'ins-02', name: '两群处置 · 发布权威提示', area: '淮安区', receiver: '淮安区宣传岗', status: '已完成', tone: 'completed', deadline: '10:50', feedback: '提示已发布，群内完成同步。' },
  { id: 'ins-03', name: '帖文处置 · 反馈处置结果', area: '清江浦区', receiver: '清江浦网安中队', status: '已签收', tone: 'received', deadline: '11:10', feedback: '已签收，正在联络平台。' },
  { id: 'ins-04', name: '谣言核查 · 回传核查材料', area: '淮阴区', receiver: '淮阴区值班岗', status: '待签收', tone: 'pending', deadline: '11:45', feedback: '等待属地签收。' },
  { id: 'ins-05', name: '材料反馈 · 提交处置截图', area: '金湖县', receiver: '金湖县网安岗', status: '已超时', tone: 'overdue', deadline: '10:20', feedback: '超过时限 21 分钟，已提醒。' },
];

export const screenRegions: ScreenRegion[] = [
  { name: '清江浦区', x: 48, y: 44, report: 38, received: 18, completed: 13, overdue: 1, people: 26 },
  { name: '淮阴区', x: 38, y: 28, report: 26, received: 14, completed: 10, overdue: 2, people: 19 },
  { name: '淮安区', x: 61, y: 52, report: 32, received: 20, completed: 17, overdue: 0, people: 24 },
  { name: '洪泽区', x: 70, y: 68, report: 21, received: 12, completed: 8, overdue: 1, people: 15 },
  { name: '涟水县', x: 77, y: 32, report: 17, received: 9, completed: 6, overdue: 2, people: 12 },
  { name: '盱眙县', x: 40, y: 76, report: 14, received: 8, completed: 7, overdue: 0, people: 10 },
  { name: '金湖县', x: 58, y: 84, report: 12, received: 7, completed: 5, overdue: 1, people: 9 },
  { name: '开发区', x: 54, y: 57, report: 29, received: 16, completed: 12, overdue: 0, people: 18 },
];

export const internetTrend = [46, 52, 48, 64, 58, 72, 78, 74, 86, 82, 94, 88];
export const intranetTrend = [28, 34, 32, 42, 39, 48, 53, 50, 61, 58, 66, 72];
