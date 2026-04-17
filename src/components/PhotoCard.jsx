import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const CARD_WIDTH = 200

export default function PhotoCard({
  photo,
  loadIndex,
  isSelected,
  isAnySelected,
  containerRef,
  onSelect,
  onClose,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const didDragRef = useRef(false)

  return (
    <>
      {/* Small floating card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.45 }}
        animate={{
          opacity: isSelected ? 0 : 1,
          scale:   isSelected ? 0.88 : 1,
          pointerEvents: isSelected || isAnySelected ? 'none' : 'auto',
        }}
        transition={{
          opacity: {
            delay:    hasLoaded ? 0 : loadIndex * 0.13,
            duration: 0.35,
          },
          scale: {
            delay:     hasLoaded || isSelected ? 0 : loadIndex * 0.13,
            type:      'spring',
            stiffness: 290,
            damping:   22,
          },
        }}
        onAnimationComplete={() => setHasLoaded(true)}
        style={{
          position: 'absolute',
          left:     photo.x,
          top:      photo.y,
          width:    CARD_WIDTH,
          zIndex:   isDragging ? 8 : 2,
          cursor:   isAnySelected ? 'default' : isDragging ? 'grabbing' : 'grab',
        }}
        drag={!isSelected && !isAnySelected}
        dragConstraints={containerRef}
        dragMomentum={false}
        dragElastic={0.08}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragStart={() => {
          setIsDragging(true)
          didDragRef.current = false
        }}
        onDrag={(_, info) => {
          if (Math.abs(info.offset.x) > 4 || Math.abs(info.offset.y) > 4)
            didDragRef.current = true
        }}
        onDragEnd={() => {
          setTimeout(() => { didDragRef.current = false }, 0)
          setIsDragging(false)
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!didDragRef.current && !isAnySelected) onSelect()
        }}
      >
        <motion.div
          animate={{
            scale:     isDragging ? 1.07 : 1,
            boxShadow: isDragging
              ? '0 22px 55px rgba(0,0,0,0.42), 0 8px 18px rgba(0,0,0,0.28)'
              : '0 8px 28px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)',
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          style={{
            borderRadius:         14,
            overflow:             'hidden',
            background:           'rgba(255,255,255,0.94)',
            backdropFilter:       'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            cursor:               'inherit',
            userSelect:           'none',
          }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            draggable={false}
            style={{ width: '100%', display: 'block', borderRadius: 14 }}
          />
        </motion.div>
      </motion.div>

      {/* Expanded lightbox */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key={`photo-expanded-outer-${photo.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position:       'fixed',
              inset:          0,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              zIndex:         20,
              pointerEvents:  'none',
            }}
          >
            <motion.div
              initial={{ scale: 0.62, y: 44 }}
              animate={{ scale: 1,    y: 0  }}
              exit={{    scale: 0.82, y: 24 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              style={{
                pointerEvents: 'all',
                width:         'min(800px, 92vw)',
                borderRadius:  18,
                overflow:      'hidden',
                background:    '#111',
                boxShadow:     '0 40px 100px rgba(0,0,0,0.62), 0 10px 32px rgba(0,0,0,0.38)',
                position:      'relative',
              }}
            >
              <button
                onClick={onClose}
                aria-label="Close photo"
                style={{
                  position:       'absolute',
                  top:            10,
                  right:          10,
                  zIndex:         30,
                  background:     'rgba(0,0,0,0.62)',
                  border:         '1.5px solid rgba(255,255,255,0.22)',
                  borderRadius:   '50%',
                  width:          34,
                  height:         34,
                  cursor:         'pointer',
                  color:          '#fff',
                  fontSize:       22,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  padding:        0,
                  lineHeight:     1,
                  transition:     'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.88)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.62)')}
              >
                ×
              </button>
              <img
                src={photo.src}
                alt={photo.alt}
                style={{
                  width:     '100%',
                  display:   'block',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
