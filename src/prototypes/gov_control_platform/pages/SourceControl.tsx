import React, { useState } from 'react';
import { Radio, Select, Button, Space, Carousel } from 'antd';
import { FileProtectOutlined, CarryOutOutlined, MoreOutlined, GlobalOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import MajorEntityDetail from './MajorEntityDetail';

const SourceControl: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'detail'>('dashboard');

  if (currentView === 'detail') {
    return <MajorEntityDetail onBack={() => setCurrentView('dashboard')} />;
  }

  // Custom arrows for Carousel
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }: any) => (
    <Button 
      {...props} 
      size="small" 
      icon={<LeftOutlined />} 
      className="slick-prev-custom" 
      style={{ position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: '#fff', border: '1px solid #e8e8e8', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} 
    />
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }: any) => (
    <Button 
      {...props} 
      size="small" 
      icon={<RightOutlined />} 
      className="slick-next-custom" 
      style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: '#fff', border: '1px solid #e8e8e8', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} 
    />
  );

  return (
    <div className="dashboard-container">
      {/* 顶部筛选区 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 20px', borderRadius: '4px' }}>
        <Space size={16}>
          <Radio.Group defaultValue="today" buttonStyle="solid" size="small">
            <Radio.Button value="today">今日</Radio.Button>
            <Radio.Button value="month">当月</Radio.Button>
            <Radio.Button value="stats">排班统计</Radio.Button>
          </Radio.Group>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>日历归集：</span>
            <Select placeholder="请选择" style={{ width: 160 }} size="small" />
          </div>
        </Space>
        <Space>
          <Button icon={<FileProtectOutlined />} type="primary" size="small" style={{ background: '#5c7cff' }}>敏感时间/事件节点设置</Button>
          <Button icon={<CarryOutOutlined />} type="primary" size="small" style={{ background: '#3b5998' }}>任务布控</Button>
        </Space>
      </div>

      {/* 主体左右分栏布局 */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
        
        {/* 左侧栏 (占比 2/3) */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 数据概览 */}
          <div className="stat-card-container" style={{ position: 'relative', padding: '16px 30px', margin: 0 }}>
            <div className="section-title">数据概览</div>
            <div style={{ width: '100%', marginTop: 10 }}>
              <Carousel 
                dots={false} 
                slidesToShow={6} 
                slidesToScroll={1}
                arrows={true}
                prevArrow={<SlickArrowLeft />}
                nextArrow={<SlickArrowRight />}
              >
                {[
                  { label: '今日任务', value: 4 },
                  { label: '重大实体事件跟踪', value: 1 },
                  { label: '重点账号动态跟踪', value: 0 },
                  { label: '重点阵地实时盯控', value: 0 },
                  { label: '舆情专项专班', value: 0 },
                  { label: '工作要求', value: 2 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="stat-item" style={{ textAlign: 'center', padding: '0 8px' }}>
                      <div className="stat-value">{item.value}</div>
                      <div className="stat-label">{item.label}</div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>

          {/* 底部左侧两列 */}
          <div style={{ display: 'flex', gap: 16, flex: 1 }}>
            {/* 工作要求 */}
            <div className="task-column">
              <div className="section-title">工作要求</div>
              <div className="task-list">
                <div className="work-req-card">
                  <div className="work-req-header">
                    <span className="work-req-title">当日值班交接工作</span>
                    <MoreOutlined />
                  </div>
                  <ol className="work-req-items">
                    <li>近期因强降雨、大风天气，情指要求关注极端天气网情</li>
                    <li>巴南发生3死1伤交通事故，指导属地管控舆情，防炒作</li>
                  </ol>
                </div>
                <div className="work-req-card">
                  <div className="work-req-header">
                    <span className="work-req-title">近期重点关注事项</span>
                    <MoreOutlined />
                  </div>
                  <ol className="work-req-items">
                    <li>巡视组专项</li>
                    <li>重庆燃气网情</li>
                    <li>延迟退休网情</li>
                    <li>三车专项</li>
                  </ol>
                </div>
                <div className="work-req-card">
                  <div className="work-req-header">
                    <span className="work-req-title">每日固定报件提醒</span>
                    <MoreOutlined />
                  </div>
                  <ol className="work-req-items">
                    <li>每日互联网简讯（7：30发朱总）</li>
                    <li>每日网情热点（当日交车班）</li>
                    <li>5月1日-5日，每日21时通过“要情系统”报送劳动节网络舆情综述</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* 重大实体事件跟踪 */}
            <div className="task-column">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div className="section-title" style={{ marginBottom: 0 }}>重大实体事件跟踪</div>
                <a style={{ fontSize: 13, color: '#1890ff' }}>更多</a>
              </div>
              <div className="task-list">
                <div className="task-card" onClick={() => setCurrentView('detail')}>
                  <div className="task-card-header">
                    <span className="task-name">测试2</span>
                    <div className="task-tags">
                      <span className="tag-green">常态</span>
                      <span className="tag-blue">网安,总一,区县,...</span>
                      <MoreOutlined />
                    </div>
                  </div>
                  <div className="task-card-stats">
                    <div className="stat-icon-text">
                      <FileProtectOutlined style={{ color: '#1890ff' }} /> <span>863</span>
                    </div>
                    <div className="stat-icon-text">
                      <GlobalOutlined style={{ color: '#1890ff' }} /> <span>69 <span style={{ color: '#52c41a' }}>-33%</span></span>
                    </div>
                    <span className="tag-red">未上榜</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧栏 (占比 1/3) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 敏感时间/事件节点 */}
          <div className="event-nodes-container" style={{ margin: 0 }}>
            <div className="section-title warning" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>敏感时间/事件节点</span>
            </div>
            <div className="event-nodes-list">
              <div className="event-node" style={{ background: '#fff1f0', borderColor: '#ffccc7' }}>
                <div className="node-label">节点1</div>
                <div className="node-value" style={{ color: '#cf1322' }}>川普访华</div>
              </div>
            </div>
          </div>

          {/* 舆情专项专班 */}
          <div className="task-column" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="section-title" style={{ marginBottom: 0 }}>舆情专项专班</div>
              <a style={{ fontSize: 13, color: '#1890ff' }}>更多</a>
            </div>
            <div className="task-list">
              <div className="task-card">
                <div className="task-card-header">
                  <span className="task-name">重庆</span>
                  <div className="task-tags">
                    <span className="tag-green">常态</span>
                    <span className="tag-blue">总1_民警</span>
                    <MoreOutlined />
                  </div>
                </div>
                <div className="task-card-stats">
                  <div className="stat-icon-text">
                    <FileProtectOutlined style={{ color: '#1890ff' }} /> <span>21567025</span>
                  </div>
                  <div className="stat-icon-text">
                    <GlobalOutlined style={{ color: '#1890ff' }} /> <span>631657 <span style={{ color: '#ff4d4f' }}>0.7%</span></span>
                  </div>
                  <span className="tag-red-solid">90</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SourceControl;
