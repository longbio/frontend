'use client'
import clsx from 'clsx'
import { z } from 'zod'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput } from '@/app/auth/components/FormInput'

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
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
    // Here you would typically validate credentials with your backend
    // For now, we'll just redirect to success
    router.push('/auth/signin/success')
  }

  const handleVerificationClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const email = watch('email')
    if (!email) return

    const searchParams = new URLSearchParams()
    searchParams.set('email', email)
    router.push(`/auth/signin/verify?${searchParams.toString()}`)
  }

  const email = watch('email')

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
          <FormInput
            id="email"
            type="email"
            label="Email"
            placeholder="Exp: Fari@gmail.com"
            error={!!errors.email}
            {...register('email')}
          />
          <div>
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
