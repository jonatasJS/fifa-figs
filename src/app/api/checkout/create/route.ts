import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { createPayment } from '@/lib/mercadopago'
import { z } from 'zod'

const checkoutSchema = z.object({
  planId: z.string(),
  adIds: z.array(z.string()).min(1),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD']),
  duration: z.number().min(1), // dias
})

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Buscar o plano
    const plan = await prisma.plan.findUnique({
      where: { id: validatedData.planId },
    })

    if (!plan) {
      return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 })
    }

    // Calcular preço total baseado na quantidade de anúncios
    const totalPrice = plan.price * validatedData.adIds.length

    // Calcular data de expiração
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + validatedData.duration)

    // Criar pagamento no Mercado Pago
    const paymentData = await createPayment({
      title: `Engajamento para ${validatedData.adIds.length} anúncio(s)`,
      description: `Plano ${plan.name} - ${validatedData.duration} dias`,
      amount: totalPrice,
      userId: user.id,
      userEmail: user.email,
    })

    // Criar registro de compra
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        planId: plan.id,
        paymentId: paymentData.paymentId,
        paymentMethod: validatedData.paymentMethod,
        expiresAt,
        status: 'PENDING',
      },
    })

    // Criar engajamentos para cada anúncio
    const adEngagements = await prisma.adEngagement.createMany({
      data: validatedData.adIds.map(adId => ({
        adId,
        purchaseId: purchase.id,
        startDate: new Date(),
        endDate: expiresAt,
        isActive: false, // Será ativado após pagamento
      })),
    })

    return NextResponse.json({
      purchase: {
        id: purchase.id,
        amount: totalPrice,
        status: purchase.status,
      },
      payment: paymentData,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao criar checkout:', error)
    return NextResponse.json(
      { error: 'Erro ao criar checkout' },
      { status: 500 }
    )
  }
}