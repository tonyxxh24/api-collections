import { EmptyState } from "./StateView.js";

function toPolylinePoints(series, width, height, padding) {
  const values = series.map((item) => item.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const xStep = (width - padding * 2) / Math.max(series.length - 1, 1);

  return series
    .map((item, index) => {
      const x = padding + index * xStep;
      const y =
        height -
        padding -
        ((item.value - min) / Math.max(max - min, 1)) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

export function LineChart({ series, width = 760, height = 260 }) {
  const root = document.createElement("div");
  root.className = "chart-root";

  if (!series.length) {
    root.append(EmptyState("No data for line chart."));
    return root;
  }

  const padding = 24;
  const points = toPolylinePoints(series, width, height, padding);
  const labels = series
    .map(
      (item, index) =>
        `<text x="${padding + ((width - padding * 2) / Math.max(series.length - 1, 1)) * index}" y="${height - 6}" font-size="10" fill="#475569" text-anchor="middle">${item.label}</text>`,
    )
    .join("");

  root.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" role="img" aria-label="line chart">
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#cbd5e1" />
      <polyline fill="none" stroke="#0ea5e9" stroke-width="3" points="${points}" />
      ${labels}
    </svg>
  `;

  return root;
}
