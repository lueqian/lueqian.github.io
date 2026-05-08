const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Arial", hAnsi: "Arial", eastAsia: "Microsoft YaHei" },
          size: 24
        }
      }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: { ascii: "Arial", hAnsi: "Arial", eastAsia: "Microsoft YaHei" } },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0, keepNext: false, keepLines: false } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: { ascii: "Arial", hAnsi: "Arial", eastAsia: "Microsoft YaHei" } },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1, keepNext: false, keepLines: false } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: { ascii: "Arial", hAnsi: "Arial", eastAsia: "Microsoft YaHei" } },
        paragraph: { spacing: { before: 120, after: 120 }, outlineLevel: 2, keepNext: false, keepLines: false } },
    ]
  },
  numbering: {
    config: [
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // 标题
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        children: [new TextRun("数说蓝鹰 - TG群组管理功能设计文档")]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "广州国安定制版 V1.0", size: 22, color: "666666" })]
      }),
      new Paragraph({ children: [] }),
      
      // 版本信息
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("版本信息")]
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "版本号", bold: true })] })] }),
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "提交日期", bold: true })] })] }),
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "提交人", bold: true })] })] }),
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "备注", bold: true })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("V1.0")] })] }),
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("2026-05-08")] })] }),
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("产品团队")] })] }),
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("初始版本")] })] }),
            ]
          }),
        ]
      }),
      new Paragraph({ children: [] }),
      
      // 需求背景
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("需求背景")]
      }),
      new Paragraph({
        children: [new TextRun("针对广州国安部门的业务需求，在数说蓝鹰舆情监测系统的"重点源"模块中新增"TG群组管理"功能。该功能主要用于对Telegram平台上的特定群组进行定向监测，帮助相关部门及时发现和处置互联网安全相关的敏感舆情。")]
      }),
      new Paragraph({ children: [] }),
      
      // 功能概述
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("功能概述")]
      }),
      new Paragraph({
        children: [new TextRun("TG群组管理模块包含以下核心功能：")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "群组管理", bold: true }), new TextRun("：TG群组的增删改查、基础信息管理、监测状态控制")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "监测任务", bold: true }), new TextRun("：配置监测规则、设置敏感词、定义预警级别")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "统计分析", bold: true }), new TextRun("：群组活跃度、敏感指数、消息量等数据可视化")]
      }),
      new Paragraph({ children: [] }),
      
      // 功能清单
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("功能清单")]
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [1560, 3120, 4680],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "模块", bold: true })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "功能点", bold: true })] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "功能描述", bold: true })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, rowSpan: 4, children: [new Paragraph({ children: [new TextRun("群组管理")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("群组列表")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("展示所有TG群组，支持搜索、筛选、分页")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("添加群组")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("录入新的TG群组信息，包括群组链接、名称、描述等")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("编辑群组")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("修改已有群组的基础信息和配置")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("删除群组")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("移除不再监测的群组，支持批量操作")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, rowSpan: 3, children: [new Paragraph({ children: [new TextRun("监测任务")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("任务列表")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("展示所有监测任务，查看任务状态和执行情况")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("新建任务")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("配置新的监测任务，设置监测规则和预警条件")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("敏感词管理")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("定义触发预警的敏感关键词列表")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, rowSpan: 2, children: [new Paragraph({ children: [new TextRun("统计分析")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("数据看板")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("展示监测群组数量、高风险群组数、日消息总量等核心指标")] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("群组详情")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("查看单个群组的详细信息、成员数、消息趋势等")] })] }),
            ]
          }),
        ]
      }),
      new Paragraph({ children: [] }),
      
      // 页面结构
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("页面结构")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("1. 群组管理页面")]
      }),
      new Paragraph({
        children: [new TextRun("页面包含以下区域：")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "统计卡片区", bold: true }), new TextRun("：展示监测群组总数、高风险群组数、今日消息总量、活跃监测任务数")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "筛选区", bold: true }), new TextRun("：支持按预警级别、监测状态、责任部门进行筛选")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "群组列表", bold: true }), new TextRun("：卡片式布局展示群组信息，包含群组名称、成员数、日消息数、敏感指数等")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "分页器", bold: true }), new TextRun("：支持分页浏览")]
      }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("2. 监测任务页面")]
      }),
      new Paragraph({
        children: [new TextRun("页面包含以下区域：")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "新建任务按钮", bold: true }), new TextRun("：快速创建新的监测任务")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "任务列表", bold: true }), new TextRun("：展示所有监测任务，包含任务名称、目标群组、监测关键词、任务状态")]
      }),
      new Paragraph({ children: [] }),
      
      // 数据字段
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("数据字段定义")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("TG群组数据结构")]
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [2340, 2340, 4680],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "字段名", bold: true })] })] }),
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "类型", bold: true })] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "说明", bold: true })] })] }),
            ]
          }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("groupId")] })] }),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("string")] })] }),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("群组唯一标识")] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("groupName")] })] }),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("string")] })] }),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("群组名称")] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("groupLink")] })] }),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("string")] })] }),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("Telegram群组链接")] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("memberCount")] })] }),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("number")] })] }),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("群组成员数量")] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("dailyMessageCount")] })] }),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("number")] })] }),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("每日消息数量")] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("sensitiveScore")] })] }),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("number")] })] }),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("敏感指数(0-100)")] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("monitorStatus")] })] }),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("enum")] })] }),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("监测状态: active/paused/error")] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("alertLevel")] })] }),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("enum")] })] }),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("预警级别: high/medium/low/none")] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("responsibleDept")] })] }),
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("string")] })] }),
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("责任部门")] })] }),
          ]}),
        ]
      }),
      new Paragraph({ children: [] }),
      
      // 技术实现
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("技术实现说明")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("文件结构")]
      }),
      new Paragraph({
        children: [new TextRun("新增文件：")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("pages/TGGroupManage.tsx - TG群组管理页面组件")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("style.css - 追加TG群组管理相关样式")]
      }),
      new Paragraph({ children: [] }),
      
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("修改文件")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("index.tsx - 添加TG群组管理二级菜单配置")]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("pages/Sources.tsx - 支持activeSubNav属性，根据tab切换显示内容")]
      }),
      new Paragraph({ children: [] }),
      
      // 项目信息
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("项目信息")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "原项目：", bold: true }), new TextRun("eagle_datastory")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "新项目：", bold: true }), new TextRun("eagle_datastory_security_GuangZhouGuoan_branch")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "客户：", bold: true }), new TextRun("广州国安")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "业务领域：", bold: true }), new TextRun("互联网安全敏感舆情监测")]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/sessions/69fd4dfc9a0f59ce564d24f9/workspace/TG群组管理功能设计文档.docx", buffer);
  console.log("Word文档已生成");
});
