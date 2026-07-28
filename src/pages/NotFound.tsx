import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-brass">404</p>
      <h1 className="mt-2 font-display text-3xl text-ink-2">This page isn't in the catalog</h1>
      <p className="mt-2 font-body text-sm text-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/marketplace"
        className="mt-6 rounded-md bg-ink-2 px-5 py-2.5 font-body text-sm font-medium text-paper transition hover:bg-ink"
      >
        Back to Marketplace
      </Link>
    </div>
  )
}
