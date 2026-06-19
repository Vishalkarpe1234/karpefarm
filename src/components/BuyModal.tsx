'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiX, FiShoppingBag, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'

interface Product {
  _id: string
  name: string
  price: number
  unit: string
  image: string
}

interface Props {
  product: Product | null
  onClose: () => void
  onSuccess: () => void
}

export default function BuyModal({ product, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({ buyerName: '', buyerPhone: '', buyerAddress: '', quantity: 1 })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    if (!form.buyerName || !form.buyerPhone || !form.buyerAddress) {
      toast.error('All fields are required')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/orders', {
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        quantity: form.quantity,
        buyerName: form.buyerName,
        buyerPhone: form.buyerPhone,
        buyerAddress: form.buyerAddress,
      })
      toast.success('Order placed successfully! Admin will contact you shortly.')
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to place order')
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
                <FiShoppingBag size={22} />
                <div>
                  <h3 className="font-bold text-lg">Place Order</h3>
                  <p className="text-green-200 text-sm">{product.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Product Summary */}
          <div className="px-5 py-3 bg-green-50 border-b border-green-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Unit Price:</span>
              <span className="font-bold text-green-700">₹{product.price}/{product.unit}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="font-bold text-green-700 text-lg">₹{product.price * form.quantity}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity ({product.unit})</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center">-</button>
                <span className="text-lg font-bold w-8 text-center">{form.quantity}</span>
                <button type="button" onClick={() => setForm(f => ({ ...f, quantity: f.quantity + 1 }))}
                  className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 font-bold text-green-700 flex items-center justify-center">+</button>
                <span className="text-sm text-gray-500">= ₹{product.price * form.quantity}</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiUser className="inline mr-1" size={13} /> Your Full Name
              </label>
              <input
                type="text"
                value={form.buyerName}
                onChange={(e) => setForm(f => ({ ...f, buyerName: e.target.value }))}
                placeholder="Enter your name"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiPhone className="inline mr-1" size={13} /> Mobile Number
              </label>
              <input
                type="tel"
                value={form.buyerPhone}
                onChange={(e) => setForm(f => ({ ...f, buyerPhone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FiMapPin className="inline mr-1" size={13} /> Delivery Address
              </label>
              <textarea
                value={form.buyerAddress}
                onChange={(e) => setForm(f => ({ ...f, buyerAddress: e.target.value }))}
                placeholder="Full address with pincode"
                required
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-sm btn-farm disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </span>
              ) : (
                `Confirm Order · ₹${product.price * form.quantity}`
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
