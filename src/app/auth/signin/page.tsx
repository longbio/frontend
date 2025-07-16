'use client'
import { z } from 'zod'
import Link from 'next/link'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput } from '@/app/auth/components/FormInput'

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type FormData = z.infer<typeof signInSchema>

export default function SignIn() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async () => {
    router.push('/auth/signin/success')
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col h-full gap-y-20">
        <div className="text-left text-purple-blaze">
          <Header />
          <h2 className="text-sm font-bold text-black mt-5">Let&apos;s Start with ...</h2>
          <h3 className="mt-1.5 text-black text-[10px] font-normal">
            don&apos;t have an account?
            <Link href="/auth/signup" className="text-purple-blaze hover:underline mx-0.5">
              Sign Up
            </Link>
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full">
          <div className="space-y-6">
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
            <div>
              <FormInput
                id="password"
                type="password"
                label="Password"
                placeholder="Exp: 1234567889@@"
                error={!!errors.password}
                {...register('password')}
              />
            </div>
          </div>
          <Button
            className="sticky bottom-0 w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl"
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
