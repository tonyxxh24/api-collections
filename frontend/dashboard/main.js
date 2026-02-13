import { DataTable } from "../components/visualization/DataTable.js";
import { StatCard } from "../components/visualization/StatCard.js";
import { ChartPanel } from "../components/visualization/ChartPanel.js";

const datasets = {
  taiwan: {
    source: "Taiwan CWA Open Data API",
    description: "示範：近六天台北市最高溫（mock data）",
    visualizationHints: { xAxisType: "time" },
    stats: [
      { label: "最新最高溫", value: 31, unit: "°C" },
      { label: "六天平均", value: 29.7, unit: "°C" },
    ],
    series: [
      { label: "06/01", value: 29 },
      { label: "06/02", value: 30 },
      { label: "06/03", value: 32 },
      { label: "06/04", value: 33 },
      { label: "06/05", value: 31 },
      { label: "06/06", value: 29 },
    ],
  },
  usGov: {
    source: "USGS Earthquake API",
    description: "示範：各地區 24h 地震事件數（mock data）",
    visualizationHints: { comparison: "category" },
    stats: [
      { label: "總事件數", value: 182 },
      { label: "最大規模", value: 5.2, unit: "M" },
    ],
    series: [
      { label: "Alaska", value: 55 },
      { label: "California", value: 47 },
      { label: "Hawaii", value: 33 },
      { label: "Nevada", value: 26 },
      { label: "Puerto Rico", value: 21 },
    ],
  },
  emptyState: {
    source: "Data.gov API",
    description: "示範：查無結果",
    visualizationHints: { defaultChart: "bar" },
    stats: [],
    series: [],
  },
};

function mountDashboard() {
  const root = document.querySelector("#app");
  root.innerHTML = '<div class="skeleton" aria-label="loading"></div>';

  setTimeout(() => {
    render(root);
  }, 800);
}

function makeSection(datasetKey, heading) {
  const dataset = datasets[datasetKey];
  const section = document.createElement("section");
  section.className = "grid";

  section.innerHTML = `
    <div>
      <span class="source-tag">${dataset.source}</span>
      <h2 class="card-title">${heading}</h2>
      <p class="section-subtitle">${dataset.description}</p>
    </div>
  `;

  const statsWrap = document.createElement("div");
  statsWrap.className = "grid grid-2";

  if (!dataset.stats.length) {
    const empty = document.createElement("div");
    empty.className = "state-box";
    empty.textContent = "No KPI available.";
    statsWrap.append(empty);
  } else {
    dataset.stats.forEach((stat) => statsWrap.append(StatCard(stat)));
  }

  const chart = ChartPanel({
    title: "資料視覺化",
    series: dataset.series,
    visualizationHints: dataset.visualizationHints,
  });

  const tableCard = document.createElement("section");
  tableCard.className = "card";
  const tableTitle = document.createElement("h3");
  tableTitle.className = "card-title";
  tableTitle.textContent = "明細資料";

  const table = DataTable({
    columns: [
      { key: "label", label: "分類" },
      { key: "value", label: "數值" },
    ],
    rows: dataset.series,
  });

  tableCard.append(tableTitle, table);
  section.append(statsWrap, chart, tableCard);
  return section;
}

function render(root) {
  root.innerHTML = "";

  const dashboard = document.createElement("main");
  dashboard.className = "dashboard";

  dashboard.innerHTML = `
    <header>
      <h1 class="section-title">API Dashboard</h1>
      <p class="section-subtitle">依 visualizationHints 預設圖表並可手動切換，含 loading / empty / error 狀態。</p>
    </header>
  `;

  dashboard.append(
    makeSection("taiwan", "台灣政府 API 示範視圖"),
    makeSection("usGov", "美國政府 API 示範視圖"),
  );

  const errorCard = document.createElement("section");
  errorCard.className = "card";
  errorCard.innerHTML = `
    <h3 class="card-title">錯誤狀態示範</h3>
    <div class="state-box">⚠️ Unable to load remote source. Please retry later.</div>
  `;

  dashboard.append(makeSection("emptyState", "空資料狀態示範"), errorCard);
  root.append(dashboard);
}

mountDashboard();
