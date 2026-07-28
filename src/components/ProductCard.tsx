import { Link } from 'react-router-dom'
import type { Listing } from '@/types'
import { SafeImage } from './SafeImage'
import { ConditionBadge } from './Badges'
import { useCollections } from '@/context/CollectionsContext'
import { useSocial } from '@/context/SocialContext'

export function ProductCard({ listing }: { listing: Listing }) {
  const { addItem, isInBucket } = useCollections()
  const { wishlistedIds, markWishlisted } = useSocial()

  const inCollection = isInBucket(listing.id, 'owned')
  const inWishlist = isInBucket(listing.id, 'wishlist') || wishlistedIds.has(listing.id)

  const handleAdd = (bucket: 'owned' | 'wishlist') => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(
      {
        sourceId: listing.id,
        title: listing.title,
        category: listing.category,
        image: listing.image,
        estimatedValue: listing.price,
      },
      bucket
    )
    if (bucket === 'wishlist') markWishlisted(listing.id)
  }

  return (
    <Link
      to={`/marketplace/${listing.id}`}
      className="specimen-corner group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        <SafeImage
          src={listing.image}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded bg-ink-2/90 px-2 py-0.5 font-mono text-[11px] text-brass-light">
          {listing.accession}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
            {listing.category}
          </span>
          <ConditionBadge condition={listing.condition} />
        </div>

        <h3 className="line-clamp-2 font-display text-base leading-snug text-ink-2">
          {listing.title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="font-mono text-base font-semibold text-ink">
            ${listing.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
          <span className="truncate text-xs text-muted">{listing.seller}</span>
        </div>

        <div className="mt-2 flex gap-2">
          <button
            onClick={handleAdd('owned')}
            disabled={inCollection}
            className="flex-1 cursor-pointer rounded-md border border-ink-2 px-2 py-1.5 font-body text-xs font-medium text-ink-2 transition hover:bg-ink-2 hover:text-paper disabled:cursor-default disabled:border-line disabled:text-muted disabled:hover:bg-transparent"
          >
            {inCollection ? 'In collection' : 'Add to collection'}
          </button>
          <button
            onClick={handleAdd('wishlist')}
            disabled={inWishlist}
            aria-label={inWishlist ? 'Already in wishlist' : 'Add to wishlist'}
            className="cursor-pointer rounded-md border border-line px-2.5 py-1.5 text-brass transition hover:border-brass disabled:cursor-default disabled:text-brass-light"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={inWishlist ? 'currentColor' : 'none'}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21C12 21 4 15.5 4 9.5C4 6.5 6.3 4.5 9 4.5C10.5 4.5 11.5 5.2 12 6C12.5 5.2 13.5 4.5 15 4.5C17.7 4.5 20 6.5 20 9.5C20 15.5 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}
