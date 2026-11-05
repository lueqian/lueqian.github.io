import React from 'react';

export type AnnotationPlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface AnnotationItem {
  id: string;
  pin: number;
  title?: string;
  note: string;
  tag?: string;
  color?: string;
  placement?: AnnotationPlacement;
  createdAt: number;
}

export interface AnnotationContextValue {
  /** 当前所有注册的批注项列表（按 pin 升序） */
  annotations: AnnotationItem[];
  /** 是否全局显示批注徽标与气泡（演示模式开关） */
  visible: boolean;
  /** 切换全局批注显示状态 */
  setVisible: (visible: boolean | ((prev: boolean) => boolean)) => void;
  /** 注册批注项 */
  registerAnnotation: (item: AnnotationItem) => void;
  /** 注销批注项 */
  unregisterAnnotation: (id: string) => void;
  /** 当前选中的批注项 ID（用于高亮联动） */
  activeId: string | null;
  /** 设置当前激活的批注 */
  setActiveId: (id: string | null) => void;
}

export interface AnnotatedProps {
  /** 批注序号，如 1, 2, 3... */
  pin: number;
  /** 批注说明正文，支持纯文本或换行排版 */
  note: string;
  /** 可选批注标题 */
  title?: string;
  /** 可选业务标签（如“交互规则”、“权限限制”等） */
  tag?: string;
  /** 角标显示方位，默认 top-right */
  placement?: AnnotationPlacement;
  /** 自定义徽标背景色，默认品牌蓝 */
  color?: string;
  /** 包裹的子组件 */
  children: React.ReactNode;
  /** 额外自定义类名 */
  className?: string;
}

export interface AnnotationBoardProps {
  /** 面板抽屉标题，默认为“功能与细节批注看板” */
  title?: string;
  /** 抽屉弹出位置，默认 bottom（底部抽屉），支持 right（侧边栏抽屉） */
  placement?: 'bottom' | 'right';
  /** 是否默认展开抽屉 */
  defaultOpen?: boolean;
}
