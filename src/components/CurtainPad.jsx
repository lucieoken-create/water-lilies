import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// 20 pads in a 4-col × 5-row grid (row-major order).
// offX/offY: organic nudge from grid slot; sx/sy: scatter direction multipliers.
const SLOTS = [
  // Row 0 — scatter UP
  { type: 'pad',   offX:  12, offY: -10, rotation: -12, sx: -1,   sy: -1   },
  { type: 'pink',  offX: -16, offY:   8, rotation:   8, sx: -0.3, sy: -1   },
  { type: 'pad',   offX:  18, offY: -14, rotation:  14, sx:  0.3, sy: -1   },
  { type: 'white', offX: -10, offY:  10, rotation: -16, sx:  1,   sy: -1   },
  // Row 1 — scatter sideways
  { type: 'pink',  offX:  20, offY: -18, rotation: -10, sx: -1,   sy:  0   },
  { type: 'pad',   offX: -22, offY:  14, rotation:  12, sx: -0.4, sy:  1   },
  { type: 'white', offX:  16, offY:  -8, rotation:  -8, sx:  0.5, sy: -0.5 },
  { type: 'pad',   offX: -12, offY:  18, rotation:  16, sx:  1,   sy:  0   },
  // Row 2 — scatter mixed diagonal
  { type: 'pad',   offX:  10, offY: -16, rotation: -14, sx: -1,   sy:  0.5 },
  { type: 'white', offX: -18, offY:  12, rotation:   6, sx: -0.2, sy:  1   },
  { type: 'pink',  offX:  22, offY:  -8, rotation: -16, sx:  0.3, sy:  1   },
  { type: 'pad',   offX: -14, offY:  16, rotation:  10, sx:  1,   sy:  0.5 },
  // Row 3 — scatter mixed
  { type: 'white', offX:   8, offY: -12, rotation: -18, sx: -1,   sy: -0.3 },
  { type: 'pad',   offX: -20, offY:  10, rotation:   4, sx: -0.5, sy:  1   },
  { type: 'pink',  offX:  16, offY: -18, rotation:  18, sx:  0.4, sy: -0.4 },
  { type: 'pad',   offX: -12, offY:  14, rotation:  -6, sx:  1,   sy:  0   },
  // Row 4 — scatter DOWN
  { type: 'pad',   offX:  14, offY:  -8, rotation: -10, sx: -1,   sy:  1   },
  { type: 'pink',  offX: -18, offY:  16, rotation:   6, sx: -0.1, sy:  1   },
  { type: 'pad',   offX:  20, offY: -12, rotation:  16, sx:  0.2, sy:  1   },
  { type: 'white', offX: -14, offY:   8, rotation:  -4, sx:  1,   sy:  1   },
]

export default function CurtainPad({ scattering, SVG_MAP }) {
  const [dims, setDims] = useState(null)

  useEffect(() => {
    setDims({ w: window.innerWidth, h: window.innerHeight })
  }, [])

  if (!dims) return null

  const { w, h } = dims

  // 60% of viewport width: adjacent columns overlap by ~55% of padW.
  // SVG shapes fill ~79% of their bounding box; 55% overlap >> 21% transparent edge.
  const padW = Math.round(w * 0.60)
  // Average SVG aspect ratio across the three types
  const padH = Math.round(padW * 0.65)

  // 4 columns — col 0 bleeds off left, col 3 bleeds off right
  const colX = [
    -Math.round(padW * 0.05),  // slightly off left edge
    Math.round(w * 0.25),
    Math.round(w * 0.50),
    Math.round(w * 0.75),      // extends ~35% past right edge
  ]

  // 5 rows at 20% vh spacing — row overlap ≥ 65% of padH, closing all vertical gaps
  const rowY = [
    -Math.round(padH * 0.10),  // bleed above top edge
    Math.round(h * 0.20),
    Math.round(h * 0.40),
    Math.round(h * 0.60),
    Math.round(h * 0.80),      // bleeds well below bottom edge
  ]

  // Scatter distances guarantee every pad exits fully off-screen
  const distX = w + padW + 80
  const distY = h + padH + 80

  return SLOTS.map((slot, i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
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
          ? { duration: 2.8, ease: [0.1, 0, 0.3, 1] }
          : { duration: 0 }
        }
      >
        <SvgComponent style={{ width: '100%', height: 'auto', display: 'block' }} />
      </motion.div>
    )
  })
}
