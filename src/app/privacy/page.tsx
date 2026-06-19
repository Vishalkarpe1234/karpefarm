import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-green max-w-none text-gray-600 space-y-4">
          <p>At Karpe Farm Agriculture, we value your privacy and are committed to protecting your personal information.</p>
          <h2 className="text-xl font-bold text-gray-800 mt-6">Information We Collect</h2>
          <p>We collect information you provide directly: name, email, phone number, and delivery address when you register or place an order.</p>
          <h2 className="text-xl font-bold text-gray-800 mt-6">How We Use Your Information</h2>
          <p>We use your information solely to process orders, send delivery updates, and provide customer support. We never sell your data to third parties.</p>
          <h2 className="text-xl font-bold text-gray-800 mt-6">Contact</h2>
          <p>For privacy concerns, email us at hivetech1010@gmail.com</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
