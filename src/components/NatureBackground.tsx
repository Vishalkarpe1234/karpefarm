'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const LEAVES = ['🍃', '🌿', '🍀', '🌱', '🌾', '🍂']

export default function NatureBackground() {
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    emoji: LEAVES[i % LEAVES.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 8,
    size: 0.8 + Math.random() * 0.8,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {leaves.map((leaf) => (
        <motion.span
          key={leaf.id}
          className="absolute select-none"
          style={{
            left: leaf.left,
            top: '-50px',
            fontSize: `${leaf.size}rem`,
            opacity: 0.25,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, 20, -15, 10, -5, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {leaf.emoji}
        </motion.span>
      ))}

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-green-300 opacity-10"
          style={{
            width: 4 + i * 3,
            height: 4 + i * 3,
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -20, 10, 0],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: 4 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
}
