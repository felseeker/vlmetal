const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

const products = [
  {
    id: '05',
    folder: '05-мангал-силач-140',
    name: 'МАНГАЛ СИЛАЧ 140',
    price: '67 900 ₽',
    specs: ['Сталь 4 мм', 'Коптильня', 'Термоэмаль 1200°C'],
    image: '01-силач-140.jpg'
  },
  {
    id: '06',
    folder: '06-костровая-чаша',
    name: 'КОСТРОВАЯ ЧАША',
    price: '20 860 ₽',
    specs: ['Сталь 4 мм', 'Диаметр 80 см', 'Термоэмаль 1200°C'],
    image: '01-чаша-80см.jpg'
  },
  {
    id: '07',
    folder: '07-мангал-северный-ветер',
    name: 'СЕВЕРНЫЙ ВЕТЕР HPL',
    price: '164 500 ₽',
    specs: ['295 см', 'HPL-панели', 'Встроенная печь'],
    image: '01-северный-ветер.jpg'
  },
  {
    id: '08',
    folder: '08-ворота-и-заборы',
    name: 'ВОРОТА И ЗАБОРЫ',
    price: 'от 1 500 ₽/м',
    specs: ['Распашные', 'Раздвижные', 'С калиткой'],
    image: '01-ворота-раздвижные.jpg'
  },
  {
    id: '09',
    folder: '09-навесы',
    name: 'НАВЕСЫ ИЗ МЕТАЛЛА',
    price: 'от 10 000 ₽',
    specs: ['Для авто', 'Профнастил', 'Поликарбонат'],
    image: '01-автонавес-1.jpg'
  },
  {
    id: '10',
    folder: '10-лестницы',
    name: 'ЛЕСТНИЦЫ МЕТАЛЛИЧЕСКИЕ',
    price: 'от 15 000 ₽',
    specs: ['Внутренние', 'Наружные', 'Винтовые'],
    image: '01-промышленная.jpg'
  },
  {
    id: '11',
    folder: '11-кованые-перила-декор',
    name: 'КОВАНЫЕ ПЕРИЛА',
    price: 'от 3 000 ₽/м',
    specs: ['Декоративные', 'Для лестниц', 'Для балконов'],
    image: '01-перила-декор.jpg'
  },
  {
    id: '12',
    folder: '12-ограждения-на-балконы',
    name: 'ОГРАЖДЕНИЯ НА БАЛКОНЫ',
    price: 'от 1 800 ₽/м',
    specs: ['Безопасные', 'По нормам', 'Панорамные'],
    image: '01-ограждения.jpg'
  },
  {
    id: '13',
    folder: '13-полки-стеллажи',
    name: 'ПОЛКИ И СТЕЛЛАЖИ',
    price: 'от 1 000 ₽',
    specs: ['Для гаража', 'Нагрузка 100 кг', 'Под размер'],
    image: '01-полки.jpg'
  },
  {
    id: '14',
    folder: '14-мостики',
    name: 'ДЕКОРАТИВНЫЕ МОСТИКИ',
    price: 'от 5 000 ₽',
    specs: ['Для сада', 'С ковкой', 'Под размер'],
    image: '01-мостик.jpg'
  },
  {
    id: '15',
    folder: '15-тамбуры',
    name: 'ТАМБУРЫ МЕТАЛЛИЧЕСКИЕ',
    price: 'от 15 000 ₽',
    specs: ['С утеплением', 'С вытяжкой', 'Под ключ'],
    image: '01-тамбур-1.jpg'
  },
  {
    id: '16',
    folder: '16-теплицы',
    name: 'ТЕПЛИЦЫ МЕТАЛЛИЧЕСКИЕ',
    price: 'от 15 000 ₽',
    specs: ['Арочные', 'Под поликарбонат', 'Усиленные'],
    image: '01-теплица.jpg'
  }
];

async function renderCards() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1000, height: 1000 });

  for (const product of products) {
    const imagePath = path.join(__dirname, '..', 'объявления', 'фарпост', product.folder, 'фото', product.image);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`Image not found: ${imagePath}`);
      continue;
    }

    const html = template
      .replace('%%IMAGE_PATH%%', imagePath.replace(/\\/g, '/'))
      .replace('МАНГАЛ СИЛАЧ 140', product.name)
      .replace('67 900 ₽', product.price)
      .replace(
        '<svg class="spec-icon" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="1" fill="none" stroke="#ff6a00" stroke-width="2"/><line x1="7" y1="8" x2="7" y2="4" stroke="#ff6a00" stroke-width="2"/></svg>\n      Сталь 4 мм',
        product.specs.map((spec, i) => {
          const icons = [
            '<svg class="spec-icon" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="1" fill="none" stroke="#ff6a00" stroke-width="2"/><line x1="7" y1="8" x2="7" y2="4" stroke="#ff6a00" stroke-width="2"/></svg>',
            '<svg class="spec-icon" viewBox="0 0 24 24"><path d="M12 2C8 6 4 10 4 14a8 8 0 0016 0c0-4-4-8-8-12z" fill="none" stroke="#ff6a00" stroke-width="2"/></svg>',
            '<svg class="spec-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#ff6a00" stroke-width="2"/><line x1="12" y1="7" x2="12" y2="12" stroke="#ff6a00" stroke-width="2"/><line x1="12" y1="12" x2="16" y2="14" stroke="#ff6a00" stroke-width="2"/></svg>'
          ];
          return `<div class="spec">${icons[i % icons.length]} ${spec}</div>`;
        }).join('\n    <div class="spec">')
      );

    await page.setContent(html);
    await page.waitForTimeout(500);
    
    const cardPath = path.join(__dirname, '..', 'объявления', 'фарпост', product.folder, 'карточка', `${product.id}-card.png`);
    await page.screenshot({ path: cardPath, type: 'png' });
    console.log(`Created: ${cardPath}`);
  }

  await browser.close();
}

renderCards().catch(console.error);