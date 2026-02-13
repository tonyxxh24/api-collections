import { ApiList } from './components/ApiList';
import { RequestBuilder } from './components/RequestBuilder';
import { VisualizationToggle } from './components/VisualizationToggle';
import type { ApiMetadata } from './types';

const apis: ApiMetadata[] = [
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

export default function App() {
  return (
    <main>
      <ApiList apis={apis} />
      <RequestBuilder />
      <VisualizationToggle />
    </main>
  );
}
