import Link from 'next/link'
import Header from '@/components/Header'
import WelcomeAnimation from '@/app/components/WelcomeAnimation'

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-between bg-white p-8 h-full w-full">
      <div className="flex flex-col items-center">
        <Header />
        <WelcomeAnimation className="mt-14" />
        <h1 className="text-2xl font-bold mt-5">Welcome</h1>
        <p className="text-sm font-normal text-center mt-4">
          Create your Longbio profile in minutes. Share it so your friends and community can get to
          know you better.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <Link
          href="/auth/signup"
          className="w-full text-sm font-semibold text-white bg-black hover:bg-gray-800 py-3.5 rounded-3xl text-center"
        >
          Sign Up
        </Link>
        <Link href="/auth/signin" className="text-sm font-normal p-3.5">
          Or Sign In
        </Link>
      </div>
    </div>
  )
}
