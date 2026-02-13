import Link from 'next/link';
import { fetchApi } from '../../../components/api-client';
import { TestPanel } from '../../../components/test-panel';

function Field({ label, value }) {
  if (!value) return null;
  return (
    <p>
      <strong>{label}：</strong>{value}
    </p>
  );
}

export default async function ApiDetailPage({ params }) {
  const api = await fetchApi(params.id);

  return (
    <div>
      <Link href="/">← 回 API 列表</Link>
      <h2>{api.name}</h2>
      <p>{api.description}</p>

      <Field label="ID" value={api.id} />
      <Field label="國家" value={api.country} />
      <Field label="機構" value={api.organization} />
      <Field label="分類" value={api.category} />
      <Field label="價格" value={api.pricing} />
      <Field label="認證" value={api.authType} />
      <Field label="狀態" value={api.status} />

      {api.docsUrl ? (
        <p>
          文件：
          <a href={api.docsUrl} target="_blank" rel="noreferrer">{api.docsUrl}</a>
        </p>
      ) : null}

      {api.testable ? (
        <TestPanel id={params.id} />
      ) : (
        <div className="card">
          <h3>測試面板</h3>
          <p>此 API 目前已在列表中展示，但尚未接上 proxy 測試功能。</p>
        </div>
      )}
    </div>
  );
}
