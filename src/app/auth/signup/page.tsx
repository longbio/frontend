'use client'

import clsx from 'clsx'
import { z } from 'zod'
import Link from 'next/link'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useSendOTPEmail } from '@/service/auth/hook'
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
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  })
  const name = watch('name')
  const onSubmit = async (data: FormData) => {
    await mutateAsync({ email: data.email })
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col h-full gap-y-20">
        <div>
          <Header />
          <div className="flex items-center text-sm font-bold text-black mt-5">
            hi
            <h1 className={clsx(name && 'ml-1.5', 'text-gray-500')}>{name}</h1>
            <h4 className="px-0.5">!</h4>
          </div>
          <h3 className="mt-1.5 text-black text-[10px] font-normal">
            already have an account?
            <Link href="/auth/signin" className="text-purple-blaze hover:underline mx-0.5">
              Login
            </Link>
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full">
          <div className="space-y-6">
            <FormInput
              id="name"
              type="text"
              label="Full Name"
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
            className="sticky bottom-0 w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl"
          >
            Get Verification code
          </Button>
        </form>
      </div>
    </div>
  )
}
