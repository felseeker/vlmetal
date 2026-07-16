const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const baseDir = path.join(__dirname, '..', 'объявления', 'фарпост');

const products = [
  {
    id: '01-ogonek',
    folder: '04-мангал-огонёк-базовый',
    name: 'МАНГАЛ ОГОНЁК',
    price: '63 000 ₽',
    specs: ['Сталь 4 мм', 'Термоэмаль 1200°C', 'Шамот', 'Печь 45×45'],
    tag: 'ХИТ',
  },
  {
    id: '02-ogonek-dvojnoj',
    folder: '09-мангал-огонёк-двойной',
    name: 'МАНГАЛ ОГОНЁК ДВОЙНОЙ',
    price: '111 300 ₽',
    specs: ['Сталь 4 мм', 'Печь 45×45', 'Крыша + крышка', 'Лиственница'],
    tag: 'ПОПУЛЯРНЫЙ',
  },
  {
    id: '03-bogatyr',
    folder: '10-мангал-богатырь-п-форма',
    name: 'МАНГАЛ БОГАТЫРЬ П-ФОРМА',
    price: '521 920 ₽',
    specs: ['270 см', 'П-образная', 'Место под тандыр', 'Сталь 4 мм'],
    tag: 'ПРЕМИУМ',
  },
  {
    id: '04-vorota',
    folder: '08-ворота-и-заборы',
    name: 'ВОРОТА И ЗАБОРЫ',
    price: 'от 28 000 ₽',
    specs: ['Распашные', 'Откатные', 'С калиткой', 'Покраска RAL'],
    tag: 'УСЛУГА',
  },
  {
    id: '05-svarka',
    folder: '02-сварочные-работы',
    name: 'СВАРОЧНЫЕ РАБОТЫ',
    price: 'от 300 ₽/точка',
    specs: ['MMA', 'TIG', 'Нержавейка', 'Алюминий'],
    tag: 'УСЛУГА',
  },
  {
    id: '06-pokraska',
    folder: '03-покраска-металла',
    name: 'ПОКРАСКА МЕТАЛЛА',
    price: 'от 500 ₽/м²',
    specs: ['Порошковая', 'Любой RAL', 'Устойчивое покрытие'],
    tag: 'УСЛУГА',
  }
];

async function renderCards() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1920 });

  for (const product of products) {
    const photoDir = path.join(baseDir, product.folder, 'фото');
    let imagePath = '';
    
    if (fs.existsSync(photoDir)) {
      const photos = fs.readdirSync(photoDir)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .sort();
      if (photos.length > 0) {
        imagePath = path.join(photoDir, photos[0]);
        console.log(`Found: ${product.name} -> ${photos[0]}`);
      }
    }
    
    if (!imagePath) {
      console.log(`No image found for ${product.name}`);
      continue;
    }

    const specsHtml = product.specs.map(spec => 
      `<div class="spec">${spec}</div>`
    ).join('\n      ');

    const tagHtml = product.tag ? 
      `<div class="service-tag">${product.tag}</div>` : '';

    const html = template
      .replace('%%IMAGE_PATH%%', imagePath.replace(/\\/g, '/'))
      .replace(/%%NAME%%/g, product.name)
      .replace('%%PRICE%%', product.price)
      .replace('%%SPECS%%', specsHtml)
      .replace('%%TAG%%', tagHtml);

    await page.setContent(html);
    await page.waitForTimeout(500);
    
    const outputPath = path.join(__dirname, `${product.id}.png`);
    await page.screenshot({ path: outputPath, type: 'png' });
    console.log(`Created: ${outputPath}`);
  }

  await browser.close();
}

renderCards().catch(console.error);