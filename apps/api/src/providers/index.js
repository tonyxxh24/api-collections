import { jsonplaceholderProvider } from './jsonplaceholder.js';

/** @type {Record<string, import('./types.js').ApiProvider>} */
export const providers = {
  [jsonplaceholderProvider.metadata().id]: jsonplaceholderProvider
};
