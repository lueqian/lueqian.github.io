import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BrainCircuit, ChevronDown, ChevronUp, Clock3, Globe2, MapPin, Maximize2, Radio, ShieldAlert, Target, TrendingUp } from 'lucide-react';
import { internetTrend, screenEvents, screenOpinions, screenRegions, screenTasks } from '../screen-data';

interface Props { onNavigate?: (page: string) => void; onSwitch?: (page: string) => void; }

const toneClass = (tone: string) => `screen-tone-${tone}`;

const MiniTrend: React.FC<{ data: number[]; color?: string }> = ({ data, color = '#35d5ff' }) => {
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${38 - (v / max) * 32}`).join(' ');
  return <svg className="screen-mini-trend" viewBox="0 0 100 40" preserveAspectRatio="none"><polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>;
};

const HuaianMap: React.FC<{ mode?: 'internet' | 'intranet'; selected: string; onSelect: (name: string) => void }> = ({ mode = 'internet', selected, onSelect }) => (
  <div className="huaian-map-wrap">
    <svg className="huaian-map" viewBox="0 0 100 100" role="img" aria-label="淮安地区态势地图">
      <path d="M27 11 L48 6 L68 14 L82 11 L91 28 L86 45 L92 60 L78 72 L84 90 L61 96 L47 87 L28 92 L19 77 L8 68 L16 50 L10 36 Z" className="huaian-outline" />
      <path d="M28 11 L38 29 L16 50 M38 29 L54 18 L68 14 M38 29 L48 48 L61 50 L86 45 M16 50 L28 66 L47 64 L61 50 M28 66 L19 77 M47 64 L47 87 M61 50 L78 72 L61 96 M78 72 L92 60" className="huaian-grid" />
      {screenRegions.map((region) => {
        const value = mode === 'internet' ? region.report : region.received;
        const active = selected === region.name;
        return <g key={region.name} className={`map-region ${active ? 'is-selected' : ''}`} onClick={() => onSelect(region.name)}>
          <circle cx={region.x} cy={region.y} r={active ? 4.2 : 3.2} className={`map-dot ${mode === 'internet' ? 'map-dot-internet' : 'map-dot-intranet'}`} />
          <circle cx={region.x} cy={region.y} r={active ? 8 : 6} className="map-pulse" />
          <text x={region.x + 3.5} y={region.y - 2.5}>{region.name}</text><text x={region.x + 3.5} y={region.y + 2.5} className="map-value">{value}</text>
        </g>;
      })}
    </svg>
    <div className="map-center-stat"><span>淮安</span><strong>{mode === 'internet' ? '189' : '104'}</strong><small>{mode === 'internet' ? '今日上报' : '已接收指令'}</small></div>
    <div className="map-legend"><span><i className={mode === 'internet' ? 'legend-dot internet' : 'legend-dot receive'} />{mode === 'internet' ? '地区上报' : '已接收'}</span><span><i className="legend-dot alert" />{mode === 'internet' ? 'AI预警' : '处理中'}</span><span><i className="legend-dot done" />{mode === 'internet' ? '重点任务' : '已完成'}</span></div>
  </div>
);

const ScreenPanel: React.FC<{ title: string; icon: React.ReactNode; action?: string; onAction?: () => void; children: React.ReactNode; className?: string }> = ({ title, icon, action, onAction, children, className = '' }) => (
  <section className={`screen-panel ${className}`}><div className="screen-panel-title"><span className="panel-title-icon">{icon}</span><span>{title}</span>{action && <button onClick={onAction}>{action}<ArrowRight size={13} /></button>}</div>{children}</section>
);

const InternetDataScreen: React.FC<Props> = ({ onNavigate, onSwitch }) => {
  const [eventIndex, setEventIndex] = useState(0); const [opinionIndex, setOpinionIndex] = useState(0); const [selectedRegion, setSelectedRegion] = useState('清江浦区'); const [now, setNow] = useState(new Date());
  useEffect(() => { const timer = window.setInterval(() => { setEventIndex(v => (v + 1) % screenEvents.length); setOpinionIndex(v => (v + 1) % screenOpinions.length); setNow(new Date()); }, 6000); return () => window.clearInterval(timer); }, []);
  const event = screenEvents[eventIndex]; const opinion = screenOpinions[opinionIndex];
  const region = useMemo(() => screenRegions.find(item => item.name === selectedRegion) || screenRegions[0], [selectedRegion]);
  return <div className="screen-page">
    <header className="screen-header"><div><div className="screen-kicker"><Radio size={13} /> BLUE EAGLE / REAL-TIME SITUATION</div><h1>互联网数据态势大屏</h1><p>网安舆情 · 多源感知 · 智能研判</p></div><div className="screen-header-right"><div className="screen-clock"><Clock3 size={15} /> {now.toLocaleTimeString('zh-CN', { hour12: false })}<span>数据每 30 秒更新</span></div><div className="screen-switch"><button className="is-active">互联网数据</button><button onClick={() => onSwitch?.('intranet-data-screen')}>内网数据</button></div><button className="screen-icon-btn" title="全屏"><Maximize2 size={17} /></button></div></header>
    <div className="screen-metrics"><div><span>今日舆情总量</span><strong>1,286</strong><em>+18.6%</em></div><div><span>AI 敏感预警</span><strong>42</strong><em>+6.2%</em></div><div><span>地区上报</span><strong>189</strong><em>+12.4%</em></div><div><span>在管源头任务</span><strong>16</strong><em>3 个新增</em></div></div>
    <main className="screen-grid">
      <div className="screen-column"><ScreenPanel title="警舆同处 · 重点事件" icon={<ShieldAlert size={16} />} action="进入模块" onAction={() => onNavigate?.('police-opinion-joint')} className="event-panel"><div className="ticker-card"><div className="ticker-meta"><span className={toneClass(event.tone)}>{event.risk}风险</span><span>{event.area}</span><span>{event.time}</span></div><h2>{event.title}</h2><p>{event.summary}</p><div className="ticker-footer"><b>{event.volume.toLocaleString()}</b><span>当前声量</span><MiniTrend data={event.trend} /><span className="ticker-index">趋势上升</span></div></div><div className="ticker-controls"><button onClick={() => setEventIndex((eventIndex + screenEvents.length - 1) % screenEvents.length)}><ChevronUp size={14} /></button><span>{String(eventIndex + 1).padStart(2, '0')} / {String(screenEvents.length).padStart(2, '0')}</span><button onClick={() => setEventIndex((eventIndex + 1) % screenEvents.length)}><ChevronDown size={14} /></button></div></ScreenPanel>
        <ScreenPanel title="源头防控 · 在管任务" icon={<Target size={16} />} action="查看任务" onAction={() => onNavigate?.('source-control')}><div className="task-list">{screenTasks.map(task => <button className="task-row" key={task.id} onClick={() => onNavigate?.('source-control')}><div><b>{task.name}</b><span>{task.code} · {task.department}</span></div><strong>{task.eventCount}</strong><em>{task.status}</em><small>{task.trend}</small></button>)}</div></ScreenPanel></div>
      <div className="screen-column screen-column-center"><ScreenPanel title="淮安地区 · 舆情上报态势" icon={<MapPin size={16} />} className="map-panel"><HuaianMap selected={selectedRegion} onSelect={setSelectedRegion} /><div className="map-detail"><div><span>{region.name}</span><strong>{region.report}</strong><small>今日上报</small></div><div><span>关联事件</span><strong>{region.received + 8}</strong><small>当前监测</small></div><div><span>热度指数</span><strong>{Math.min(99, region.report + 48)}</strong><small>实时评分</small></div></div></ScreenPanel><ScreenPanel title="24小时舆情热度" icon={<TrendingUp size={16} />}><div className="large-trend"><div className="trend-head"><span>全网热度</span><strong>86.4</strong><em>较昨日 +12.8%</em></div><svg viewBox="0 0 100 42" preserveAspectRatio="none"><polyline points={internetTrend.map((v, i) => `${(i / (internetTrend.length - 1)) * 100},${40 - (v / 100) * 34}`).join(' ')} fill="none" stroke="#28d7ff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /><polyline points="0,40 0,40" fill="none" /></svg><div className="axis-labels"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>现在</span></div></div></ScreenPanel></div>
      <div className="screen-column"><ScreenPanel title="AI敏感预警" icon={<BrainCircuit size={16} />} action="进入监测" onAction={() => onNavigate?.('monitor-warning')}><div className="opinion-feature"><div className="ticker-meta"><span className={toneClass(opinion.tone)}>{opinion.source}</span><span>{opinion.area}</span><span>{opinion.time}</span></div><h2>{opinion.title}</h2><p>{opinion.summary}</p><div className="opinion-score"><strong>{opinion.score}</strong><span>舆情指数</span><i className={toneClass(opinion.tone)}>{opinion.status}</i></div></div></ScreenPanel><ScreenPanel title="地区上报舆情" icon={<Globe2 size={16} />} action="查看全部" onAction={() => onNavigate?.('monitor-warning')}><div className="compact-list">{screenOpinions.filter(item => item.source === '本地上报').map(item => <button key={item.id} onClick={() => onNavigate?.('monitor-warning')}><span className="list-dot internet" /><div><b>{item.title}</b><small>{item.area} · {item.platform} · {item.time}</small></div><strong>{item.score}</strong></button>)}</div></ScreenPanel></div>
    </main><footer className="screen-footer"><span>数据来源：警舆同处 / 源头防控 / 监测预警</span><span>当前聚焦：{selectedRegion}</span></footer>
  </div>;
};

export default InternetDataScreen;
