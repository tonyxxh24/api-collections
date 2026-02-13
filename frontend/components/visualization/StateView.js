function makeStateBox(message) {
  const box = document.createElement("div");
  box.className = "state-box";
  box.textContent = message;
  return box;
}

export function LoadingSkeleton() {
  const skeleton = document.createElement("div");
  skeleton.className = "skeleton";
  skeleton.setAttribute("aria-label", "loading");
  return skeleton;
}

export function EmptyState(message = "No data available.") {
  return makeStateBox(message);
}

export function ErrorState(message = "Unable to load data. Please retry later.") {
  return makeStateBox(`⚠️ ${message}`);
}
