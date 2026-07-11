import fs from 'node:fs'
import path from 'node:path'
import { lookup } from 'mime-types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const file = String(query.file || '').replace(/^\/+/, '')
  const filePath = path.join(process.cwd(), 'public', file)

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'File Tidak Ditemukan' })
  }

  const mimeType = lookup(filePath) || 'image/jpeg'
  const fileBuffer = fs.readFileSync(filePath)

  return sendWebResponse(
    event,
    new Response(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileBuffer.length.toString(),
        'Access-Control-Allow-Origin': '*',
      },
    })
  )
})