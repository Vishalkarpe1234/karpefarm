export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Product from '@/lib/models/Product'
import { verifyToken } from '@/lib/auth'

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

const defaultProducts = [
  { name: 'Fresh Onions', description: 'Organically grown red onions from our farm. Rich in antioxidants.', price: 30, unit: 'kg', image: '/images/onions.png', category: 'vegetable', stock: 200, rating: 4.5, reviews: 120, isFeatured: true },
  { name: 'Brinjal (Bringle)', description: 'Tender purple brinjals, freshly harvested from our fields.', price: 40, unit: 'kg', image: '/images/bringle.png', category: 'vegetable', stock: 150, rating: 4.3, reviews: 85 },
  { name: 'Fresh Tomatoes', description: 'Juicy red tomatoes grown with natural fertilizers.', price: 25, unit: 'kg', image: '/images/tomato.png', category: 'vegetable', stock: 300, rating: 4.6, reviews: 200, isFeatured: true },
  { name: 'Lady Finger', description: 'Tender okra freshly picked from our organic garden.', price: 35, unit: 'kg', image: '/images/finger.png', category: 'vegetable', stock: 100, rating: 4.2, reviews: 60 },
  { name: 'Mosambi (Sweet Lime)', description: 'Vitamin C rich sweet limes from our citrus groves.', price: 60, unit: 'kg', image: '/images/mosambi.png', category: 'fruit', stock: 120, rating: 4.7, reviews: 95, isFeatured: true },
  { name: 'Fresh Coconuts', description: 'Tender coconuts and dry coconuts from our coconut farm.', price: 45, unit: 'unit', image: '/images/coconut.png', category: 'fruit', stock: 200, rating: 4.8, reviews: 150, isFeatured: true },
  { name: 'Chiku (Sapodilla)', description: 'Sweet and delicious chiku fruits freshly plucked.', price: 50, unit: 'kg', image: '/images/chiku.png', category: 'fruit', stock: 80, rating: 4.4, reviews: 70 },
  { name: 'Alphonso Mango', description: 'Premium Alphonso mangoes — the king of fruits from our orchard.', price: 80, unit: 'kg', image: '/images/mango.png', category: 'fruit', stock: 60, rating: 4.9, reviews: 300, isFeatured: true },
]

async function seedProducts() {
  const count = await Product.countDocuments()
  if (count === 0) {
    await Product.insertMany(defaultProducts)
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    await seedProducts()

    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')

    const query: Record<string, unknown> = { isActive: true }
    if (featured === 'true') query.isFeatured = true
    if (category && category !== 'all') query.category = category

    const products = await Product.find(query).sort({ isFeatured: -1, createdAt: -1 })
    return NextResponse.json({ products })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const data = await req.json()
  const product = await Product.create(data)
  return NextResponse.json({ product }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { productId, ...data } = await req.json()
  const product = await Product.findByIdAndUpdate(productId, data, { new: true })
  return NextResponse.json({ product })
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { productId } = await req.json()
  await Product.findByIdAndUpdate(productId, { isActive: false })
  return NextResponse.json({ success: true })
}
