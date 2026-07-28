import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCommunityPosts } from '@/data/api'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useDebounce } from '@/hooks/useDebounce'
import { PostCard } from '@/components/PostCard'
import { SearchBar } from '@/components/SearchBar'
import { FilterSelect } from '@/components/FilterSelect'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { FeedSkeleton } from '@/components/Skeletons'
import { CATEGORY_OPTIONS } from '@/data/constants'

export function CommunityFeed() {
  const { data: posts, state, error, retry } = useAsyncData(fetchCommunityPosts)
  const [params, setParams] = useSearchParams()

  const search = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const debouncedSearch = useDebounce(search, 300)

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all' || value === '') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    if (!posts) return []
    return posts
      .filter((p) => {
        const matchesSearch = p.caption.toLowerCase().includes(debouncedSearch.toLowerCase().trim())
        const matchesCategory = category === 'all' || p.category === category
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [posts, debouncedSearch, category])

  const hasActiveFilters = search || category !== 'all'

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-brass">Module 02</p>
        <h1 className="mt-1 font-display text-3xl text-ink-2 sm:text-4xl">Community Feed</h1>
        <p className="mt-2 max-w-xl font-body text-sm text-muted">
          See what fellow collectors are finding, restoring, and celebrating this week.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={(v) => updateParam('q', v)} placeholder="Search posts..." />
        <FilterSelect
          label="Category"
          value={category}
          options={CATEGORY_OPTIONS}
          onChange={(v) => updateParam('category', v)}
        />
      </div>

      {state === 'loading' && <FeedSkeleton count={6} />}

      {state === 'error' && <ErrorState message={error ?? undefined} onRetry={retry} />}

      {state === 'success' && filtered.length === 0 && (
        <EmptyState
          title={hasActiveFilters ? 'No posts match your search' : 'No posts yet'}
          description={
            hasActiveFilters
              ? 'Try a different keyword or clear the category filter.'
              : 'Be the first to share something from your collection.'
          }
          action={
            hasActiveFilters
              ? { label: 'Clear filters', onClick: () => setParams({}, { replace: true }) }
              : undefined
          }
        />
      )}

      {state === 'success' && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
