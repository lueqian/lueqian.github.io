import React from 'react';
import { Card, Row, Col, Progress, Tag, Table } from 'antd';
import { LineChartOutlined, FireOutlined, RadarChartOutlined } from '@ant-design/icons';

export const SituationAwarenessPage: React.FC = () => {
  return (
    <div className="p-4 max-w-[1580px] mx-auto select-none space-y-4">
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>态势感知与全网热度宏观研判</span>
            <Tag color="cyan">实战大盘</Tag>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            汇聚全省及各市舆情峰值走势、平台声量分布与重点涉稳议题传播链条。
          </p>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={6}>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
            <span className="text-xs text-slate-500">今日全网舆情总声量</span>
            <div className="text-2xl font-bold text-blue-600 mt-1">142,890</div>
            <span className="text-[11px] text-emerald-600">较昨日 ▲ 12.4%</span>
          </div>
        </Col>
        <Col span={6}>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
            <span className="text-xs text-slate-500">涉警敏感信息占比</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">2.4%</div>
            <span className="text-[11px] text-emerald-600">处在安全平稳阈值</span>
          </div>
        </Col>
        <Col span={6}>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
            <span className="text-xs text-slate-500">已处置闭环率</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">98.2%</div>
            <span className="text-[11px] text-slate-400">平均处置时限 42 分钟</span>
          </div>
        </Col>
        <Col span={6}>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
            <span className="text-xs text-slate-500">首报确权准确率</span>
            <div className="text-2xl font-bold text-purple-600 mt-1">100%</div>
            <span className="text-[11px] text-purple-500">排重引擎自动判定</span>
          </div>
        </Col>
      </Row>
    </div>
  );
};
