import Link from 'next/link'
import Header from '@/components/Header'
import WelcomeAnimation from '@/app/components/WelcomeAnimation'

export default function Welcome() {
  return (
    <div className="flex flex-col items-center bg-white p-8 min-h-screen w-full">
      <Header />
      <WelcomeAnimation className="mt-5" />
      <h1 className="text-2xl font-bold mt-5">Welcome</h1>
      <p className="text-sm font-normal text-center mt-4">
        A brief, summary of your personal and professional background, crafted from the details you
        provide.
      </p>
      <div className="flex flex-col items-center justify-center w-full mt-auto">
        <Link
          href="/auth/signup"
          className="w-full text-sm font-semibold text-white bg-black hover:bg-gray-800 py-3.5 rounded-3xl text-center"
        >
          Sign Up
        </Link>
        <Link href="/auth/signin" className="text-sm font-normal mt-4">
          Or Sign In
        </Link>
      </div>
    </div>
  )
}
