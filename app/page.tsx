'use client'
import Image from 'next/image'
import Lottie from 'lottie-react'
import { useRouter } from 'next/navigation'
import logo from '../public/assets/images/logo.png'
import welcomeAnimation from '../public/assets/jsons/welcome.json'

export default function Welcome() {
  const router = useRouter()

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start gap-4 px-6">
      <Image src={logo} alt="logo" width={62} height={51} className="mt-16" />
      <Lottie animationData={welcomeAnimation} loop className="w-72 h-72" />
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p className="text-sm font-normal text-center">
        A brief, AI-powered summary of your personal and professional background, crafted from the
        details you provide.
      </p>
      <button
        onClick={() => handleNavigate('/signup')}
        className="w-full text-sm font-bold text-white bg-black py-2.5 mt-16 rounded-3xl"
      >
        Sign Up
      </button>
      <button onClick={() => handleNavigate('/signin')} className="text-sm font-normal mt-2">
        Or Sign In
      </button>
    </div>
  )
}
