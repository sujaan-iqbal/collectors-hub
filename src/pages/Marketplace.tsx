import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchListings } from '@/data/api'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useDebounce } from '@/hooks/useDebounce'
import { ProductCard } from '@/components/ProductCard'
import { SearchBar } from '@/components/SearchBar'
import { FilterSelect } from '@/components/FilterSelect'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { GridSkeleton } from '@/components/Skeletons'
import { CATEGORY_OPTIONS, CONDITION_OPTIONS, SORT_OPTIONS } from '@/data/constants'
import type { SortOption } from '@/types'

export function Marketplace() {
  const { data: listings, state, error, retry } = useAsyncData(fetchListings)
  const [params, setParams] = useSearchParams()

  const search = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const condition = params.get('condition') ?? 'all'
  const sort = (params.get('sort') as SortOption) ?? 'newest'

  const debouncedSearch = useDebounce(search, 300)

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all' || value === '') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    if (!listings) return []
    let result = listings.filter((l) => {
      const matchesSearch = l.title.toLowerCase().includes(debouncedSearch.toLowerCase().trim())
      const matchesCategory = category === 'all' || l.category === category
      const matchesCondition = condition === 'all' || l.condition === condition
      return matchesSearch && matchesCategory && matchesCondition
    })
    result = [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return result
  }, [listings, debouncedSearch, category, condition, sort])

  const hasActiveFilters = search || category !== 'all' || condition !== 'all'

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-brass">Module 01</p>
        <h1 className="mt-1 font-display text-3xl text-ink-2 sm:text-4xl">Marketplace</h1>
        <p className="mt-2 max-w-xl font-body text-sm text-muted">
          Browse listings from independent sellers and dealers. Add pieces to your collection or
          wishlist as you go.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={(v) => updateParam('q', v)}
          placeholder="Search by title..."
        />
        <div className="grid grid-cols-3 gap-2 sm:flex">
          <FilterSelect
            label="Category"
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={(v) => updateParam('category', v)}
          />
          <FilterSelect
            label="Condition"
            value={condition}
            options={CONDITION_OPTIONS}
            onChange={(v) => updateParam('condition', v)}
          />
          <FilterSelect
            label="Sort"
            value={sort}
            options={SORT_OPTIONS}
            onChange={(v) => updateParam('sort', v)}
          />
        </div>
      </div>

      {state === 'loading' && <GridSkeleton count={8} />}

      {state === 'error' && <ErrorState message={error ?? undefined} onRetry={retry} />}

      {state === 'success' && filtered.length === 0 && (
        <EmptyState
          title={hasActiveFilters ? 'No listings match your search' : 'No listings yet'}
          description={
            hasActiveFilters
              ? 'Try a different keyword or clear a filter to see more results.'
              : 'Check back soon — new pieces are added regularly.'
          }
          action={
            hasActiveFilters
              ? { label: 'Clear filters', onClick: () => setParams({}, { replace: true }) }
              : undefined
          }
        />
      )}

      {state === 'success' && filtered.length > 0 && (
        <>
          <p className="mb-4 font-mono text-xs text-muted">
            {filtered.length} listing{filtered.length === 1 ? '' : 's'}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
