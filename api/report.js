export default function handler(req, res) {
  res.json({
    message: "Report endpoint - add your stats here",
    timestamp: new Date().toISOString()
  });
}
