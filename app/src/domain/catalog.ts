import { z } from 'zod'

// The item catalogue (data/items.json) is made by the check-rule-sources agent skill.
// It's checked here, at the boundary, so the game never shows a rule without a source.

export const BIN_IDS = ['sortibak', 'biobak', 'papierbak', 'glasbak', 'textielbak', 'not-a-bin'] as const
export type BinId = (typeof BIN_IDS)[number]

const MIN_ITEMS = 10

const binIdSchema = z.enum(BIN_IDS)

const binSchema = z.object({
  id: binIdSchema,
  name: z.string().min(1),
  english: z.string().min(1),
})

const itemSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    bin: binIdSchema,
    where: z.string().min(1).optional(),
    why: z.string().min(1),
    pages: z.array(z.number().int().positive()).min(1),
    status: z.enum(['confirmed', 'category']),
  })
  .refine((item) => (item.bin === 'not-a-bin') === (item.where !== undefined), {
    message: '"where" is required for not-a-bin items, and only for them',
    path: ['where'],
  })

const catalogSchema = z
  .object({
    city: z.string().min(1),
    checked: z.iso.date(),
    sources: z.record(z.string(), z.object({ title: z.string().min(1), url: z.url() })),
    bins: z.array(binSchema).length(BIN_IDS.length),
    items: z.array(itemSchema).min(MIN_ITEMS),
  })
  .refine((catalog) => new Set(catalog.items.map((item) => item.id)).size === catalog.items.length, {
    message: 'item ids must be unique',
    path: ['items'],
  })
  .refine((catalog) => BIN_IDS.every((id) => catalog.bins.some((bin) => bin.id === id)), {
    message: 'every bin must be listed once',
    path: ['bins'],
  })

export type Bin = z.infer<typeof binSchema>
export type Item = z.infer<typeof itemSchema>
export type Catalog = z.infer<typeof catalogSchema>

export function parseCatalog(raw: unknown): Catalog {
  const result = catalogSchema.safeParse(raw)
  if (!result.success) {
    throw new Error(`Invalid item catalogue:\n${z.prettifyError(result.error)}`)
  }
  return result.data
}
