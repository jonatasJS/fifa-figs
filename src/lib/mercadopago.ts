import axios from 'axios'

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN!
const MERCADO_PAGO_API_URL = 'https://api.mercadopago.com'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

export interface PaymentRequest {
  title: string
  description: string
  amount: number
  userId: string
  userEmail: string
  adId?: string
  days?: number
}

export interface PaymentResponse {
  paymentId: string
  qrCode: string
  qrCodeBase64: string
  ticketUrl: string
  status: string
}

// Calcula o preço dinâmico baseado nos dias
// Base: R$ 2.99/dia + R$ 0.10 de taxa progressiva por dia adicional
export const calculateDynamicPrice = (days: number): number => {
  const BASE_DAILY_RATE = 2.99
  const PROGRESSIVE_FEE = 0.10 // R$ 0.10 por dia adicional

  const dailyRate = BASE_DAILY_RATE + (days - 1) * PROGRESSIVE_FEE
  const total = dailyRate * days

  // Arredondar para 2 casas decimais
  return Math.round(total * 100) / 100
}

// Gera descrição dinâmica baseada nos dias e valor
export const generateEngagementDescription = (days: number, totalPrice: number): string => {
  const dailyAvg = (totalPrice / days).toFixed(2)
  
  if (days <= 3) {
    return `⚡ Impulso Rápido - ${days} dia${days > 1 ? 's' : ''} de destaque (média R$ ${dailyAvg}/dia)`
  } else if (days <= 7) {
    return `🔥 Engajamento Semanal - ${days} dias de visibilidade extra (média R$ ${dailyAvg}/dia)`
  } else if (days <= 15) {
    return `🚀 Boost Quinzenal - ${days} dias no topo das buscas (média R$ ${dailyAvg}/dia)`
  } else if (days <= 30) {
    return `💎 Destaque Mensal - ${days} dias de máxima exposição (média R$ ${dailyAvg}/dia)`
  } else {
    return `👑 Mega Destaque - ${days} dias de dominância total (média R$ ${dailyAvg}/dia)`
  }
}

export const createPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const isLocalhost = FRONTEND_URL.includes('localhost') || FRONTEND_URL.includes('127.0.0.1')

    // Montar o body da preferência
    const preferenceBody: Record<string, any> = {
      items: [
        {
          title: data.title,
          description: data.description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: data.amount,
        },
      ],
      payer: {
        email: data.userEmail,
      },
      back_urls: {
        success: `${FRONTEND_URL}/checkout/success`,
        failure: `${FRONTEND_URL}/checkout/failure`,
        pending: `${FRONTEND_URL}/checkout/pending`,
      },
      auto_return: 'approved',
      external_reference: data.userId,
    }

    // notification_url só funciona com URLs públicas (MP rejeita localhost)
    if (!isLocalhost) {
      preferenceBody.notification_url = `${FRONTEND_URL}${process.env.WEBHOOK_URL || '/api/checkout/webhook'}`
    }

    const response = await axios.post(
      `${MERCADO_PAGO_API_URL}/checkout/preferences`,
      preferenceBody,
      {
        headers: {
          Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const preferenceId = response.data.id

    // Criar pagamento PIX
    const pixResponse = await axios.post(
      `${MERCADO_PAGO_API_URL}/v1/payments`,
      {
        transaction_amount: data.amount,
        description: data.description,
        payment_method_id: 'pix',
        payer: {
          email: data.userEmail,
          first_name: 'Usuario',
          identification: {
            type: 'CPF',
            number: '00000000000', // CPF padrão para testes
          },
        },
        external_reference: data.userId,
        ...(isLocalhost ? {} : {
          notification_url: `${FRONTEND_URL}${process.env.WEBHOOK_URL || '/api/checkout/webhook'}`,
        }),
      },
      {
        headers: {
          Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return {
      paymentId: pixResponse.data.id,
      qrCode: pixResponse.data.point_of_interaction?.transaction_data?.qr_code || '',
      qrCodeBase64: pixResponse.data.point_of_interaction?.transaction_data?.qr_code_base64 || '',
      ticketUrl: pixResponse.data.point_of_interaction?.transaction_data?.ticket_url || '',
      status: pixResponse.data.status,
    }
  } catch (error: any) {
    if (error?.response?.data) {
      console.error('Erro Mercado Pago - Response:', JSON.stringify(error.response.data, null, 2))
    } else {
      console.error('Erro ao criar pagamento Mercado Pago:', error?.message || error)
    }
    throw new Error(`Erro ao criar pagamento: ${error?.response?.data?.message || error?.message || 'Erro desconhecido'}`)
  }
}

export const getPaymentStatus = async (paymentId: string): Promise<string> => {
  try {
    const response = await axios.get(
      `${MERCADO_PAGO_API_URL}/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    )

    return response.data.status
  } catch (error) {
    console.error('Erro ao buscar status do pagamento:', error)
    throw new Error('Erro ao buscar status do pagamento')
  }
}

export const processWebhook = async (data: any): Promise<void> => {
  const paymentId = data.data.id
  
  if (data.type === 'payment') {
    const status = await getPaymentStatus(paymentId)
    
    // Aqui você atualizaria o status no banco de dados
    // Isso será implementado na rota webhook
  }
}