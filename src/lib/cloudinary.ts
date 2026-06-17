import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
}

export const uploadImage = async (
  file: File | Buffer,
  folder: string = 'fifa-figs'
): Promise<UploadResult> => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 800, crop: 'limit' },
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(file)
    }) as any

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error)
    throw new Error('Erro ao fazer upload da imagem')
  }
}

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Erro ao deletar imagem:', error)
    throw new Error('Erro ao deletar imagem')
  }
}

export const uploadMultipleImages = async (
  files: File[] | Buffer[],
  folder: string = 'fifa-figs'
): Promise<UploadResult[]> => {
  const uploadPromises = files.map(file => uploadImage(file, folder))
  return Promise.all(uploadPromises)
}