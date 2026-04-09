const PDFDocument = require('pdfkit');
const { createCanvas } = require('canvas'); // npm i canvas for PDF charts

module.exports = async (req, res) => {
  const { format, session } = req.query;
  // Fetch session stats from cache/DB (use Vercel KV in prod)
  const report = { session, /* full stats */ };

  if (format === 'pdf') {
    res.set('Content-Type', 'application/pdf');
    const doc = new PDFDocument();
    doc.pipe(res);
    doc.text(JSON.stringify(report, null, 2));
    doc.end();
  } else if (format === 'csv') {
    // CSV generation
    res.set('Content-Type', 'text/csv');
    res.send('timestamp,rps,errors\n' + report.data.map(d => `${d.timestamp},${d.rps},${d.errors}`).join('\n'));
  } else {
    res.json(report);
  }
};
