'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NatureBackground from '@/components/NatureBackground'
import { FiLinkedin, FiMail } from 'react-icons/fi'
import { GiWheat } from 'react-icons/gi'

const team = [
  {
    name: 'Vinayak Karpe',
    role: 'Founder & Owner',
    title: 'Master Farmer',
    image: '/images/father.png',
    bio: 'With over 30 years of farming experience, Vinayak Karpe founded Karpe Farm with a vision to provide pure, organic produce to every household. His deep knowledge of the land and traditional farming practices forms the backbone of everything we do.',
    expertise: ['Crop Planning', 'Soil Management', 'Traditional Farming', 'Business Leadership'],
  },
  {
    name: 'Pravin Karpe',
    role: 'Operations Manager',
    title: 'BSc Agriculture',
    image: '/images/pravin.png',
    bio: 'Pravin brings scientific expertise and operational excellence to the farm. As a BSc Agriculture graduate, he bridges traditional farming knowledge with modern agricultural science to optimize yield and quality.',
    expertise: ['Farm Operations', 'Crop Science', 'Quality Control', 'Supply Chain'],
  },
  {
    name: 'Vishal Karpe',
    role: 'Marketing & Tech Lead',
    title: 'MSc Computer Science',
    image: '/images/vishal.png',
    bio: 'Vishal combines his technical background with a passion for agriculture to bring Karpe Farm into the digital age. He leads marketing initiatives and the development of online platforms to connect the farm directly with consumers.',
    expertise: ['Digital Marketing', 'Web Development', 'E-commerce', 'Brand Strategy'],
  },
]

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <NatureBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16">
        <div className="h-64 sm:h-80 bg-gradient-to-br from-green-800 via-green-700 to-teal-700 relative overflow-hidden flex items-center">
          <div className="absolute inset-0 opacity-10 text-6xl select-none pointer-events-none">
            {'🌱 '.repeat(30)}
          </div>
          <div className="relative max-w-7xl mx-auto px-4 w-full text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-green-300 text-sm font-semibold uppercase tracking-widest block mb-2">
                The People Behind
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4">Our Team</h1>
              <p className="text-green-200 max-w-xl mx-auto text-lg">
                Meet the passionate people growing your food with love
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-16">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Image */}
                <div className={`flex justify-center ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative">
                    <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-4 border-green-200 shadow-xl">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    {/* Decorative */}
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-md animate-float"
                      style={{ animationDelay: `${i * 0.5}s` }}>
                      <GiWheat className="text-green-600" size={32} />
                    </div>
                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold text-center leading-tight">{member.role.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">{member.title}</span>
                  <h2 className="text-3xl font-extrabold text-gray-900 mt-1 mb-1">{member.name}</h2>
                  <p className="text-green-700 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{member.bio}</p>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Areas of Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors">
                      <FiLinkedin className="text-blue-700" size={16} />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors">
                      <FiMail className="text-green-700" size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Banner */}
      <section className="py-16 bg-green-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GiWheat className="text-green-500 mx-auto mb-4 animate-bounce-gentle" size={48} />
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Grow With Us</h2>
            <p className="text-gray-500 mb-6">
              We are a small, passionate family. If you share our love for organic farming and sustainable agriculture, we would love to connect.
            </p>
            <a href="mailto:info@karpefarm.com" className="btn-farm inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all shadow-sm">
              <FiMail /> Get In Touch
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
