import Link from 'next/link';
import { fetchApis } from '../components/api-client';

export default async function HomePage() {
  const apis = await fetchApis();

  return (
    <div>
      <h2>API 列表（目前可用）</h2>
      <div className="grid">
        {apis.map((api) => (
          <div className="card" key={api.id}>
            <h3>{api.name}</h3>
            <p>{api.description}</p>
            <p>
              <strong>ID：</strong>{api.id}
            </p>
            {api.country ? (
              <p>
                <strong>國家：</strong>{api.country}
              </p>
            ) : null}
            {api.pricing ? (
              <p>
                <strong>價格：</strong>{api.pricing}
              </p>
            ) : null}
            <Link href={`/api/${api.id}`}>查看詳情{api.testable ? '與測試' : ''}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
