'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  FiUser, FiPackage, FiShoppingCart, FiBell, FiSettings, FiLogOut,
  FiEdit, FiSave, FiX, FiCheck, FiTrash2, FiCamera, FiLock, FiHome,
} from 'react-icons/fi'
import { GiWheat, GiPlantSeed } from 'react-icons/gi'
import { format } from 'date-fns'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  profilePhoto?: string
  role: string
}

interface Order {
  _id: string
  productName: string
  productPrice: number
  quantity: number
  totalAmount: number
  buyerName: string
  buyerPhone: string
  buyerAddress: string
  status: string
  adminComment: string
  createdAt: string
}

interface CartItem {
  productId: { _id: string; name: string; price: number; image: string; unit: string }
  quantity: number
  addedAt: string
}

interface Notification {
  _id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-blue-100 text-blue-700 border-blue-200',
  coming_soon: 'bg-purple-100 text-purple-700 border-purple-200',
  out_of_stock: 'bg-orange-100 text-orange-700 border-orange-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cannot_deliver: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
}

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Pending',
  approved: '✅ Approved',
  coming_soon: '🚚 Coming Soon',
  out_of_stock: '⚠️ Out of Stock',
  delivered: '📦 Delivered',
  cannot_deliver: '❌ Cannot Deliver',
  cancelled: '🚫 Cancelled',
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'overview'
  const fileRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [editProfile, setEditProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', profilePhoto: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [activeTab, setActiveTab] = useState(tab)

  useEffect(() => {
    setActiveTab(tab)
  }, [tab])

  useEffect(() => {
    initDashboard()
  }, [])

  async function initDashboard() {
    try {
      const res = await axios.get('/api/auth/me')
      const u = res.data.user
      setUser(u)
      setProfileForm({ name: u.name, phone: u.phone || '', address: u.address || '', profilePhoto: u.profilePhoto || '' })
    } catch {
      router.push('/auth/login')
      return
    }
    setLoading(false)
    await Promise.all([fetchOrders(), fetchCart(), fetchNotifications()])
  }

  async function fetchOrders() {
    try {
      const res = await axios.get('/api/orders')
      setOrders(res.data.orders || [])
    } catch {}
  }

  async function fetchCart() {
    try {
      const res = await axios.get('/api/cart')
      setCart(res.data.cart || [])
    } catch {}
  }

  async function fetchNotifications() {
    try {
      const res = await axios.get('/api/notifications')
      setNotifications(res.data.notifications || [])
      setUnreadCount(res.data.unreadCount || 0)
    } catch {}
  }

  async function markNotifRead(id: string) {
    await axios.put('/api/notifications', { notificationId: id })
    fetchNotifications()
  }

  async function markAllRead() {
    await axios.put('/api/notifications', { notificationId: 'all' })
    fetchNotifications()
  }

  async function removeFromCart(productId: string) {
    try {
      await axios.delete('/api/cart', { data: { productId } })
      fetchCart()
      toast.success('Removed from cart')
    } catch {}
  }

  async function saveProfile() {
    setSavingProfile(true)
    try {
      await axios.put('/api/users/profile', profileForm)
      toast.success('Profile updated!')
      setEditProfile(false)
      initDashboard()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update profile')
    }
    setSavingProfile(false)
  }

  async function changePassword() {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSavingProfile(true)
    try {
      await axios.put('/api/users/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    }
    setSavingProfile(false)
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo must be under 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProfileForm(f => ({ ...f, profilePhoto: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  async function handleLogout() {
    await axios.post('/api/auth/logout')
    toast.success('Logged out')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <GiWheat className="text-green-400 mx-auto mb-4 animate-bounce" size={48} />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'orders', label: 'My Orders', icon: FiPackage, badge: orders.length },
    { id: 'cart', label: 'Cart', icon: FiShoppingCart, badge: cart.length },
    { id: 'notifications', label: 'Notifications', icon: FiBell, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: FiUser },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} className="w-14 h-14 rounded-full object-cover border-3 border-green-400 shadow-md" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hello, {user.name.split(' ')[0]}! 👋</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 text-sm font-medium transition-all"
          >
            <FiLogOut size={15} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id)
                    router.push(`/dashboard?tab=${t.id}`, { scroll: false })
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all border-b border-gray-50 last:border-0 ${
                    activeTab === t.id
                      ? 'bg-green-50 text-green-700 border-l-4 border-l-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <t.icon size={17} />
                  <span className="flex-1 text-left">{t.label}</span>
                  {t.badge !== undefined && t.badge > 0 && (
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-bold">
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Overview */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Total Orders', value: orders.length, icon: FiPackage, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Cart Items', value: cart.length, icon: FiShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
                      { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: FiCheck, color: 'text-green-600', bg: 'bg-green-50' },
                      { label: 'Notifications', value: unreadCount, icon: FiBell, color: 'text-red-600', bg: 'bg-red-50' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                          <stat.icon className={stat.color} size={20} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Recent Orders</h3>
                    {orders.slice(0, 3).length === 0 ? (
                      <div className="text-center py-8">
                        <GiPlantSeed className="text-gray-300 mx-auto mb-2" size={40} />
                        <p className="text-gray-400 text-sm">No orders yet. Start shopping!</p>
                        <Link href="/products" className="mt-3 inline-block text-green-600 text-sm font-medium hover:underline">Browse Products →</Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{order.productName}</p>
                              <p className="text-xs text-gray-500">Qty: {order.quantity} · ₹{order.totalAmount}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                              {STATUS_LABELS[order.status] || order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Orders */}
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="bg-white rounded-2xl shadow-card border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="font-bold text-gray-900 text-xl">My Orders</h2>
                      <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {orders.length === 0 ? (
                        <div className="text-center py-16">
                          <FiPackage className="mx-auto text-gray-300 mb-4" size={48} />
                          <p className="text-gray-400 font-medium">No orders yet</p>
                          <Link href="/products" className="mt-3 inline-block px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition-colors">
                            Shop Now
                          </Link>
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div key={order._id} className="p-5 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900">{order.productName}</h4>
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${STATUS_COLORS[order.status] || ''}`}>
                                    {STATUS_LABELS[order.status] || order.status}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500 space-y-0.5">
                                  <p>Quantity: {order.quantity} · Total: <span className="font-semibold text-gray-700">₹{order.totalAmount}</span></p>
                                  <p>Deliver to: {order.buyerAddress}</p>
                                  {order.adminComment && (
                                    <p className="mt-1 text-green-700 bg-green-50 px-2 py-1 rounded-lg text-xs">
                                      📝 Admin: {order.adminComment}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 shrink-0">
                                {format(new Date(order.createdAt), 'dd MMM yyyy')}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Cart */}
              {activeTab === 'cart' && (
                <motion.div key="cart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="bg-white rounded-2xl shadow-card border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="font-bold text-gray-900 text-xl">Shopping Cart</h2>
                      <p className="text-gray-500 text-sm mt-0.5">{cart.length} items</p>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {cart.length === 0 ? (
                        <div className="text-center py-16">
                          <FiShoppingCart className="mx-auto text-gray-300 mb-4" size={48} />
                          <p className="text-gray-400 font-medium">Your cart is empty</p>
                          <Link href="/products" className="mt-3 inline-block px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition-colors">
                            Browse Products
                          </Link>
                        </div>
                      ) : (
                        cart.map((item) => {
                          const product = item.productId
                          if (!product) return null
                          return (
                            <div key={product._id} className="p-4 flex items-center gap-4">
                              <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 relative border border-gray-100">
                                <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                                <p className="text-gray-500 text-xs">₹{product.price}/{product.unit}</p>
                                <p className="text-green-700 font-bold text-sm mt-1">Qty: {item.quantity} · ₹{product.price * item.quantity}</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(product._id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          )
                        })
                      )}
                    </div>
                    {cart.length > 0 && (
                      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-xl font-bold text-gray-900">
                            ₹{cart.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0)}
                          </p>
                        </div>
                        <Link href="/products" className="px-6 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-xl hover:bg-green-700 transition-colors">
                          Continue Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="bg-white rounded-2xl shadow-card border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h2 className="font-bold text-gray-900 text-xl">Notifications</h2>
                        <p className="text-gray-500 text-sm mt-0.5">{unreadCount} unread</p>
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-sm text-green-600 font-medium hover:underline">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="text-center py-16">
                          <FiBell className="mx-auto text-gray-300 mb-4" size={48} />
                          <p className="text-gray-400 font-medium">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => !notif.isRead && markNotifRead(notif._id)}
                            className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-green-50/50' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${!notif.isRead ? 'bg-green-600' : 'bg-gray-200'}`}>
                                <FiBell size={14} className={!notif.isRead ? 'text-white' : 'text-gray-400'} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{notif.title}</p>
                                <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{notif.message}</p>
                                <p className="text-gray-400 text-xs mt-1.5">{format(new Date(notif.createdAt), 'dd MMM yyyy, h:mm a')}</p>
                              </div>
                              {!notif.isRead && (
                                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1.5" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Profile */}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  {/* Profile Info */}
                  <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-bold text-gray-900 text-xl">Profile Settings</h2>
                      {!editProfile ? (
                        <button onClick={() => setEditProfile(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm text-green-600 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
                          <FiEdit size={14} /> Edit
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={saveProfile} disabled={savingProfile} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60">
                            <FiSave size={14} /> {savingProfile ? 'Saving...' : 'Save'}
                          </button>
                          <button onClick={() => { setEditProfile(false); setProfileForm({ name: user.name, phone: user.phone || '', address: user.address || '', profilePhoto: user.profilePhoto || '' }) }} className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <FiX size={14} /> Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Profile Photo */}
                    <div className="flex items-center gap-5 mb-6">
                      <div className="relative">
                        {profileForm.profilePhoto ? (
                          <img src={profileForm.profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover border-3 border-green-300" />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl font-bold border-3 border-green-300">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {editProfile && (
                          <button
                            onClick={() => fileRef.current?.click()}
                            className="absolute bottom-0 right-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-700 transition-colors"
                          >
                            <FiCamera size={12} />
                          </button>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        {editProfile && <p className="text-xs text-green-600 mt-1">Click camera to change photo</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))}
                          disabled={!editProfile}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input value={user.email} disabled className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                          disabled={!editProfile}
                          placeholder="Add phone number"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
                        <textarea
                          value={profileForm.address}
                          onChange={(e) => setProfileForm(f => ({ ...f, address: e.target.value }))}
                          disabled={!editProfile}
                          rows={2}
                          placeholder="Add your delivery address"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                        <FiLock className="text-orange-600" size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Change Password</h3>
                        <p className="text-gray-500 text-xs">Keep your account secure</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                          placeholder="Min 6 characters"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400"
                        />
                      </div>
                      <button
                        onClick={changePassword}
                        disabled={savingProfile}
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-60"
                      >
                        {savingProfile ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
