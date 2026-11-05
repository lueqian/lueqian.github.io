---
name: annotate
description: 当用户需要对原型中的功能、细节或界面组件添加批注、说明、业务规则或数字标签时使用，或当用户输入「/备注」、「/annotate」、「/批注」等指令时使用。
---

# 原型功能与细节批注规范 (/备注)

本项目内置了一套轻量级、高稳定性的原型批注套件（`@/common/Annotation`）。当用户提出批注需求或输入 `/备注` 时，遵循本流程为目标组件添加数字角标、悬停气泡与统一抽屉看板。

---

## 🎯 触发场景

1. **用户输入快捷指令**：例如 `/备注 导出按钮 需校验超管权限，支持导出Excel`
2. **自然语言需求**：例如 *“帮我在顶部搜索框打个备注：支持拼音首字母模糊检索”*、*“给这个表格的‘一键处置’操作加个数字批注说明”*

---

## 🛠️ 核心套件导入方式

```tsx
import { Annotated, AnnotationBoard, AnnotationProvider } from '@/common/Annotation';
```

---

## 📋 执行步骤

### 第一步：定位目标原型与组件
1. 根据上下文或用户指定，定位对应的原型页面代码（例如 `src/prototypes/<原型名>/index.tsx` 或对应子页面）。
2. 在 JSX 代码中找到需要标注的目标节点（按钮、输入框、卡片、弹窗或操作行）。

### 第二步：确定数字序号 (pin)
1. 检索当前页面中已有的 `<Annotated pin={...}>`。
2. 找到当前已使用的最大数字序号，新批注自动使用下一个序号（从 `1` 开始，递增为 `2`, `3`...）。

### 第三步：代码包裹与集成
1. **确保全局 Provider 与看板**：
   - 检查原型顶层容器，确保在最外层包裹了 `<AnnotationProvider>`：
     ```tsx
     export default function PrototypePage() {
       return (
         <AnnotationProvider>
           <div className="min-h-screen ...">
             {/* 原型内容 */}
             
             {/* 页面底部看板挂件（自动汇总所有批注，带一键演示隐藏开关） */}
             <AnnotationBoard />
           </div>
         </AnnotationProvider>
       );
     }
     ```
2. **包裹目标组件**：
   - 使用 `<Annotated>` 包裹目标节点：
     ```tsx
     <Annotated
       pin={1}
       title="批量导出规则"
       note="仅超管与值班长可见。点击后校验在线状态，支持导出脱敏 Excel 与标准化政务模板。"
       tag="权限控制"
       placement="top-right"
     >
       <Button type="primary" icon={<DownloadOutlined />}>
         批量导出
       </Button>
     </Annotated>
     ```

### 第四步：参数规范指南
| 属性 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `pin` | `number` | **必填**。批注序号，数字角标展示内容 | `1`, `2` |
| `note` | `string` | **必填**。批注详情说明文本，支持换行排版 | `"点击后唤起派单确认弹窗..."` |
| `title` | `string` | 可选。批注标题简述 | `"派单交互规则"` |
| `tag` | `string` | 可选。业务类型标签 | `"交互规则"` / `"接口依赖"` / `"权限控制"` |
| `placement` | `string` | 可选。角标位置：`top-right`（默认）、`top-left`、`bottom-right`、`bottom-left` | `"top-right"` |
| `color` | `string` | 可选。角标背景色（默认 `#1677ff`） | `"#ff4d4f"`（告警/重要）、`"#52c41a"`（通过） |

---

## 💬 执行后向用户反馈

完成修改后，简明扼要向用户反馈：
1. 已在哪个组件上添加了数字标签 **❶ / ❷**；
2. 简述悬停气泡与右下角看板的互动方式；
3. 提示演示时可通过看板右下角眼睛图标一键隐藏角标。
