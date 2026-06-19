export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Content from '@/lib/models/Content'
import { verifyToken } from '@/lib/auth'

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const section = searchParams.get('section')

  if (section) {
    const content = await Content.findOne({ section })
    return NextResponse.json({ content })
  }

  const contents = await Content.find()
  return NextResponse.json({ contents })
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { section, title, subtitle, description, image, extraData } = await req.json()

  const content = await Content.findOneAndUpdate(
    { section },
    { title, subtitle, description, image, extraData },
    { upsert: true, new: true }
  )
  return NextResponse.json({ content })
}
