'use client'

import clsx from 'clsx'
import { z } from 'zod'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { setCookie, removeAllCookies } from '@/utils/cookie'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSendOTPEmail } from '@/service/auth/hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput } from '@/app/auth/components/FormInput'
import { PhoneInput } from '@/app/auth/components/PhoneInput'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { defaultCountry } from '@/utils/countryDialCodes'

const signUpEmailSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
})

const signUpPhoneSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid WhatsApp phone number with country code'),
})

type EmailFormData = z.infer<typeof signUpEmailSchema>
type PhoneFormData = z.infer<typeof signUpPhoneSchema>

export default function SignUp() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('phone')
  const { mutateAsync, isPending } = useSendOTPEmail({ mode: 'signup' })
  const [countryCode, setCountryCode] = useState(defaultCountry.dialCode)
  const [phoneNumberValue, setPhoneNumberValue] = useState('')

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(signUpEmailSchema),
    defaultValues: { name: '', email: '' },
  })

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(signUpPhoneSchema),
    defaultValues: { name: '', phoneNumber: '' },
  })

  const name = activeTab === 'email' ? emailForm.watch('name') : phoneForm.watch('name')
  const email = emailForm.watch('email')
  const phoneNumber = countryCode + phoneNumberValue

  useEffect(() => {
    // Remove all cookies on page load
    removeAllCookies()
  }, [])

  useEffect(() => {
    if (activeTab === 'email') {
      setCookie('auth_signup', JSON.stringify({ name, email }))
    } else {
      setCookie('auth_signup', JSON.stringify({ name, phoneNumber }))
    }
  }, [name, email, phoneNumber, activeTab])

  // Update form value when phone number changes
  useEffect(() => {
    if (phoneNumber) {
      phoneForm.setValue('phoneNumber', phoneNumber)
    }
  }, [phoneNumber, phoneForm])

  const onEmailSubmit = async (data: EmailFormData) => {
    await mutateAsync({ email: data.email })
    const encodedEmail = encodeURIComponent(data.email)
    const encodedName = encodeURIComponent(data.name)

    router.push(`/auth/signup/verify?email=${encodedEmail}&name=${encodedName}`)
  }

  const onPhoneSubmit = async (data: PhoneFormData) => {
    // Remove "+" sign before sending
    const phoneNumberWithoutPlus = data.phoneNumber.replace(/^\+/, '')
    await mutateAsync({ phoneNumber: phoneNumberWithoutPlus })
    const encodedPhone = encodeURIComponent(data.phoneNumber)
    const encodedName = encodeURIComponent(data.name)

    router.push(`/auth/signup/verify?phoneNumber=${encodedPhone}&name=${encodedName}`)
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col h-full gap-y-20">
        <div>
          <Header />
          <div className="flex items-center text-xl font-bold text-gray-500 mt-6 mb-2">
            Hi
            <h1 className={clsx(name && 'text-xl ml-2', 'text-black')}>{name}</h1>
            <h4 className="px-0.5 text-black">!</h4>
          </div>
          <h3 className="text-sm text-black font-normal">
            already have an account?{' '}
            <Link href="/auth/signin" className="text-purple-blaze hover:underline">
              Login
            </Link>
          </h3>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'email' | 'phone')} className="flex flex-col justify-between h-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-full p-1">
            <TabsTrigger
              value="phone"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:text-purple-blaze data-[state=active]:shadow-sm"
            >
              Phone
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:text-purple-blaze data-[state=active]:shadow-sm"
            >
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phone" className="flex flex-col justify-between h-full mt-8">
            <form
              onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
              className="flex flex-col justify-between h-full"
              autoComplete="off"
            >
              <div className="space-y-8">
                <FormInput
                  id="name"
                  type="text"
                  label="Full Name"
                  placeholder="Exp: Jessica"
                  error={!!phoneForm.formState.errors.name}
                  autoComplete="off"
                  {...phoneForm.register('name')}
                />
                {phoneForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-2 ml-1">{phoneForm.formState.errors.name.message}</p>
                )}
                <PhoneInput
                  id="phoneNumber"
                  label="Phone Number"
                  value={phoneNumberValue}
                  onChange={(value) => {
                    setPhoneNumberValue(value)
                    phoneForm.setValue('phoneNumber', countryCode + value, { shouldValidate: true })
                  }}
                  countryCode={countryCode}
                  onCountryCodeChange={(dialCode) => {
                    setCountryCode(dialCode)
                    phoneForm.setValue('phoneNumber', dialCode + phoneNumberValue, { shouldValidate: true })
                  }}
                  error={!!phoneForm.formState.errors.phoneNumber}
                  autoComplete="off"
                />
                <p className="text-sm text-gray-600 mt-1 ml-1">
                  The verification code will be sent to your <span className="font-bold">WhatsApp</span>
                </p>
                {phoneForm.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-2 ml-1">{phoneForm.formState.errors.phoneNumber.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isPending}
                aria-busy={isPending}
                className="sticky bottom-0 w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? 'Sending...' : 'Get Verification code'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="email" className="flex flex-col justify-between h-full mt-8">
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="flex flex-col justify-between h-full"
              autoComplete="off"
            >
              <div className="space-y-8">
                <FormInput
                  id="name"
                  type="text"
                  label="Full Name"
                  placeholder="Exp: Jessica"
                  error={!!emailForm.formState.errors.name}
                  autoComplete="off"
                  {...emailForm.register('name')}
                />
                {emailForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-2 ml-1">{emailForm.formState.errors.name.message}</p>
                )}
                <FormInput
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="Exp: Jessica@gmail.com"
                  error={!!emailForm.formState.errors.email}
                  autoComplete="off"
                  {...emailForm.register('email')}
                />
                <p className="text-sm text-gray-600 mt-1 ml-1">
                  The verification code will be sent to your <span className="font-bold">Email</span>
                </p>
                {emailForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-2 ml-1">{emailForm.formState.errors.email.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isPending}
                aria-busy={isPending}
                className="sticky bottom-0 w-full h-fit bg-purple-blaze text-sm font-bold rounded-4xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? 'Sending...' : 'Get Verification code'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
