'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { GiWheat } from 'react-icons/gi'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import NatureBackground from '@/components/NatureBackground'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/auth/login', form)
      toast.success('Welcome back! 🌿')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NatureBackground />

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {['🌿', '🌾', '🍃', '🌱', '🌻', '🍀', '🌵', '🎋'].map((e, i) => (
            <motion.span
              key={i}
              className="absolute text-4xl select-none opacity-20"
              style={{ left: `${10 + i * 11}%`, top: `${10 + (i % 4) * 20}%` }}
              animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
            >
              {e}
            </motion.span>
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 mx-auto mb-6 shadow-2xl">
              <Image src="/images/logo.png" alt="Karpe Farm" width={96} height={96} className="object-cover w-full h-full" />
            </div>
            <h1 className="text-4xl font-extrabold mb-2">Karpe Farm</h1>
            <p className="text-green-300 text-lg mb-8">Agriculture & Organic Store</p>
            <div className="space-y-4 text-left max-w-xs mx-auto">
              {['Shop fresh organic produce', 'Track your orders in real-time', 'Get notified on delivery updates', 'Direct from farm to your table'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-400/30 flex items-center justify-center shrink-0">
                    <GiWheat size={12} />
                  </div>
                  <span className="text-sm text-green-100">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-400">
              <Image src="/images/logo.png" alt="Karpe Farm" width={48} height={48} className="object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Karpe Farm</h2>
              <p className="text-green-600 text-xs">Agriculture</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">Welcome Back!</h2>
              <p className="text-gray-500 mt-1">Login to access your farm store account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all btn-farm shadow-sm disabled:opacity-60 text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : 'Login to Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Register here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-gray-400 text-xs hover:text-gray-600 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
