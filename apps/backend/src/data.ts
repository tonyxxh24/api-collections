import { apiMetadataSchema } from './types.js';

const rawApis = [
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

export const apis = apiMetadataSchema.array().parse(rawApis);
