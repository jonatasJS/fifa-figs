'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Eye, 
  Heart, 
  Share2,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  BadgeCheck
} from 'lucide-react'

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
  updatedAt: string
  user: {
    id: string
    name: string | null
    avatar: string | null
    whatsapp: string | null
  }
  metrics?: {
    views: number
    whatsappClicks: number
    favorites: number
    shares: number
  }
  engagements?: Array<{
    id: string
    startDate: string
    endDate: string
    isActive: boolean
    purchase: {
      plan: {
        name: string
      }
    }
  }>
}

export default function AdDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token, isAuthenticated } = useAuth()
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchAd()
  }, [params.id])

  const fetchAd = async () => {
    try {
      const response = await fetch(`/api/ads/${params.id}`)
      if (!response.ok) {
        throw new Error('Anúncio não encontrado')
      }
      const data = await response.json()
      setAd(data.ad)
    } catch (err) {
      setError('Erro ao carregar anúncio')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = async () => {
    if (!ad) return

    try {
      await fetch(`/api/ads/${ad.id}/whatsapp`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } catch (error) {
      console.error('Erro ao registrar clique:', error)
    }

    window.open(`https://wa.me/${ad.whatsapp.replace(/\D/g, '')}`, '_blank')
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return

    try {
      const response = await fetch(`/api/ads/${ad?.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir anúncio')
      }

      router.push('/ads')
    } catch (err) {
      setError('Erro ao excluir anúncio')
    }
  }

  const isEngaged = ad?.engagements?.some(e => e.isActive)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Anúncio não encontrado'}</h2>
          <Link href="/ads" className="text-blue-600 hover:underline">
            Voltar para anúncios
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/ads" className="text-blue-600 hover:underline">
              ← Voltar para anúncios
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Imagens */}
            <div>
              <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                {ad.images.length > 0 ? (
                  <img
                    src={ad.images[currentImageIndex]}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-8xl">🏆</span>
                  </div>
                )}
              </div>

              {ad.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {ad.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Detalhes */}
            <div>
              {isEngaged && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5" />
                  <span className="font-semibold">Anúncio Engajado</span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  ad.condition === 'NOVA' ? 'bg-green-500 text-white' :
                  ad.condition === 'USADA' ? 'bg-yellow-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {ad.condition}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  ad.status === 'ACTIVE' ? 'bg-green-500 text-white' :
                  ad.status === 'PAUSED' ? 'bg-yellow-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {ad.status === 'ACTIVE' ? 'Ativo' : ad.status === 'PAUSED' ? 'Pausado' : 'Expirado'}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4">{ad.title}</h1>

              {ad.price && (
                <p className="text-4xl font-bold text-green-600 mb-6">
                  R$ {ad.price.toFixed(2)}
                </p>
              )}

              <p className="text-gray-600 text-lg mb-6">{ad.description}</p>

              {ad.location && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <MapPin className="w-5 h-5" />
                  <span>{ad.location}</span>
                </div>
              )}

              {/* Informações do vendedor */}
              <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Vendedor</h3>
                <div className="flex items-center gap-4">
                  {ad.user.avatar ? (
                    <img
                      src={ad.user.avatar}
                      alt={ad.user.name || 'Avatar'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {ad.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {ad.user.name || 'Usuário'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cadastrado em {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Métricas */}
              {ad.metrics && (
                <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Métricas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye className="w-5 h-5" />
                      <span>{ad.metrics.views} visualizações</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="w-5 h-5" />
                      <span>{ad.metrics.whatsappClicks} contatos</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Heart className="w-5 h-5" />
                      <span>{ad.metrics.favorites} favoritos</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Share2 className="w-5 h-5" />
                      <span>{ad.metrics.shares} compartilhamentos</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de ação */}
              <div className="space-y-4">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contatar via WhatsApp
                </button>

                {isAuthenticated && user?.id === ad.user.id && (
                  <div className="flex gap-4">
                    <Link
                      href={`/ads/${ad.id}/edit`}
                      className="flex-1 py-3 border border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-5 h-5" />
                      Editar
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex-1 py-3 border border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Excluir
                    </button>
                  </div>
                )}

                {isAuthenticated && user?.id === ad.user.id && (
                  <Link
                    href={`/ads/${ad.id}/engage`}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Engajar Anúncio
                  </Link>
                )}
              </div>

              {/* Data de publicação */}
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-6">
                <Calendar className="w-4 h-4" />
                <span>
                  Publicado em {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}