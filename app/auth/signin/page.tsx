'use client'
import Image from 'next/image'
import logo from '@/public/assets/images/logo.png'

export default function SignIn() {
  return (
    <div className="flex flex-col items-start justify-center">
      <Image src={logo} alt="logo" width={62} height={51} className="mt-16" />
      <div>
        <h2>
          Hi!
          <br /> Nice to see you again!
        </h2>
        <p>dont have an account? Login</p>
      </div>

      <form className="w-full">
        <label htmlFor="email" className="text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Exp: Fari@gmail.com"
          className="w-full border rounded-2xl"
        />
        <label htmlFor="email" className="text-sm font-medium mb-2">
          Password
        </label>
        <input
          id="Password"
          type="Password"
          placeholder="Exp: 1234567889@@"
          className="w-full border rounded-2xl"
        />
        <button
          type="submit"
          className="w-full text-sm font-bold text-white bg-black py-2.5 mt-16 rounded-3xl"
        >
          Lets go!
        </button>
      </form>
    </div>
  )
}
