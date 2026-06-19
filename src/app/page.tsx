'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NatureBackground from '@/components/NatureBackground'
import ProductCard from '@/components/ProductCard'
import BuyModal from '@/components/BuyModal'
import axios from 'axios'
import {
  FiArrowRight, FiCheck, FiStar, FiTruck, FiShield, FiPhone,
} from 'react-icons/fi'
import { GiWheat, GiPlantSeed, GiTreehouse, GiSunflower, GiWateringCan, GiOakLeaf } from 'react-icons/gi'

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [buyProduct, setBuyProduct] = useState<Product | null>(null)
  const [videoError, setVideoError] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])

  useEffect(() => {
    fetchProducts()
    checkAuth()
  }, [])

  async function fetchProducts() {
    try {
      const res = await axios.get('/api/products?featured=true')
      setProducts(res.data.products?.slice(0, 8) || [])
    } catch {}
  }

  async function checkAuth() {
    try {
      await axios.get('/api/auth/me')
      setIsLoggedIn(true)
    } catch {
      setIsLoggedIn(false)
    }
  }

  const features = [
    { icon: GiPlantSeed, title: '100% Organic', desc: 'All produce grown without harmful pesticides or chemicals', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: GiWateringCan, title: 'Eco-Friendly', desc: 'Sustainable water and soil conservation practices', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: FiTruck, title: 'Farm to Table', desc: 'Fresh produce delivered directly from our farm', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: FiShield, title: 'Quality Assured', desc: 'Every product quality-checked before delivery', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: GiTreehouse, title: 'Modern Farming', desc: 'Advanced agricultural techniques for better yield', color: 'text-teal-600', bg: 'bg-teal-50' },
    { icon: GiSunflower, title: 'Seasonal Fresh', desc: 'Seasonal produce at its peak nutritional value', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ]

  const stats = [
    { value: '15+', label: 'Years of Farming', icon: GiOakLeaf },
    { value: '500+', label: 'Happy Customers', icon: FiStar },
    { value: '50+', label: 'Acres Cultivated', icon: GiWheat },
    { value: '100%', label: 'Organic Certified', icon: GiPlantSeed },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <NatureBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-105">
          {!videoError ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover"
            >
              <source src="/videos/corn.mp4" type="video/mp4" />
              <source src="/videos/coconut.mp4" type="video/mp4" />
            </video>
          ) : (
            <Image
              src="/images/farm-hero.jpg"
              alt="Karpe Farm"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="hero-overlay absolute inset-0" />
        </motion.div>

        {/* Floating nature elements */}
        <div className="absolute inset-0 pointer-events-none">
          {['🌿', '🌾', '🍃', '🌱', '🌻'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl select-none"
              style={{ left: `${10 + i * 18}%`, top: `${20 + (i % 3) * 15}%` }}
              animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-300 text-sm font-medium rounded-full mb-6">
                  <GiWheat size={16} />
                  100% Organic & Fresh
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
              >
                Karpe Farm
                <span className="block text-gradient-green bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                  Agriculture
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
              >
                Bringing you the freshest organic produce from Takalibhan, Shrirampur, Maharashtra.
                Grown with love, harvested with care — from our soil to your table.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/products"
                  className="btn-farm inline-flex items-center gap-2 px-8 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-base transition-all shadow-lg shadow-green-900/30 animate-pulse-green"
                >
                  <GiPlantSeed size={20} />
                  Shop Fresh Produce
                  <FiArrowRight />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-full text-base transition-all border border-white/30"
                >
                  Learn About Us
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs flex flex-col items-center gap-1"
        >
          <span>Scroll</span>
          <div className="w-0.5 h-8 bg-white/40 rounded-full" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4"
              >
                <stat.icon className="text-green-500 mx-auto mb-2" size={28} />
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-nature">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Why Karpe Farm?</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Growing with Nature, <span className="text-green-600">Caring for You</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We practice sustainable, eco-friendly farming that benefits both you and the environment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-2xl shadow-card hover:shadow-nature transition-all border border-white/50"
              >
                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-4 animate-float`}
                  style={{ animationDelay: `${i * 0.3}s` }}>
                  <f.icon className={f.color} size={28} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
          >
            <div>
              <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Fresh Picks</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">Featured Products</h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors">
              View All Products <FiArrowRight />
            </Link>
          </motion.div>

          {products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-72 shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isLoggedIn={isLoggedIn}
                  onBuyClick={setBuyProduct}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Farm Videos Section */}
      <section className="py-20 bg-earth">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Farm Life</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">From Our Farm</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Watch how we grow your food with love and care</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { src: '/videos/corn.mp4', title: 'Our Corn Fields', desc: 'Fresh corn grown in our fertile Maharashtra soil' },
              { src: '/videos/coconut.mp4', title: 'Coconut Harvest', desc: 'Tender coconuts freshly harvested from our groves' },
            ].map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-xl group"
              >
                <div className="relative aspect-video bg-gray-900">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="font-bold text-lg">{video.title}</h3>
                    <p className="text-gray-300 text-sm mt-1">{video.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Nature illustration instead of machinery image */}
              <div className="relative rounded-3xl overflow-hidden aspect-square max-w-lg bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex items-center justify-center shadow-xl">
                <div className="absolute inset-0 opacity-20 text-6xl select-none pointer-events-none flex flex-wrap content-start p-4 gap-2 overflow-hidden">
                  {'🌿🌾🍃🌱🌻🍀🥬🥭🧅🥥🍋🌽'.split('').map((e, i) => (
                    <span key={i}>{e}</span>
                  ))}
                </div>
                <div className="relative z-10 text-center p-8">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl mx-auto mb-4">
                    <Image src="/images/logo.png" alt="Karpe Farm" width={160} height={160} className="object-cover w-full h-full" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                    <p className="text-green-800 font-bold text-xl">Karpe Farm</p>
                    <p className="text-green-600 text-sm">Kamalpur, Shrirampur</p>
                    <p className="text-gray-500 text-xs mt-1">Maharashtra, India 413725</p>
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
              >
                <GiWheat className="text-green-600" size={36} />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
                A Legacy of <span className="text-green-600">Organic Farming</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Karpe Farm Agriculture has been nurturing the land in Takalibhan, Shrirampur, Maharashtra for over 15 years.
                Founded by Vinayak Vishwanath Karpe, our farm spans 50+ acres of fertile land where we grow the finest
                vegetables, fruits, and organic produce.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Located in the heart of Kamalpur on Malwadgoan Road, our farm blends traditional farming wisdom with
                modern agricultural techniques to bring you produce that is not just fresh, but alive with
                nutrients and flavor.
              </p>
              <div className="space-y-3 mb-8">
                {['Certified organic farming practices', 'Direct farm-to-consumer model', 'Zero harmful pesticides or chemicals', 'Water-efficient irrigation systems'].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <FiCheck className="text-green-600" size={12} />
                    </div>
                    <span className="text-gray-700 text-sm">{point}</span>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn-farm inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all shadow-sm">
                Learn Our Story <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-800 via-green-700 to-green-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {['🌾', '🌿', '🍃', '🌱', '🌻', '🍀'].map((e, i) => (
            <span
              key={i}
              className="absolute text-3xl opacity-10 select-none"
              style={{ left: `${i * 17}%`, top: `${20 + (i % 3) * 25}%` }}
            >
              {e}
            </span>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GiSunflower className="text-yellow-400 mx-auto mb-6 animate-spin-slow" size={48} />
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Ready to Eat <span className="text-green-300">Healthy?</span>
            </h2>
            <p className="text-green-200 text-lg mb-8 max-w-xl mx-auto">
              Register now and get access to fresh organic produce delivered straight from our farm.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register" className="btn-farm px-8 py-3.5 bg-white text-green-700 font-bold rounded-full hover:bg-green-50 transition-all shadow-lg">
                Register Now — It's Free
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                <FiPhone size={18} />
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Buy Modal */}
      {buyProduct && (
        <BuyModal
          product={buyProduct}
          onClose={() => setBuyProduct(null)}
          onSuccess={() => setBuyProduct(null)}
        />
      )}
    </main>
  )
}
