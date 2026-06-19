export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Contact from '@/lib/models/Contact'
import { verifyToken } from '@/lib/auth'

function getUser(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

export async function POST(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Login required to contact us' }, { status: 401 })
  await connectDB()
  const { subject, message } = await req.json()

  const { connectDB: _db } = await import('@/lib/db')
  const User = (await import('@/lib/models/User')).default
  const dbUser = await User.findById(user.userId)
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const contact = await Contact.create({
    userId: user.userId,
    userName: dbUser.name,
    userEmail: dbUser.email,
    subject,
    message,
  })
  return NextResponse.json({ contact }, { status: 201 })
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const contacts = await Contact.find().sort({ createdAt: -1 })
  return NextResponse.json({ contacts })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { contactId, status, adminReply } = await req.json()
  const contact = await Contact.findByIdAndUpdate(contactId, { status, adminReply }, { new: true })
  return NextResponse.json({ contact })
}
