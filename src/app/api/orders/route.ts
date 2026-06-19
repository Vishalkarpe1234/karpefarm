export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/lib/models/Order'
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
  const orders = await Order.find({ userId: user.userId }).sort({ createdAt: -1 })
  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { productId, productName, productPrice, quantity, buyerName, buyerPhone, buyerAddress } = await req.json()

  if (!productId || !productName || !productPrice || !quantity || !buyerName || !buyerPhone || !buyerAddress) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const order = await Order.create({
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
  })

  await Notification.create({
    userId: user.userId,
    orderId: order._id,
    title: 'Order Placed Successfully!',
    message: `Your order for ${productName} (${quantity} ${quantity > 1 ? 'units' : 'unit'}) has been placed. Total: ₹${productPrice * quantity}. We will update you soon!`,
    type: 'order',
  })

  return NextResponse.json({ order }, { status: 201 })
}
