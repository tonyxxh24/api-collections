import Link from 'next/link';
import { fetchApi } from '../../../components/api-client';
import { TestPanel } from '../../../components/test-panel';

export default async function ApiDetailPage({ params }) {
  const api = await fetchApi(params.id);

  return (
    <div>
      <Link href="/">← 回 API 列表</Link>
      <h2>{api.name}</h2>
      <p>{api.description}</p>
      {api.docsUrl ? (
        <p>
          文件：
          <a href={api.docsUrl} target="_blank" rel="noreferrer">{api.docsUrl}</a>
        </p>
      ) : null}
      <TestPanel id={params.id} />
    </div>
  );
}
