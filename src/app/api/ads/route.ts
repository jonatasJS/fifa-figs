import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { z } from 'zod'

const adSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().optional(),
  location: z.string().optional(),
  condition: z.enum(['NOVA', 'USADA', 'TROCA']),
  images: z.array(z.string()).min(1),
  whatsapp: z.string(),
})

// GET - Listar anúncios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const condition = searchParams.get('condition')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {
      status: 'ACTIVE',
    }

    if (condition) {
      where.condition = condition
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          metrics: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.ad.count({ where }),
    ])

    return NextResponse.json({
      ads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao listar anúncios:', error)
    return NextResponse.json(
      { error: 'Erro ao listar anúncios' },
      { status: 500 }
    )
  }
}

// POST - Criar anúncio
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    const body = await request.json()
    const validatedData = adSchema.parse(body)

    const ad = await prisma.ad.create({
      data: {
        ...validatedData,
        userId: payload.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Criar métricas iniciais
    await prisma.adMetrics.create({
      data: {
        adId: ad.id,
      },
    })

    return NextResponse.json({ ad }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao criar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro ao criar anúncio' },
      { status: 500 }
    )
  }
}