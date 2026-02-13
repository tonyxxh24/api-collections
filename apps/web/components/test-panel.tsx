'use client';

import { useState } from 'react';
import { API_BASE_URL } from './api-client';

export function TestPanel({ id }: { id: string }) {
  const [payload, setPayload] = useState('{\n  "postId": 1\n}');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function onTest() {
    setLoading(true);
    setResult('');
    try {
      const parsedPayload = payload ? JSON.parse(payload) : {};
      const res = await fetch(`${API_BASE_URL}/apis/${id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedPayload)
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>測試面板</h3>
      <label htmlFor="payload">Payload (JSON)</label>
      <textarea id="payload" rows={8} value={payload} onChange={(e) => setPayload(e.target.value)} />
      <div style={{ marginTop: 8 }}>
        <button onClick={onTest} disabled={loading}>{loading ? '測試中...' : '送出測試'}</button>
      </div>
      {result && (
        <>
          <h4>回應</h4>
          <pre>{result}</pre>
        </>
      )}
    </div>
  );
}
