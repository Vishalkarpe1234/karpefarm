export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, password, phone } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone: phone || '',
      role: 'user',
    })

    const token = signToken({ userId: user._id.toString(), email: user.email, role: 'user' })

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
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
    console.error('[REGISTER ERROR]', err?.message || err)
    const msg = err?.message || 'Registration failed'
    if (msg.includes('MONGODB_URI') || msg.includes('connect') || msg.includes('ECONNREFUSED') || msg.includes('timed out') || msg.includes('authentication failed')) {
      return NextResponse.json({ error: 'Database connection failed. Please contact support.' }, { status: 503 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
