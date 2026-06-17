import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
    })

    if (!ad) {
      return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
    }

    // Incrementar cliques do WhatsApp
    await prisma.adMetrics.update({
      where: { adId: params.id },
      data: { whatsappClicks: { increment: 1 } },
    })

    return NextResponse.json({ whatsapp: ad.whatsapp })
  } catch (error) {
    console.error('Erro ao registrar clique:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar clique' },
      { status: 500 }
    )
  }
}