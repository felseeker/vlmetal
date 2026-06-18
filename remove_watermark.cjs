const sharp = require('C:\\Users\\Михаил\\.config\\opencode\\node_modules\\sharp');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const { join } = require('path');

const imgDir = 'C:\\Users\\Михаил\\Desktop\\vlmetal\\img';
const files = ['slide2.jpg', 'slide3.jpg', 'slide4.jpg'];

async function removeWatermark(inputPath, outputPath) {
  const inputBuffer = readFileSync(inputPath);
  const meta = await sharp(inputBuffer).metadata();
  const { width, height } = meta;

  const bgSample = await sharp(inputBuffer)
    .extract({ left: 0, top: height - 3, width: 20, height: 3 })
    .raw()
    .toBuffer();

  const r = bgSample[0], g = bgSample[1], b = bgSample[2];
  const watermarkW = Math.min(180, width);
  const watermarkH = Math.min(50, height);

  const overlay = Buffer.alloc(watermarkW * watermarkH * 3);
  for (let i = 0; i < overlay.length; i += 3) {
    overlay[i] = r;
    overlay[i + 1] = g;
    overlay[i + 2] = b;
  }

  const format = meta.format === 'png' ? 'png' : 'jpeg';
  await sharp(inputBuffer)
    .composite([{
      input: overlay,
      raw: { width: watermarkW, height: watermarkH, channels: 3 },
      top: height - watermarkH,
      left: width - watermarkW,
      blend: 'over'
    }])
    .toFormat(format)
    .toFile(outputPath);

  console.log(`  OK ${inputPath.split('\\').pop()}`);
}

(async () => {
  for (const file of files) {
    const inputPath = join(imgDir, file);
    const tmpPath = join(imgDir, `_${file}`);
    console.log(`Processing ${file}...`);
    await removeWatermark(inputPath, tmpPath);
    writeFileSync(inputPath, readFileSync(tmpPath));
    try { unlinkSync(tmpPath); } catch {}
  }
  console.log('Done - watermarks removed from slide images');
})();
