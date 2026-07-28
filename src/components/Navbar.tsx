import { NavLink } from 'react-router-dom'
import { useCollections } from '@/context/CollectionsContext'

const links = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/community', label: 'Community' },
  { to: '/collection', label: 'My Collection' },
]

export function Navbar() {
  const { items } = useCollections()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/marketplace" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brass bg-ink-2 font-display text-sm text-brass-light">
            C
          </span>
          <span className="font-display text-lg tracking-tight text-ink-2">
            Collector's Hub
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-4 py-2 font-body text-sm font-medium transition ${
                  isActive
                    ? 'bg-ink-2 text-paper'
                    : 'text-ink hover:bg-paper-dim'
                }`
              }
            >
              {link.label}
              {link.to === '/collection' && items.length > 0 && (
                <span className="ml-1.5 font-mono text-xs text-brass">{items.length}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-paper/95 backdrop-blur-sm sm:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 font-body text-xs font-medium ${
                isActive ? 'text-ink-2' : 'text-muted'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
