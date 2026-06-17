import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { createPayment, calculateDynamicPrice, generateEngagementDescription } from '@/lib/mercadopago'
import { z } from 'zod'

const checkoutSchema = z.object({
  adIds: z.array(z.string()).min(1),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD']),
  duration: z.number().min(1).max(90), // 1 a 90 dias
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

    // Calcular preço dinâmico baseado nos dias
    const pricePerAd = calculateDynamicPrice(validatedData.duration)
    const totalPrice = Math.round(pricePerAd * validatedData.adIds.length * 100) / 100

    // Gerar descrição dinâmica
    const description = generateEngagementDescription(validatedData.duration, pricePerAd)

    // Gerar título dinâmico
    const adCount = validatedData.adIds.length
    const title = adCount === 1
      ? `Engajamento de ${validatedData.duration} dias para 1 anúncio`
      : `Engajamento de ${validatedData.duration} dias para ${adCount} anúncios`

    // Calcular data de expiração
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + validatedData.duration)

    // Buscar ou criar um plano genérico para a compra (usando o primeiro plano ativo)
    let plan = await prisma.plan.findFirst({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    })

    if (!plan) {
      return NextResponse.json({ error: 'Nenhum plano disponível' }, { status: 404 })
    }

    // Criar pagamento no Mercado Pago
    const paymentData = await createPayment({
      title,
      description,
      amount: totalPrice,
      userId: user.id,
      userEmail: user.email,
      days: validatedData.duration,
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
        duration: validatedData.duration,
        pricePerDay: (totalPrice / validatedData.duration).toFixed(2),
      },
      payment: paymentData,
      pricing: {
        days: validatedData.duration,
        pricePerAd,
        totalAds: adCount,
        totalPrice,
        description,
      },
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