export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Notification from '@/lib/models/Notification'
import { verifyToken } from '@/lib/auth'

function getUser(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const notifications = await Notification.find({ userId: user.userId }).sort({ createdAt: -1 }).limit(50)
  const unreadCount = await Notification.countDocuments({ userId: user.userId, isRead: false })
  return NextResponse.json({ notifications, unreadCount })
}

export async function PUT(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { notificationId } = await req.json()
  if (notificationId === 'all') {
    await Notification.updateMany({ userId: user.userId }, { isRead: true })
  } else {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true })
  }
  return NextResponse.json({ success: true })
}
