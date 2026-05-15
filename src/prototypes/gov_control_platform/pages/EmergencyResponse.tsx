import React from 'react';
import { Form, Input, DatePicker, Select, Row, Col, Button, Tabs, Space, Switch, Pagination } from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  BellOutlined, 
  ThunderboltOutlined,
  FilterOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import DisposalCard from '../components/DisposalCard';

const { RangePicker } = DatePicker;

const EmergencyResponse: React.FC = () => {
  const [form] = Form.useForm();

  const tabItems = [
    { key: '1', label: <span>待处理 <span className="tab-badge">20</span></span> },
    { key: '2', label: <span>已处理(1)</span> },
    { key: '3', label: <span>编报模板指令 <span className="tab-badge">4</span></span> },
    { key: '4', label: <span>信息编报 <span className="tab-badge">4</span></span> },
    { key: '5', label: <span>新人员落查 <span className="tab-badge">5</span></span> },
    { key: '6', label: <span>平台举报(2)</span> },
    { key: '7', label: <span>热搜巡查 <span className="tab-badge">2</span></span> },
    { key: '8', label: <span>全部</span> },
  ];

  const mockData = [
    {
      id: '1234',
      title: '#周慧敏的猫去世了# 周慧敏发文纪念自己今天去世的猫猫：Mike仔今天走了，比预期来得更快。但正如您所说，以你这样的情况能活到现在，已经非常难得。[捂嘴哭]',
      source: '微博',
      time: '2026-05-12 22:45:45',
      starRating: 0,
      aiSummary: '艺人周慧敏发文纪念其宠物猫Mike在 unspecified 地点去世。',
      aiEvaluation: '此舆情不涉及敏感话题，受众无明显诉求、行为，对社会、经济、政治无影响。',
      analysisTags: ['初研 爱的色放', '第1次研判'],
      taskTags: ['未完成任务', '7个任务', '引导删帖', '核实情况 +1', '通报警种', '平台举报 +1', '热搜巡查'],
      sla: {
        nature: '热搜巡查',
        status: 'overdue' as const,
        countdown: '00天00时00分',
        dispatcher: '测试账号6',
        dispatchTime: '2026-05-14 13:55:57'
      },
      sentimentIndex: 0.00
    },
    {
      id: '20404010',
      title: '开20万公里，电车和油车能差多少钱 #新能源汽车 #燃油车 #汽车知识 @抖音汽车 @抖音小助手',
      source: '抖音app',
      time: '2026-05-07 17:51:00',
      starRating: 0.5,
      aiSummary: '该内容为一名普通网民发布的关于新能源汽车与燃油车行驶20万公里成本对比的科普类讨论，未提及具体当事人及涉事地点。',
      aiEvaluation: '舆情不涉及敏感话题，受众主要是对汽车知识的探讨，未出现异常行为，对社会、经济、政治无明显影响',
      analysisTags: ['初研 涉民生'],
      taskTags: [],
      sla: {
        nature: '信息编报',
        status: 'pending' as const,
        countdown: '01天02时15分',
        dispatcher: '系统自动',
        dispatchTime: '2026-05-14 09:00:00'
      },
      sentimentIndex: 10.00
    }
  ];

  return (
    <div className="disposal-container">
      {/* A. 复合搜索栏 */}
      <div className="advanced-search-card">
        <Form form={form} layout="inline">
          <div style={{ width: '100%' }}>
            <Row gutter={[16, 12]} className="search-row">
              <Col span={6}>
                <div className="filter-item">
                  <span className="filter-label">报送信息全文</span>
                  <Input placeholder="请输入标题、网址、组合搜索" size="small" />
                </div>
              </Col>
              <Col span={6}>
                <div className="filter-item">
                  <span className="filter-label">指令下发时间</span>
                  <RangePicker size="small" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={6}>
                <div className="filter-item">
                  <span className="filter-label">处置时间</span>
                  <RangePicker size="small" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={6}>
                <div className="filter-item">
                  <span className="filter-label">编报状态</span>
                  <Select placeholder="请选择" size="small" style={{ width: '100%' }} />
                </div>
              </Col>
            </Row>
            <Row gutter={[16, 12]} className="search-row">
              <Col span={6}>
                <div className="filter-item">
                  <span className="filter-label">日期区间</span>
                  <RangePicker size="small" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={6}>
                <div className="filter-item">
                  <span className="filter-label">刊号</span>
                  <Input placeholder="输入刊号查询" size="small" />
                </div>
              </Col>
              <Col span={6}>
                <div className="filter-item">
                  <span className="filter-label">已下发指令</span>
                  <Select placeholder="请选择" size="small" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={6} style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button size="small" icon={<ReloadOutlined />}>重置</Button>
                <Button type="primary" size="small" icon={<SearchOutlined />}>查询</Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div>

      {/* B. 指令 Tab 切换区 */}
      <div className="instruction-tabs-container">
        <Tabs 
          defaultActiveKey="1" 
          items={tabItems} 
          className="custom-tabs"
          style={{ flex: 1 }}
        />
        <Space size={16} style={{ paddingLeft: 20 }}>
          <Button type="primary" size="small" icon={<ThunderboltOutlined />}>快捷指令</Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch size="small" defaultChecked />
            <span style={{ fontSize: 12, color: '#1890ff' }}>已打开自动消息提醒</span>
          </div>
          <Select defaultValue="time_desc" size="small" style={{ width: 140 }}>
            <Select.Option value="time_desc">按指令时间降序</Select.Option>
          </Select>
          <Button.Group size="small">
             <Button type="primary">详细视图</Button>
             <Button>处置视图</Button>
             <Button>简要视图</Button>
          </Button.Group>
        </Space>
      </div>

      {/* C. 任务处置卡片列表 */}
      <div style={{ padding: '0 0 16px 0' }}>
        {mockData.map(item => (
          <DisposalCard key={item.id} {...item} />
        ))}
      </div>

      {/* Footer Pagination */}
      <div style={{ background: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 4 }}>
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>共 2 条</div>
        <Pagination size="small" total={2} pageSize={10} showSizeChanger />
      </div>

    </div>
  );
};

export default EmergencyResponse;
