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
  try {
    const { searchParams } = new URL(req.url)
    const section = searchParams.get('section')

    if (section) {
      const content = await prisma.content.findUnique({ where: { section } })
      return NextResponse.json({ content })
    }

    const contents = await prisma.content.findMany()
    return NextResponse.json({ contents })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { section, title, subtitle, description, image, extraData } = await req.json()

    const content = await prisma.content.upsert({
      where: { section },
      update: { title: title || '', subtitle: subtitle || '', description: description || '', image: image || '', extraData },
      create: { section, title: title || '', subtitle: subtitle || '', description: description || '', image: image || '', extraData },
    })
    return NextResponse.json({ content })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
