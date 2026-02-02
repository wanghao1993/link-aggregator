# 🔧 故障排除指南

## 已修复的问题

### ✅ 问题 1: Tailwind CSS PostCSS 错误
**错误信息**:
```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

**解决方案**:
1. 安装新的 PostCSS 插件：`pnpm add -D @tailwindcss/postcss`
2. 更新 `postcss.config.mjs`：
```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```
3. 删除 `tailwind.config.ts`（Tailwind CSS 4 不再需要）

### ✅ 问题 2: Prisma Client 初始化错误
**错误信息**:
```
PrismaClientInitializationError: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`
```

**解决方案**:
更新 `lib/prisma.ts`：
```typescript
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})
```

---

## 常见启动问题

### 问题：端口被占用
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**解决**:
```bash
# 使用其他端口
pnpm dev -- -p 3001
```

### 问题：数据库连接失败
```bash
Error: P1001 Can't reach database server
```

**解决**:
```bash
# 确保数据库正在运行
pnpm prisma dev

# 或检查 .env 中的 DATABASE_URL
```

### 问题：模块未找到
```bash
Error: Cannot find module 'xxx'
```

**解决**:
```bash
# 重新安装依赖
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 问题：Prisma Client 未生成
```bash
Error: @prisma/client did not initialize yet
```

**解决**:
```bash
pnpm prisma generate
```

---

## 完全重置步骤

如果遇到无法解决的问题：

```bash
# 1. 停止所有进程（Ctrl+C）

# 2. 清理
rm -rf node_modules .next pnpm-lock.yaml

# 3. 重新安装
pnpm install

# 4. 生成 Prisma Client
pnpm prisma generate

# 5. 推送数据库 schema
pnpm prisma db push

# 6. 填充数据
pnpm db:seed

# 7. 启动
pnpm dev
```

---

## 检查清单

启动前确认：

- [ ] Node.js 版本 >= 18
- [ ] pnpm 已安装
- [ ] `.env` 文件存在且配置正确
- [ ] 数据库正在运行（`pnpm prisma dev`）
- [ ] Prisma Client 已生成（`pnpm prisma generate`）
- [ ] Schema 已推送（`pnpm prisma db push`）

---

## 获取详细错误信息

```bash
# 查看完整的错误堆栈
NODE_ENV=development pnpm dev

# 启用调试日志
DEBUG=* pnpm dev
```

---

## 常用调试命令

```bash
# 检查 Node 版本
node -v

# 检查 pnpm 版本
pnpm -v

# 查看数据库连接
pnpm prisma studio

# 验证 Prisma schema
pnpm prisma validate

# 查看 Prisma 状态
pnpm prisma status
```

---

## 需要更多帮助？

1. 查看终端完整错误信息
2. 检查浏览器控制台
3. 查看 `START_HERE.md` 快速开始指南
4. 查看 `ENV_SETUP.md` 环境配置指南
