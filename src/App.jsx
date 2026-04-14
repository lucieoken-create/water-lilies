import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FloatingCard from './components/FloatingCard'
import bgImage from './assets/background.jpg'

const VIDEOS = [
  { id: 'vGh-EvmZVCQ', x: '4%',  y: '8%'  },
  { id: 'rAUuHx3dCis', x: '68%', y: '6%'  },
  { id: 'rvtygG4n6ew', x: '18%', y: '46%' },
  { id: 'FBuxLkyH2yQ', x: '62%', y: '50%' },
  { id: '4j-8qBNEvPY', x: '5%',  y: '72%' },
  { id: 'sNroXQyAPRM', x: '67%', y: '74%' },
]

export default function App() {
  const containerRef = useRef(null)
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {VIDEOS.map((video, index) => (
        <FloatingCard
          key={video.id}
          video={video}
          index={index}
          isSelected={selectedId === video.id}
          isAnySelected={selectedId !== null}
          containerRef={containerRef}
          onSelect={() => setSelectedId(video.id)}
          onClose={() => setSelectedId(null)}
        />
      ))}

      {/* Dark overlay — sits between cards and expanded video */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelectedId(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.72)',
              zIndex: 10,
              cursor: 'pointer',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
