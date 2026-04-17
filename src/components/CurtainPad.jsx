import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// 20 pads in a 4-col × 5-row grid (row-major order).
// offX/offY: organic nudge from grid slot; sx/sy: scatter direction multipliers.
const SLOTS = [
  // Row 0 — scatter UP
  { type: 'pad',   offX:   8, offY:  -8, rotation: -12, sx: -1,   sy: -1   },
  { type: 'pink',  offX: -10, offY:   6, rotation:   8, sx: -0.3, sy: -1   },
  { type: 'pad',   offX:  10, offY:  -8, rotation:  14, sx:  0.3, sy: -1   },
  { type: 'white', offX:  -8, offY:   8, rotation: -16, sx:  1,   sy: -1   },
  // Row 1 — scatter sideways
  { type: 'pink',  offX:  10, offY: -10, rotation: -10, sx: -1,   sy:  0   },
  { type: 'pad',   offX: -12, offY:   8, rotation:  12, sx: -0.4, sy:  1   },
  { type: 'white', offX:   8, offY:  -6, rotation:  -8, sx:  0.5, sy: -0.5 },
  { type: 'pad',   offX:  -8, offY:  10, rotation:  16, sx:  1,   sy:  0   },
  // Row 2 — scatter mixed diagonal
  { type: 'pad',   offX:   6, offY: -10, rotation: -14, sx: -1,   sy:  0.5 },
  { type: 'white', offX: -10, offY:   8, rotation:   6, sx: -0.2, sy:  1   },
  { type: 'pink',  offX:  12, offY:  -6, rotation: -16, sx:  0.3, sy:  1   },
  { type: 'pad',   offX:  -8, offY:  10, rotation:  10, sx:  1,   sy:  0.5 },
  // Row 3 — scatter mixed
  { type: 'white', offX:   6, offY:  -8, rotation: -18, sx: -1,   sy: -0.3 },
  { type: 'pad',   offX: -12, offY:   6, rotation:   4, sx: -0.5, sy:  1   },
  { type: 'pink',  offX:  10, offY: -10, rotation:  18, sx:  0.4, sy: -0.4 },
  { type: 'pad',   offX:  -8, offY:   8, rotation:  -6, sx:  1,   sy:  0   },
  // Row 4 — scatter DOWN
  { type: 'pad',   offX:   8, offY:  -6, rotation: -10, sx: -1,   sy:  1   },
  { type: 'pink',  offX: -10, offY:  10, rotation:   6, sx: -0.1, sy:  1   },
  { type: 'pad',   offX:  12, offY:  -8, rotation:  16, sx:  0.2, sy:  1   },
  { type: 'white', offX:  -8, offY:   6, rotation:  -4, sx:  1,   sy:  1   },
]

export default function CurtainPad({ scattering, SVG_MAP }) {
  const [dims, setDims] = useState(null)

  useEffect(() => {
    setDims({ w: window.innerWidth, h: window.innerHeight })
  }, [])

  if (!dims) return null

  const { w, h } = dims

  // 65% of viewport width; center-based layout so grid is symmetric.
  const padW = Math.round(w * 0.65)
  const padH = Math.round(padW * 0.65)

  // 4 columns: centers at 10%, 37%, 63%, 90% of vw. Left edge = center − padW/2.
  // Col 0 bleeds off left, col 3 bleeds off right.
  const colX = [0.10, 0.37, 0.63, 0.90].map(f => Math.round(f * w - padW / 2))

  // 5 rows: centers at 0%, 25%, 50%, 75%, 100% of vh. Top = center − padH/2.
  // Row 0 bleeds above viewport, row 4 bleeds below.
  const rowY = [0.00, 0.25, 0.50, 0.75, 1.00].map(f => Math.round(f * h - padH / 2))

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
