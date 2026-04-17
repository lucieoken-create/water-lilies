import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue } from 'framer-motion'

const CARD_WIDTH        = 210
const CARD_WIDTH_MOBILE = 148

const removeBtn = {
  position:       'absolute',
  top:            -8,
  right:          -8,
  zIndex:         10,
  width:          20,
  height:         20,
  borderRadius:   '50%',
  background:     'rgba(0,0,0,0.55)',
  border:         '1px solid rgba(255,255,255,0.25)',
  color:          '#fff',
  fontSize:       13,
  cursor:         'pointer',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  padding:        0,
  lineHeight:     1,
}

export default function FloatingCard({
  video,
  loadIndex,
  isSelected,
  isAnySelected,
  containerRef,
  onSelect,
  onClose,
  onRemove,
  isMobile = false,
}) {
  const [title, setTitle]           = useState(`Video ${loadIndex + 1}`)
  const [isDragging, setIsDragging] = useState(false)
  const [hasLoaded, setHasLoaded]   = useState(false)
  const didDragRef = useRef(false)

  const [initPos] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`wl-dp-${video.id}`)) ?? { x: 0, y: 0 } }
    catch { return { x: 0, y: 0 } }
  })
  const dragX = useMotionValue(initPos.x)
  const dragY = useMotionValue(initPos.y)

  useEffect(() => {
    const url =
      `https://www.youtube.com/oembed` +
      `?url=https://www.youtube.com/watch?v=${video.id}&format=json`
    fetch(url)
      .then(r => r.json())
      .then(data => { if (data.title) setTitle(data.title) })
      .catch(() => {})
  }, [video.id])

  const cardCursor = isMobile
    ? (isSelected ? 'default' : 'pointer')
    : (isAnySelected ? 'default' : isDragging ? 'grabbing' : 'grab')

  return (
    <>
      {/* Small floating card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.45 }}
        animate={{
          opacity:       isSelected ? 0 : 1,
          scale:         isSelected ? 0.88 : 1,
          pointerEvents: isSelected || isAnySelected ? 'none' : 'auto',
        }}
        transition={{
          opacity: { delay: hasLoaded ? 0 : loadIndex * 0.13, duration: 0.35 },
          scale:   { delay: hasLoaded || isSelected ? 0 : loadIndex * 0.13, type: 'spring', stiffness: 290, damping: 22 },
        }}
        onAnimationComplete={() => setHasLoaded(true)}
        style={{
          position: isMobile ? 'relative' : 'absolute',
          ...(isMobile ? {} : { left: video.x, top: video.y }),
          width:    isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH,
          ...(isMobile ? {} : { x: dragX, y: dragY }),
          zIndex:   isDragging ? 8 : 2,
          cursor:   'default',
        }}
        drag={!isMobile && !isSelected && !isAnySelected}
        dragConstraints={containerRef}
        dragMomentum={false}
        dragElastic={0.08}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragStart={isMobile ? undefined : () => { setIsDragging(true); didDragRef.current = false }}
        onDrag={isMobile ? undefined : (_, info) => {
          if (Math.abs(info.offset.x) > 4 || Math.abs(info.offset.y) > 4)
            didDragRef.current = true
        }}
        onDragEnd={isMobile ? undefined : () => {
          try { localStorage.setItem(`wl-dp-${video.id}`, JSON.stringify({ x: dragX.get(), y: dragY.get() })) } catch {}
          setTimeout(() => { didDragRef.current = false }, 0)
          setIsDragging(false)
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!isAnySelected && (isMobile || !didDragRef.current)) onSelect()
        }}
      >
        {/* Remove button */}
        {onRemove && !isAnySelected && (
          <button
            aria-label="Remove card"
            style={removeBtn}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onRemove() }}
          >
            ×
          </button>
        )}

        {/* Card face — cursor lives here so it only shows over the visible shape */}
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
            cursor:               cardCursor,
            userSelect:           'none',
          }}
        >
          <img
            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
            alt={title}
            draggable={false}
            style={{ width: '100%', display: 'block', borderRadius: '14px 14px 0 0' }}
          />
          <div style={{ padding: '8px 12px 10px', fontSize: 12.5, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </div>
        </motion.div>
      </motion.div>

      {/* Expanded card */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key={`expanded-outer-${video.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, pointerEvents: 'none' }}
          >
            <motion.div
              initial={{ scale: 0.62, y: 44 }}
              animate={{ scale: 1,    y: 0  }}
              exit={{    scale: 0.82, y: 24 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              style={{ pointerEvents: 'all', width: 'min(680px, 92vw)', borderRadius: 18, overflow: 'hidden', background: '#000', boxShadow: '0 40px 100px rgba(0,0,0,0.62), 0 10px 32px rgba(0,0,0,0.38)', position: 'relative' }}
            >
              <button
                onClick={onClose}
                aria-label="Close video"
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 30, background: 'rgba(0,0,0,0.62)', border: '1.5px solid rgba(255,255,255,0.22)', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1, transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.88)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.62)')}
              >×</button>
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ width: '100%', aspectRatio: '16 / 9', border: 'none', display: 'block' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
