export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
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

  const dbUser = await prisma.user.findUnique({ where: { id: user.userId } })
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { subject, message } = await req.json()
  const contact = await prisma.contact.create({
    data: { userId: user.userId, userName: dbUser.name, userEmail: dbUser.email, subject: subject || '', message },
  })
  return NextResponse.json({ contact }, { status: 201 })
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ contacts })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { contactId, status, adminReply } = await req.json()
  const contact = await prisma.contact.update({
    where: { id: contactId },
    data: { status: status || 'new', adminReply: adminReply || '', isRead: true },
  })
  return NextResponse.json({ contact })
}
