'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { 
  Check, 
  Calendar, 
  CreditCard,
  Loader2,
  ArrowRight,
  TrendingUp,
  Zap,
  Flame,
  Rocket,
  Crown,
  Gem,
  Info,
  Minus,
  Plus
} from 'lucide-react'

interface Ad {
  id: string
  title: string
  images: string[]
}

// Mesma fórmula do backend para mostrar o preço em tempo real
const calculateDynamicPrice = (days: number): number => {
  const BASE_DAILY_RATE = 2.99
  const PROGRESSIVE_FEE = 0.10
  const dailyRate = BASE_DAILY_RATE + (days - 1) * PROGRESSIVE_FEE
  const total = dailyRate * days
  return Math.round(total * 100) / 100
}

const getEngagementTier = (days: number) => {
  if (days <= 3) return { icon: Zap, label: 'Impulso Rápido', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' }
  if (days <= 7) return { icon: Flame, label: 'Engajamento Semanal', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200' }
  if (days <= 15) return { icon: Rocket, label: 'Boost Quinzenal', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' }
  if (days <= 30) return { icon: Gem, label: 'Destaque Mensal', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200' }
  return { icon: Crown, label: 'Mega Destaque', color: 'from-amber-500 to-yellow-400', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' }
}

export default function AdEngagePage() {
  const params = useParams()
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()
  
  const [ad, setAd] = useState<Ad | null>(null)
  const [duration, setDuration] = useState(7)
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD'>('PIX')
  const [loading, setLoading] = useState(true)
  const [creatingPayment, setCreatingPayment] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState('')

  // Preço calculado dinamicamente
  const pricing = useMemo(() => {
    const total = calculateDynamicPrice(duration)
    const dailyAvg = total / duration
    const tier = getEngagementTier(duration)
    return { total, dailyAvg, tier }
  }, [duration])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    fetchData()
  }, [isAuthenticated, params.id])

  const fetchData = async () => {
    try {
      const adRes = await fetch(`/api/ads/${params.id}`)

      if (!adRes.ok) {
        throw new Error('Erro ao carregar dados')
      }

      const adData = await adRes.json()
      setAd(adData.ad)
    } catch (err) {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePayment = async () => {
    setCreatingPayment(true)
    setError('')

    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adIds: [params.id],
          paymentMethod,
          duration,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar pagamento')
      }

      const data = await response.json()
      setPaymentData(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao criar pagamento')
    } finally {
      setCreatingPayment(false)
    }
  }

  const adjustDuration = (delta: number) => {
    const newValue = duration + delta
    if (newValue >= 1 && newValue <= 90) {
      setDuration(newValue)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error && !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
          <Link href={`/ads/${params.id}`} className="text-blue-600 hover:underline">
            Voltar para anúncio
          </Link>
        </div>
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Anúncio não encontrado</h2>
          <Link href="/ads" className="text-blue-600 hover:underline">
            Voltar para anúncios
          </Link>
        </div>
      </div>
    )
  }

  if (paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Pagamento Criado
            </h1>

            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Aguardando pagamento</span>
                </div>
              </div>

              <p className="text-gray-600 text-center mb-4">
                Escaneie o QR Code abaixo para pagar com PIX
              </p>

              {paymentData.payment?.qrCodeBase64 && (
                <div className="flex justify-center mb-4">
                  <img
                    src={`data:image/png;base64,${paymentData.payment.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-64 h-64 rounded-lg"
                  />
                </div>
              )}

              {paymentData.payment?.qrCode && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2 text-center">Código PIX (copiar e colar):</p>
                  <div className="bg-gray-100 rounded-lg p-3 break-all text-xs text-gray-700 font-mono">
                    {paymentData.payment.qrCode}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(paymentData.payment.qrCode)}
                    className="mt-2 w-full py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Copiar código PIX
                  </button>
                </div>
              )}

              {paymentData.payment?.ticketUrl && (
                <Link
                  href={paymentData.payment.ticketUrl}
                  target="_blank"
                  className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Abrir link de pagamento
                </Link>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Duração:</span>
                <span className="font-semibold">{paymentData.purchase.duration} dias</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Média/dia:</span>
                <span className="font-semibold">R$ {paymentData.purchase.pricePerDay}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Valor total:</span>
                <span className="font-semibold">R$ {paymentData.purchase.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Status:</span>
                <span className="font-semibold text-yellow-600">Pendente</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Após o pagamento, seu anúncio será engajado automaticamente
            </p>
          </div>
        </div>
      </div>
    )
  }

  const TierIcon = pricing.tier.icon

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href={`/ads/${params.id}`} className="text-blue-600 hover:underline">
            ← Voltar para anúncio
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Engajar Anúncio</h1>
        <p className="text-gray-600 mb-8">Destaque seu anúncio e aumente sua visibilidade</p>

        {/* Anúncio selecionado */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex gap-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            {ad.images.length > 0 ? (
              <img
                src={ad.images[0]}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-3xl">🏆</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{ad.title}</h3>
            <p className="text-sm text-gray-500">Anúncio selecionado para engajamento</p>
          </div>
        </div>

        {/* Seletor de dias */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Quantos dias de destaque?</h2>
          </div>

          {/* Controle de dias com input numérico */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => adjustDuration(-1)}
              disabled={duration <= 1}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-5 h-5 text-gray-700" />
            </button>

            <div className="text-center">
              <input
                type="number"
                min={1}
                max={90}
                value={duration}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (!isNaN(val) && val >= 1 && val <= 90) {
                    setDuration(val)
                  }
                }}
                className="w-24 text-center text-4xl font-bold text-gray-800 border-b-2 border-blue-600 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {duration === 1 ? 'dia' : 'dias'}
              </p>
            </div>

            <button
              onClick={() => adjustDuration(1)}
              disabled={duration >= 90}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Atalhos rápidos */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[1, 3, 7, 15, 30, 60].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  duration === d
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d} {d === 1 ? 'dia' : 'dias'}
              </button>
            ))}
          </div>

          {/* Tier badge */}
          <div className={`${pricing.tier.bgColor} ${pricing.tier.borderColor} border rounded-lg p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${pricing.tier.color} flex items-center justify-center`}>
              <TierIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`font-semibold ${pricing.tier.textColor}`}>{pricing.tier.label}</p>
              <p className="text-sm text-gray-500">
                Média de R$ {pricing.dailyAvg.toFixed(2)}/dia · Total R$ {pricing.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Método de Pagamento */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Método de pagamento</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {(['PIX', 'CREDIT_CARD', 'DEBIT_CARD'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === method
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === method ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className={`text-sm font-medium block text-center ${
                  paymentMethod === method ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {method === 'PIX' ? 'PIX' : method === 'CREDIT_CARD' ? 'Crédito' : 'Débito'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Resumo e Pagamento */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo do pedido</h2>

          <div className="space-y-3 text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Anúncio:</span>
              <span className="font-medium text-gray-800 truncate ml-4 max-w-[200px]">{ad.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Tipo de destaque:</span>
              <span className={`font-medium ${pricing.tier.textColor}`}>{pricing.tier.label}</span>
            </div>
            <div className="flex justify-between">
              <span>Duração:</span>
              <span className="font-medium text-gray-800">{duration} {duration === 1 ? 'dia' : 'dias'}</span>
            </div>
            <div className="flex justify-between">
              <span>Valor por dia:</span>
              <span className="font-medium text-gray-800">R$ {pricing.dailyAvg.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pagamento:</span>
              <span className="font-medium text-gray-800">
                {paymentMethod === 'PIX' ? 'PIX' : paymentMethod === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Cartão de Débito'}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  R$ {pricing.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Após a confirmação do pagamento, seu anúncio será destacado automaticamente por {duration} {duration === 1 ? 'dia' : 'dias'}.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleCreatePayment}
            disabled={creatingPayment}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {creatingPayment ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando pagamento...
              </>
            ) : (
              <>
                Pagar R$ {pricing.total.toFixed(2)}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Tabela de preços rápida */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">Tabela de preços</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Quanto mais dias, maior o alcance do seu anúncio. O valor por dia aumenta ligeiramente para engajamentos mais longos.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 3, 7, 15, 30, 60].map((d) => {
              const p = calculateDynamicPrice(d)
              const tier = getEngagementTier(d)
              const TIcon = tier.icon
              return (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    duration === d
                      ? `${tier.borderColor} ${tier.bgColor} shadow-sm`
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <TIcon className={`w-3.5 h-3.5 ${duration === d ? tier.textColor : 'text-gray-400'}`} />
                    <span className="text-xs font-medium text-gray-500">{d} {d === 1 ? 'dia' : 'dias'}</span>
                  </div>
                  <p className="font-bold text-gray-800">R$ {p.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">R$ {(p / d).toFixed(2)}/dia</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}