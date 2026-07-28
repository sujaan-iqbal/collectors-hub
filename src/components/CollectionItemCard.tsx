import type { CollectionBucket, CollectionItem } from '@/types'
import { SafeImage } from './SafeImage'
import { CategoryBadge } from './Badges'
import { bucketLabel, useCollections } from '@/context/CollectionsContext'

const buckets: CollectionBucket[] = ['owned', 'wishlist', 'selling']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function CollectionItemCard({ item }: { item: CollectionItem }) {
  const { moveItem, removeItem } = useCollections()

  return (
    <div className="specimen-corner flex flex-col overflow-hidden rounded-lg border border-line bg-white">
      <div className="relative aspect-square overflow-hidden">
        <SafeImage src={item.image} alt={item.title} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <CategoryBadge category={item.category} />
        <h3 className="line-clamp-2 font-display text-base leading-snug text-ink-2">{item.title}</h3>

        <div className="flex items-center justify-between text-xs text-muted">
          <span>Added {formatDate(item.dateAdded)}</span>
          <span className="font-mono text-sm font-semibold text-ink">
            ${item.estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
        </div>

        <div className="mt-2 flex gap-2">
          <label className="flex-1">
            <span className="sr-only">Move to</span>
            <select
              value={item.bucket}
              onChange={(e) => moveItem(item.id, e.target.value as CollectionBucket)}
              className="w-full cursor-pointer rounded-md border border-line bg-white px-2 py-1.5 font-body text-xs text-ink focus:border-ink-3 focus:outline-none"
            >
              {buckets.map((b) => (
                <option key={b} value={b}>
                  Move to {bucketLabel(b)}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.title}`}
            className="cursor-pointer rounded-md border border-line px-2.5 py-1.5 text-plum transition hover:border-plum"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 7H20M9 7V4H15V7M6 7L7 20H17L18 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
