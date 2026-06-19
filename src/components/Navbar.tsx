'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  FiShoppingCart, FiBell, FiLogOut, FiSettings, FiPackage, FiGrid,
} from 'react-icons/fi'
import { GiWheat } from 'react-icons/gi'

interface User {
  id: string
  name: string
  email: string
  role: string
  profilePhoto?: string
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [notifCount, setNotifCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkAuth()
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (user) {
      fetchCartCount()
      fetchNotifCount()
      const interval = setInterval(fetchNotifCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function checkAuth() {
    try {
      const res = await axios.get('/api/auth/me')
      setUser(res.data.user)
    } catch {
      setUser(null)
    }
  }

  async function fetchCartCount() {
    try {
      const res = await axios.get('/api/cart')
      setCartCount(res.data.cart?.length || 0)
    } catch {}
  }

  async function fetchNotifCount() {
    try {
      const res = await axios.get('/api/notifications')
      setNotifCount(res.data.unreadCount || 0)
    } catch {}
  }

  async function handleLogout() {
    await axios.post('/api/auth/logout')
    setUser(null)
    setCartCount(0)
    setNotifCount(0)
    toast.success('Logged out successfully')
    router.push('/')
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About Us' },
    { href: '/team', label: 'Team' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100'
          : 'bg-white/90 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-green-400 group-hover:border-green-600 transition-colors">
              <Image src="/images/logo.png" alt="Karpe Farm" fill style={{ objectFit: 'cover' }} />
            </div>
            <div>
              <span className="text-lg font-bold text-green-700 block leading-tight">Karpe Farm</span>
              <span className="text-xs text-green-500 leading-tight hidden sm:block">Agriculture</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-animated px-2.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Cart */}
                <Link href="/dashboard?tab=cart" className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all">
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>

                {/* Notifications */}
                <Link href="/dashboard?tab=notifications" className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all">
                  <FiBell size={20} />
                  {notifCount > 0 && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                      {notifCount > 9 ? '9+' : notifCount}
                    </motion.span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-green-50 transition-all"
                  >
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-green-400" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="p-3 bg-green-50 border-b border-green-100">
                          <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                            <FiGrid size={15} /> Dashboard
                          </Link>
                          <Link href="/dashboard?tab=orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                            <FiPackage size={15} /> My Orders
                          </Link>
                          <Link href="/dashboard?tab=profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                            <FiSettings size={15} /> Profile Settings
                          </Link>
                          <hr className="my-1 border-gray-100" />
                          <button onClick={() => { setUserMenuOpen(false); handleLogout() }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <FiLogOut size={15} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800 transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-full transition-all shadow-sm btn-farm">
                  Register
                </Link>
              </div>
            )}

            </div>
        </div>

        {/* Mobile horizontal scrollable nav — always visible */}
        <div className="md:hidden border-t border-gray-100 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center gap-1 px-2 py-2" style={{ width: 'max-content', minWidth: '100%' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                  isActive(link.href)
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 bg-gray-100 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link href="/auth/login" className="px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap text-green-700 border border-green-300 bg-white hover:bg-green-50 transition-all">
                  Login
                </Link>
                <Link href="/auth/register" className="px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap text-white bg-green-600 hover:bg-green-700 transition-all">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
