// app/api/user/upload-photo/route.js
// Cloudinary upload — works on Vercel + local both
export const runtime = 'nodejs'

import { v2 as cloudinary } from 'cloudinary'
import { auth }             from '@/lib/auth'
import { connectDB }        from '@/lib/mongodb'
import User                 from '@/lib/models/User'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_TYPES  = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB

export async function POST(req) {
  try {
    // ── Auth check ──────────────────────────────────────────────────
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Parse form data ─────────────────────────────────────────────
    const formData = await req.formData()
    const file     = formData.get('photo')

    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // ── Validate type ───────────────────────────────────────────────
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: 'Only JPG, PNG and WebP images allowed' },
        { status: 400 }
      )
    }

    // ── Validate size ───────────────────────────────────────────────
    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (buffer.length > MAX_SIZE_BYTES) {
      return Response.json(
        { error: 'Image must be smaller than 2MB' },
        { status: 400 }
      )
    }

    // ── Upload to Cloudinary ────────────────────────────────────────
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder:         'neuralforge/avatars',
          public_id:      `avatar_${session.user.id}`,  // overwrite old photo
          overwrite:      true,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // auto crop face
            { quality: 'auto', fetch_format: 'auto' },                   // auto optimize
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else       resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    const imageUrl = uploadResult.secure_url

    // ── Save URL to MongoDB ─────────────────────────────────────────
    await connectDB()
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { image: imageUrl },
      { new: true, select: '-password' }
    )

    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('[upload-photo] Cloudinary URL:', imageUrl)

    return Response.json({
      message:  'Photo uploaded successfully',
      imageUrl,
    })

  } catch (err) {
    console.error('[upload-photo] error:', err)
    return Response.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}