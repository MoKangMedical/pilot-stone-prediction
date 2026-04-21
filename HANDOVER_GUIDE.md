# 飞行员肾结石风险评估系统 - 项目交接指南

## 项目概况

**项目名称**：飞行员肾结石风险评估系统（Pilot Stone Prediction System）

**项目目标**：为飞行员提供基于机器学习模型的肾结石风险预测、数据采集、风险评估、数据库存储、PDF报告生成和远端API连接等功能。

**项目状态**：已完成核心功能开发，版本号 `41be4bfc`

**技术栈**：
- **前端**：React 19 + TypeScript + Vite + Tailwind CSS 4 + shadcn/ui
- **后端**：Node.js + Express + tRPC 11
- **数据库**：MySQL/TiDB（通过Drizzle ORM）
- **部署**：Manus平台（内置OAuth、S3存储、LLM服务）

---

## 系统架构

### 项目结构

```
pilot-stone-prediction/
├── client/                 # React前端应用
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   │   ├── Home.tsx              # 首页
│   │   │   ├── Assessment.tsx        # 风险评估页面
│   │   │   ├── History.tsx           # 评估历史记录
│   │   │   ├── Papers.tsx            # 研究论文展示
│   │   │   ├── Research.tsx          # 全球肾结石研究
│   │   │   └── Settings.tsx          # 设置页面
│   │   ├── components/    # 可复用组件
│   │   │   ├── MetabolicForm.tsx     # 代谢指标表单
│   │   │   ├── PaperList.tsx         # 论文列表
│   │   │   ├── ResearchDashboard.tsx # 研究数据仪表板
│   │   │   └── DashboardLayout.tsx   # 仪表板布局
│   │   ├── lib/trpc.ts    # tRPC客户端配置
│   │   ├── App.tsx        # 路由和主应用
│   │   └── index.css      # 全局样式
│   └── public/            # 静态资源
├── server/                # Node.js后端
│   ├── routers.ts         # tRPC路由和API接口
│   ├── db.ts              # 数据库查询函数
│   ├── report-generator.ts # PDF报告生成器
│   ├── storage.ts         # S3文件存储
│   └── _core/             # 框架核心代码
├── drizzle/               # 数据库schema和迁移
│   ├── schema.ts          # 数据库表定义
│   └── migrations/        # 数据库迁移文件
├── scripts/               # 工具脚本
│   └── fetch-pubmed-papers.mjs  # PubMed论文爬取脚本
├── shared/                # 前后端共享代码
│   ├── assessment.ts      # 评估数据类型定义
│   ├── defaults.ts        # 默认值配置
│   └── suggestionEngine.ts # 个性化建议生成引擎
└── package.json           # 项目依赖
```

### 数据库表结构

| 表名 | 用途 | 关键字段 |
|------|------|--------|
| `users` | 用户认证 | openId, name, email, role |
| `pilots` | 飞行员个人信息 | pilotId, name, gender, age |
| `assessments` | 风险评估记录 | pilotId, metabolicData, healthData, overallRisk |
| `apiConfigs` | 远端API配置 | userId, endpoint, apiKey, isActive |
| `research_papers` | 研究论文 | title, authors, abstract, pmid, doi, url |
| `pilot_stone_research` | 飞行员结石研究 | title, pilotIncidence, generalIncidence |

---

## 核心功能说明

### 1. 风险评估模块

**文件**：`client/src/pages/Assessment.tsx`、`server/routers.ts`

**功能**：
- 采集飞行员个人信息、职业特征、代谢指标、健康指标
- 计算三维风险评分：职业特征风险、代谢指标风险、综合健康风险
- 生成综合风险等级（低、中、高、极高）
- 生成16条以上个性化健康建议

**关键流程**：
1. 用户填写表单数据
2. 调用 `trpc.assessment.create` 保存评估数据
3. 后端计算风险分数和建议
4. 返回结果并生成PDF报告

### 2. PDF报告生成

**文件**：`server/report-generator.ts`、`client/src/components/PrintReport.tsx`

**功能**：
- 生成专业医疗级PDF报告（4页）
- 包含风险评估摘要、个人信息、代谢指标、健康建议
- 支持打印和PDF导出
- 使用html2canvas和jsPDF库

**技术细节**：
- 前端使用html2canvas捕获DOM元素为图片
- 通过jsPDF生成多页PDF文档
- 自动分页处理长内容
- 支持渐变进度条可视化风险等级

### 3. 研究论文展示

**文件**：`client/src/pages/Papers.tsx`、`client/src/components/PaperList.tsx`

**功能**：
- 展示从PubMed导入的真实肾结石研究论文
- 支持按关键词搜索、按发表日期筛选、按引用次数排序
- 显示论文缩略图、作者、摘要、发表日期
- 提供PubMed和DOI链接
- 支持引用格式复制

**数据来源**：
- 通过 `scripts/fetch-pubmed-papers.mjs` 脚本从PubMed API爬取
- 存储在 `research_papers` 表中
- 支持定时自动更新

### 4. 全球肾结石研究展示

**文件**：`client/src/pages/Research.tsx`、`client/src/components/ResearchDashboard.tsx`

**功能**：
- 展示全球肾结石预测研究数据
- 支持按研究类型和研究焦点筛选
- 提供多维度数据可视化（国家分布、患病率对比、发表趋势等）
- 显示研究统计信息（总数、覆盖国家、平均患病率等）

### 5. 评估历史记录

**文件**：`client/src/pages/History.tsx`

**功能**：
- 查看用户所有历史评估记录
- 支持按日期排序、搜索、筛选
- 支持导出评估数据
- 支持删除评估记录

### 6. 远端API连接

**文件**：`server/routers.ts` 中的 `apiConfig` 相关接口

**功能**：
- 配置远端API端点和密钥
- 支持评估数据同步到远端服务器
- 支持批量数据导出和导入

---

## 开发指南

### 环境设置

1. **安装依赖**
   ```bash
   cd /home/ubuntu/pilot-stone-prediction
   pnpm install
   ```

2. **配置环境变量**
   - 系统自动注入的环境变量见 `server/_core/env.ts`
   - 无需手动配置 `DATABASE_URL`、`JWT_SECRET` 等

3. **启动开发服务器**
   ```bash
   pnpm run dev
   ```
   - 前端：http://localhost:5173
   - 后端API：http://localhost:3000/api/trpc

4. **数据库迁移**
   ```bash
   pnpm db:push
   ```
   - 自动生成迁移文件并执行

### 开发工作流

#### 添加新功能的标准流程

1. **更新数据库schema**
   ```typescript
   // drizzle/schema.ts
   export const newTable = mysqlTable("new_table", {
     id: int("id").autoincrement().primaryKey(),
     // ... 字段定义
   });
   ```

2. **推送数据库迁移**
   ```bash
   pnpm db:push
   ```

3. **添加数据库查询函数**
   ```typescript
   // server/db.ts
   export async function getNewData(id: number) {
     return db.query.newTable.findFirst({
       where: eq(newTable.id, id),
     });
   }
   ```

4. **创建tRPC路由**
   ```typescript
   // server/routers.ts
   export const appRouter = router({
     feature: router({
       getNewData: publicProcedure
         .input(z.object({ id: z.number() }))
         .query(async ({ input }) => {
           return db.getNewData(input.id);
         }),
     }),
   });
   ```

5. **前端调用API**
   ```typescript
   // client/src/pages/FeaturePage.tsx
   const { data } = trpc.feature.getNewData.useQuery({ id: 1 });
   ```

6. **编写测试**
   ```typescript
   // server/feature.test.ts
   import { describe, it, expect } from "vitest";
   
   describe("feature", () => {
     it("should get new data", async () => {
       // 测试代码
     });
   });
   ```

7. **运行测试**
   ```bash
   pnpm test
   ```

### 关键文件说明

#### `shared/assessment.ts` - 评估数据类型定义
定义了 `MetabolicData` 和 `HealthData` 接口，包含所有代谢指标和健康指标的字段定义。

#### `shared/defaults.ts` - 默认值配置
包含所有输入字段的默认值、参考范围、单位等配置。修改此文件可以快速调整表单默认值。

#### `shared/suggestionEngine.ts` - 个性化建议生成
根据评估数据生成个性化健康建议的算法。包含16条以上的建议规则。

#### `server/report-generator.ts` - PDF报告生成
使用html2canvas和jsPDF生成专业医疗级PDF报告。支持自定义报告格式和内容。

#### `client/src/index.css` - 全局样式
定义了航空蓝色主题配色、CSS变量、动画效果等。修改此文件可以快速改变整体视觉风格。

---

## 部署说明

### 部署前检查清单

- [ ] 所有测试通过：`pnpm test`
- [ ] 代码格式化：`pnpm format`
- [ ] TypeScript检查：`pnpm check`
- [ ] 构建成功：`pnpm build`
- [ ] 环境变量配置正确
- [ ] 数据库迁移完成：`pnpm db:push`

### 部署流程

1. **本地构建验证**
   ```bash
   pnpm build
   pnpm start
   ```

2. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 新功能描述"
   git push origin main
   ```

3. **在Manus平台发布**
   - 进入Management UI的Preview面板
   - 点击"Publish"按钮
   - 系统自动部署到生产环境

### 生产环境注意事项

- **S3文件存储**：所有上传的文件（论文图片、导出数据等）存储在S3，使用CDN加速
- **数据库备份**：定期备份MySQL数据库
- **API速率限制**：PubMed API有请求频率限制，爬取论文时需要控制速度
- **错误监控**：检查 `.manus-logs/` 目录中的日志文件

---

## 已知问题和改进方向

### 已知问题

1. **PDF导出兼容性**
   - html2canvas不支持OKLCH颜色格式，已改用RGB/HEX颜色
   - 某些复杂CSS可能无法正确渲染到PDF

2. **PubMed API限制**
   - 无API密钥时每秒最多3个请求
   - 有API密钥时每秒最多10个请求
   - 建议配置 `PUBMED_API_KEY` 环境变量

3. **论文图片加载**
   - 某些论文可能没有可用的缩略图
   - 建议实现图片加载失败的降级方案

### 后续改进方向

#### 短期改进（1-2周）
1. **执行PubMed论文导入**
   - 运行 `node scripts/fetch-pubmed-papers.mjs` 导入初始论文库
   - 验证论文展示页面功能

2. **配置定时任务**
   - 每周自动爬取最新论文
   - 使用node-cron或类似库实现定时任务

3. **论文推荐功能**
   - 根据用户评估结果推荐相关论文
   - 实现论文收藏和分享功能

#### 中期改进（1个月）
1. **LLM集成**
   - 使用内置LLM生成中文论文摘要
   - 实现论文内容智能分析和关键词提取

2. **数据可视化增强**
   - 添加更多交互式图表
   - 实现数据导出为Excel/CSV

3. **用户体验优化**
   - 添加评估进度保存（草稿功能）
   - 实现评估结果分享和对比

#### 长期改进（2-3个月）
1. **机器学习模型优化**
   - 收集更多飞行员评估数据
   - 使用真实数据训练和优化风险预测模型

2. **国际化支持**
   - 支持多语言界面（英文、日文、韩文等）
   - 支持不同国家的医学指标标准

3. **移动应用**
   - 开发原生iOS/Android应用
   - 实现离线评估功能

4. **企业级功能**
   - 批量导入飞行员数据
   - 管理员仪表板和数据分析
   - 审计日志和合规报告

---

## 常见问题解答

### Q: 如何添加新的代谢指标？

A: 按以下步骤添加：
1. 在 `drizzle/schema.ts` 的 `MetabolicData` 接口中添加新字段
2. 在 `shared/defaults.ts` 中添加默认值和参考范围
3. 在 `client/src/components/MetabolicForm.tsx` 中添加输入框
4. 在 `shared/suggestionEngine.ts` 中添加建议规则
5. 运行 `pnpm db:push` 推送迁移

### Q: 如何修改风险计算算法？

A: 风险计算逻辑在 `server/routers.ts` 的 `assessment.create` 接口中。修改计算公式后需要重新启动服务器。

### Q: 如何自定义PDF报告格式？

A: 修改 `server/report-generator.ts` 中的报告生成逻辑，或修改 `client/src/components/PrintReport.tsx` 中的HTML模板。

### Q: 如何连接远端API？

A: 在Settings页面配置API端点和密钥，然后在History页面点击"同步到远端"按钮。

### Q: 论文导入失败怎么办？

A: 检查以下几点：
1. 网络连接是否正常
2. PubMed API是否可访问
3. 数据库连接是否正常
4. 查看 `.manus-logs/browserConsole.log` 中的错误信息

---

## 联系方式和支持

- **项目仓库**：Manus平台内置Git仓库
- **问题报告**：在Management UI的Dashboard中查看错误日志
- **技术支持**：参考Manus平台的官方文档和API文档

---

## 版本历史

| 版本 | 日期 | 主要改进 |
|------|------|--------|
| 41be4bfc | 2026-02-10 | 完成PubMed论文导入和展示功能 |
| 382acaf6 | 2026-02-09 | 添加飞行员主题装饰和配色方案 |
| b44634f1 | 2026-02-08 | 修改为展示全球肾结石预测研究 |
| 4dd16988 | 2026-02-07 | 完成论文展示框架和搜索功能 |

---

**最后更新**：2026年2月22日

**维护者**：openclaw（接管开发）

**原始开发**：Manus AI
