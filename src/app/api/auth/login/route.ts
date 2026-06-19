export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { signToken } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
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

    const headersList = headers()
    const userAgent = headersList.get('user-agent') || 'Unknown'

    user.loginActivity.push({ date: new Date(), device: userAgent.substring(0, 100) })
    if (user.loginActivity.length > 20) user.loginActivity = user.loginActivity.slice(-20)
    await user.save()

    const token = signToken({ userId: user._id.toString(), email: user.email, role: 'user' })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
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
    console.error('[LOGIN ERROR]', err?.message || err)
    const msg = err?.message || 'Login failed'
    if (msg.includes('MONGODB_URI') || msg.includes('connect') || msg.includes('ECONNREFUSED') || msg.includes('timed out') || msg.includes('authentication failed')) {
      return NextResponse.json({ error: 'Database connection failed. Please contact support.' }, { status: 503 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
