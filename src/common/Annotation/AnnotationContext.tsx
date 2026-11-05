import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { AnnotationContextValue, AnnotationItem } from './types';

const AnnotationContext = createContext<AnnotationContextValue | null>(null);

export interface AnnotationProviderProps {
  children: React.ReactNode;
  /** 默认是否显示标注，默认 true */
  defaultVisible?: boolean;
}

export const AnnotationProvider: React.FC<AnnotationProviderProps> = ({
  children,
  defaultVisible = true,
}) => {
  const [annotationsMap, setAnnotationsMap] = useState<Map<string, AnnotationItem>>(new Map());
  const [visible, setVisible] = useState<boolean>(defaultVisible);
  const [activeId, setActiveId] = useState<string | null>(null);

  const registerAnnotation = useCallback((item: AnnotationItem) => {
    setAnnotationsMap((prev) => {
      const existing = prev.get(item.id);
      if (
        existing &&
        existing.pin === item.pin &&
        existing.note === item.note &&
        existing.title === item.title &&
        existing.tag === item.tag &&
        existing.color === item.color &&
        existing.placement === item.placement
      ) {
        return prev;
      }
      const next = new Map(prev);
      next.set(item.id, item);
      return next;
    });
  }, []);

  const unregisterAnnotation = useCallback((id: string) => {
    setAnnotationsMap((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const annotations = useMemo(() => {
    return Array.from(annotationsMap.values()).sort((a, b) => a.pin - b.pin);
  }, [annotationsMap]);

  const value = useMemo<AnnotationContextValue>(
    () => ({
      annotations,
      visible,
      setVisible,
      registerAnnotation,
      unregisterAnnotation,
      activeId,
      setActiveId,
    }),
    [annotations, visible, registerAnnotation, unregisterAnnotation, activeId],
  );

  return (
    <AnnotationContext.Provider value={value}>
      {children}
    </AnnotationContext.Provider>
  );
};

export function useAnnotation(): AnnotationContextValue {
  const context = useContext(AnnotationContext);
  if (!context) {
    // 降级支持：即使外层没有手动包裹 <AnnotationProvider>，也提供安全的默认空实现
    return {
      annotations: [],
      visible: true,
      setVisible: () => {},
      registerAnnotation: () => {},
      unregisterAnnotation: () => {},
      activeId: null,
      setActiveId: () => {},
    };
  }
  return context;
}
