import { motion } from 'framer-motion'

export default function CurtainPad({ pad, SvgComponent, scattering }) {
  return (
    <motion.div
      style={{
        position:      'fixed',
        left:          pad.x,
        top:           pad.y,
        width:         pad.size,
        rotate:        pad.rotation,
        scale:         pad.scale,
        zIndex:        50,
        pointerEvents: 'none',
      }}
      animate={scattering
        ? { opacity: 0, x: pad.scatterX, y: pad.scatterY }
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
}
