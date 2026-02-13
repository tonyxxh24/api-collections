const fs = require('node:fs');
const path = require('node:path');

const seedPath = path.join(__dirname, '..', 'data', 'apis', 'seed.json');

function loadApis() {
  return JSON.parse(fs.readFileSync(seedPath, 'utf8'));
}

function includesIgnoreCase(value, searchText) {
  return String(value || '').toLowerCase().includes(searchText.toLowerCase());
}

function equalsIgnoreCase(value, target) {
  return String(value || '').toLowerCase() === String(target || '').toLowerCase();
}

function matchesSearch(api, q) {
  if (!q) return true;

  return [
    api.id,
    api.name,
    api.country,
    api.organization,
    api.category,
    ...(api.tags || [])
  ].some((field) => includesIgnoreCase(field, q));
}

function filterApis(apis, filters = {}) {
  const { country, pricing, category, q } = filters;

  return apis.filter((api) => {
    if (country && !equalsIgnoreCase(api.country, country)) return false;
    if (pricing && !equalsIgnoreCase(api.pricing, pricing)) return false;
    if (category && !equalsIgnoreCase(api.category, category)) return false;
    if (!matchesSearch(api, q)) return false;

    return true;
  });
}

module.exports = {
  loadApis,
  filterApis
};
