import { jsonplaceholderProvider } from './jsonplaceholder.js';
import { ApiProvider } from './types.js';

export const providers: Record<string, ApiProvider> = {
  [jsonplaceholderProvider.metadata().id]: jsonplaceholderProvider
};
