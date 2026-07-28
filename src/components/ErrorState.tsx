interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-lg border border-plum/30 bg-plum/5 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-plum/40 bg-white text-plum">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 003.54 21H20.46A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="font-display text-xl text-ink-2">Couldn't load this catalog</h3>
      <p className="mt-2 max-w-sm font-body text-sm text-muted">
        {message ?? 'The request didn\u2019t make it through. Check your connection and try again.'}
      </p>
      <button
        onClick={onRetry}
        className="mt-5 rounded-md bg-plum px-5 py-2.5 font-body text-sm font-medium text-paper transition hover:opacity-90 cursor-pointer"
      >
        Try again
      </button>
    </div>
  )
}
