export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function fetchApis() {
  const res = await fetch(`${API_BASE_URL}/apis`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch APIs');
  return res.json();
}

export async function fetchApi(id: string) {
  const res = await fetch(`${API_BASE_URL}/apis/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch API detail');
  return res.json();
}
