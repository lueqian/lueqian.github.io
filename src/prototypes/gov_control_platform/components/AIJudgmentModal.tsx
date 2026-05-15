import React from 'react';
import { Modal, Button, Tag, Space, Select, Row, Col, Tabs, Input, Checkbox, Avatar, Divider } from 'antd';
import { 
  UserOutlined, 
  ThunderboltOutlined, 
  InfoCircleOutlined, 
  PlayCircleOutlined,
  SendOutlined,
  CopyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

interface Props {
  open: boolean;
  onCancel: () => void;
  data: any;
}

const AIJudgmentModal: React.FC<Props> = ({ open, onCancel, data }) => {
  return (
    <Modal
      title="AI辅助研判"
      open={open}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Button key="back" onClick={onCancel}>取消</Button>,
        <Button key="submit" type="primary">完成研判</Button>,
      ]}
      bodyStyle={{ padding: 0, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
    >
      <div className="judgment-modal-content">
        {/* Header Section */}
        <div className="judgment-header">
          <div className="judgment-header-title">
            <span className="title-text">{data?.title}</span>
            <Tag color="red" className="hot-tag">热敏</Tag>
            <div className="rating-stars">
              <span style={{ color: '#faad14', marginRight: 4 }}>★★★★</span>
              <span style={{ color: '#bfbfbf' }}>★</span>
              <span style={{ fontSize: 12, marginLeft: 4, color: 'rgba(0,0,0,0.45)' }}>4星</span>
            </div>
          </div>
          <div className="judgment-header-meta">
            <Space size={24}>
              <div className="meta-item">
                <span className="label">涉事属地：</span>
                <span>渝中区</span>
              </div>
              <div className="meta-item">
                <span className="label">责任属地：</span>
                <Select defaultValue="yuzhong" size="small" style={{ width: 120 }}>
                  <Select.Option value="yuzhong">渝中区</Select.Option>
                </Select>
              </div>
              <Tag color="blue">数据来源：主动发现</Tag>
              <Tag color="processing">未处置</Tag>
            </Space>
          </div>
        </div>

        <div className="judgment-body">
          {/* Left Column */}
          <div className="judgment-left">
            <section className="judgment-section">
              <div className="section-title">事件概述</div>
              <div className="ai-block ai-summary-block">
                <div className="ai-tag ai-summary-tag">AI 摘要</div>
                <div className="ai-content">{data?.aiSummary}</div>
              </div>
              <div className="ai-block ai-eval-block">
                <div className="ai-tag ai-eval-tag">AI 研判</div>
                <div className="ai-content" style={{ fontSize: 12 }}>{data?.aiEvaluation}</div>
              </div>
            </section>

            <section className="judgment-section">
              <div className="index-cards-row">
                <div className="index-card">
                  <div className="index-card-label">舆情指数 <InfoCircleOutlined style={{ fontSize: 12, color: 'rgba(0,0,0,0.25)' }} /></div>
                  <div className="index-card-value">
                    <span className="main-val">78.35</span>
                    <span className="sub-val">/ 低</span>
                  </div>
                  <div className="index-trend trend-up">
                    <ArrowDownOutlined /> 0% <span className="trend-box">0</span>
                  </div>
                  <div className="compare-text">对比上一个周期变化</div>
                </div>
                <div className="index-card">
                  <div className="index-card-label">网估指数 <InfoCircleOutlined style={{ fontSize: 12, color: 'rgba(0,0,0,0.25)' }} /></div>
                  <div className="index-card-value">
                    <span className="main-val">58</span>
                    <span className="sub-val">/ 低</span>
                  </div>
                  <div className="index-trend trend-down">
                    <ArrowUpOutlined /> 15.2% <span className="trend-box">54</span>
                  </div>
                  <div className="compare-text">对比上一个周期变化</div>
                </div>
                <div className="index-card">
                  <div className="index-card-label">部级指数 <InfoCircleOutlined style={{ fontSize: 12, color: 'rgba(0,0,0,0.25)' }} /></div>
                  <div className="index-card-value">
                    <span className="main-val">61</span>
                    <span className="sub-val">/ 低</span>
                  </div>
                  <div className="index-trend trend-down">
                    <ArrowUpOutlined /> 10.2% <span className="trend-box">58</span>
                  </div>
                  <div className="compare-text">对比上一个周期变化</div>
                </div>
              </div>
            </section>

            <section className="judgment-section">
              <div className="section-title">附件总览</div>
              <div className="attachment-placeholder">
                <div className="empty-icon" />
                <span>暂无数据</span>
              </div>
            </section>

            <section className="judgment-section">
              <div className="section-title">原发热度</div>
              <div className="original-post">
                <div className="post-header">
                  <Space>
                    <Avatar size={24} icon={<UserOutlined />} />
                    <span className="author">日光昭昭</span>
                    <Tag color="green">原创</Tag>
                    <Tag color="red">热敏</Tag>
                  </Space>
                  <div className="post-actions">
                    <Button type="link" size="small">复制信息</Button>
                    <Button type="link" size="small">查看原文</Button>
                  </div>
                </div>
                <div className="post-meta">
                  <Space split={<Divider type="vertical" />}>
                    <span>2026-05-15 00:46:00</span>
                    <Space size={4}>
                      <ThunderboltOutlined />
                      <span>抖音app</span>
                    </Space>
                  </Space>
                </div>
                <div className="post-content-container">
                  <div className="post-text">
                    够够的，每天晚上十二点之后开启 到底是哪个天才做的这种安排#噪音扰民 #虎头岩巴蜀中学 #巴蜀中学虎头岩校区
                  </div>
                  <div className="post-media">
                    <div className="media-thumb-large">
                      <img src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" alt="post" />
                      <div className="play-icon">▶</div>
                    </div>
                  </div>
                </div>
                <div className="ocr-box">
                   <Tag color="blue" icon={<InfoCircleOutlined />}>封面识别结果：</Tag>
                   <span className="ocr-text">①5月15日周五 · 丙午年三月廿九</span>
                   <a className="view-all">查看全部</a>
                </div>
                <div className="post-tags">
                  <Tag>数据来源：主动发现</Tag>
                  <Tag>重庆市-渝中区-虎头岩巴蜀中学</Tag>
                  <Tag>违法犯罪线索-反映突出治安问题</Tag>
                </div>
              </div>
            </section>

            <section className="judgment-section">
              <div className="section-title">相似信息 0</div>
            </section>
          </div>

          {/* Right Column */}
          <div className="judgment-right">
            <Tabs 
              defaultActiveKey="1"
              items={[
                { key: '1', label: '分析研判' },
                { key: '2', label: '处置过程' },
                { key: '3', label: '处置详情' },
              ]}
              tabBarExtraContent={<Button type="primary" size="small" icon={<SendOutlined />}>下达处置指令</Button>}
            />
            
            <div className="analysis-panel">
              <div className="panel-section">
                <div className="panel-title">分析研判</div>
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="field-item">
                      <div className="field-label">等级：</div>
                      <Select placeholder="请选择" style={{ width: '100%' }} />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="field-item">
                      <div className="field-label">舆情类型：</div>
                      <Select placeholder="请选择" style={{ width: '100%' }} />
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="panel-section">
                <div className="panel-title">人工研判意见</div>
                <TextArea rows={4} placeholder="请输入人工研判意见" />
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <Button type="link" size="small" icon={<CopyOutlined />}>一键复制</Button>
                </div>
              </div>

              <div className="panel-section">
                <div className="panel-title">
                  <Space>
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    <span>下一步指令下达</span>
                    <Tag color="orange">未上传视频</Tag>
                  </Space>
                </div>
                <div className="instruction-box">
                  <div className="instruction-group">
                    <div className="group-label">常用指令</div>
                    <div className="instruction-row">
                      <div className="row-label">本单位指令</div>
                      <div className="checkbox-grid">
                        <Checkbox>热搜巡查</Checkbox>
                        <Checkbox>网媒跟踪</Checkbox>
                        <Checkbox>领导研判</Checkbox>
                        <Checkbox>协调删帖</Checkbox>
                        <Checkbox>信息编报</Checkbox>
                        <Checkbox>核实情况</Checkbox>
                        <Checkbox>通报警种</Checkbox>
                        <Checkbox>协调限流</Checkbox>
                        <Checkbox>人员落查</Checkbox>
                        <Checkbox>待反馈模板</Checkbox>
                      </div>
                      <a className="fill-content">补充指令内容 填写</a>
                    </div>
                    <div className="instruction-row">
                      <div className="row-label">执行单位指令</div>
                      <div className="unit-selector">
                        <Select defaultValue={['yuzhong']} mode="multiple" style={{ width: '100%' }}>
                          <Select.Option value="yuzhong">渝中区</Select.Option>
                          <Select.Option value="plus1">+1</Select.Option>
                        </Select>
                      </div>
                      <div className="checkbox-grid">
                        <Checkbox>平台举报</Checkbox>
                        <Checkbox>持续监测</Checkbox>
                        <Checkbox>线下核实</Checkbox>
                        <Checkbox>引导删帖</Checkbox>
                        <Checkbox>属地认领</Checkbox>
                        <Checkbox>编报模板...</Checkbox>
                        <Checkbox>新人落查</Checkbox>
                        <Checkbox>属地落查</Checkbox>
                      </div>
                      <a className="fill-content">补充指令内容 填写</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AIJudgmentModal;
