import { describe, expect, it } from 'vitest'
import { measureTargets, nearestTarget, targetAt, type DropTarget } from './dropTarget'

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

// Forgiving targets: a drop just outside a bin, or in the gap between two, still counts.
describe('nearestTarget', () => {
  const TOLERANCE = 24

  it('takes the bin under the point, like targetAt', () => {
    expect(nearestTarget({ x: 150, y: 540 }, bins, TOLERANCE)).toBe('biobak')
  })

  it('gives a drop in the gap to the nearer bin', () => {
    expect(nearestTarget({ x: 103, y: 540 }, bins, TOLERANCE)).toBe('sortibak')
    expect(nearestTarget({ x: 108, y: 540 }, bins, TOLERANCE)).toBe('biobak')
  })

  it('counts a drop just outside the outer edge of a bin', () => {
    expect(nearestTarget({ x: 225, y: 490 }, bins, TOLERANCE)).toBe('biobak')
  })

  it('finds nothing farther away than the tolerance', () => {
    expect(nearestTarget({ x: 50, y: 470 }, bins, TOLERANCE)).toBeUndefined()
    expect(nearestTarget({ x: 50, y: 200 }, bins, TOLERANCE)).toBeUndefined()
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
