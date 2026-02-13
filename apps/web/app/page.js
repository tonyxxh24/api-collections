import Link from 'next/link';
import { fetchApis } from '../components/api-client';

export default async function HomePage() {
  const apis = await fetchApis();

  return (
    <div>
      <h2>API 列表</h2>
      <div className="grid">
        {apis.map((api) => (
          <div className="card" key={api.id}>
            <h3>{api.name}</h3>
            <p>{api.description}</p>
            <Link href={`/api/${api.id}`}>查看詳情與測試</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
