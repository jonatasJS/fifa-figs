'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Search, Filter, Plus, MapPin, Phone, MessageCircle, Eye } from 'lucide-react'

interface Ad {
  id: string
  title: string
  description: string
  price: number | null
  location: string | null
  condition: string
  images: string[]
  whatsapp: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string | null
    avatar: string | null
  }
  metrics?: {
    views: number
    whatsappClicks: number
  }
}

export default function AdsPage() {
  const { isAuthenticated, token } = useAuth()
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [condition, setCondition] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchAds()
  }, [page, condition, search])

  const fetchAds = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      })

      if (condition) params.append('condition', condition)
      if (search) params.append('search', search)

      const response = await fetch(`/api/ads?${params}`)
      const data = await response.json()
      setAds(data.ads || [])
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = async (adId: string, whatsapp: string) => {
    try {
      await fetch(`/api/ads/${adId}/whatsapp`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } catch (error) {
      console.error('Erro ao registrar clique:', error)
    }

    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando anúncios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar figurinhas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas condições</option>
                <option value="NOVA">Nova</option>
                <option value="USADA">Usada</option>
                <option value="TROCA">Troca</option>
              </select>

              {isAuthenticated && (
                <Link
                  href="/ads/create"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Criar Anúncio
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {ads.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Nenhum anúncio encontrado
            </h2>
            <p className="text-gray-600 mb-8">
              Seja o primeiro a criar um anúncio!
            </p>
            {isAuthenticated && (
              <Link
                href="/ads/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                Criar Primeiro Anúncio
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} onWhatsAppClick={handleWhatsAppClick} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {ads.length > 0 && (
          <div className="flex justify-center mt-12 gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
              {page}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Próxima
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

function AdCard({ ad, onWhatsAppClick }: { ad: Ad, onWhatsAppClick: (adId: string, whatsapp: string) => void }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/ads/${ad.id}`}>
        <div className="aspect-square relative">
          {ad.images.length > 0 ? (
            <img
              src={ad.images[0]}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
          )}
          <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
            ad.condition === 'NOVA' ? 'bg-green-500 text-white' :
            ad.condition === 'USADA' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {ad.condition}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/ads/${ad.id}`}>
          <h3 className="font-semibold text-lg text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {ad.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {ad.description}
        </p>

        {ad.price && (
          <p className="text-2xl font-bold text-green-600 mb-2">
            R$ {ad.price.toFixed(2)}
          </p>
        )}

        {ad.location && (
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{ad.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{ad.metrics?.views || 0}</span>
          </div>
          <span className="text-xs">
            {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>

        <button
          onClick={() => onWhatsAppClick(ad.id, ad.whatsapp)}
          className="w-full flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Contatar
        </button>
      </div>
    </div>
  )
}