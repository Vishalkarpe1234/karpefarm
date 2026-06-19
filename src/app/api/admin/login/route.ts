export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
    }

    const token = signToken({ adminId: 'admin', role: 'admin' })

    const response = NextResponse.json({
      success: true,
      admin: { username: adminUsername, role: 'admin' },
    })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
