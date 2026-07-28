interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  icon?: React.ReactNode
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper-dim/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-brass/40 bg-white text-brass">
        {icon ?? <DefaultIcon />}
      </div>
      <h3 className="font-display text-xl text-ink-2">{title}</h3>
      <p className="mt-2 max-w-sm font-body text-sm text-muted">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 rounded-md bg-ink-2 px-5 py-2.5 font-body text-sm font-medium text-paper transition hover:bg-ink cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

function DefaultIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 7L5 3H19L21 7M3 7V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V7M3 7H21M9 11C9 12.1 9.9 13 11 13H13C14.1 13 15 12.1 15 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
