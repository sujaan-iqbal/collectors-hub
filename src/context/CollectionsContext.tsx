import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CollectionBucket, CollectionItem, Category } from '@/types'
import { seedCollectionItems } from '@/data/mockData'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { useToast } from './ToastContext'

const STORAGE_KEY = 'collectors-hub:collections'

export interface AddItemInput {
  sourceId: string
  title: string
  category: Category
  image: string
  estimatedValue: number
}

interface CollectionsContextValue {
  items: CollectionItem[]
  addItem: (input: AddItemInput, bucket: CollectionBucket) => boolean
  removeItem: (id: string) => void
  moveItem: (id: string, toBucket: CollectionBucket) => void
  isInBucket: (sourceId: string, bucket: CollectionBucket) => boolean
  countByBucket: (bucket: CollectionBucket) => number
}

const CollectionsContext = createContext<CollectionsContextValue | null>(null)

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast()
  const [items, setItems] = useState<CollectionItem[]>(() =>
    loadFromStorage(STORAGE_KEY, seedCollectionItems())
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEY, items)
  }, [items])

  const isInBucket = (sourceId: string, bucket: CollectionBucket) =>
    items.some((item) => item.sourceId === sourceId && item.bucket === bucket)

  const addItem = (input: AddItemInput, bucket: CollectionBucket): boolean => {
    const duplicate = items.some(
      (item) => item.sourceId === input.sourceId && item.bucket === bucket
    )
    if (duplicate) {
      showToast(`Already in ${bucketLabel(bucket)} — nothing added.`, 'info')
      return false
    }
    const newItem: CollectionItem = {
      id: `${input.sourceId}-${bucket}-${Date.now()}`,
      sourceId: input.sourceId,
      bucket,
      title: input.title,
      category: input.category,
      image: input.image,
      dateAdded: new Date().toISOString(),
      estimatedValue: input.estimatedValue,
    }
    setItems((prev) => [newItem, ...prev])
    showToast(`Added to ${bucketLabel(bucket)}.`, 'success')
    return true
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    showToast('Removed from your collection.', 'info')
  }

  const moveItem = (id: string, toBucket: CollectionBucket) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id)
      if (!target) return prev
      const duplicateInTarget = prev.some(
        (item) => item.id !== id && item.sourceId === target.sourceId && item.bucket === toBucket
      )
      if (duplicateInTarget) {
        showToast(`Already in ${bucketLabel(toBucket)} — move cancelled.`, 'info')
        return prev
      }
      showToast(`Moved to ${bucketLabel(toBucket)}.`, 'success')
      return prev.map((item) => (item.id === id ? { ...item, bucket: toBucket } : item))
    })
  }

  const countByBucket = (bucket: CollectionBucket) =>
    items.filter((item) => item.bucket === bucket).length

  const value = useMemo(
    () => ({ items, addItem, removeItem, moveItem, isInBucket, countByBucket }),
    [items]
  )

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>
}

export function bucketLabel(bucket: CollectionBucket): string {
  switch (bucket) {
    case 'owned':
      return 'Owned'
    case 'wishlist':
      return 'Wishlist'
    case 'selling':
      return 'Selling'
  }
}

export function useCollections() {
  const ctx = useContext(CollectionsContext)
  if (!ctx) throw new Error('useCollections must be used within CollectionsProvider')
  return ctx
}
