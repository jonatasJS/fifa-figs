import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)

    // Buscar anúncios do usuário
    const ads = await prisma.ad.findMany({
      where: { userId: payload.userId },
      include: {
        metrics: true,
        engagements: {
          where: { isActive: true },
          include: {
            purchase: {
              include: {
                plan: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Buscar compras do usuário
    const purchases = await prisma.purchase.findMany({
      where: { userId: payload.userId },
      include: {
        plan: true,
        adEngagements: {
          include: {
            ad: {
              select: {
                id: true,
                title: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calcular métricas gerais
    const totalAds = ads.length
    const activeAds = ads.filter(ad => ad.status === 'ACTIVE').length
    const pausedAds = ads.filter(ad => ad.status === 'PAUSED').length
    const totalViews = ads.reduce((sum, ad) => sum + (ad.metrics?.views || 0), 0)
    const totalWhatsappClicks = ads.reduce(
      (sum, ad) => sum + (ad.metrics?.whatsappClicks || 0),
      0
    )

    // Anúncios engajados
    const engagedAds = ads.filter(ad => 
      ad.engagements.some(e => e.isActive)
    )

    return NextResponse.json({
      stats: {
        totalAds,
        activeAds,
        pausedAds,
        totalViews,
        totalWhatsappClicks,
        engagedAds: engagedAds.length,
      },
      ads,
      purchases,
    })
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dashboard' },
      { status: 500 }
    )
  }
}