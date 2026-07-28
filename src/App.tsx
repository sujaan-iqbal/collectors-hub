import { Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Marketplace } from '@/pages/Marketplace'
import { ListingDetail } from '@/pages/ListingDetail'
import { CommunityFeed } from '@/pages/CommunityFeed'
import { PostDetail } from '@/pages/PostDetail'
import { MyCollection } from '@/pages/MyCollection'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-paper pb-16 sm:pb-0">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/marketplace" replace />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<ListingDetail />} />
          <Route path="/community" element={<CommunityFeed />} />
          <Route path="/community/:id" element={<PostDetail />} />
          <Route path="/collection" element={<MyCollection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
