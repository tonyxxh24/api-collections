import Link from 'next/link';
import { fetchApis } from '../../components/api-client';
import { DashboardPanel } from '../../components/dashboard-panel';

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
    <section className="panel content-panel">
      <h2>Dashboard</h2>
      <p>Country tag 篩選</p>

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

      <DashboardPanel apis={filteredApis} />
    </section>
  );
}
