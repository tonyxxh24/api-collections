import { useState } from 'react';

export function VisualizationToggle() {
  const [mode, setMode] = useState<'cards' | 'table'>('cards');

  return (
    <section>
      <button onClick={() => setMode('cards')}>Cards</button>
      <button onClick={() => setMode('table')}>Table</button>
      <p aria-label="visualization-mode">{mode}</p>
    </section>
  );
}
