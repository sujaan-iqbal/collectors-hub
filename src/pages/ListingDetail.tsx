import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchListings } from '@/data/api'
import { useAsyncData } from '@/hooks/useAsyncData'
import { SafeImage } from '@/components/SafeImage'
import { ConditionBadge, CategoryBadge } from '@/components/Badges'
import { ErrorState } from '@/components/ErrorState'
import { useCollections } from '@/context/CollectionsContext'
import { useSocial } from '@/context/SocialContext'

export function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: listings, state, error, retry } = useAsyncData(fetchListings)
  const { addItem, isInBucket } = useCollections()
  const { wishlistedIds, markWishlisted } = useSocial()

  if (state === 'loading' || state === 'idle') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid animate-pulse grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="aspect-square rounded-lg bg-paper-dim" />
          <div className="space-y-3">
            <div className="h-4 w-1/3 rounded bg-paper-dim" />
            <div className="h-8 w-4/5 rounded bg-paper-dim" />
            <div className="h-4 w-1/2 rounded bg-paper-dim" />
          </div>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ErrorState message={error ?? undefined} onRetry={retry} />
      </div>
    )
  }

  const listing = listings?.find((l) => l.id === id)

  if (!listing) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl text-ink-2">Listing not found</h1>
        <p className="mt-2 text-sm text-muted">It may have sold or been removed.</p>
        <Link to="/marketplace" className="mt-4 inline-block text-sm font-medium text-ink-3 underline">
          Back to Marketplace
        </Link>
      </div>
    )
  }

  const inCollection = isInBucket(listing.id, 'owned')
  const inWishlist = isInBucket(listing.id, 'wishlist') || wishlistedIds.has(listing.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex cursor-pointer items-center gap-1.5 font-body text-sm text-muted hover:text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="specimen-corner overflow-hidden rounded-lg border border-line">
          <SafeImage src={listing.image} alt={listing.title} className="aspect-square w-full object-cover" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted">{listing.accession}</span>
            <CategoryBadge category={listing.category} />
            <ConditionBadge condition={listing.condition} />
          </div>

          <h1 className="mt-3 font-display text-3xl leading-tight text-ink-2">{listing.title}</h1>

          <p className="mt-3 font-mono text-2xl font-semibold text-ink">
            ${listing.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </p>

          <div className="mt-4 flex items-center gap-4 border-y border-line py-3 text-sm text-muted">
            <span>Sold by <span className="text-ink">{listing.seller}</span></span>
            <span>&middot;</span>
            <span>{listing.location}</span>
          </div>

          <p className="mt-4 font-body text-sm leading-relaxed text-ink">{listing.description}</p>

          <div className="mt-auto flex gap-3 pt-6">
            <button
              onClick={() =>
                addItem(
                  {
                    sourceId: listing.id,
                    title: listing.title,
                    category: listing.category,
                    image: listing.image,
                    estimatedValue: listing.price,
                  },
                  'owned'
                )
              }
              disabled={inCollection}
              className="flex-1 cursor-pointer rounded-md bg-ink-2 px-5 py-3 font-body text-sm font-medium text-paper transition hover:bg-ink disabled:cursor-default disabled:bg-line disabled:text-muted"
            >
              {inCollection ? 'In your collection' : 'Add to Collection'}
            </button>
            <button
              onClick={() => {
                addItem(
                  {
                    sourceId: listing.id,
                    title: listing.title,
                    category: listing.category,
                    image: listing.image,
                    estimatedValue: listing.price,
                  },
                  'wishlist'
                )
                markWishlisted(listing.id)
              }}
              disabled={inWishlist}
              className="cursor-pointer rounded-md border border-brass px-5 py-3 font-body text-sm font-medium text-brass transition hover:bg-brass/10 disabled:cursor-default disabled:border-line disabled:text-muted"
            >
              {inWishlist ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
