import React from 'react';
import { Form, Input, DatePicker, Select, Row, Col, Button, Tabs, Rate, Pagination, Space } from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  AppstoreOutlined, 
  BarsOutlined, 
  ProfileOutlined,
  ThunderboltOutlined,
  DeploymentUnitOutlined,
  RadarChartOutlined,
  UserSwitchOutlined,
  EyeOutlined
} from '@ant-design/icons';
import OpinionCard from '../components/OpinionCard';

const { RangePicker } = DatePicker;

const MonitorWarning: React.FC = () => {
  const [form] = Form.useForm();

  const mockData = [
    {
      id: '84167018099',
      title: '够够的，每天晚上十二点之后开启 到底是哪个天才做的这种安排#噪音扰民 #虎头岩巴蜀中学 #巴蜀中学虎头岩校区',
      starRating: 4,
      author: { name: '总队测试1 回' },
      stats: { influence: '5', location: '渝中区', platform: '抖音app', time: '2026-05-15 00:46:00' },
      aiSummary: '巴蜀中学虎头岩校区夜间十二点之后施工或活动产生噪音，引发周边居民投诉扰民问题。',
      aiEvaluation: '【风险定性】环境治理类舆情，存在民生诉求积压升级为群体性维权的重大隐患。【核心风险要素】 - 主体：周边居民，身份为敏感民生群体，诉求具广泛代表性。 - 行为：持续性夜间超时作业，违反《噪声污染防治法》相关规定...',
      sentimentIndex: 78.35,
      indexColor: 'linear-gradient(135deg, #ff9c6e 0%, #ff4d4f 100%)',
      thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      tags: ['数据来源：主动发现', '渝中区', '违法犯罪线索', '反映突出治安问题', '未上传视频'],
      status: 'unprocessed' as const
    },
    {
      id: '96216690442',
      title: '#大旗茶馆 #朝天门码头 目前太辣儿了，体验感不好，建议大家这段时间别去打卡',
      starRating: 3.5,
      author: { name: '211' },
      stats: { influence: '211', location: '渝中区', platform: '抖音app', time: '2026-05-14 15:20:00' },
      aiSummary: '大旗茶馆用户反映朝天门码头当前体验感差，建议暂缓打卡。',
      aiEvaluation: '【风险定性】一般性服务投诉舆情，存在线下文旅消费口碑滑坡的潜在隐患。【核心风险要素】 - 主体：普通游客/本地市民，身份具广泛代表性。 - 行为：公开发布负面体验评价，使用“太辣儿了”等网络词汇...',
      sentimentIndex: 72.35,
      indexColor: '#faad14',
      thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      tags: ['数据来源：主动发现', '渝中区', '维权类', '涉诸公共事件', '未上传视频'],
      status: 'unprocessed' as const
    },
    {
      id: '5cfcd31e00000000010034780',
      title: '凌晨1点 鹅公岩大桥发生什么了',
      starRating: 4,
      author: { name: '董光VCR' },
      stats: { influence: '10', location: '九龙坡区', platform: '小红书', time: '2026-05-14 01:20:57' },
      aiSummary: '凌晨1点嘉陵江鹅公岩大桥发生疑似跳水事件，现场出现警车、消防车及闭面打捞船，引发公众关注和猜测。',
      aiEvaluation: '【风险定性】公共安全类舆情，存在因不明原因人员落水或桥梁突发风险等引发次生恐慌的重大隐患。【核心风险要素】 - 主体：不明身份涉事人员（可能为市民或轻生者）...',
      sentimentIndex: 82.50,
      indexColor: '#f5222d',
      thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      tags: ['数据来源：主动发现', '九龙坡区', '突发案事件', '公共安全事故', '未上传视频'],
      status: 'unprocessed' as const
    }
  ];

  const tabItems = [
    { key: '1', label: <Space><RadarChartOutlined /> AI全部</Space> },
    { key: '2', label: <Space><DeploymentUnitOutlined /> 区县上报</Space> },
    { key: '3', label: <Space><ThunderboltOutlined /> 主动发现</Space> },
    { key: '4', label: <Space><UserSwitchOutlined /> 重点账号跟踪</Space> },
    { key: '5', label: <Space><RadarChartOutlined /> 专项巡查</Space> },
    { key: '6', label: <Space><EyeOutlined /> 智种通报</Space> },
    { key: '7', label: <Space><AppstoreOutlined /> 数据服务</Space> },
  ];

  return (
    <div className="monitor-warning-container">
      {/* A. 顶部搜索与过滤矩阵 */}
      <div className="filter-matrix-card">
        <Form form={form} layout="inline">
          <div style={{ width: '100%' }}>
            {/* 第一行 */}
            <Row gutter={[16, 12]} align="middle">
              <Col span={5}>
                <div className="filter-item">
                  <span className="filter-label">内容搜索</span>
                  <Input placeholder="请输入标题/正文/作者" size="small" />
                </div>
              </Col>
              <Col span={7}>
                <div className="filter-item">
                  <span className="filter-label">发布时间</span>
                  <RangePicker size="small" showTime style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={4}>
                <div className="filter-item">
                  <span className="filter-label">排序</span>
                  <Select defaultValue="time" size="small" style={{ width: '100%' }}>
                    <Select.Option value="time">发布时间倒序</Select.Option>
                  </Select>
                </div>
              </Col>
              <Col span={4}>
                <div className="filter-item">
                  <span className="filter-label">信息状态</span>
                  <Select defaultValue="all" size="small" style={{ width: '100%' }}>
                    <Select.Option value="all">未处置</Select.Option>
                  </Select>
                </div>
              </Col>
            </Row>

            {/* 第二行 */}
            <Row gutter={[16, 12]} align="middle" style={{ marginTop: 12 }}>
              <Col span={5}>
                <div className="filter-item">
                  <span className="filter-label">舆情等级</span>
                  <Select placeholder="请选择" size="small" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={4}>
                <div className="filter-item">
                  <span className="filter-label">舆情类型</span>
                  <Select placeholder="请选择" size="small" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={4}>
                <div className="filter-item">
                  <span className="filter-label">专项任务</span>
                  <Select placeholder="请选择" size="small" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={4}>
                <div className="filter-item">
                  <span className="filter-label">责任属地</span>
                  <Select placeholder="请选择" size="small" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={3}>
                <Input placeholder="请输入编号" size="small" />
              </Col>
              
              <Col span={4} style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                 <Button.Group size="small">
                    <Button icon={<BarsOutlined />}>详细视图</Button>
                    <Button type="primary" icon={<ProfileOutlined />}>研判视图</Button>
                    <Button icon={<AppstoreOutlined />}>简要视图</Button>
                 </Button.Group>
                 <Button size="small" icon={<ReloadOutlined />}>重置</Button>
                 <Button type="primary" size="small" icon={<SearchOutlined />}>查询</Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div>

      {/* B. 业务分类 Tab */}
      <div className="business-tabs-container">
        <Tabs 
          defaultActiveKey="1" 
          items={tabItems} 
          className="custom-tabs"
          style={{ flex: 1 }}
        />
        <Button type="primary" size="small" style={{ marginLeft: 20 }}>手工上报</Button>
      </div>

      {/* C & D. AI 舆情信息卡片列表 */}
      <div style={{ padding: '16px 0' }}>
        {mockData.map(item => (
          <OpinionCard key={item.id} {...item} />
        ))}
      </div>

      {/* Footer Pagination */}
      <div style={{ background: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 4 }}>
        <Button size="small" type="primary">导出数据</Button>
        <Pagination size="small" total={50} showSizeChanger showQuickJumper />
      </div>
    </div>
  );
};

export default MonitorWarning;
