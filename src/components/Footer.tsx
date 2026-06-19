'use client'
import Link from 'next/link'
import Image from 'next/image'
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi'
import { GiWheat, GiPlantSeed } from 'react-icons/gi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Map Section */}
      <div className="w-full h-64 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d711.0!2d74.8104737!3d19.6636559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc8789113ff4dd%3A0x41bd03d02a24e230!2sKarpe%20patil%20house!5e1!3m2!1sen!2sin!4v1718700000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(20%)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Karpe Farm Location"
        />
        <div className="absolute inset-0 pointer-events-none border-t-4 border-green-500" />
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 shrink-0">
                <Image src="/images/logo.png" alt="Karpe Farm" width={48} height={48} className="object-cover w-full h-full" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Karpe Farm</h3>
                <p className="text-green-400 text-xs">Agriculture & More</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Bringing you the freshest organic produce directly from our farm. Sustainable farming for a healthier tomorrow.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors text-gray-400 hover:text-white">
                <FiFacebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors text-gray-400 hover:text-white">
                <FiInstagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors text-gray-400 hover:text-white">
                <FiTwitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors text-gray-400 hover:text-white">
                <FiYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <GiWheat className="text-green-400" size={18} />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
                { href: '/services', label: 'Services' },
                { href: '/about', label: 'About Us' },
                { href: '/team', label: 'Our Team' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-green-500 inline-block" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <GiPlantSeed className="text-green-400" size={18} />
              Our Products
            </h4>
            <ul className="space-y-2">
              {['Fresh Vegetables', 'Organic Fruits', 'Coconuts', 'Mangoes', 'Onions & Spices', 'Seasonal Produce'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-green-500 inline-block" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div>
                <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">Owner</p>
                <p className="text-gray-300 text-sm font-medium">Vinayak Vishwanath Karpe</p>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-green-400 mt-0.5 shrink-0" size={16} />
                <p className="text-gray-400 text-sm leading-relaxed">
                  Karpe Farm House,<br />
                  Malwadgoan Road, Kamalpur,<br />
                  Takalibhan, Shrirampur 413725,<br />
                  Maharashtra, India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-green-400 shrink-0" size={16} />
                <div>
                  <a href="tel:+919637494175" className="text-gray-400 hover:text-green-400 text-sm transition-colors block">+91 96374 94175</a>
                  <a href="tel:+919130931719" className="text-gray-400 hover:text-green-400 text-sm transition-colors block">+91 91309 31719</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-green-400 shrink-0" size={16} />
                <a href="mailto:info@karpefarm.com" className="text-gray-400 hover:text-green-400 text-sm transition-colors">info@karpefarm.com</a>
              </div>
              <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-green-400 font-medium mb-1">Working Hours</p>
                <p className="text-gray-400 text-xs">Mon - Sat: 6:00 AM - 7:00 PM</p>
                <p className="text-gray-400 text-xs">Sunday: 7:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © 2025 Karpe Farm Agriculture. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link>
              {/* Hidden Admin Access */}
              <Link
                href="/admin"
                className="text-gray-700 hover:text-gray-500 transition-colors select-none"
                title="Admin"
              >
                <span className="text-[10px] opacity-30 hover:opacity-60 transition-opacity">Admin</span>
              </Link>
            </div>
          </div>
          {/* Designed by */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              Designed & Developed by{' '}
              <a
                href="https://vishalkarpe.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 font-semibold transition-colors"
              >
                Prof. Vishal Vinayak Karpe
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
