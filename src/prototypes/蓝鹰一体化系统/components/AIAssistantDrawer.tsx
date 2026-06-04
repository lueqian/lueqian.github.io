import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Button,
  Input,
  Avatar,
  Tag,
  Spin,
  message,
  Tooltip,
  Switch,
} from 'antd';
import {
  CloseOutlined,
  CopyOutlined,
  ReloadOutlined,
  SendOutlined,
  BulbOutlined,
  FileTextOutlined,
  SunOutlined,
  MoonOutlined,
  RobotOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { OpinionItem } from '../pages/MonitorWarning';

// 图表库（使用简单的 CSS/SVG 图表，避免引入重型库）
const SimpleBarChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
  const max = Math.max(...data);
  return (
    <div className="simple-bar-chart">
      {data.map((value, idx) => (
        <div key={idx} className="bar-item">
          <div className="bar-wrapper">
            <div
              className="bar"
              style={{ height: `${(value / max) * 100}%` }}
            >
              <span className="bar-value">{value}</span>
            </div>
          </div>
          <span className="bar-label">{labels[idx]}</span>
        </div>
      ))}
    </div>
  );
};

// 对话消息类型
interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: React.ReactNode;
  timestamp: string;
  isStreaming?: boolean;
}

// 打字机效果 Hook
const useTypewriter = (text: string, speed: number = 30, onComplete?: () => void) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);
    indexRef.current = 0;

    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        setIsComplete(true);
        onComplete?.();
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return { displayText, isComplete };
};

// 流式文本组件
const StreamingText: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({
  text,
  speed = 30,
  onComplete,
}) => {
  const { displayText, isComplete } = useTypewriter(text, speed, onComplete);
  return (
    <span className="streaming-text">
      {displayText}
      {!isComplete && <span className="cursor">|</span>}
    </span>
  );
};

export interface AIAssistantDrawerProps {
  visible: boolean;
  opinion: OpinionItem | null;
  onClose: () => void;
}

const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ visible, opinion, onClose }) => {
  // 主题状态
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // 对话消息列表
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 输入框状态
  const [inputValue, setInputValue] = useState('');

  // Loading 状态
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 是否已经显示欢迎语
  const [hasWelcomed, setHasWelcomed] = useState(false);

  // 消息容器引用（用于自动滚动）
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 当 Drawer 打开且有文章数据时，显示欢迎语
  useEffect(() => {
    if (visible && opinion && !hasWelcomed) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: (
          <StreamingText
            text="您好，已为您载入该条舆情帖文的结构化上下文。请问需要执行何种分析？"
            speed={25}
          />
        ),
        timestamp: new Date().toLocaleTimeString(),
        isStreaming: true,
      };
      setMessages([welcomeMessage]);
      setHasWelcomed(true);

      // 3秒后移除流式标记
      setTimeout(() => {
        setMessages(prev =>
          prev.map(m => (m.id === welcomeMessage.id ? { ...m, isStreaming: false } : m))
        );
      }, 3000);
    }
  }, [visible, opinion, hasWelcomed]);

  // 当 Drawer 关闭时重置状态
  useEffect(() => {
    if (!visible) {
      setHasWelcomed(false);
      setMessages([]);
      setInputValue('');
      setIsAnalyzing(false);
    }
  }, [visible]);

  // 添加快捷键 A：推荐劝删话术
  const handleQuickPromptA = () => {
    if (!opinion) return;

    // 用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: '推荐劝删话术',
      timestamp: new Date().toLocaleTimeString(),
    };

    // 根据舆情类型生成不同的话术
    let persuadeContent = '';
    if (opinion.title.includes('土地征收')) {
      persuadeContent = `尊敬的${opinion.author}您好：\n\n我们注意到您发布的关于土地征收的相关内容。根据《个人信息保护法》相关规定，您的帖文中可能涉及他人隐私信息（如身份证号、联系方式等）。\n\n为避免不必要的法律风险，建议您：\n1. 删除涉及个人隐私的图片/视频内容\n2. 通过正规信访渠道反映诉求\n3. 保留与征收部门的沟通记录作为维权依据\n\n如需协助，请联系当地信访部门或法律援助中心。`;
    } else if (opinion.title.includes('医院') || opinion.title.includes('医疗')) {
      persuadeContent = `尊敬的${opinion.author}您好：\n\n我们注意到您发布的关于医疗服务的反馈。根据《医疗纠纷预防和处理条例》，建议您：\n\n1. 保护个人隐私，避免在公开平台透露病历信息\n2. 向医院医务科或医患办正式投诉\n3. 必要时可申请医疗事故鉴定\n4. 保留就诊记录、收费单据等证据\n\n我们理解您的心情，建议通过正规渠道维护权益。`;
    } else {
      persuadeContent = `尊敬的${opinion.author}您好：\n\n我们注意到您发布的内容可能涉及敏感信息。根据相关法律法规，建议您：\n\n1. 核实信息真实性，避免传播不实内容\n2. 删除涉及他人隐私的信息\n3. 通过正规渠道反映问题\n4. 理性表达诉求，避免过激言论\n\n感谢您的理解与配合。`;
    }

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: (
        <div className="persuade-message">
          <StreamingText text={persuadeContent} speed={20} />
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            className="copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(persuadeContent);
              message.success('复制成功');
            }}
          >
            一键复制
          </Button>
        </div>
      ),
      timestamp: new Date().toLocaleTimeString(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === aiMessage.id ? { ...m, isStreaming: false } : m))
      );
    }, 4000);
  };

  // 添加快捷键 B：一键事件总结
  const handleQuickPromptB = () => {
    if (!opinion) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: '一键事件总结',
      timestamp: new Date().toLocaleTimeString(),
    };

    // 生成事件总结内容
    let summaryContent = '';
    let chartData: number[] = [];
    let chartLabels: string[] = [];

    if (opinion.title.includes('土地征收')) {
      summaryContent = `## 事件总结报告\n\n### 【事件前因】\n东莞市某镇村民因土地征收补偿标准问题发起集体诉求，涉及约200户村民。村民认为现行补偿标准低于周边地区，要求重新评估。\n\n### 【当前现状】\n- 网络声量：持续发酵中\n- 情绪倾向：负面为主（78%）\n- 传播平台：主要集中在抖音、微信群\n- 参与人数：约200户村民，已组建维权群\n\n### 【网上声量预测】\n基于全网舆情数据分析，预计未来72小时声量走势：`;
      chartData = [45, 68, 82, 95, 88, 72, 55];
      chartLabels = ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'];
    } else if (opinion.title.includes('医院')) {
      summaryContent = `## 事件总结报告\n\n### 【事件前因】\n网民在东莞人民医院就诊后，因医疗费用问题在社交平台发表吐槽，引发部分网友共鸣。\n\n### 【当前现状】\n- 网络声量：局部传播\n- 情绪倾向：轻度负面（45%）\n- 传播平台：抖音个人账号\n- 影响范围：有限，未形成聚集\n\n### 【网上声量预测】\n基于同类医疗服务投诉数据分析，预计未来72小时声量走势：`;
      chartData = [25, 35, 42, 38, 30, 25, 20];
      chartLabels = ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'];
    } else {
      summaryContent = `## 事件总结报告\n\n### 【事件前因】\n${opinion.aiSummary}\n\n### 【当前现状】\n- 网络声量：${opinion.heat > 1000 ? '较高' : '一般'}\n- 情绪倾向：${opinion.sentimentIndex > 70 ? '负面' : '中性'}\n- 传播平台：${opinion.platform}\n- 风险等级：${opinion.rating}星\n\n### 【网上声量预测】\n基于全网舆情数据分析，预计未来72小时声量走势：`;
      chartData = [30, 45, 55, 60, 52, 45, 40];
      chartLabels = ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'];
    }

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: (
        <div className="summary-message">
          <StreamingText text={summaryContent} speed={15} />
          <div className="chart-container">
            <div className="chart-title">📊 声量趋势预测</div>
            <SimpleBarChart data={chartData} labels={chartLabels} />
          </div>
        </div>
      ),
      timestamp: new Date().toLocaleTimeString(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === aiMessage.id ? { ...m, isStreaming: false } : m))
      );
    }, 5000);
  };

  // 重新分析
  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: '已连接内网算力重新解析媒体附件，分析结果已更新。',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 2000);
  };

  // 发送消息
  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: (
        <StreamingText
          text="收到您的追问，我正在分析相关内容。基于当前舆情数据，建议您关注该事件的后续发展，并及时采取相应措施。如需更详细的分析，请提供更具体的指令。"
          speed={25}
        />
      ),
      timestamp: new Date().toLocaleTimeString(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === aiMessage.id ? { ...m, isStreaming: false } : m))
      );
    }, 4000);
  };

  if (!visible || !opinion) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div className="drawer-mask" onClick={onClose} />

      {/* Drawer 主体 */}
      <div className={`ai-drawer ${isDarkTheme ? 'dark' : 'light'}`}>
        {/* 主题切换按钮 */}
        <div className="theme-toggle">
          <Tooltip title={isDarkTheme ? '切换浅色模式' : '切换深色模式'}>
            <Button
              type="text"
              icon={isDarkTheme ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="theme-btn"
            />
          </Tooltip>
        </div>

        {/* 1. Top Area: 当前文章锚点区 */}
        <div className="context-anchor">
          <div className="anchor-header">
            <div className="anchor-title">
              <RobotOutlined className="ai-icon" />
              <span>AI 智能助手</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              className="close-btn"
            />
          </div>
          <div className="anchor-content">
            <Tag color="blue" className="platform-tag">[{opinion.platform}]</Tag>
            <div className="article-title" title={opinion.title}>
              {opinion.title}
            </div>
            <div className="article-meta">发布时间：{opinion.time}</div>
          </div>
        </div>

        {/* 2. Middle Area: AI 常用对话提示词区 */}
        <div className="quick-prompts">
          <div className="prompts-title">
            <ThunderboltOutlined /> 快捷技能
          </div>
          <div className="prompts-grid">
            <Button
              className="prompt-btn prompt-a"
              onClick={handleQuickPromptA}
              icon={<BulbOutlined />}
            >
              <div className="prompt-btn-content">
                <div className="prompt-btn-title">推荐劝删话术</div>
                <div className="prompt-btn-desc">基于法律合规引导生成私信</div>
              </div>
            </Button>
            <Button
              className="prompt-btn prompt-b"
              onClick={handleQuickPromptB}
              icon={<FileTextOutlined />}
            >
              <div className="prompt-btn-content">
                <div className="prompt-btn-title">一键事件总结</div>
                <div className="prompt-btn-desc">脉络梳理 + 声量预测</div>
              </div>
            </Button>
          </div>
        </div>

        {/* 3. Bottom Area: 标准对话流工作区 */}
        <div className="chat-workspace">
          {/* 重新分析按钮 */}
          <div className="reanalyze-bar">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined spin={isAnalyzing} />}
              onClick={handleReanalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? '重新分析中...' : '重新分析'}
            </Button>
          </div>

          {/* 对话消息列表 */}
          <div className="messages-container">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`message-item ${msg.type} ${msg.isStreaming ? 'streaming' : ''}`}
              >
                <Avatar
                  className={`message-avatar ${msg.type}`}
                  icon={msg.type === 'ai' ? <RobotOutlined /> : null}
                >
                  {msg.type === 'user' ? '我' : null}
                </Avatar>
                <div className="message-content">
                  <div className="message-bubble">{msg.content}</div>
                  <div className="message-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框区域 */}
          <div className="input-area">
            <Input.TextArea
              placeholder="请输入您的追问指令..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onPressEnter={e => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="chat-input"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="send-btn"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistantDrawer;
