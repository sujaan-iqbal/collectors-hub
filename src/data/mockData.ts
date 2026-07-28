import type { Category, Condition, Listing, CommunityPost, CollectionItem } from '@/types'

const categories: Category[] = [
  'Trading Cards',
  'Vinyl Records',
  'Comics',
  'Coins',
  'Stamps',
  'Watches',
  'Action Figures',
  'Vintage Cameras',
]

const conditions: Condition[] = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Fair']

const titlesByCategory: Record<Category, string[]> = {
  'Trading Cards': [
    '1998 Holo Charizard, 1st Edition',
    "Rookie Season Ken Griffey Jr. PSA 9",
    'Vintage Pokémon Base Set Booster Pack',
    'Michael Jordan Fleer Rookie Reprint',
    'Magic: The Gathering Black Lotus (Reserve List)',
  ],
  'Vinyl Records': [
    'Abbey Road, Original UK Apple Pressing',
    'Kind of Blue, Columbia Six-Eye Mono',
    'Rumours, 1977 First Press',
    'Thriller, Picture Disc Edition',
    'Blue Train, Blue Note 1577 Reissue',
  ],
  Comics: [
    'Amazing Fantasy #15, 1962',
    'Detective Comics #27 Facsimile',
    "X-Men #1, 1963 Silver Age",
    'Watchmen #1, DC Direct Sales',
    'Saga #1, First Print',
  ],
  Coins: [
    '1909-S VDB Lincoln Cent',
    'Morgan Silver Dollar, 1881-CC',
    'American Gold Eagle, 1oz 2020',
    'Ancient Roman Denarius, Trajan',
    'Peace Dollar, 1922 High Relief',
  ],
  Stamps: [
    'Inverted Jenny Reproduction Sheet',
    'Penny Black, 1840 Plate 1',
    'UN Headquarters Commemorative Block',
    'British Guiana Centenary Reprint',
    'First Day Cover, Apollo 11',
  ],
  Watches: [
    'Seiko 5 Automatic, 1970s Field Watch',
    'Omega Speedmaster Professional',
    'Vintage Timex Marlin Hand-Wind',
    'Citizen Bullhead Chronograph',
    'Rolex Oysterdate Precision, 1965',
  ],
  'Action Figures': [
    'Kenner Star Wars Boba Fett, Loose',
    'G.I. Joe Cobra Commander, 1983',
    'Transformers Optimus Prime, MISB',
    'Masters of the Universe He-Man',
    'Teenage Mutant Ninja Turtles Leonardo',
  ],
  'Vintage Cameras': [
    'Leica M3, Double Stroke',
    'Rolleiflex 2.8F Twin Lens',
    'Polaroid SX-70 Land Camera',
    'Canon AE-1 Program with 50mm',
    'Yashica Mat-124G Medium Format',
  ],
}

const sellers = [
  'Marigold & Co.',
  'Pinewood Archive',
  'Harlan Estate Sales',
  'The Curio Cabinet',
  'Northbrook Traders',
  'Attic & Anchor',
  'Ferrow Collectibles',
  'Salt City Vintage',
]

const locations = [
  'Portland, OR',
  'Austin, TX',
  'Brooklyn, NY',
  'Bengaluru, IN',
  'Manchester, UK',
  'Toronto, CA',
  'Berlin, DE',
  'Melbourne, AU',
]

const authors = [
  { name: 'Priya Anand', avatarSeed: 'priya' },
  { name: 'Marcus Webb', avatarSeed: 'marcus' },
  { name: 'Elena Cho', avatarSeed: 'elena' },
  { name: 'Tomás Reyes', avatarSeed: 'tomas' },
  { name: 'Aisha Bello', avatarSeed: 'aisha' },
  { name: 'Sven Larsen', avatarSeed: 'sven' },
]

const captions = [
  "Finally completed the set after three years of hunting estate sales.",
  'Found this tucked in a box at a flea market for $4. Still can\'t believe it.',
  'Restoration complete — new belt, cleaned contacts, runs like new.',
  'This one\'s staying in the family. Fourth generation now.',
  'Picked this up on a whim and now I might be starting a new collection.',
  'Comparing the reprint to the original — spot the differences.',
]

function seededRandom(seed: number) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]
}

function pad(n: number, len = 4) {
  return n.toString().padStart(len, '0')
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export function generateListings(count = 48): Listing[] {
  const rand = seededRandom(42)
  const listings: Listing[] = []
  for (let i = 0; i < count; i++) {
    const category = pick(categories, rand)
    const title = pick(titlesByCategory[category], rand)
    // Every 13th item intentionally has a broken image to exercise the fallback state.
    const broken = i % 13 === 0
    listings.push({
      id: `listing-${i + 1}`,
      accession: `No. ${pad(1000 + i)}`,
      title,
      category,
      condition: pick(conditions, rand),
      price: Math.round((20 + rand() * 2400) * 100) / 100,
      seller: pick(sellers, rand),
      location: pick(locations, rand),
      image: broken
        ? 'https://broken-image-source.invalid/photo.jpg'
        : `https://picsum.photos/seed/listing-${i + 1}/600/600`,
      createdAt: daysAgo(Math.floor(rand() * 90)),
      description:
        'A well-documented piece with provenance notes available on request. Photographed in natural light to show true condition; message the seller for additional angles or certification details.',
    })
  }
  return listings
}

export function generateCommunityPosts(count = 30): CommunityPost[] {
  const rand = seededRandom(7)
  const posts: CommunityPost[] = []
  for (let i = 0; i < count; i++) {
    const category = pick(categories, rand)
    const broken = i % 11 === 0
    posts.push({
      id: `post-${i + 1}`,
      accession: `No. ${pad(2000 + i)}`,
      author: pick(authors, rand),
      image: broken
        ? 'https://broken-image-source.invalid/post.jpg'
        : `https://picsum.photos/seed/post-${i + 1}/600/500`,
      caption: pick(captions, rand),
      category,
      likes: Math.floor(rand() * 480),
      comments: Math.floor(rand() * 60),
      createdAt: daysAgo(Math.floor(rand() * 30)),
    })
  }
  return posts
}

export function seedCollectionItems(): CollectionItem[] {
  const listings = generateListings(12)
  const buckets: CollectionItem['bucket'][] = ['owned', 'wishlist', 'selling']
  return listings.slice(0, 6).map((listing, i) => ({
    id: `seed-${listing.id}`,
    sourceId: listing.id,
    bucket: buckets[i % buckets.length],
    title: listing.title,
    category: listing.category,
    image: listing.image,
    dateAdded: daysAgo(i * 4),
    estimatedValue: listing.price,
  }))
}
