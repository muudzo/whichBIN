import { catalog, checkedLabel } from '@/features/game/catalog'

// Every screen with rules says where they come from (trust before play).
export function SourceLine() {
  return (
    <p className="text-center text-sm text-ink-muted">
      {catalog.city} · rules from Omrin&apos;s 2026 waste guide, checked {checkedLabel()}
    </p>
  )
}
