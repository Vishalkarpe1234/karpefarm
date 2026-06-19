export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { verifyToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

function getUser(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function PUT(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { name, phone, address, profilePhoto, currentPassword, newPassword } = await req.json()

  const dbUser = await User.findById(user.userId)
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (currentPassword && newPassword) {
    const valid = await bcrypt.compare(currentPassword, dbUser.password)
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    dbUser.password = await bcrypt.hash(newPassword, 12)
  }

  if (name) dbUser.name = name
  if (phone !== undefined) dbUser.phone = phone
  if (address !== undefined) dbUser.address = address
  if (profilePhoto !== undefined) dbUser.profilePhoto = profilePhoto

  await dbUser.save()
  return NextResponse.json({
    user: { id: dbUser._id, name: dbUser.name, email: dbUser.email, phone: dbUser.phone, address: dbUser.address, profilePhoto: dbUser.profilePhoto },
  })
}
