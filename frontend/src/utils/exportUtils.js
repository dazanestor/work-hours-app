// src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export const exportToExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, 'Reporte.xlsx');
};

export const exportToPDF = (data) => {
  const doc = new jsPDF();
  doc.text('Reporte de Horas de Trabajo', 20, 10);
  data.forEach((entry, i) => {
    doc.text(`Proyecto: ${entry.projectId}, Fecha: ${entry.date}, Horas: ${entry.hours}`, 20, 20 + i * 10);
  });
  doc.save('Reporte.pdf');
};
