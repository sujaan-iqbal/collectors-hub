import { generateListings, generateCommunityPosts } from './mockData'
import type { Listing, CommunityPost } from '@/types'

const LATENCY = 550

// Simulates a network call: resolves with data after a delay, and has a small
// chance of rejecting so the UI's error + retry path is exercised realistically.
function simulateRequest<T>(data: T, failRate = 0.08): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error('Network request failed'))
      } else {
        resolve(data)
      }
    }, LATENCY)
  })
}

let listingsCache: Listing[] | null = null
let postsCache: CommunityPost[] | null = null

export async function fetchListings(): Promise<Listing[]> {
  if (!listingsCache) listingsCache = generateListings(48)
  return simulateRequest(listingsCache)
}

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  if (!postsCache) postsCache = generateCommunityPosts(30)
  return simulateRequest(postsCache)
}
