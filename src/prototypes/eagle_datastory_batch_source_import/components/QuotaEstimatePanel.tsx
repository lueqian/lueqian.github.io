/**
 * @name QuotaEstimatePanel - 额度预估与单日并发风控校验面板
 * @description
 * 1. Pre-occupation Model：统计当前客户名下已有任务日预占 (E_p)，叠加本次待提交任务日增量 (N_p)；
 * 2. Implicit Risk Control：前端严禁透出任何具体限额数值 (如不显示 650/1000)，超标时抛出硬阻断提示与调优建议；
 * 3. 业务基准约束：小红书平台执行合并限制，互动量更新与评论翻页合并计算 (翻页单次按 1 次计算)。
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tooltip, Spin } from 'antd';
import {
  WarningOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import {
  MOCK_CLIENT_PLATFORM_LIMITS,
  MOCK_CURRENT_OCCUPIED_DAILY_USAGE,
  MOCK_SCOPE_PLATFORM_POST_COUNTS,
  PLATFORM_KEY_MAP,
} from '../mock-data';

export interface ValidationResult {
  isValid: boolean;
  blockedPlatform?: string;
  blockedReason?: string;
  detail?: Record<string, { newUsage: number; occupied: number; limit?: number; isOver: boolean }>;
}

export interface QuotaEstimatePanelProps {
  /** 范围标签：'专题' | '重点源' | '链接' */
  scopeLabel: string;
  /** 任务类型：'interaction' | 'comment' */
  taskType?: 'interaction' | 'comment';
  /** 各平台翻页页数配置，如 { '小红书': '5', '抖音': '1' } */
  platformPageConfig?: Record<string, string>;
  /** 链接模式下的总链接数 */
  linkCount?: number;
  /** 链接模式下各平台的链接数，如 { '小红书': 20, '微博': 10 } */
  platformCounts?: Record<string, number>;
  /** 频率配置 */
  frequency?: {
    mode: string;
    value: string;
    dateRange?: any;
    customRules?: any[];
  };
  /** 所选平台列表 */
  platforms?: string[];
  /** 所选专题或重点源 ID，如 'topic_001' */
  selectedScopeId?: string;
  /** 截取策略：'all' 全量 | 'top_n' 截取优先 */
  truncationStrategy?: 'all' | 'top_n';
  /** 截取数量，如 20, 50, 100, 200 */
  topNCount?: number;
  /** 校验状态变更回调 */
  onValidationChange?: (result: ValidationResult) => void;
}

export const QuotaEstimatePanel: React.FC<QuotaEstimatePanelProps> = ({
  scopeLabel,
  taskType = 'interaction',
  platformPageConfig = {},
  linkCount = 0,
  platformCounts = {},
  frequency,
  platforms = [],
  selectedScopeId,
  truncationStrategy = 'top_n',
  topNCount = 100,
  onValidationChange,
}) => {
  const [loading, setLoading] = useState(false);

  // 1. 计算每日抓取轮次 (Rounds Per Day)
  const roundsPerDay = useMemo(() => {
    if (!frequency) return 12; // 默认每 2 小时
    if (frequency.mode === 'hour') {
      const h = parseInt(frequency.value, 10) || 2;
      return Math.ceil(24 / h);
    }
    if (frequency.mode === 'day') {
      return 1;
    }
    if (frequency.mode === 'custom' && frequency.customRules && frequency.customRules.length > 0) {
      let totalRounds = 0;
      let totalDays = 0;
      frequency.customRules.forEach((rule: any) => {
        if (rule.dateRange && rule.dateRange[0] && rule.dateRange[1]) {
          const days = rule.dateRange[1].diff(rule.dateRange[0], 'day') + 1;
          const rPerDay = rule.mode === 'hour' ? Math.ceil(24 / (parseInt(rule.value, 10) || 2)) : 1;
          totalRounds += days * rPerDay;
          totalDays += days;
        }
      });
      return totalDays > 0 ? Math.ceil(totalRounds / totalDays) : 6;
    }
    return 12;
  }, [frequency]);

  // 2. 核心计算各平台的单日新增消耗与预占核算
  const calculation = useMemo(() => {
    const platformBreakdown: Record<string, { count: number; depth: number; dailyUsage: number }> = {};
    let totalEstimatedDailyUsage = 0;
    let blockedPlatform: string | null = null;
    let isBlocked = false;

    // 确定待计算的平台集合
    const targetPlatforms =
      scopeLabel === '链接'
        ? Object.keys(platformCounts).length > 0
          ? Object.keys(platformCounts)
          : platforms
        : platforms;

    // 针对每个平台逐项计算
    targetPlatforms.forEach((platformName) => {
      // 获得平台标准 key (如 '小红书' -> 'xhs')
      const stdKey = PLATFORM_KEY_MAP[platformName] || platformName;

      // A. 计算该平台有效对象基数 (Count)
      let baseCount = 0;
      if (scopeLabel === '链接') {
        baseCount = platformCounts[platformName] || 0;
      } else {
        // 专题或重点源模式
        const scopeDistribution = selectedScopeId ? MOCK_SCOPE_PLATFORM_POST_COUNTS[selectedScopeId] : undefined;
        let rawCount = 250;
        if (scopeDistribution) {
          rawCount = scopeDistribution[platformName] || scopeDistribution[stdKey] || 250;
        }
        // 若启用 Top N 截取，基数收敛
        if (truncationStrategy === 'top_n' && topNCount) {
          baseCount = Math.min(rawCount, topNCount);
        } else {
          baseCount = rawCount;
        }
      }

      // B. 计算翻页深度 (Depth): 单次翻页按 1 次计算
      let depth = 1;
      if (taskType === 'comment') {
        const pageSetting = platformPageConfig[platformName] || '1';
        depth = parseInt(pageSetting, 10) || 1;
      }

      // C. 计算单日新增消耗 N_p = BaseCount * roundsPerDay * depth
      const newDailyUsage = baseCount * roundsPerDay * depth;
      platformBreakdown[platformName] = {
        count: baseCount,
        depth: depth,
        dailyUsage: newDailyUsage,
      };
      totalEstimatedDailyUsage += newDailyUsage;

      // D. Pre-occupation 校验: 检验是否打爆单日配额上限
      const limitConfig = MOCK_CLIENT_PLATFORM_LIMITS[platformName] || MOCK_CLIENT_PLATFORM_LIMITS[stdKey];
      const occupied = MOCK_CURRENT_OCCUPIED_DAILY_USAGE[platformName] || MOCK_CURRENT_OCCUPIED_DAILY_USAGE[stdKey];
      const occupiedTotal = occupied ? occupied.total : 0;

      if (limitConfig && limitConfig.mode === 'combined' && limitConfig.combinedLimit) {
        if (occupiedTotal + newDailyUsage > limitConfig.combinedLimit) {
          isBlocked = true;
          if (!blockedPlatform) {
            blockedPlatform = platformName;
          }
        }
      }
    });

    return {
      totalDailyUsage: totalEstimatedDailyUsage,
      platformBreakdown,
      isBlocked,
      blockedPlatform,
    };
  }, [
    scopeLabel,
    taskType,
    platformPageConfig,
    platformCounts,
    roundsPerDay,
    platforms,
    selectedScopeId,
    truncationStrategy,
    topNCount,
  ]);

  // 3. 联动与异步过渡反馈
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      onValidationChange?.({
        isValid: !calculation.isBlocked,
        blockedPlatform: calculation.blockedPlatform || undefined,
        blockedReason: calculation.isBlocked
          ? `该任务在【${calculation.blockedPlatform}】平台的预计频次超出当前系统单日并发配额`
          : undefined,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [calculation, onValidationChange]);

  const { isBlocked, blockedPlatform, totalDailyUsage, platformBreakdown } = calculation;

  return (
    <div className={`ct-quota-panel ${isBlocked ? 'ct-quota-panel--blocked' : ''}`} style={{
      border: isBlocked ? '1px solid #ff7875' : '1px solid #d9d9d9',
      borderRadius: '8px',
      background: isBlocked ? '#fff2f0' : '#fafafa',
      padding: '14px 16px',
      marginTop: '16px',
      transition: 'all 0.3s ease',
    }}>
      {/* 状态 1：超标阻断状态 (触发风控卡片) */}
      {isBlocked ? (
        <div className="ct-risk-block-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <ExclamationCircleFilled style={{ color: '#ff4d4f', fontSize: '20px', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#cf1322', marginBottom: '4px' }}>
                ⚠️ 采集负荷超出平台单日处理能力
              </div>
              <div style={{ fontSize: '13px', color: '#434343', lineHeight: '1.6', marginBottom: '10px' }}>
                检测到该任务在【<strong style={{ color: '#cf1322' }}>{blockedPlatform}</strong>】平台的日预计采集频次已超出当前系统单日并发配额。
              </div>

              <div style={{
                background: '#ffffff',
                border: '1px solid #ffd8d6',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#595959',
                lineHeight: '1.8',
              }}>
                <div style={{ fontWeight: 600, color: '#cf1322', marginBottom: '4px' }}>建议优化调整：</div>
                <div style={{ paddingLeft: '4px' }}>
                  • 减少当前任务中【{blockedPlatform}】平台的监控链接数量；<br />
                  • 降低抓取频次（如由“每 2 小时”调整为“每 8 小时”或“每天 1 次”）；<br />
                  • 降低【{blockedPlatform}】平台的评论抓取翻页深度（如由“前 10 页”调整为“前 3 页”）；<br />
                  • （若为专题/重点源）启用“按互动量优先采集”，限制单平台抓取数量。
                </div>
              </div>

              {/* 仅展示本次任务消耗试算，严禁透出具体限额 */}
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#8c8c8c' }}>
                当前配置单日预计消耗：<strong style={{ color: '#cf1322' }}>{totalDailyUsage.toLocaleString()}</strong> 次/天（每天 {roundsPerDay} 轮抓取）
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 状态 2：正常状态 (未超标) - 隐性风控原则：纯净展示度量衡，不透出具体上限 */
        <div className="ct-quota-normal">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>额度预估看板</span>
              <span style={{ fontSize: '12px', color: '#8c8c8c' }}>（每天执行 {roundsPerDay} 轮抓取）</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>预计日消耗：</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#1890ff' }}>
                {totalDailyUsage.toLocaleString()}
              </span>
              <span style={{ fontSize: '12px', color: '#1890ff' }}>次/天</span>
            </div>
          </div>

          {/* 各平台日消耗分布标签 */}
          {Object.keys(platformBreakdown).length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '8px 10px',
              background: '#ffffff',
              border: '1px solid #f0f0f0',
              borderRadius: '6px',
            }}>
              {Object.entries(platformBreakdown).map(([pName, info]) => (
                <div
                  key={pName}
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    background: '#f9f9f9',
                    borderRadius: '4px',
                  }}
                >
                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{pName}:</span>
                  <span style={{ color: '#1890ff', fontWeight: 600 }}>{info.dailyUsage.toLocaleString()}</span>
                  <span style={{ color: '#bfbfbf', fontSize: '11px' }}>次/天</span>
                  {taskType === 'comment' && info.depth > 1 && (
                    <span style={{ color: '#fa8c16', fontSize: '11px' }}>({info.depth}页)</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 底部友好说明 */}
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <span>当前配置符合信源服务并发能力要求，可正常提交采集。</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotaEstimatePanel;
