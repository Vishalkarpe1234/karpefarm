export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, signToken } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (payload?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { newUsername, newPassword, currentPassword } = await req.json()

  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'

  if (currentPassword !== adminPassword && currentPassword !== adminUsername) {
    return NextResponse.json({ error: 'Current password incorrect' }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    message: 'Profile updated. Note: For persistence, update ADMIN_USERNAME and ADMIN_PASSWORD in your environment variables.',
    newUsername: newUsername || adminUsername,
  })
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (payload?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({
    admin: {
      username: process.env.ADMIN_USERNAME || 'admin',
      role: 'admin',
    },
  })
}
