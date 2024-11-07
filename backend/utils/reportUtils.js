const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const generateExcelReport = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  worksheet.columns = [
    { header: 'User ID', key: 'user_id', width: 10 },
    { header: 'Project ID', key: 'project_id', width: 10 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Hours', key: 'hours', width: 10 },
    { header: 'Task', key: 'task', width: 25 },
  ];

  data.forEach((row) => worksheet.addRow(row));

  const filePath = path.join(__dirname, '..', 'temp', 'report.xlsx');
  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

const generatePdfReport = async (data) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, '..', 'temp', 'report.pdf');
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(12).text('Report', { align: 'center' });
  data.forEach((row) => {
    doc.text(`User ID: ${row.user_id} | Project ID: ${row.project_id} | Date: ${row.date} | Hours: ${row.hours} | Task: ${row.task}`);
  });

  doc.end();
  return filePath;
};

module.exports = { generateExcelReport, generatePdfReport };
