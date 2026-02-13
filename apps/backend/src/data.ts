import type { ApiMetadata } from './types.js';

export const apis: ApiMetadata[] = [
  {
    id: 'weather',
    name: 'Weather API',
    category: 'utility',
    endpoint: 'https://example.com/weather'
  },
  {
    id: 'news',
    name: 'News API',
    category: 'content',
    endpoint: 'https://example.com/news'
  }
];
