import { z } from 'zod'

const ConfigSchema = z.object({
  baseUrl: z.string().url(),
  cache: z.coerce.number().default(1),
})

export type IConfigSchema = z.infer<typeof ConfigSchema>

const { data, error } = ConfigSchema.safeParse({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  cache: import.meta.env.VITE_API_CACHE,
})

if (error) throw error.format()

export const clientConfig = data
