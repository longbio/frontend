import clsx from 'clsx'
import Lottie from 'lottie-react'
import congrats from '../../../../../public/assets/lottie/congrats.json'

interface congratsProps {
  className?: string
}

export default function Congrats({ className = '' }: congratsProps) {
  return <Lottie animationData={congrats} loop className={clsx('size-96 px-5', className)} />
}
