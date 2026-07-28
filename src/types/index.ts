export type Category =
  | 'Trading Cards'
  | 'Vinyl Records'
  | 'Comics'
  | 'Coins'
  | 'Stamps'
  | 'Watches'
  | 'Action Figures'
  | 'Vintage Cameras'

export type Condition = 'Mint' | 'Near Mint' | 'Excellent' | 'Good' | 'Fair'

export interface Listing {
  id: string
  accession: string // catalog / accession number, e.g. "No. 0147"
  title: string
  category: Category
  condition: Condition
  price: number
  seller: string
  location: string
  image: string
  createdAt: string // ISO date
  description: string
}

export interface CommunityPost {
  id: string
  accession: string
  author: {
    name: string
    avatarSeed: string
  }
  image: string
  caption: string
  category: Category
  likes: number
  comments: number
  createdAt: string
}

export type CollectionBucket = 'owned' | 'wishlist' | 'selling'

export interface CollectionItem {
  id: string // unique id within collections store
  sourceId: string // originating listing/post id, used for duplicate detection
  bucket: CollectionBucket
  title: string
  category: Category
  image: string
  dateAdded: string
  estimatedValue: number
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc'

export type LoadState = 'idle' | 'loading' | 'success' | 'error'
