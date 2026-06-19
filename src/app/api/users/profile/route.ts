export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
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

  const { name, phone, address, profilePhoto, currentPassword, newPassword } = await req.json()

  const dbUser = await prisma.user.findUnique({ where: { id: user.userId } })
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const updateData: Record<string, unknown> = {}
  if (name) updateData.name = name
  if (phone !== undefined) updateData.phone = phone
  if (address !== undefined) updateData.address = address
  if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto

  if (currentPassword && newPassword) {
    const valid = await bcrypt.compare(currentPassword, dbUser.password)
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    updateData.password = await bcrypt.hash(newPassword, 12)
  }

  const updated = await prisma.user.update({ where: { id: user.userId }, data: updateData })
  return NextResponse.json({
    user: { id: updated.id, name: updated.name, email: updated.email, phone: updated.phone, address: updated.address, profilePhoto: updated.profilePhoto },
  })
}
