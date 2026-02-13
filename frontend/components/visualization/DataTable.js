export function DataTable({ columns, rows }) {
  const table = document.createElement("div");
  table.className = "table-wrap";

  if (!rows.length) {
    table.innerHTML = '<div class="state-box">No rows to display.</div>';
    return table;
  }

  const head = columns.map((column) => `<th>${column.label}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((column) => `<td>${row[column.key] ?? "-"}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  table.innerHTML = `<table class="data-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  return table;
}
