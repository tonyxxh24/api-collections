export type ProviderMetadata = {
  id: string;
  name: string;
  description: string;
  docsUrl?: string;
};

export type BuildRequestInput = {
  payload?: Record<string, unknown>;
};

export type BuiltRequest = {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
};

export type NormalizedResponse = {
  status: number;
  headers: Record<string, string>;
  data: unknown;
};

export interface ApiProvider {
  metadata(): ProviderMetadata;
  buildRequest(input: BuildRequestInput): BuiltRequest;
  normalizeResponse(response: Response, data: unknown): NormalizedResponse;
}
