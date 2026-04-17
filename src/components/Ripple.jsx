import { motion } from 'framer-motion'

export default function Ripple({ x, y, fixed }) {
  return (
    <div
      style={{
        position:      fixed ? 'fixed' : 'absolute',
        left:          x,
        top:           y,
        pointerEvents: 'none',
        zIndex:        1,
      }}
    >
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{
            duration: 1.2 + i * 0.15,
            delay:    i * 0.18,
            ease:     'easeOut',
          }}
          style={{
            position:     'absolute',
            width:        50,
            height:       50,
            left:         -25,
            top:          -25,
            borderRadius: '50%',
            border:       '1.5px solid rgba(255, 255, 255, 0.5)',
          }}
        />
      ))}
    </div>
  )
}
