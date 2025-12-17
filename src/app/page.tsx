import Link from 'next/link'
import Header from '@/components/Header'
import WelcomeSlider from '@/app/components/WelcomeSlider'

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-between bg-white p-8 h-full w-full">
      <div className="flex flex-col items-center w-full">
        <Header />
        <WelcomeSlider className="mt-14" />
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
      <div className="mt-8 text-center">
        <span className="text-sm text-gray-600">
          Get in touch with our team{' '}
          <a
            href="https://wa.me/971555345004"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            here
          </a>
        </span>
      </div>
    </div>
  )
}
