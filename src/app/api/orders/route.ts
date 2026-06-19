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
  const orders = await prisma.order.findMany({ where: { userId: user.userId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, productName, productPrice, quantity, buyerName, buyerPhone, buyerAddress } = await req.json()

  if (!productId || !productName || !buyerName || !buyerPhone || !buyerAddress) {
    return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 })
  }

  const price = productPrice || 0
  const qty = quantity || 1

  const order = await prisma.order.create({
    data: {
      userId: user.userId,
      productId,
      productName,
      productPrice: price,
      quantity: qty,
      totalAmount: price * qty,
      buyerName,
      buyerPhone,
      buyerAddress,
      status: 'pending',
    },
  })

  await prisma.notification.create({
    data: {
      userId: user.userId,
      orderId: order.id,
      title: 'Request Sent!',
      message: `Your request for "${productName}" has been sent to Karpe Farm. We will contact you at ${buyerPhone} directly. Thank you!`,
      type: 'order',
    },
  })

  return NextResponse.json({ order }, { status: 201 })
}
