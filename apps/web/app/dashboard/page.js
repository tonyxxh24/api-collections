import Link from 'next/link';
import { fetchApis } from '../../components/api-client';

const COUNTRY_TAGS = [
  { key: 'all', label: 'all' },
  { key: 'taiwan', label: 'taiwan' },
  { key: 'US', label: 'US' }
];

function byCountry(api, country) {
  if (country === 'all') return true;
  if (country === 'taiwan') return api.country?.toLowerCase() === 'taiwan';
  if (country === 'US') return api.country?.toLowerCase().includes('united states');
  return true;
}

export default async function DashboardPage({ searchParams }) {
  const apis = await fetchApis();
  const currentCountry = COUNTRY_TAGS.some((tag) => tag.key === searchParams?.country)
    ? searchParams.country
    : 'all';
  const filteredApis = apis.filter((api) => byCountry(api, currentCountry));

  return (
    <div>
      <h2>Dashboard</h2>
      <p>目前已註冊 API Provider 數量：{filteredApis.length}</p>

      <div className="tag-row">
        {COUNTRY_TAGS.map((tag) => (
          <Link
            key={tag.key}
            href={tag.key === 'all' ? '/dashboard' : `/dashboard?country=${encodeURIComponent(tag.key)}`}
            className={`tag ${currentCountry === tag.key ? 'active' : ''}`}
          >
            {tag.label}
          </Link>
        ))}
      </div>

      <div className="grid">
        {filteredApis.map((api) => (
          <div className="card" key={api.id}>
            <h3>{api.name}</h3>
            <p>ID: {api.id}</p>
            <p>國家: {api.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
