import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCollections, bucketLabel } from '@/context/CollectionsContext'
import { CollectionItemCard } from '@/components/CollectionItemCard'
import { SearchBar } from '@/components/SearchBar'
import { FilterSelect } from '@/components/FilterSelect'
import { EmptyState } from '@/components/EmptyState'
import { CATEGORY_OPTIONS } from '@/data/constants'
import type { CollectionBucket, SortOption } from '@/types'

const buckets: CollectionBucket[] = ['owned', 'wishlist', 'selling']

const sortOptions = [
  { value: 'newest', label: 'Recently added' },
  { value: 'price-desc', label: 'Value: high to low' },
  { value: 'price-asc', label: 'Value: low to high' },
]

export function MyCollection() {
  const { items } = useCollections()
  const [params, setParams] = useSearchParams()

  const bucket = (params.get('bucket') as CollectionBucket) ?? 'owned'
  const search = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const sort = (params.get('sort') as SortOption) ?? 'newest'

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all' || value === '') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const setBucket = (b: CollectionBucket) => {
    const next = new URLSearchParams(params)
    next.set('bucket', b)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    let result = items.filter((item) => {
      if (item.bucket !== bucket) return false
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase().trim())
      const matchesCategory = category === 'all' || item.category === category
      return matchesSearch && matchesCategory
    })
    result = [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.estimatedValue - b.estimatedValue
      if (sort === 'price-desc') return b.estimatedValue - a.estimatedValue
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    })
    return result
  }, [items, bucket, search, category, sort])

  const totalValue = filtered.reduce((sum, item) => sum + item.estimatedValue, 0)
  const hasActiveFilters = search || category !== 'all'

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-brass">Module 03</p>
        <h1 className="mt-1 font-display text-3xl text-ink-2 sm:text-4xl">My Collection</h1>
        <p className="mt-2 max-w-xl font-body text-sm text-muted">
          Track what you own, what you're chasing, and what's up for sale.
        </p>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-line bg-paper-dim p-1 no-scrollbar">
        {buckets.map((b) => {
          const count = items.filter((i) => i.bucket === b).length
          return (
            <button
              key={b}
              onClick={() => setBucket(b)}
              className={`flex-1 cursor-pointer whitespace-nowrap rounded-md px-4 py-2 font-body text-sm font-medium transition ${
                bucket === b ? 'bg-white text-ink-2 shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              {bucketLabel(b)}
              <span className="ml-1.5 font-mono text-xs text-brass">{count}</span>
            </button>
          )
        })}
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={(v) => updateParam('q', v)}
          placeholder={`Search ${bucketLabel(bucket).toLowerCase()}...`}
        />
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <FilterSelect
            label="Category"
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={(v) => updateParam('category', v)}
          />
          <FilterSelect
            label="Sort"
            value={sort}
            options={sortOptions}
            onChange={(v) => updateParam('sort', v)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={
            hasActiveFilters
              ? 'No items match your search'
              : `Nothing in ${bucketLabel(bucket)} yet`
          }
          description={
            hasActiveFilters
              ? 'Try a different keyword or clear the category filter.'
              : bucket === 'owned'
              ? 'Add pieces from the Marketplace as you acquire them.'
              : bucket === 'wishlist'
              ? "Save items you're hoping to find from the Marketplace."
              : 'List an item here once you decide to part with it.'
          }
          action={hasActiveFilters ? { label: 'Clear filters', onClick: () => setParams({ bucket }, { replace: true }) } : undefined}
        />
      ) : (
        <>
          <p className="mb-4 font-mono text-xs text-muted">
            {filtered.length} item{filtered.length === 1 ? '' : 's'} &middot; estimated total{' '}
            <span className="text-ink">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item) => (
              <CollectionItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
