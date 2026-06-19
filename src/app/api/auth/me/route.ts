export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload || !payload.userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()
    const user = await User.findById(payload.userId).select('-password -loginActivity')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
