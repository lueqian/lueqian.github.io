// src/prototypes/蓝鹰一体化系统/types/scenario.ts

export interface UserStory {
  role: string;       // 角色，如：地市A区县民警
  action: string;     // 诉求，如：发起免审直通报送并联动徐州市局
  value: string;      // 业务价值，如：实现跨地市线索5分钟极速摆渡，无需人工二传
  kpi?: string;       // 关键指标，如：跨网交换时延 ≤ 10s
}

export interface PrdSection {
  preconditions: string[];      // 前置条件
  stateFlow?: {                 // 状态机流转
    from: string;
    to: string;
    trigger: string;
  }[];
  businessRules: {              // 核心规则
    title: string;
    desc: string;
    anchorId?: number;          // 关联的右下角批注序号，如 1、2、4
  }[];
  edgeCases: string[];          // 边界/异常处理
  acceptanceCriteria: string[]; // 验收标准 (QA自测项)
}

export interface ScenarioAnnotation {
  id: number;                   // 对应界面角标编号
  title: string;                // 批注名称
  tag: string;                  // 标签，如：跨租户字典、跨网同步
  desc: string;                 // 批注内容
}

export interface ScenarioStep {
  step: number;
  name: string;
  desc?: string;
  currentRoleView?: string;
}

export interface ScenarioConfig {
  scenarioId: string;           // 场景ID，如：SC-01
  scenarioBadge: string;        // 场景标识，如：场景 01 / 免审直通
  title: string;                // 场景全称
  userStory: UserStory;
  prd: PrdSection;
  steps: ScenarioStep[];
  annotations: ScenarioAnnotation[];
}
