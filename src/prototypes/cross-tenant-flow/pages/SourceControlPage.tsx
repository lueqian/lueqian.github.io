import React from 'react';
import { Card, Table, Tag, Input, Select, Button, Space } from 'antd';
import { SafetyCertificateOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';

export const SourceControlPage: React.FC = () => {
  const data = [
    {
      id: 'sc-1',
      domain: '涉校涉幼矛盾风险源',
      riskLevel: '较高',
      monitoredUnits: '城关一中、实验小学',
      strategy: '常态化前置抓取',
      responsibleOfficer: '张警官',
      status: '监控中'
    },
    {
      id: 'sc-2',
      domain: '涉企涉经济非法集资苗头',
      riskLevel: '中等',
      monitoredUnits: '某商业广场地下车库管理处',
      strategy: '重点账号关联挖掘',
      responsibleOfficer: '李警官',
      status: '正常'
    }
  ];

  const columns = [
    { title: '源头防控风险领域', dataIndex: 'domain', key: 'domain', render: (t: string) => <strong className="text-xs text-slate-800">{t}</strong> },
    { title: '预警风险等级', dataIndex: 'riskLevel', key: 'riskLevel', width: 120, render: (l: string) => <Tag color="volcano">{l}</Tag> },
    { title: '重点关注单位/点位', dataIndex: 'monitoredUnits', key: 'monitoredUnits', render: (u: string) => <span className="text-xs text-slate-600">{u}</span> },
    { title: '防控策略机制', dataIndex: 'strategy', key: 'strategy', render: (s: string) => <Tag color="blue">{s}</Tag> },
    { title: '责任网安民警', dataIndex: 'responsibleOfficer', key: 'responsibleOfficer', width: 120, render: (o: string) => <span className="text-xs text-slate-700">{o}</span> },
    { title: '当前防控状态', dataIndex: 'status', key: 'status', width: 120, render: (st: string) => <Tag color="green">{st}</Tag> }
  ];

  return (
    <div className="p-4 max-w-[1580px] mx-auto select-none space-y-3">
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>源头防控总揽</span>
            <Tag color="blue">前置感知</Tag>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            对辖区重点涉稳主体、企事业单位及网络账号群实施前置监测，抓早抓小。
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-2xs">
        <Table dataSource={data} columns={columns} rowKey="id" pagination={false} size="middle" />
      </div>
    </div>
  );
};
