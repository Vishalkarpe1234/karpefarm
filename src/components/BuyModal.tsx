'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiX, FiMapPin, FiPhone, FiUser, FiMessageSquare } from 'react-icons/fi'
import { GiPlantSeed } from 'react-icons/gi'

interface Product {
  id: string
  _id?: string
  name: string
  price: number
  unit: string
  image: string
  category: string
}

interface Props {
  product: Product | null
  onClose: () => void
  onSuccess: () => void
}

export default function BuyModal({ product, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', location: '', message: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function prefillUser() {
      try {
        const res = await axios.get('/api/auth/me')
        const u = res.data.user
        setForm(f => ({ ...f, name: u.name || '', phone: u.phone || '' }))
      } catch {}
    }
    if (product) prefillUser()
  }, [product])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    if (!form.name || !form.phone || !form.location) {
      toast.error('Please fill in your name, phone, and location')
      return
    }
    setLoading(true)
    try {
      const productId = product.id || product._id
      await axios.post('/api/orders', {
        productId,
        productName: product.name,
        productPrice: 0,
        quantity: 1,
        buyerName: form.name,
        buyerPhone: form.phone,
        buyerAddress: form.location + (form.message ? ' | ' + form.message : ''),
      })
      toast.success('Request sent! We will contact you directly.')
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send request')
    }
    setLoading(false)
  }

  if (!product) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GiPlantSeed size={22} />
                <div>
                  <h3 className="font-bold text-lg">Learn to Grow</h3>
                  <p className="text-green-200 text-sm">{product.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Info banner */}
          <div className="px-5 py-3 bg-green-50 border-b border-green-100">
            <p className="text-sm text-green-800 leading-relaxed">
              Interested in growing <strong>{product.name}</strong>? Share your details —
              we'll reach out to you directly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiUser className="inline mr-1" size={13} /> Your Full Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Enter your name"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiPhone className="inline mr-1" size={13} /> Mobile Number *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiMapPin className="inline mr-1" size={13} /> Your Village / Location *
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Shrirampur, Maharashtra"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiMessageSquare className="inline mr-1" size={13} /> What do you want to learn? (optional)
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="e.g. How to grow, best season, soil type, how to contact..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send Request — We Will Contact You'
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
