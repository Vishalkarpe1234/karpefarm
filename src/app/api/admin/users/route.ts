export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const users = await prisma.user.findMany({
    where: { role: 'user' },
    select: { id: true, name: true, email: true, phone: true, address: true, isActive: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ users })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { userId, name, email, phone, address, isActive, password } = await req.json()

  const updateData: Record<string, unknown> = { name, email, phone, address, isActive }
  if (password) updateData.password = await bcrypt.hash(password, 12)

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, name: true, email: true, phone: true, address: true, isActive: true, role: true },
  })
  return NextResponse.json({ user })
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { userId } = await req.json()
  await prisma.user.delete({ where: { id: userId } })
  return NextResponse.json({ success: true })
}
