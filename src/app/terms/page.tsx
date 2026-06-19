import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="text-gray-600 space-y-4">
          <p>By using Karpe Farm Agriculture website, you agree to these terms.</p>
          <h2 className="text-xl font-bold text-gray-800 mt-6">Usage</h2>
          <p>You must register to purchase products. You are responsible for maintaining the confidentiality of your account.</p>
          <h2 className="text-xl font-bold text-gray-800 mt-6">Orders</h2>
          <p>All orders are subject to availability. We reserve the right to cancel orders due to stock issues or delivery constraints.</p>
          <h2 className="text-xl font-bold text-gray-800 mt-6">Contact</h2>
          <p>For questions, contact us at info@karpefarm.com</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
