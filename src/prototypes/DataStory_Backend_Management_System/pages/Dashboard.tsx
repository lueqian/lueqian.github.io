import React from 'react';
import {
  CloudSyncOutlined,
  AlertOutlined,
  RiseOutlined,
  TeamOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      {/* 统计卡片 */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <CloudSyncOutlined />
          </div>
          <div className="stat-info">
            <div className="stat-value">12,846</div>
            <div className="stat-label">今日采集数据量</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <RiseOutlined />
          </div>
          <div className="stat-info">
            <div className="stat-value">3,521</div>
            <div className="stat-label">正面舆情</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <AlertOutlined />
          </div>
          <div className="stat-info">
            <div className="stat-value">847</div>
            <div className="stat-label">预警事件</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <TeamOutlined />
          </div>
          <div className="stat-info">
            <div className="stat-value">156</div>
            <div className="stat-label">活跃客户数</div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <div className="chart-title">
            📈 舆情趋势分析
            <span style={{ float: 'right', fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>
              最近7天
            </span>
          </div>
          <div style={{ height: 280, display: 'flex', alignItems: 'flex-end', gap: 12, padding: '0 8px' }}>
            {[
              { day: '周一', pos: 65, neg: 25, neu: 10 },
              { day: '周二', pos: 72, neg: 30, neu: 15 },
              { day: '周三', pos: 58, neg: 42, neu: 18 },
              { day: '周四', pos: 80, neg: 20, neu: 12 },
              { day: '周五', pos: 90, neg: 35, neu: 20 },
              { day: '周六', pos: 45, neg: 15, neu: 8 },
              { day: '周日', pos: 55, neg: 22, neu: 14 },
            ].map((item) => (
              <div
                key={item.day}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center',
                    height: 240,
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      width: '60%',
                      height: `${item.pos}%`,
                      background: 'linear-gradient(180deg, #1890ff 0%, #69c0ff 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease',
                    }}
                  />
                  <div
                    style={{
                      width: '60%',
                      height: `${item.neg}%`,
                      background: 'linear-gradient(180deg, #ff4d4f 0%, #ff7875 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease',
                    }}
                  />
                  <div
                    style={{
                      width: '60%',
                      height: `${item.neu}%`,
                      background: 'linear-gradient(180deg, #faad14 0%, #ffd666 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color: '#8c8c8c' }}>{item.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
            <span style={{ fontSize: 12, color: '#595959', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, background: '#1890ff', borderRadius: 2 }} />
              正面
            </span>
            <span style={{ fontSize: 12, color: '#595959', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, background: '#ff4d4f', borderRadius: 2 }} />
              负面
            </span>
            <span style={{ fontSize: 12, color: '#595959', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, background: '#faad14', borderRadius: 2 }} />
              中性
            </span>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-title">📊 媒体来源分布</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0' }}>
            {[
              { name: '新闻网站', value: 42, color: '#1890ff' },
              { name: '社交媒体', value: 28, color: '#52c41a' },
              { name: '论坛博客', value: 15, color: '#faad14' },
              { name: '视频平台', value: 10, color: '#722ed1' },
              { name: '其他', value: 5, color: '#8c8c8c' },
            ].map((item) => (
              <div key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#595959' }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#262626' }}>{item.value}%</span>
                </div>
                <div
                  style={{
                    height: 8,
                    background: '#f0f0f0',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.value}%`,
                      background: item.color,
                      borderRadius: 4,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部区域 */}
      <div className="dashboard-bottom">
        <div className="chart-container">
          <div className="chart-title">
            🔔 最新预警
            <span
              style={{
                float: 'right',
                fontSize: 12,
                color: '#1890ff',
                cursor: 'pointer',
                fontWeight: 400,
              }}
            >
              查看全部 →
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { level: '高', title: '某品牌产品质量问题引发大规模负面舆情', time: '5分钟前', color: '#f5222d' },
              { level: '中', title: '行业政策调整相关舆情关注度上升', time: '23分钟前', color: '#fa8c16' },
              { level: '高', title: '竞品公司发布重大声明，媒体转载量激增', time: '1小时前', color: '#f5222d' },
              { level: '低', title: '正面报道：公司荣获行业创新奖', time: '2小时前', color: '#52c41a' },
              { level: '中', title: '社交媒体用户讨论量异常波动', time: '3小时前', color: '#fa8c16' },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    color: '#fff',
                    background: item.color,
                    fontWeight: 500,
                    minWidth: 28,
                    textAlign: 'center',
                  }}
                >
                  {item.level}
                </span>
                <span style={{ flex: 1, fontSize: 13, color: '#262626', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </span>
                <span style={{ fontSize: 12, color: '#8c8c8c', whiteSpace: 'nowrap' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-title">📋 热点关键词</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '8px 0' }}>
            {[
              { word: '数据安全', hot: true },
              { word: '人工智能', hot: true },
              { word: '舆情监测', hot: false },
              { word: '品牌危机', hot: true },
              { word: '新媒体', hot: false },
              { word: '政策解读', hot: false },
              { word: '行业趋势', hot: false },
              { word: '用户隐私', hot: true },
              { word: '技术创新', hot: false },
              { word: '市场竞争', hot: false },
              { word: '监管合规', hot: true },
              { word: '数字化转型', hot: false },
            ].map((item) => (
              <span
                key={item.word}
                style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: 16,
                  fontSize: 13,
                  background: item.hot ? '#fff1f0' : '#f5f5f5',
                  color: item.hot ? '#f5222d' : '#595959',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: item.hot ? '1px solid #ffa39e' : '1px solid #e8e8e8',
                }}
              >
                {item.hot && '🔥 '}{item.word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
