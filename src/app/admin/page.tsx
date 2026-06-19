'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi'
import { GiWheat } from 'react-icons/gi'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import NatureBackground from '@/components/NatureBackground'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error('Please enter credentials')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/admin/login', form)
      toast.success('Welcome, Admin!')
      router.push('/admin/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid admin credentials')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <NatureBackground />

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 opacity-95" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-600 rounded-full filter blur-3xl opacity-5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl opacity-5 translate-x-1/2 translate-y-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-500/30 mx-auto mb-4 shadow-2xl">
            <Image src="/images/logo.png" alt="Karpe Farm" width={80} height={80} className="object-cover w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold text-white">Karpe Farm Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Administrative Access Only</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <FiShield className="text-green-400" size={20} />
            <h2 className="text-white font-bold text-lg">Admin Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all text-sm mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : 'Login to Admin Panel'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-700/50 text-center">
            <a href="/" className="text-gray-500 text-xs hover:text-gray-400 transition-colors">
              ← Back to website
            </a>
          </div>
        </div>

        <p className="text-gray-600 text-xs text-center mt-4">
          Unauthorized access is prohibited
        </p>
      </motion.div>
    </div>
  )
}
