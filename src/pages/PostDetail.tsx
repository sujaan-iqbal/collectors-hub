import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchCommunityPosts } from '@/data/api'
import { useAsyncData } from '@/hooks/useAsyncData'
import { SafeImage } from '@/components/SafeImage'
import { CategoryBadge } from '@/components/Badges'
import { ErrorState } from '@/components/ErrorState'
import { useSocial } from '@/context/SocialContext'

export function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: posts, state, error, retry } = useAsyncData(fetchCommunityPosts)
  const { likedIds, savedIds, toggleLike, toggleSave } = useSocial()

  if (state === 'loading' || state === 'idle') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="aspect-[4/3] animate-pulse rounded-lg bg-paper-dim" />
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <ErrorState message={error ?? undefined} onRetry={retry} />
      </div>
    )
  }

  const post = posts?.find((p) => p.id === id)

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl text-ink-2">Post not found</h1>
        <p className="mt-2 text-sm text-muted">It may have been removed by the author.</p>
        <Link to="/community" className="mt-4 inline-block text-sm font-medium text-ink-3 underline">
          Back to Community
        </Link>
      </div>
    )
  }

  const liked = likedIds.has(post.id)
  const saved = savedIds.has(post.id)
  const likeCount = post.likes + (liked ? 1 : 0)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex cursor-pointer items-center gap-1.5 font-body text-sm text-muted hover:text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-2 font-mono text-xs text-brass-light">
          {post.author.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
        </span>
        <div>
          <p className="font-body text-sm font-medium text-ink">{post.author.name}</p>
          <p className="font-mono text-xs text-muted">{post.accession}</p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-line">
        <SafeImage src={post.image} alt={post.caption} className="aspect-[4/3] w-full object-cover" />
      </div>

      <div className="mt-4">
        <CategoryBadge category={post.category} />
      </div>

      <p className="mt-3 font-body text-base leading-relaxed text-ink">{post.caption}</p>

      <div className="mt-6 flex items-center gap-5 border-t border-line pt-4">
        <button
          onClick={() => toggleLike(post.id)}
          className="flex cursor-pointer items-center gap-2 font-body text-sm text-ink hover:text-plum"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill={liked ? 'currentColor' : 'none'}
            className={liked ? 'text-plum' : ''}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21C12 21 4 15.5 4 9.5C4 6.5 6.3 4.5 9 4.5C10.5 4.5 11.5 5.2 12 6C12.5 5.2 13.5 4.5 15 4.5C17.7 4.5 20 6.5 20 9.5C20 15.5 12 21 12 21Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {likeCount} likes
        </button>
        <span className="flex items-center gap-2 font-body text-sm text-muted">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 11.5C21 16.2 16.97 20 12 20C10.7 20 9.47 19.75 8.37 19.29L3 20L4.5 15.5C3.55 14.15 3 12.87 3 11.5C3 6.8 7.03 3 12 3C16.97 3 21 6.8 21 11.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {post.comments} comments
        </span>
        <button
          onClick={() => toggleSave(post.id)}
          className="ml-auto flex cursor-pointer items-center gap-2 font-body text-sm text-brass"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={saved ? 'currentColor' : 'none'}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 4H18V21L12 17L6 21V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}
