'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NatureBackground from '@/components/NatureBackground'
import { GiWheat, GiPlantSeed, GiOakLeaf, GiFarmTractor } from 'react-icons/gi'
import { FiCheck, FiArrowRight, FiMapPin } from 'react-icons/fi'

const milestones = [
  { year: '1999', title: 'Farm Founded', desc: 'Vinayak Karpe established Karpe Farm on our family land in Kamalpur, Shrirampur, Maharashtra.' },
  { year: '2012', title: 'Organic Certification', desc: 'Achieved full organic certification after 4 years of natural farming practices.' },
  { year: '2016', title: 'Expansion', desc: 'Added coconut and mango orchards, growing the farm to a thriving multi-crop operation.' },
  { year: '2020', title: 'Modern Irrigation', desc: 'Installed drip irrigation systems across the farm — saving water, improving yield.' },
  { year: '2022', title: 'Coconut Plantation', desc: 'Planted hundreds of coconut trees that now stand tall and bear fruit across our farm.' },
  { year: '2025', title: 'Online Platform', desc: 'Launched Karpe Farm online for direct farm-to-consumer reach across Maharashtra.' },
]

const values = [
  { icon: GiPlantSeed, title: 'Purity', desc: 'We never compromise on the quality or purity of our produce.' },
  { icon: GiOakLeaf, title: 'Sustainability', desc: 'Every practice we follow is designed to protect our environment.' },
  { icon: GiFarmTractor, title: 'Innovation', desc: 'We combine traditional wisdom with modern farming technology.' },
  { icon: GiWheat, title: 'Community', desc: 'We support local farmers and contribute to our community.' },
]

interface ContentData {
  title?: string
  description?: string
  extraData?: {
    story?: string
    images?: Array<{ url: string; caption: string }>
  }
}

export default function AboutPage() {
  const [content, setContent] = useState<ContentData | null>(null)

  useEffect(() => {
    fetch('/api/admin/content?section=about')
      .then(r => r.json())
      .then(data => { if (data.content) setContent(data.content) })
      .catch(() => {})
  }, [])

  const displayTitle = content?.title || 'A Legacy of Organic Farming'
  const displayDescription = content?.description || 'Karpe Farm Agriculture was born from a simple dream — to grow the purest, most nutritious food using methods that respect the land.'
  const displayStory = content?.extraData?.story || ''
  const adminImages = content?.extraData?.images || []

  return (
    <main className="min-h-screen bg-gray-50">
      <NatureBackground />
      <Navbar />

      {/* Hero — front view of coconut trees 2020 */}
      <section className="relative pt-16">
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <img src="/photos/front view cocnut.jpeg" alt="Karpe Farm Front View 2020" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-gray-900/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-green-300 text-sm font-semibold uppercase tracking-widest block mb-2">Who We Are</span>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-3">About Us</h1>
              <p className="text-green-200 max-w-lg mx-auto">
                A family farm rooted in tradition, growing with purpose — Karpe Farm, Kamalpur
              </p>
              <p className="text-gray-400 text-xs mt-2">Front view of our farm — Photo 2020</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* LEFT: Photo collage */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* m1 — mosambi orchard */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl group" style={{ height: '300px' }}>
                <img src="/photos/m1.jpeg" alt="Mosambi Orchard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs text-green-300 font-semibold uppercase tracking-wider">Mosambi Orchard</span>
                  <p className="text-white font-bold">Planted 2022 · Photo 2024</p>
                  <p className="text-gray-300 text-xs">Sweet lime trees in full bloom at Karpe Farm, Kamalpur</p>
                </div>
              </div>
              {/* Two side-by-side photos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ height: '180px' }}>
                  <img src="/photos/coco-1.jpeg" alt="Coconut Planting 2022" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-xs font-bold">Coconut Plantation</p>
                    <p className="text-gray-300 text-[10px]">Planted 2022</p>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ height: '180px' }}>
                  <img src="/photos/coco-2.jpeg" alt="Coconut Trees" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-xs font-bold">Coconut Grove</p>
                    <p className="text-gray-300 text-[10px]">Thriving today</p>
                  </div>
                </div>
              </div>
              {/* Admin-uploaded images */}
              {adminImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {adminImages.map((img, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden shadow-md" style={{ height: '150px' }}>
                      <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                          <p className="text-white text-xs font-medium">{img.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* RIGHT: Story text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:pt-4"
            >
              <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
                {displayTitle.includes('Legacy') ? (
                  <>A Legacy of <span className="text-green-600">Organic Farming</span></>
                ) : displayTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">{displayDescription}</p>

              {displayStory ? (
                <p className="text-gray-600 leading-relaxed mb-4">{displayStory}</p>
              ) : (
                <>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Founded by Vinayak Vishwanath Karpe in 1999 in the heart of Kamalpur, Shrirampur, Maharashtra.
                    Our farm grows the finest vegetables, fruits, and specialty crops using 100% organic practices
                    with traditional farming methods enhanced by modern drip irrigation and soil management technology.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Today, Karpe Farm serves hundreds of families across Maharashtra,
                    delivering farm-fresh produce that is as pure as nature intended.
                    Every fruit and vegetable tells the story of our land, our labor, and our love.
                  </p>
                </>
              )}

              <div className="flex flex-wrap gap-3 mb-6">
                {['Certified Organic', 'Farm to Consumer', 'No Chemicals', 'Water-Efficient Irrigation'].map((point) => (
                  <div key={point} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                    <FiCheck className="text-green-500 shrink-0" size={13} />
                    <span className="text-gray-700 text-sm font-medium">{point}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl mb-6">
                <FiMapPin className="text-green-600 shrink-0 mt-0.5" size={16} />
                <span className="text-sm text-gray-700">
                  Karpe Farm House, Malwadgoan Road, Kamalpur, Takalibhan, Shrirampur 413725, Maharashtra, India
                </span>
              </div>

              <Link href="/products" className="btn-farm inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all shadow-sm">
                Shop Our Produce <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-nature">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="text-gray-500 mt-2">Principles that guide everything we do</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl text-center shadow-card hover:shadow-nature transition-all"
              >
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float"
                  style={{ animationDelay: `${i * 0.3}s` }}>
                  <v.icon className="text-green-600" size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
            <p className="text-gray-500 mt-2">Milestones that shaped Karpe Farm</p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-green-100" />
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center mb-10`}
              >
                <div className="w-1/2 px-6">
                  <div className={`bg-white border border-green-100 rounded-xl p-5 shadow-card ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <span className="text-green-600 font-bold text-lg">{m.year}</span>
                    <h4 className="font-bold text-gray-900 mt-1">{m.title}</h4>
                    <p className="text-gray-500 text-sm mt-1">{m.desc}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-glow z-10">
                  <GiPlantSeed className="text-white" size={18} />
                </div>
                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
