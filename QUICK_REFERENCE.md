# 🚀 快速参考

> 一页纸搞定所有操作

---

## ⚡ 3 分钟启动

```bash
# 1️⃣ 启动数据库（保持运行）
pnpm prisma dev

# 2️⃣ 推送 schema 和填充数据（新终端）
pnpm prisma db push
pnpm db:seed

# 3️⃣ 启动开发服务器
pnpm dev

# ✅ 访问 http://localhost:3000
```

---

## 📝 常用命令

| 命令 | 用途 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm prisma dev` | 启动 Prisma Postgres |
| `pnpm prisma studio` | 打开数据库管理界面 |
| `pnpm prisma db push` | 推送 schema 到数据库 |
| `pnpm db:seed` | 填充示例数据 |
| `pnpm prisma generate` | 生成 Prisma Client |

---

## 🗂️ 项目结构速查

```
app/
├── [locale]/          # 🌍 国际化路由
│   ├── page.tsx       # 📄 首页
│   ├── c/[slug]/      # 📚 合集详情页
│   ├── me/            # 👤 个人中心
│   └── auth/signin/   # 🔐 登录页
└── api/               # 🔌 API 路由
    ├── collections/   # 📦 合集 CRUD
    ├── bookmarks/     # ⭐ 收藏功能
    └── fetch-metadata/# 🔍 元数据抓取

components/
├── ui/               # 🎨 基础组件
├── collection/       # 📚 合集组件
└── link/            # 🔗 链接组件

prisma/
├── schema.prisma    # 📊 数据库模型
└── seed.ts          # 🌱 种子数据
```

---

## 🎯 核心功能路由

| 路由 | 功能 | 权限 |
|------|------|------|
| `/` | 重定向到默认语言 | 公开 |
| `/en` 或 `/zh` | 首页 | 公开 |
| `/[locale]/c/[slug]` | 合集详情 | 公开 |
| `/[locale]/me` | 个人中心 | 需登录 |
| `/[locale]/auth/signin` | 登录页 | 公开 |

---

## 🔌 API 端点速查

### 合集
```bash
POST   /api/collections              # 创建合集
GET    /api/collections              # 获取合集列表
POST   /api/collections/[id]/links   # 添加链接
GET    /api/collections/[id]/links   # 获取链接列表
```

### 收藏
```bash
POST   /api/bookmarks/collections    # 收藏合集
DELETE /api/bookmarks/collections    # 取消收藏合集
POST   /api/bookmarks/links          # 收藏链接
DELETE /api/bookmarks/links          # 取消收藏链接
```

### 元数据
```bash
POST   /api/fetch-metadata           # 抓取 URL 元数据
```

---

## 🔐 OAuth 快速配置

### GitHub
1. https://github.com/settings/developers
2. New OAuth App
3. Callback: `http://localhost:3000/api/auth/callback/github`
4. 添加到 `.env`:
```env
GITHUB_CLIENT_ID="你的ID"
GITHUB_CLIENT_SECRET="你的Secret"
```

### Google  
1. https://console.cloud.google.com/
2. 创建 OAuth 凭据
3. Callback: `http://localhost:3000/api/auth/callback/google`
4. 添加到 `.env`:
```env
GOOGLE_CLIENT_ID="你的ID"
GOOGLE_CLIENT_SECRET="你的Secret"
```

---

## 🐛 问题诊断

| 问题 | 解决方案 |
|------|---------|
| 🔴 数据库连接失败 | `pnpm prisma dev` |
| 🔴 无法登录 | 检查 OAuth 配置 |
| 🔴 没有数据 | `pnpm db:seed` |
| 🔴 端口被占用 | `pnpm dev -- -p 3001` |
| 🔴 类型错误 | `pnpm prisma generate` |
| 🔴 Schema 不同步 | `pnpm prisma db push` |

---

## 💾 数据库快速参考

### 主要表
- **User**: 用户表
- **Collection**: 合集表
- **Link**: 链接表
- **CollectionLink**: 合集-链接关联表
- **BookmarkedCollection**: 收藏的合集
- **BookmarkedLink**: 收藏的链接

### 快速查询
```bash
# 打开数据库管理界面
pnpm prisma studio

# 查看所有合集
# 在 Prisma Studio 中点击 Collection

# 重置数据库
pnpm prisma migrate reset
```

---

## 🌍 国际化

| 语言 | 路由 | 翻译文件 |
|------|------|---------|
| 英文 | `/en` | `messages/en.json` |
| 中文 | `/zh` | `messages/zh.json` |

添加新翻译：
1. 编辑 `messages/{locale}.json`
2. 在组件中使用 `useTranslations('key')`
3. 自动生效

---

## 🎨 UI 组件

```tsx
// Button
<Button>点击</Button>
<Button variant="outline">轮廓</Button>
<Button size="sm">小按钮</Button>

// Input
<Input placeholder="输入..." />

// Textarea
<Textarea rows={4} />

// Dialog
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>标题</DialogTitle>
    </DialogHeader>
    {/* 内容 */}
  </DialogContent>
</Dialog>
```

---

## 📦 包管理

```bash
# 安装依赖
pnpm install

# 添加新包
pnpm add package-name

# 添加开发依赖
pnpm add -D package-name

# 更新依赖
pnpm update

# 查看过时的包
pnpm outdated
```

---

## 🚀 部署清单

### Vercel 部署
- [ ] 连接 GitHub 仓库
- [ ] 配置环境变量
- [ ] 设置生产数据库
- [ ] 更新 OAuth 回调 URL
- [ ] 部署

### 环境变量
```env
DATABASE_URL=生产数据库URL
NEXTAUTH_URL=https://你的域名
NEXTAUTH_SECRET=生产密钥
GITHUB_CLIENT_ID=生产ID
GITHUB_CLIENT_SECRET=生产Secret
```

---

## 📚 有用链接

- **文档**: 查看 `FINAL_SUMMARY.md`
- **环境配置**: 查看 `ENV_SETUP.md`
- **功能列表**: 查看 `COMPLETED_FEATURES.md`
- **快速开始**: 查看 `START_HERE.md`

---

## 🆘 获取帮助

1. 查看相关文档
2. 检查浏览器控制台
3. 查看服务器日志
4. 使用 `pnpm prisma studio` 检查数据库

---

## ⚡ Pro Tips

💡 使用 `Ctrl/Cmd + K` 快速搜索  
💡 保持 Prisma Studio 打开以监控数据  
💡 使用浏览器开发工具查看网络请求  
💡 定期运行 `pnpm prisma generate` 更新类型  
💡 使用 Git 版本控制保护代码

---

**祝你开发愉快！** 🎉
