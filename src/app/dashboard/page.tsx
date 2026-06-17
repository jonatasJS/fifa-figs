'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, 
  Eye, 
  MessageCircle, 
  TrendingUp,
  Pause,
  Play,
  Trash2,
  ShoppingBag
} from 'lucide-react'

interface DashboardData {
  stats: {
    totalAds: number
    activeAds: number
    pausedAds: number
    totalViews: number
    totalWhatsappClicks: number
    engagedAds: number
  }
  ads: Array<{
    id: string
    title: string
    status: string
    images: string[]
    metrics: {
      views: number
      whatsappClicks: number
    }
    createdAt: string
  }>
  purchases: Array<{
    id: string
    status: string
    createdAt: string
    expiresAt: string | null
    plan: {
      name: string
      price: number
    }
    adEngagements: Array<{
      ad: {
        id: string
        title: string
        images: string[]
      }
    }>
  }>
}

export default function DashboardPage() {
  const { token, isAuthenticated } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    fetchDashboard()
  }, [isAuthenticated, token])

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar dashboard')
      }

      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdStatus = async (adId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status')
      }

      fetchDashboard()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const deleteAd = async (adId: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return

    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir anúncio')
      }

      fetchDashboard()
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Erro ao carregar dashboard</h2>
          <button onClick={fetchDashboard} className="text-blue-600 hover:underline">
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <Link
              href="/ads/create"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Novo Anúncio
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total de Anúncios"
              value={data.stats.totalAds}
              icon={<Plus className="w-6 h-6" />}
              color="blue"
            />
            <StatCard
              title="Anúncios Ativos"
              value={data.stats.activeAds}
              icon={<Play className="w-6 h-6" />}
              color="green"
            />
            <StatCard
              title="Anúncios Pausados"
              value={data.stats.pausedAds}
              icon={<Pause className="w-6 h-6" />}
              color="yellow"
            />
            <StatCard
              title="Visualizações"
              value={data.stats.totalViews}
              icon={<Eye className="w-6 h-6" />}
              color="purple"
            />
            <StatCard
              title="Contatos WhatsApp"
              value={data.stats.totalWhatsappClicks}
              icon={<MessageCircle className="w-6 h-6" />}
              color="green"
            />
            <StatCard
              title="Anúncios Engajados"
              value={data.stats.engagedAds}
              icon={<TrendingUp className="w-6 h-6" />}
              color="indigo"
            />
          </div>

          {/* Anúncios */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Meus Anúncios</h2>

            {data.ads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Você ainda não tem anúncios</p>
                <Link
                  href="/ads/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-5 h-5" />
                  Criar Primeiro Anúncio
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.ads.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    onToggleStatus={() => toggleAdStatus(ad.id, ad.status)}
                    onDelete={() => deleteAd(ad.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Compras */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Histórico de Compras</h2>

            {data.purchases.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Você ainda não fez compras</p>
                <Link
                  href="/ads"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                  Ver anúncios disponíveis
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.purchases.map((purchase) => (
                  <PurchaseCard key={purchase.id} purchase={purchase} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { 
  title: string, 
  value: number, 
  icon: React.ReactNode,
  color: string 
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className={`${colorClasses[color as keyof typeof colorClasses]} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}

function AdCard({ ad, onToggleStatus, onDelete }: { 
  ad: any, 
  onToggleStatus: () => void,
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        {ad.images.length > 0 ? (
          <img
            src={ad.images[0]}
            alt={ad.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-2xl">🏆</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/ads/${ad.id}`}>
          <h3 className="font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors">
            {ad.title}
          </h3>
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{ad.metrics.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{ad.metrics.whatsappClicks}</span>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            ad.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
            ad.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {ad.status === 'ACTIVE' ? 'Ativo' : ad.status === 'PAUSED' ? 'Pausado' : 'Expirado'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleStatus}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          title={ad.status === 'ACTIVE' ? 'Pausar' : 'Ativar'}
        >
          {ad.status === 'ACTIVE' ? (
            <Pause className="w-5 h-5 text-gray-600" />
          ) : (
            <Play className="w-5 h-5 text-gray-600" />
          )}
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>
    </div>
  )
}

function PurchaseCard({ purchase }: { purchase: any }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
        <ShoppingBag className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{purchase.plan.name}</h3>
        <p className="text-sm text-gray-500">
          {new Date(purchase.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-green-600">R$ {purchase.plan.price.toFixed(2)}</p>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          purchase.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
          purchase.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {purchase.status === 'APPROVED' ? 'Aprovado' : purchase.status === 'PENDING' ? 'Pendente' : 'Rejeitado'}
        </span>
      </div>
    </div>
  )
}