export function StatCard({ label, value, unit = "" }) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <p class="stat-card-label">${label}</p>
    <p class="stat-card-value">${value}${unit}</p>
  `;

  return card;
}
