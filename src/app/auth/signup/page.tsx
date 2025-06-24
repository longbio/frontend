'use client'

import { z } from 'zod'
import Link from 'next/link'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useSendOTPEmail } from '@/service/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput } from '@/app/auth/components/FormInput'

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})
type FormData = z.infer<typeof signUpSchema>

export default function SignUp() {
  const { mutateAsync } = useSendOTPEmail()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  })
  const onSubmit = async (data: FormData) => {
    await mutateAsync({ email: data.email })
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col flex-grow">
        <div>
          <Header />
          <h2 className="text-sm font-bold text-black mt-5">Let&apos;s Start with ...</h2>
          <h3 className="mt-1.5 text-black text-[10px] font-normal">
            already have an account?
            <Link href="/auth/signin" className="text-purple-blaze hover:underline mx-0.5">
              Login
            </Link>
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow mt-16">
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
            type="submit"
            className="w-full h-fit bg-purple-blaze text-sm font-bold mt-auto rounded-4xl"
          >
            Get Verification code
          </Button>
        </form>
      </div>
    </div>
  )
}
