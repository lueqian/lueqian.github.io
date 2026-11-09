import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { message } from 'antd';

export interface DirectiveItem {
  id: string;
  eventId: string;
  postTitle?: string;
  platform?: string;
  instructionName: string;
  targetDept: string;
  status: 'pending_sign' | 'signed' | 'failed' | 'feedback';
  errorCode?: string;
  errorMessage?: string;
  remainTime: string;
  issuedTime: string;
  issuer: string;
  requirements: string;
}

export interface SystemNotification {
  id: string;
  type: 'directive_failed' | 'post_alert';
  title: string;
  riskLevel?: '红色' | '蓝色' | '橙色';
  content: string;
  summary?: string;
  account?: string;
  postCount?: number;
  time: string;
  directiveId?: string;
  targetDept?: string;
  isResolved?: boolean;
}

export interface DispatchInfo {
  eventId?: string;
  postTitle?: string;
  platform?: string;
  targetCount: number;
  targetDepts: string[];
  instructionNames: string[];
  status: 'dispatching' | 'success' | 'partial_failure';
}

interface DirectiveContextType {
  directives: DirectiveItem[];
  notifications: SystemNotification[];
  unreadCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  // 重新下发单条指令
  retryDirective: (directiveId: string) => Promise<boolean>;
  // 重新下发多条指令
  batchRetryDirectives: (directiveIds: string[]) => Promise<boolean>;
  // 发起新指令并返回下发结果
  issueNewDirectives: (
    eventId: string,
    instructionNames: string[],
    departments: string[],
    requirements: string,
    simulatePartialFailure?: boolean,
    postInfo?: { postTitle?: string; platform?: string }
  ) => Promise<{ success: boolean; allItems: DirectiveItem[]; failedItems: DirectiveItem[] }>;
  // 消除/解决单条消息
  resolveNotification: (id: string) => void;
  // 设为全部已读
  markAllAsRead: () => void;
  // 右下角浮窗加载状态
  isDispatching: boolean;
  dispatchInfo: DispatchInfo | null;
  dismissDispatchWidget: () => void;
  // 指令下达失败记录弹窗管理（全局常驻入口共享）
  failedModalVisible: boolean;
  openFailedModal: () => void;
  closeFailedModal: () => void;
  // 呼出AI辅助研判弹窗的状态管理（供全局共享）
  aiModalVisible: boolean;
  aiModalEvent: any;
  aiModalMode: 'monitor' | 'emergency';
  openAiModal: (event?: any, mode?: 'monitor' | 'emergency') => void;
  closeAiModal: () => void;
}

const defaultPostTitle = '#盱眙马上真的要命，真的体会到了。';
const defaultPlatform = '抖音app';

const initialDirectives: DirectiveItem[] = [
  {
    id: 'dir-follow-001',
    eventId: '202610150002',
    postTitle: defaultPostTitle,
    platform: defaultPlatform,
    instructionName: '持续关注',
    targetDept: '淮安市',
    status: 'pending_sign',
    remainTime: '剩00天01时00分',
    issuedTime: '2026-10-15 14:45:00',
    issuer: '省厅值班长',
    requirements: '请对涉事舆情保持持续关注与日常巡查',
  },
  {
    id: 'dir-follow-002',
    eventId: '202610150002',
    postTitle: defaultPostTitle,
    platform: defaultPlatform,
    instructionName: '持续关注',
    targetDept: '南京市',
    status: 'pending_sign',
    remainTime: '剩00天01时00分',
    issuedTime: '2026-10-15 14:45:00',
    issuer: '省厅值班长',
    requirements: '请对涉事舆情保持持续关注与日常巡查',
  },
  {
    id: 'dir-follow-003',
    eventId: '202610150002',
    postTitle: defaultPostTitle,
    platform: defaultPlatform,
    instructionName: '持续关注',
    targetDept: '徐州市',
    status: 'failed',
    errorCode: 'ERR_NET_TIMEOUT',
    errorMessage: '徐州市局专网网闸摆渡超时 (504 Gateway Timeout)，指令未能写入目标待办池',
    remainTime: '时效已挂起',
    issuedTime: '2026-10-15 14:45:00',
    issuer: '省厅值班长',
    requirements: '请对涉事舆情保持持续关注与日常巡查',
  },
  {
    id: 'dir-xuyi-001',
    eventId: '202610150002',
    postTitle: defaultPostTitle,
    platform: defaultPlatform,
    instructionName: '帖文处置',
    targetDept: '清江浦区',
    status: 'failed',
    errorCode: 'ERR_NET_TIMEOUT',
    errorMessage: '清江浦区分局专网连接超时 (504 Gateway Timeout)，指令未能写入目标内网待办池',
    remainTime: '剩00天00时57分',
    issuedTime: '2026-10-15 14:42:52',
    issuer: '支队值班岗',
    requirements: '请对帖文展开劝删处置工作',
  },
  {
    id: 'dir-xuyi-002',
    eventId: '202610150002',
    postTitle: defaultPostTitle,
    platform: defaultPlatform,
    instructionName: '帖文处置',
    targetDept: '淮安区',
    status: 'pending_sign',
    remainTime: '剩00天00时57分',
    issuedTime: '2026-10-15 14:42:52',
    issuer: '支队值班岗',
    requirements: '请对帖文展开劝删处置工作',
  },
  {
    id: 'dir-xuyi-003',
    eventId: '202610150002',
    postTitle: defaultPostTitle,
    platform: defaultPlatform,
    instructionName: '帖文处置',
    targetDept: '淮阴区',
    status: 'pending_sign',
    remainTime: '剩00天00时57分',
    issuedTime: '2026-10-15 14:42:52',
    issuer: '支队值班岗',
    requirements: '请对帖文展开劝删处置工作',
  },
  {
    id: 'dir-xuyi-004',
    eventId: '202610150002',
    postTitle: defaultPostTitle,
    platform: defaultPlatform,
    instructionName: '动态监测',
    targetDept: '清江浦区',
    status: 'pending_sign',
    remainTime: '剩00天00时57分',
    issuedTime: '2026-10-15 14:42:52',
    issuer: '支队值班岗',
    requirements: '请对帖文进行舆情监测',
  },
];

const initialNotifications: SystemNotification[] = [
  {
    id: 'notif-failed-001',
    type: 'directive_failed',
    title: '跨租户协同指令推送失败告警',
    riskLevel: '红色',
    content: '您下达的「帖文处置」指令向【清江浦区】内网推送失败，错误码：ERR_NET_TIMEOUT（网闸摆渡超时）。目标内网未送达，对方处置时效已自动挂起。',
    time: '2026/10/15 14:42:53',
    directiveId: 'dir-xuyi-001',
    targetDept: '清江浦区',
    isResolved: false,
  },
  {
    id: 'notif-post-001',
    type: 'post_alert',
    title: '重点源新帖提醒',
    riskLevel: '蓝色',
    content: '小鹏汽车发布会推出全新旗舰 SUV 小鹏 GX',
    account: '新华社（微博）2条',
    postCount: 2,
    time: '2026/10/15 14:42:23',
    isResolved: false,
  },
  {
    id: 'notif-post-002',
    type: 'post_alert',
    title: '重点源新帖提醒',
    riskLevel: '蓝色',
    content: '车内情侣因 KTV 经历发生口角后和解',
    account: '新华社（微博）2条',
    postCount: 2,
    time: '2026/10/15 14:42:17',
    isResolved: false,
  },
  {
    id: 'notif-post-003',
    type: 'post_alert',
    title: '重点源新帖提醒',
    riskLevel: '红色',
    content: '江苏淮安城南街道塑料管道堆场突发火灾',
    account: 'Elon Musk（Twitter）2条、央视新闻（抖音app）2条、人民...',
    postCount: 1403,
    time: '2026/10/15 14:42:15',
    isResolved: false,
  },
];

const DirectiveContext = createContext<DirectiveContextType | undefined>(undefined);

export const DirectiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [directives, setDirectives] = useState<DirectiveItem[]>(initialDirectives);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 右下角小浮窗异步加载状态
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchInfo, setDispatchInfo] = useState<DispatchInfo | null>(null);

  // 指令下达失败记录管理弹窗状态
  const [failedModalVisible, setFailedModalVisible] = useState<boolean>(false);

  // 全局 AI 辅助研判弹窗状态
  const [aiModalVisible, setAiModalVisible] = useState<boolean>(false);
  const [aiModalEvent, setAiModalEvent] = useState<any>(null);
  const [aiModalMode, setAiModalMode] = useState<'monitor' | 'emergency'>('monitor');

  const openAiModal = useCallback((event?: any, mode: 'monitor' | 'emergency' = 'monitor') => {
    setAiModalEvent(event || null);
    setAiModalMode(mode);
    setAiModalVisible(true);
  }, []);

  const closeAiModal = useCallback(() => {
    setAiModalVisible(false);
  }, []);

  const openFailedModal = useCallback(() => {
    setFailedModalVisible(true);
  }, []);

  const closeFailedModal = useCallback(() => {
    setFailedModalVisible(false);
  }, []);

  const dismissDispatchWidget = useCallback(() => {
    setIsDispatching(false);
    setDispatchInfo(null);
  }, []);

  // 重新下发单条指令
  const retryDirective = useCallback(async (directiveId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDirectives((prev) =>
          prev.map((item) => {
            if (item.id === directiveId) {
              return {
                ...item,
                status: 'pending_sign',
                errorCode: undefined,
                errorMessage: undefined,
              };
            }
            return item;
          })
        );

        // 同步清除对应的消息提醒（重新下达成功后，消息提醒自动结束）
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.directiveId === directiveId
              ? { ...notif, isResolved: true }
              : notif
          )
        );

        message.success('指令已成功重新推送到目标单位内网！时效恢复计时。');
        resolve(true);
      }, 1000);
    });
  }, []);

  // 批量重新下发
  const batchRetryDirectives = useCallback(async (directiveIds: string[]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDirectives((prev) =>
          prev.map((item) => {
            if (directiveIds.includes(item.id)) {
              return {
                ...item,
                status: 'pending_sign',
                errorCode: undefined,
                errorMessage: undefined,
              };
            }
            return item;
          })
        );

        // 同步清除消息提醒
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.directiveId && directiveIds.includes(notif.directiveId)
              ? { ...notif, isResolved: true }
              : notif
          )
        );

        message.success(`已成功向 ${directiveIds.length} 个目标内网重新推送指令！`);
        resolve(true);
      }, 1200);
    });
  }, []);

  // 下达新指令（触发右下角轻量非阻塞加载浮窗）
  const issueNewDirectives = useCallback(
    async (
      eventId: string,
      instructionNames: string[],
      departments: string[],
      requirements: string,
      simulatePartialFailure: boolean = true,
      postInfo?: { postTitle?: string; platform?: string }
    ) => {
      const activePostTitle = postInfo?.postTitle || defaultPostTitle;
      const activePlatform = postInfo?.platform || defaultPlatform;

      // 启动右下角浮窗加载动画（优先级较低，不阻断前台操作）
      setIsDispatching(true);
      setDispatchInfo({
        eventId,
        postTitle: activePostTitle,
        platform: activePlatform,
        targetCount: departments.length * instructionNames.length,
        targetDepts: departments,
        instructionNames,
        status: 'dispatching',
      });

      return new Promise<{ success: boolean; allItems: DirectiveItem[]; failedItems: DirectiveItem[] }>(
        (resolve) => {
          setTimeout(() => {
            const now = new Date();
            const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
              now.getDate()
            ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
              2,
              '0'
            )}:${String(now.getSeconds()).padStart(2, '0')}`;

            const generatedItems: DirectiveItem[] = [];
            const failedList: DirectiveItem[] = [];

            departments.forEach((dept, deptIdx) => {
              instructionNames.forEach((instName, instIdx) => {
                const id = `dir-${Date.now()}-${deptIdx}-${instIdx}`;
                // 模拟网络波动：当开启模拟异常时，徐州市或清江浦区推送失败（模拟专网网闸波动）
                const isFail =
                  simulatePartialFailure &&
                  (dept.includes('徐州') || dept.includes('清江浦')) &&
                  (instName.includes('持续关注') || instName.includes('处置'));

                const item: DirectiveItem = {
                  id,
                  eventId,
                  postTitle: activePostTitle,
                  platform: activePlatform,
                  instructionName: instName,
                  targetDept: dept,
                  status: isFail ? 'failed' : 'pending_sign',
                  errorCode: isFail ? 'ERR_NET_TIMEOUT' : undefined,
                  errorMessage: isFail
                    ? `${dept}专网接口超时 (504 Gateway Timeout)，网闸单向摆渡失败`
                    : undefined,
                  remainTime: '剩00天01时00分',
                  issuedTime: timeStr,
                  issuer: '支队值班岗',
                  requirements: requirements || `请对帖文展开${instName}工作`,
                };

                generatedItems.push(item);
                if (isFail) {
                  failedList.push(item);
                }
              });
            });

            // 更新指令列表
            setDirectives((prev) => [...generatedItems, ...prev]);

            // 如果有失败项，写入消息中心通知
            if (failedList.length > 0) {
              const newNotif: SystemNotification = {
                id: `notif-failed-${Date.now()}`,
                type: 'directive_failed',
                title: '跨租户协同指令推送失败告警',
                riskLevel: '红色',
                content: `您下达的「${failedList[0].instructionName}」等指令向【${failedList[0].targetDept}】推送失败，错误码：${failedList[0].errorCode}。目标内网未接收，对方处置时效已挂起。`,
                time: timeStr.replace(/-/g, '/'),
                directiveId: failedList[0].id,
                targetDept: failedList[0].targetDept,
                isResolved: false,
              };
              setNotifications((prev) => [newNotif, ...prev]);

              // 浮窗状态转为部分失败，并自动呼出指令失败大弹窗
              setDispatchInfo((prev) =>
                prev ? { ...prev, status: 'partial_failure' } : null
              );
              setFailedModalVisible(true);
            } else {
              // 状态 1：全部成功，浮窗完成并由全局 Toast 提示指令下达成功，不弹出大弹窗
              setDispatchInfo((prev) => (prev ? { ...prev, status: 'success' } : null));
              message.success('指令下达成功');
              setTimeout(() => {
                setIsDispatching(false);
                setDispatchInfo(null);
              }, 1800);
            }

            resolve({
              success: failedList.length === 0,
              allItems: generatedItems,
              failedItems: failedList,
            });
          }, 1600);
        }
      );
    },
    []
  );

  const resolveNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isResolved: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isResolved: true })));
    message.success('已全部标记为已读');
  }, []);

  const unreadCount = notifications.filter((n) => !n.isResolved).length;

  return (
    <DirectiveContext.Provider
      value={{
        directives,
        notifications,
        unreadCount,
        soundEnabled,
        setSoundEnabled,
        retryDirective,
        batchRetryDirectives,
        issueNewDirectives,
        resolveNotification,
        markAllAsRead,
        isDispatching,
        dispatchInfo,
        dismissDispatchWidget,
        failedModalVisible,
        openFailedModal,
        closeFailedModal,
        aiModalVisible,
        aiModalEvent,
        aiModalMode,
        openAiModal,
        closeAiModal,
      }}
    >
      {children}
    </DirectiveContext.Provider>
  );
};

export const useDirectiveState = () => {
  const context = useContext(DirectiveContext);
  if (!context) {
    throw new Error('useDirectiveState must be used within a DirectiveProvider');
  }
  return context;
};
