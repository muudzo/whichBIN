import { describe, expect, it } from 'vitest'
import { measureTargets, targetAt, type DropTarget } from './dropTarget'

const box = (left: number, top: number, width = 100, height = 80) => ({
  left,
  top,
  right: left + width,
  bottom: top + height,
})

// Two bins side by side with a 10px gap, like the bin grid.
const bins: DropTarget<'sortibak' | 'biobak'>[] = [
  { id: 'sortibak', box: box(0, 500) },
  { id: 'biobak', box: box(110, 500) },
]

describe('targetAt', () => {
  it('finds the bin under the finger', () => {
    expect(targetAt({ x: 150, y: 540 }, bins)).toBe('biobak')
  })

  it('counts a drop on the edge of a bin as a drop on that bin', () => {
    expect(targetAt({ x: 100, y: 580 }, bins)).toBe('sortibak')
  })

  it('finds nothing in the gap between bins', () => {
    expect(targetAt({ x: 105, y: 540 }, bins)).toBeUndefined()
  })

  it('finds nothing above the bins, where the item started', () => {
    expect(targetAt({ x: 50, y: 200 }, bins)).toBeUndefined()
  })
})

describe('measureTargets', () => {
  it('reads every element marked with data-bin-id, with its position on screen', () => {
    const grid = document.createElement('div')
    grid.innerHTML = '<button data-bin-id="sortibak"></button><span></span><button data-bin-id="biobak"></button>'
    const [first, , second] = Array.from(grid.children) as HTMLElement[]
    first.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 500, width: 100, height: 80 })
    second.getBoundingClientRect = () => DOMRect.fromRect({ x: 110, y: 500, width: 100, height: 80 })

    expect(measureTargets(grid)).toEqual(bins)
  })
})
