/**
 * @typedef {{id: string, name: string, description: string, docsUrl?: string}} ProviderMetadata
 * @typedef {{payload?: Record<string, unknown>}} BuildRequestInput
 * @typedef {{url: string, method: string, headers?: Record<string, string>, body?: string}} BuiltRequest
 * @typedef {{status: number, headers: Record<string, string>, data: unknown}} NormalizedResponse
 *
 * @typedef {Object} ApiProvider
 * @property {() => ProviderMetadata} metadata
 * @property {(input: BuildRequestInput) => BuiltRequest} buildRequest
 * @property {(response: Response, data: unknown) => NormalizedResponse} normalizeResponse
 */

export {};
