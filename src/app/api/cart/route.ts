export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
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
  const dbUser = await User.findById(user.userId).populate('cart.productId')
  return NextResponse.json({ cart: dbUser?.cart || [] })
}

export async function POST(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { productId, quantity = 1 } = await req.json()
  const dbUser = await User.findById(user.userId)
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const existing = dbUser.cart.find((c: { productId: { toString(): string }; quantity: number }) => c.productId.toString() === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    dbUser.cart.push({ productId, quantity, addedAt: new Date() })
  }
  await dbUser.save()
  return NextResponse.json({ cart: dbUser.cart })
}

export async function DELETE(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { productId } = await req.json()
  const dbUser = await User.findById(user.userId)
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  dbUser.cart = dbUser.cart.filter((c) => c.productId.toString() !== productId)
  await dbUser.save()
  return NextResponse.json({ cart: dbUser.cart })
}
