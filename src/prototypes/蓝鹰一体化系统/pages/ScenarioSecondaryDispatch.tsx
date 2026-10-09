import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  message,
  Card,
  Row,
  Col,
  Checkbox,
  Tag,
  Badge,
  Modal,
  Drawer,
  Tooltip,
  Alert,
  Space,
  Input,
  DatePicker,
  Select,
  Pagination,
  Switch,
  Segmented,
  Upload,
} from 'antd';
import {
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  RobotOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  ReloadOutlined,
  UpOutlined,
  DownOutlined,
  HolderOutlined,
  CompassOutlined,
  BankOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SendOutlined,
  AuditOutlined,
  FileTextOutlined,
  EditOutlined,
  EyeOutlined,
  ApartmentOutlined,
  UserOutlined,
  BranchesOutlined,
  LockOutlined,
  ShareAltOutlined,
  StarOutlined,
  BellOutlined,
  SearchOutlined,
  CheckSquareOutlined,
  CloseOutlined,
  FormOutlined,
  SecurityScanOutlined,
  SoundOutlined,
  InboxOutlined,
  SkinOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Annotated } from '@/common/Annotation';
import '../scenario-style.css';

const { TextArea } = Input;
const { Option } = Select;

// 角色视角定义
export type UserRoleView = 'cityPolice' | 'countyPolice';

const ScenarioSecondaryDispatch: React.FC = () => {
  // 当前角色视角：'cityPolice' (市局张三·支队值班岗) | 'countyPolice' (区县李四·区县指挥中心岗)
  const [currentRole, setCurrentRole] = useState<UserRoleView>('cityPolice');

  // 当前演练步骤：1 -> 2 -> 3
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 二次指派流转核心状态
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [targetDept, setTargetDept] = useState<string>('徐州市公安局贾汪分局网安大队');
  const [targetPost, setTargetPost] = useState<string>('区县指挥中心岗');
  const [selectedInstructionTypes, setSelectedInstructionTypes] = useState<string[]>([
    '人员落查',
    '信息编报',
  ]);
  const [dispatchComment, setDispatchComment] = useState<string>(
    '请贾汪分局立即核查网民线下动向，反馈核查笔录'
  );
  const [dispatchTimeLimit, setDispatchTimeLimit] = useState<string>('今日17:00前');
  const [dispatchTimestamp, setDispatchTimestamp] = useState<string>('2026-10-09 10:15:20');

  // 区县端办理状态
  const [countySigned, setCountySigned] = useState<boolean>(false);
  const [countySignTime, setCountySignTime] = useState<string>('');
  const [countyFeedbackSubmitted, setCountyFeedbackSubmitted] = useState<boolean>(false);
  const [countyFeedbackText, setCountyFeedbackText] = useState<string>(
    '贾汪网安大队已会同辖区派出所民警上门走访网民王某，经核实其因生活琐事道听途说并发布夸大网帖。已对其进行普法训诫，当事人主动删除原帖并签署保证书，未引发线下聚集。'
  );

  // 弹窗与抽屉控制
  const [dispatchModalOpen, setDispatchModalOpen] = useState<boolean>(false); // 视图 2：二次指派弹窗
  const [countyDetailDrawerOpen, setCountyDetailDrawerOpen] = useState<boolean>(false); // 视图 4：区县任务详情与处置要求
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false); // 区县信息编报/反馈弹窗
  const [logModalOpen, setLogModalOpen] = useState<boolean>(false); // 全流程流转日志

  // 视图检索过滤与 Tab 状态
  const [cityTabKey, setCityTabKey] = useState<string>('todo');
  const [countyTabKey, setCountyTabKey] = useState<string>('todo');
  const [viewMode, setViewMode] = useState<'detail' | 'dispose' | 'brief'>('dispose');
  const [autoAlertSwitch, setAutoAlertSwitch] = useState<boolean>(true);

  // 悬浮演示控制台状态（遵循统一右上角平滑收纳、静默半透明、防溢出安全展开规范）
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [consolePos, setConsolePos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      return { x: Math.max(20, window.innerWidth - 350), y: 84 };
    }
    return { x: 960, y: 84 };
  });
  const [hasCustomPos, setHasCustomPos] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    initX: number;
    initY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    hasMoved: false,
  });

  // 处理控制台拖拽起始
  const handleStartDrag = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, .ant-btn, input, textarea, a, .no-drag')) {
      return;
    }
    e.preventDefault();
    setIsDragging(true);
    const currentActualX = hasCustomPos
      ? consolePos.x
      : Math.max(20, window.innerWidth - 350);
    const currentActualY = hasCustomPos ? consolePos.y : 84;

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentActualX,
      initY: currentActualY,
      hasMoved: false,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - dragInfoRef.current.startX;
      const dy = moveEvent.clientY - dragInfoRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragInfoRef.current.hasMoved = true;
        setHasCustomPos(true);
      }
      const panelWidth = 326;
      const panelHeight = 440;
      const maxX = Math.max(10, window.innerWidth - panelWidth - 24);
      const maxY = Math.max(50, window.innerHeight - panelHeight - 20);

      const nextX = Math.max(10, Math.min(maxX, dragInfoRef.current.initX + dx));
      const nextY = Math.max(50, Math.min(maxY, dragInfoRef.current.initY + dy));
      setConsolePos({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 执行二次指派提交
  const handleConfirmDispatch = () => {
    setIsDispatched(true);
    setDispatchTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    setDispatchModalOpen(false);
    setCurrentStep(3);
    const shortDept = targetDept.includes('贾汪分局') ? '贾汪分局' : targetDept;
    message.success({
      content: `已转派至 [${shortDept}-${targetPost}]`,
      duration: 3,
    });
  };

  // 区县端签收
  const handleCountySign = () => {
    setCountySigned(true);
    setCountySignTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    message.success('已成功签收子任务！状态更新为【已签收】，经办民警已锁定。');
  };

  // 区县端提交信息编报/反馈
  const handleCountyFeedbackSubmit = () => {
    setCountyFeedbackSubmitted(true);
    setFeedbackModalOpen(false);
    setCountyDetailDrawerOpen(false);
    message.success('核查反馈已提交上报！处理成果已同步回传市局网安支队闭环归档。');
  };

  // 重置演练全量状态
  const handleResetWorkflow = () => {
    setIsDispatched(false);
    setCountySigned(false);
    setCountySignTime('');
    setCountyFeedbackSubmitted(false);
    setCurrentRole('cityPolice');
    setCurrentStep(1);
    setCityTabKey('todo');
    setCountyTabKey('todo');
    message.info('场景四全流程状态已重置');
  };

  // =========================================================================
  // 顶部全局 Header 栏（严格 1:1 参考图 1 原生蓝底顶栏排布）
  // =========================================================================
  const renderTopHeader = () => (
    <div
      style={{
        height: 50,
        background: '#0958d9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
      }}
    >
      {/* 左侧品牌与功能 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
          <GlobalOutlined style={{ fontSize: 20 }} />
          <span>舆情一体化智控平台</span>
        </div>
        <Button
          type="text"
          size="small"
          icon={<FormOutlined />}
          style={{
            color: '#ffffff',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 4,
            fontSize: 13,
            padding: '2px 10px',
            height: 28,
          }}
        >
          手工上报
        </Button>
      </div>

      {/* 中间检索栏 (图 1 风格) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 380 }}>
        <Input.Group compact>
          <Select defaultValue="all" size="small" style={{ width: 78 }}>
            <Option value="all">全网</Option>
            <Option value="local">本地</Option>
          </Select>
          <Input
            size="small"
            placeholder="请输入关键词搜索"
            style={{ width: 'calc(100% - 78px)' }}
            suffix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          />
        </Input.Group>
      </div>

      {/* 右侧用户身份与岗位信息 (核心增量：图 1 右上角真实排布) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {currentRole === 'cityPolice' ? (
          <div className="top-user-status-bar">
            <span>欢迎 <strong>张三</strong>！</span>
            <span style={{ opacity: 0.6 }}>|</span>
            <span style={{ cursor: 'pointer' }}>修改密码</span>
            <span style={{ opacity: 0.6 }}>|</span>
            <span style={{ cursor: 'pointer' }}>值班表</span>
            <span style={{ opacity: 0.6 }}>|</span>

            {/* 挂载 AxHub Pin 1: 岗位中介网关 */}
            <Annotated
              id="pin-post-city-gateway"
              pin={1}
              title="中介网关岗位"
              badge="[中介网关岗位]"
              description="该岗位勾选了【跨租户指令接收岗】权限，固定作为市局租户接收省厅跨系统指令的唯一寻址入口，实现人岗解耦。"
            >
              <div className="top-user-post-pill">
                <ApartmentOutlined style={{ color: '#60a5fa' }} />
                <span>岗位：支队值班岗（跨租户指令接收）</span>
              </div>
            </Annotated>
          </div>
        ) : (
          <div className="top-user-status-bar">
            <span>欢迎 <strong>李四</strong>！</span>
            <span style={{ opacity: 0.6 }}>|</span>
            <span style={{ cursor: 'pointer' }}>修改密码</span>
            <span style={{ opacity: 0.6 }}>|</span>
            <span style={{ cursor: 'pointer' }}>值班表</span>
            <span style={{ opacity: 0.6 }}>|</span>
            <div className="top-user-post-pill county">
              <UserOutlined style={{ color: '#34d399' }} />
              <span>岗位：区县指挥中心岗</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
          <Tooltip title="界面换肤">
            <SkinOutlined style={{ fontSize: 16, cursor: 'pointer', opacity: 0.85 }} />
          </Tooltip>
          <Badge dot offset={[-2, 2]}>
            <BellOutlined style={{ fontSize: 16, cursor: 'pointer', color: '#ffffff' }} />
          </Badge>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <UserOutlined style={{ fontSize: 14 }} />
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // 全要素检索筛选栏（严格 1:1 参考图 1 原生表单）
  // =========================================================================
  const renderFilterArea = () => (
    <Card
      size="small"
      style={{
        margin: '14px 20px 10px',
        borderRadius: 6,
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Row gutter={[16, 10]} align="middle">
        <Col span={6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 84, fontSize: 13, color: '#4b5563', whiteSpace: 'nowrap' }}>
              报送信息全文搜
            </span>
            <Input size="small" placeholder="请输入昵称、网址，组合搜索" allowClear />
          </div>
        </Col>
        <Col span={6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 84, fontSize: 13, color: '#4b5563', whiteSpace: 'nowrap' }}>
              指令下发时间
            </span>
            <DatePicker.RangePicker size="small" style={{ width: '100%' }} />
          </div>
        </Col>
        <Col span={6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 84, fontSize: 13, color: '#4b5563', whiteSpace: 'nowrap' }}>
              处置时间
            </span>
            <DatePicker.RangePicker size="small" style={{ width: '100%' }} />
          </div>
        </Col>
        <Col span={6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 84, fontSize: 13, color: '#4b5563', whiteSpace: 'nowrap' }}>
              刊号
            </span>
            <Input size="small" placeholder="输入刊号查询" allowClear />
          </div>
        </Col>

        <Col span={6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 84, fontSize: 13, color: '#4b5563', whiteSpace: 'nowrap' }}>
              已下发指令
            </span>
            <Select size="small" placeholder="请选择" style={{ width: '100%' }} allowClear>
              <Option value="1">人员落查</Option>
              <Option value="2">信息编报</Option>
              <Option value="3">动态监测</Option>
            </Select>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 84, fontSize: 13, color: '#4b5563', whiteSpace: 'nowrap' }}>
              指令状态
            </span>
            <Select size="small" defaultValue="all" style={{ width: '100%' }}>
              <Option value="all">全部</Option>
              <Option value="pending">待处理</Option>
              <Option value="processing">处置中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 84, fontSize: 13, color: '#4b5563', whiteSpace: 'nowrap' }}>
              编号
            </span>
            <Input size="small" placeholder="请输入编号" allowClear />
          </div>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          <Space size={8}>
            <Button size="small">重置</Button>
            <Button size="small" type="primary">
              查询
            </Button>
            <Button type="link" size="small" style={{ fontSize: 12, padding: 0 }}>
              收起 <UpOutlined />
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  // =========================================================================
  // 视图 1：市局端 - 岗位登录与待办认领（参考图 1 改造）
  // =========================================================================
  const renderCityView = () => (
    <div style={{ padding: '0 20px 24px' }}>
      {/* 任务列表头与视图模式 */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '6px 6px 0 0',
          border: '1px solid #e5e7eb',
          borderBottom: 'none',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>任务列表</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch
              size="small"
              checked={autoAlertSwitch}
              onChange={setAutoAlertSwitch}
              style={{ background: autoAlertSwitch ? '#1677ff' : undefined }}
            />
            <span style={{ fontSize: 12, color: '#4b5563' }}>已打开自动消息提醒</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>排序：</span>
          <Select size="small" defaultValue="desc" style={{ width: 140 }}>
            <Option value="desc">指令处理时间降序</Option>
            <Option value="asc">指令处理时间升序</Option>
          </Select>
          <div style={{ display: 'inline-flex', border: '1px solid #d9d9d9', borderRadius: 4 }}>
            <Button
              type={viewMode === 'detail' ? 'primary' : 'text'}
              size="small"
              style={{ borderRadius: '3px 0 0 3px', fontSize: 12 }}
              onClick={() => setViewMode('detail')}
            >
              详细视图
            </Button>
            <Button
              type={viewMode === 'dispose' ? 'primary' : 'text'}
              size="small"
              style={{ borderRadius: 0, fontSize: 12 }}
              onClick={() => setViewMode('dispose')}
            >
              处置视图
            </Button>
            <Button
              type={viewMode === 'brief' ? 'text' : 'text'}
              size="small"
              style={{ borderRadius: '0 3px 3px 0', fontSize: 12 }}
              onClick={() => setViewMode('brief')}
            >
              简要视图
            </Button>
          </div>
        </div>
      </div>

      {/* 二级分类 Tab 栏 */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderTop: '1px solid #f3f4f6',
          borderBottom: 'none',
          padding: '0 18px',
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          height: 42,
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderBottom: cityTabKey === 'todo' ? '2px solid #1677ff' : '2px solid transparent',
            color: cityTabKey === 'todo' ? '#1677ff' : '#4b5563',
            fontWeight: cityTabKey === 'todo' ? 600 : 400,
            fontSize: 13,
            gap: 6,
          }}
          onClick={() => setCityTabKey('todo')}
        >
          <span>待处理</span>
          <Badge count={isDispatched ? 0 : 1} style={{ backgroundColor: '#ff4d4f' }} />
        </div>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderBottom: cityTabKey === 'processing' ? '2px solid #1677ff' : '2px solid transparent',
            color: cityTabKey === 'processing' ? '#1677ff' : '#4b5563',
            fontWeight: cityTabKey === 'processing' ? 600 : 400,
            fontSize: 13,
            gap: 6,
          }}
          onClick={() => setCityTabKey('processing')}
        >
          <span>已处理 (6)</span>
        </div>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderBottom: cityTabKey === 'report' ? '2px solid #1677ff' : '2px solid transparent',
            color: cityTabKey === 'report' ? '#1677ff' : '#4b5563',
            fontWeight: cityTabKey === 'report' ? 600 : 400,
            fontSize: 13,
            gap: 6,
          }}
          onClick={() => setCityTabKey('report')}
        >
          <span>信息编报 (9)</span>
          <Badge count={3} style={{ backgroundColor: '#ff4d4f' }} />
        </div>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderBottom: cityTabKey === 'dispatched' ? '2px solid #1677ff' : '2px solid transparent',
            color: cityTabKey === 'dispatched' ? '#1677ff' : '#4b5563',
            fontWeight: cityTabKey === 'dispatched' ? 600 : 400,
            fontSize: 13,
          }}
          onClick={() => setCityTabKey('dispatched')}
        >
          <span>已下发子任务 ({isDispatched ? 1 : 0})</span>
        </div>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: '#4b5563',
            fontSize: 13,
          }}
          onClick={() => setCityTabKey('all')}
        >
          <span>全部</span>
        </div>
      </div>

      {/* 任务列表主体 */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e5e7eb',
          borderRadius: '0 0 6px 6px',
          padding: 16,
        }}
      >
        {/* 卡片 1：来自省厅直达、当前处于处置中待二次指派的核心母任务 */}
        <div className="emergency-task-card-v5">
          {/* 标题行 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox />
              <span style={{ color: '#1677ff', fontWeight: 600, fontSize: 13 }}>1</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                #徐州某工业园区网络谣言线索排查
              </span>
              <Tag color="processing" style={{ fontWeight: 600, borderRadius: 4 }}>
                [省厅下发]
              </Tag>
              {isDispatched ? (
                <Tag color="cyan" icon={<BranchesOutlined />} style={{ fontWeight: 600, borderRadius: 4 }}>
                  已二次转派贾汪大队
                </Tag>
              ) : (
                <Tag color="blue" style={{ fontWeight: 500, borderRadius: 4 }}>
                  处置中（已签收）
                </Tag>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#d1d5db', fontSize: 14 }}>
              <StarOutlined />
              <StarOutlined />
              <StarOutlined />
              <StarOutlined />
              <StarOutlined />
              <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>0星</span>
            </div>
          </div>

          {/* 任务编号 */}
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
            编号 202610090018
          </div>

          {/* AI 摘要与研判条 */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
              borderRadius: 6,
              padding: '8px 12px',
              marginBottom: 10,
              fontSize: 13,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <Tag color="success" style={{ borderRadius: 10, fontSize: 11, padding: '0 8px' }}>
                AI 摘要
              </Tag>
              <span style={{ color: '#374151', lineHeight: 1.5 }}>
                网民反映徐州贾汪工业园区存在企业违规排污与安全隐患，已引发 1200+ 转发讨论，存在不实谣言煽动与线下集聚风险。
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Tag color="warning" style={{ borderRadius: 10, fontSize: 11, padding: '0 8px' }}>
                AI 研判
              </Tag>
              <span style={{ color: '#4b5563', lineHeight: 1.5 }}>
                涉事属地为贾汪区，建议市局网安支队立即指派贾汪分局大队警力落地查访发帖人，开展核查辟谣。
              </span>
            </div>
          </div>

          {/* 任务流转条 (1:1 参考图 1 原生卡片排布) */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="capsule-task-type">落地核查</span>
              <span className="countdown-pill-urgent">
                <ClockCircleOutlined /> 剩余 03小时45分
              </span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                经办人：<strong>张三 (支队值班岗)</strong>
              </span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>|</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>签收时间：2026-10-09 09:30:15</span>
              {isDispatched && (
                <Tag color="green" style={{ marginLeft: 8 }}>
                  子任务已路由至：贾汪分局网安大队 [区县指挥中心岗]
                </Tag>
              )}
            </div>

            {/* 核心操作按钮 */}
            <div>
              {!isDispatched ? (
                <Button
                  type="primary"
                  icon={<BranchesOutlined />}
                  style={{
                    borderRadius: 4,
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(22, 119, 255, 0.3)',
                  }}
                  onClick={() => setDispatchModalOpen(true)}
                >
                  二次指派区县
                </Button>
              ) : (
                <Space size={8}>
                  <Button
                    style={{
                      borderRadius: 4,
                      background: '#e6f7ff',
                      borderColor: '#91d5ff',
                      color: '#0958d9',
                    }}
                    onClick={() => {
                      setCurrentRole('countyPolice');
                      setCurrentStep(3);
                      message.info('已快速切换至【区县视角 (区县指挥中心岗)】');
                    }}
                  >
                    前往区县端查看接收 <ArrowRightOutlined />
                  </Button>
                  <Button size="small" onClick={() => setDispatchModalOpen(true)}>
                    调整指派
                  </Button>
                </Space>
              )}
            </div>
          </div>

          {/* 底栏辅助操作 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
            <Button size="small" type="text" style={{ fontSize: 12, color: '#4b5563' }}>
              未处置
            </Button>
            <Button
              size="small"
              type="text"
              style={{ fontSize: 12, color: '#1677ff' }}
              onClick={() => setLogModalOpen(true)}
            >
              流转日志
            </Button>
            <Button
              size="small"
              type="text"
              icon={<RobotOutlined style={{ color: '#fa8c16' }} />}
              style={{ fontSize: 12, color: '#fa8c16' }}
              onClick={() => setDispatchModalOpen(true)}
            >
              AI 辅助研判
            </Button>
          </div>
        </div>

        {/* 辅助卡片 2 (增加列表真实质感) */}
        <div className="emergency-task-card-v5" style={{ opacity: 0.85 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox disabled />
              <span style={{ color: '#9ca3af', fontSize: 13 }}>2</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#4b5563' }}>
                #铜山区某高校后勤舆情动态监测
              </span>
              <Tag style={{ borderRadius: 4 }}>[本地自发]</Tag>
              <Tag color="default" style={{ borderRadius: 4 }}>
                已处置
              </Tag>
            </div>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>编号 202610080042</span>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            已由铜山分局完成现场核查，学生诉求已妥善化解，未引发次生炒作。
          </div>
        </div>

        {/* 分页控制 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
          <Pagination size="small" total={2} current={1} pageSize={10} showTotal={(total) => `共 ${total} 条`} />
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // 视图 3：区县端 - 切换基层岗位与待办接收（参考图 1 改造，带层级脱敏）
  // =========================================================================
  const renderCountyView = () => (
    <div style={{ padding: '0 20px 24px' }}>
      {/* 任务列表头与视图模式 */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '6px 6px 0 0',
          border: '1px solid #e5e7eb',
          borderBottom: 'none',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>基层处置待办列表</span>
          <Tag color="cyan" style={{ borderRadius: 12, fontSize: 12 }}>
            贾汪分局网安大队
          </Tag>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch size="small" defaultChecked />
            <span style={{ fontSize: 12, color: '#4b5563' }}>已打开自动消息提醒</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>排序：</span>
          <Select size="small" defaultValue="desc" style={{ width: 140 }}>
            <Option value="desc">指令处理时间降序</Option>
            <Option value="asc">指令处理时间升序</Option>
          </Select>
          <div style={{ display: 'inline-flex', border: '1px solid #d9d9d9', borderRadius: 4 }}>
            <Button type="text" size="small">
              详细视图
            </Button>
            <Button type="primary" size="small">
              处置视图
            </Button>
            <Button type="text" size="small">
              简要视图
            </Button>
          </div>
        </div>
      </div>

      {/* 二级分类 Tab 栏 */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderTop: '1px solid #f3f4f6',
          borderBottom: 'none',
          padding: '0 18px',
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          height: 42,
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderBottom: countyTabKey === 'todo' ? '2px solid #1677ff' : '2px solid transparent',
            color: countyTabKey === 'todo' ? '#1677ff' : '#4b5563',
            fontWeight: countyTabKey === 'todo' ? 600 : 400,
            fontSize: 13,
            gap: 6,
          }}
          onClick={() => setCountyTabKey('todo')}
        >
          <span>待处理</span>
          <Badge count={countyFeedbackSubmitted ? 0 : 1} style={{ backgroundColor: '#ff4d4f' }} />
        </div>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: '#4b5563',
            fontSize: 13,
          }}
          onClick={() => setCountyTabKey('processed')}
        >
          <span>已处理 ({countyFeedbackSubmitted ? 7 : 6})</span>
        </div>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: '#4b5563',
            fontSize: 13,
            gap: 6,
          }}
          onClick={() => setCountyTabKey('report')}
        >
          <span>信息编报 (9)</span>
          <Badge count={3} style={{ backgroundColor: '#ff4d4f' }} />
        </div>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: '#4b5563',
            fontSize: 13,
          }}
          onClick={() => setCountyTabKey('all')}
        >
          <span>全部</span>
        </div>
      </div>

      {/* 区县任务列表容器 */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e5e7eb',
          borderRadius: '0 0 6px 6px',
          padding: 16,
        }}
      >
        {!isDispatched ? (
          <Card style={{ textAlign: 'center', padding: '40px 0', borderRadius: 6 }}>
            <InboxOutlined style={{ fontSize: 44, color: '#bfbfbf', marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>
              暂无待办子任务
            </div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
              市局网安支队尚未向【贾汪分局-区县指挥中心岗】二次下发指令。
            </div>
            <Button
              type="primary"
              onClick={() => {
                setCurrentRole('cityPolice');
                setCurrentStep(2);
                setDispatchModalOpen(true);
              }}
            >
              返回市局视角并发起二次指派
            </Button>
          </Card>
        ) : (
          <div className="emergency-task-card-v5">
            {/* 头部标题与脱敏标签展示（核心规范） */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Checkbox />
                <span style={{ color: '#1677ff', fontWeight: 600, fontSize: 13 }}>1</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                  #徐州某工业园区网络谣言线索排查
                </span>

                {/* 挂载 AxHub Pin 3: 层级敏感标识脱敏 */}
                <Annotated
                  id="pin-desensitized-label"
                  pin={3}
                  title="层级敏感标识脱敏"
                  badge="[层级敏感脱敏]"
                  description="下发至基层时屏蔽上层来源，消除越级指挥歧义，基层仅对直接上级市局支队负责。"
                >
                  <Tag color="blue" icon={<SecurityScanOutlined />} style={{ fontWeight: 600, borderRadius: 4 }}>
                    [市局交办]
                  </Tag>
                </Annotated>

                <Tag color="cyan" style={{ borderRadius: 4 }}>
                  [上级网安部门下发]
                </Tag>
                {countyFeedbackSubmitted ? (
                  <Tag color="success" style={{ fontWeight: 600, borderRadius: 4 }}>
                    已完成（反馈已上报）
                  </Tag>
                ) : countySigned ? (
                  <Tag color="processing" style={{ fontWeight: 600, borderRadius: 4 }}>
                    已签收办理中
                  </Tag>
                ) : (
                  <Tag color="warning" style={{ fontWeight: 600, borderRadius: 4 }}>
                    待签收认领
                  </Tag>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#d1d5db', fontSize: 14 }}>
                <StarOutlined />
                <StarOutlined />
                <StarOutlined />
                <StarOutlined />
                <StarOutlined />
                <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>0星</span>
              </div>
            </div>

            {/* 子任务编号与脱敏来源说明 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
              <span>子任务编号：<strong>202610090018-SUB01</strong></span>
              <span>下发来源：<strong>徐州市公安局网安支队</strong></span>
              <span>下发时间：{dispatchTimestamp}</span>
            </div>

            {/* 市局下达批示要求展示块 */}
            <div
              style={{
                background: '#fffbe6',
                border: '1px solid #ffe58f',
                borderRadius: 6,
                padding: '10px 14px',
                marginBottom: 10,
                fontSize: 13,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#d48806', marginBottom: 4 }}>
                <SoundOutlined />
                <span>市局支队批示指示要求：</span>
              </div>
              <div style={{ color: '#873800', lineHeight: 1.6, paddingLeft: 18 }}>
                {dispatchComment}
              </div>
            </div>

            {/* 任务状态胶囊行 (1:1 复刻图 1) */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="capsule-task-type">人员落查</span>
                <span className="capsule-task-type" style={{ background: '#13c2c2' }}>
                  信息编报
                </span>
                <span className="capsule-task-remain-urgent">
                  <ClockCircleOutlined /> 剩余 02小时15分
                </span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>
                  经办责任人：<strong>李四 (区县指挥中心岗)</strong>
                </span>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>|</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>
                  状态：{countySigned ? `已签收 (${countySignTime || '2026-10-09 10:16:00'})` : '待签收'}
                </span>
              </div>

              {/* 操作列按钮 (1:1 还原图 1 按钮形态) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!countySigned ? (
                  <Button
                    type="primary"
                    style={{ borderRadius: 4, fontWeight: 600 }}
                    onClick={handleCountySign}
                  >
                    签收办理
                  </Button>
                ) : (
                  <>
                    <Button
                      style={{
                        borderRadius: 4,
                        background: '#f0f5ff',
                        borderColor: '#adc6ff',
                        color: '#2f54eb',
                        fontSize: 12,
                      }}
                      disabled
                    >
                      已签收
                    </Button>
                    <Button
                      style={{
                        borderRadius: 4,
                        background: '#52c41a',
                        borderColor: '#52c41a',
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                      onClick={() => setFeedbackModalOpen(true)}
                    >
                      信息编报/反馈
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* 底栏辅助操作 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
              <Button size="small" type="text" style={{ fontSize: 12, color: '#4b5563' }}>
                未处置
              </Button>
              <Button
                size="small"
                type="text"
                style={{ fontSize: 12, color: '#1677ff' }}
                onClick={() => setCountyDetailDrawerOpen(true)}
              >
                信息详情
              </Button>
              <Button
                size="small"
                type="text"
                icon={<RobotOutlined style={{ color: '#fa8c16' }} />}
                style={{ fontSize: 12, color: '#fa8c16' }}
                onClick={() => setCountyDetailDrawerOpen(true)}
              >
                AI 辅助研判
              </Button>
            </div>
          </div>
        )}

        {/* 历史示例卡片 */}
        <div className="emergency-task-card-v5" style={{ opacity: 0.8, marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox disabled />
              <span style={{ color: '#9ca3af', fontSize: 13 }}>2</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#4b5563' }}>
                #贾汪潘安湖景区网民咨询答疑
              </span>
              <Tag style={{ borderRadius: 4 }}>[市局交办]</Tag>
              <Tag color="success" style={{ borderRadius: 4 }}>
                已完成
              </Tag>
            </div>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>编号 202610070019</span>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            文旅部门已及时公开回复，网帖已下沉，处置完毕。
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
          <Pagination size="small" total={2} current={1} pageSize={10} showTotal={(total) => `共 ${total} 条`} />
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // 视图 2：市局端 - 指令二次指派独立极简弹窗 (720px 核心四要素)
  // =========================================================================
  const renderSecondDispatchModal = () => (
    <Modal
      open={dispatchModalOpen}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600 }}>
          <BranchesOutlined style={{ color: '#1677ff' }} />
          <span>指令二次指派</span>
        </div>
      }
      width={720}
      style={{ top: 60 }}
      footer={[
        <Button key="cancel" onClick={() => setDispatchModalOpen(false)}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          style={{ background: '#1677ff', borderColor: '#1677ff', fontWeight: 500 }}
          onClick={handleConfirmDispatch}
        >
          确认二次转派
        </Button>,
      ]}
      onCancel={() => setDispatchModalOpen(false)}
      destroyOnClose
    >
      {/* 顶部关联舆情信息提示栏 */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: '10px 14px',
          marginBottom: 18,
          fontSize: 13,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: '#111827' }}>
            关联舆情：#徐州某工业园区网络谣言线索排查
          </span>
          <Tag color="blue" style={{ borderRadius: 4 }}>省厅指令</Tag>
        </div>
        <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
          涉事属地：江苏省徐州市贾汪区 ｜ 原发平台：微博 ｜ 涉事账号：网民王某
        </div>
      </div>

      {/* 核心“转派四要素”表单（挂载 AxHub Pin 2 本地组织架构路由） */}
      <Annotated
        id="pin-second-dispatch-routing"
        pin={2}
        title="本地组织架构路由"
        badge="[本地组织路由]"
        description="二次指派彻底回归地市本地组织与岗位字典，将母任务拆解为本地子任务并精准路由至基层值班人员。"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0' }}>
          {/* 1. 目标单位 */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>目标单位：
            </div>
            <Select
              value={targetDept}
              onChange={setTargetDept}
              style={{ width: '100%' }}
              placeholder="请选择目标区县部门单位"
            >
              <Option value="徐州市公安局贾汪分局网安大队">
                徐州市公安局贾汪分局网安大队（属地管辖）
              </Option>
              <Option value="徐州市公安局鼓楼分局网安大队">徐州市公安局鼓楼分局网安大队</Option>
              <Option value="徐州市公安局云龙分局网安大队">徐州市公安局云龙分局网安大队</Option>
              <Option value="徐州市公安局泉山分局网安大队">徐州市公安局泉山分局网安大队</Option>
              <Option value="徐州市公安局铜山分局网安大队">徐州市公安局铜山分局网安大队</Option>
            </Select>
          </div>

          {/* 2. 接收岗位 */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>接收岗位：
            </div>
            <Select
              value={targetPost}
              onChange={setTargetPost}
              style={{ width: '100%' }}
              placeholder="请选择基层接收岗位"
            >
              <Option value="区县指挥中心岗">区县指挥中心岗</Option>
              <Option value="落地核查岗">落地核查岗</Option>
            </Select>
          </div>

          {/* 3. 市局批示 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>市局批示：
              </span>
              <span
                style={{ color: '#1677ff', fontSize: 12, cursor: 'pointer' }}
                onClick={() =>
                  setDispatchComment('请贾汪分局立即核查网民线下动向，反馈核查笔录')
                }
              >
                重置为标准批示
              </span>
            </div>
            <TextArea
              rows={4}
              value={dispatchComment}
              onChange={(e) => setDispatchComment(e.target.value)}
              placeholder="请输入明确具体的处置指导意见与核查要求..."
            />
          </div>

          {/* 4. 处置时效 */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>处置时效：
            </div>
            <Space size={10}>
              {[
                { label: '4小时内', value: '4小时内' },
                { label: '今日17:00前', value: '今日17:00前' },
                { label: '24小时内', value: '24小时内' },
              ].map((item) => {
                const isSelected = dispatchTimeLimit === item.value;
                return (
                  <div
                    key={item.value}
                    onClick={() => setDispatchTimeLimit(item.value)}
                    style={{
                      padding: '4px 16px',
                      borderRadius: 16,
                      fontSize: 13,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #1677ff' : '1px solid #d9d9d9',
                      background: isSelected ? '#e6f4ff' : '#ffffff',
                      color: isSelected ? '#1677ff' : '#595959',
                      fontWeight: isSelected ? 600 : 400,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </div>
                );
              })}
            </Space>
          </div>
        </div>
      </Annotated>
    </Modal>
  );

  // =========================================================================
  // 视图 4：区县端 - 任务详情与处置要求查看 (Drawer)
  // =========================================================================
  const renderCountyDetailDrawer = () => (
    <Drawer
      open={countyDetailDrawerOpen}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined style={{ color: '#1677ff' }} />
          <span>基层任务详情：关于贾汪工业园区网络谣言核查</span>
          <Tag color="blue">[市局交办]</Tag>
        </div>
      }
      width={720}
      onClose={() => setCountyDetailDrawerOpen(false)}
      extra={
        <Space>
          <Button
            type="primary"
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => {
              setCountyDetailDrawerOpen(false);
              setFeedbackModalOpen(true);
            }}
          >
            去填写反馈报告
          </Button>
        </Space>
      }
    >
      {/* 上级批示指示专区 */}
      <Alert
        message="市局网安支队 指令批示要求"
        description={
          <div style={{ fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>
            {dispatchComment}
          </div>
        }
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div className="section-sub-title">任务基本要素（已脱敏）</div>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, marginBottom: 16 }}>
        <Row gutter={[16, 10]}>
          <Col span={12}>
            <span style={{ color: '#6b7280' }}>下发单位：</span>
            <strong>徐州市公安局网安支队</strong>
          </Col>
          <Col span={12}>
            <span style={{ color: '#6b7280' }}>下发时间：</span>
            <span>{dispatchTimestamp}</span>
          </Col>
          <Col span={12}>
            <span style={{ color: '#6b7280' }}>目标承办部门：</span>
            <strong>徐州市公安局贾汪分局网安大队</strong>
          </Col>
          <Col span={12}>
            <span style={{ color: '#6b7280' }}>目标承办岗位：</span>
            <Tag color="cyan">区县指挥中心岗</Tag>
          </Col>
          <Col span={12}>
            <span style={{ color: '#6b7280' }}>任务指令类型：</span>
            <span>人员落查、信息编报</span>
          </Col>
          <Col span={12}>
            <span style={{ color: '#6b7280' }}>处置时效：</span>
            <span style={{ color: '#cf1322', fontWeight: 600 }}>剩余 02小时15分 (今日 17:00 截止)</span>
          </Col>
        </Row>
      </div>

      <div className="section-sub-title">原始涉事线索摘录</div>
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: 12, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        <div style={{ fontWeight: 600, color: '#111827', marginBottom: 4 }}>
          原发网帖：微博《关于徐州贾汪某工业园区空气刺鼻与排污质疑》
        </div>
        <div style={{ color: '#4b5563' }}>
          发帖网民王某称园区部分车间夜间存在暗管排污，造成周边小区居民头晕不适，呼吁群众共同前往管委会讨要说法。
        </div>
      </div>

      <div className="section-sub-title">落地处置指引建议</div>
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: 12, fontSize: 12, color: '#166534', lineHeight: 1.6 }}>
        1. 立即联合属地派出所开展线下走访，核实当事人真实诉求；<br />
        2. 查证是否存在环保实情，若属环保投诉则协调环保专班回应，若属故意造谣则予以训诫劝删；<br />
        3. 形成《落地核查笔录》并拍摄现场照片存证入库。
      </div>
    </Drawer>
  );

  // =========================================================================
  // 区县端信息编报 / 反馈报告弹窗 (闭环回传市局)
  // =========================================================================
  const renderCountyFeedbackModal = () => (
    <Modal
      open={feedbackModalOpen}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FormOutlined style={{ color: '#52c41a' }} />
          <span>信息编报与处置反馈（贾汪分局网安大队）</span>
        </div>
      }
      width={720}
      onCancel={() => setFeedbackModalOpen(false)}
      footer={[
        <Button key="back" onClick={() => setFeedbackModalOpen(false)}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          style={{ background: '#52c41a', borderColor: '#52c41a' }}
          onClick={handleCountyFeedbackSubmit}
        >
          提交反馈并同步市局
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
          反馈报告标题：
        </div>
        <Input defaultValue="【反馈】关于贾汪工业园区网络谣言线索核查处置情况报告" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
          <span>线下核查与处置成果说明：</span>
          <Button type="link" size="small" icon={<RobotOutlined />} style={{ padding: 0 }}>
            AI 辅助润色
          </Button>
        </div>
        <TextArea
          rows={5}
          value={countyFeedbackText}
          onChange={(e) => setCountyFeedbackText(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
          核查佐证附件：
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Tag color="green" style={{ padding: '4px 10px', borderRadius: 4 }}>
            📎 走访核查笔录_王某.pdf
          </Tag>
          <Tag color="green" style={{ padding: '4px 10px', borderRadius: 4 }}>
            📎 悔过删除承诺书.jpg
          </Tag>
        </div>
      </div>

      <Alert
        message="提交说明"
        description="提交后，处置结果将沿原路由链路回传至市局网安支队【支队值班岗】，母任务将变更为【子任务已办结】，实现全流程闭环。"
        type="info"
        showIcon
      />
    </Modal>
  );

  // =========================================================================
  // 全链路流转日志查看弹窗
  // =========================================================================
  const renderLogModal = () => (
    <Modal
      open={logModalOpen}
      title="全流程流转与审计日志"
      width={640}
      footer={[
        <Button key="close" onClick={() => setLogModalOpen(false)}>
          关闭
        </Button>,
      ]}
      onCancel={() => setLogModalOpen(false)}
    >
      <div style={{ padding: '8px 0' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Tag color="blue" style={{ height: 22 }}>10:15:20</Tag>
          <div>
            <strong>二次指派下发</strong>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              经办人 [张三(支队值班岗)] 成功二次指派至 [徐州市公安局贾汪分局网安大队 - 区县指挥中心岗]
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Tag color="cyan" style={{ height: 22 }}>09:30:15</Tag>
          <div>
            <strong>市局认领待办</strong>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              市局民警 [张三(支队值班岗)] 成功签收来自省厅总队的跨租户落地核查指令（版本号 v1 → v2）
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Tag color="geekblue" style={{ height: 22 }}>09:15:00</Tag>
          <div>
            <strong>省厅指令下发</strong>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              省厅网安总队通过载荷自描述包将指令安全投递至徐州市局网安支队中介网关岗位
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );

  // =========================================================================
  // 悬浮导引控制台 (统一轻量高质感规范 · 场景四)
  // =========================================================================
  const renderFloatingGuideConsole = () => {
    return (
      <div
        className={`scenario-guide-console ${consoleCollapsed ? 'collapsed' : ''} ${isDragging ? 'is-dragging' : ''}`}
        style={
          hasCustomPos && !consoleCollapsed
            ? { left: consolePos.x, top: consolePos.y, right: 'auto' }
            : { right: 24, top: 84 }
        }
      >
        {consoleCollapsed ? (
          <Tooltip title="点击展开二次转派指引面板" placement="left">
            <div
              className="scenario-guide-ball-inner"
              onClick={() => {
                setConsoleCollapsed(false);
                setHasCustomPos(false);
              }}
            >
              <CompassOutlined style={{ fontSize: 20 }} />
              <span className="guide-ball-badge">
                {currentRole === 'cityPolice' && !isDispatched
                  ? '1/3'
                  : currentRole === 'cityPolice'
                  ? '2/3'
                  : countyFeedbackSubmitted
                  ? '3/3 ✓'
                  : '3/3'}
              </span>
            </div>
          </Tooltip>
        ) : (
          <div className="guide-console-full-content">
            {/* 头部 */}
            <div className="guide-console-header" onMouseDown={handleStartDrag}>
              <div className="guide-header-title">
                <HolderOutlined style={{ opacity: 0.45, cursor: 'grab', marginRight: 2 }} />
                <span className="guide-badge-pill">场景 4</span>
                <span className="guide-header-title-text" title="市局二次转派与基层承接">
                  市局二次转派与基层承接
                </span>
              </div>
              <button
                className="guide-toggle-btn no-drag"
                onClick={(e) => {
                  e.stopPropagation();
                  setConsoleCollapsed(true);
                  setHasCustomPos(false);
                }}
                title="折叠为微缩悬浮球"
              >
                <UpOutlined />
              </button>
            </div>

            <div className="guide-console-body">
              {/* 横向三等分胶囊进度条 */}
              <div className="guide-progress-bar-container">
                <div className={`guide-progress-pill ${currentStep >= 1 ? 'active' : ''}`} />
                <div className={`guide-progress-pill ${currentStep >= 2 ? 'active' : ''}`} />
                <div className={`guide-progress-pill ${currentStep >= 3 ? 'active' : ''}`} />
              </div>
              <div className="guide-step-labels">
                <span className={`guide-step-label-item ${currentStep === 1 ? 'active' : ''}`}>
                  1. 市局待办
                </span>
                <span className={`guide-step-label-item ${currentStep === 2 ? 'active' : ''}`}>
                  2. 二次指派
                </span>
                <span className={`guide-step-label-item ${currentStep === 3 ? 'active' : ''}`}>
                  3. 基层承接
                </span>
              </div>

              {/* 步骤指引卡片 */}
              <div className="guide-step-card-light">
                <InfoCircleOutlined
                  style={{ color: '#1677ff', fontSize: 14, marginTop: 2, flexShrink: 0 }}
                />
                <div className="guide-step-card-text">
                  {currentRole === 'cityPolice' ? (
                    !isDispatched ? (
                      <span>
                        已通过【支队值班岗】认领省厅指令。点击下方按钮或卡片【二次指派区县】，下发贾汪分局网安大队。
                      </span>
                    ) : (
                      <span style={{ color: '#0958d9', fontWeight: 500 }}>
                        已完成二次指派！子任务已推至基层待办池，请切换至【区县承接岗】查验岗位认领与脱敏回显。
                      </span>
                    )
                  ) : (
                    <span>
                      当前以【区县指挥中心岗】登录。省厅直达等高层级标识已脱敏，统一中立展示为【市局交办】。
                    </span>
                  )}
                </div>
              </div>

              {/* 核心快捷操作区 */}
              <div className="no-drag" style={{ marginTop: 6 }}>
                {currentRole === 'cityPolice' ? (
                  <>
                    <button
                      className="guide-btn-sub"
                      onClick={() => setDispatchModalOpen(true)}
                    >
                      <BranchesOutlined style={{ fontSize: 12 }} /> 呼出【二次指派区县】弹窗
                    </button>
                    <button
                      className="guide-btn-primary"
                      onClick={() => {
                        setCurrentRole('countyPolice');
                        setCurrentStep(3);
                      }}
                    >
                      前往区县指挥中心岗 (基层承接) <ArrowRightOutlined style={{ fontSize: 12 }} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="guide-btn-sub"
                      onClick={() => setCountyDetailDrawerOpen(true)}
                    >
                      <FileTextOutlined style={{ fontSize: 12 }} /> 查看基层任务详情 (脱敏回显)
                    </button>
                    <button
                      className="guide-btn-primary"
                      onClick={handleResetWorkflow}
                      style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        boxShadow: 'none',
                      }}
                    >
                      <ReloadOutlined style={{ fontSize: 12 }} /> 重置全流程演示
                    </button>
                  </>
                )}
              </div>

              {/* 视角分段控制器 */}
              <div className="guide-segmented-wrapper no-drag">
                <div
                  className={`guide-segmented-item ${currentRole === 'cityPolice' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentRole('cityPolice');
                    setCurrentStep(isDispatched ? 2 : 1);
                  }}
                >
                  市局值班岗
                </div>
                <div
                  className={`guide-segmented-item ${currentRole === 'countyPolice' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentRole('countyPolice');
                    setCurrentStep(3);
                  }}
                >
                  区县承接岗
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="scenario-secondary-dispatch-container" style={{ position: 'relative', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* 1. 顶部全局 Header (含岗位信息) */}
      {renderTopHeader()}

      {/* 2. 检索筛选区 (1:1 参考图 1) */}
      {renderFilterArea()}

      {/* 3. 主视图区：根据角色切换市局/区县 */}
      {currentRole === 'cityPolice' && renderCityView()}
      {currentRole === 'countyPolice' && renderCountyView()}

      {/* 4. 业务弹窗群 */}
      {renderSecondDispatchModal()}
      {renderCountyDetailDrawer()}
      {renderCountyFeedbackModal()}
      {renderLogModal()}

      {/* 5. 悬浮导引控制台 */}
      {renderFloatingGuideConsole()}
    </div>
  );
};

export default ScenarioSecondaryDispatch;
