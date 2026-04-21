# 飞行员肾结石风险评估系统 - 部署和环境配置指南

## 环境要求

### 系统要求
- **操作系统**：Ubuntu 22.04 LTS 或更新版本
- **Node.js**：v22.13.0 或更新版本
- **包管理器**：pnpm 10.4.1 或更新版本
- **数据库**：MySQL 8.0 或 TiDB 5.0 或更新版本

### 开发工具
- **编辑器**：VS Code 或其他支持TypeScript的编辑器
- **Git**：用于版本控制
- **浏览器**：Chrome、Firefox、Safari等现代浏览器

---

## 环境变量配置

### 系统自动注入的环境变量

Manus平台自动为项目注入以下环境变量，无需手动配置：

| 环境变量 | 用途 | 示例值 |
|---------|------|-------|
| `DATABASE_URL` | MySQL数据库连接字符串 | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | 会话Cookie签名密钥 | `your-secret-key` |
| `VITE_APP_ID` | Manus OAuth应用ID | `app_xxxxx` |
| `OAUTH_SERVER_URL` | Manus OAuth服务器地址 | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | Manus登录门户地址 | `https://oauth.manus.im` |
| `OWNER_OPEN_ID` | 项目所有者OpenID | `user_xxxxx` |
| `OWNER_NAME` | 项目所有者名称 | `小林` |
| `BUILT_IN_FORGE_API_URL` | Manus内置API地址 | `https://forge.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | Manus内置API密钥 | `key_xxxxx` |
| `VITE_FRONTEND_FORGE_API_URL` | 前端Manus API地址 | `https://forge.manus.im` |
| `VITE_FRONTEND_FORGE_API_KEY` | 前端Manus API密钥 | `key_xxxxx` |
| `VITE_ANALYTICS_ENDPOINT` | 分析服务端点 | `https://analytics.manus.im` |
| `VITE_ANALYTICS_WEBSITE_ID` | 分析网站ID | `site_xxxxx` |

### 可选的自定义环境变量

以下环境变量可根据需要配置：

| 环境变量 | 用途 | 默认值 | 配置方法 |
|---------|------|-------|--------|
| `PUBMED_API_KEY` | PubMed API密钥 | 无 | 在Manus Management UI的Secrets面板配置 |
| `NODE_ENV` | 运行环境 | `development` | 自动设置（开发时为development，生产时为production） |
| `VITE_APP_TITLE` | 网站标题 | `飞行员结石风险评估系统` | 在Manus Management UI的Settings面板配置 |
| `VITE_APP_LOGO` | 网站Logo URL | 默认飞机图标 | 在Manus Management UI的Settings面板配置 |

### 配置自定义环境变量

1. **通过Manus Management UI**（推荐）
   - 进入项目的Management UI
   - 点击Settings → Secrets
   - 添加或编辑环境变量
   - 系统自动重启服务器应用更改

2. **通过webdev_request_secrets工具**（开发时）
   - 在开发过程中使用此工具添加/更新密钥
   - 自动创建输入卡片供用户输入敏感信息

### PubMed API密钥配置

为了提高PubMed API的请求频率限制，建议配置API密钥：

1. 访问 https://www.ncbi.nlm.nih.gov/account/
2. 登录或创建账户
3. 在Settings中生成API密钥
4. 在Manus Management UI的Secrets面板添加 `PUBMED_API_KEY`

**配置后效果**：
- 无密钥：每秒3个请求
- 有密钥：每秒10个请求

---

## 本地开发环境设置

### 第一次克隆和设置

```bash
# 1. 进入项目目录
cd /home/ubuntu/pilot-stone-prediction

# 2. 安装依赖
pnpm install

# 3. 推送数据库迁移（创建表）
pnpm db:push

# 4. 启动开发服务器
pnpm run dev
```

### 启动开发服务器

```bash
# 启动开发服务器（前后端同时运行）
pnpm run dev

# 输出示例：
# [2026-02-22T08:00:00.000Z] Starting dev server with command: pnpm run dev
# [2026-02-22T08:00:02.000Z] Server running on http://localhost:3000/
# [2026-02-22T08:00:05.000Z] Vite dev server running on http://localhost:5173/
```

**访问地址**：
- 前端应用：http://localhost:5173
- 后端API：http://localhost:3000/api/trpc

### 常用开发命令

| 命令 | 用途 |
|------|------|
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器 |
| `pnpm test` | 运行单元测试 |
| `pnpm check` | TypeScript类型检查 |
| `pnpm format` | 代码格式化 |
| `pnpm db:push` | 推送数据库迁移 |

---

## 数据库管理

### 数据库架构

项目使用Drizzle ORM管理数据库，所有表定义在 `drizzle/schema.ts` 中。

### 数据库迁移流程

**修改schema后的标准流程**：

```bash
# 1. 编辑 drizzle/schema.ts，添加或修改表定义
# 例如：添加新字段到pilots表

# 2. 推送迁移（自动生成迁移文件并执行）
pnpm db:push

# 3. 验证迁移是否成功
# 检查 drizzle/migrations/ 目录中是否生成了新的迁移文件
# 检查数据库中是否创建了新的表或字段
```

### 查看数据库

在Manus Management UI中：
1. 点击Dashboard → Database
2. 查看所有表和数据
3. 执行SQL查询
4. 导出数据

### 数据库备份

**定期备份数据库**：
```bash
# 导出数据库（在Manus Management UI中）
# 或使用MySQL命令行工具
mysqldump -h <host> -u <user> -p <database> > backup.sql
```

---

## 构建和部署

### 本地构建

```bash
# 构建前端和后端
pnpm build

# 输出目录：
# - dist/public/     # 前端构建输出
# - dist/index.js    # 后端构建输出
```

### 本地验证构建

```bash
# 启动生产服务器（验证构建是否成功）
pnpm start

# 访问 http://localhost:3000 验证应用
```

### 生产部署流程

1. **提交代码到Git**
   ```bash
   git add .
   git commit -m "feat: 新功能描述"
   git push origin main
   ```

2. **在Manus平台发布**
   - 进入Management UI的Preview面板
   - 点击右上角"Publish"按钮
   - 系统自动构建和部署
   - 等待部署完成（通常需要2-5分钟）

3. **验证部署**
   - 访问生产URL验证功能
   - 检查错误日志
   - 进行基本功能测试

### 部署前检查清单

在部署到生产环境前，请完成以下检查：

- [ ] 所有测试通过：`pnpm test`
- [ ] 代码格式化：`pnpm format`
- [ ] TypeScript检查无错误：`pnpm check`
- [ ] 本地构建成功：`pnpm build`
- [ ] 本地验证成功：`pnpm start`
- [ ] 数据库迁移完成：`pnpm db:push`
- [ ] 环境变量配置正确
- [ ] 没有console.log调试代码
- [ ] 没有硬编码的敏感信息
- [ ] Git提交信息清晰有意义

---

## 文件存储配置

### S3存储

项目使用Manus平台提供的S3存储服务存储文件（如论文图片、导出数据等）。

**配置已预设**，无需手动配置。

**使用方法**：

```typescript
// 服务端上传文件
import { storagePut } from "./server/storage";

const { url } = await storagePut(
  `papers/${paperId}/image.png`,
  fileBuffer,
  "image/png"
);

// 获取文件URL
import { storageGet } from "./server/storage";

const { url } = await storageGet(`papers/${paperId}/image.png`);
```

### 文件大小限制

- **单个文件最大大小**：100MB
- **总存储空间**：根据Manus平台套餐限制

### 文件管理

在Manus Management UI中：
1. 点击Dashboard → Storage
2. 查看所有上传的文件
3. 删除不需要的文件
4. 查看存储使用情况

---

## 监控和日志

### 日志位置

项目日志存储在 `.manus-logs/` 目录中：

| 日志文件 | 内容 |
|---------|------|
| `browserConsole.log` | 浏览器控制台输出 |
| `networkRequests.log` | 网络请求记录 |
| `sessionReplay.log` | 会话重放数据 |

### 查看日志

```bash
# 查看最新的浏览器日志
tail -f .manus-logs/browserConsole.log

# 查看网络请求
tail -f .manus-logs/networkRequests.log

# 搜索错误信息
grep -i "error" .manus-logs/browserConsole.log
```

### 错误监控

在Manus Management UI中：
1. 点击Dashboard → Logs
2. 查看实时日志
3. 搜索特定错误
4. 导出日志用于分析

---

## 性能优化

### 前端优化

1. **代码分割**
   - 使用React.lazy()实现路由级别代码分割
   - 自动分割大型组件

2. **缓存策略**
   - 静态资源使用长期缓存
   - API响应使用tRPC缓存

3. **图片优化**
   - 论文图片使用懒加载
   - 使用CDN加速图片传输

### 后端优化

1. **数据库查询优化**
   - 使用索引加速查询
   - 避免N+1查询问题

2. **API响应优化**
   - 使用分页减少数据传输
   - 压缩JSON响应

3. **缓存策略**
   - 缓存频繁查询的数据
   - 使用Redis缓存（可选）

### 监控性能

```bash
# 检查构建大小
pnpm build --analyze

# 检查运行时性能
# 在浏览器DevTools中使用Performance标签
```

---

## 故障排除

### 常见问题

#### 问题：数据库连接失败

**症状**：启动时出现 `Error: connect ECONNREFUSED`

**解决方案**：
1. 检查 `DATABASE_URL` 环境变量是否正确
2. 验证数据库服务是否运行
3. 检查网络连接
4. 查看 `.manus-logs/browserConsole.log` 中的详细错误

#### 问题：前端页面加载失败

**症状**：访问http://localhost:5173时出现白屏

**解决方案**：
1. 检查浏览器控制台是否有错误信息
2. 清除浏览器缓存
3. 重启开发服务器：`pnpm run dev`
4. 检查 `.manus-logs/browserConsole.log`

#### 问题：PubMed论文导入失败

**症状**：运行 `node scripts/fetch-pubmed-papers.mjs` 时出错

**解决方案**：
1. 检查网络连接
2. 验证PubMed API是否可访问
3. 如果配置了API密钥，检查密钥是否有效
4. 查看脚本输出中的详细错误信息

#### 问题：PDF导出出现乱码或格式错误

**症状**：导出的PDF中文字显示不正确或布局混乱

**解决方案**：
1. 检查浏览器是否支持html2canvas
2. 尝试使用其他浏览器
3. 检查 `client/src/index.css` 中的字体配置
4. 查看浏览器控制台中的错误信息

### 获取帮助

1. **查看项目日志**：`.manus-logs/` 目录
2. **查看浏览器控制台**：F12打开DevTools
3. **查看服务器输出**：运行 `pnpm run dev` 时的终端输出
4. **参考官方文档**：Manus平台的API文档和最佳实践

---

## 安全性建议

### 敏感信息保护

1. **不要在代码中硬编码密钥**
   - 所有API密钥应通过环境变量配置
   - 使用Manus Management UI的Secrets面板

2. **不要提交敏感文件**
   - `.env` 文件已在 `.gitignore` 中
   - 确保不提交包含密钥的文件

3. **定期轮换密钥**
   - 定期更新API密钥
   - 如果密钥泄露，立即更换

### 数据安全

1. **数据库访问控制**
   - 只有授权用户可以访问数据库
   - 使用强密码保护数据库账户

2. **API认证**
   - 所有API调用都需要认证
   - 使用JWT Token验证用户身份

3. **数据加密**
   - 敏感数据在传输时使用HTTPS加密
   - 考虑对敏感数据进行数据库级别的加密

### 依赖安全

```bash
# 检查依赖中的安全漏洞
pnpm audit

# 修复已知漏洞
pnpm audit --fix
```

---

## 版本管理

### Git工作流

```bash
# 创建新分支开发功能
git checkout -b feature/new-feature

# 提交代码
git add .
git commit -m "feat: 新功能描述"

# 推送到远程仓库
git push origin feature/new-feature

# 创建Pull Request并合并到main分支
```

### 版本标签

```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签
git push origin v1.0.0
```

---

## 维护计划

### 日常维护

- **每日**：检查错误日志，处理用户反馈
- **每周**：运行 `pnpm audit` 检查依赖安全
- **每周**：备份数据库
- **每月**：更新依赖包

### 定期更新

- **每季度**：审查和优化代码
- **每半年**：升级主要依赖包
- **每年**：进行安全审计

---

**最后更新**：2026年2月22日

**维护者**：openclaw
