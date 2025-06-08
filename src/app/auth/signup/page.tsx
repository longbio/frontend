'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = new URLSearchParams()
    searchParams.set('email', email)
    router.push(`/auth/signup/verify?${searchParams.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-start">
      <div className="w-full max-w-md space-y-8 mt-20">
        <div className="text-left text-purple-blaze">
          <h2 className="text-sm font-bold text-black">Let&apos;s Start with ...</h2>
          <h3 className="mt-2 text-[10px] font-normal">
            already have an account?
            <Link href="/auth/login" className="hover:underline">
              Login
            </Link>
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="mt-40">
          <div className="space-y-6">
            <label htmlFor="text" className="text-xl font-bold">
              Name
            </label>
            <Input type="text" placeholder="Exp: Farzaneh" className="w-full mt-6" />
            <label htmlFor="email" className="text-xl font-bold">
              Email
            </label>
            <Input
              type="email"
              placeholder="Exp: Fari@gmail.com"
              className="w-full mt-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-purple-blaze text-sm font-bold mt-56 rounded-4xl"
            type="submit"
          >
            Get Verification code
          </Button>
        </form>
      </div>
    </div>
  )
}
