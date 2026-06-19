export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ orders })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { orderId, status, adminComment } = await req.json()

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status, adminComment: adminComment || '' },
  })

  const statusMessages: Record<string, string> = {
    approved: 'Your order has been approved! We will process it shortly.',
    coming_soon: 'Your order is coming soon! Estimated delivery in 2-3 days.',
    out_of_stock: 'Sorry, the product is currently out of stock.',
    delivered: 'Your order has been delivered successfully!',
    cannot_deliver: 'We are unable to deliver your order at this time.',
    cancelled: 'Your order has been cancelled.',
  }

  if (statusMessages[status]) {
    await prisma.notification.create({
      data: {
        userId: order.userId,
        orderId: order.id,
        title: `Order Update - ${order.productName}`,
        message: `${statusMessages[status]}${adminComment ? ` Note: ${adminComment}` : ''}`,
        type: 'order',
      },
    })
  }

  return NextResponse.json({ order })
}
