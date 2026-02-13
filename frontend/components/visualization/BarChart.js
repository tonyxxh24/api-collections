export function BarChart({ series, width = 760, height = 260 }) {
  const root = document.createElement("div");
  root.className = "chart-root";

  if (!series.length) {
    root.innerHTML = '<div class="state-box">No data for bar chart.</div>';
    return root;
  }

  const padding = 24;
  const max = Math.max(...series.map((item) => item.value), 1);
  const barWidth = (width - padding * 2) / series.length - 10;

  const bars = series
    .map((item, index) => {
      const x = padding + index * ((width - padding * 2) / series.length) + 4;
      const barHeight = (item.value / max) * (height - padding * 2);
      const y = height - padding - barHeight;
      const labelX = x + barWidth / 2;

      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="#0ea5e9" />
        <text x="${labelX}" y="${height - 6}" font-size="10" fill="#475569" text-anchor="middle">${item.label}</text>
      `;
    })
    .join("");

  root.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" role="img" aria-label="bar chart">
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#cbd5e1" />
      ${bars}
    </svg>
  `;

  return root;
}
