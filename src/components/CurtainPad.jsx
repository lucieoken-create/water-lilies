import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// 16 pads in a 4×4 grid (row-major order, 4 cols per row).
// offX/offY: organic pixel nudge from the grid slot center.
// sx/sy: scatter direction multipliers (−1=left/up, 0=same axis, 1=right/down, fractions=diagonal).
const SLOTS = [
  // Row 0 — scatter UP
  { type: 'pad',   offX:  12, offY: -10, rotation: -12, sx: -1,   sy: -1   },
  { type: 'pink',  offX: -16, offY:   8, rotation:   8, sx: -0.3, sy: -1   },
  { type: 'pad',   offX:  18, offY: -14, rotation:  14, sx:  0.3, sy: -1   },
  { type: 'white', offX: -10, offY:  10, rotation: -16, sx:  1,   sy: -1   },
  // Row 1 — scatter sideways / diagonal
  { type: 'pink',  offX:  20, offY: -18, rotation: -10, sx: -1,   sy:  0   },
  { type: 'pad',   offX: -22, offY:  14, rotation:  12, sx: -0.4, sy:  1   },
  { type: 'white', offX:  16, offY:  -8, rotation:  -8, sx:  0.5, sy: -0.5 },
  { type: 'pad',   offX: -12, offY:  18, rotation:  16, sx:  1,   sy:  0   },
  // Row 2 — scatter sideways / diagonal
  { type: 'pad',   offX:  10, offY: -16, rotation: -14, sx: -1,   sy:  0.5 },
  { type: 'white', offX: -18, offY:  12, rotation:   6, sx: -0.2, sy:  1   },
  { type: 'pink',  offX:  22, offY:  -8, rotation: -16, sx:  0.3, sy:  1   },
  { type: 'pad',   offX: -14, offY:  16, rotation:  10, sx:  1,   sy:  0.5 },
  // Row 3 — scatter DOWN
  { type: 'white', offX:   8, offY: -12, rotation: -18, sx: -1,   sy:  1   },
  { type: 'pad',   offX: -20, offY:  10, rotation:   4, sx: -0.1, sy:  1   },
  { type: 'pink',  offX:  16, offY: -18, rotation:  18, sx:  0.2, sy:  1   },
  { type: 'pad',   offX: -12, offY:  14, rotation:  -6, sx:  1,   sy:  1   },
]

export default function CurtainPad({ scattering, SVG_MAP }) {
  const [dims, setDims] = useState(null)

  useEffect(() => {
    setDims({ w: window.innerWidth, h: window.innerHeight })
  }, [])

  if (!dims) return null

  const { w, h } = dims

  // 50% of viewport width per pad — ensures adjacent columns overlap by ~45%
  // (SVG organic shapes fill ~79% of their bounding box; this overlap covers the transparent edges)
  const padW = Math.round(w * 0.50)
  const padH = Math.round(padW * 0.65) // rough average aspect ratio across all three SVG types

  // 4 column left-edges: start slightly off-screen left, end well past right edge
  const colX = [
    -Math.round(padW * 0.05),  // col 0: bleed left ~5%
    Math.round(w * 0.25),      // col 1: quarter-way
    Math.round(w * 0.50),      // col 2: center
    Math.round(w * 0.75),      // col 3: three-quarters (extends 25% past right edge)
  ]

  // 4 row top-edges: bleed slightly above and below viewport
  const rowY = [
    -Math.round(padH * 0.08),  // row 0: bleed above
    Math.round(h * 0.27),      // row 1: upper-middle
    Math.round(h * 0.52),      // row 2: lower-middle
    Math.round(h * 0.77),      // row 3: bleed below
  ]

  // Scatter distances guarantee each pad exits fully off-screen
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
          ? { duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }
          : { duration: 0 }
        }
      >
        <SvgComponent style={{ width: '100%', height: 'auto', display: 'block' }} />
      </motion.div>
    )
  })
}
