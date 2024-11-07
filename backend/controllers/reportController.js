const pool = require('../config/db');
const { generateExcelReport, generatePdfReport } = require('../utils/reportUtils');

const generateReport = async (req, res) => {
  const { format } = req.query;
  try {
    const result = await pool.query('SELECT * FROM work_hours');
    const data = result.rows;

    if (format === 'excel') {
      const file = await generateExcelReport(data);
      res.download(file, 'report.xlsx');
    } else if (format === 'pdf') {
      const file = await generatePdfReport(data);
      res.download(file, 'report.pdf');
    } else {
      res.status(400).json({ error: "Formato no válido" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateReport };
