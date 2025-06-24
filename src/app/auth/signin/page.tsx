'use client'
import clsx from 'clsx'
import { z } from 'zod'
import Link from 'next/link'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput } from '@/app/auth/components/FormInput'

const signInSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
})

type FormData = z.infer<typeof signInSchema>

export default function SignIn() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async () => {
    // typically validate credentials with backend
    // For now, we'll just redirect to success
    router.push('/auth/signin/success')
  }

  const handleVerificationClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const email = watch('email')
    if (!email) return

    const url = new URL('/auth/signin/verify', window.location.origin)
    url.searchParams.set('email', email)
    router.push(url.toString())
  }

  const email = watch('email')

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col flex-grow">
        <div className="text-left text-purple-blaze">
          <Header />
          <h2 className="text-sm font-bold text-black mt-8">Let&apos;s Start with ...</h2>
          <h3 className="mt-1.5 text-black text-[10px] font-normal">
            don&apos;t have an account?
            <Link href="/auth/signup" className="text-purple-blaze hover:underline mx-0.5">
              Sign Up
            </Link>
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow mt-20">
          <div>
            <FormInput
              id="email"
              type="email"
              label="Email"
              placeholder="Exp: Fari@gmail.com"
              error={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <div className="absolute text-red-500 text-xs font-light mt-1">
                email or password is not exist
                <Link href="/auth/signup" className="text-purple-blaze px-1 hover:underline">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="mt-6">
            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="Exp: 1234567889@@"
              error={!!errors.password}
              {...register('password')}
            />
            <button
              type="button"
              onClick={handleVerificationClick}
              className={clsx(
                'text-purple-blaze text-[10px] font-normal mt-2 block',
                email ? 'hover:underline' : 'cursor-not-allowed'
              )}
              disabled={!email}
            >
              Login with verification code
            </button>
          </div>

          <Button
            className="w-full h-fit bg-purple-blaze text-sm font-bold mt-auto rounded-4xl"
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
