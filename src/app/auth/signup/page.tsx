'use client'
import clsx from 'clsx'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormData = {
  name: string
  email: string
}

export default function SignUp() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    const searchParams = new URLSearchParams()
    searchParams.set('email', data.email)
    router.push(`/auth/signup/verify?${searchParams.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-start">
      <div className="w-full max-w-md space-y-8 mt-16">
        <div className="text-left text-purple-blaze">
          <Logo />
          <h2 className="text-sm font-bold text-black mt-12">Let&apos;s Start with ...</h2>
          <h3 className="mt-1.5 text-[10px] font-normal">
            already have an account?
            <Link href="/auth/login" className="hover:underline">
              Login
            </Link>
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-40">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="text-xl font-bold">
                Name
              </label>
              <Input
                type="text"
                placeholder="Exp: Farzaneh"
                className={clsx(
                  'w-full mt-6',
                  errors.name && 'border-red-500 focus-visible:ring-0'
                )}
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs font-light mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="text-xl font-bold">
                Email
              </label>
              <Input
                type="email"
                placeholder="Exp: Fari@gmail.com"
                className={clsx(
                  'w-full mt-6',
                  errors.email && 'border-red-500 focus-visible:ring-0'
                )}
                {...register('email', {
                  required: 'Email is required',
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-light mt-1">{errors.email.message}</p>
              )}
            </div>
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
