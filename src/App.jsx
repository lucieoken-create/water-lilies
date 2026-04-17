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

// 6 pink blooms, 5 white blooms, 4 pads
// Scale 1.5–2.5, rotation ±10° — positioned directly over cards so visitors brush them aside
// Card reference: V1(4%,8%) V2(68%,6%) V3(18%,46%) V4(62%,50%) V5(5%,72%) V6(67%,74%)
//                 georgia(34%,7%) jss(38%,35%) winslow(26%,64%) monet(54%,77%)
const LILY_PADS = [
  { id: 'lp0',  type: 'pink',  x: '1%',  y: '3%',  scale: 1.8, rotation:  -7, size: 80  }, // over V1
  { id: 'lp1',  type: 'pink',  x: '65%', y: '2%',  scale: 2.1, rotation:   8, size: 80  }, // over V2
  { id: 'lp2',  type: 'pink',  x: '14%', y: '42%', scale: 1.9, rotation:  -5, size: 80  }, // over V3
  { id: 'lp3',  type: 'pink',  x: '59%', y: '45%', scale: 2.3, rotation:   9, size: 80  }, // over V4
  { id: 'lp4',  type: 'pink',  x: '31%', y: '3%',  scale: 1.7, rotation:  -8, size: 80  }, // over georgia
  { id: 'lp5',  type: 'pink',  x: '51%', y: '73%', scale: 2.0, rotation:   6, size: 80  }, // over monet
  { id: 'lp6',  type: 'white', x: '35%', y: '30%', scale: 1.6, rotation:  -4, size: 80  }, // over jss
  { id: 'lp7',  type: 'white', x: '2%',  y: '68%', scale: 2.2, rotation:   7, size: 80  }, // over V5
  { id: 'lp8',  type: 'white', x: '64%', y: '69%', scale: 1.8, rotation:  -9, size: 80  }, // over V6
  { id: 'lp9',  type: 'white', x: '23%', y: '60%', scale: 2.0, rotation:   5, size: 80  }, // over winslow
  { id: 'lp10', type: 'white', x: '45%', y: '10%', scale: 1.5, rotation:  -6, size: 80  }, // between cards
  { id: 'lp11', type: 'pad',   x: '77%', y: '34%', scale: 2.5, rotation:   4, size: 100 }, // near V4
  { id: 'lp12', type: 'pad',   x: '42%', y: '50%', scale: 1.8, rotation:  -8, size: 100 }, // over jss/center
  { id: 'lp13', type: 'pad',   x: '16%', y: '16%', scale: 2.2, rotation:   7, size: 100 }, // over V1 area
  { id: 'lp14', type: 'pad',   x: '69%', y: '80%', scale: 1.9, rotation:  -3, size: 100 }, // over V6/monet
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
