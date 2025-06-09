'use client'
import { z } from 'zod'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput } from '@/app/auth/components/FormInput'

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

type FormData = z.infer<typeof signUpSchema>

export default function SignUp() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  })

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
            <FormInput
              id="name"
              type="text"
              label="Name"
              placeholder="Exp: Farzaneh"
              error={!!errors.name}
              {...register('name')}
            />
            <FormInput
              id="email"
              type="email"
              label="Email"
              placeholder="Exp: Fari@gmail.com"
              error={!!errors.email}
              {...register('email')}
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
