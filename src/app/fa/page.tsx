'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import WelcomeSlider from '@/app/components/WelcomeSlider'

export default function Welcome() {
  return (
    <div dir="rtl" className="flex flex-col items-center justify-between bg-white p-8 h-full w-full">
      <div className="flex flex-col items-center w-full">
        <Header />
        <WelcomeSlider className="mt-14" />
        <h1 className="text-2xl font-bold mt-5">خوش آمدید</h1>
        <p className="text-sm font-normal text-center mt-4">
        لانگ‌بیو خود را در چند دقیقه بسازید. آن را به اشتراک بگذارید تا دوستانتان شما را بهتر بشناسند.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <Link
          href="/auth/signup"
          className="w-full text-sm font-semibold text-white bg-black hover:bg-gray-800 py-3.5 rounded-3xl text-center"
        >
          ثبت نام
        </Link>
        <Link href="/auth/signin" className="text-sm font-normal p-3.5">
          یا وارد شوید
        </Link>
      </div>
      <div className="mt-8 text-center">
        <span className="text-sm text-gray-600">
          با تیم ما{' '}
          <a
            href="https://wa.me/971555345004"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            اینجا{' '}
          </a>
          {' '}در تماس باشید
        </span>
      </div>
    </div>
  )
}

