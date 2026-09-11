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
    dispatchProvinceInstruction
  } = useAppStore();

  const isProvincePost = currentPost === 'province_post';
  const isMunicipalPost = currentPost === 'municipal_post';

  const [activeTab, setActiveTab] = useState('judge');
  const [levelVal, setLevelVal] = useState<string>('一级 (特急)');
  const [opinionTypeVal, setOpinionTypeVal] = useState<string>('涉稳舆情');
  const [manualOpinionText, setManualOpinionText] = useState('');

  // 省厅指令下发专用状态与配置项
  const [dispatchPanelOpen, setDispatchPanelOpen] = useState(false);
  const [targetUnit, setTargetUnit] = useState<string>('苏州市公安局');
  const [directives, setDirectives] = useState<string[]>([
    '线下核实',
    '属地删帖',
    '落地查人',
    '情况反馈'
  ]);
  const [timeLimit, setTimeLimit] = useState<string>('24小时内');
  const [directiveRemark, setDirectiveRemark] = useState<string>(
    '请苏州市局迅速安排核查当事人具体动向，防止二次煽动炒作，处置进展及时回传。'
  );

  useEffect(() => {
    if (currentAiOpinion) {
      setManualOpinionText(
        currentAiOpinion.manualOpinion ||
        `经省厅网安总队综合研判：该事件属于涉重点企事业单位的不实谣言，请属地迅速组织落地核实并督促辟谣。`
      );
      if (currentAiOpinion.levelText) {
        setLevelVal(currentAiOpinion.levelText);
      }
      if (currentAiOpinion.categoryTag) {
        setOpinionTypeVal(currentAiOpinion.categoryTag);
      }
      if (currentAiOpinion.region?.includes('苏州') || currentAiOpinion.sourceUnitTag?.includes('苏州')) {
        setTargetUnit('苏州市公安局');
      }
      // 省厅账号进入默认激活指令下达视图
      if (isProvincePost) {
        setDispatchPanelOpen(true);
      } else {
        setDispatchPanelOpen(false);
      }
    }
  }, [currentAiOpinion, isProvincePost]);

  if (!currentAiOpinion) return null;

  const handleCopyText = () => {
    navigator.clipboard?.writeText(manualOpinionText);
    message.success('已复制人工研判意见内容');
  };

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
                { value: '姑苏区', label: '姑苏区' },
                { value: '江宁区', label: '江宁区' },
                { value: '沭阳县', label: '沭阳县' },
                { value: '昆山市', label: '昆山市' }
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
                onClick={() => {
                  setActiveTab('judge');
                  setDispatchPanelOpen(false);
                }}
                className={`cursor-pointer pb-2 ${activeTab === 'judge' && !dispatchPanelOpen ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                分析研判
              </span>
              <span
                onClick={() => {
                  setActiveTab('process');
                  setDispatchPanelOpen(false);
                }}
                className={`cursor-pointer pb-2 ${activeTab === 'process' && !dispatchPanelOpen ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                处置过程
              </span>
              <span
                onClick={() => {
                  setActiveTab('detail');
                  setDispatchPanelOpen(false);
                }}
                className={`cursor-pointer pb-2 ${activeTab === 'detail' && !dispatchPanelOpen ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                处置详情
              </span>
            </div>

            {/* 蓝色边框操作按钮【下达处置指令】 */}
            <Button
              type={dispatchPanelOpen ? 'primary' : 'default'}
              size="small"
              icon={<SendOutlined />}
              onClick={() => setDispatchPanelOpen(!dispatchPanelOpen)}
              className={`!text-xs ${
                dispatchPanelOpen
                  ? '!bg-blue-600 !text-white shadow-2xs'
                  : '!text-blue-600 !border-blue-500 hover:!bg-blue-50'
              }`}
            >
              下达处置指令
            </Button>
          </div>

          {dispatchPanelOpen ? (
            /* 省厅专属指令下发配置面板 */
            <div className="p-3.5 bg-blue-50/40 border border-blue-200 rounded-lg space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-xs" />
                  <span className="text-xs font-bold text-slate-800">
                    省厅实战指挥派单 · 下达处置指令
                  </span>
                </div>
                <span className="text-[11px] text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded font-mono font-medium">
                  任务单号: ZL20260911001
                </span>
              </div>

              {/* 1. 执行目标单位 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  <span className="text-rose-500 mr-1">*</span>执行目标单位:
                </label>
                <Select
                  value={targetUnit}
                  onChange={setTargetUnit}
                  size="middle"
                  className="w-full text-xs"
                  options={[
                    { value: '苏州市公安局', label: '苏州市公安局 (来源上报单位)' },
                    { value: '南京市公安局', label: '南京市公安局' },
                    { value: '无锡市公安局', label: '无锡市公安局' },
                    { value: '常州市公安局', label: '常州市公安局' },
                    { value: '南通市公安局', label: '南通市公安局' },
                    { value: '宿迁市公安局', label: '宿迁市公安局' }
                  ]}
                />
              </div>

              {/* 2. 处置要求 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>处置要求:
                </label>
                <Checkbox.Group
                  value={directives}
                  onChange={(vals) => setDirectives(vals as string[])}
                  className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded border border-blue-100"
                >
                  <Checkbox value="线下核实">
                    <span className="font-medium text-slate-700">线下核实</span>
                  </Checkbox>
                  <Checkbox value="属地删帖">
                    <span className="font-medium text-slate-700">属地删帖</span>
                  </Checkbox>
                  <Checkbox value="落地查人">
                    <span className="font-medium text-slate-700">落地查人</span>
                  </Checkbox>
                  <Checkbox value="情况反馈">
                    <span className="font-medium text-slate-700">情况反馈</span>
                  </Checkbox>
                </Checkbox.Group>
              </div>

              {/* 3. 处置时限 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  <span className="text-rose-500 mr-1">*</span>处置时限:
                </label>
                <Select
                  value={timeLimit}
                  onChange={setTimeLimit}
                  size="middle"
                  className="w-full text-xs"
                  options={[
                    { value: '2小时内', label: '2小时内 (特急处置)' },
                    { value: '6小时内', label: '6小时内 (紧急处置)' },
                    { value: '24小时内', label: '24小时内' },
                    { value: '48小时内', label: '48小时内' }
                  ]}
                />
              </div>

              {/* 4. 补充批示意见 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  <span className="text-rose-500 mr-1">*</span>补充批示意见:
                </label>
                <TextArea
                  rows={3}
                  value={directiveRemark}
                  onChange={(e) => setDirectiveRemark(e.target.value)}
                  placeholder="请输入领导补充批示意见..."
                  className="text-xs"
                />
              </div>
            </div>
          ) : (
            /* 常规研判表单 */
            <>
              {/* 分析研判等级与分类 */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <span className="w-1 h-3.5 bg-blue-600 rounded-xs" />
                  <span>分析研判</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 whitespace-nowrap">等级:</span>
                    <Select
                      value={levelVal}
                      onChange={setLevelVal}
                      size="small"
                      className="w-full text-xs"
                      options={[
                        { value: '一级 (特急)', label: '一级 (特急)' },
                        { value: '二级 (高)', label: '二级 (高)' },
                        { value: '三级 (中)', label: '三级 (中)' },
                        { value: '四级 (低)', label: '四级 (低)' }
                      ]}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 whitespace-nowrap">舆情类型:</span>
                    <Select
                      value={opinionTypeVal}
                      onChange={setOpinionTypeVal}
                      size="small"
                      className="w-full text-xs"
                      options={[
                        { value: '涉稳舆情', label: '涉稳舆情' },
                        { value: '公共安全事故', label: '公共安全事故' },
                        { value: '涉警维权舆情', label: '涉警维权舆情' },
                        { value: '涉企涉经济纠纷', label: '涉企涉经济纠纷' }
                      ]}
                    />
                  </div>
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
                  rows={4}
                  value={manualOpinionText}
                  onChange={(e) => setManualOpinionText(e.target.value)}
                  placeholder="请输入人工研判意见"
                  className="text-xs"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 弹窗底栏操作栏 */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          当前操作岗位：
          <strong className="text-blue-600 font-medium ml-1">
            {isProvincePost
              ? '省厅网安总队 - 指挥岗 (公安内网版)'
              : '市局网安支队 - 审核岗 (互联网独立版)'}
          </strong>
        </div>

        <div className="flex items-center gap-2.5">
          <Button onClick={closeAiJudgeModal} className="!text-xs !h-8 !px-3 text-slate-600">
            取消
          </Button>

          {/* 若为省厅岗位或处于指令面板中，提供【确认下达指令】 */}
          {isProvincePost || dispatchPanelOpen ? (
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => {
                dispatchProvinceInstruction(
                  currentAiOpinion.id,
                  targetUnit,
                  directives,
                  timeLimit,
                  directiveRemark
                );
              }}
              className="!bg-blue-600 hover:!bg-blue-500 !text-xs !h-8 !px-5 shadow-sm font-semibold tracking-wide"
            >
              确认下达指令
            </Button>
          ) : (
            /* 市局审核岗按钮组 */
            <>
              <Button
                type="default"
                onClick={() => saveLocalOnly(currentAiOpinion.id)}
                className="!bg-white !border-slate-300 hover:!border-slate-400 !text-slate-700 !text-xs !h-8 !px-3 font-medium"
              >
                仅保留地市自办
              </Button>

              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  const starsMap: Record<string, number> = {
                    '一级 (特急)': 5,
                    '二级 (高)': 4,
                    '三级 (中)': 3,
                    '四级 (低)': 2
                  };
                  approveAndSyncProvince(
                    currentAiOpinion.id,
                    manualOpinionText,
                    '市局审核通过并同步省厅',
                    levelVal,
                    starsMap[levelVal] || 4
                  );
                }}
                className="!bg-blue-600 hover:!bg-blue-500 !text-xs !h-8 !px-4 shadow-sm font-semibold tracking-wide"
              >
                审核通过并同步省厅
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
