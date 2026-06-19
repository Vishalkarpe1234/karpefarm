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

  if (!productId || !productName || !productPrice || !quantity || !buyerName || !buyerPhone || !buyerAddress) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const order = await prisma.order.create({
    data: {
      userId: user.userId,
      productId,
      productName,
      productPrice,
      quantity,
      totalAmount: productPrice * quantity,
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
      title: 'Order Placed Successfully!',
      message: `Your order for ${productName} (${quantity} ${quantity > 1 ? 'units' : 'unit'}) has been placed. Total: ₹${productPrice * quantity}. We will update you soon!`,
      type: 'order',
    },
  })

  return NextResponse.json({ order }, { status: 201 })
}
