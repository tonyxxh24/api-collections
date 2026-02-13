'use client';

import { useMemo, useState } from 'react';

export function DashboardPanel({ apis }) {
  const [keyword, setKeyword] = useState('');
  const [expandedId, setExpandedId] = useState('');

  const displayedApis = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return apis;

    return apis.filter((api) => {
      return (
        api.name?.toLowerCase().includes(normalized)
        || api.id?.toLowerCase().includes(normalized)
        || api.category?.toLowerCase().includes(normalized)
      );
    });
  }, [apis, keyword]);

  return (
    <>
      <div className="controls-row">
        <div className="control-card inset">
          <label htmlFor="dashboard-search">快速搜尋 API（名稱 / ID / 分類）</label>
          <input
            id="dashboard-search"
            value={keyword}
            placeholder="例如：weather、tdx、census"
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <button type="button" onClick={() => setKeyword('')}>清除搜尋</button>
      </div>

      <span className="stat-pill">篩選後顯示：{displayedApis.length} / {apis.length}</span>

      <div className="grid spacious-grid">
        {displayedApis.map((api) => {
          const expanded = expandedId === api.id;

          return (
            <article className="card interactive-card" key={api.id}>
              <h3>{api.name}</h3>
              <p>ID: {api.id}</p>
              <p>國家: {api.country}</p>
              <button
                type="button"
                className="tiny-btn"
                onClick={() => setExpandedId(expanded ? '' : api.id)}
              >
                {expanded ? '收合詳情' : '展開詳情'}
              </button>

              {expanded ? (
                <div className="card-extra inset">
                  <p>分類: {api.category ?? 'N/A'}</p>
                  <p>機構: {api.organization ?? 'N/A'}</p>
                  <p>價格: {api.pricing ?? 'N/A'}</p>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </>
  );
}
