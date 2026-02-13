import { useMemo, useState } from 'react';
import type { ApiMetadata } from '../types';

type Props = {
  apis: ApiMetadata[];
};

export function ApiList({ apis }: Props) {
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(
    () => apis.filter((api) => api.name.toLowerCase().includes(keyword.toLowerCase())),
    [apis, keyword]
  );

  return (
    <section>
      <label htmlFor="filter">Filter APIs</label>
      <input
        id="filter"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <ul>
        {filtered.map((api) => (
          <li key={api.id}>{api.name}</li>
        ))}
      </ul>
    </section>
  );
}
