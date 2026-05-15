import React from 'react';
import { Button, Select, Tabs, Input, Radio, Checkbox, Space, Dropdown } from 'antd';
import { LeftOutlined, FilterOutlined, UnorderedListOutlined, DownOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons';
import ArticleCard from '../components/ArticleCard';

const { Search } = Input;

interface Props {
  onBack: () => void;
}

const MajorEntityDetail: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="detail-page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f0f2f5' }}>
      {/* Header / Breadcrumbs */}
      <div className="detail-header" style={{ padding: '12px 20px', background: '#fff', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button type="primary" icon={<LeftOutlined />} onClick={onBack} size="small" style={{ background: '#1890ff' }}>返回</Button>
        <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>任务名称：</span>
        <Input placeholder="请输入任务名称" defaultValue="测试2" bordered={false} style={{ width: 200, padding: 0 }} />
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>应急处置模式：</span>
          <Select defaultValue="normal" size="small" style={{ width: 100 }}>
            <Select.Option value="normal">常态</Select.Option>
          </Select>
          <Button type="primary" size="small" style={{ background: '#1890ff' }}>筛选</Button>
          <Button size="small">重置</Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, padding: '16px', gap: 16, overflow: 'hidden' }}>
        
        {/* Left Area (Tabs + List) */}
        <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', borderRadius: 4, overflow: 'hidden' }}>
          
          {/* Top Tabs */}
          <div style={{ padding: '0 20px', borderBottom: '1px solid #f0f0f0' }}>
            <Tabs defaultActiveKey="1" items={[
              { key: '1', label: '重大实体事件跟踪' },
              { key: '2', label: '重点账号动态跟踪' },
              { key: '3', label: '重点阵地实时盯控' },
              { key: '4', label: '舆情专项专班' },
              { key: '5', label: '安保任务' },
            ]} />
          </div>

          <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#52c41a', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '1px solid #52c41a', textAlign: 'center', lineHeight: '12px', fontSize: 10 }}>✓</span> 测试2</span>
              <span style={{ color: '#1890ff', fontSize: 12, marginLeft: 8 }}>2026-05-14 10:44:4 至 2026-05-15 10:44:4</span>
            </div>
            
            <Tabs defaultActiveKey="1" size="small" style={{ marginBottom: 0 }} items={[
              { key: '1', label: '文章列表' },
              { key: '2', label: '快速分析' },
              { key: '3', label: '加入态势追踪' },
              { key: '4', label: '工作情况统计' },
            ]} />

            <Space>
              <Radio.Group size="small" value="all">
                <Radio.Button value="all" style={{ color: '#1890ff' }}>全部 x</Radio.Button>
                <Radio.Button value="positive" style={{ color: '#1890ff' }}>正面 x</Radio.Button>
                <Radio.Button value="neutral" style={{ color: '#1890ff' }}>中性 x</Radio.Button>
                <Radio.Button value="negative" style={{ color: '#1890ff' }}>负面 x</Radio.Button>
              </Radio.Group>
            </Space>
          </div>

          {/* Filters Area */}
          <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', flex: 1 }}>
              <span style={{ color: '#1890ff', cursor: 'pointer' }}>全部 (67)</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}>微博 (3)</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}>抖音 (13)</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}>今日头条 (15)</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}>小红书 (1)</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}>其他短视频 (0)</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}>微信 (9)</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}>新闻 (25)</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}>论坛 (0)</span>
              <span style={{ color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}>长视频 (0)</span>
            </div>
            <Space>
              <Button icon={<FilterOutlined />} size="small">筛选</Button>
              <Select defaultValue="fast" size="small" style={{ width: 100 }}>
                <Select.Option value="fast">快速筛选</Select.Option>
              </Select>
              <Select defaultValue="time" size="small" style={{ width: 120 }}>
                <Select.Option value="time">按时间-倒序</Select.Option>
              </Select>
              <UnorderedListOutlined style={{ color: '#1890ff' }} />
            </Space>
          </div>

          {/* Article List */}
          <div className="article-list-scrollable" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            <ArticleCard 
              id="1"
              index={1}
              authorName="奋发风声qc1"
              sourceTag="原创"
              followers="--"
              publishTime="2026-05-15 10:25:25"
              platform="今日头条"
              location="山西省, 山西省"
              content={<>四川最憋屈的地级市，距离重庆却归四川管，下面的县还不认它！<span style={{ color: '#ff4d4f' }}>重庆1</span></>}
              ocrHighlight="②中国农业银"
              similarCount={1}
              images={['https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png']}
              isVideo={true}
            />
            
            <ArticleCard 
              id="2"
              index={2}
              authorName="四川最憋屈的地级市，距离重庆却归四川管，下面的县还不认它！"
              sourceTag="原创"
              followers="--"
              publishTime="2026-05-15 10:25:25"
              platform="懂车帝"
              location="山西省, 山西省"
              content={<>数据更扎心：广安人一年花出去的钱，六成以上在重庆；邻水工业园每两台机器，就有一台在给长安、力帆做配套；垫江梁平还没说话，广安先被拉进“<span style={{ color: '#ff4d4f' }}>重庆1</span>小时生活圈”地图。 有人调侃，广安像“嫁出去的女儿”——户口还在娘家，心早跟婆家过了。川B、川X的车牌，一到周末就堵在G85渝广高速，不是去旅游，是回“真正的家”。 可四川也不是后妈。省级财政转移支付，广安年年拿前几；成都给的产业基金，照样签字盖章。只是地理这玩意儿，比文件硬——到天府广场高铁最快2小时58分，到重庆北站最快59分，老百姓用脚投票，谁拦得住？</>}
              ocrHighlight="②中国农业银"
              similarCount={1}
              images={['https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png']}
            />
            
            <ArticleCard 
              id="3"
              index={3}
              authorName="四季田野四季情"
              sourceTag="原创"
              followers="163"
              publishTime="2026-05-15 09:48:18"
              platform="微博"
              location="北京市, 北京市"
              content={<>网爆百万大围观：霸跋放飞不愿回家 主人一招搞定<br/><span style={{ color: '#ff4d4f' }}>重庆1</span>只霸跋放飞拒归，主人1句方言秒召回 灵禽展翅恋晴空，任性枝头不肯从。 主人一喝方言令，立马飞回笑煞众。 别以为宠物只会撒娇卖萌，聪明起来能让你大开眼界！ ...</>}
              similarCount={5}
            />
          </div>

          {/* Footer Pagination */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
            <Checkbox>全选</Checkbox>
            <Button size="small" style={{ marginLeft: 8, background: '#1890ff', color: '#fff', border: 'none' }}>导出</Button>
          </div>
        </div>

        {/* Right Sidebar (Task List) */}
        <div className="right-task-sidebar" style={{ width: 240, background: '#fff', borderRadius: 4, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontWeight: 600 }}>任务列表</span>
            <CloseOutlined style={{ color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }} />
          </div>
          
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1890ff', marginBottom: 8, cursor: 'pointer' }}>
              <DownOutlined style={{ fontSize: 12 }} />
              <span style={{ fontWeight: 500 }}>重大实体事件跟踪</span>
            </div>
            
            <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f5f5', padding: '6px 8px', borderRadius: 2 }}>
                <span style={{ color: 'rgba(0,0,0,0.85)' }}>测试2</span>
                <Space size={4}>
                  <FileTextOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
                  <FileTextOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
                </Space>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px' }}>
                <span style={{ color: 'rgba(0,0,0,0.65)' }}>热榜测试</span>
                <Space size={4}>
                  <FileTextOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
                  <FileTextOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
                </Space>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MajorEntityDetail;
