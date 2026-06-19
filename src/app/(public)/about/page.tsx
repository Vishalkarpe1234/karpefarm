'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NatureBackground from '@/components/NatureBackground'
import { GiWheat, GiPlantSeed, GiOakLeaf, GiFarmTractor } from 'react-icons/gi'
import { FiCheck, FiArrowRight, FiMapPin } from 'react-icons/fi'

const milestones = [
  { year: '2008', title: 'Farm Founded', desc: 'Vinayak Karpe established Karpe Farm on our land in Kamalpur, Shrirampur, Maharashtra.' },
  { year: '2012', title: 'Organic Certification', desc: 'Achieved full organic certification after 4 years of natural farming.' },
  { year: '2016', title: 'Expansion', desc: 'Expanded to 50+ acres, adding coconut and mango orchards.' },
  { year: '2020', title: 'Modern Irrigation', desc: 'Installed drip irrigation systems across the entire farm.' },
  { year: '2022', title: 'Coconut Plantation', desc: 'Planted hundreds of coconut trees, now bearing fruit and symbolising our growth.' },
  { year: '2025', title: 'Online Platform', desc: 'Launched Karpe Farm online platform for direct farm-to-consumer reach.' },
]

const values = [
  { icon: GiPlantSeed, title: 'Purity', desc: 'We never compromise on the quality or purity of our produce.' },
  { icon: GiOakLeaf, title: 'Sustainability', desc: 'Every practice we follow is designed to protect our environment.' },
  { icon: GiFarmTractor, title: 'Innovation', desc: 'We combine traditional wisdom with modern farming technology.' },
  { icon: GiWheat, title: 'Community', desc: 'We support local farmers and contribute to our community.' },
]

const galleryPhotos = [
  { src: '/photos/coco-1.jpeg', label: 'Coconut Planting 2022' },
  { src: '/photos/front view cocnut.jpeg', label: 'Farm Front View 2020' },
  { src: '/photos/mango.jpeg', label: 'Mango Harvest' },
  { src: '/photos/m1.jpeg', label: 'Mosambi Orchard' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <NatureBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16">
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <Image src="/images/farm-bg.jpg" alt="About Karpe Farm" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 to-gray-900/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-green-300 text-sm font-semibold uppercase tracking-widest block mb-2">Who We Are</span>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4">About Us</h1>
              <p className="text-gray-300 max-w-xl mx-auto text-lg">
                A family farm rooted in tradition, growing with purpose
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Farm photo gallery collage */}
              <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl">
                <img src="/photos/tractor - coconuts view.jpeg" alt="Karpe Farm" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 grid grid-cols-2 gap-2">
                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-white">
                  <img src="/photos/coco-2.jpeg" alt="Coconut" className="w-full h-full object-cover" />
                </div>
                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-white">
                  <img src="/photos/m1.jpeg" alt="Mosambi" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4">
                <div className="text-3xl font-extrabold text-green-600">15+</div>
                <div className="text-xs text-gray-600 mt-0.5">Years of farming</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
                From a Small Plot to <span className="text-green-600">50+ Acres</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Karpe Farm Agriculture was born from a simple dream — to grow the purest, most nutritious food
                using methods that respect the land. Founded by Vinayak Vishwanath Karpe in 2008 in the heart
                of Kamalpur, Shrirampur, Maharashtra, our farm began on just 10 acres.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Over 15 years, guided by patience and dedication, we expanded to over 50 acres,
                cultivating vegetables, fruits, and specialty crops using 100% organic practices.
                Our farm follows traditional farming methods enhanced with modern drip irrigation
                and soil management technology.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Today, Karpe Farm serves hundreds of families across Maharashtra,
                delivering farm-fresh produce that is as pure as nature intended.
              </p>

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

      {/* Photo Gallery strip */}
      <section className="py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryPhotos.map((p) => (
              <motion.div
                key={p.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.04 }}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <img src={p.src} alt={p.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{p.label}</p>
              </motion.div>
            ))}
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
