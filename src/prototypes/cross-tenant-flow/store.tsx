import React, { createContext, useContext, useState, ReactNode } from 'react';
import { message, notification } from 'antd';
import { PostType, OpinionItem, DisposalTaskItem, SnapshotRecord, DepartmentNode, DeptUserItem } from './types';
import { INITIAL_OPINIONS, INITIAL_DISPOSAL_TASKS, INITIAL_DEPARTMENT_TREE, INITIAL_DEPT_USERS } from './mock-data';

export type MainNavType =
  | 'source_control'
  | 'monitor_warning'
  | 'emergency_response'
  | 'situation_awareness'
  | 'manual_report'
  | 'dept_management';

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

  // 部门管理与用户管理状态
  deptTreeData: DepartmentNode[];
  selectedDeptKey: string;
  selectedDeptName: string;
  deptUsers: DeptUserItem[];
  editDeptModalOpen: boolean;
  editingDeptData: Partial<DepartmentNode> | null;
  editDeptMode: 'edit' | 'add';

  // 部门与用户业务动作
  setSelectedDept: (key: string, name: string) => void;
  openEditDeptModal: (dept?: Partial<DepartmentNode>, mode?: 'edit' | 'add') => void;
  closeEditDeptModal: () => void;
  saveDepartment: (data: Partial<DepartmentNode>) => void;
  deleteDepartment: (deptKey: string) => void;
  toggleAllUsersStatus: (status: '已激活' | '未激活') => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string) => void;
  addUser: (userData: Partial<DeptUserItem>) => void;
  exportInviteCodeUsers: () => void;

  // 业务动作
  submitManualReport: (formData: any) => void;
  approveAndSyncProvince: (
    id: string,
    summary: string,
    suggestions: string,
    levelText?: string,
    stars?: number
  ) => void;
  saveLocalOnly: (id: string) => void;
  dispatchInstruction: (targetUnit: string, instructionTitle: string) => boolean;
  dispatchProvinceInstruction: (
    opinionId: string,
    targetUnit: string,
    directives: string[],
    timeLimit: string,
    directiveRemark: string
  ) => void;
  assignToDistrict: (
    taskId: string,
    districtName: string,
    directives?: string[],
    cityRemark?: string
  ) => void;
  // 本地商采分流动作
  convertToLocalTask: (id: string, policeStation?: string) => void;
  ignoreOpinion: (id: string) => void;
}


export const POST_MAP: Record<PostType, string> = {
  municipal_post: '市局网安支队 - 审核岗 (内网协同视角)',
  province_post: '省厅网安总队 - 指挥岗 (公安内网版)',
  district_gusu_post: '姑苏分局网安大队 - 经办岗 (互联网独立版)',
  district_shuyang_post: '沭阳县局网安大队 - 经办岗 (公安内网未采购版)',
  district_guichi_post: '姑苏分局网安大队 - 经办岗 (互联网独立版)',
  district_susong_post: '沭阳县局网安大队 - 经办岗 (公安内网未采购版)'
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNav] = useState<MainNavType>('dept_management');
  const [currentPost, setCurrentPost] = useState<PostType>('municipal_post');
  const [opinions, setOpinions] = useState<OpinionItem[]>(INITIAL_OPINIONS);
  const [disposalTasks, setDisposalTasks] = useState<DisposalTaskItem[]>(INITIAL_DISPOSAL_TASKS);

  // 部门与用户状态
  const [deptTreeData, setDeptTreeData] = useState<DepartmentNode[]>(INITIAL_DEPARTMENT_TREE);
  const [selectedDeptKey, setSelectedDeptKey] = useState<string>('dept-zhongxian');
  const [selectedDeptName, setSelectedDeptName] = useState<string>('忠县');
  const [deptUsers, setDeptUsers] = useState<DeptUserItem[]>(INITIAL_DEPT_USERS);
  const [editDeptModalOpen, setEditDeptModalOpen] = useState(false);
  const [editingDeptData, setEditingDeptData] = useState<Partial<DepartmentNode> | null>(null);
  const [editDeptMode, setEditDeptMode] = useState<'edit' | 'add'>('edit');

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [currentAiOpinion, setCurrentAiOpinion] = useState<OpinionItem | null>(null);

  const [repeatAlertOpen, setRepeatAlertOpen] = useState(false);
  const [repeatAlertData, setRepeatAlertData] = useState<{
    targetUnit: string;
    instructionName: string;
    issuerDept: string;
    currentProgress: string;
  } | null>(null);

  const setSelectedDept = (key: string, name: string) => {
    setSelectedDeptKey(key);
    setSelectedDeptName(name);
  };

  const openEditDeptModal = (dept?: Partial<DepartmentNode>, mode: 'edit' | 'add' = 'edit') => {
    setEditDeptMode(mode);
    setEditingDeptData(dept || {
      title: '区县分公司',
      phone: '',
      location: '忠县',
      unitType: '区县单位',
      superiorAuditDept: '网安支队',
      requireCityAudit: true
    });
    setEditDeptModalOpen(true);
  };

  const closeEditDeptModal = () => {
    setEditDeptModalOpen(false);
    setEditingDeptData(null);
  };

  const saveDepartment = (data: Partial<DepartmentNode>) => {
    if (editDeptMode === 'edit' && editingDeptData?.key) {
      const updateNode = (nodes: DepartmentNode[]): DepartmentNode[] => {
        return nodes.map((n) => {
          if (n.key === editingDeptData.key) {
            return {
              ...n,
              title: data.title || n.title,
              phone: data.phone !== undefined ? data.phone : n.phone,
              location: data.location !== undefined ? data.location : n.location,
              unitType: data.unitType || n.unitType || '区县单位',
              superiorAuditDept: data.superiorAuditDept || n.superiorAuditDept || '网安支队',
              requireCityAudit: data.requireCityAudit !== undefined ? data.requireCityAudit : n.requireCityAudit
            };
          }
          if (n.children) {
            return { ...n, children: updateNode(n.children) };
          }
          return n;
        });
      };
      setDeptTreeData((prev) => updateNode(prev));
      if (selectedDeptKey === editingDeptData.key && data.title) {
        setSelectedDeptName(data.title);
      }
      message.success(`部门【${data.title}】修改成功`);
    } else {
      const newKey = `dept-${Date.now()}`;
      const newNode: DepartmentNode = {
        key: newKey,
        title: data.title || '新部门',
        phone: data.phone || '',
        location: data.location || '',
        unitType: data.unitType || '区县单位',
        superiorAuditDept: data.superiorAuditDept || '网安支队',
        requireCityAudit: data.requireCityAudit !== undefined ? data.requireCityAudit : true
      };
      const insertNode = (nodes: DepartmentNode[]): DepartmentNode[] => {
        return nodes.map((n) => {
          if (n.key === 'dept-branch' || n.key === selectedDeptKey) {
            return { ...n, children: [...(n.children || []), newNode] };
          }
          if (n.children) {
            return { ...n, children: insertNode(n.children) };
          }
          return n;
        });
      };
      setDeptTreeData((prev) => insertNode(prev));
      message.success(`部门【${data.title}】添加成功`);
    }
    closeEditDeptModal();
  };


  const deleteDepartment = (deptKey: string) => {
    const removeNode = (nodes: DepartmentNode[]): DepartmentNode[] => {
      return nodes
        .filter((n) => n.key !== deptKey)
        .map((n) => (n.children ? { ...n, children: removeNode(n.children) } : n));
    };
    setDeptTreeData((prev) => removeNode(prev));
    message.success('已删除该部门');
  };

  const toggleAllUsersStatus = (status: '已激活' | '未激活') => {
    setDeptUsers((prev) => prev.map((u) => ({ ...u, activeStatus: status })));
    if (status === '已激活') {
      message.success('已一键开启全部用户的激活状态');
    } else {
      message.warning('已一键停用全部用户的激活状态');
    }
  };

  const deleteUser = (id: string) => {
    setDeptUsers((prev) => prev.filter((u) => u.id !== id));
    message.success('用户已成功删除');
  };

  const resetUserPassword = (id: string) => {
    message.success('已重置该用户密码为初始密码 (LanYing@2026)，并已发送短信通知');
  };

  const addUser = (userData: Partial<DeptUserItem>) => {
    const newSerial = deptUsers.length + 1;
    const randomCode = Math.random().toString(36).slice(-6);
    const newUser: DeptUserItem = {
      id: `user-${Date.now()}`,
      serialNumber: newSerial,
      userName: userData.userName || '新民警',
      department: userData.department || selectedDeptName,
      role: userData.role || '区县一体化角色',
      wechatNick: userData.wechatNick || '',
      idCard: userData.idCard || '500233199001010000',
      phone: userData.phone || '13800000000',
      activeStatus: '已激活',
      inviteCode: randomCode
    };
    setDeptUsers((prev) => [...prev, newUser]);
    message.success(`用户【${newUser.userName}】添加成功`);
  };

  const exportInviteCodeUsers = () => {
    message.loading({ content: '正在导出邀请码用户名单 (Excel)...', key: 'exporting' });
    setTimeout(() => {
      message.success({ content: `【${selectedDeptName}】邀请码用户名单导出完成，共 ${deptUsers.length} 条记录`, key: 'exporting' });
    }, 600);
  };


  const switchPost = (post: PostType) => {
    setCurrentPost(post);
    if ((post === 'district_shuyang_post' || post === 'district_susong_post') && activeNav === 'situation_awareness') {
      setActiveNav('monitor_warning');
    }
    message.success(`已切换工作岗位：${POST_MAP[post]}`);
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
      operatorDept: '苏州市姑苏分局',
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
      region: formData.region || '姑苏区',
      platform: (formData.sourcePlatform || '抖音app') as any,
      publishTime: formData.occurTime || nowStr,
      initialResearch: '初研 手工录入',
      aiSummary: formData.initialOpinion || '基层用户手工录入研判线索。',
      aiJudgment: '【事件定性】经基层核查初定为涉稳风险线索。【处置建议】建议属地进一步落地核实。',
      sourceType: '日常上报',
      reportTime: `刚刚 ${nowStr}`,
      reporterUnit: `${formData.region || '姑苏区'} - 【${formData.collector || '王浩'}】`,
      provinceTag: '江苏省',
      cityTag: formData.region || '苏州市',
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
  const approveAndSyncProvince = (
    id: string,
    summary: string,
    suggestions: string,
    levelText?: string,
    stars?: number
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setOpinions((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const finalStars = stars !== undefined ? stars : item.stars;
        const finalLevelText = levelText || item.levelText || '二级 (高)';

        const snapshot1: SnapshotRecord = {
          version: 1,
          versionLabel: '市局审核定稿快照',
          title: item.title,
          sensitivity: `${finalStars}星 (${finalLevelText})`,
          summary: summary || item.aiSummary,
          suggestions: suggestions || '市局网安审核定稿并同步省厅',
          operator: '李警官',
          operatorDept: '市局网安支队审核岗',
          operateTime: nowStr,
          remark: '市局把关核准并同步至省厅内网数据库'
        };

        return {
          ...item,
          auditStatus: '已通过',
          syncToProvince: true,
          firstReportStatus: '全省首报',
          manualOpinion: summary || item.manualOpinion,
          levelText: finalLevelText,
          stars: finalStars,
          snapshots: [...item.snapshots, snapshot1]
        };
      })
    );
    closeAiJudgeModal();
    message.success('审核通过，数据已留存快照并成功同步至省厅内网数据库');
  };

  // 仅保留地市自办
  const saveLocalOnly = (id: string) => {
    setOpinions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, auditStatus: '仅保留地市自办', syncToProvince: false }
          : item
      )
    );
    closeAiJudgeModal();
    message.info('已转为地市自办，数据保留于地市库，不同步省厅');
  };

  // 下达处置指令并做防重排查
  const dispatchInstruction = (targetUnit: string, instructionTitle: string): boolean => {
    // 检查是否命中重复（如果单位包含 昆山 或 江宁，触发指令防重提醒）
    if (targetUnit.includes('昆山') || targetUnit.includes('江宁')) {
      setRepeatAlertData({
        targetUnit: '昆山市公安局',
        instructionName: '关于网络反映某商圈安全隐患情况的核查指令',
        issuerDept: '省厅网安总队',
        currentProgress: '昆山正在办理中（线下核实）'
      });
      setRepeatAlertOpen(true);
      return false;
    }

    message.success(`指令已成功下达至【${targetUnit}】`);
    return true;
  };

  // 省厅网安总队下达处置指令至地市局
  const dispatchProvinceInstruction = (
    opinionId: string,
    targetUnit: string,
    directives: string[],
    timeLimit: string,
    directiveRemark: string
  ) => {
    const instructionCode = 'ZL20260911001';
    setOpinions((prev) =>
      prev.map((item) => {
        if (item.id !== opinionId) return item;
        return {
          ...item,
          statusText: '处置中',
          instructionStatus: `已下发指令 (${targetUnit}处置中)`,
          instructionCode,
          dispatchTargetUnit: targetUnit
        };
      })
    );
    closeAiJudgeModal();
    notification.success({
      message: '指令下达成功',
      description: `指令下达成功，任务单号 ${instructionCode} 已流转至${targetUnit}内网待办`,
      duration: 5,
      placement: 'topRight'
    });
  };

  // 应急处置转派区县
  const assignToDistrict = (
    taskId: string,
    districtName: string,
    directives?: string[],
    cityRemark?: string
  ) => {
    setDisposalTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              assignedToDistrict: districtName,
              assignedStatus: '已转派',
              status: '已处置',
              cityDirectives: directives || t.cityDirectives,
              cityInstructionRemark: cityRemark || t.cityInstructionRemark
            }
          : t
      )
    );
    message.success(`已成功派发指令至【${districtName}】，任务已进入区县核查办理流程`);
  };

  // 转为本地核查工单
  const convertToLocalTask = (id: string, policeStation: string = '城关派出所') => {
    const workOrderCode = 'SY20260911001';
    setOpinions((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          statusText: '处置中',
          localWorkOrderCode: workOrderCode,
          localWorkOrderStatus: `已转为本地核查 (${policeStation}办理中)`
        };
      })
    );
    message.success(`已转为本地核查任务，工单号 ${workOrderCode} 已分派至${policeStation}处置`);
  };

  // 忽略舆情线索
  const ignoreOpinion = (id: string) => {
    setOpinions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isIgnored: true } : item))
    );
    message.info('该线索已标记忽略');
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
        // 部门管理
        deptTreeData,
        selectedDeptKey,
        selectedDeptName,
        deptUsers,
        editDeptModalOpen,
        editingDeptData,
        editDeptMode,
        setSelectedDept,
        openEditDeptModal,
        closeEditDeptModal,
        saveDepartment,
        deleteDepartment,
        toggleAllUsersStatus,
        deleteUser,
        resetUserPassword,
        addUser,
        exportInviteCodeUsers,

        submitManualReport,
        approveAndSyncProvince,
        saveLocalOnly,
        dispatchInstruction,
        dispatchProvinceInstruction,
        assignToDistrict,
        convertToLocalTask,
        ignoreOpinion
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
