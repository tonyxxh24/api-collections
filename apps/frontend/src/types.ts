import { z } from 'zod';

export const apiMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  endpoint: z.string().url()
});

export type ApiMetadata = z.infer<typeof apiMetadataSchema>;

export const apiCollectionSchema = z.array(apiMetadataSchema);
