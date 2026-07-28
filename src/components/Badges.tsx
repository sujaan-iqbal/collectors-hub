import type { Condition } from '@/types'

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-paper-dim px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-ink-2">
      {category}
    </span>
  )
}

const conditionStyles: Record<Condition, string> = {
  Mint: 'bg-ink-3/15 text-ink-3 border-ink-3/30',
  'Near Mint': 'bg-brass/15 text-brass border-brass/40',
  Excellent: 'bg-brass-light/25 text-ink-2 border-brass-light/60',
  Good: 'bg-paper-dim text-muted border-line',
  Fair: 'bg-plum/10 text-plum border-plum/30',
}

export function ConditionBadge({ condition }: { condition: Condition }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${conditionStyles[condition]}`}
    >
      {condition}
    </span>
  )
}
