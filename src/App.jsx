import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import FloatingCard from './components/FloatingCard'
import PhotoCard    from './components/PhotoCard'
import LilyPad     from './components/LilyPad'
import Ripple      from './components/Ripple'

import bgImage    from './assets/background.jpg'
import georgiaImg from './assets/georgia.jpg'
import jssImg     from './assets/jss.jpg'
import winslowImg from './assets/winslow.jpg'
import monetImg   from './assets/monet.jpg'

import LilyPinkSvg  from './assets/lily-pink.svg?react'
import LilyWhiteSvg from './assets/lily-white.svg?react'
import LilyPadSvg   from './assets/lily-pad.svg?react'

const SVG_MAP = { pink: LilyPinkSvg, white: LilyWhiteSvg, pad: LilyPadSvg }

const VIDEOS = [
  { id: 'vGh-EvmZVCQ', x: '4%',  y: '8%'  },
  { id: 'rAUuHx3dCis', x: '68%', y: '6%'  },
  { id: 'rvtygG4n6ew', x: '18%', y: '46%' },
  { id: 'FBuxLkyH2yQ', x: '62%', y: '50%' },
  { id: '4j-8qBNEvPY', x: '5%',  y: '72%' },
  { id: 'sNroXQyAPRM', x: '67%', y: '74%' },
]

const PHOTOS = [
  { id: 'georgia', src: georgiaImg, alt: 'Georgia', x: '34%', y: '7%'  },
  { id: 'jss',     src: jssImg,     alt: 'JSS',     x: '38%', y: '35%' },
  { id: 'winslow', src: winslowImg, alt: 'Winslow', x: '26%', y: '64%' },
  { id: 'monet',   src: monetImg,   alt: 'Monet',   x: '54%', y: '77%' },
]

// 6 pink blooms, 5 white blooms, 4 pads — scattered to loosely overlap cards
const LILY_PADS = [
  { id: 'lp0',  type: 'pink',  x: '2%',  y: '5%',  scale: 1.10, rotation: -12, size: 80  },
  { id: 'lp1',  type: 'pink',  x: '70%', y: '2%',  scale: 0.82, rotation:  22, size: 80  },
  { id: 'lp2',  type: 'pink',  x: '14%', y: '44%', scale: 1.22, rotation:  -8, size: 80  },
  { id: 'lp3',  type: 'pink',  x: '63%', y: '46%', scale: 0.92, rotation:  28, size: 80  },
  { id: 'lp4',  type: 'pink',  x: '34%', y: '6%',  scale: 0.78, rotation: -25, size: 80  },
  { id: 'lp5',  type: 'pink',  x: '53%', y: '76%', scale: 1.18, rotation:  14, size: 80  },
  { id: 'lp6',  type: 'white', x: '36%', y: '30%', scale: 1.05, rotation:  -4, size: 80  },
  { id: 'lp7',  type: 'white', x: '3%',  y: '67%', scale: 0.88, rotation:  17, size: 80  },
  { id: 'lp8',  type: 'white', x: '69%', y: '70%', scale: 1.28, rotation: -20, size: 80  },
  { id: 'lp9',  type: 'white', x: '24%', y: '63%', scale: 0.95, rotation:  -9, size: 80  },
  { id: 'lp10', type: 'white', x: '48%', y: '14%', scale: 0.72, rotation:  30, size: 80  },
  { id: 'lp11', type: 'pad',   x: '80%', y: '38%', scale: 1.30, rotation:   6, size: 100 },
  { id: 'lp12', type: 'pad',   x: '46%', y: '55%', scale: 0.80, rotation: -18, size: 100 },
  { id: 'lp13', type: 'pad',   x: '19%', y: '20%', scale: 1.08, rotation:  24, size: 100 },
  { id: 'lp14', type: 'pad',   x: '72%', y: '84%', scale: 0.90, rotation: -11, size: 100 },
]

export default function App() {
  const containerRef = useRef(null)
  const [selectedId, setSelectedId] = useState(null)
  const [ripples, setRipples]       = useState([])

  const isAnySelected = selectedId !== null

  const handleBackgroundClick = useCallback((e) => {
    // Don't spawn ripple when overlay is open — overlay handles close
    if (isAnySelected) return
    const rect = containerRef.current.getBoundingClientRect()
    const x  = e.clientX - rect.left
    const y  = e.clientY - rect.top
    const id = `${Date.now()}-${Math.random()}`
    setRipples(prev => [...prev, { id, x, y }])
    // Clean up after the longest circle animation finishes
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1900)
  }, [isAnySelected])

  return (
    <div
      ref={containerRef}
      onClick={handleBackgroundClick}
      style={{
        position:            'fixed',
        inset:               0,
        overflow:            'hidden',
        backgroundImage:     `url(${bgImage})`,
        backgroundSize:      'cover',
        backgroundPosition:  'center',
        // Fallback if image not yet loaded
        backgroundColor:     '#4a8a6a',
      }}
    >
      {/* Ripples (z-index 1, behind everything interactive) */}
      {ripples.map(r => <Ripple key={r.id} x={r.x} y={r.y} />)}

      {/* Video cards (z-index 2) */}
      {VIDEOS.map((video, i) => (
        <FloatingCard
          key={video.id}
          video={video}
          loadIndex={i}
          isSelected={selectedId === video.id}
          isAnySelected={isAnySelected}
          containerRef={containerRef}
          onSelect={() => setSelectedId(video.id)}
          onClose={() => setSelectedId(null)}
        />
      ))}

      {/* Photo cards (z-index 2, stagger continues after videos) */}
      {PHOTOS.map((photo, i) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          loadIndex={VIDEOS.length + i}
          isSelected={selectedId === photo.id}
          isAnySelected={isAnySelected}
          containerRef={containerRef}
          onSelect={() => setSelectedId(photo.id)}
          onClose={() => setSelectedId(null)}
        />
      ))}

      {/* Lily pads (z-index 3 — float above cards so visitors brush them aside) */}
      {LILY_PADS.map((lily, i) => (
        <LilyPad
          key={lily.id}
          lily={lily}
          lilyIndex={i}
          SvgComponent={SVG_MAP[lily.type]}
          containerRef={containerRef}
        />
      ))}

      {/* Dark overlay — sits between content and expanded card */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => { e.stopPropagation(); setSelectedId(null) }}
            style={{
              position: 'fixed',
              inset:    0,
              background: 'rgba(0, 0, 0, 0.72)',
              zIndex:   10,
              cursor:   'pointer',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
