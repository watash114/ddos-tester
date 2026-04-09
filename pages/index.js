import { useState, useEffect } from 'react';
import Chart from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

export default function Home() {
  const [target, setTarget] = useState('');
  const [workers, setWorkers] = useState(50);
  const [duration, setDuration] = useState(60);
  const [method, setMethod] = useState('http2');
  const [status, setStatus] = useState('');
  const [stats, setStats] = useState({ rps: 0, errors: 0, data: [] });
  const [report, setReport] = useState(null);

  const startTest = async () => {
    setStatus('Starting...');
    const res = await fetch('/api/stress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, workers, duration, method })
    });
    const data = await res.json();
    setStatus(data.status);
    setStats(data.stats);
    if (data.report) setReport(data.report);
  };

  const downloadReport = (format) => {
    const url = `/api/report?format=${format}&session=${report.session}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `ddos-report-${Date.now()}.${format}`;
    a.click();
  };

  const chartData = {
    datasets: [
      { label: 'RPS', data: stats.data.map(d => ({ x: new Date(d.timestamp), y: d.rps })), borderColor: 'green' },
      { label: 'Errors', data: stats.data.map(d => ({ x: new Date(d.timestamp), y: d.errors })), borderColor: 'red' }
    ]
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <h1>Ultimate DDoS Tester v3.0</h1>
      <p>For authorized pentesting of YOUR website only.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <input placeholder="Target URL (e.g., https://your-site.com)" value={target} onChange={e => setTarget(e.target.value)} style={{ padding: '10px', width: '100%' }} />
        <select value={method} onChange={e => setMethod(e.target.value)}>
          <option value="http2">HTTP/2 Flood</option>
          <option value="http3">HTTP/3 (QUIC)</option>
          <option value="ws">WebSocket</option>
          <option value="slowloris">Slowloris</option>
          <option value="rudy">RUDY</option>
          <option value="syn">SYN Flood Sim</option>
          <option value="udp">UDP Flood</option>
        </select>
        <input type="number" placeholder="Workers" value={workers} onChange={e => setWorkers(e.target.value)} min="1" max="500" />
        <input type="number" placeholder="Duration (s)" value={duration} onChange={e => setDuration(e.target.value)} min="10" max="300" />
        <button onClick={startTest} style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none' }}>Start Test</button>
        <div />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Status: {status}</h3>
        <div>RPS: {stats.rps} | Errors: {stats.errors}</div>
        {stats.data.length > 0 && <Chart type="line" data={chartData} options={{ scales: { x: { type: 'time' } } }} />}
      </div>

      {report && (
        <div style={{ marginTop: '20px' }}>
          <h3>Report</h3>
          <pre>{JSON.stringify(report, null, 2)}</pre>
          <button onClick={() => downloadReport('json')}>JSON</button>
          <button onClick={() => downloadReport('csv')}>CSV</button>
          <button onClick={() => downloadReport('pdf')}>PDF</button>
        </div>
      )}
    </div>
  );
}
