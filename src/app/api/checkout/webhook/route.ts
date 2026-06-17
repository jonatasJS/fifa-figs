import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentStatus } from '@/lib/mercadopago'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Verificar assinatura do Mercado Pago (opcional, mas recomendado)
    const signature = request.headers.get('x-signature')
    const timestamp = request.headers.get('x-signature-timestamp')

    if (signature && timestamp) {
      // Implementar verificação de assinatura aqui
      // Isso é opcional e depende da configuração do Mercado Pago
    }

    const body = await request.json()

    if (body.type === 'payment') {
      const paymentId = body.data.id

      // Buscar status do pagamento
      const status = await getPaymentStatus(paymentId)

      // Buscar a compra pelo paymentId
      const purchase = await prisma.purchase.findFirst({
        where: { paymentId },
        include: {
          adEngagements: true,
        },
      })

      if (!purchase) {
        console.log(`Compra não encontrada para paymentId: ${paymentId}`)
        return NextResponse.json({ received: true }, { status: 200 })
      }

      // Atualizar status da compra
      let approvedAt = null
      let isActive = false

      if (status === 'approved') {
        approvedAt = new Date()
        isActive = true
      }

      await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          status: status.toUpperCase(),
          approvedAt,
        },
      })

      // Ativar ou desativar engajamentos
      await prisma.adEngagement.updateMany({
        where: { purchaseId: purchase.id },
        data: { isActive },
      })

      // Registrar pagamento
      await prisma.payment.upsert({
        where: { paymentId },
        update: {
          status: status.toUpperCase(),
          approvedAt,
        },
        create: {
          paymentId,
          status: status.toUpperCase(),
          amount: purchase.planId ? 0 : 0, // Você precisaria buscar o valor do plano
          approvedAt,
        },
      })

      console.log(`Pagamento ${paymentId} processado: ${status}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Endpoint para testes do Mercado Pago
  return NextResponse.json({ status: 'ok' })
}