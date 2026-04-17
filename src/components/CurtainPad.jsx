import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Cycling lookup tables — repeated via modulo for any grid size
const TYPES   = ['pad', 'pink', 'white', 'pad', 'pad', 'pink', 'white', 'pad', 'pink', 'pad']
const ROTS    = [-12, 8, 14, -16, -10, 12, -8, 16, -14, 6, -16, 10, -18, 4, 18, -6, -10, 6, 16, -4]
const OFFSETS = [
  [ 8,-8], [-10, 6], [10,-8], [-8, 8], [ 6,-6],
  [10,-10],[-12, 8], [ 8,-6], [-8,10], [10,-8],
  [ 6,-10],[-10, 8], [12,-6], [-8,10], [ 8,-8],
  [ 6,-8], [-12, 6], [10,-10],[-8, 8], [ 8,-6],
  [ 8,-6], [-10,10], [12,-8], [-8, 6], [ 6,-8],
]
const SCATTER = [
  {sx:-1,   sy:-1  },{sx:-0.3,sy:-1  },{sx: 0.3,sy:-1  },{sx: 1,  sy:-1  },{sx: 0.6,sy:-1  },
  {sx:-1,   sy: 0  },{sx:-0.4,sy: 1  },{sx: 0.5,sy:-0.5},{sx: 1,  sy: 0  },{sx: 0.8,sy: 0.4},
  {sx:-1,   sy: 0.5},{sx:-0.2,sy: 1  },{sx: 0.3,sy: 1  },{sx: 1,  sy: 0.5},{sx:-0.5,sy:-0.8},
  {sx:-1,   sy:-0.3},{sx:-0.5,sy: 1  },{sx: 0.4,sy:-0.4},{sx: 1,  sy: 0  },{sx: 0.7,sy: 0.6},
  {sx:-1,   sy: 1  },{sx:-0.1,sy: 1  },{sx: 0.2,sy: 1  },{sx: 1,  sy: 1  },{sx: 0.5,sy: 1  },
]

export default function CurtainPad({ scattering, SVG_MAP }) {
  const [dims, setDims] = useState(null)

  useEffect(() => {
    setDims({ w: window.innerWidth, h: window.innerHeight })
  }, [])

  if (!dims) return null

  const { w, h } = dims

  const padW = Math.round(w * 0.65)
  const padH = Math.round(padW * 0.65)

  // 5 fixed columns, symmetric around viewport
  const colX = [0.05, 0.27, 0.50, 0.73, 0.95].map(f => Math.round(f * w - padW / 2))

  // Row spacing capped to padH*0.78 so rows always overlap on any aspect ratio.
  // On portrait mobile padH < 25%vh, so we use padH-based spacing instead.
  const rowSpacing = Math.min(Math.round(padH * 0.78), Math.round(h * 0.25))
  const rowStart   = -Math.round(padH / 2)
  const numRows    = Math.ceil((h + padH) / rowSpacing) + 1
  const rowY       = Array.from({ length: numRows }, (_, i) => rowStart + i * rowSpacing)

  const distX = w + padW + 80
  const distY = h + padH + 80

  return (
    <>
      {/* Solid base guarantees zero gaps on any viewport */}
      <motion.div
        style={{ position: 'fixed', inset: 0, background: '#4a8a6a', zIndex: 49, pointerEvents: 'none' }}
        animate={{ opacity: scattering ? 0 : 1 }}
        transition={scattering ? { duration: 2.2, delay: 0.5, ease: 'easeIn' } : { duration: 0 }}
      />
      {rowY.map((top, row) =>
        colX.map((left, col) => {
          const i          = row * colX.length + col
          const type       = TYPES[i % TYPES.length]
          const rotation   = ROTS[i % ROTS.length]
          const [ox, oy]   = OFFSETS[i % OFFSETS.length]
          const { sx, sy } = SCATTER[i % SCATTER.length]
          const SvgComponent = SVG_MAP[type]
          return (
            <motion.div
              key={`${row}-${col}`}
              style={{
                position:      'fixed',
                left:          left + ox,
                top:           top  + oy,
                width:         padW,
                rotate:        rotation,
                zIndex:        50,
                pointerEvents: 'none',
              }}
              animate={scattering
                ? { opacity: 0, x: sx * distX, y: sy * distY }
                : { opacity: 1, x: 0, y: 0 }
              }
              transition={scattering
                ? { duration: 2.8, ease: [0.1, 0, 0.3, 1] }
                : { duration: 0 }
              }
            >
              <SvgComponent style={{ width: '100%', height: 'auto', display: 'block' }} />
            </motion.div>
          )
        })
      )}
    </>
  )
}
