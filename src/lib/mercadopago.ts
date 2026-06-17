import axios from 'axios'

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN!
const MERCADO_PAGO_API_URL = 'https://api.mercadopago.com'

export interface PaymentRequest {
  title: string
  description: string
  amount: number
  userId: string
  userEmail: string
}

export interface PaymentResponse {
  paymentId: string
  qrCode: string
  qrCodeBase64: string
  ticketUrl: string
  status: string
}

export const createPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(
      `${MERCADO_PAGO_API_URL}/checkout/preferences`,
      {
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
          success: `${process.env.FRONTEND_URL}/checkout/success`,
          failure: `${process.env.FRONTEND_URL}/checkout/failure`,
          pending: `${process.env.FRONTEND_URL}/checkout/pending`,
        },
        auto_return: 'approved',
        external_reference: data.userId,
        notification_url: `${process.env.FRONTEND_URL}${process.env.WEBHOOK_URL}`,
      },
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
          first_name: data.title.split(' ')[0],
          identification: {
            type: 'CPF',
            number: '00000000000', // CPF padrão para testes
          },
        },
        external_reference: data.userId,
        notification_url: `${process.env.FRONTEND_URL}${process.env.WEBHOOK_URL}`,
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
      qrCode: pixResponse.data.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: pixResponse.data.point_of_interaction.transaction_data.qr_code_base64,
      ticketUrl: pixResponse.data.point_of_interaction.transaction_data.ticket_url,
      status: pixResponse.data.status,
    }
  } catch (error) {
    console.error('Erro ao criar pagamento Mercado Pago:', error)
    throw new Error('Erro ao criar pagamento')
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