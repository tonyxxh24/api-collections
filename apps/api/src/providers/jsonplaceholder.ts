import { ApiProvider } from './types.js';

export const jsonplaceholderProvider: ApiProvider = {
  metadata() {
    return {
      id: 'jsonplaceholder',
      name: 'JSONPlaceholder Posts',
      description: 'Demo provider that fetches post list from JSONPlaceholder.',
      docsUrl: 'https://jsonplaceholder.typicode.com/'
    };
  },
  buildRequest(input) {
    const postId = input.payload?.postId as number | undefined;
    return {
      url: postId
        ? `https://jsonplaceholder.typicode.com/posts/${postId}`
        : 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET'
    };
  },
  normalizeResponse(response, data) {
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data
    };
  }
};
