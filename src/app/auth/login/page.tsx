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
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <NatureBackground />
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-200 shadow-lg mx-auto mb-4">
              <Image src="/images/logo.png" alt="Karpe Farm" width={80} height={80} className="object-cover w-full h-full" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back!</h1>
            <p className="text-gray-500 mt-1 text-sm">Login to your Karpe Farm account</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            {/* Decorative top accent */}
            <div className="h-1 w-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mb-8" />

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
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white"
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
                    className="w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white"
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
                className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-md shadow-green-200 disabled:opacity-60 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <GiWheat size={18} />
                    Login to Account
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-gray-500 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Register here
                </Link>
              </p>
              <Link href="/" className="text-gray-400 text-xs hover:text-gray-600 transition-colors inline-block">
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
