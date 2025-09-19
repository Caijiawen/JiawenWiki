#!/usr/bin/env node

/**
 * 一键多平台发布脚本
 * 
 * 使用方法:
 * node scripts/publish-all.js --file docs/trade/bitcoin-guide.md
 * node scripts/publish-all.js --file docs/trade/bitcoin-guide.md --platforms twitter,wechat
 * 
 * 支持的平台: twitter, wechat
 */

const { publishToTwitter } = require('./publish-twitter');
const { publishToWechat } = require('./publish-wechat');

const PLATFORMS = {
  twitter: publishToTwitter,
  wechat: publishToWechat,
};
const SEPARATOR = '='.repeat(50);

async function publishToAllPlatforms(filePath, selectedPlatforms = ['twitter', 'wechat']) {
  console.log(`🚀 开始多平台发布: ${filePath}`);
  console.log(`📋 目标平台: ${selectedPlatforms.join(', ')}`);
  console.log(SEPARATOR);
  
  const results = [];
  
  for (const platform of selectedPlatforms) {
    if (!PLATFORMS[platform]) {
      console.warn(`⚠️  未知平台: ${platform}`);
      continue;
    }
    
    try {
      console.log(`\n📤 发布到 ${platform.toUpperCase()}...`);
      const result = await PLATFORMS[platform](filePath);
      results.push(result);
      
      if (result.success) {
        console.log(`✅ ${platform} 发布成功`);
      } else {
        console.log(`❌ ${platform} 发布失败: ${result.error}`);
      }
      
    } catch (error) {
      console.error(`❌ ${platform} 发布过程中出错:`, error.message);
      results.push({ success: false, platform, error: error.message });
    }
    
    // 平台间稍作延迟，避免过于频繁的请求
    if (selectedPlatforms.indexOf(platform) < selectedPlatforms.length - 1) {
      console.log('⏳ 等待 2 秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // 汇总结果
  console.log('\n' + SEPARATOR);
  console.log('📊 发布结果汇总:');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ 成功: ${successful.length} 个平台`);
  successful.forEach(r => console.log(`  - ${r.platform}`));
  
  if (failed.length > 0) {
    console.log(`❌ 失败: ${failed.length} 个平台`);
    failed.forEach(r => console.log(`  - ${r.platform}: ${r.error}`));
  }
  
  console.log('\n🎉 多平台发布完成!');
  
  return {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    results
  };
}

function generatePublishReport(filePath, results) {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    file: filePath,
    summary: {
      total: results.total,
      successful: results.successful,
      failed: results.failed
    },
    details: results.results
  };
  
  // 可以保存报告到文件
  // fs.writeFileSync(`publish-report-${Date.now()}.json`, JSON.stringify(report, null, 2));
  
  return report;
}

// 命令行接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const fileIndex = args.indexOf('--file');
  const platformsIndex = args.indexOf('--platforms');
  
  if (fileIndex === -1 || !args[fileIndex + 1]) {
    console.error('❌ 请指定文件路径: --file path/to/file.md');
    console.log('');
    console.log('使用示例:');
    console.log('  node scripts/publish-all.js --file docs/trade/bitcoin.md');
    console.log('  node scripts/publish-all.js --file docs/trade/bitcoin.md --platforms twitter,wechat');
    process.exit(1);
  }
  
  const filePath = args[fileIndex + 1];
  let platforms = ['twitter', 'wechat']; // 默认所有平台
  
  if (platformsIndex !== -1 && args[platformsIndex + 1]) {
    platforms = args[platformsIndex + 1].split(',').map(p => p.trim());
  }
  
  publishToAllPlatforms(filePath, platforms)
    .then(results => {
      const report = generatePublishReport(filePath, results);
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 发布过程中发生严重错误:', error);
      process.exit(1);
    });
}

module.exports = { publishToAllPlatforms };
