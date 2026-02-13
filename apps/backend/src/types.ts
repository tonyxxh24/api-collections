import { z } from 'zod';

export const apiMetadataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  endpoint: z.string().url()
});

export type ApiMetadata = z.infer<typeof apiMetadataSchema>;

export const testRequestSchema = z.object({
  method: z.enum(['GET', 'POST']),
  path: z.string().startsWith('/'),
  body: z.record(z.unknown()).optional()
});

export type TestRequestInput = z.infer<typeof testRequestSchema>;
