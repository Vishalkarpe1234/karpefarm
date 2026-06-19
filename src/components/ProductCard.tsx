'use client'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { GiPlantSeed } from 'react-icons/gi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

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

interface Props {
  product: Product
  isLoggedIn: boolean
  onLearnClick?: (product: Product) => void
  // legacy alias
  onBuyClick?: (product: Product) => void
}

export default function ProductCard({ product, isLoggedIn, onLearnClick, onBuyClick }: Props) {
  const router = useRouter()
  const handler = onLearnClick || onBuyClick

  function handleLearn() {
    if (!isLoggedIn) {
      toast.error('Please login to express your interest')
      router.push('/auth/login')
      return
    }
    if (handler) handler(product)
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
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {product.isFeatured && (
          <span className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full shadow">
            Featured
          </span>
        )}
        <motion.img
          src={product.image}
          alt={product.name}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full capitalize">
          {product.category}
        </span>
        <h3 className="font-bold text-gray-900 text-base mt-1.5 mb-1 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <FiStar
              key={i}
              size={12}
              className={i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>

        {/* Learn button — full width */}
        <button
          onClick={handleLearn}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GiPlantSeed size={16} />
          Learn to Grow It
        </button>
      </div>
    </motion.div>
  )
}
