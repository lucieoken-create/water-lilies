import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Per grid slot (row-major, 3×3): organic pixel offsets, rotation, and scatter direction.
// sx/sy are unit multipliers for the scatter vector:
//   -1 = fully off left/top, 0 = no movement on that axis, 1 = fully off right/bottom
const SLOTS = [
  { type: 'pink',  offX:  22, offY: -10, rotation: -15, sx: -1,    sy: -1   }, // top-left  → up-left
  { type: 'pad',   offX: -14, offY:  16, rotation:   6, sx:  0,    sy: -1   }, // top-center → up
  { type: 'white', offX:   8, offY:  -6, rotation:  18, sx:  1,    sy: -1   }, // top-right  → up-right
  { type: 'pad',   offX: -10, offY:  26, rotation:  -8, sx: -1,    sy:  0   }, // mid-left   → left
  { type: 'pink',  offX:  26, offY: -20, rotation:  12, sx: -0.4,  sy:  1   }, // mid-center → down-left
  { type: 'white', offX: -16, offY:  10, rotation: -10, sx:  1,    sy:  0   }, // mid-right  → right
  { type: 'white', offX:  14, offY: -24, rotation:  14, sx: -1,    sy:  1   }, // bot-left   → down-left
  { type: 'pink',  offX: -28, offY:  20, rotation:  -6, sx:  0.1,  sy:  1   }, // bot-center → down
  { type: 'pad',   offX:  20, offY: -14, rotation:   9, sx:  1,    sy:  0.4 }, // bot-right  → right+down
]

export default function CurtainPad({ scattering, SVG_MAP }) {
  const [dims, setDims] = useState(null)

  useEffect(() => {
    setDims({ w: window.innerWidth, h: window.innerHeight })
  }, [])

  if (!dims) return null

  const { w, h } = dims

  // Each pad is 45% of viewport width — large enough that 3 overlapping columns tile the screen
  const padW = Math.round(w * 0.45)
  // Rough height estimate (average SVG aspect ratio ≈ 0.65) used for row calculations
  const padH = Math.round(padW * 0.65)

  // Column left-edge positions: col 0 bleeds slightly off left, col 2 off right
  const colX = [
    -Math.round(padW * 0.06),           // −6% of padW off left edge
    Math.round((w - padW) * 0.44),      // left of center
    Math.round(w - padW * 0.94),        // right, bleeding off right edge
  ]

  // Row top-edge positions: row 0 bleeds above, row 1 is centered, row 2 near bottom
  const rowY = [
    -Math.round(padH * 0.08),           // slightly above top edge
    Math.round((h - padH) / 2),         // perfectly centered vertically
    Math.round(h - padH * 0.92),        // near bottom edge
  ]

  // Scatter distances are viewport-size-aware — guaranteed off-screen in all directions
  const distX = w + padW + 60
  const distY = h + padH + 60

  return SLOTS.map((slot, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const SvgComponent = SVG_MAP[slot.type]

    return (
      <motion.div
        key={i}
        style={{
          position:      'fixed',
          left:          colX[col] + slot.offX,
          top:           rowY[row] + slot.offY,
          width:         padW,
          rotate:        slot.rotation,
          zIndex:        50,
          pointerEvents: 'none',
        }}
        animate={scattering
          ? { opacity: 0, x: slot.sx * distX, y: slot.sy * distY }
          : { opacity: 1, x: 0, y: 0 }
        }
        transition={scattering
          ? { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }
          : { duration: 0 }
        }
      >
        <SvgComponent style={{ width: '100%', height: 'auto', display: 'block' }} />
      </motion.div>
    )
  })
}
