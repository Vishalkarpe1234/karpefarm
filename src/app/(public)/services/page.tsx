'use client'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NatureBackground from '@/components/NatureBackground'
import { GiPlantSeed, GiWateringCan, GiTreehouse, GiWheat, GiFarmTractor, GiSprout } from 'react-icons/gi'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import Link from 'next/link'

const services = [
  {
    icon: GiPlantSeed,
    title: 'Organic Farming',
    desc: 'We use only organic inputs and traditional methods combined with modern technology to produce chemical-free, nutritious crops.',
    features: ['No harmful pesticides', 'Natural compost', 'Soil health preservation', 'Biodiversity maintenance'],
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: GiWateringCan,
    title: 'Drip Irrigation',
    desc: 'Advanced drip irrigation systems for water conservation and optimal crop growth throughout the season.',
    features: ['70% water savings', 'Uniform water distribution', 'Fertigation support', 'Automation capability'],
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: GiTreehouse,
    title: 'Orchard Management',
    desc: 'Professional orchard care for coconut, mango, chiku, and citrus plantations with seasonal harvesting.',
    features: ['Pruning & shaping', 'Pest management', 'Harvest planning', 'Post-harvest care'],
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: GiFarmTractor,
    title: 'Contract Farming',
    desc: 'We partner with businesses and retailers to provide fresh produce on contract basis with guaranteed supply.',
    features: ['Guaranteed supply', 'Custom quantity', 'Regular delivery', 'Quality assurance'],
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: GiWheat,
    title: 'Crop Consultation',
    desc: 'Expert agricultural consultation for farmers looking to improve their yield and adopt sustainable practices.',
    features: ['Soil testing', 'Crop planning', 'Pest analysis', 'Marketing guidance'],
    color: 'from-teal-500 to-green-600',
    bg: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
  {
    icon: GiSprout,
    title: 'Seedling Supply',
    desc: 'Quality seedlings and saplings for vegetables, fruits, and ornamental plants from our nursery.',
    features: ['Disease-free saplings', 'High-yield varieties', 'Expert guidance', 'Seasonal availability'],
    color: 'from-lime-500 to-green-600',
    bg: 'bg-lime-50',
    iconColor: 'text-lime-700',
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <NatureBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16">
        <div className="h-64 sm:h-80 bg-gradient-to-br from-green-900 to-green-700 relative overflow-hidden flex items-center">
          <div className="absolute inset-0 opacity-10 text-8xl select-none">
            🌿🌾🌿🌾🌿🌾🌿🌾
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center w-full">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-green-300 text-sm font-semibold uppercase tracking-widest block mb-2">
                What We Offer
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Our Services</h1>
              <p className="text-green-200 max-w-xl mx-auto text-lg">
                Comprehensive agricultural services from farm to table
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl shadow-card hover:shadow-nature transition-all overflow-hidden border border-gray-100"
              >
                <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                <div className="p-6">
                  <div className={`w-14 h-14 ${service.bg} rounded-2xl flex items-center justify-center mb-4`}>
                    <service.icon className={service.iconColor} size={30} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.desc}</p>
                  <ul className="space-y-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <FiCheck className="text-green-500 shrink-0" size={14} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Interested in Our Services?</h2>
            <p className="text-gray-500 mb-8">
              Register and log in to get in touch with us about any of our services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register" className="btn-farm px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all shadow-sm">
                Get Started
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 border border-green-500 text-green-600 font-semibold rounded-full hover:bg-green-50 transition-all">
                Contact Us <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
