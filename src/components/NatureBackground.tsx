'use client'

// Lightweight decorative background — CSS animation only, no JS/framer-motion
export default function NatureBackground() {
  const leaves = ['🍃', '🌿', '🍀', '🌱', '🌾', '🍂']
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden md:block">
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="leaf absolute select-none"
          style={{
            left: `${8 + i * 16}%`,
            animationDuration: `${10 + i * 3}s`,
            animationDelay: `${i * 2}s`,
            fontSize: '1.2rem',
            opacity: 0.18,
          }}
        >
          {leaves[i % leaves.length]}
        </span>
      ))}
    </div>
  )
}
