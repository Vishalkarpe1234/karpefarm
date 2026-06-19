'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import axios from 'axios'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import {
  FiHome, FiUsers, FiPackage, FiShoppingBag, FiMessageSquare, FiSettings,
  FiLogOut, FiEdit, FiTrash2, FiCheck, FiX, FiSave, FiCamera, FiEye,
  FiLock, FiTrendingUp, FiAlertCircle, FiBell, FiMenu, FiChevronDown,
} from 'react-icons/fi'
import { GiWheat, GiPlantSeed } from 'react-icons/gi'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  isActive: boolean
  createdAt: string
  loginActivity: Array<{ date: string; device?: string }>
}

interface Order {
  _id: string
  userId: { name: string; email: string; phone?: string }
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

interface Product {
  _id: string
  name: string
  price: number
  unit: string
  image: string
  category: string
  stock: number
  isActive: boolean
  isFeatured: boolean
}

interface Contact {
  _id: string
  userName: string
  userEmail: string
  subject: string
  message: string
  status: string
  adminReply: string
  createdAt: string
}

const ORDER_STATUSES = [
  { value: 'pending', label: '⏳ Pending' },
  { value: 'approved', label: '✅ Approved' },
  { value: 'coming_soon', label: '🚚 Coming Soon' },
  { value: 'out_of_stock', label: '⚠️ Out of Stock' },
  { value: 'delivered', label: '📦 Delivered' },
  { value: 'cannot_deliver', label: '❌ Cannot Deliver' },
  { value: 'cancelled', label: '🚫 Cancelled' },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  coming_soon: 'bg-purple-100 text-purple-700',
  out_of_stock: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cannot_deliver: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
}

function AdminDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(tab)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  // Admin profile
  const [adminUsername, setAdminUsername] = useState('admin')
  const [editAdminProfile, setEditAdminProfile] = useState(false)
  const [adminPhoto, setAdminPhoto] = useState('')
  const [adminForm, setAdminForm] = useState({ newUsername: '', currentPassword: '', newPassword: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  // Edit states
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [orderComment, setOrderComment] = useState('')
  const [orderStatus, setOrderStatus] = useState('')

  // Content editing
  const [editContent, setEditContent] = useState<Record<string, string>>({
    homeTitle: 'Karpe Farm Agriculture',
    homeSubtitle: 'Bringing you the freshest organic produce',
    aboutText: 'A family farm rooted in tradition',
  })

  useEffect(() => {
    setActiveTab(tab)
  }, [tab])

  useEffect(() => {
    checkAdminAuth()
  }, [])

  async function checkAdminAuth() {
    try {
      await axios.get('/api/admin/profile')
    } catch {
      router.push('/admin')
      return
    }
    setLoading(false)
    loadAllData()
  }

  async function loadAllData() {
    await Promise.all([fetchUsers(), fetchOrders(), fetchProducts(), fetchContacts()])
  }

  async function fetchUsers() {
    try { const r = await axios.get('/api/admin/users'); setUsers(r.data.users || []) } catch {}
  }
  async function fetchOrders() {
    try { const r = await axios.get('/api/admin/orders'); setOrders(r.data.orders || []) } catch {}
  }
  async function fetchProducts() {
    try { const r = await axios.get('/api/products'); setProducts(r.data.products || []) } catch {}
  }
  async function fetchContacts() {
    try { const r = await axios.get('/api/contact'); setContacts(r.data.contacts || []) } catch {}
  }

  async function handleLogout() {
    await axios.post('/api/auth/logout')
    toast.success('Logged out')
    router.push('/admin')
  }

  async function deleteUser(userId: string) {
    if (!confirm('Delete this user permanently?')) return
    try {
      await axios.delete('/api/admin/users', { data: { userId } })
      toast.success('User deleted')
      fetchUsers()
    } catch { toast.error('Failed to delete user') }
  }

  async function toggleUserStatus(user: User) {
    try {
      await axios.put('/api/admin/users', { userId: user._id, name: user.name, email: user.email, isActive: !user.isActive })
      toast.success(user.isActive ? 'User deactivated' : 'User activated')
      fetchUsers()
    } catch { toast.error('Failed to update user') }
  }

  async function saveUserEdit() {
    if (!editUser) return
    try {
      await axios.put('/api/admin/users', { userId: editUser._id, name: editUser.name, email: editUser.email, phone: editUser.phone, isActive: editUser.isActive })
      toast.success('User updated')
      setEditUser(null)
      fetchUsers()
    } catch { toast.error('Failed to update user') }
  }

  async function updateOrderStatus(orderId: string) {
    try {
      await axios.put('/api/admin/orders', { orderId, status: orderStatus, adminComment: orderComment })
      toast.success('Order updated — notification sent to user')
      setEditOrder(null)
      fetchOrders()
    } catch { toast.error('Failed to update order') }
  }

  async function updateProduct() {
    if (!editProduct) return
    try {
      await axios.put('/api/products', { productId: editProduct._id, ...editProduct })
      toast.success('Product updated')
      setEditProduct(null)
      fetchProducts()
    } catch { toast.error('Failed to update product') }
  }

  async function deleteProduct(productId: string) {
    if (!confirm('Delete this product?')) return
    try {
      await axios.delete('/api/products', { data: { productId } })
      toast.success('Product removed')
      fetchProducts()
    } catch { toast.error('Failed to delete product') }
  }

  async function replyContact(contactId: string, reply: string) {
    try {
      await axios.put('/api/contact', { contactId, status: 'replied', adminReply: reply })
      toast.success('Reply sent')
      fetchContacts()
    } catch { toast.error('Failed to send reply') }
  }

  async function saveAdminProfile() {
    try {
      await axios.put('/api/admin/profile', adminForm)
      toast.success('Profile updated')
      setEditAdminProfile(false)
      if (adminForm.newUsername) setAdminUsername(adminForm.newUsername)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update profile')
    }
  }

  function handleAdminPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAdminPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <GiWheat className="text-green-400 mx-auto mb-4 animate-bounce" size={48} />
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: FiHome },
    { id: 'users', label: 'Users', icon: FiUsers, badge: users.length },
    { id: 'orders', label: 'Orders', icon: FiPackage, badge: orders.filter(o => o.status === 'pending').length },
    { id: 'products', label: 'Products', icon: FiShoppingBag, badge: products.length },
    { id: 'contacts', label: 'Messages', icon: FiMessageSquare, badge: contacts.filter(c => c.status === 'pending').length },
    { id: 'content', label: 'Content', icon: FiSettings },
    { id: 'profile', label: 'My Profile', icon: FiUsers },
  ]

  const setTab = (t: string) => {
    setActiveTab(t)
    router.push(`/admin/dashboard?tab=${t}`, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} transition-all duration-300 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 h-screen sticky top-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
            <Image src="/images/logo.png" alt="Admin" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-bold text-sm">Karpe Admin</p>
              <p className="text-green-400 text-xs">{adminUsername}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title={item.label}
            >
              <item.icon size={17} className="shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-950 hover:text-red-300 transition-all"
          >
            <FiLogOut size={17} className="shrink-0" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white p-1">
            <FiMenu size={20} />
          </button>
          <h1 className="text-white font-bold capitalize">{activeTab === 'overview' ? 'Dashboard Overview' : activeTab}</h1>
          <div className="ml-auto flex items-center gap-3">
            <button className="text-gray-400 hover:text-white p-2 relative">
              <FiBell size={18} />
              {orders.filter(o => o.status === 'pending').length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <div className="flex items-center gap-2">
              {adminPhoto ? (
                <img src={adminPhoto} alt="Admin" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
              )}
              {sidebarOpen && <span className="text-gray-300 text-sm">{adminUsername}</span>}
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Overview */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users', value: users.length, icon: FiUsers, color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-800/50' },
                    { label: 'Total Orders', value: orders.length, icon: FiPackage, color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-800/50' },
                    { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: FiAlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-800/50' },
                    { label: 'Revenue', value: `₹${orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0)}`, icon: FiTrendingUp, color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-800/50' },
                  ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-5`}>
                      <stat.icon className={`${stat.color} mb-3`} size={24} />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl">
                  <div className="p-5 border-b border-gray-800">
                    <h3 className="text-white font-bold">Recent Orders</h3>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{order.productName}</p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {order.buyerName} · ₹{order.totalAmount}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-700 text-gray-300'}`}>
                          {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                        </span>
                        <button onClick={() => { setEditOrder(order); setOrderStatus(order.status); setOrderComment(order.adminComment || ''); setTab('orders') }}
                          className="text-gray-400 hover:text-green-400 text-xs">Update</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl">
                  <div className="p-5 border-b border-gray-800">
                    <h3 className="text-white font-bold">Recent Users</h3>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {users.slice(0, 5).map((u) => (
                      <div key={u._id} className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center text-green-300 text-sm font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{u.name}</p>
                          <p className="text-gray-400 text-xs truncate">{u.email}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-gray-800">
                    <h2 className="text-white font-bold text-xl">User Management</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{users.length} registered users</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-800/50">
                          {['User', 'Email', 'Phone', 'Status', 'Joined', 'Last Login', 'Actions'].map(h => (
                            <th key={h} className="text-left text-gray-400 text-xs font-semibold px-4 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-gray-800/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-green-800 flex items-center justify-center text-green-300 text-xs font-bold">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-white text-sm font-medium">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{u.email}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{u.phone || '—'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                                {u.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{format(new Date(u.createdAt), 'dd MMM yy')}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">
                              {u.loginActivity?.[u.loginActivity.length - 1]
                                ? format(new Date(u.loginActivity[u.loginActivity.length - 1].date), 'dd MMM yy')
                                : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button onClick={() => setEditUser(u)} className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-900/30 rounded-lg">
                                  <FiEdit size={13} />
                                </button>
                                <button onClick={() => toggleUserStatus(u)} className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/30' : 'text-gray-400 hover:text-green-400 hover:bg-green-900/30'}`}>
                                  {u.isActive ? <FiX size={13} /> : <FiCheck size={13} />}
                                </button>
                                <button onClick={() => deleteUser(u._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg">
                                  <FiTrash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Edit User Modal */}
                {editUser && (
                  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                      <h3 className="text-white font-bold text-lg mb-5">Edit User</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-gray-400 text-sm block mb-1">Name</label>
                          <input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500" />
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm block mb-1">Email</label>
                          <input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500" />
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm block mb-1">Phone</label>
                          <input value={editUser.phone || ''} onChange={e => setEditUser({ ...editUser, phone: e.target.value })}
                            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500" />
                        </div>
                        <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                          <input type="checkbox" checked={editUser.isActive} onChange={e => setEditUser({ ...editUser, isActive: e.target.checked })}
                            className="w-4 h-4 accent-green-500" />
                          Active Account
                        </label>
                        <div className="flex gap-3 pt-2">
                          <button onClick={saveUserEdit} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-500 transition-colors">Save</button>
                          <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-colors">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-gray-800">
                    <h2 className="text-white font-bold text-xl">Order Management</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{orders.length} total · {orders.filter(o => o.status === 'pending').length} pending</p>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {orders.length === 0 ? (
                      <div className="text-center py-16">
                        <FiPackage className="text-gray-600 mx-auto mb-3" size={40} />
                        <p className="text-gray-500">No orders yet</p>
                      </div>
                    ) : orders.map((order) => (
                      <div key={order._id} className="p-5 hover:bg-gray-800/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <h4 className="text-white font-semibold">{order.productName}</h4>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-700 text-gray-300'}`}>
                                {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 space-y-1">
                              <p>👤 <span className="text-gray-300">{order.buyerName}</span> · 📞 {order.buyerPhone}</p>
                              <p>📍 {order.buyerAddress}</p>
                              <p>📦 Qty: {order.quantity} · 💰 ₹{order.totalAmount}</p>
                              {order.userId && <p>Account: {order.userId.email}</p>}
                              {order.adminComment && (
                                <p className="text-green-400 text-xs mt-1 bg-green-900/20 px-2 py-1 rounded-lg">
                                  Comment: {order.adminComment}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={() => { setEditOrder(order); setOrderStatus(order.status); setOrderComment(order.adminComment || '') }}
                              className="flex items-center gap-1.5 px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-xs font-medium rounded-xl transition-colors"
                            >
                              <FiEdit size={12} /> Update Status
                            </button>
                            <span className="text-gray-500 text-xs text-center">{format(new Date(order.createdAt), 'dd MMM yyyy')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Order Modal */}
                {editOrder && (
                  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                      <h3 className="text-white font-bold text-lg mb-2">Update Order</h3>
                      <p className="text-gray-400 text-sm mb-5">{editOrder.productName} · {editOrder.buyerName}</p>
                      <div className="space-y-4">
                        <div>
                          <label className="text-gray-400 text-sm block mb-2">Order Status</label>
                          <select
                            value={orderStatus}
                            onChange={e => setOrderStatus(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
                          >
                            {ORDER_STATUSES.map(s => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm block mb-2">Comment / Note to User</label>
                          <textarea
                            value={orderComment}
                            onChange={e => setOrderComment(e.target.value)}
                            rows={3}
                            placeholder="Optional message to be sent to user..."
                            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500 resize-none"
                          />
                        </div>
                        <div className="flex gap-3 pt-1">
                          <button onClick={() => updateOrderStatus(editOrder._id)} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-500 transition-colors">
                            Update & Notify User
                          </button>
                          <button onClick={() => setEditOrder(null)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-gray-800">
                    <h2 className="text-white font-bold text-xl">Product Management</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{products.length} products</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                    {products.map((product) => (
                      <div key={product._id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <div className="relative h-28 bg-gray-700 rounded-lg mb-3 overflow-hidden">
                          <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                          {product.isFeatured && (
                            <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-green-600 text-white text-[10px] rounded font-bold">Featured</span>
                          )}
                        </div>
                        <h4 className="text-white font-semibold text-sm mb-1">{product.name}</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-green-400 font-bold text-sm">₹{product.price}/{product.unit}</span>
                          <span className="text-gray-400 text-xs">Stock: {product.stock}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditProduct(product)} className="flex-1 py-1.5 bg-green-700 hover:bg-green-600 text-white text-xs rounded-lg font-medium transition-colors">
                            <FiEdit className="inline mr-1" size={11} /> Edit
                          </button>
                          <button onClick={() => deleteProduct(product._id)} className="flex-1 py-1.5 bg-red-900/50 hover:bg-red-800 text-red-400 text-xs rounded-lg transition-colors">
                            <FiTrash2 className="inline mr-1" size={11} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Product Modal */}
                {editProduct && (
                  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-screen">
                      <h3 className="text-white font-bold text-lg mb-5">Edit Product</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'name', label: 'Name', type: 'text' },
                          { key: 'price', label: 'Price (₹)', type: 'number' },
                          { key: 'unit', label: 'Unit', type: 'text' },
                          { key: 'stock', label: 'Stock', type: 'number' },
                        ].map(({ key, label, type }) => (
                          <div key={key}>
                            <label className="text-gray-400 text-sm block mb-1">{label}</label>
                            <input
                              type={type}
                              value={(editProduct as any)[key]}
                              onChange={e => setEditProduct({ ...editProduct, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
                            />
                          </div>
                        ))}
                        <div>
                          <label className="text-gray-400 text-sm block mb-1">Description</label>
                          <textarea
                            value={editProduct.name}
                            rows={2}
                            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500 resize-none"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                            <input type="checkbox" checked={editProduct.isFeatured} onChange={e => setEditProduct({ ...editProduct, isFeatured: e.target.checked })} className="accent-green-500" />
                            Featured
                          </label>
                          <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                            <input type="checkbox" checked={editProduct.isActive} onChange={e => setEditProduct({ ...editProduct, isActive: e.target.checked })} className="accent-green-500" />
                            Active
                          </label>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button onClick={updateProduct} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-500 transition-colors">Save</button>
                          <button onClick={() => setEditProduct(null)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-colors">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Messages/Contacts */}
            {activeTab === 'contacts' && (
              <motion.div key="contacts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-gray-800">
                    <h2 className="text-white font-bold text-xl">Contact Messages</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{contacts.filter(c => c.status === 'pending').length} pending replies</p>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {contacts.length === 0 ? (
                      <div className="text-center py-16">
                        <FiMessageSquare className="text-gray-600 mx-auto mb-3" size={40} />
                        <p className="text-gray-500">No messages yet</p>
                      </div>
                    ) : contacts.map((contact) => (
                      <ContactMessage key={contact._id} contact={contact} onReply={replyContact} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Content Management */}
            {activeTab === 'content' && (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-white font-bold text-xl mb-6">Content Management</h2>
                  <div className="space-y-5">
                    {[
                      { key: 'homeTitle', label: 'Home Page Title', type: 'text' },
                      { key: 'homeSubtitle', label: 'Home Page Subtitle', type: 'text' },
                      { key: 'aboutText', label: 'About Us Description', type: 'textarea' },
                    ].map(({ key, label, type }) => (
                      <div key={key}>
                        <label className="text-gray-400 text-sm block mb-2">{label}</label>
                        {type === 'textarea' ? (
                          <textarea
                            value={editContent[key]}
                            onChange={e => setEditContent(c => ({ ...c, [key]: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500 resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={editContent[key]}
                            onChange={e => setEditContent(c => ({ ...c, [key]: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
                          />
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => toast.success('Content saved! (Connect to admin/content API for persistence)')}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-colors"
                    >
                      <FiSave className="inline mr-2" size={14} />
                      Save Content
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Admin Profile */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg">
                  <h2 className="text-white font-bold text-xl mb-6">Admin Profile</h2>

                  {/* Photo */}
                  <div className="flex items-center gap-5 mb-8">
                    <div className="relative">
                      {adminPhoto ? (
                        <img src={adminPhoto} alt="Admin" className="w-20 h-20 rounded-full object-cover border-2 border-green-500" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center text-white text-3xl font-bold border-2 border-green-500">
                          A
                        </div>
                      )}
                      <button onClick={() => fileRef.current?.click()}
                        className="absolute bottom-0 right-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-500 transition-colors">
                        <FiCamera size={12} />
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAdminPhotoUpload} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{adminUsername}</p>
                      <p className="text-green-400 text-sm">Super Admin</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm block mb-1.5">New Username</label>
                      <input
                        type="text"
                        value={adminForm.newUsername}
                        onChange={e => setAdminForm(f => ({ ...f, newUsername: e.target.value }))}
                        placeholder="Enter new username"
                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1.5">Current Password</label>
                      <input
                        type="password"
                        value={adminForm.currentPassword}
                        onChange={e => setAdminForm(f => ({ ...f, currentPassword: e.target.value }))}
                        placeholder="Current password"
                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={adminForm.newPassword}
                        onChange={e => setAdminForm(f => ({ ...f, newPassword: e.target.value }))}
                        placeholder="New password"
                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <button onClick={saveAdminProfile} className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-colors">
                      <FiSave className="inline mr-2" size={14} />
                      Save Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function ContactMessage({ contact, onReply }: { contact: Contact; onReply: (id: string, reply: string) => void }) {
  const [showReply, setShowReply] = useState(false)
  const [reply, setReply] = useState(contact.adminReply || '')

  return (
    <div className="p-5 hover:bg-gray-800/20 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-semibold text-sm">{contact.userName}</span>
            <span className="text-gray-400 text-xs">{contact.userEmail}</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${contact.status === 'pending' ? 'bg-yellow-900 text-yellow-400' : contact.status === 'replied' ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
              {contact.status}
            </span>
          </div>
          <p className="text-gray-300 text-sm font-medium">{contact.subject}</p>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed">{contact.message}</p>
          {contact.adminReply && (
            <div className="mt-2 p-2 bg-green-900/20 border border-green-800/30 rounded-lg">
              <p className="text-green-400 text-xs font-medium mb-0.5">Your Reply:</p>
              <p className="text-gray-300 text-sm">{contact.adminReply}</p>
            </div>
          )}
        </div>
        <button onClick={() => setShowReply(!showReply)} className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-xs rounded-lg transition-colors shrink-0">
          {showReply ? 'Close' : 'Reply'}
        </button>
      </div>
      {showReply && (
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
          />
          <button
            onClick={() => { onReply(contact._id, reply); setShowReply(false) }}
            className="px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-xl hover:bg-green-500 transition-colors"
          >
            Send
          </button>
        </div>
      )}
    </div>
  )
}

interface Contact {
  _id: string
  userName: string
  userEmail: string
  subject: string
  message: string
  status: string
  adminReply: string
  createdAt: string
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  )
}
