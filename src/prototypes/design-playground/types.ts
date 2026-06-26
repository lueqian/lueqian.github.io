import React from 'react';

export interface PlaygroundPage {
  id: string;
  name: string;
  category: string;
  description: string; // Markdown 或富文本格式的设计说明
  beforeCode?: string; // 优化前的代码/样式片段
  afterCode?: string;  // 优化后的代码/样式片段
  BeforeComponent: React.ComponentType;
  AfterComponent: React.ComponentType;
  PlaygroundComponent: React.ComponentType; // 带有可调节滑杆或表单的交互式演示组件
}
