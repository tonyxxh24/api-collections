import { fetchApis } from '../../components/api-client';

export default async function DashboardPage() {
  const apis = await fetchApis();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>目前已註冊 API Provider 數量：{apis.length}</p>
      <div className="grid">
        {apis.map((api: { id: string; name: string }) => (
          <div className="card" key={api.id}>
            <h3>{api.name}</h3>
            <p>ID: {api.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
