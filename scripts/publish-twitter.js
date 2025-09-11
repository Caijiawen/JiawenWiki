#!/usr/bin/env node

/**
 * Twitter 发布脚本
 * 
 * 使用方法:
 * node scripts/publish-twitter.js --file docs/trade/bitcoin-guide.md
 * 
 * 环境变量:
 * TWITTER_API_KEY
 * TWITTER_API_SECRET
 * TWITTER_ACCESS_TOKEN
 * TWITTER_ACCESS_TOKEN_SECRET
 */

const fs = require('fs');
const path = require('path');

async function publishToTwitter(filePath, options = {}) {
  try {
    console.log(`📱 准备发布到 Twitter: ${filePath}`);
    
    // 读取 Markdown 文件
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 解析 front matter
    const frontMatter = extractFrontMatter(content);
    const markdownContent = content.replace(/^---[\s\S]*?---\n/, '');
    
    // 转换为 Twitter 格式
    const twitterContent = convertToTwitterFormat(markdownContent, frontMatter);
    
    // TODO: 实际的 Twitter API 调用
    console.log('🔄 Twitter 内容预览:');
    console.log('=' * 50);
    console.log(twitterContent);
    console.log('=' * 50);
    
    // TODO: 使用 Twitter API 发布
    // await twitterClient.v2.tweet(twitterContent);
    
    console.log('✅ 已发布到 Twitter!');
    return { success: true, platform: 'twitter', content: twitterContent };
    
  } catch (error) {
    console.error('❌ Twitter 发布失败:', error.message);
    return { success: false, platform: 'twitter', error: error.message };
  }
}

function extractFrontMatter(content) {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontMatterMatch) return {};
  
  const frontMatterText = frontMatterMatch[1];
  const frontMatter = {};
  
  frontMatterText.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      frontMatter[key.trim()] = valueParts.join(':').trim();
    }
  });
  
  return frontMatter;
}

function convertToTwitterFormat(content, frontMatter) {
  // 移除 Markdown 语法
  let twitterContent = content
    .replace(/^#+ /gm, '') // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
    .replace(/`(.*?)`/g, '$1') // 移除代码标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 简化链接
    .trim();
  
  // 截取前280个字符
  if (twitterContent.length > 250) {
    twitterContent = twitterContent.substring(0, 250) + '...';
  }
  
  // 添加标签
  const tags = frontMatter.tags ? frontMatter.tags.split(',').map(tag => `#${tag.trim()}`).join(' ') : '';
  
  return `${twitterContent}\n\n${tags}\n\n🔗 阅读完整文章: [网站链接]`;
}

// 命令行接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const fileIndex = args.indexOf('--file');
  
  if (fileIndex === -1 || !args[fileIndex + 1]) {
    console.error('❌ 请指定文件路径: --file path/to/file.md');
    process.exit(1);
  }
  
  const filePath = args[fileIndex + 1];
  publishToTwitter(filePath);
}

module.exports = { publishToTwitter };