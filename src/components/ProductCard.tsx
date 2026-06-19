'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiStar, FiShoppingBag } from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Product {
  _id: string
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

interface Props {
  product: Product
  isLoggedIn: boolean
  onBuyClick?: (product: Product) => void
}

export default function ProductCard({ product, isLoggedIn, onBuyClick }: Props) {
  const [addingCart, setAddingCart] = useState(false)
  const router = useRouter()

  async function addToCart() {
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart')
      router.push('/auth/login')
      return
    }
    setAddingCart(true)
    try {
      await axios.post('/api/cart', { productId: product._id, quantity: 1 })
      toast.success(`${product.name} added to cart!`)
    } catch {
      toast.error('Failed to add to cart')
    }
    setAddingCart(false)
  }

  function handleBuy() {
    if (!isLoggedIn) {
      toast.error('Please login to purchase')
      router.push('/auth/login')
      return
    }
    if (onBuyClick) onBuyClick(product)
  }

  const stars = Math.round(product.rating)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-card overflow-hidden group border border-gray-100 hover:border-green-200 hover:shadow-product transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-green-50 to-gray-50 overflow-hidden">
        {product.isFeatured && (
          <span className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full">
            Featured
          </span>
        )}
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          className="relative w-full h-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </motion.div>
        {product.stock < 20 && product.stock > 0 && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1">
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full capitalize">
            {product.category}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-base mt-1.5 mb-1 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <FiStar
              key={i}
              size={12}
              className={i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
            <span className="text-xs text-gray-500 ml-1">/{product.unit}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={addToCart}
            disabled={addingCart || product.stock === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-green-500 text-green-600 hover:bg-green-50 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart size={14} />
            {addingCart ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuy}
            disabled={product.stock === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <FiShoppingBag size={14} />
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  )
}
