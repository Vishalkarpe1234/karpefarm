'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NatureBackground from '@/components/NatureBackground'
import { FiMail, FiPhone } from 'react-icons/fi'
import { GiWheat } from 'react-icons/gi'

const BADGE_LIST = ['🌾', '🌱', '💻', '🌿', '🌻', '🍀']
const COLOR_LIST = [
  'from-green-600 to-emerald-700',
  'from-teal-600 to-green-700',
  'from-emerald-600 to-teal-700',
  'from-lime-600 to-green-700',
  'from-cyan-600 to-teal-700',
  'from-green-700 to-lime-700',
]

const DEFAULT_TEAM = [
  { id: '1', name: 'Vinayak Vishwanath Karpe', role: 'Founder & Owner', title: 'Master Farmer — 30+ Years Experience', image: '/images/father.png', bio: 'With over 30 years of farming experience, Vinayak Karpe founded Karpe Farm with a vision to provide pure, organic produce to every household. His deep knowledge of the land and traditional farming practices forms the backbone of everything we do.', expertise: 'Crop Planning,Soil Management,Traditional Farming,Business Leadership' },
  { id: '2', name: 'Pravin Karpe', role: 'Operations Manager', title: 'BSc Agriculture', image: '/images/pravin.png', bio: 'Pravin brings scientific expertise and operational excellence to the farm. As a BSc Agriculture graduate, he bridges traditional farming knowledge with modern agricultural science to optimize yield and quality.', expertise: 'Farm Operations,Crop Science,Quality Control,Supply Chain' },
  { id: '3', name: 'Vishal Karpe', role: 'Marketing & Tech Lead', title: 'MSc Computer Science', image: '/images/vishal.png', bio: 'Vishal combines his technical background with a passion for agriculture to bring Karpe Farm into the digital age. He leads marketing initiatives and the development of online platforms to connect the farm directly with consumers.', expertise: 'Digital Marketing,Web Development,E-commerce,Brand Strategy' },
]

interface TeamMember { id: string; name: string; role: string; title: string; image: string; bio: string; expertise: string }

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM)

  useEffect(() => {
    fetch('/api/admin/content?section=team')
      .then(r => r.json())
      .then(data => {
        const members = data.content?.extraData?.members
        if (Array.isArray(members) && members.length > 0) setTeam(members)
      })
      .catch(() => {})
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <NatureBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16">
        <div className="h-56 sm:h-72 bg-gradient-to-br from-green-800 via-green-700 to-teal-700 relative overflow-hidden flex items-center">
          <div className="absolute inset-0 opacity-10 text-5xl select-none pointer-events-none overflow-hidden">
            {'🌱 🌿 🌾 '.repeat(20)}
          </div>
          <div className="relative max-w-7xl mx-auto px-4 w-full text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-green-300 text-sm font-semibold uppercase tracking-widest block mb-3">
                The People Behind the Farm
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">Our Team</h1>
              <p className="text-green-200 max-w-xl mx-auto">
                A passionate family growing your food with love, knowledge, and dedication
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => {
              const expertiseList = member.expertise.split(',').map(e => e.trim()).filter(Boolean)
              const badge = BADGE_LIST[i % BADGE_LIST.length]
              const color = COLOR_LIST[i % COLOR_LIST.length]
              return (
                <motion.div
                  key={member.id || member.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Top Gradient */}
                  <div className={`h-36 bg-gradient-to-br ${color} relative flex items-center justify-center`}>
                    <span className="text-5xl">{badge}</span>
                    <div className="absolute inset-0 opacity-10 text-3xl select-none overflow-hidden">
                      {'🌿 '.repeat(15)}
                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div className="flex justify-center -mt-16 relative z-10">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={112}
                        height={112}
                        className="object-cover object-top w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-6 pb-6 pt-3 text-center">
                    <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{member.name}</h2>
                    <p className="text-green-600 font-semibold text-sm mt-1">{member.role}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{member.title}</p>

                    <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-4">{member.bio}</p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-1.5 justify-center mb-5">
                      {expertiseList.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-2 justify-center">
                      <a
                        href="mailto:info@karpefarm.com"
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-full transition-colors border border-green-100"
                      >
                        <FiMail size={13} /> Email
                      </a>
                      <a
                        href="tel:+919637494175"
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-full transition-colors border border-gray-100"
                      >
                        <FiPhone size={13} /> Call
                      </a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Join Banner */}
      <section className="py-12 bg-gradient-to-r from-green-700 to-emerald-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GiWheat className="text-green-300 mx-auto mb-4" size={40} />
            <h2 className="text-2xl font-bold text-white mb-3">Grow With Us</h2>
            <p className="text-green-200 mb-6 text-sm">
              We are a small, passionate family. If you share our love for organic farming, we would love to connect.
            </p>
            <a
              href="mailto:info@karpefarm.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-700 font-bold rounded-full hover:bg-green-50 transition-all shadow-lg text-sm"
            >
              <FiMail size={16} /> Get In Touch
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
