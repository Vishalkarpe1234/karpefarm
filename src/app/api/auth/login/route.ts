export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Account is deactivated. Contact admin.' }, { status: 403 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const activity = (user.loginActivity as any[]) || []
    activity.push({ date: new Date().toISOString(), device: 'web' })
    await prisma.user.update({
      where: { id: user.id },
      data: { loginActivity: activity.slice(-20) },
    })

    const token = signToken({ userId: user.id, email: user.email, role: 'user' })

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, profilePhoto: user.profilePhoto },
    })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })
    return response
  } catch (err: any) {
    console.error('[LOGIN ERROR]', err?.message)
    return NextResponse.json({ error: err?.message || 'Login failed' }, { status: 500 })
  }
}
