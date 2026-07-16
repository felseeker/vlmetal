import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const base = 'C:\\Users\\Михаил\\Desktop\\vlmetal\\объявления\\фарпост';

const files = [
  '13-полки-стеллажи\\фото\\02-полки-ген.png',
  '13-полки-стеллажи\\фото\\03-polki-gen-5.jpg',
  '13-полки-стеллажи\\фото\\04-polki-workshop.png',
  '13-полки-стеллажи\\фото\\05-polki-closet.png',
  '14-мостики\\фото\\02-мостик-ген.png',
  '14-мостики\\фото\\03-mostik-forest.png',
  '14-мостики\\фото\\04-mostik-dacha.png',
  '14-мостики\\фото\\05-mostik-japanese.png',
  '15-тамбуры\\фото\\03-tambur-zima.png',
  '15-тамбуры\\фото\\04-tambur-vityazhka.png',
  '15-тамбуры\\фото\\05-tambur-bitovka.png',
  '16-теплицы\\фото\\04-teplica-ogorod.png',
  '16-теплицы\\фото\\05-teplica-vesna.png',
];

for (const file of files) {
  const fullPath = path.join(base, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP (not found): ${file}`);
    continue;
  }
  try {
    const meta = await sharp(fullPath).metadata();
    const w = meta.width;
    const h = meta.height;
    // Crop 50px from bottom-right corner to remove watermark
    const cropW = Math.min(50, w);
    const cropH = Math.min(50, h);
    await sharp(fullPath)
      .extract({ left: 0, top: 0, width: w - cropW, height: h - cropH })
      .toFile(fullPath + '.tmp');
    fs.renameSync(fullPath + '.tmp', fullPath);
    console.log(`OK: ${file} (${w}x${h} -> ${w - cropW}x${h - cropH})`);
  } catch (e) {
    console.log(`ERR: ${file} - ${e.message}`);
  }
}
console.log('Done!');
