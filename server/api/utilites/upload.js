import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  assertMethod(event, ['POST'])

  try {
    const query = getQuery(event)
    const targetFolder = query.folder || 'default'

    const multipartData = await readMultipartFormData(event)
    if (!multipartData || multipartData.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Tidak ada data form murni.' })
    }

    const fileData = multipartData.find((item) => item.filename && item.type)

    if (!fileData) {
      throw createError({ statusCode: 400, statusMessage: 'File gambar tidak ditemukan dalam request.' })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', targetFolder)
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const originalName = fileData.filename || 'upload.jpg'
    const fileExt = path.extname(originalName)
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`
    
    const filePath = path.join(uploadDir, uniqueFilename)    
    fs.writeFileSync(filePath, fileData.data)

    return {
        success: true,
        message: 'File berhasil diunggah',
        filename: uniqueFilename,
        originalName: originalName,
        url: `/uploads/${targetFolder}/${uniqueFilename}`
    }

  } catch (error) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Gagal mengunggah file.',
    })
  }
})