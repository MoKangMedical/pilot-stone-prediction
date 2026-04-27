# 快速开始指南

## 5分钟快速启动

### 前置要求

- Node.js 22+
- pnpm 10+
- 网络连接

### 启动步骤

```bash
# 1. 进入项目目录
cd /home/ubuntu/pilot-stone-prediction

# 2. 安装依赖
pnpm install

# 3. 推送数据库迁移
pnpm db:push

# 4. 启动开发服务器
pnpm run dev
```

### 访问应用

- **前端**：http://localhost:5173
- **后端API**：http://localhost:3000/api/trpc

---

## 常用命令

```bash
# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 运行测试
pnpm test

# 类型检查
pnpm check

# 代码格式化
pnpm format

# 数据库迁移
pnpm db:push
```

---

## 项目结构

```
pilot-stone-prediction/
├── client/              # React前端应用
├── server/              # Node.js后端
├── drizzle/             # 数据库schema
├── scripts/             # 工具脚本
├── shared/              # 共享代码
├── package.json         # 项目配置
└── README.md            # 项目说明
```

---

## 关键文件

| 文件 | 用途 |
|------|------|
| `client/src/pages/Assessment.tsx` | 评估页面 |
| `client/src/pages/Papers.tsx` | 论文页面 |
| `server/routers.ts` | API接口 |
| `drizzle/schema.ts` | 数据库表 |

---

## 下一步

1. 阅读 `HANDOVER_GUIDE.md` 了解项目架构
2. 阅读 `DEPLOYMENT_GUIDE.md` 了解部署流程
3. 阅读 `KNOWN_ISSUES_AND_IMPROVEMENTS.md` 了解改进方向
4. 运行 `node scripts/fetch-pubmed-papers.mjs` 导入论文

---

**更多信息请参考项目文档**
