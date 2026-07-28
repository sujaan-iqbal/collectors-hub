import type { Category, Condition } from '@/types'

export const CATEGORIES: Category[] = [
  'Trading Cards',
  'Vinyl Records',
  'Comics',
  'Coins',
  'Stamps',
  'Watches',
  'Action Figures',
  'Vintage Cameras',
]

export const CONDITIONS: Condition[] = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Fair']

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
]

export const CONDITION_OPTIONS = [
  { value: 'all', label: 'All conditions' },
  ...CONDITIONS.map((c) => ({ value: c, label: c })),
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]
