import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Clock, 
  Sliders, 
  Info, 
  Maximize2, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  MoreVertical, 
  Plus, 
  FileText,
  Calendar,
  AlertTriangle,
  LayoutGrid
} from 'lucide-react';

// ==========================================
// 模拟业务数据 (提供“简短”和“繁多”两种文本模式)
// ==========================================

interface WorkRequirementSection {
  title: string;
  items: string[];
}

interface NormalTaskItem {
  title: string;
  tag1: string;
  tag2: string;
  tag1Type: 'normal' | 'special' | 'security';
  unreadCount?: number;
  time?: string;
  userIcon?: boolean;
}

const DATA_TEMPLATES: {
  workRequirements: {
    short: WorkRequirementSection[];
    normal: WorkRequirementSection[];
    long: WorkRequirementSection[];
  };
  plates: {
    entityTracking: { short: NormalTaskItem[]; normal: NormalTaskItem[]; long: NormalTaskItem[]; };
    securityTasks: { short: NormalTaskItem[]; normal: NormalTaskItem[]; long: NormalTaskItem[]; };
    publicOpinion: { short: NormalTaskItem[]; normal: NormalTaskItem[]; long: NormalTaskItem[]; };
    accountTracking: { short: NormalTaskItem[]; normal: NormalTaskItem[]; long: NormalTaskItem[]; };
  };
} = {
  workRequirements: {
    short: [
      {
        title: '领导最新工作要求',
        items: ['1. 加强对网红景点管控辖区的调度工作。', '2. 突发案事件舆情可依次调度“应急支援组”。']
      }
    ],
    normal: [
      {
        title: '领导最新工作要求',
        items: [
          '1. 加强对网红景点管辖辖区的调度工作。',
          '2. 突发案事件舆情可依次调度“应急支援1组”“应急支援2组”。',
          '3. 涉警的信息要叠加标签【涉警】。'
        ]
      },
      {
        title: '近期重点关注事项',
        items: [
          '1. 涉“渝超”足球赛安保工作，密切关注现场态势。',
          '2. 加强重点部位舆情监测。'
        ]
      }
    ],
    long: [
      {
        title: '领导最新工作要求',
        items: [
          '1. 加强对网红景点管辖辖区的调度工作，针对高峰期游客拥堵制定预案。',
          '2. 突发案事件舆情可依次调度“应急支援1组”“应急支援2组”“应急支援3组”，确保5分钟内响应响应。',
          '3. 涉警的信息要叠加标签【涉警】，并同步抄送市局指挥中心。',
          '4. 涉政协委员的信息要叠加标签【涉政协】。',
          '5. 媒体报道、儿童医疗纠纷、涉市委市政府主要领导信息优先分发康童庆...'
        ]
      },
      {
        title: '近期重点关注事项',
        items: [
          '1. 涉“渝超”“中超”足球赛安保。（如前期出现的观众席放烟花、球员打架、球迷冲突、地域攻击等情况，要加强类似情况巡查）',
          '2. 加强洪崖洞、观音桥、解放碑等商圈网红景点，市委市政府等重要部位舆情监测，密切关注突发涉警事件舆情。',
          '3. 涉极端天气、降雨引发的事故事件密切跟进。'
        ]
      },
      {
        title: '每日固定报件提醒',
        items: [
          '1. 每日互联网简讯（7:30前汇总）',
          '2. 每日网情热点（当日交车班）',
          '3. 舆情预警材料（夜间值班班组初稿核对后发掌广正）'
        ]
      },
      {
        title: '当日值班交接工作',
        items: [
          '1. 近期关注舆情事件。',
          '2. 节假日安保，重点关注交通、公共安全、社会稳定等舆情，以及重要部位、网红景点突发案事件舆情。'
        ]
      }
    ]
  },
  
  // 右侧各个看板的数据
  plates: {
    entityTracking: {
      short: [
        { title: '留置辅警招聘', tag1: '常态', tag2: '网安,总公司领导...', tag1Type: 'normal' }
      ],
      normal: [
        { title: '留置辅警招聘', tag1: '常态', tag2: '网安,总公司领导...', tag1Type: 'normal' },
        { title: '重庆涉灾舆情', tag1: '常态', tag2: '总公司领导,总2...', tag1Type: 'normal' },
        { title: '重庆区划', tag1: '常态', tag2: '总公司领导,总2...', tag1Type: 'normal' }
      ],
      long: [
        { title: '留置辅警招聘', tag1: '常态', tag2: '网安,总公司领导...', tag1Type: 'normal' },
        { title: '重庆涉灾舆情', tag1: '常态', tag2: '总公司领导,总2...', tag1Type: 'normal' },
        { title: '重庆区划', tag1: '常态', tag2: '总公司领导,总2...', tag1Type: 'normal' },
        { title: '侵犯公民个人信息', tag1: '专项', tag2: '总公司领导,总2...', tag1Type: 'special' },
        { title: '高考阅卷防泄密工作跟踪', tag1: '专项', tag2: '网安,总公司领导...', tag1Type: 'special' },
        { title: '网约车司机群体维权风险', tag1: '常态', tag2: '总2,支队...', tag1Type: 'normal' }
      ]
    },
    securityTasks: {
      short: [
        { title: '渝超安保', tag1: '安保', tag2: '总公司领导,总2...', tag1Type: 'security' }
      ],
      normal: [
        { title: '渝超安保', tag1: '安保', tag2: '总公司领导,总2...', tag1Type: 'security' },
        { title: '2026年敏感节点（76）', tag1: '安保', tag2: '总公司领导,总2...', tag1Type: 'security' },
        { title: '2026年敏感节点（75）', tag1: '安保', tag2: '总公司领导,总2...', tag1Type: 'security' }
      ],
      long: [
        { title: '渝超安保', tag1: '安保', tag2: '总公司领导,总2...', tag1Type: 'security' },
        { title: '2026年敏感节点（76）', tag1: '安保', tag2: '总公司领导,总2...', tag1Type: 'security' },
        { title: '2026年敏感节点（75）', tag1: '安保', tag2: '总公司领导,总2...', tag1Type: 'security' },
        { title: '2026年敏感节点（香港）', tag1: '安保', tag2: '总公司领导,总2...', tag1Type: 'security' },
        { title: '迎新春大型灯会安保监测', tag1: '安保', tag2: '网安,总公司领导...', tag1Type: 'security' },
        { title: '外事活动专班联络点布控', tag1: '安保', tag2: '支队,总2...', tag1Type: 'security' }
      ]
    },
    publicOpinion: {
      short: [
        { title: '境外涉渝舆情专项', tag1: '专项', tag2: '总公司领导,总2...', tag1Type: 'special' }
      ],
      normal: [
        { title: '境外涉渝舆情专项', tag1: '专项', tag2: '总公司领导,总2...', tag1Type: 'special' },
        { title: '群众身边不正之风（水电气计费）专项', tag1: '专项', tag2: '总公司领导,总2...', tag1Type: 'special' },
        { title: '网红点重点部位专搜', tag1: '常态', tag2: '总公司领导,总2...', tag1Type: 'normal' }
      ],
      long: [
        { title: '境外涉渝舆情专项', tag1: '专项', tag2: '总公司领导,总2...', tag1Type: 'special' },
        { title: '群众身边不正之风（水电气计费）专项', tag1: '专项', tag2: '总公司领导,总2...', tag1Type: 'special' },
        { title: '网红点重点部位专搜', tag1: '常态', tag2: '总公司领导,总2...', tag1Type: 'normal' },
        { title: '（巡查岗3）涉警专搜', tag1: '常态', tag2: '总公司领导,总2...', tag1Type: 'normal' },
        { title: '涉高考舞弊及枪手中介舆情专搜', tag1: '专项', tag2: '网安,总2...', tag1Type: 'special' }
      ]
    },
    accountTracking: {
      short: [
        { title: '（巡查岗1）境外重点账号动态监测', tag1: '监控', tag2: '网安,总公司领导...', tag1Type: 'special', userIcon: true }
      ],
      normal: [
        { title: '（巡查岗1）境外重点账号动态监测', tag1: '监控', tag2: '网安,总公司领导...', tag1Type: 'special', userIcon: true },
        { title: '（巡查岗1）境外重点人', tag1: '监控', tag2: '网安,总公司领导...', tag1Type: 'special', userIcon: true },
        { title: '境外周刊', tag1: '监控', tag2: '总公司领导,总2...', tag1Type: 'normal' }
      ],
      long: [
        { title: '（巡查岗1）境外重点账号动态监测', tag1: '监控', tag2: '网安,总公司领导...', tag1Type: 'special', userIcon: true },
        { title: '（巡查岗1）境外重点人', tag1: '监控', tag2: '网安,总公司领导...', tag1Type: 'special', userIcon: true },
        { title: '境外周刊', tag1: '监控', tag2: '总公司领导,总2...', tag1Type: 'normal' },
        { title: '打包哥', tag1: '日常', tag2: '总公司领导,总2...', tag1Type: 'normal' },
        { title: '本地民生大V账号矩阵盯控', tag1: '监控', tag2: '网安...', tag1Type: 'special', userIcon: true }
      ]
    }
  }
};

// ==========================================
// 辅助子组件：工作要求卡片
// ==========================================
interface WorkReqCardProps {
  sections: WorkRequirementSection[];
  className?: string;
  style?: React.CSSProperties;
}

const WorkReqCard: React.FC<WorkReqCardProps> = ({ sections, className = '', style }) => {
  return (
    <div 
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-all duration-300 flex flex-col ${className}`}
      style={style}
    >
      <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-sky-500 rounded-full"></span>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">工作要求</h4>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100/50 dark:border-sky-900/30 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-sky-800 dark:text-sky-400">{section.title}</span>
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
            </div>
            <div className="space-y-1.5">
              {section.items.map((item, iIdx) => (
                <p key={iIdx} className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 辅助子组件：常规列表卡片
// ==========================================
interface NormalPlateCardProps {
  title: string;
  items: NormalTaskItem[];
  className?: string;
  style?: React.CSSProperties;
}

const NormalPlateCard: React.FC<NormalPlateCardProps> = ({ title, items, className = '', style }) => {
  return (
    <div 
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-all duration-300 flex flex-col ${className}`}
      style={style}
    >
      <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-sky-500 rounded-full"></span>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{title}</h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-sky-500 hover:underline cursor-pointer">更多</span>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {item.userIcon ? (
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 flex-shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500 flex-shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-350 truncate">{item.title}</span>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                item.tag1Type === 'security' 
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' 
                  : item.tag1Type === 'special'
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              }`}>
                {item.tag1}
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 truncate max-w-[80px]">
                {item.tag2}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 1. Before Component (修改前：呆板等高 / 不等高 1:1:1 排版)
// ==========================================
export const GridAdaptiveBefore: React.FC = () => {
  // 固定采用中等文本，3板块，等宽等高横排 1:1:1
  const reqSections = DATA_TEMPLATES.workRequirements.long;
  const plateBItems = DATA_TEMPLATES.plates.entityTracking.normal;
  const plateCItems = DATA_TEMPLATES.plates.securityTasks.normal;

  return (
    <div className="w-full h-full flex flex-col justify-center p-6 bg-[#f1f5f9] dark:bg-[#0f172a] rounded-2xl">
      <div className="mb-4 text-xs text-slate-500 font-semibold flex items-center gap-1.5">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span>优化前：强制等宽等高 (3列 1:1:1)，工作要求长，任务列表短，造成严重的空间失衡与大片留白</span>
      </div>
      
      {/* 3列等高 */}
      <div className="grid grid-cols-3 gap-5 h-[480px]">
        <WorkReqCard sections={reqSections} className="h-full" />
        <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="h-full" />
        <NormalPlateCard title="安保任务" items={plateCItems} className="h-full" />
      </div>
    </div>
  );
};

// ==========================================
// 2. After Component (优化后：采用混合高度堆叠的完美自适应排版)
// ==========================================
export const GridAdaptiveAfter: React.FC = () => {
  // 同样在中等文本，3板块下，展示“左侧工作要求单独一列，右侧纵向堆叠”的黄金协调比例
  const reqSections = DATA_TEMPLATES.workRequirements.long;
  const plateBItems = DATA_TEMPLATES.plates.entityTracking.normal;
  const plateCItems = DATA_TEMPLATES.plates.securityTasks.normal;

  return (
    <div className="w-full h-full flex flex-col justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-2xl">
      <div className="mb-4 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span>推荐优化方案：空间混合堆叠（左侧工作要求一整列，右侧两板块堆叠为一列，各占1/2高，高度完美均衡）</span>
      </div>
      
      <div className="grid grid-cols-12 gap-5 h-[480px]">
        {/* 左侧工作要求：占 5 列，高度 100% */}
        <div className="col-span-5 h-full">
          <WorkReqCard sections={reqSections} className="h-full border-sky-200/60 dark:border-sky-900/30" />
        </div>
        
        {/* 右侧两块板：占 7 列，纵向堆叠，内部平分高度 */}
        <div className="col-span-7 h-full flex flex-col gap-4">
          <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="flex-1 min-h-[220px]" />
          <NormalPlateCard title="安保任务" items={plateCItems} className="flex-1 min-h-[220px]" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. Playground Component (核心沙盒交互体验)
// ==========================================
export const GridAdaptivePlayground: React.FC = () => {
  // 3.1 状态声明
  const [plateCount, setPlateCount] = useState<number>(3); // 1, 3, 4, 5 个板块
  const [textLength, setTextLength] = useState<'short' | 'normal' | 'long'>('normal'); // 内容长度
  const [layoutMode, setLayoutMode] = useState<string>('stretch-equal'); // 排版方案

  // 3.2 根据文本长度状态，获取对应模拟数据
  const reqSections = DATA_TEMPLATES.workRequirements[textLength === 'short' ? 'short' : textLength === 'normal' ? 'normal' : 'long'];
  const plateBItems = DATA_TEMPLATES.plates.entityTracking[textLength];
  const plateCItems = DATA_TEMPLATES.plates.securityTasks[textLength];
  const plateDItems = DATA_TEMPLATES.plates.publicOpinion[textLength];
  const plateEItems = DATA_TEMPLATES.plates.accountTracking[textLength];

  // 3.3 布局方案渲染器
  const renderLayout = () => {
    // 只有 1 个板块的特殊情况：大概占据 1/2 的板块宽度
    if (plateCount === 1) {
      return (
        <div className="w-full flex justify-start p-4">
          <WorkReqCard sections={reqSections} className="w-[50%] h-[450px]" />
        </div>
      );
    }

    // 方案一：等宽等比 1:1:1 强制等高（Grid Stretch 满高）
    if (layoutMode === 'stretch-equal') {
      if (plateCount === 3) {
        return (
          <div className="grid grid-cols-3 gap-5 h-[480px] w-full">
            <WorkReqCard sections={reqSections} className="h-full" />
            <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="h-full" />
            <NormalPlateCard title="安保任务" items={plateCItems} className="h-full" />
          </div>
        );
      } else if (plateCount === 4) {
        return (
          <div className="grid grid-cols-4 gap-4 h-[480px] w-full">
            <WorkReqCard sections={reqSections} className="h-full" />
            <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="h-full" />
            <NormalPlateCard title="安保任务" items={plateCItems} className="h-full" />
            <NormalPlateCard title="舆情专项专班" items={plateDItems} className="h-full" />
          </div>
        );
      } else {
        // 5 个板块：在等宽等高且要容纳 5 个时，一般会采用第一列工作要求，右侧 2x2 网格。
        return (
          <div className="grid grid-cols-3 gap-5 h-[520px] w-full">
            <WorkReqCard sections={reqSections} className="h-full" />
            <div className="flex flex-col gap-4 h-full">
              <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="flex-1" />
              <NormalPlateCard title="舆情专项专班" items={plateDItems} className="flex-1" />
            </div>
            <div className="flex flex-col gap-4 h-full">
              <NormalPlateCard title="安保任务" items={plateCItems} className="flex-1" />
              <NormalPlateCard title="重点账号动态跟踪" items={plateEItems} className="flex-1" />
            </div>
          </div>
        );
      }
    }

    // 方案二：等宽 1:1:1 + 高度完全自适应 (底部参差不齐)
    if (layoutMode === 'auto-height') {
      const alignClass = 'items-start'; // 不拉伸，高度靠内容决定
      if (plateCount === 3) {
        return (
          <div className={`grid grid-cols-3 gap-5 w-full ${alignClass}`}>
            <WorkReqCard sections={reqSections} className="max-h-[500px]" />
            <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} />
            <NormalPlateCard title="安保任务" items={plateCItems} />
          </div>
        );
      } else if (plateCount === 4) {
        return (
          <div className={`grid grid-cols-4 gap-4 w-full ${alignClass}`}>
            <WorkReqCard sections={reqSections} className="max-h-[500px]" />
            <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} />
            <NormalPlateCard title="安保任务" items={plateCItems} />
            <NormalPlateCard title="舆情专项专班" items={plateDItems} />
          </div>
        );
      } else {
        return (
          <div className={`grid grid-cols-5 gap-3 w-full ${alignClass}`}>
            <WorkReqCard sections={reqSections} className="max-h-[500px]" />
            <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} />
            <NormalPlateCard title="安保任务" items={plateCItems} />
            <NormalPlateCard title="舆情专项专班" items={plateDItems} />
            <NormalPlateCard title="重点账号动态跟踪" items={plateEItems} />
          </div>
        );
      }
    }

    // 方案三：限定卡片最大高度 + 超出可滚动
    if (layoutMode === 'scroll-limit') {
      const fixedHeight = 'h-[360px]';
      if (plateCount === 3) {
        return (
          <div className="grid grid-cols-3 gap-5 w-full">
            <WorkReqCard sections={reqSections} className={fixedHeight} />
            <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className={fixedHeight} />
            <NormalPlateCard title="安保任务" items={plateCItems} className={fixedHeight} />
          </div>
        );
      } else if (plateCount === 4) {
        return (
          <div className="grid grid-cols-4 gap-4 w-full">
            <WorkReqCard sections={reqSections} className={fixedHeight} />
            <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className={fixedHeight} />
            <NormalPlateCard title="安保任务" items={plateCItems} className={fixedHeight} />
            <NormalPlateCard title="舆情专项专班" items={plateDItems} className={fixedHeight} />
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-3 gap-5 w-full">
            <WorkReqCard sections={reqSections} className="h-[480px]" />
            <div className="flex flex-col gap-4 h-[480px]">
              <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="flex-1 h-[230px]" />
              <NormalPlateCard title="舆情专项专班" items={plateDItems} className="flex-1 h-[230px]" />
            </div>
            <div className="flex flex-col gap-4 h-[480px]">
              <NormalPlateCard title="安保任务" items={plateCItems} className="flex-1 h-[230px]" />
              <NormalPlateCard title="重点账号动态跟踪" items={plateEItems} className="flex-1 h-[230px]" />
            </div>
          </div>
        );
      }
    }

    // 方案四：非等比列宽 (工作要求 40%，右侧平分)
    if (layoutMode === 'custom-ratio') {
      if (plateCount === 3) {
        return (
          <div className="grid grid-cols-10 gap-5 h-[480px] w-full">
            <WorkReqCard sections={reqSections} className="col-span-4 h-full" />
            <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="col-span-3 h-full" />
            <NormalPlateCard title="安保任务" items={plateCItems} className="col-span-3 h-full" />
          </div>
        );
      } else if (plateCount === 4) {
        return (
          <div className="grid grid-cols-12 gap-4 h-[480px] w-full">
            <WorkReqCard sections={reqSections} className="col-span-4 h-full" />
            <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="col-span-2.6 h-full" style={{ gridColumn: 'span 2 / span 2' }} />
            <NormalPlateCard title="安保任务" items={plateCItems} className="col-span-2.6 h-full" style={{ gridColumn: 'span 3 / span 3' }} />
            <NormalPlateCard title="舆情专项专班" items={plateDItems} className="col-span-2.6 h-full" style={{ gridColumn: 'span 3 / span 3' }} />
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-12 gap-5 h-[520px] w-full">
            <WorkReqCard sections={reqSections} className="col-span-4 h-full" />
            <div className="col-span-4 flex flex-col gap-4 h-full">
              <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="flex-1" />
              <NormalPlateCard title="舆情专项专班" items={plateDItems} className="flex-1" />
            </div>
            <div className="col-span-4 flex flex-col gap-4 h-full">
              <NormalPlateCard title="安保任务" items={plateCItems} className="flex-1" />
              <NormalPlateCard title="重点账号动态跟踪" items={plateEItems} className="flex-1" />
            </div>
          </div>
        );
      }
    }

    // 方案五 (推荐)：空间折叠混合堆叠
    if (layoutMode === 'hybrid-stack') {
      if (plateCount === 3) {
        return (
          <div className="grid grid-cols-12 gap-5 h-[480px] w-full">
            <WorkReqCard sections={reqSections} className="col-span-5 h-full" />
            <div className="col-span-7 h-full flex flex-col gap-4">
              <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="flex-1" />
              <NormalPlateCard title="安保任务" items={plateCItems} className="flex-1" />
            </div>
          </div>
        );
      } else if (plateCount === 4) {
        return (
          <div className="grid grid-cols-12 gap-5 h-[480px] w-full">
            <WorkReqCard sections={reqSections} className="col-span-4 h-full" />
            <div className="col-span-4 h-full flex flex-col gap-4">
              <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="flex-1" />
              <NormalPlateCard title="安保任务" items={plateCItems} className="flex-1" />
            </div>
            <div className="col-span-4 h-full">
              <NormalPlateCard title="舆情专项专班" items={plateDItems} className="h-full" />
            </div>
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-12 gap-5 h-[520px] w-full">
            <WorkReqCard sections={reqSections} className="col-span-4 h-full" />
            <div className="col-span-4 h-full flex flex-col gap-4">
              <NormalPlateCard title="重大实体事件跟踪" items={plateBItems} className="flex-1" />
              <NormalPlateCard title="舆情专项专班" items={plateDItems} className="flex-1" />
            </div>
            <div className="col-span-4 h-full flex flex-col gap-4">
              <NormalPlateCard title="安保任务" items={plateCItems} className="flex-1" />
              <NormalPlateCard title="重点账号动态跟踪" items={plateEItems} className="flex-1" />
            </div>
          </div>
        );
      }
    }

    return null;
  };

  // 3.4 方案评估文案提示
  const getLayoutEvaluation = () => {
    if (plateCount === 1) {
      return {
        title: "自适应单版块宽度",
        desc: "仅有一个板块时，占据屏幕的 1/2 宽度，既能保留足够的信息呈现宽度，又不会让屏幕过于空旷，属于典型的看板自适应设计规则。",
        status: "success"
      };
    }

    switch (layoutMode) {
      case 'stretch-equal':
        return textLength === 'long' 
          ? {
              title: "方案一：强制等高 (不推荐 🚫)",
              desc: "当“工作要求”字数极多时，其他本就不长的工作板块被迫拉伸出大片的白色‘空腔’，非常不美观，且信息密度极度稀释。",
              status: "error"
            }
          : {
              title: "方案一：强制等高 (一般 ⚠️)",
              desc: "仅在每个卡片内容行数极其相近时勉强协调。但一旦业务数据发生变化，高度差一出现，就会造成巨大的视觉空洞。",
              status: "warning"
            };
      case 'auto-height':
        return {
          title: "方案二：完全自适应高度 (一般 ⚠️)",
          desc: "卡片底部犬牙交错，参差不齐。这会破坏后台控制面板的横向对齐网格线（Grid Line），导致用户的视觉动线被打碎，显得凌乱无章。",
          status: "warning"
        };
      case 'scroll-limit':
        return {
          title: "方案三：固定最大高度 + 滚动 (视场景而定 💬)",
          desc: "高度虽然极其整齐，但当“工作要求”有多条时，用户必须在极小的区域内反复滚动。信息漏看率会成倍上升，对决策效率有负面影响。",
          status: "warning"
        };
      case 'custom-ratio':
        return {
          title: "方案四：非等比列宽 (较推荐 💡)",
          desc: "将“工作要求”这一天然偏重文字的板块列宽调整到 40%，右侧任务列表板块各占 30%。这能用横向空间‘稀释’纵向文字高度，使高度差大大缩小。",
          status: "success"
        };
      case 'hybrid-stack':
        return {
          title: "方案五：空间混合堆叠 (最推荐 👑)",
          desc: "完美解决3个板块的痛点：让长篇幅的‘工作要求’占满一列（高），右侧两块信息量较小的版块纵向堆叠，各占半高。整体高度严丝合缝，既有严谨的对齐网格，又没有无谓的空白浪费！",
          status: "success"
        };
      default:
        return { title: "", desc: "", status: "info" };
    }
  };

  const evaluation = getLayoutEvaluation();

  return (
    <div className="w-full grid lg:grid-cols-12 gap-6 min-h-[580px]">
      {/* 左侧控制台 */}
      <div className="lg:col-span-3 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-sky-500" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">自适应模拟参数</h4>
          </div>

          {/* 1. 板块个数选择 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">选择当前板块数量</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[1, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setPlateCount(num)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                    plateCount === num
                      ? 'bg-sky-500 border-sky-500 text-white shadow-sm shadow-sky-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {num} 个板块 {num === 3 && '(推荐)'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. 文本内容模式 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">板块内容长短模拟</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['short', 'normal', 'long'] as const).map((len) => (
                <button
                  key={len}
                  onClick={() => setTextLength(len)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-medium border transition-all ${
                    textLength === len
                      ? 'bg-sky-500 border-sky-500 text-white shadow-sm shadow-sky-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {len === 'short' ? '极短' : len === 'normal' ? '中等' : '长篇幅'}
                </button>
              ))}
            </div>
          </div>

          {/* 3. 排版方案切换 */}
          {plateCount > 1 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">切换排版实验方案</label>
              <div className="space-y-1.5">
                {[
                  { id: 'stretch-equal', label: '方案一：等宽等比且等高拉伸' },
                  { id: 'auto-height', label: '方案二：等宽且各自高度自适应' },
                  { id: 'scroll-limit', label: '方案三：固定高度 + 局部滚动' },
                  { id: 'custom-ratio', label: '方案四：非等宽列宽 (工作要求占40%)' },
                  { id: 'hybrid-stack', label: '方案五：空间折叠混合堆叠 (推荐)' }
                ].map((plan) => (
                  <label 
                    key={plan.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                      layoutMode === plan.id
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-400 font-semibold'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="layout" 
                      checked={layoutMode === plan.id}
                      onChange={() => setLayoutMode(plan.id)}
                      className="accent-sky-500"
                    />
                    <span>{plan.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 评估面板 */}
        <div className={`mt-5 p-4 rounded-xl border transition-all ${
          evaluation.status === 'success'
            ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
            : evaluation.status === 'warning'
            ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
            : 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
        }`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            {evaluation.status === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : evaluation.status === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            <span className="text-xs font-bold">{evaluation.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">{evaluation.desc}</p>
        </div>
      </div>

      {/* 右侧实时画布预览 */}
      <div className="lg:col-span-9 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 relative flex flex-col justify-start overflow-y-auto max-h-[640px]">
        {/* 背景格线装饰 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none rounded-2xl"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* 顶部控制栏 */}
        <div className="relative z-10 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 mb-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">数据概览</span>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span>今日任务: <strong className="text-slate-800 dark:text-slate-200">45</strong></span>
              <span>重大实体: <strong className="text-slate-800 dark:text-slate-200">8</strong></span>
              <span>安保任务: <strong className="text-slate-800 dark:text-slate-200">5</strong></span>
              <span>工作要求: <strong className="text-slate-800 dark:text-slate-200">4</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[9px] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-bold">7.5事件 核心节点</span>
          </div>
        </div>

        {/* 动态网格区域 */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center">
          {renderLayout()}
        </div>
      </div>
    </div>
  );
};
