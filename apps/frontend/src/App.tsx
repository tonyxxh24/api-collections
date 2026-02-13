import { ApiList } from './components/ApiList';
import { RequestBuilder } from './components/RequestBuilder';
import { VisualizationToggle } from './components/VisualizationToggle';
import { apiCollectionSchema } from './types';

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

const apis = apiCollectionSchema.parse(rawApis);

export default function App() {
  return (
    <main>
      <ApiList apis={apis} />
      <RequestBuilder />
      <VisualizationToggle />
    </main>
  );
}
