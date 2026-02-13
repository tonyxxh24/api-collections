import { LineChart } from "./LineChart.js";
import { BarChart } from "./BarChart.js";

function inferDefaultChart(visualizationHints = {}) {
  if (visualizationHints.defaultChart) {
    return visualizationHints.defaultChart;
  }

  if (visualizationHints.xAxisType === "time") {
    return "line";
  }

  if (visualizationHints.comparison === "category") {
    return "bar";
  }

  return "line";
}

export function ChartPanel({ title, series, visualizationHints }) {
  const panel = document.createElement("section");
  panel.className = "card";

  let selected = inferDefaultChart(visualizationHints);

  const titleEl = document.createElement("h3");
  titleEl.className = "card-title";
  titleEl.textContent = title;

  const toolbar = document.createElement("div");
  toolbar.className = "chart-toolbar";

  const hint = document.createElement("small");
  hint.style.color = "var(--gray-600)";
  hint.textContent = `Auto selected: ${selected}`;

  const chartHost = document.createElement("div");

  function renderChart() {
    chartHost.replaceChildren(
      selected === "line" ? LineChart({ series }) : BarChart({ series }),
    );

    [...toolbar.querySelectorAll("button")].forEach((button) => {
      button.classList.toggle("active", button.dataset.type === selected);
    });
  }

  ["line", "bar"].forEach((type) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.type = type;
    button.textContent = type === "line" ? "Line" : "Bar";
    button.addEventListener("click", () => {
      selected = type;
      renderChart();
    });
    toolbar.append(button);
  });

  panel.append(titleEl, toolbar, hint, chartHost);
  renderChart();
  return panel;
}
