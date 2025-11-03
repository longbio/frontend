'use client'

import { useRef, useState } from 'react'
import html2canvas from '@html2canvas/html2canvas'

export default function TestPage() {
  const [screenshot, setScreenshot] = useState('')
  const screenShotRef = useRef<HTMLDivElement | null>(null)

  const takeScreenshot = async () => {
    if (!screenShotRef.current) {
      console.error('Element not found!')
      return
    }

    const canvas = await html2canvas(screenShotRef.current, {
      scale: 100,
      width: 294,
      height: 462,
    })

    const dataURL = canvas.toDataURL('image/png', 1.0)

    setScreenshot(dataURL)
  }

  return (
    <main>
      <section ref={screenShotRef}>
        <div style={{ backgroundColor: '#000000', color: '#ffffff' }}>EHSAN VA YASIN</div>
      </section>

      <div style={{ marginTop: 100, width: 300, height: 350, position: 'relative' }}>
        {screenshot && (
          <img
            src={screenshot}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        )}
      </div>

      <button onClick={takeScreenshot}>Take Screenshot</button>
    </main>
  )
}
