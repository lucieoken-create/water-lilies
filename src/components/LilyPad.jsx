import { useState } from 'react'
import { motion } from 'framer-motion'

// Pre-baked variation per lily index so each bobs differently
const BOB_AMOUNTS   = [3.5, 4.2, 3.0, 4.8, 3.8, 4.0, 3.2, 4.5, 3.6, 4.1, 3.3, 4.7, 3.9, 4.3, 3.1]
const BOB_DURATIONS = [5.2, 5.8, 4.9, 6.1, 5.5, 4.7, 6.0, 5.3, 4.8, 5.9, 5.1, 6.3, 4.6, 5.7, 5.4]

export default function LilyPad({ lily, lilyIndex, SvgComponent, containerRef }) {
  const [isDragging, setIsDragging] = useState(false)

  const bobAmount   = BOB_AMOUNTS[lilyIndex % BOB_AMOUNTS.length]
  const bobDuration = BOB_DURATIONS[lilyIndex % BOB_DURATIONS.length]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: lilyIndex * 0.05, duration: 0.7, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left:     lily.x,
        top:      lily.y,
        width:    lily.size,
        rotate:   lily.rotation,
        scale:    lily.scale,
        zIndex:   isDragging ? 7 : 3,
        cursor:   isDragging ? 'grabbing' : 'grab',
      }}
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Slow perpetual bob — more subtle than cards */}
      <motion.div
        animate={{ y: isDragging ? 0 : [0, -bobAmount, 0] }}
        transition={
          isDragging
            ? { duration: 0 }
            : {
                duration:   bobDuration,
                repeat:     Infinity,
                ease:       'easeInOut',
                repeatType: 'loop',
              }
        }
      >
        <SvgComponent style={{ width: '100%', height: 'auto', display: 'block' }} />
      </motion.div>
    </motion.div>
  )
}
