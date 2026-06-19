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
  { name: 'Fresh Onions', description: 'Organically grown red onions from our Kamalpur farm, packed fresh in jute bags. Rich in antioxidants and sulfur compounds that support immunity.', price: 30, unit: 'kg', image: '/photos/onion.jpeg', category: 'vegetable', stock: 200, rating: 4.5, reviews: 120, isFeatured: true },
  { name: 'Fresh Tomatoes', description: 'Juicy, firm tomatoes grown with natural compost on our farm. No harmful chemicals — just sun, soil, and care.', price: 25, unit: 'kg', image: '/photos/tomato.jpeg', category: 'vegetable', stock: 300, rating: 4.6, reviews: 200, isFeatured: true },
  { name: 'Mosambi (Sweet Lime)', description: 'Vitamin C-rich mosambi grown in our orchard at Kamalpur. Planted in 2022, these sweet limes are tender, juicy, and full of natural flavor.', price: 60, unit: 'kg', image: '/photos/m1.jpeg', category: 'fruit', stock: 120, rating: 4.7, reviews: 95, isFeatured: true },
  { name: 'Fresh Coconuts', description: 'Tender coconuts freshly harvested from our coconut grove. Planted in 2022 and now yielding fresh, nutritious coconuts full of natural water and pulp.', price: 45, unit: 'unit', image: '/photos/coco-2.jpeg', category: 'fruit', stock: 200, rating: 4.8, reviews: 150, isFeatured: true },
  { name: 'Alphonso Mango', description: 'Premium mangoes hand-picked from our orchard at peak ripeness. Sweet, aromatic, and bursting with flavor — from our farm directly to you.', price: 80, unit: 'kg', image: '/photos/mango.jpeg', category: 'fruit', stock: 60, rating: 4.9, reviews: 300, isFeatured: true },
  { name: 'Fresh Guava (Peru)', description: 'Farm-fresh guava picked at natural ripeness. Crunchy outside, soft inside — rich in Vitamin C and a favorite at our farm. Enjoyed fresh, straight from the tree.', price: 35, unit: 'kg', image: '/photos/eating goova.jpeg', category: 'fruit', stock: 100, rating: 4.6, reviews: 80, isFeatured: true },
  { name: 'Brinjal (Bringle)', description: 'Tender purple brinjals freshly harvested from our organic fields with natural compost.', price: 40, unit: 'kg', image: '/images/bringle.png', category: 'vegetable', stock: 150, rating: 4.3, reviews: 85 },
  { name: 'Lady Finger', description: 'Tender okra freshly picked from our organic garden. Best cooked fresh for maximum nutrition.', price: 35, unit: 'kg', image: '/images/finger.png', category: 'vegetable', stock: 100, rating: 4.2, reviews: 60 },
  { name: 'Chiku (Sapodilla)', description: 'Sweet and delicious chiku fruits freshly plucked from our orchard. Natural caramel-like flavor.', price: 50, unit: 'kg', image: '/images/chiku.png', category: 'fruit', stock: 80, rating: 4.4, reviews: 70 },
]

async function seedProducts() {
  const count = await Product.countDocuments()
  if (count === 0) {
    await Product.insertMany(defaultProducts)
    return
  }
  // Migrate old /images/ paths to /photos/ and update descriptions
  const migrations = [
    { name: 'Fresh Onions', image: '/photos/onion.jpeg', description: 'Organically grown red onions from our Kamalpur farm, packed fresh in jute bags. Rich in antioxidants and sulfur compounds that support immunity.', isFeatured: true },
    { name: 'Fresh Tomatoes', image: '/photos/tomato.jpeg', description: 'Juicy, firm tomatoes grown with natural compost on our farm. No harmful chemicals — just sun, soil, and care.', isFeatured: true },
    { name: 'Mosambi (Sweet Lime)', image: '/photos/m1.jpeg', description: 'Vitamin C-rich mosambi grown in our orchard at Kamalpur. Planted in 2022, these sweet limes are tender, juicy, and full of natural flavor.', isFeatured: true },
    { name: 'Fresh Coconuts', image: '/photos/coco-2.jpeg', description: 'Tender coconuts freshly harvested from our coconut grove. Planted in 2022 and now yielding fresh, nutritious coconuts full of natural water and pulp.', isFeatured: true },
    { name: 'Alphonso Mango', image: '/photos/mango.jpeg', description: 'Premium mangoes hand-picked from our orchard at peak ripeness. Sweet, aromatic, and bursting with flavor — from our farm directly to you.', isFeatured: true },
  ]
  for (const m of migrations) {
    await Product.updateOne({ name: m.name }, { $set: { image: m.image, description: m.description, isFeatured: m.isFeatured } })
  }
  // Add Guava if missing
  const guavaExists = await Product.findOne({ name: 'Fresh Guava (Peru)' })
  if (!guavaExists) {
    await Product.create({ name: 'Fresh Guava (Peru)', description: 'Farm-fresh guava picked at natural ripeness. Crunchy outside, soft inside — rich in Vitamin C and a favorite at our farm. Enjoyed fresh, straight from the tree.', price: 35, unit: 'kg', image: '/photos/eating goova.jpeg', category: 'fruit', stock: 100, rating: 4.6, reviews: 80, isFeatured: true, isActive: true })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    await seedProducts()

    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')

    const all = searchParams.get('all')
    const query: Record<string, unknown> = all === 'true' ? {} : { isActive: true }
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
