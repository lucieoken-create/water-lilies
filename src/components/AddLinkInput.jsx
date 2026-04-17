import { useState } from 'react'

function parseUrl(raw) {
  const url = raw.trim()
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (yt) return { type: 'youtube', videoId: yt[1] }
  try { new URL(url); return { type: 'image', src: url } } catch { return null }
}

export default function AddLinkInput({ onAdd }) {
  const [value, setValue] = useState('')

  const submit = (raw) => {
    const parsed = parseUrl(raw)
    if (parsed) { onAdd(parsed); setValue('') }
  }

  return (
    <div
      style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 40 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          fontSize:      10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.4)',
          fontFamily:    'system-ui, -apple-system, sans-serif',
          marginBottom:  5,
          paddingLeft:   12,
        }}
      >
        + add a link
      </div>
      <input
        type="text"
        value={value}
        placeholder="youtube or image url"
        onChange={(e) => setValue(e.target.value)}
        onPaste={(e) => {
          e.preventDefault()
          submit(e.clipboardData.getData('text'))
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter')  submit(value)
          if (e.key === 'Escape') { setValue(''); e.target.blur() }
        }}
        style={{
          width:              200,
          padding:            '7px 14px',
          borderRadius:       20,
          border:             '1px solid rgba(255,255,255,0.18)',
          background:         'rgba(255,255,255,0.1)',
          backdropFilter:     'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color:              'rgba(255,255,255,0.85)',
          fontSize:           11.5,
          outline:            'none',
          fontFamily:         'system-ui, -apple-system, sans-serif',
          boxSizing:          'border-box',
        }}
      />
    </div>
  )
}
