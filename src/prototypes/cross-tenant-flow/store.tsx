import React, { createContext, useContext, useState, ReactNode } from 'react';
import { message, notification } from 'antd';
import { PostType, OpinionItem, DisposalTaskItem, SnapshotRecord } from './types';
import { INITIAL_OPINIONS, INITIAL_DISPOSAL_TASKS } from './mock-data';

export type MainNavType = 'source_control' | 'monitor_warning' | 'emergency_response' | 'situation_awareness' | 'manual_report';

interface AppContextType {
  activeNav: MainNavType;
  setActiveNav: (nav: MainNavType) => void;
  currentPost: PostType;
  switchPost: (post: PostType) => void;
  opinions: OpinionItem[];
  disposalTasks: DisposalTaskItem[];
  
  // 研判与指令弹窗状态
  aiModalOpen: boolean;
  currentAiOpinion: OpinionItem | null;
  openAiJudgeModal: (opinion: OpinionItem) => void;
  closeAiJudgeModal: () => void;

  // 指令重复提醒弹窗
  repeatAlertOpen: boolean;
  setRepeatAlertOpen: (open: boolean) => void;
  repeatAlertData: {
    targetUnit: string;
    instructionName: string;
    issuerDept: string;
    currentProgress: string;
  } | null;

  // 业务动作
  submitManualReport: (formData: any) => void;
  approveAndSyncProvince: (id: string, summary: string, suggestions: string) => void;
  saveLocalOnly: (id: string) => void;
  dispatchInstruction: (targetUnit: string, instructionTitle: string) => boolean;
  assignToDistrict: (taskId: string, districtName: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNav] = useState<MainNavType>('monitor_warning');
  const [currentPost, setCurrentPost] = useState<PostType>('municipal_post');
  const [opinions, setOpinions] = useState<OpinionItem[]>(INITIAL_OPINIONS);
  const [disposalTasks, setDisposalTasks] = useState<DisposalTaskItem[]>(INITIAL_DISPOSAL_TASKS);

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [currentAiOpinion, setCurrentAiOpinion] = useState<OpinionItem | null>(null);

  const [repeatAlertOpen, setRepeatAlertOpen] = useState(false);
  const [repeatAlertData, setRepeatAlertData] = useState<{
    targetUnit: string;
    instructionName: string;
    issuerDept: string;
    currentProgress: string;
  } | null>(null);

  const switchPost = (post: PostType) => {
    setCurrentPost(post);
    const postMap: Record<PostType, string> = {
      district_post: '池州贵池分局-经办岗',
      municipal_post: '池州网安支队-审核岗',
      province_post: '省厅网安总队-指挥岗'
    };
    message.success(`已切换工作岗位：${postMap[post]}`);
  };

  const openAiJudgeModal = (opinion: OpinionItem) => {
    setCurrentAiOpinion(opinion);
    setAiModalOpen(true);
  };

  const closeAiJudgeModal = () => {
    setAiModalOpen(false);
  };

  // 手工上报提交
  const submitManualReport = (formData: any) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newCode = `YQ${Date.now().toString().slice(-8)}`;

    const snapshot0: SnapshotRecord = {
      version: 0,
      versionLabel: '区县初报原始快照',
      title: formData.theme || '手工录入涉案舆情线索',
      sensitivity: `${formData.level || '3'}星`,
      summary: formData.initialOpinion || '基层民警排查发现并报送',
      suggestions: '请市局网安支队协助固证核查。',
      operator: '王浩',
      operatorDept: '池州贵池分局',
      operateTime: nowStr,
      remark: '基层端初报录入封存'
    };

    const newOpinion: OpinionItem = {
      id: `op-${Date.now()}`,
      code: newCode,
      title: formData.theme || '手工录入涉案舆情线索',
      tags: [formData.opinionType || '涉民生舆情', '基层手工上报'],
      isHot: formData.level === '特急' || formData.level === '高',
      stars: formData.level === '特急' ? 5 : 3,
      author: formData.author || '网络发帖人',
      authorId: formData.authorPlatformId || '8839120',
      region: formData.region || '贵池区',
      platform: (formData.sourcePlatform || '抖音app') as any,
      publishTime: formData.occurTime || nowStr,
      initialResearch: '初研 手工录入',
      aiSummary: formData.initialOpinion || '基层用户手工录入研判线索。',
      aiJudgment: '【事件定性】经基层核查初定为涉稳风险线索。【处置建议】建议属地进一步落地核实。',
      sourceType: '日常上报',
      reportTime: `刚刚 ${nowStr}`,
      reporterUnit: `${formData.region || '贵池区'} - 【${formData.collector || '王浩'}】`,
      provinceTag: '安徽省',
      cityTag: formData.region || '池州市',
      categoryTag: formData.opinionType || '公共安全事故',
      statusText: '未处置',
      syncToProvince: !!formData.syncToProvince,
      auditStatus: formData.syncToProvince ? '待审核' : '无须审核',
      firstReportStatus: '全省首报',
      opinionScore: 45.0,
      webIndex: 52,
      ministryIndex: 55,
      snapshots: [snapshot0]
    };

    setOpinions((prev) => [newOpinion, ...prev]);
    message.success('上报成功！已录入系统大池');
    setActiveNav('monitor_warning');
  };

  // 市局把关通过并同步省厅
  const approveAndSyncProvince = (id: string, summary: string, suggestions: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setOpinions((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const snapshot1: SnapshotRecord = {
          version: 1,
          versionLabel: '市局审核定稿快照',
          title: item.title,
          sensitivity: `${item.stars}星`,
          summary: summary || item.aiSummary,
          suggestions: suggestions || '市局网安审核定稿并同步省厅',
          operator: '李警官',
          operatorDept: '市局网安支队',
          operateTime: nowStr,
          remark: '市局把关核准同步省厅内网'
        };

        return {
          ...item,
          auditStatus: '已通过',
          firstReportStatus: '全省首报',
          snapshots: [...item.snapshots, snapshot1]
        };
      })
    );
    closeAiJudgeModal();
    message.success('已留存原始快照，定稿版已同步省厅');
  };

  // 仅本地留存
  const saveLocalOnly = (id: string) => {
    setOpinions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, auditStatus: '已驳回' } : item))
    );
    closeAiJudgeModal();
    message.info('已拦截向省厅推送，数据转为地市私有资产留存');
  };

  // 下达处置指令并做防重排查
  const dispatchInstruction = (targetUnit: string, instructionTitle: string): boolean => {
    // 检查是否命中重复（如果单位包含 忠县，触发指令防重提醒）
    if (targetUnit.includes('忠县')) {
      setRepeatAlertData({
        targetUnit: '忠县公安局',
        instructionName: '关于网络反映被钢管威胁情况的核查指令',
        issuerDept: '省厅网安总队',
        currentProgress: '忠县正在办理中（线下核实）'
      });
      setRepeatAlertOpen(true);
      return false;
    }

    message.success(`指令已成功下达至【${targetUnit}】`);
    return true;
  };

  // 应急处置转派区县
  const assignToDistrict = (taskId: string, districtName: string) => {
    setDisposalTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignedToDistrict: districtName, status: '已处置' } : t))
    );
    message.success(`已成功转派区县承办：${districtName}`);
  };

  return (
    <AppContext.Provider
      value={{
        activeNav,
        setActiveNav,
        currentPost,
        switchPost,
        opinions,
        disposalTasks,
        aiModalOpen,
        currentAiOpinion,
        openAiJudgeModal,
        closeAiJudgeModal,
        repeatAlertOpen,
        setRepeatAlertOpen,
        repeatAlertData,
        submitManualReport,
        approveAndSyncProvince,
        saveLocalOnly,
        dispatchInstruction,
        assignToDistrict
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return context;
};
