import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { z } from 'zod'

const adUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  price: z.number().optional(),
  location: z.string().optional(),
  condition: z.enum(['NOVA', 'USADA', 'TROCA']).optional(),
  images: z.array(z.string()).optional(),
  whatsapp: z.string().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'EXPIRED']).optional(),
})

// GET - Buscar anúncio por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const ad = await prisma.ad.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            whatsapp: true,
          },
        },
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
    })

    if (!ad) {
      return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
    }

    // Incrementar visualização
    await prisma.adMetrics.upsert({
      where: { adId: ad.id },
      update: { views: { increment: 1 } },
      create: { adId: ad.id, views: 1 },
    })

    return NextResponse.json({ ad })
  } catch (error) {
    console.error('Erro ao buscar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar anúncio' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar anúncio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    const body = await request.json()
    const validatedData = adUpdateSchema.parse(body)

    // Verificar se o anúncio pertence ao usuário
    const existingAd = await prisma.ad.findUnique({
      where: { id: params.id },
    })

    if (!existingAd) {
      return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
    }

    if (existingAd.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar este anúncio' },
        { status: 403 }
      )
    }

    const ad = await prisma.ad.update({
      where: { id: params.id },
      data: validatedData,
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
    })

    return NextResponse.json({ ad })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar anúncio' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar anúncio
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyToken(token)

    // Verificar se o anúncio pertence ao usuário
    const existingAd = await prisma.ad.findUnique({
      where: { id: params.id },
    })

    if (!existingAd) {
      return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
    }

    if (existingAd.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar este anúncio' },
        { status: 403 }
      )
    }

    await prisma.ad.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Anúncio deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar anúncio' },
      { status: 500 }
    )
  }
}