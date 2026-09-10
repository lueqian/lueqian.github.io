import React, { useState, useEffect } from 'react';
import {
  Modal,
  Select,
  Input,
  Checkbox,
  Button,
  Tag,
  Tabs,
  Rate,
  Row,
  Col,
  message,
  Tooltip
} from 'antd';
import {
  CloseOutlined,
  CopyOutlined,
  SendOutlined,
  ThunderboltFilled,
  CaretDownOutlined,
  CaretUpOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { OpinionItem } from '../types';

const { TextArea } = Input;
const { Option } = Select;

export const AiJudgeModal: React.FC = () => {
  const {
    aiModalOpen,
    closeAiJudgeModal,
    currentAiOpinion,
    currentPost,
    approveAndSyncProvince,
    saveLocalOnly,
    dispatchInstruction
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('judge');
  const [levelVal, setLevelVal] = useState<string>('二级 (高)');
  const [opinionTypeVal, setOpinionTypeVal] = useState<string>('公共安全事故');
  const [targetDistrict, setTargetDistrict] = useState<string>('忠县公安局');
  const [manualOpinionText, setManualOpinionText] = useState('');
  const [localUnitDirectives, setLocalUnitDirectives] = useState<string[]>(['信息编报']);
  const [districtDirectives, setDistrictDirectives] = useState<string[]>(['线下核实', '属地落实']);

  useEffect(() => {
    if (currentAiOpinion) {
      setManualOpinionText(
        `经市局网安支队会同相关部门研判定性：该事件属于${currentAiOpinion.categoryTag || '公共安全'}类舆情，建议属地落实线下核查与官方澄清，防范二次舆论发酵。`
      );
    }
  }, [currentAiOpinion]);

  if (!currentAiOpinion) return null;

  const handleCopyText = () => {
    navigator.clipboard?.writeText(manualOpinionText);
    message.success('已复制人工研判意见内容');
  };

  const handleDispatch = () => {
    dispatchInstruction(targetDistrict, currentAiOpinion.title);
  };

  const isMunicipalPost = currentPost === 'municipal_post';

  return (
    <Modal
      open={aiModalOpen}
      onCancel={closeAiJudgeModal}
      footer={null}
      width={1120}
      centered
      destroyOnClose
      closeIcon={<CloseOutlined className="text-slate-400 hover:text-slate-700 text-sm" />}
      styles={{ body: { padding: '16px 24px 20px 24px' } }}
    >
      {/* 弹窗顶部标头 */}
      <div className="pb-3 border-b border-slate-200">
        <div className="text-sm font-bold text-slate-800 mb-2">AI辅助研判</div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">
              {currentAiOpinion.title}
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-[#efe8ff] text-[#7c3aed] border border-[#ddd6fe]">
              AI {currentAiOpinion.isHot ? '热敏' : '非热敏'}
            </span>
            {currentAiOpinion.syncToProvince && (
              <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-amber-50 text-amber-600 border border-amber-200">
                {currentAiOpinion.auditStatus === '已通过' ? '已同步省厅' : '待市局审核'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Rate disabled allowHalf defaultValue={currentAiOpinion.stars} className="text-amber-400 text-xs" />
            <span className="text-xs font-semibold text-slate-600">{currentAiOpinion.stars}星</span>
          </div>
        </div>

        {/* 涉事属性行 */}
        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">涉事属地:</span>
            <span className="font-medium text-slate-700">{currentAiOpinion.region}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">责任属地:</span>
            <Select
              defaultValue={currentAiOpinion.region}
              size="small"
              className="w-28 text-xs"
              options={[
                { value: '渝北区', label: '渝北区' },
                { value: '垫江县', label: '垫江县' },
                { value: '梁平区', label: '梁平区' },
                { value: '忠县', label: '忠县' }
              ]}
            />
          </div>
          <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
            数据来源: {currentAiOpinion.sourceType}
          </span>
          <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
            {currentAiOpinion.reportTime} {currentAiOpinion.reporterUnit}
          </span>
          <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
            {currentAiOpinion.statusText}
          </span>
        </div>
      </div>

      {/* 主体双栏左右布局 */}
      <div className="grid grid-cols-12 gap-6 mt-4 select-none">
        {/* 左栏：事件概述与三大指数 (占 6/12) */}
        <div className="col-span-6 pr-2 border-r border-slate-200 space-y-4 max-h-[580px] overflow-y-auto custom-scrollbar">
          {/* 事件概述 */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
              <span className="w-1 h-3.5 bg-blue-600 rounded-xs" />
              <span>事件概述</span>
            </div>

            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-2.5 bg-[#f8fafc] border border-slate-200 rounded-md">
                <div className="flex items-start gap-1.5">
                  <span className="bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                    AI 摘要
                  </span>
                  <p className="text-slate-600 text-xs mt-0.5">{currentAiOpinion.aiSummary}</p>
                </div>
              </div>

              <div className="p-2.5 bg-[#f8fafc] border border-slate-200 rounded-md">
                <div className="flex items-start gap-1.5">
                  <span className="bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                    AI 研判
                  </span>
                  <p className="text-slate-600 text-xs mt-0.5">{currentAiOpinion.aiJudgment}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 三大指数面板 */}
          <div>
            <div className="grid grid-cols-3 gap-2.5">
              {/* 舆情指数 */}
              <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>舆情指数</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-800">{currentAiOpinion.opinionScore}</span>
                  <span className="text-xs text-slate-400">/ 低</span>
                </div>
                <div className="mt-1 text-[10px] text-emerald-600 flex items-center gap-0.5">
                  <CaretDownOutlined /> 0% 0 <span className="text-slate-400 ml-1">对比上周期</span>
                </div>
              </div>

              {/* 网信指数 */}
              <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>网信指数</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-800">{currentAiOpinion.webIndex}</span>
                  <span className="text-xs text-slate-400">/ 低</span>
                </div>
                <div className="mt-1 text-[10px] text-rose-500 flex items-center gap-0.5">
                  <CaretUpOutlined /> {currentAiOpinion.webChangeRate || '▲ 15.2% 54'}
                </div>
              </div>

              {/* 部级指数 */}
              <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>部级指数</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-800">{currentAiOpinion.ministryIndex}</span>
                  <span className="text-xs text-slate-400">/ 低</span>
                </div>
                <div className="mt-1 text-[10px] text-rose-500 flex items-center gap-0.5">
                  <CaretUpOutlined /> {currentAiOpinion.ministryChangeRate || '▲ 10.2% 58'}
                </div>
              </div>
            </div>
          </div>

          {/* 附件总览 */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
              <span className="w-1 h-3.5 bg-blue-600 rounded-xs" />
              <span>附件总览</span>
            </div>
            <div className="h-24 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center text-xs text-slate-400">
              暂无视频附件
            </div>
          </div>

          {/* 原发热度与相似信息 */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                <span className="w-1 h-3.5 bg-blue-600 rounded-xs" />
                <span>原发热度</span>
              </div>
              <span className="text-[11px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded">
                数据来源: 主动发现
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                <span className="w-1 h-3.5 bg-blue-600 rounded-xs" />
                <span>相似信息 0</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center text-xs text-slate-400">
                暂无相似信息
              </div>
            </div>
          </div>
        </div>

        {/* 右栏：研判处置与指令下达 (占 6/12) */}
        <div className="col-span-6 space-y-4 max-h-[580px] overflow-y-auto custom-scrollbar">
          {/* 顶部 Tab 与指令下达按钮 */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <div className="flex items-center gap-6 text-xs font-semibold">
              <span
                onClick={() => setActiveTab('judge')}
                className={`cursor-pointer pb-2 ${activeTab === 'judge' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
              >
                分析研判
              </span>
              <span
                onClick={() => setActiveTab('process')}
                className={`cursor-pointer pb-2 ${activeTab === 'process' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
              >
                处置过程
              </span>
              <span
                onClick={() => setActiveTab('detail')}
                className={`cursor-pointer pb-2 ${activeTab === 'detail' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
              >
                处置详情
              </span>
            </div>

            <Button
              type="default"
              size="small"
              icon={<SendOutlined />}
              onClick={handleDispatch}
              className="!text-xs !text-blue-600 !border-blue-500 hover:!bg-blue-50"
            >
              下达处置指令
            </Button>
          </div>

          {/* 分析研判等级与分类 */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
              <span className="w-1 h-3.5 bg-blue-600 rounded-xs" />
              <span>分析研判</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">等级:</span>
                <Select
                  value={levelVal}
                  onChange={setLevelVal}
                  size="small"
                  className="w-full"
                  options={[
                    { value: '一级 (特急)', label: '一级 (特急)' },
                    { value: '二级 (高)', label: '二级 (高)' },
                    { value: '三级 (中)', label: '三级 (中)' },
                    { value: '四级 (低)', label: '四级 (低)' }
                  ]}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">舆情类型:</span>
                <Select
                  value={opinionTypeVal}
                  onChange={setOpinionTypeVal}
                  size="small"
                  className="w-full"
                  options={[
                    { value: '公共安全事故', label: '公共安全事故' },
                    { value: '涉警维权舆情', label: '涉警维权舆情' },
                    { value: '涉校园学生安全', label: '涉校园学生安全' },
                    { value: '涉企涉经济纠纷', label: '涉企涉经济纠纷' }
                  ]}
                />
              </div>
            </div>

            <div className="mt-2">
              <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded border border-blue-200">
                AI 初研 1
              </span>
            </div>
          </div>

          {/* 人工研判意见 */}
          <div>
            <div className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>人工研判意见</span>
              <span
                onClick={handleCopyText}
                className="text-blue-600 font-normal cursor-pointer hover:underline flex items-center gap-1 text-[11px]"
              >
                <CopyOutlined /> 一键复制
              </span>
            </div>
            <TextArea
              rows={3}
              value={manualOpinionText}
              onChange={(e) => setManualOpinionText(e.target.value)}
              placeholder="请输入人工研判意见"
              className="text-xs"
            />
          </div>

          {/* 下一步指令下达 */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              <span>下一步指令下达</span>
            </div>

            <div className="text-xs text-slate-500 font-medium">常用指令</div>

            {/* 本单位指令 */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-2">
              <div className="font-semibold text-slate-700 flex items-center gap-1">
                <span className="w-1 h-3 bg-blue-500 rounded-xs" />
                <span>本单位指令</span>
              </div>
              <Checkbox.Group
                value={localUnitDirectives}
                onChange={(vals) => setLocalUnitDirectives(vals as string[])}
                className="grid grid-cols-4 gap-1 text-xs"
              >
                <Checkbox value="通报六支队及法制">通报六支队及法制</Checkbox>
                <Checkbox value="领导研判">领导研判</Checkbox>
                <Checkbox value="信息编报">信息编报</Checkbox>
                <Checkbox value="通报网信">通报网信</Checkbox>
                <Checkbox value="通报警种">通报警种</Checkbox>
                <Checkbox value="总队落查">总队落查</Checkbox>
                <Checkbox value="协调删帖">协调删帖</Checkbox>
                <Checkbox value="协调限流">协调限流</Checkbox>
              </Checkbox.Group>
              <div className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                补充指令内容 填写
              </div>
            </div>

            {/* 执行单位指令 */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-700 flex items-center gap-1">
                  <span className="w-1 h-3 bg-blue-500 rounded-xs" />
                  <span>执行单位指令</span>
                </div>
                <Select
                  value={targetDistrict}
                  onChange={setTargetDistrict}
                  size="small"
                  className="w-36 text-xs"
                  options={[
                    { value: '忠县公安局', label: '忠县公安局' },
                    { value: '渝北区分局', label: '渝北区分局' },
                    { value: '垫江县公安局', label: '垫江县公安局' },
                    { value: '梁平区分局', label: '梁平区分局' }
                  ]}
                />
              </div>

              <Checkbox.Group
                value={districtDirectives}
                onChange={(vals) => setDistrictDirectives(vals as string[])}
                className="grid grid-cols-3 gap-1 text-xs"
              >
                <Checkbox value="持续监测">持续监测</Checkbox>
                <Checkbox value="线下核实">线下核实</Checkbox>
                <Checkbox value="属地删帖">属地删帖</Checkbox>
                <Checkbox value="平台举报">平台举报</Checkbox>
                <Checkbox value="属地落实">属地落实</Checkbox>
              </Checkbox.Group>
              <div className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                补充指令内容 填写
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 弹窗底栏按钮操作区 */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
        <div className="text-xs text-slate-400">
          当前岗位：<strong className="text-slate-600">{currentPost === 'municipal_post' ? '池州网安支队-审核岗' : currentPost === 'district_post' ? '池州贵池分局-经办岗' : '省厅网安总队-指挥岗'}</strong>
        </div>

        <div className="flex items-center gap-2">
          {/* 若处于市局审核岗，内嵌“审核通过并报送省厅”和“仅本地留存” */}
          {isMunicipalPost && (
            <>
              <Button
                type="default"
                onClick={() => saveLocalOnly(currentAiOpinion.id)}
                className="!text-xs text-slate-600 hover:text-slate-800"
              >
                仅本地留存
              </Button>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() =>
                  approveAndSyncProvince(currentAiOpinion.id, manualOpinionText, '市局定稿核准同步')
                }
                className="!bg-emerald-600 hover:!bg-emerald-500 !text-xs"
              >
                审核通过并报送省厅
              </Button>
            </>
          )}

          <Button onClick={closeAiJudgeModal} className="!text-xs">
            取消
          </Button>

          <Button
            type="primary"
            onClick={() => {
              message.success('已完成人工研判并保存记录');
              closeAiJudgeModal();
            }}
            className="!bg-blue-600 hover:!bg-blue-500 !text-xs"
          >
            完成研判
          </Button>
        </div>
      </div>
    </Modal>
  );
};
