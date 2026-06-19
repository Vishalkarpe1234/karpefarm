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
  FiLogOut, FiEdit, FiTrash2, FiCheck, FiX, FiSave, FiCamera, FiPlus,
  FiLock, FiTrendingUp, FiAlertCircle, FiBell, FiMenu,
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
  description: string
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

interface ServiceItem {
  id: string
  title: string
  description: string
  features: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  title: string
  bio: string
  expertise: string
  image: string
}

interface ContactInfo {
  owner: string
  address: string
  phone1: string
  phone2: string
  email: string
  hoursWeekday: string
  hoursSunday: string
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: '1', title: 'Organic Farming', description: 'We use only organic inputs and traditional methods combined with modern technology to produce chemical-free, nutritious crops.', features: 'No harmful pesticides,Natural compost,Soil health preservation,Biodiversity maintenance' },
  { id: '2', title: 'Drip Irrigation', description: 'Advanced drip irrigation systems for water conservation and optimal crop growth throughout the season.', features: '70% water savings,Uniform water distribution,Fertigation support,Automation capability' },
  { id: '3', title: 'Orchard Management', description: 'Professional orchard care for coconut, mango, chiku, and citrus plantations with seasonal harvesting.', features: 'Pruning & shaping,Pest management,Harvest planning,Post-harvest care' },
  { id: '4', title: 'Contract Farming', description: 'We partner with businesses and retailers to provide fresh produce on contract basis with guaranteed supply.', features: 'Guaranteed supply,Custom quantity,Regular delivery,Quality assurance' },
  { id: '5', title: 'Crop Consultation', description: 'Expert agricultural consultation for farmers looking to improve their yield and adopt sustainable practices.', features: 'Soil testing,Crop planning,Pest analysis,Marketing guidance' },
  { id: '6', title: 'Seedling Supply', description: 'Quality seedlings and saplings for vegetables, fruits, and ornamental plants from our nursery.', features: 'Disease-free saplings,High-yield varieties,Expert guidance,Seasonal availability' },
]

const DEFAULT_TEAM: TeamMember[] = [
  { id: '1', name: 'Vinayak Vishwanath Karpe', role: 'Founder & Owner', title: 'Master Farmer — 30+ Years Experience', bio: 'With over 30 years of farming experience, Vinayak Karpe founded Karpe Farm with a vision to provide pure, organic produce to every household.', expertise: 'Crop Planning,Soil Management,Traditional Farming,Business Leadership', image: '/images/father.png' },
  { id: '2', name: 'Pravin Karpe', role: 'Operations Manager', title: 'BSc Agriculture', bio: 'Pravin brings scientific expertise and operational excellence to the farm, bridging traditional farming knowledge with modern agricultural science.', expertise: 'Farm Operations,Crop Science,Quality Control,Supply Chain', image: '/images/pravin.png' },
  { id: '3', name: 'Vishal Karpe', role: 'Marketing & Tech Lead', title: 'MSc Computer Science', bio: 'Vishal combines his technical background with a passion for agriculture to bring Karpe Farm into the digital age.', expertise: 'Digital Marketing,Web Development,E-commerce,Brand Strategy', image: '/images/vishal.png' },
]

const DEFAULT_CONTACT: ContactInfo = {
  owner: 'Vinayak Vishwanath Karpe',
  address: 'Karpe Farm House, Malwadgoan Road, Kamalpur, Takalibhan, Shrirampur 413725, Maharashtra, India',
  phone1: '9637494175',
  phone2: '9130931719',
  email: 'hivetech1010@gmail.com',
  hoursWeekday: 'Mon - Sat: 6:00 AM - 7:00 PM',
  hoursSunday: 'Sunday: 7:00 AM - 2:00 PM',
}

const PRODUCT_CATEGORIES = ['vegetable', 'fruit', 'grain', 'dairy', 'spice', 'other']
const TEAM_IMAGES = ['/images/father.png', '/images/pravin.png', '/images/vishal.png']

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
  const [adminPhoto, setAdminPhoto] = useState('')
  const [adminForm, setAdminForm] = useState({ newUsername: '', currentPassword: '', newPassword: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  // Edit states
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [orderComment, setOrderComment] = useState('')
  const [orderStatus, setOrderStatus] = useState('')

  // Product add
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, unit: 'kg', image: '/images/onions.png', category: 'vegetable', stock: 100, isFeatured: false })

  // Content management
  const [contentTab, setContentTab] = useState('home')
  const [homeContent, setHomeContent] = useState({ title: 'Karpe Farm Agriculture', subtitle: 'Bringing you the freshest organic produce from Takalibhan, Shrirampur, Maharashtra.', description: '' })
  const [aboutContent, setAboutContent] = useState({ title: 'A Legacy of Organic Farming', description: 'Karpe Farm Agriculture has been nurturing the land in Takalibhan, Shrirampur, Maharashtra for over 15 years.', story: '' })
  const [dbServices, setDbServices] = useState<ServiceItem[]>(DEFAULT_SERVICES)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM)
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT)
  const [editService, setEditService] = useState<ServiceItem | null>(null)
  const [editMember, setEditMember] = useState<TeamMember | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMember, setNewMember] = useState<TeamMember>({ id: '', name: '', role: '', title: '', bio: '', expertise: '', image: '/images/father.png' })

  useEffect(() => { setActiveTab(tab) }, [tab])
  useEffect(() => { checkAdminAuth() }, [])

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
    await Promise.all([fetchUsers(), fetchOrders(), fetchProducts(), fetchContacts(), loadContent()])
  }

  async function fetchUsers() {
    try { const r = await axios.get('/api/admin/users'); setUsers(r.data.users || []) } catch {}
  }
  async function fetchOrders() {
    try { const r = await axios.get('/api/admin/orders'); setOrders(r.data.orders || []) } catch {}
  }
  async function fetchProducts() {
    try {
      const r = await axios.get('/api/products?all=true')
      setProducts(r.data.products || [])
    } catch {}
  }
  async function fetchContacts() {
    try { const r = await axios.get('/api/contact'); setContacts(r.data.contacts || []) } catch {}
  }

  async function loadContent() {
    try {
      const r = await axios.get('/api/admin/content')
      const contents: Array<{ section: string; title?: string; subtitle?: string; description?: string; extraData?: Record<string, unknown> }> = r.data.contents || []
      contents.forEach((c) => {
        if (c.section === 'home') setHomeContent({ title: c.title || homeContent.title, subtitle: c.subtitle || homeContent.subtitle, description: c.description || '' })
        if (c.section === 'about') setAboutContent({ title: c.title || aboutContent.title, description: c.description || aboutContent.description, story: (c.extraData?.story as string) || '' })
        if (c.section === 'services' && c.extraData?.services) setDbServices(c.extraData.services as ServiceItem[])
        if (c.section === 'team' && c.extraData?.members) setTeamMembers(c.extraData.members as TeamMember[])
        if (c.section === 'contact-info' && c.extraData) setContactInfo({ ...DEFAULT_CONTACT, ...(c.extraData as ContactInfo) })
      })
    } catch {}
  }

  async function handleLogout() {
    await axios.post('/api/auth/logout')
    toast.success('Logged out')
    router.push('/admin')
  }

  // Users
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

  // Orders
  async function updateOrderStatus(orderId: string) {
    try {
      await axios.put('/api/admin/orders', { orderId, status: orderStatus, adminComment: orderComment })
      toast.success('Order updated — user notified')
      setEditOrder(null)
      fetchOrders()
    } catch { toast.error('Failed to update order') }
  }

  // Products
  async function addProduct() {
    if (!newProduct.name || !newProduct.description || !newProduct.image) {
      toast.error('Please fill in all required fields')
      return
    }
    try {
      await axios.post('/api/products', newProduct)
      toast.success('Product added!')
      setShowAddProduct(false)
      setNewProduct({ name: '', description: '', price: 0, unit: 'kg', image: '/images/onions.png', category: 'vegetable', stock: 100, isFeatured: false })
      fetchProducts()
    } catch { toast.error('Failed to add product') }
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

  // Contacts
  async function replyContact(contactId: string, reply: string) {
    try {
      await axios.put('/api/contact', { contactId, status: 'replied', adminReply: reply })
      toast.success('Reply sent')
      fetchContacts()
    } catch { toast.error('Failed to send reply') }
  }

  // Admin profile
  async function saveAdminProfile() {
    try {
      await axios.put('/api/admin/profile', adminForm)
      toast.success('Profile updated')
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

  // Content saves
  async function saveHomeContent() {
    try {
      await axios.put('/api/admin/content', { section: 'home', title: homeContent.title, subtitle: homeContent.subtitle, description: homeContent.description })
      toast.success('Home content saved!')
    } catch (err: any) { toast.error(err.response?.data?.error || err.message || 'Save failed — check MongoDB connection') }
  }

  async function saveAboutContent() {
    try {
      await axios.put('/api/admin/content', { section: 'about', title: aboutContent.title, description: aboutContent.description, extraData: { story: aboutContent.story } })
      toast.success('About content saved!')
    } catch (err: any) { toast.error(err.response?.data?.error || err.message || 'Save failed — check MongoDB connection') }
  }

  async function saveServices() {
    try {
      await axios.put('/api/admin/content', { section: 'services', extraData: { services: dbServices } })
      toast.success('Services saved!')
      setEditService(null)
    } catch (err: any) { toast.error(err.response?.data?.error || err.message || 'Save failed — check MongoDB connection') }
  }

  async function saveTeam() {
    try {
      await axios.put('/api/admin/content', { section: 'team', extraData: { members: teamMembers } })
      toast.success('Team saved!')
      setEditMember(null)
      setShowAddMember(false)
    } catch (err: any) { toast.error(err.response?.data?.error || err.message || 'Save failed — check MongoDB connection') }
  }

  async function saveContactInfo() {
    try {
      await axios.put('/api/admin/content', { section: 'contact-info', extraData: contactInfo })
      toast.success('Contact info saved!')
    } catch (err: any) { toast.error(err.response?.data?.error || err.message || 'Save failed — check MongoDB connection in Vercel') }
  }

  function handleTeamPhotoUpload(e: React.ChangeEvent<HTMLInputElement>, onSet: (url: string) => void) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Photo must be under 2MB'); return }
    const reader = new FileReader()
    reader.onload = () => onSet(reader.result as string)
    reader.readAsDataURL(file)
  }

  function addTeamMember() {
    if (!newMember.name || !newMember.role) { toast.error('Name and role are required'); return }
    const member = { ...newMember, id: Date.now().toString() }
    setTeamMembers([...teamMembers, member])
    setNewMember({ id: '', name: '', role: '', title: '', bio: '', expertise: '', image: '/images/father.png' })
    setShowAddMember(false)
  }

  function deleteTeamMember(id: string) {
    if (!confirm('Remove this team member?')) return
    setTeamMembers(teamMembers.filter(m => m.id !== id))
  }

  function addService() {
    const s: ServiceItem = { id: Date.now().toString(), title: 'New Service', description: 'Service description here.', features: 'Feature 1,Feature 2,Feature 3' }
    setDbServices([...dbServices, s])
    setEditService(s)
  }

  function deleteService(id: string) {
    if (!confirm('Remove this service?')) return
    setDbServices(dbServices.filter(s => s.id !== id))
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

  const filteredProducts = categoryFilter === 'all' ? products : products.filter(p => p.category === categoryFilter)

  const inputCls = 'w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500'
  const textareaCls = 'w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500 resize-none'
  const labelCls = 'text-gray-400 text-xs block mb-1.5 font-medium uppercase tracking-wide'

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} transition-all duration-300 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 h-screen sticky top-0`}>
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
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              title={item.label}
            >
              <item.icon size={17} className="shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-bold">{item.badge}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-950 hover:text-red-300 transition-all">
            <FiLogOut size={17} className="shrink-0" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
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
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">A</div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users', value: users.length, icon: FiUsers, color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-800/50' },
                    { label: 'Total Orders', value: orders.length, icon: FiPackage, color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-800/50' },
                    { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: FiAlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-800/50' },
                    { label: 'Revenue (Delivered)', value: `₹${orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0)}`, icon: FiTrendingUp, color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-800/50' },
                  ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-5`}>
                      <stat.icon className={`${stat.color} mb-3`} size={24} />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl">
                  <div className="p-5 border-b border-gray-800"><h3 className="text-white font-bold">Recent Orders</h3></div>
                  <div className="divide-y divide-gray-800">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{order.productName}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{order.buyerName} · ₹{order.totalAmount}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-700 text-gray-300'}`}>
                          {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                        </span>
                        <button onClick={() => { setEditOrder(order); setOrderStatus(order.status); setOrderComment(order.adminComment || ''); setTab('orders') }} className="text-gray-400 hover:text-green-400 text-xs">Update</button>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-center py-8 text-gray-500">No orders yet</p>}
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl">
                  <div className="p-5 border-b border-gray-800"><h3 className="text-white font-bold">Recent Users</h3></div>
                  <div className="divide-y divide-gray-800">
                    {users.slice(0, 5).map((u) => (
                      <div key={u._id} className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center text-green-300 text-sm font-bold shrink-0">{u.name.charAt(0).toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{u.name}</p>
                          <p className="text-gray-400 text-xs truncate">{u.email}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    ))}
                    {users.length === 0 && <p className="text-center py-8 text-gray-500">No users yet</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── USERS ── */}
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
                                <div className="w-7 h-7 rounded-full bg-green-800 flex items-center justify-center text-green-300 text-xs font-bold">{u.name.charAt(0).toUpperCase()}</div>
                                <span className="text-white text-sm font-medium">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-300 text-sm">{u.email}</td>
                            <td className="px-4 py-3 text-gray-300 text-sm">{u.phone || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{u.createdAt ? format(new Date(u.createdAt), 'dd MMM yy') : '-'}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">
                              {u.loginActivity?.length > 0 ? format(new Date(u.loginActivity[u.loginActivity.length - 1].date), 'dd MMM yy') : '-'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button onClick={() => setEditUser(u)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"><FiEdit size={13} /></button>
                                <button onClick={() => toggleUserStatus(u)} className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'bg-red-900/40 hover:bg-red-900 text-red-400' : 'bg-green-900/40 hover:bg-green-900 text-green-400'}`}>{u.isActive ? <FiX size={13} /> : <FiCheck size={13} />}</button>
                                <button onClick={() => deleteUser(u._id)} className="p-1.5 bg-red-900/20 hover:bg-red-900 rounded-lg text-red-400 hover:text-red-200 transition-colors"><FiTrash2 size={13} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && <div className="text-center py-16 text-gray-500">No users registered yet</div>}
                  </div>
                </div>
                {editUser && (
                  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                      <h3 className="text-white font-bold text-lg mb-4">Edit User</h3>
                      <div className="space-y-3">
                        {[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }].map(({ key, label }) => (
                          <div key={key}>
                            <label className={labelCls}>{label}</label>
                            <input type="text" value={(editUser as any)[key] || ''} onChange={e => setEditUser({ ...editUser, [key]: e.target.value })} className={inputCls} />
                          </div>
                        ))}
                        <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                          <input type="checkbox" checked={editUser.isActive} onChange={e => setEditUser({ ...editUser, isActive: e.target.checked })} className="accent-green-500" />
                          Active User
                        </label>
                        <div className="flex gap-3 pt-2">
                          <button onClick={saveUserEdit} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-500">Save</button>
                          <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── ORDERS ── */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-gray-800">
                    <h2 className="text-white font-bold text-xl">Order Management</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{orders.length} total orders</p>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {orders.length === 0 ? (
                      <div className="text-center py-16 text-gray-500">No orders yet</div>
                    ) : orders.map((order) => (
                      <div key={order._id} className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="text-white font-semibold">{order.productName}</h4>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-700 text-gray-300'}`}>
                                {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">Qty: {order.quantity} × ₹{order.productPrice} = <span className="text-green-400 font-semibold">₹{order.totalAmount}</span></p>
                            <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                              <p>Buyer: <span className="text-gray-300">{order.buyerName}</span> · {order.buyerPhone}</p>
                              <p>Address: <span className="text-gray-300">{order.buyerAddress}</span></p>
                              {order.userId && <p>User: <span className="text-gray-300">{order.userId.name} ({order.userId.email})</span></p>}
                              {order.adminComment && <p className="text-yellow-400">Note: {order.adminComment}</p>}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-gray-400 text-xs">{order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy') : ''}</p>
                            <button
                              onClick={() => { setEditOrder(order); setOrderStatus(order.status); setOrderComment(order.adminComment || '') }}
                              className="mt-2 px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-xs rounded-lg transition-colors font-medium"
                            >
                              Update Status
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {editOrder && (
                  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                      <h3 className="text-white font-bold text-lg mb-1">Update Order Status</h3>
                      <p className="text-gray-400 text-sm mb-5">{editOrder.productName} — {editOrder.buyerName}</p>
                      <div className="space-y-4">
                        <div>
                          <label className={labelCls}>Status</label>
                          <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)} className={inputCls}>
                            {ORDER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Comment / Note to User</label>
                          <textarea value={orderComment} onChange={e => setOrderComment(e.target.value)} rows={3} placeholder="Optional message to the user..." className={textareaCls} />
                        </div>
                        <div className="flex gap-3 pt-1">
                          <button onClick={() => updateOrderStatus(editOrder._id)} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-500">Update & Notify User</button>
                          <button onClick={() => setEditOrder(null)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── PRODUCTS ── */}
            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-gray-800 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-white font-bold text-xl">Product Management</h2>
                      <p className="text-gray-400 text-sm mt-0.5">{products.length} products total</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Category filter */}
                      <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-green-500">
                        <option value="all">All Categories</option>
                        {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                      <button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition-colors">
                        <FiPlus size={16} /> Add Product
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                    {filteredProducts.map((product) => (
                      <div key={product._id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <div className="relative h-28 bg-gray-700 rounded-lg mb-3 overflow-hidden">
                          <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                          <div className="absolute top-2 left-2 flex gap-1">
                            {product.isFeatured && <span className="px-1.5 py-0.5 bg-green-600 text-white text-[10px] rounded font-bold">Featured</span>}
                            <span className="px-1.5 py-0.5 bg-gray-900/80 text-gray-300 text-[10px] rounded font-medium capitalize">{product.category}</span>
                          </div>
                        </div>
                        <h4 className="text-white font-semibold text-sm mb-1">{product.name}</h4>
                        <p className="text-gray-400 text-xs mb-2 line-clamp-2">{product.description}</p>
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
                    {filteredProducts.length === 0 && <div className="col-span-3 text-center py-16 text-gray-500">No products in this category</div>}
                  </div>
                </div>

                {/* Add Product Modal */}
                {showAddProduct && (
                  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl my-4">
                      <h3 className="text-white font-bold text-lg mb-5">Add New Product</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'name', label: 'Product Name *', type: 'text' },
                          { key: 'price', label: 'Price (₹) *', type: 'number' },
                          { key: 'stock', label: 'Stock Quantity *', type: 'number' },
                          { key: 'image', label: 'Image Path (e.g. /images/onions.png)', type: 'text' },
                        ].map(({ key, label, type }) => (
                          <div key={key}>
                            <label className={labelCls}>{label}</label>
                            <input type={type} value={(newProduct as any)[key]} onChange={e => setNewProduct({ ...newProduct, [key]: type === 'number' ? Number(e.target.value) : e.target.value })} className={inputCls} />
                          </div>
                        ))}
                        <div>
                          <label className={labelCls}>Unit</label>
                          <select value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} className={inputCls}>
                            {['kg', 'gram', 'unit', 'dozen', 'litre', 'bundle'].map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Category</label>
                          <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className={inputCls}>
                            {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Description *</label>
                          <textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} rows={3} placeholder="Describe this product..." className={textareaCls} />
                        </div>
                        <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                          <input type="checkbox" checked={newProduct.isFeatured} onChange={e => setNewProduct({ ...newProduct, isFeatured: e.target.checked })} className="accent-green-500" />
                          Feature on Home Page
                        </label>
                        {/* Image preview */}
                        {newProduct.image && (
                          <div className="relative h-20 bg-gray-800 rounded-lg overflow-hidden">
                            <Image src={newProduct.image} alt="Preview" fill className="object-contain p-2" onError={() => {}} />
                          </div>
                        )}
                        <div className="flex gap-3 pt-2">
                          <button onClick={addProduct} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-500">Add Product</button>
                          <button onClick={() => setShowAddProduct(false)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Product Modal */}
                {editProduct && (
                  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl my-4">
                      <h3 className="text-white font-bold text-lg mb-5">Edit Product</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'name', label: 'Product Name', type: 'text' },
                          { key: 'price', label: 'Price (₹)', type: 'number' },
                          { key: 'stock', label: 'Stock', type: 'number' },
                          { key: 'image', label: 'Image Path', type: 'text' },
                        ].map(({ key, label, type }) => (
                          <div key={key}>
                            <label className={labelCls}>{label}</label>
                            <input type={type} value={(editProduct as any)[key]} onChange={e => setEditProduct({ ...editProduct, [key]: type === 'number' ? Number(e.target.value) : e.target.value })} className={inputCls} />
                          </div>
                        ))}
                        <div>
                          <label className={labelCls}>Unit</label>
                          <select value={editProduct.unit} onChange={e => setEditProduct({ ...editProduct, unit: e.target.value })} className={inputCls}>
                            {['kg', 'gram', 'unit', 'dozen', 'litre', 'bundle'].map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Category</label>
                          <select value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} className={inputCls}>
                            {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Description</label>
                          <textarea value={editProduct.description || ''} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} rows={3} className={textareaCls} />
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
                          <button onClick={updateProduct} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-500">Save Changes</button>
                          <button onClick={() => setEditProduct(null)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── MESSAGES ── */}
            {activeTab === 'contacts' && (
              <motion.div key="contacts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-gray-800">
                    <h2 className="text-white font-bold text-xl">Contact Messages</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{contacts.filter(c => c.status === 'pending').length} pending replies</p>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {contacts.length === 0 ? (
                      <div className="text-center py-16"><FiMessageSquare className="text-gray-600 mx-auto mb-3" size={40} /><p className="text-gray-500">No messages yet</p></div>
                    ) : contacts.map((contact) => (
                      <ContactMessage key={contact._id} contact={contact} onReply={replyContact} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── CONTENT MANAGEMENT ── */}
            {activeTab === 'content' && (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h2 className="text-white font-bold text-xl mb-4">Content Management</h2>
                  {/* Content sub-tabs */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'home', label: '🏠 Home Page' },
                      { id: 'services', label: '🌿 Services' },
                      { id: 'about', label: '📖 About Us' },
                      { id: 'team', label: '👥 Team' },
                      { id: 'contact', label: '📞 Contact Info' },
                    ].map(t => (
                      <button key={t.id} onClick={() => setContentTab(t.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${contentTab === t.id ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* HOME CONTENT */}
                {contentTab === 'home' && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-white font-bold">Home Page Content</h3>
                    <div>
                      <label className={labelCls}>Page Title (Hero)</label>
                      <input type="text" value={homeContent.title} onChange={e => setHomeContent(c => ({ ...c, title: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Subtitle / Tagline</label>
                      <input type="text" value={homeContent.subtitle} onChange={e => setHomeContent(c => ({ ...c, subtitle: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Extra Description</label>
                      <textarea value={homeContent.description} onChange={e => setHomeContent(c => ({ ...c, description: e.target.value }))} rows={3} className={textareaCls} />
                    </div>
                    <button onClick={saveHomeContent} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-colors">
                      <FiSave size={14} /> Save Home Content
                    </button>
                  </div>
                )}

                {/* SERVICES CONTENT */}
                {contentTab === 'services' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">{dbServices.length} services — click Edit to update, Add to create new</p>
                      <div className="flex gap-2">
                        <button onClick={addService} className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors">
                          <FiPlus size={13} /> Add Service
                        </button>
                        <button onClick={saveServices} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-xl transition-colors">
                          <FiSave size={13} /> Save All
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dbServices.map((s) => (
                        <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                          {editService?.id === s.id ? (
                            <div className="space-y-3">
                              <div>
                                <label className={labelCls}>Title</label>
                                <input value={editService.title} onChange={e => setEditService({ ...editService, title: e.target.value })} className={inputCls} />
                              </div>
                              <div>
                                <label className={labelCls}>Description</label>
                                <textarea value={editService.description} onChange={e => setEditService({ ...editService, description: e.target.value })} rows={3} className={textareaCls} />
                              </div>
                              <div>
                                <label className={labelCls}>Features (comma-separated)</label>
                                <input value={editService.features} onChange={e => setEditService({ ...editService, features: e.target.value })} className={inputCls} placeholder="Feature 1,Feature 2,Feature 3" />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => { setDbServices(dbServices.map(x => x.id === s.id ? editService : x)); setEditService(null) }} className="flex-1 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-500">Apply</button>
                                <button onClick={() => setEditService(null)} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-xl text-xs hover:bg-gray-700">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h4 className="text-white font-bold mb-1">{s.title}</h4>
                              <p className="text-gray-400 text-xs mb-2 line-clamp-2">{s.description}</p>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {s.features.split(',').map(f => <span key={f} className="px-2 py-0.5 bg-green-900/30 text-green-400 text-[10px] rounded">{f.trim()}</span>)}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setEditService(s)} className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded-lg"><FiEdit className="inline mr-1" size={11} />Edit</button>
                                <button onClick={() => deleteService(s.id)} className="py-1.5 px-3 bg-red-900/30 hover:bg-red-900 text-red-400 text-xs rounded-lg"><FiTrash2 size={11} /></button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ABOUT CONTENT */}
                {contentTab === 'about' && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-white font-bold">About Us Page Content</h3>
                    <div>
                      <label className={labelCls}>Section Title</label>
                      <input type="text" value={aboutContent.title} onChange={e => setAboutContent(c => ({ ...c, title: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Main Description</label>
                      <textarea value={aboutContent.description} onChange={e => setAboutContent(c => ({ ...c, description: e.target.value }))} rows={4} className={textareaCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Our Story (detailed paragraph)</label>
                      <textarea value={aboutContent.story} onChange={e => setAboutContent(c => ({ ...c, story: e.target.value }))} rows={5} className={textareaCls} />
                    </div>
                    <button onClick={saveAboutContent} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-colors">
                      <FiSave size={14} /> Save About Content
                    </button>
                  </div>
                )}

                {/* TEAM CONTENT */}
                {contentTab === 'team' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">{teamMembers.length} team members</p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowAddMember(true)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-xl">
                          <FiPlus size={13} /> Add Member
                        </button>
                        <button onClick={saveTeam} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-xl">
                          <FiSave size={13} /> Save Team
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teamMembers.map((m) => (
                        <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                          {editMember?.id === m.id ? (
                            <div className="space-y-3">
                              {[
                                { key: 'name', label: 'Full Name *' },
                                { key: 'role', label: 'Role/Position *' },
                                { key: 'title', label: 'Qualification / Title' },
                                { key: 'expertise', label: 'Expertise (comma-separated)' },
                              ].map(({ key, label }) => (
                                <div key={key}>
                                  <label className={labelCls}>{label}</label>
                                  <input value={(editMember as any)[key]} onChange={e => setEditMember({ ...editMember, [key]: e.target.value })} className={inputCls} />
                                </div>
                              ))}
                              <div>
                                <label className={labelCls}>Bio</label>
                                <textarea value={editMember.bio} onChange={e => setEditMember({ ...editMember, bio: e.target.value })} rows={3} className={textareaCls} />
                              </div>
                              <div>
                                <label className={labelCls}>Photo</label>
                                <div className="flex items-center gap-3">
                                  {editMember.image && (
                                    <img src={editMember.image} alt="preview" className="w-12 h-12 rounded-full object-cover border-2 border-gray-600" />
                                  )}
                                  <div className="flex-1 space-y-2">
                                    <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                                      <FiCamera size={14} className="text-gray-400" />
                                      <span className="text-gray-400 text-xs">Upload Photo (max 2MB)</span>
                                      <input type="file" accept="image/*" className="hidden" onChange={e => handleTeamPhotoUpload(e, url => setEditMember({ ...editMember, image: url }))} />
                                    </label>
                                    <select value={editMember.image.startsWith('data:') ? '' : editMember.image} onChange={e => { if (e.target.value) setEditMember({ ...editMember, image: e.target.value }) }} className={inputCls}>
                                      <option value="">— or choose existing —</option>
                                      {TEAM_IMAGES.map(img => <option key={img} value={img}>{img}</option>)}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => { setTeamMembers(teamMembers.map(x => x.id === m.id ? editMember : x)); setEditMember(null) }} className="flex-1 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-500">Apply</button>
                                <button onClick={() => setEditMember(null)} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-xl text-xs hover:bg-gray-700">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-700">
                                <img src={m.image} alt={m.name} className="object-cover object-top w-full h-full" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm">{m.name}</p>
                                <p className="text-green-400 text-xs">{m.role}</p>
                                <p className="text-gray-500 text-xs">{m.title}</p>
                                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{m.bio}</p>
                                <div className="flex gap-2 mt-2">
                                  <button onClick={() => setEditMember(m)} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white text-[11px] rounded-lg"><FiEdit className="inline mr-1" size={10} />Edit</button>
                                  <button onClick={() => deleteTeamMember(m.id)} className="px-3 py-1 bg-red-900/30 hover:bg-red-900 text-red-400 text-[11px] rounded-lg"><FiTrash2 className="inline mr-1" size={10} />Remove</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Member Modal */}
                    {showAddMember && (
                      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl my-4">
                          <h3 className="text-white font-bold text-lg mb-5">Add Team Member</h3>
                          <div className="space-y-3">
                            {[
                              { key: 'name', label: 'Full Name *' },
                              { key: 'role', label: 'Role *' },
                              { key: 'title', label: 'Qualification' },
                              { key: 'expertise', label: 'Expertise (comma-separated)' },
                            ].map(({ key, label }) => (
                              <div key={key}>
                                <label className={labelCls}>{label}</label>
                                <input value={(newMember as any)[key]} onChange={e => setNewMember({ ...newMember, [key]: e.target.value })} className={inputCls} />
                              </div>
                            ))}
                            <div>
                              <label className={labelCls}>Bio</label>
                              <textarea value={newMember.bio} onChange={e => setNewMember({ ...newMember, bio: e.target.value })} rows={3} className={textareaCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Photo</label>
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  {newMember.image && (
                                    <img src={newMember.image} alt="preview" className="w-12 h-12 rounded-full object-cover border-2 border-gray-600 shrink-0" />
                                  )}
                                  <label className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-800 border border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                                    <FiCamera size={14} className="text-gray-400" />
                                    <span className="text-gray-400 text-xs">Upload Photo (max 2MB)</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleTeamPhotoUpload(e, url => setNewMember({ ...newMember, image: url }))} />
                                  </label>
                                </div>
                                <select value={newMember.image.startsWith('data:') ? '' : newMember.image} onChange={e => { if (e.target.value) setNewMember({ ...newMember, image: e.target.value }) }} className={inputCls}>
                                  <option value="">— or choose existing photo —</option>
                                  {TEAM_IMAGES.map(img => <option key={img} value={img}>{img}</option>)}
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                              <button onClick={addTeamMember} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-500">Add Member</button>
                              <button onClick={() => setShowAddMember(false)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CONTACT INFO */}
                {contentTab === 'contact' && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-white font-bold">Contact Information (shown in footer)</h3>
                    {[
                      { key: 'owner', label: 'Owner / Contact Person Name' },
                      { key: 'address', label: 'Full Address' },
                      { key: 'phone1', label: 'Phone Number 1' },
                      { key: 'phone2', label: 'Phone Number 2' },
                      { key: 'email', label: 'Email Address' },
                      { key: 'hoursWeekday', label: 'Working Hours (Mon-Sat)' },
                      { key: 'hoursSunday', label: 'Working Hours (Sunday)' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className={labelCls}>{label}</label>
                        <input type="text" value={(contactInfo as any)[key]} onChange={e => setContactInfo({ ...contactInfo, [key]: e.target.value })} className={inputCls} />
                      </div>
                    ))}
                    <button onClick={saveContactInfo} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-sm rounded-xl transition-colors">
                      <FiSave size={14} /> Save Contact Info
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── ADMIN PROFILE ── */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg">
                  <h2 className="text-white font-bold text-xl mb-6">Admin Profile</h2>
                  <div className="flex items-center gap-5 mb-8">
                    <div className="relative">
                      {adminPhoto ? (
                        <img src={adminPhoto} alt="Admin" className="w-20 h-20 rounded-full object-cover border-2 border-green-500" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center text-white text-3xl font-bold border-2 border-green-500">A</div>
                      )}
                      <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-500">
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
                      <label className={labelCls}>New Username</label>
                      <input type="text" value={adminForm.newUsername} onChange={e => setAdminForm(f => ({ ...f, newUsername: e.target.value }))} placeholder="Enter new username" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Current Password</label>
                      <input type="password" value={adminForm.currentPassword} onChange={e => setAdminForm(f => ({ ...f, currentPassword: e.target.value }))} placeholder="Current password" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>New Password</label>
                      <input type="password" value={adminForm.newPassword} onChange={e => setAdminForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="New password" className={inputCls} />
                    </div>
                    <button onClick={saveAdminProfile} className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-colors">
                      <FiSave className="inline mr-2" size={14} />Save Profile
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
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-white font-semibold text-sm">{contact.userName}</span>
            <span className="text-gray-400 text-xs">{contact.userEmail}</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${contact.status === 'pending' ? 'bg-yellow-900 text-yellow-400' : contact.status === 'replied' ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'}`}>{contact.status}</span>
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
          <input type="text" value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500" />
          <button onClick={() => { onReply(contact._id, reply); setShowReply(false) }} className="px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-xl hover:bg-green-500 transition-colors">Send</button>
        </div>
      )}
    </div>
  )
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
