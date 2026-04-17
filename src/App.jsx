import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import FloatingCard  from './components/FloatingCard'
import PhotoCard     from './components/PhotoCard'
import LilyPad      from './components/LilyPad'
import CurtainPad   from './components/CurtainPad'
import Ripple        from './components/Ripple'
import AddLinkInput  from './components/AddLinkInput'

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
  { id: 'WCuZRbHER0g', x: '80%', y: '22%' },
]

const PHOTOS = [
  { id: 'georgia', src: georgiaImg, alt: 'Georgia', x: '34%', y: '7%'  },
  { id: 'jss',     src: jssImg,     alt: 'JSS',     x: '38%', y: '35%' },
  { id: 'winslow', src: winslowImg, alt: 'Winslow', x: '26%', y: '64%' },
  { id: 'monet',   src: monetImg,   alt: 'Monet',   x: '54%', y: '77%' },
]

// 10 ambient pads — always present, in open water away from cards
const AMBIENT_PADS = [
  { id: 'ap0', type: 'pad',   x: '86%', y: '3%',  scale: 1.8, rotation:  -8, size: 100 },
  { id: 'ap1', type: 'pink',  x: '88%', y: '40%', scale: 1.5, rotation:  13, size: 80  },
  { id: 'ap2', type: 'white', x: '47%', y: '91%', scale: 1.9, rotation:  -5, size: 80  },
  { id: 'ap3', type: 'pink',  x: '-1%', y: '52%', scale: 1.4, rotation:   7, size: 80  },
  { id: 'ap4', type: 'pad',   x: '81%', y: '84%', scale: 2.0, rotation: -14, size: 100 },
  { id: 'ap5', type: 'white', x: '2%',  y: '90%', scale: 1.6, rotation:  10, size: 80  },
  { id: 'ap6', type: 'pink',  x: '11%', y: '22%', scale: 1.5, rotation:  15, size: 80  },
  { id: 'ap7', type: 'pad',   x: '91%', y: '10%', scale: 1.6, rotation:  -6, size: 100 },
  { id: 'ap8', type: 'white', x: '57%', y: '89%', scale: 1.8, rotation:   8, size: 80  },
  { id: 'ap9', type: 'pink',  x: '32%', y: '92%', scale: 1.4, rotation: -11, size: 80  },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function loadRemovedIds() {
  try { return new Set(JSON.parse(localStorage.getItem('wl-removed') || '[]')) }
  catch { return new Set() }
}

function loadUserCards() {
  try { return JSON.parse(localStorage.getItem('wl-user-cards') || '[]') }
  catch { return [] }
}

export default function App() {
  const containerRef = useRef(null)
  const isMobile     = useIsMobile()

  const [selectedId,        setSelectedId]        = useState(null)
  const [ripples,           setRipples]           = useState([])
  const [removedIds,        setRemovedIds]        = useState(loadRemovedIds)
  const [userCards,         setUserCards]         = useState(loadUserCards)
  const [curtainScattering, setCurtainScattering] = useState(false)
  const [showCurtain,       setShowCurtain]       = useState(true)

  // Curtain dwells 2s, scatters over 2.8s, removed from DOM at 4.8s
  useEffect(() => {
    const t1 = setTimeout(() => setCurtainScattering(true),  2000)
    const t2 = setTimeout(() => setShowCurtain(false),       4800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const isAnySelected = selectedId !== null

  const removeCard = useCallback((id) => {
    setRemovedIds(prev => {
      const next = new Set(prev)
      next.add(id)
      try { localStorage.setItem('wl-removed', JSON.stringify([...next])) } catch {}
      return next
    })
    setSelectedId(s => s === id ? null : s)
  }, [])

  const removeUserCard = useCallback((id) => {
    setUserCards(prev => {
      const next = prev.filter(c => c.id !== id)
      try { localStorage.setItem('wl-user-cards', JSON.stringify(next)) } catch {}
      return next
    })
    setSelectedId(s => s === id ? null : s)
  }, [])

  const handleAddLink = useCallback((parsed) => {
    const id = `user-${Date.now()}`
    const x  = `${25 + Math.random() * 50}%`
    const y  = `${20 + Math.random() * 40}%`
    const card = parsed.type === 'youtube'
      ? { id, type: 'youtube', videoId: parsed.videoId, x, y }
      : { id, type: 'image',   src: parsed.src, alt: 'Added image', x, y }
    setUserCards(prev => {
      const next = [...prev, card]
      try { localStorage.setItem('wl-user-cards', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const handleClick = useCallback((e) => {
    if (isAnySelected) return
    const id = `${Date.now()}-${Math.random()}`
    setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1900)
  }, [isAnySelected])

  const visibleVideos = VIDEOS.filter(v => !removedIds.has(v.id))
  const visiblePhotos = PHOTOS.filter(p => !removedIds.has(p.id))
  const allCardsCount = visibleVideos.length + visiblePhotos.length

  const curtainEl = showCurtain && (
    <CurtainPad scattering={curtainScattering} SVG_MAP={SVG_MAP} />
  )

  const ambientEl = AMBIENT_PADS.map((lily, i) => (
    <LilyPad
      key={lily.id}
      lily={lily}
      lilyIndex={i}
      SvgComponent={SVG_MAP[lily.type]}
      containerRef={containerRef}
      ambient
    />
  ))

  const overlay = (
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
            position:   'fixed',
            inset:      0,
            background: 'rgba(0, 0, 0, 0.72)',
            zIndex:     10,
            cursor:     'pointer',
          }}
        />
      )}
    </AnimatePresence>
  )

  const cards = (
    <>
      {visibleVideos.map((video, i) => (
        <FloatingCard
          key={video.id}
          video={video}
          loadIndex={i}
          isSelected={selectedId === video.id}
          isAnySelected={isAnySelected}
          containerRef={containerRef}
          onSelect={() => setSelectedId(video.id)}
          onClose={() => setSelectedId(null)}
          onRemove={() => removeCard(video.id)}
          isMobile={isMobile}
        />
      ))}
      {visiblePhotos.map((photo, i) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          loadIndex={visibleVideos.length + i}
          isSelected={selectedId === photo.id}
          isAnySelected={isAnySelected}
          containerRef={containerRef}
          onSelect={() => setSelectedId(photo.id)}
          onClose={() => setSelectedId(null)}
          onRemove={() => removeCard(photo.id)}
          isMobile={isMobile}
        />
      ))}
      {userCards.map((card, i) =>
        card.type === 'youtube' ? (
          <FloatingCard
            key={card.id}
            video={{ id: card.videoId, x: card.x, y: card.y }}
            loadIndex={allCardsCount + i}
            isSelected={selectedId === card.id}
            isAnySelected={isAnySelected}
            containerRef={containerRef}
            onSelect={() => setSelectedId(card.id)}
            onClose={() => setSelectedId(null)}
            onRemove={() => removeUserCard(card.id)}
            isMobile={isMobile}
          />
        ) : (
          <PhotoCard
            key={card.id}
            photo={{ id: card.id, src: card.src, alt: card.alt, x: card.x, y: card.y }}
            loadIndex={allCardsCount + i}
            isSelected={selectedId === card.id}
            isAnySelected={isAnySelected}
            containerRef={containerRef}
            onSelect={() => setSelectedId(card.id)}
            onClose={() => setSelectedId(null)}
            onRemove={() => removeUserCard(card.id)}
            isMobile={isMobile}
          />
        )
      )}
    </>
  )

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        position: 'fixed', inset: 0, overflow: 'hidden',
        backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundColor: '#4a8a6a',
      }}
    >
      {ripples.map(r => <Ripple key={r.id} x={r.x} y={r.y} />)}
      {curtainEl}
      {ambientEl}
      {cards}
      {overlay}
      <AddLinkInput onAdd={handleAddLink} />
    </div>
  )
}
