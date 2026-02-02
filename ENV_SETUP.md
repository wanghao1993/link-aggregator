# 环境变量配置指南

## 必需的环境变量

### 数据库连接
```env
# .env
DATABASE_URL="prisma+postgres://localhost:51213/..."
```

如果使用 Prisma Postgres，运行 `pnpm prisma dev` 会自动配置。

如果使用自己的 PostgreSQL：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/link_aggregator?schema=public"
```

---

## 可选的环境变量

### NextAuth 配置

#### 1. GitHub OAuth（推荐）

**步骤 1: 创建 GitHub OAuth App**
1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写信息：
   - Application name: `Link Aggregator (Dev)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. 创建后获取 Client ID 和 Client Secret

**步骤 2: 添加到 .env**
```env
GITHUB_CLIENT_ID="你的_GitHub_Client_ID"
GITHUB_CLIENT_SECRET="你的_GitHub_Client_Secret"
```

#### 2. Google OAuth

**步骤 1: 创建 Google OAuth 凭据**
1. 访问 https://console.cloud.google.com/
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭据：
   - 应用类型：Web 应用
   - 授权重定向 URI: `http://localhost:3000/api/auth/callback/google`
5. 获取 Client ID 和 Client Secret

**步骤 2: 添加到 .env**
```env
GOOGLE_CLIENT_ID="你的_Google_Client_ID"
GOOGLE_CLIENT_SECRET="你的_Google_Client_Secret"
```

#### 3. NextAuth Secret（生产环境必需）

```bash
# 生成随机密钥
openssl rand -base64 32
```

添加到 .env：
```env
NEXTAUTH_SECRET="生成的随机密钥"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 完整的 .env 示例

```env
# 数据库（必需）
DATABASE_URL="prisma+postgres://localhost:51213/..."

# NextAuth（可选，用于 OAuth 登录）
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"

# GitHub OAuth（可选）
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth（可选）
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## 生产环境配置

### Vercel 部署

1. **数据库**：
   - 使用 Vercel Postgres 或
   - 使用 Railway/Supabase PostgreSQL

2. **环境变量**（在 Vercel Dashboard 设置）：
   ```
   DATABASE_URL=你的生产数据库URL
   NEXTAUTH_URL=https://你的域名.vercel.app
   NEXTAUTH_SECRET=生产环境密钥
   GITHUB_CLIENT_ID=生产环境GitHub_ID
   GITHUB_CLIENT_SECRET=生产环境GitHub_Secret
   ```

3. **GitHub OAuth 回调 URL**：
   ```
   https://你的域名.vercel.app/api/auth/callback/github
   ```

---

## 故障排除

### 问题：无法登录

**检查项**：
1. 确认 `NEXTAUTH_URL` 与实际访问的 URL 一致
2. 检查 OAuth 回调 URL 是否正确配置
3. 确认 Client ID 和 Secret 没有多余空格
4. 查看浏览器控制台和服务器日志

### 问题：数据库连接失败

**检查项**：
1. 确认 `DATABASE_URL` 格式正确
2. 对于 Prisma Postgres，确保运行了 `pnpm prisma dev`
3. 检查数据库服务是否启动
4. 尝试 `pnpm prisma db push` 重新同步 schema

### 问题：OAuth 重定向错误

**检查项**：
1. 确认 OAuth 应用的回调 URL 完全匹配
2. 本地开发使用 `http://localhost:3000`，不是 `127.0.0.1`
3. 生产环境确保使用 HTTPS

---

## 安全建议

### ⚠️ 重要提示

1. **永远不要提交 .env 文件到 Git**
   - 已添加到 `.gitignore`
   - 使用 `.env.example` 作为模板

2. **定期更换密钥**
   - 特别是在怀疑泄露时

3. **不同环境使用不同的 OAuth 应用**
   - 开发环境和生产环境分别创建

4. **限制 OAuth 应用权限**
   - 只请求必需的权限

5. **使用环境变量管理工具**
   - Vercel/Railway 的内置环境变量管理
   - 1Password/Doppler 等密钥管理服务

---

## 快速测试

配置完成后，测试各项功能：

```bash
# 1. 测试数据库连接
pnpm prisma studio

# 2. 测试开发服务器
pnpm dev

# 3. 访问登录页面
# http://localhost:3000/en/auth/signin

# 4. 尝试使用配置的 OAuth 提供商登录
```

---

## 需要帮助？

- NextAuth 文档: https://next-auth.js.org/
- Prisma 文档: https://www.prisma.io/docs
- GitHub OAuth: https://docs.github.com/en/developers/apps/building-oauth-apps
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
