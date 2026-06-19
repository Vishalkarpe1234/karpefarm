'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NatureBackground from '@/components/NatureBackground'
import ProductCard from '@/components/ProductCard'
import BuyModal from '@/components/BuyModal'
import axios from 'axios'
import { GiWheat, GiPlantSeed } from 'react-icons/gi'
import { FiFilter, FiSearch } from 'react-icons/fi'

interface Product {
  id: string
  _id?: string
  name: string
  description: string
  price: number
  unit: string
  image: string
  category: string
  stock: number
  rating: number
  reviews: number
  isFeatured: boolean
}

const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'vegetable', label: 'Vegetables' },
  { value: 'fruit', label: 'Fruits' },
  { value: 'grain', label: 'Grains' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'spice', label: 'Spices' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [learnProduct, setLearnProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
    checkAuth()
  }, [])

  useEffect(() => {
    let result = products
    if (category !== 'all') result = result.filter((p) => p.category === category)
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [products, category, search])

  async function fetchProducts() {
    try {
      const res = await axios.get('/api/products')
      setProducts(res.data.products || [])
    } catch {}
    setLoading(false)
  }

  async function checkAuth() {
    try {
      await axios.get('/api/auth/me')
      setIsLoggedIn(true)
    } catch {}
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NatureBackground />
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-16">
        <div className="relative h-56 sm:h-72 bg-gradient-to-br from-green-800 to-green-600 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {['🥬', '🍅', '🥥', '🌽', '🥭', '🧅'].map((e, i) => (
              <span key={i} className="absolute text-5xl select-none"
                style={{ left: `${i * 16 + 2}%`, top: `${10 + (i % 3) * 25}%` }}>
                {e}
              </span>
            ))}
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 text-green-300 text-sm font-medium mb-2">
                <GiPlantSeed /> Fresh from Our Farm
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">Our Products</h1>
              <p className="text-green-200 max-w-lg mx-auto">
                Explore our range of fresh, organically grown produce
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white"
            />
          </div>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat.value
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products count */}
        <p className="text-gray-500 text-sm mt-4">{filtered.length} products found</p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-72 shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <GiWheat className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-400">No products found</h3>
            <p className="text-gray-400 mt-2">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLoggedIn={isLoggedIn}
                onLearnClick={setLearnProduct}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
      {learnProduct && (
        <BuyModal
          product={learnProduct}
          onClose={() => setLearnProduct(null)}
          onSuccess={() => {}}
        />
      )}
    </main>
  )
}
