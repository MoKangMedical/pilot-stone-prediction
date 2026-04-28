# PilotStone - 飞行员尿石症风险评估系统

<div align="center">

🛡️ **基于AI的飞行员尿石症风险智能评估系统**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)

[在线演示](https://mokangmedical.github.io/pilot-stone-prediction/) · [研究报告](https://mokangmedical.github.io/pilot-stone-prediction/#/research) · [问题反馈](https://github.com/MoKangMedical/pilot-stone-prediction/issues)

</div>

---

## 📋 项目简介

飞行员因高空环境、脱水、饮食特殊性，尿石症发病率显著高于普通人群。**PilotStone** 是一个基于AI和机器学习的飞行员尿石症风险评估系统，通过整合职业特征、代谢指标和综合健康三维度数据，为飞行员提供精准的风险预测和个性化健康管理建议。

### 核心特性

- **三维风险评估** - 职业特征、代谢指标、综合健康三维度全面评估
- **AI驱动预测** - 基于机器学习模型，整合20+项临床指标
- **医疗级报告** - 自动生成专业PDF评估报告
- **全球研究前沿** - 整合PubMed最新研究论文
- **飞行员专属** - 针对高空飞行环境和特殊职业因素设计
- **即时评估** - 5分钟完成全部评估，实时计算风险分数

## 🚀 快速开始

### 在线使用

直接访问 [在线演示](https://mokangmedical.github.io/pilot-stone-prediction/) 即可使用，无需安装。

### 本地开发

```bash
# 克隆项目
git clone https://github.com/MoKangMedical/pilot-stone-prediction.git
cd pilot-stone-prediction

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm build

# 构建GitHub Pages静态版本
BUILD_MODE=static pnpm build
```

## 📊 功能模块

### 1. 风险评估

| 评估维度 | 指标数量 | 说明 |
|---------|---------|------|
| 职业特征 | 8项 | 飞行时长、年度飞行时间、机型、高空巡航比例等 |
| 代谢指标 | 20+项 | 尿酸、钙、磷、肌酐、血糖、血脂等 |
| 综合健康 | 12项 | 体脂率、血压、运动量、睡眠质量等 |

### 2. 研究论文库

- 整合PubMed最新肾结石研究论文
- 支持按关键词、标签、年份筛选
- 包含飞行员特异性研究

### 3. 数据可视化

- 风险分数仪表盘
- 三维风险分解图表
- 历史趋势分析

## 🏗️ 技术架构

```
pilot-stone-prediction/
├── client/                  # 前端应用
│   ├── src/
│   │   ├── pages/          # 页面组件
│   │   ├── components/     # UI组件
│   │   ├── lib/            # 工具库
│   │   └── _core/          # 核心框架
│   ├── index.html          # 入口HTML
│   └── public/             # 静态资源
├── server/                  # 后端服务
│   ├── _core/              # 服务器框架
│   ├── routers.ts          # API路由
│   └── db.ts               # 数据库操作
├── shared/                  # 共享代码
│   ├── assessment.ts       # 评估类型定义
│   ├── defaults.ts         # 默认值配置
│   └── suggestionEngine.ts # 建议生成引擎
├── drizzle/                 # 数据库Schema
│   └── schema.ts           # 表结构定义
├── scripts/                 # 工具脚本
│   └── fetch-pubmed-papers.mjs
└── docs/                    # GitHub Pages构建输出
```

### 技术栈

- **前端**: React 19 + TypeScript + Tailwind CSS + Vite 7
- **后端**: Node.js + Express + tRPC (可选)
- **数据库**: MySQL / localStorage (静态模式)
- **UI组件**: shadcn/ui + Radix UI
- **图表**: Recharts
- **部署**: GitHub Pages / Vercel / 自建服务器

## 📱 使用指南

### 风险评估流程

1. **填写个人信息** - 姓名、性别、年龄、飞行员编号
2. **录入职业特征** - 飞行时长、机型、高空巡航比例等
3. **输入代谢指标** - 尿酸、钙、磷、血糖等20+项指标
4. **填写健康指标** - 体脂率、血压、运动量等
5. **查看评估结果** - 三维风险分数、风险等级、个性化建议

### 风险等级划分

| 风险等级 | 分数范围 | 建议 |
|---------|---------|------|
| 🟢 低风险 | < 20% | 保持良好习惯，定期体检 |
| 🟡 中等风险 | 20-50% | 关注高风险指标，调整生活习惯 |
| 🟠 高风险 | 50-80% | 建议就医检查，制定干预方案 |
| 🔴 极高风险 | > 80% | 立即就医，暂停飞行任务 |

## 🔬 学术支撑

本系统基于以下研究成果：

- **专利号**: 2024116733167
- **发明名称**: 基于机器学习模型的肾结石预测并协助早筛方法
- **发明人**: 张麟、史峰、朱南、孙楚迪
- **申请人**: 苏州工业园区蒙纳士科学技术研究院

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 📧 联系方式

- **GitHub**: [MoKangMedical](https://github.com/MoKangMedical)
- **项目链接**: [pilot-stone-prediction](https://github.com/MoKangMedical/pilot-stone-prediction)

---

<div align="center">

**守护飞行员健康，保障飞行安全** ✈️

</div>
