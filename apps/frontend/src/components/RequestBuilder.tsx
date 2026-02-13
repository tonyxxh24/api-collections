import { useState } from 'react';

export function RequestBuilder() {
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/');

  return (
    <section>
      <h2>Test Console</h2>
      <label>
        Method
        <select value={method} onChange={(event) => setMethod(event.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </label>
      <label>
        Path
        <input value={path} onChange={(event) => setPath(event.target.value)} />
      </label>
      <output aria-label="request-preview">{`${method} ${path}`}</output>
    </section>
  );
}
