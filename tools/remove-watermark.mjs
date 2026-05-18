#!/usr/bin/env node

/**
 * 图片去水印工具
 * 
 * 使用方法：
 *   node tools/remove-watermark.mjs --input input.jpg --output output.jpg --region "100,100,200,50"
 *   node tools/remove-watermark.mjs --input input.jpg --output output.jpg --region "100,100,200,50" --method blur
 *   node tools/remove-watermark.mjs --input input.jpg --output output.jpg --region "100,100,200,50" --method inpaint
 * 
 * 参数说明：
 *   --input, -i      输入图片路径（必需）
 *   --output, -o     输出图片路径（必需）
 *   --region, -r     水印区域，格式：x,y,width,height（必需）
 *   --method, -m     去水印方法：blur（模糊）、inpaint（修复）、fill（填充）（默认：blur）
 *   --blur-radius    模糊半径（默认：10）
 *   --fill-color     填充颜色，格式：r,g,b（默认：255,255,255）
 * 
 * 示例：
 *   node tools/remove-watermark.mjs -i photo.jpg -o clean.jpg -r "50,50,100,30"
 *   node tools/remove-watermark.mjs -i photo.jpg -o clean.jpg -r "50,50,100,30" -m inpaint
 */

import { parseArgs } from 'node:util';
import sharp from 'sharp';
import { existsSync } from 'fs';
import { resolve } from 'path';

// 解析命令行参数
const options = {
  input: { type: 'string', short: 'i' },
  output: { type: 'string', short: 'o' },
  region: { type: 'string', short: 'r' },
  method: { type: 'string', short: 'm', default: 'blur' },
  'blur-radius': { type: 'string', default: '10' },
  'fill-color': { type: 'string', default: '255,255,255' },
  help: { type: 'boolean', short: 'h' },
};

let args;
try {
  args = parseArgs({ options, allowPositionals: true });
} catch (err) {
  console.error('❌ 参数解析错误:', err.message);
  process.exit(1);
}

if (args.values.help) {
  console.log(`
图片去水印工具

使用方法：
  node tools/remove-watermark.mjs --input input.jpg --output output.jpg --region "100,100,200,50"

参数说明：
  --input, -i      输入图片路径（必需）
  --output, -o     输出图片路径（必需）
  --region, -r     水印区域，格式：x,y,width,height（必需）
  --method, -m     去水印方法：blur（模糊）、inpaint（修复）、fill（填充）（默认：blur）
  --blur-radius    模糊半径（默认：10）
  --fill-color     填充颜色，格式：r,g,b（默认：255,255,255）
  `);
  process.exit(0);
}

const { input, output, region, method } = args.values;
const blurRadius = parseInt(args.values['blur-radius'], 10);
const fillColor = args.values['fill-color'].split(',').map(Number);

// 验证必需参数
if (!input || !output || !region) {
  console.error('❌ 缺少必需参数：--input, --output, --region');
  console.error('使用 --help 查看帮助');
  process.exit(1);
}

// 解析区域参数
const regionParts = region.split(',').map(Number);
if (regionParts.length !== 4 || regionParts.some(isNaN)) {
  console.error('❌ 区域格式错误，应为：x,y,width,height');
  process.exit(1);
}

const [x, y, width, height] = regionParts;

// 验证输入文件
const inputPath = resolve(input);
if (!existsSync(inputPath)) {
  console.error(`❌ 输入文件不存在: ${inputPath}`);
  process.exit(1);
}

console.log(`🖼️  图片去水印工具`);
console.log(`   输入文件: ${inputPath}`);
console.log(`   输出文件: ${resolve(output)}`);
console.log(`   水印区域: x=${x}, y=${y}, 宽=${width}, 高=${height}`);
console.log(`   处理方法: ${method}`);
console.log('');

async function removeWatermark() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`📐 图片尺寸: ${metadata.width}x${metadata.height}`);
    
    // 验证区域是否在图片范围内
    if (x < 0 || y < 0 || x + width > metadata.width || y + height > metadata.height) {
      console.error('❌ 水印区域超出图片范围');
      process.exit(1);
    }
    
    let processedImage;
    
    switch (method) {
      case 'blur':
        console.log(`🔧 使用模糊方法，半径: ${blurRadius}`);
        processedImage = await blurRegion(image, metadata);
        break;
        
      case 'inpaint':
        console.log('🔧 使用修复方法（基于周围像素）');
        processedImage = await inpaintRegion(image, metadata);
        break;
        
      case 'fill':
        console.log(`🔧 使用填充方法，颜色: rgb(${fillColor.join(',')})`);
        processedImage = await fillRegion(image, metadata);
        break;
        
      default:
        console.error(`❌ 未知方法: ${method}`);
        process.exit(1);
    }
    
    await processedImage.toFile(resolve(output));
    console.log(`✅ 处理完成，已保存到: ${resolve(output)}`);
    
  } catch (err) {
    console.error('❌ 处理失败:', err.message);
    process.exit(1);
  }
}

async function blurRegion(image, metadata) {
  // 创建模糊蒙版
  const blurred = await image
    .extract({ left: x, top: y, width, height })
    .blur(blurRadius)
    .toBuffer();
  
  // 将模糊区域合成回原图
  return image.composite([{
    input: blurred,
    left: x,
    top: y,
  }]);
}

async function inpaintRegion(image, metadata) {
  // 简单的修复方法：使用周围像素的平均值
  // 这里使用模糊作为近似，实际修复算法更复杂
  const blurred = await image
    .extract({ left: x, top: y, width, height })
    .blur(blurRadius * 2)
    .toBuffer();
  
  return image.composite([{
    input: blurred,
    left: x,
    top: y,
  }]);
}

async function fillRegion(image, metadata) {
  // 创建纯色填充
  const fillBuffer = await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: fillColor[0], g: fillColor[1], b: fillColor[2] },
    },
  })
    .png()
    .toBuffer();
  
  return image.composite([{
    input: fillBuffer,
    left: x,
    top: y,
  }]);
}

removeWatermark();