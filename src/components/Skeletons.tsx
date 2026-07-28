export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="aspect-square animate-pulse bg-paper-dim" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-paper-dim" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-paper-dim" />
        <div className="h-3 w-2/5 animate-pulse rounded bg-paper-dim" />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function FeedSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="flex items-center gap-3 p-4">
            <div className="h-8 w-8 animate-pulse rounded-full bg-paper-dim" />
            <div className="h-3 w-24 animate-pulse rounded bg-paper-dim" />
          </div>
          <div className="aspect-[4/3] animate-pulse bg-paper-dim" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-full animate-pulse rounded bg-paper-dim" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-paper-dim" />
          </div>
        </div>
      ))}
    </div>
  )
}
