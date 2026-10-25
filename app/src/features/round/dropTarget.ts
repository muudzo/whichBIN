// Drag and drop: where on screen each bin is, and which one is under the finger.
// Kept as plain functions so the "did it land on a bin?" rule is tested without a browser.

export type Point = { x: number; y: number }
export type Box = { left: number; top: number; right: number; bottom: number }
export type DropTarget<Id extends string> = { id: Id; box: Box }

// Edges count as inside, so a drop on a bin's border still lands in that bin.
export function targetAt<Id extends string>(point: Point, targets: readonly DropTarget<Id>[]): Id | undefined {
  return targets.find(
    ({ box }) => point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom,
  )?.id
}

// How far a point is from a box: 0 inside it, otherwise the straight-line distance to its nearest edge.
function distanceTo(point: Point, box: Box): number {
  const dx = Math.max(box.left - point.x, 0, point.x - box.right)
  const dy = Math.max(box.top - point.y, 0, point.y - box.bottom)
  return Math.hypot(dx, dy)
}

// Forgiving targets (Fitts's law): the bin under the point, otherwise the closest bin within `tolerance` px.
// So a drop in the gap between two bins, or just past an edge, still lands instead of bouncing back.
export function nearestTarget<Id extends string>(
  point: Point,
  targets: readonly DropTarget<Id>[],
  tolerance: number,
): Id | undefined {
  const closest = targets
    .map(({ id, box }) => ({ id, distance: distanceTo(point, box) }))
    .filter(({ distance }) => distance <= tolerance)
    .sort((a, b) => a.distance - b.distance)[0]
  return closest?.id
}

// Reads every element marked with data-bin-id and its position on screen, at the moment it's called.
export function measureTargets<Id extends string>(container: HTMLElement): DropTarget<Id>[] {
  return Array.from(container.querySelectorAll<HTMLElement>('[data-bin-id]')).map((element) => {
    const { left, top, right, bottom } = element.getBoundingClientRect()
    return { id: element.dataset.binId as Id, box: { left, top, right, bottom } }
  })
}
