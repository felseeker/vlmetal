import sharp from 'file:///C:/Users/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB/.config/opencode/node_modules/sharp';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const imgDir = 'C:\\Users\\Михаил\\Desktop\\vlmetal\\img';
const files = ['mangal.jpg', 'slide2.jpg', 'slide3.jpg', 'slide4.jpg'];

async function removeWatermark(inputPath, outputPath) {
  const image = sharp(inputPath);
  const meta = await image.metadata();
  const { width, height } = meta;

  // Sample background color from bottom-left edge
  const bgSample = await sharp(inputPath)
    .extract({ left: 0, top: height - 3, width: 20, height: 3 })
    .raw()
    .toBuffer();

  const r = bgSample[0], g = bgSample[1], b = bgSample[2];

  // Overlay dark rectangle over watermark area (bottom-right ~150x40px)
  const watermarkW = Math.min(180, width);
  const watermarkH = Math.min(50, height);
  const overlay = await sharp({
    create: {
      width: watermarkW,
      height: watermarkH,
      channels: 3,
      background: { r, g, b }
    }
  }).raw().toBuffer();

  await image
    .composite([{
      input: overlay,
      top: height - watermarkH,
      left: width - watermarkW,
      blend: 'over'
    }])
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
  console.log('Done - watermark removed from all images');
})();
