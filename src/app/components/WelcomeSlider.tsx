'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Lottie from 'lottie-react'
import clsx from 'clsx'
import welcomeAnimation from '../../../public/assets/lottie/welcome-animation.json'
import mainSceneAnimation from '../../../public/assets/lottie/half-preview.json'

interface WelcomeSliderProps {
  className?: string
  direction?: 'ltr' | 'rtl'
}

export default function WelcomeSlider({ className = '', direction = 'ltr' }: WelcomeSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // Auto-scroll every 1 second
  useEffect(() => {
    if (!emblaApi) return

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        scrollNext()
      }, 3000)
    }

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }

    startAutoplay()

    // Pause on interaction
    emblaApi.on('pointerDown', stopAutoplay)
    emblaApi.on('pointerUp', startAutoplay)

    return () => {
      stopAutoplay()
      emblaApi.off('pointerDown', stopAutoplay)
      emblaApi.off('pointerUp', startAutoplay)
    }
  }, [emblaApi, scrollNext])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const slides = [
    {
      data: mainSceneAnimation,
      key: 'main-scene',
    },
    {
      data: welcomeAnimation,
      key: 'welcome',
    },
  ]

  return (
    <div className={clsx('w-full max-w-md', className)}>
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.key}
              className="flex-[0_0_100%] min-w-0 flex items-center justify-center"
            >
              <Lottie
                animationData={slide.data}
                loop
                className="w-full h-auto px-5"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((slide, index) => (
          <button
            key={slide.key}
            type="button"
            onClick={() => scrollTo(index)}
            className={clsx(
              'w-2.5 h-2.5 rounded-full transition-all duration-300',
              selectedIndex === index
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

