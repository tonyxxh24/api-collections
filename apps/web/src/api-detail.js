function parseJsonOrEmpty(text, fallback = {}) {
  const trimmed = text.trim();
  if (!trimmed) {
    return fallback;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error('JSON 格式錯誤，請檢查輸入欄位。');
  }
}

function parseBodyInput(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return text;
  }
}

function prettyJsonIfPossible(input, enabled = true) {
  if (!enabled) {
    return typeof input === 'string' ? input : JSON.stringify(input);
  }

  if (typeof input !== 'string') {
    return JSON.stringify(input, null, 2);
  }

  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch {
    return input;
  }
}

async function submitTest() {
  const prettyEnabled = document.querySelector('#prettyToggle').checked;
  const apiId = document.querySelector('#apiId').value;
  const method = document.querySelector('#method').value;
  const path = document.querySelector('#path').value;
  const query = parseJsonOrEmpty(document.querySelector('#query').value, {});
  const headers = parseJsonOrEmpty(document.querySelector('#headers').value, {});
  const body = parseBodyInput(document.querySelector('#body').value);

  const response = await fetch(`http://localhost:3001/apis/${apiId}/test`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ method, path, query, headers, body })
  });

  const payload = await response.json();

  const summaryEl = document.querySelector('#summary');
  const rateHintEl = document.querySelector('#rateHint');
  const requestOutEl = document.querySelector('#requestOut');
  const responseOutEl = document.querySelector('#responseOut');

  if (!response.ok) {
    summaryEl.textContent = `失敗：${payload.code || response.status}`;
    rateHintEl.textContent = payload.hint || payload.error || '';
    requestOutEl.textContent = prettyJsonIfPossible({ method, path, query, headers, body }, prettyEnabled);
    responseOutEl.textContent = prettyJsonIfPossible(payload, prettyEnabled);
    return;
  }

  const { request, response: proxyResponse, rateLimit } = payload;
  summaryEl.textContent = `Status ${proxyResponse.status} · ${proxyResponse.durationMs}ms · ${proxyResponse.bodySummary.bytes} bytes · retry ${proxyResponse.retryCount}`;

  if (proxyResponse.bodySummary.truncated) {
    rateHintEl.textContent = '⚠️ response 超過大小限制，已截斷。';
  } else if (rateLimit.remaining <= 3) {
    rateHintEl.textContent = `⚠️ 接近 rate-limit，剩餘 ${rateLimit.remaining}/${rateLimit.limit}`;
  } else {
    rateHintEl.textContent = '';
  }

  requestOutEl.textContent = prettyJsonIfPossible(request, prettyEnabled);
  responseOutEl.textContent = prettyJsonIfPossible(
    {
      status: proxyResponse.status,
      statusText: proxyResponse.statusText,
      durationMs: proxyResponse.durationMs,
      headers: proxyResponse.headers,
      bodySummary: proxyResponse.bodySummary,
      body: prettyJsonIfPossible(proxyResponse.body, prettyEnabled)
    },
    prettyEnabled
  );
}

document.querySelector('#sendBtn').addEventListener('click', () => {
  submitTest().catch((error) => {
    document.querySelector('#summary').textContent = '發生錯誤';
    document.querySelector('#responseOut').textContent = error.message;
  });
});
