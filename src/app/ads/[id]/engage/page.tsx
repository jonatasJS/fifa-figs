'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { 
  Check, 
  Calendar, 
  Clock, 
  CreditCard,
  Loader2,
  QrCode,
  ArrowRight
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  features: string[]
}

interface Ad {
  id: string
  title: string
  images: string[]
}

export default function AdEngagePage() {
  const params = useParams()
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()
  
  const [plans, setPlans] = useState<Plan[]>([])
  const [ad, setAd] = useState<Ad | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [duration, setDuration] = useState(7)
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD'>('PIX')
  const [loading, setLoading] = useState(true)
  const [creatingPayment, setCreatingPayment] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    fetchData()
  }, [isAuthenticated, params.id])

  const fetchData = async () => {
    try {
      const [plansRes, adRes] = await Promise.all([
        fetch('/api/plans'),
        fetch(`/api/ads/${params.id}`),
      ])

      if (!plansRes.ok || !adRes.ok) {
        throw new Error('Erro ao carregar dados')
      }

      const plansData = await plansRes.json()
      const adData = await adRes.json()

      setPlans(plansData.plans)
      setAd(adData.ad)
    } catch (err) {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePayment = async () => {
    if (!selectedPlan) return

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
          planId: selectedPlan.id,
          adIds: [params.id],
          paymentMethod,
          duration,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar pagamento')
      }

      const data = await response.json()
      setPaymentData(data)
    } catch (err) {
      setError('Erro ao criar pagamento')
    } finally {
      setCreatingPayment(false)
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
                    src={paymentData.payment.qrCodeBase64}
                    alt="QR Code PIX"
                    className="w-64 h-64 rounded-lg"
                  />
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
                <span>Valor:</span>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/ads/${params.id}`} className="text-blue-600 hover:underline">
            ← Voltar para anúncio
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Engajar Anúncio</h1>
        <p className="text-gray-600 mb-8">Escolha um plano para destacar seu anúncio</p>

        {/* Anúncio */}
        {ad && (
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
        )}

        {/* Planos */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan?.id === plan.id}
              onSelect={() => setSelectedPlan(plan)}
            />
          ))}
        </div>

        {/* Configurações */}
        {selectedPlan && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Configurações</h2>

            <div className="space-y-6">
              {/* Duração */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração do engajamento
                </label>
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={7}>7 dias</option>
                    <option value={15}>15 dias</option>
                    <option value={30}>30 dias</option>
                    <option value={60}>60 dias</option>
                  </select>
                </div>
              </div>

              {/* Método de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de pagamento
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['PIX', 'CREDIT_CARD', 'DEBIT_CARD'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        paymentMethod === method
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-800">
                        {method === 'PIX' ? 'PIX' : method === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Cartão de Débito'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Resumo</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Plano:</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duração:</span>
                    <span className="font-medium">{duration} dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Método:</span>
                    <span className="font-medium">{paymentMethod === 'PIX' ? 'PIX' : paymentMethod === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Cartão de Débito'}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg text-gray-800">
                      <span>Total:</span>
                      <span>R$ {selectedPlan.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreatePayment}
                disabled={creatingPayment}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creatingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando pagamento...
                  </>
                ) : (
                  <>
                    Criar Pagamento
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PlanCard({ plan, selected, onSelect }: { 
  plan: Plan, 
  selected: boolean, 
  onSelect: () => void 
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-6 rounded-xl cursor-pointer transition-all border-2 ${
        selected
          ? 'border-blue-600 bg-blue-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
      <p className="text-3xl font-bold text-blue-600 mb-4">R$ {plan.price.toFixed(2)}</p>
      <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
      <ul className="space-y-2">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}