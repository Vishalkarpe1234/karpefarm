'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NatureBackground from '@/components/NatureBackground'
import { FiMapPin, FiPhone, FiMail, FiSend, FiLock } from 'react-icons/fi'
import { GiPlantSeed } from 'react-icons/gi'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ContactPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [form, setForm] = useState({ subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      await axios.get('/api/auth/me')
      setIsLoggedIn(true)
    } catch {
      setIsLoggedIn(false)
    }
    setChecking(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoggedIn) {
      toast.error('Please login first to send a message')
      return
    }
    if (!form.subject || !form.message) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/contact', form)
      toast.success('Message sent! We will get back to you soon.')
      setForm({ subject: '', message: '' })
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send message')
    }
    setLoading(false)
  }

  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Farm Location',
      lines: ['Karpe Patil House, Chandwad Road,', 'Niphad, Nashik, Maharashtra 422303'],
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: FiPhone,
      title: 'Phone',
      lines: ['+91 98765 43210', 'Mon-Sat: 6AM - 7PM'],
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: FiMail,
      title: 'Email',
      lines: ['info@karpefarm.com', 'karpevishal2712001@gmail.com'],
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <NatureBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16">
        <div className="h-56 sm:h-72 bg-gradient-to-br from-green-800 to-teal-700 flex items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {'📬 '.repeat(20)}
          </div>
          <div className="relative max-w-7xl mx-auto px-4 w-full text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-green-300 text-sm font-semibold uppercase tracking-widest block mb-2">
                Get In Touch
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">Contact Us</h1>
              <p className="text-green-200 max-w-lg mx-auto">
                We&apos;re here to help — reach out to us anytime
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-8 relative z-10">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-card p-6 border border-gray-100"
              >
                <div className={`w-12 h-12 ${info.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <info.icon className={info.color} size={22} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                {info.lines.map((line) => (
                  <p key={line} className="text-gray-500 text-sm">{line}</p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Form */}
      <section className="py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-card h-96 lg:h-auto border border-gray-200"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d711.0!2d74.8104737!3d19.6636559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc8789113ff4dd%3A0x41bd03d02a24e230!2sKarpe%20patil%20house!5e1!3m2!1sen!2sin!4v1718700000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 350 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Karpe Farm"
              />
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-card p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiSend className="text-green-600" size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Send a Message</h2>
                  <p className="text-gray-500 text-xs mt-0.5">We reply within 24 hours</p>
                </div>
              </div>

              {checking ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !isLoggedIn ? (
                <div className="text-center py-10">
                  <FiLock className="text-gray-300 mx-auto mb-4" size={48} />
                  <h3 className="text-lg font-bold text-gray-600 mb-2">Login Required</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Please register and login to contact us. It&apos;s free and takes only a minute!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/auth/login" className="px-5 py-2.5 border border-green-500 text-green-600 rounded-full text-sm font-semibold hover:bg-green-50 transition-colors">
                      Login
                    </Link>
                    <Link href="/auth/register" className="px-5 py-2.5 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-colors">
                      Register
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="How can we help you?"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us your query, order details, or feedback..."
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all btn-farm disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FiSend /> Send Message
                      </span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
