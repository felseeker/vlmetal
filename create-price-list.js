const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const workbook = new ExcelJS.Workbook();
const ws = workbook.addWorksheet('Прайс-лист', {
  properties: { defaultColWidth: 20 },
  views: [{ state: 'frozen', ySplit: 1 }]
});

const baseDir = path.join(__dirname, 'объявления', 'фарпост');

const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A0A0A' } };
const headerFont = { bold: true, color: { argb: 'FFFF6A00' }, size: 12 };
const categoryFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A1A1A' } };
const categoryFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
const dataFont = { size: 10 };
const priceFont = { bold: true, color: { argb: 'FFFF6A00' }, size: 11 };

ws.columns = [
  { width: 5 },   // A: №
  { width: 15 },  // B: Фото
  { width: 35 },  // C: Наименование
  { width: 18 },  // D: Цена
  { width: 15 },  // E: Ед.изм
  { width: 50 },  // F: Описание
];

// Title
ws.mergeCells('A1:F1');
const titleCell = ws.getCell('A1');
titleCell.value = 'КОНЦЕПЦИЯ СТРОИТЕЛЬСТВА — ПРАЙС-ЛИСТ';
titleCell.font = { bold: true, color: { argb: 'FFFF6A00' }, size: 14 };
titleCell.fill = headerFill;
titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
ws.getRow(1).height = 30;

ws.mergeCells('A2:F2');
const subtitleCell = ws.getCell('A2');
subtitleCell.value = 'Владивосток, ул. Татарская 11 | концепция-строительства.рф | тел: +7 (XXX) XXX-XX-XX';
subtitleCell.font = { color: { argb: 'FF888888' }, size: 9 };
subtitleCell.fill = headerFill;
subtitleCell.alignment = { horizontal: 'center' };

// Read CSV
const csvPath = path.join(baseDir, 'прайс-лист', 'прайс-лист.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n').filter(l => l.trim());

let currentRow = 3;
let itemNumber = 1;
let lastCategory = '';

// Parse CSV properly (handle commas in quotes)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

for (let i = 1; i < lines.length; i++) {
  const parts = parseCSVLine(lines[i]);
  if (parts.length < 6) continue;
  
  const [category, name, price, unit, folder, note] = parts;
  
  // Category header
  if (category !== lastCategory) {
    ws.mergeCells(`A${currentRow}:F${currentRow}`);
    const catCell = ws.getCell(`A${currentRow}`);
    catCell.value = category;
    catCell.font = categoryFont;
    catCell.fill = categoryFill;
    catCell.alignment = { vertical: 'middle' };
    ws.getRow(currentRow).height = 25;
    currentRow++;
    lastCategory = category;
  }
  
  const row = ws.getRow(currentRow);
  
  // Number
  const numCell = ws.getCell(`A${currentRow}`);
  numCell.value = itemNumber;
  numCell.font = dataFont;
  numCell.alignment = { horizontal: 'center', vertical: 'middle' };
  
  // Photo
  const photoDir = path.join(baseDir, folder, 'фото');
  let photoAdded = false;
  
  if (fs.existsSync(photoDir)) {
    const photos = fs.readdirSync(photoDir)
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .sort();
    
    if (photos.length > 0) {
      const photoPath = path.join(photoDir, photos[0]);
      try {
        const imageId = workbook.addImage({
          filename: photoPath,
          extension: path.extname(photos[0]).slice(1)
        });
        
        ws.addImage(imageId, {
          tl: { col: 1, row: currentRow - 1 },
          ext: { width: 80, height: 60 }
        });
        
        photoAdded = true;
      } catch (e) {}
    }
  }
  
  if (!photoAdded) {
    const photoCell = ws.getCell(`B${currentRow}`);
    photoCell.value = '—';
    photoCell.alignment = { horizontal: 'center', vertical: 'middle' };
  }
  
  // Name
  const nameCell = ws.getCell(`C${currentRow}`);
  nameCell.value = name;
  nameCell.font = { ...dataFont, bold: true };
  nameCell.alignment = { vertical: 'middle', wrapText: true };
  
  // Price
  const priceCell = ws.getCell(`D${currentRow}`);
  priceCell.value = price;
  priceCell.font = priceFont;
  priceCell.alignment = { horizontal: 'right', vertical: 'middle' };
  
  // Unit
  const unitCell = ws.getCell(`E${currentRow}`);
  unitCell.value = unit;
  unitCell.font = dataFont;
  unitCell.alignment = { horizontal: 'center', vertical: 'middle' };
  
  // Note
  const noteCell = ws.getCell(`F${currentRow}`);
  noteCell.value = note;
  noteCell.font = { size: 9, color: { argb: 'FF666666' } };
  noteCell.alignment = { vertical: 'middle', wrapText: true };
  
  row.height = 50;
  itemNumber++;
  currentRow++;
}

const outputPath = path.join(baseDir, 'прайс-лист', 'прайс-лист-с-фото.xlsx');
workbook.xlsx.writeFile(outputPath)
  .then(() => console.log('Created: ' + outputPath + ' (' + (itemNumber - 1) + ' items)'))
  .catch(err => console.error('Error:', err));