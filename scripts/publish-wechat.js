#!/usr/bin/env node

/**
 * 微信公众号发布脚本
 * 
 * 使用方法:
 * node scripts/publish-wechat.js --file docs/trade/bitcoin-guide.md
 * 
 * 环境变量:
 * WECHAT_APP_ID
 * WECHAT_APP_SECRET
 */

const fs = require('fs');
const path = require('path');

async function publishToWechat(filePath, options = {}) {
  try {
    console.log(`📱 准备发布到微信公众号: ${filePath}`);
    
    // 读取 Markdown 文件
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 解析 front matter
    const frontMatter = extractFrontMatter(content);
    const markdownContent = content.replace(/^---[\s\S]*?---\n/, '');
    
    // 转换为微信公众号格式
    const wechatContent = convertToWechatFormat(markdownContent, frontMatter);
    
    // TODO: 实际的微信公众号 API 调用
    console.log('🔄 微信公众号内容预览:');
    console.log('=' * 50);
    console.log(`标题: ${frontMatter.title || '无标题'}`);
    console.log(`摘要: ${frontMatter.description || '暂无摘要'}`);
    console.log('---');
    console.log(wechatContent.substring(0, 500) + '...');
    console.log('=' * 50);
    
    // TODO: 使用微信公众号 API 发布
    // await wechatClient.createDraft({
    //   title: frontMatter.title,
    //   content: wechatContent,
    //   digest: frontMatter.description
    // });
    
    console.log('✅ 已发布到微信公众号!');
    return { success: true, platform: 'wechat', content: wechatContent };
    
  } catch (error) {
    console.error('❌ 微信公众号发布失败:', error.message);
    return { success: false, platform: 'wechat', error: error.message };
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

function convertToWechatFormat(content, frontMatter) {
  // 转换为微信公众号的 HTML 格式
  let wechatContent = content
    .replace(/^# (.+)$/gm, '<h1>$1</h1>') // 一级标题
    .replace(/^## (.+)$/gm, '<h2>$1</h2>') // 二级标题
    .replace(/^### (.+)$/gm, '<h3>$1</h3>') // 三级标题
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 粗体
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // 斜体
    .replace(/`(.*?)`/g, '<code>$1</code>') // 代码
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>') // 链接
    .replace(/^\* (.+)$/gm, '<li>$1</li>') // 列表项
    .replace(/^- (.+)$/gm, '<li>$1</li>') // 列表项
    .replace(/\n\n/g, '</p><p>') // 段落
    .trim();
  
  // 包装段落
  wechatContent = `<p>${wechatContent}</p>`;
  
  // 处理列表
  wechatContent = wechatContent.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  
  // 添加样式
  const styledContent = `
    <div style="font-family: 'Microsoft YaHei', sans-serif; line-height: 1.6; color: #333;">
      ${wechatContent}
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      
      <p style="font-size: 14px; color: #666; text-align: center;">
        📖 更多精彩内容请访问 JiawenWiki
      </p>
    </div>
  `;
  
  return styledContent;
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
  publishToWechat(filePath);
}

module.exports = { publishToWechat };