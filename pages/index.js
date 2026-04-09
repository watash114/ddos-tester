
import { useState } from 'react';

export default function Home() {
  const [target, setTarget] = useState('');
  const [workers, setWorkers] = useState(50);
  const [duration, setDuration] = useState(60);
  const [method, setMethod] = useState('http2');
  const [status, setStatus] = useState('');
  const [stats, setStats] = useState({ rps: 0, errors: 0 });

  const startTest = async () => {
    setStatus('Attacking...');
    const res = await fetch('/api/stress', {
      method: 'POST',
      body: JSON.stringify({ target, workers, duration, method }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setStatus('Done: ' + data.status);
    setStats(data.stats);
  };

  return (
    <div style={{padding:'20px', maxWidth:'800px', margin:'auto'}}>
      <h1>🔥 Ultimate DDoS Tester v3.0</h1>
      <p>Test YOUR website only</p>
      
      <input placeholder="https://your-site.com" value={target} onChange={e=>setTarget(e.target.value)} style={{width:'100%',padding:'10px',margin:'5px 0'}} />
      <br/>
      <select value={method} onChange={e=>setMethod(e.target.value)} style={{padding:'10px',margin:'5px 0'}}>
        <option>HTTP/2 Flood</option>
        <option>WebSocket</option>
        <option>Slowloris</option>
        <option>SYN Flood</option>
      </select>
      <br/>
      <input type="number" placeholder="Workers" value={workers} onChange={e=>setWorkers(e.target.value)} style={{padding:'10px',width:'120px',margin:'5px 5px 5px 0'}} />
      <input type="number" placeholder="Seconds" value={duration} onChange={e=>setDuration(e.target.value)} style={{padding:'10px',width:'120px',margin:'5px'}} />
      <br/>
      <button onClick={startTest} style={{padding:'15px 30px', background:'#ff4444', color:'white', border:'none', fontSize:'16px', cursor:'pointer'}}>
        🚀 START ATTACK
      </button>
      
      <div style={{marginTop:'20px', padding:'20px', background:'#f0f0f0'}}>
        <h3>Status: {status}</h3>
        <div>RPS: {stats.rps} | Errors: {stats.errors}</div>
      </div>
    </div>
  );
}
