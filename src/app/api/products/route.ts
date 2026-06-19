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

const defaultProducts = [
  { name: 'Fresh Onions', description: 'Organically grown red onions from our Kamalpur farm, packed fresh in jute bags. Rich in antioxidants and sulfur compounds that support immunity.', price: 30, unit: 'kg', image: '/photos/onion.jpeg', category: 'vegetable', stock: 200, rating: 4.5, reviews: 120, isFeatured: true },
  { name: 'Fresh Tomatoes', description: 'Juicy, firm tomatoes grown with natural compost on our farm. No harmful chemicals — just sun, soil, and care.', price: 25, unit: 'kg', image: '/photos/tomato.jpeg', category: 'vegetable', stock: 300, rating: 4.6, reviews: 200, isFeatured: true },
  { name: 'Mosambi (Sweet Lime)', description: 'Vitamin C-rich mosambi grown in our orchard at Kamalpur. Planted in 2022, these sweet limes are tender, juicy, and full of natural flavor.', price: 60, unit: 'kg', image: '/photos/m1.jpeg', category: 'fruit', stock: 120, rating: 4.7, reviews: 95, isFeatured: true },
  { name: 'Fresh Coconuts', description: 'Tender coconuts freshly harvested from our coconut grove. Planted in 2022 and now yielding fresh, nutritious coconuts full of natural water and pulp.', price: 45, unit: 'unit', image: '/photos/coco-2.jpeg', category: 'fruit', stock: 200, rating: 4.8, reviews: 150, isFeatured: true },
  { name: 'Alphonso Mango', description: 'Premium mangoes hand-picked from our orchard at peak ripeness. Sweet, aromatic, and bursting with flavor — from our farm directly to you.', price: 80, unit: 'kg', image: '/photos/mango.jpeg', category: 'fruit', stock: 60, rating: 4.9, reviews: 300, isFeatured: true },
  { name: 'Fresh Guava (Peru)', description: 'Farm-fresh guava picked at natural ripeness. Crunchy outside, soft inside — rich in Vitamin C and a favorite at our farm. Enjoyed fresh, straight from the tree.', price: 35, unit: 'kg', image: '/photos/eating goova.jpeg', category: 'fruit', stock: 100, rating: 4.6, reviews: 80, isFeatured: true },
  { name: 'Brinjal (Bringle)', description: 'Tender purple brinjals freshly harvested from our organic fields with natural compost.', price: 40, unit: 'kg', image: '/images/bringle.png', category: 'vegetable', stock: 150, rating: 4.3, reviews: 85, isFeatured: false },
  { name: 'Lady Finger', description: 'Tender okra freshly picked from our organic garden. Best cooked fresh for maximum nutrition.', price: 35, unit: 'kg', image: '/images/finger.png', category: 'vegetable', stock: 100, rating: 4.2, reviews: 60, isFeatured: false },
  { name: 'Chiku (Sapodilla)', description: 'Sweet and delicious chiku fruits freshly plucked from our orchard. Natural caramel-like flavor.', price: 50, unit: 'kg', image: '/images/chiku.png', category: 'fruit', stock: 80, rating: 4.4, reviews: 70, isFeatured: false },
]

async function seedProducts() {
  const count = await prisma.product.count()
  if (count === 0) {
    await prisma.product.createMany({ data: defaultProducts })
  }
}

export async function GET(req: NextRequest) {
  try {
    await seedProducts()
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const all = searchParams.get('all')

    const where: Record<string, unknown> = all === 'true' ? {} : { isActive: true }
    if (featured === 'true') where.isFeatured = true
    if (category && category !== 'all') where.category = category

    const products = await prisma.product.findMany({ where, orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }] })
    return NextResponse.json({ products })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const product = await prisma.product.create({ data })
  return NextResponse.json({ product }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { productId, ...data } = await req.json()
  const product = await prisma.product.update({ where: { id: productId }, data })
  return NextResponse.json({ product })
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { productId } = await req.json()
  await prisma.product.update({ where: { id: productId }, data: { isActive: false } })
  return NextResponse.json({ success: true })
}
