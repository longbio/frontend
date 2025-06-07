'use client'
import clsx from 'clsx'
import Lottie from 'lottie-react'
import welcomeAnimation from '../../../public/assets/lottie/welcome-animation.json'

interface WelcomeAnimationProps {
  className?: string
}

export default function WelcomeAnimation({ className = '' }: WelcomeAnimationProps) {
  return (
    <Lottie animationData={welcomeAnimation} loop className={clsx('size-96 px-5', className)} />
  )
}
