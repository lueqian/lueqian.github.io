import React, { useState } from 'react';
import { Drawer, Button, Tag, Empty, Tooltip } from 'antd';
import {
  FileTextOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CloseOutlined,
  AimOutlined,
} from '@ant-design/icons';
import { useAnnotation } from './AnnotationContext';
import type { AnnotationBoardProps, AnnotationItem } from './types';

export const AnnotationBoard: React.FC<AnnotationBoardProps> = ({
  title = '功能与细节批注看板',
  placement = 'bottom',
  defaultOpen = false,
}) => {
  const { annotations, visible, setVisible, activeId, setActiveId } = useAnnotation();
  const [drawerOpen, setDrawerOpen] = useState(defaultOpen);

  if (annotations.length === 0) {
    return null;
  }

  const handleLocate = (item: AnnotationItem) => {
    setActiveId(item.id);
    const element = document.querySelector(`[data-annotation-id="${item.id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      {/* 右下角常驻悬浮唤起挂件 */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '6px 10px 6px 14px',
          borderRadius: 9999,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setDrawerOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setDrawerOpen(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: '#1f2937',
            userSelect: 'none',
          }}
        >
          <FileTextOutlined style={{ color: '#1677ff', fontSize: 15 }} />
          <span>评审批注</span>
          <span
            style={{
              background: '#1677ff',
              color: '#ffffff',
              borderRadius: 9999,
              fontSize: 11,
              padding: '1px 6px',
              fontWeight: 700,
            }}
          >
            {annotations.length}
          </span>
        </div>

        <div style={{ width: 1, height: 14, background: '#e5e7eb', margin: '0 2px' }} />

        {/* 演示模式一键切换角标显隐 */}
        <Tooltip title={visible ? '切换为纯净演示模式（隐藏角标）' : '显示批注角标'}>
          <Button
            type="text"
            size="small"
            icon={visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            onClick={() => setVisible(!visible)}
            style={{
              color: visible ? '#4b5563' : '#9ca3af',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </Tooltip>
      </div>

      {/* 展开的批注详情抽屉 */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement={placement}
        height={placement === 'bottom' ? 340 : undefined}
        width={placement === 'right' ? 440 : undefined}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileTextOutlined style={{ color: '#1677ff', fontSize: 16 }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
              <Tag color="blue" style={{ borderRadius: 10, margin: 0 }}>
                共 {annotations.length} 项批注
              </Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button
                size="small"
                icon={visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                onClick={() => setVisible(!visible)}
              >
                {visible ? '演示模式(隐藏角标)' : '显示角标'}
              </Button>
            </div>
          </div>
        }
        closable={true}
        styles={{
          body: {
            padding: '16px 20px',
            backgroundColor: '#f9fafb',
          },
        }}
      >
        {annotations.length === 0 ? (
          <Empty description="当前页面暂无批注条目" />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: placement === 'bottom' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
              gap: 12,
            }}
          >
            {annotations.map((item) => {
              const isSelected = activeId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleLocate(item)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: isSelected ? '1.5px solid #1677ff' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: '12px 14px',
                    boxShadow: isSelected
                      ? '0 4px 12px rgba(22, 119, 255, 0.15)'
                      : '0 1px 3px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 9999,
                          backgroundColor: item.color || '#1677ff',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {item.pin}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
                        {item.title || `批注 #${item.pin}`}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {item.tag && (
                        <Tag color="cyan" style={{ margin: 0, fontSize: 11, lineHeight: '18px' }}>
                          {item.tag}
                        </Tag>
                      )}
                      <Tooltip title="在页面中定位高亮">
                        <AimOutlined style={{ color: '#9ca3af', fontSize: 13 }} />
                      </Tooltip>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: '1.6',
                      color: '#4b5563',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      paddingLeft: 30,
                    }}
                  >
                    {item.note}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Drawer>
    </>
  );
};
