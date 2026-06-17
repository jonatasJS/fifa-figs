import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar planos
export async function GET(request: NextRequest) {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    })

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Erro ao listar planos:', error)
    return NextResponse.json(
      { error: 'Erro ao listar planos' },
      { status: 500 }
    )
  }
}

// POST - Criar plano (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const plan = await prisma.plan.create({
      data: body,
    })

    return NextResponse.json({ plan }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar plano:', error)
    return NextResponse.json(
      { error: 'Erro ao criar plano' },
      { status: 500 }
    )
  }
}