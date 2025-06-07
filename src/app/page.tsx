import Link from 'next/link'
import Logo from '@/components/Logo'
import WelcomeAnimation from '@/app/components/WelcomeAnimation'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start">
      <Logo className="mt-16" />
      <WelcomeAnimation />
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p className="text-sm font-normal text-center mt-7">
        A brief, AI-powered summary of your personal and professional background, crafted from the
        details you provide.
      </p>
      <Link
        href="/auth/signup"
        className="w-full text-sm font-semibold text-white bg-black py-2.5 mt-24 rounded-3xl text-center"
      >
        Sign Up
      </Link>
      <Link href="/auth/signin" className="text-sm font-normal mt-4">
        Or Sign In
      </Link>
    </div>
  )
}
