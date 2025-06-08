'use client'
import clsx from 'clsx'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormData = {
  email: string
  password: string
}

export default function SignIn() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    const searchParams = new URLSearchParams()
    searchParams.set('email', data.email)
    router.push('/auth/signin/success')
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-start">
      <div className="w-full max-w-md space-y-20 mt-16">
        <div className="text-left text-purple-blaze">
          <Logo />
          <h2 className="text-sm font-bold text-black mt-12">Let&apos;s Start with ...</h2>
          <h3 className="mt-1.5 text-[10px] font-normal">
            don&apos;t have an account?
            <Link href="/auth/signup" className="hover:underline mx-1">
              Sign Up
            </Link>
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-xl font-bold">
              Email
            </label>
            <Input
              type="email"
              placeholder="Exp: Fari@gmail.com"
              className={clsx(
                'w-full mt-6',
                errors.email && 'border-red-500 focus-visible:ring-red-500/50'
              )}
              {...register('email', {
                required: true,
              })}
            />
            {errors.email && (
              <div className="flex gap-2 mt-1">
                <p className="text-red-500 text-xs font-light">Email or password is not exist</p>
                <Link href="/auth/signup" className="text-purple-blaze text-xs font-light">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="password" className="text-xl font-bold">
              Password
            </label>
            <Input
              type="password"
              placeholder="Exp: 1234567889@@"
              className={clsx(
                'w-full mt-6',
                errors.password && 'border-red-500 focus-visible:ring-red-500/50'
              )}
              {...register('password', {
                required: true,
              })}
            />
            <Link
              href="/auth/signin/verify"
              className="text-[10px] font-normal text-purple-blaze mt-2 block"
            >
              Login with verification code
            </Link>
          </div>

          <Button
            className="w-full bg-purple-blaze text-sm font-bold mt-56 rounded-4xl"
            type="submit"
            disabled={isSubmitting}
          >
            Lets go!
          </Button>
        </form>
      </div>
    </div>
  )
}
