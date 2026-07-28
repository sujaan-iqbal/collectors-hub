import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const LIKES_KEY = 'collectors-hub:liked-posts'
const SAVES_KEY = 'collectors-hub:saved-posts'
const WISHLIST_KEY = 'collectors-hub:wishlisted-listings'

interface SocialContextValue {
  likedIds: Set<string>
  savedIds: Set<string>
  wishlistedIds: Set<string>
  toggleLike: (id: string) => void
  toggleSave: (id: string) => void
  markWishlisted: (id: string) => void
}

const SocialContext = createContext<SocialContextValue | null>(null)

export function SocialProvider({ children }: { children: ReactNode }) {
  const [likedIds, setLikedIds] = useState<Set<string>>(
    () => new Set(loadFromStorage<string[]>(LIKES_KEY, []))
  )
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(loadFromStorage<string[]>(SAVES_KEY, []))
  )
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(
    () => new Set(loadFromStorage<string[]>(WISHLIST_KEY, []))
  )

  useEffect(() => saveToStorage(LIKES_KEY, Array.from(likedIds)), [likedIds])
  useEffect(() => saveToStorage(SAVES_KEY, Array.from(savedIds)), [savedIds])
  useEffect(() => saveToStorage(WISHLIST_KEY, Array.from(wishlistedIds)), [wishlistedIds])

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const markWishlisted = (id: string) => {
    setWishlistedIds((prev) => new Set(prev).add(id))
  }

  const value = useMemo(
    () => ({ likedIds, savedIds, wishlistedIds, toggleLike, toggleSave, markWishlisted }),
    [likedIds, savedIds, wishlistedIds]
  )

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>
}

export function useSocial() {
  const ctx = useContext(SocialContext)
  if (!ctx) throw new Error('useSocial must be used within SocialProvider')
  return ctx
}
