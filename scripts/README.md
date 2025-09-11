# 多平台发布脚本

这个目录包含了自动化发布内容到各个社交媒体平台的脚本。

## 支持的平台

- 🐦 **Twitter** - 自动将 Markdown 内容转换为 Twitter 推文
- 📱 **微信公众号** - 转换为微信公众号格式的 HTML 内容

## 使用方法

### 1. 环境配置

创建 `.env` 文件并配置 API 密钥：

```bash
# Twitter API 配置
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret

# 微信公众号配置
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret
```

### 2. 单平台发布

#### 发布到 Twitter
```bash
node scripts/publish-twitter.js --file docs/trade/bitcoin-guide.md
```

#### 发布到微信公众号
```bash
node scripts/publish-wechat.js --file docs/influence/personal-brand.md
```

### 3. 多平台一键发布

#### 发布到所有平台
```bash
node scripts/publish-all.js --file docs/build/mvp-guide.md
```

#### 发布到指定平台
```bash
node scripts/publish-all.js --file docs/build/mvp-guide.md --platforms twitter,wechat
```

## 内容格式要求

为了最佳的发布效果，Markdown 文件应该包含以下 Front Matter：

```yaml
---
title: "文章标题"
description: "文章摘要"
tags: "标签1,标签2,标签3"
date: 2025-09-11
author: "作者名"
---
```

## 自动化建议

### 1. VS Code 任务配置

在 `.vscode/tasks.json` 中添加：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Publish to All Platforms",
      "type": "shell",
      "command": "node",
      "args": ["scripts/publish-all.js", "--file", "${file}"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    }
  ]
}
```

### 2. GitHub Actions 集成

```yaml
name: Auto Publish
on:
  push:
    paths: ['docs/**/*.md']
    
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Publish new articles
        run: node scripts/publish-all.js --file ${{ github.event.commits[0].added[0] }}
        env:
          TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
          WECHAT_APP_ID: ${{ secrets.WECHAT_APP_ID }}
```

## 脚本说明

- `publish-twitter.js` - Twitter 发布脚本
- `publish-wechat.js` - 微信公众号发布脚本
- `publish-all.js` - 多平台一键发布脚本
- `config.js` - 配置文件（待创建）

## 注意事项

1. **API 限制** - 注意各平台的 API 调用频率限制
2. **内容审核** - 确保内容符合各平台的发布规范
3. **测试环境** - 建议先在测试环境中验证脚本功能
4. **错误处理** - 脚本包含基本的错误处理，但仍需注意异常情况

## 扩展计划

未来可以添加更多平台支持：

- 📖 **Medium**
- 💼 **LinkedIn**
- 🎥 **YouTube** (社区帖子)
- 📝 **知乎**
- 🔗 **即刻**

## 贡献

欢迎提交 Pull Request 来改进这些脚本或添加新平台支持！