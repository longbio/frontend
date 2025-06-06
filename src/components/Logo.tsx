import Image from 'next/image'
import logo from '@/public/assets/images/logo.png'

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return <Image src={logo} alt="logo" width={62} height={51} className={className} />
}
