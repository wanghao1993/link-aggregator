# 快速开始指南

## 数据库设置

### 选项 1: 使用 Prisma Postgres（推荐，最简单）

Prisma 已经为你配置了本地 Postgres 连接。只需运行：

```bash
# 启动 Prisma Postgres（会自动下载并运行）
pnpm prisma dev
```

这会在本地启动一个 PostgreSQL 数据库，无需手动安装。

### 选项 2: 使用现有的 PostgreSQL 数据库

如果你已经有 PostgreSQL 数据库，更新 `.env` 文件：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/link_aggregator?schema=public"
```

## 运行应用

1. **推送数据库 schema**:
```bash
pnpm prisma db push
```

或者运行迁移:
```bash
pnpm prisma migrate dev --name init
```

2. **（可选）填充示例数据**:
```bash
pnpm db:seed
```

3. **启动开发服务器**:
```bash
pnpm dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 常用命令

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm prisma studio` - 打开 Prisma Studio（数据库可视化工具）
- `pnpm db:seed` - 填充示例数据
- `pnpm db:push` - 推送 schema 更改到数据库

## 语言切换

应用支持中英文切换：
- 英文: http://localhost:3000/en
- 中文: http://localhost:3000/zh

默认语言是英文。

## 故障排除

### 数据库连接错误

如果遇到数据库连接错误：
1. 确保数据库正在运行
2. 检查 `.env` 中的 `DATABASE_URL` 是否正确
3. 对于 Prisma Postgres，确保运行了 `pnpm prisma dev`

### 端口已被占用

如果 3000 端口被占用，可以指定其他端口：
```bash
pnpm dev -- -p 3001
```
