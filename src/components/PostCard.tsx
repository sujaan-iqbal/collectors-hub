import { Link } from 'react-router-dom'
import type { CommunityPost } from '@/types'
import { SafeImage } from './SafeImage'
import { CategoryBadge } from './Badges'
import { useSocial } from '@/context/SocialContext'

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days < 1) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  return `${Math.floor(days / 30)} mo ago`
}

export function PostCard({ post }: { post: CommunityPost }) {
  const { likedIds, savedIds, toggleLike, toggleSave } = useSocial()
  const liked = likedIds.has(post.id)
  const saved = savedIds.has(post.id)
  const likeCount = post.likes + (liked ? 1 : 0)

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-line bg-white transition hover:shadow-md">
      <Link to={`/community/${post.id}`} className="flex items-center gap-3 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-2 font-mono text-xs text-brass-light">
          {initials(post.author.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-body text-sm font-medium text-ink">{post.author.name}</p>
          <p className="text-xs text-muted">{timeAgo(post.createdAt)}</p>
        </div>
        <span className="ml-auto shrink-0 font-mono text-[10px] text-muted">{post.accession}</span>
      </Link>

      <Link to={`/community/${post.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <SafeImage src={post.image} alt={post.caption} className="h-full w-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <CategoryBadge category={post.category} />
        </div>
        <p className="line-clamp-2 font-body text-sm text-ink">{post.caption}</p>

        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleLike(post.id)}
              className="flex cursor-pointer items-center gap-1.5 text-sm text-ink transition hover:text-plum"
              aria-pressed={liked}
              aria-label={liked ? 'Unlike post' : 'Like post'}
            >
              <svg
                width="17"
                height="17"
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
              <span className="font-mono text-xs">{likeCount}</span>
            </button>
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 11.5C21 16.2 16.97 20 12 20C10.7 20 9.47 19.75 8.37 19.29L3 20L4.5 15.5C3.55 14.15 3 12.87 3 11.5C3 6.8 7.03 3 12 3C16.97 3 21 6.8 21 11.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-mono text-xs">{post.comments}</span>
            </span>
          </div>
          <button
            onClick={() => toggleSave(post.id)}
            aria-pressed={saved}
            aria-label={saved ? 'Unsave post' : 'Save post'}
            className="cursor-pointer text-brass transition hover:text-brass"
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
          </button>
        </div>
      </div>
    </article>
  )
}
