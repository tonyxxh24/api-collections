/** @type {import('./types.js').ApiProvider} */
export const jsonplaceholderProvider = {
  metadata() {
    return {
      id: 'jsonplaceholder',
      name: 'JSONPlaceholder Posts',
      description: 'Demo provider that fetches post list from JSONPlaceholder.',
      docsUrl: 'https://jsonplaceholder.typicode.com/'
    };
  },
  buildRequest(input) {
    const postId = Number(input?.payload?.postId);
    return {
      url: Number.isFinite(postId) && postId > 0
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
