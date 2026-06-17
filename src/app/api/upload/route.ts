import { NextRequest, NextResponse } from 'next/server'
import { uploadMultipleImages } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validar que são imagens
    const validFiles = files.filter(file => {
      return file.type.startsWith('image/')
    })

    if (validFiles.length === 0) {
      return NextResponse.json({ error: 'Nenhuma imagem válida' }, { status: 400 })
    }

    // Converter File para Buffer
    const buffers = await Promise.all(
      validFiles.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        return Buffer.from(arrayBuffer)
      })
    )

    // Upload para Cloudinary
    const uploadResults = await uploadMultipleImages(buffers, 'fifa-figs')

    return NextResponse.json({
      images: uploadResults.map(result => result.url),
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload' },
      { status: 500 }
    )
  }
}