export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
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
  await connectDB()
  const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 })
  return NextResponse.json({ users })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { userId, name, email, phone, address, isActive, password } = await req.json()

  const updateData: Record<string, unknown> = { name, email, phone, address, isActive }
  if (password) {
    updateData.password = await bcrypt.hash(password, 12)
  }

  const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password')
  return NextResponse.json({ user })
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { userId } = await req.json()
  await User.findByIdAndDelete(userId)
  return NextResponse.json({ success: true })
}
