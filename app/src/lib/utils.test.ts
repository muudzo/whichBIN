import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('keeps a type-scale size next to a text colour', () => {
    expect(cn('text-heading', 'text-pompebled')).toBe('text-heading text-pompebled')
  })

  it('still lets a later size replace an earlier one', () => {
    expect(cn('text-sm', 'text-title')).toBe('text-title')
  })
})
