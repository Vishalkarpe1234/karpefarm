export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

function getUser(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const notifications = await prisma.notification.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  const unreadCount = await prisma.notification.count({ where: { userId: user.userId, isRead: false } })
  return NextResponse.json({ notifications, unreadCount })
}

export async function PUT(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { notificationId } = await req.json()

  if (notificationId === 'all') {
    await prisma.notification.updateMany({ where: { userId: user.userId }, data: { isRead: true } })
  } else {
    await prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } })
  }
  return NextResponse.json({ success: true })
}
