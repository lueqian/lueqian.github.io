import React, { useEffect, useId } from 'react';
import { Popover, Tag } from 'antd';
import { useAnnotation } from './AnnotationContext';
import type { AnnotatedProps, AnnotationPlacement } from './types';

function getPlacementStyle(placement: AnnotationPlacement = 'top-right'): React.CSSProperties {
  switch (placement) {
    case 'top-left':
      return { top: -8, left: -8 };
    case 'bottom-right':
      return { bottom: -8, right: -8 };
    case 'bottom-left':
      return { bottom: -8, left: -8 };
    case 'top-right':
    default:
      return { top: -8, right: -8 };
  }
}

export const Annotated: React.FC<AnnotatedProps & { 'data-note'?: string; id?: number | string; desc?: string }> = ({
  pin,
  note,
  title,
  tag,
  placement = 'top-right',
  color = '#1677ff',
  children,
  className = '',
  ...rest
}) => {
  const restProps = rest as Record<string, unknown>;
  const rawPin =
    pin !== undefined
      ? pin
      : typeof restProps.id === 'number'
      ? restProps.id
      : typeof (rest as any).id === 'string' && !isNaN(Number((rest as any).id))
      ? Number((rest as any).id)
      : undefined;
  const actualPin = rawPin !== undefined ? rawPin : 1;
  const actualNote = note || (restProps['data-note'] as string) || (restProps.desc as string) || '';
  const actualTitle = title || `批注 #${actualPin}`;

  const autoId = useId();
  const id = `annotated-pin-${actualPin}-${autoId}`;
  const { visible, registerAnnotation, unregisterAnnotation, activeId, setActiveId } = useAnnotation();

  useEffect(() => {
    registerAnnotation({
      id,
      pin: actualPin,
      title: actualTitle,
      note: actualNote,
      tag,
      color,
      placement,
      createdAt: Date.now(),
    });

    return () => {
      unregisterAnnotation(id);
    };
  }, [id, actualPin, actualTitle, actualNote, tag, color, placement, registerAnnotation, unregisterAnnotation]);

  const isActive = activeId === id;

  // 气泡卡片内容
  const popoverContent = (
    <div style={{ maxWidth: 320, padding: '2px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: '#1f2937' }}>
          {actualTitle}
        </span>
        {tag && <Tag color="blue" style={{ margin: 0, fontSize: 11, lineHeight: '18px' }}>{tag}</Tag>}
      </div>
      <div
        style={{
          fontSize: 12,
          lineHeight: '1.6',
          color: '#4b5563',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {actualNote}
      </div>
    </div>
  );

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ position: 'relative' }}
      data-annotation-id={id}
      data-annotation-pin={actualPin}
    >
      {children}

      {visible && (
        <Popover
          content={popoverContent}
          trigger={['hover', 'click']}
          placement="top"
          overlayInnerStyle={{ borderRadius: 8, padding: 12, boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.12)' }}
        >
          <div
            role="button"
            tabIndex={0}
            aria-label={`批注 #${actualPin}: ${actualTitle || actualNote}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveId(id);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                setActiveId(id);
              }
            }}
            style={{
              position: 'absolute',
              ...getPlacementStyle(placement),
              width: 20,
              height: 20,
              borderRadius: 9999,
              backgroundColor: color,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              lineHeight: 1,
              border: '2px solid #ffffff',
              boxShadow: isActive
                ? '0 0 0 3px rgba(22, 119, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.25)'
                : '0 2px 8px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              zIndex: 40,
              userSelect: 'none',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              transform: isActive ? 'scale(1.15)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {actualPin}
          </div>
        </Popover>
      )}
    </div>
  );
};
