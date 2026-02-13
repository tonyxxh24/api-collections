export const apiMetadata = {
  weather: {
    id: 'weather',
    baseUrl: 'https://api.open-meteo.com',
    allowedHosts: ['api.open-meteo.com']
  },
  jsonplaceholder: {
    id: 'jsonplaceholder',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    allowedHosts: ['jsonplaceholder.typicode.com']
  }
};

export function getApiMetadata(id) {
  return apiMetadata[id] ?? null;
}
