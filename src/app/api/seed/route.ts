import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Criar planos iniciais
    const plans = await prisma.plan.createMany({
      data: [
        {
          name: 'Starter',
          description: 'Ideal para começar',
          price: 9.90,
          duration: 7,
          features: [
            'Destaque por 7 dias',
            'Aparece nos primeiros resultados',
            'Suporte por email',
          ],
          isActive: true,
        },
        {
          name: 'Pro',
          description: 'Para quem vende mais',
          price: 19.90,
          duration: 15,
          features: [
            'Destaque por 15 dias',
            'Aparece nos primeiros resultados',
            'Badge de destaque',
            'Suporte prioritário',
          ],
          isActive: true,
        },
        {
          name: 'Premium',
          description: 'Máxima visibilidade',
          price: 39.90,
          duration: 30,
          features: [
            'Destaque por 30 dias',
            'Aparece sempre no topo',
            'Badge premium',
            'Suporte 24/7',
            'Análises avançadas',
          ],
          isActive: true,
        },
      ],
      skipDuplicates: true,
    })

    return NextResponse.json({
      message: 'Planos criados com sucesso',
      count: plans.count,
    })
  } catch (error) {
    console.error('Erro ao criar planos:', error)
    return NextResponse.json(
      { error: 'Erro ao criar planos' },
      { status: 500 }
    )
  }
}