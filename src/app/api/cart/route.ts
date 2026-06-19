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

  const dbUser = await prisma.user.findUnique({ where: { id: user.userId } })
  const cart = (dbUser?.cart as any[]) || []

  // Attach product details to each cart item
  const enriched = await Promise.all(
    cart.map(async (item: any) => {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      return { ...item, productId: product || { id: item.productId } }
    })
  )
  return NextResponse.json({ cart: enriched })
}

export async function POST(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { productId, quantity = 1 } = await req.json()

  const dbUser = await prisma.user.findUnique({ where: { id: user.userId } })
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const cart = (dbUser.cart as any[]) || []
  const existing = cart.find((c: any) => c.productId === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({ productId, quantity, addedAt: new Date().toISOString() })
  }

  await prisma.user.update({ where: { id: user.userId }, data: { cart } })
  return NextResponse.json({ cart })
}

export async function DELETE(req: NextRequest) {
  const user = getUser(req)
  if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { productId } = await req.json()

  const dbUser = await prisma.user.findUnique({ where: { id: user.userId } })
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const cart = ((dbUser.cart as any[]) || []).filter((c: any) => c.productId !== productId)
  await prisma.user.update({ where: { id: user.userId }, data: { cart } })
  return NextResponse.json({ cart })
}
