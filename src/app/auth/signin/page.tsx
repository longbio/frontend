'use client'

import { z } from 'zod'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { setCookie, removeAllCookies } from '@/utils/cookie'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSendOTPEmail } from '@/service/auth/hook'
import { FormInput } from '@/app/auth/components/FormInput'
import { PhoneInput } from '@/app/auth/components/PhoneInput'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { defaultCountry } from '@/utils/countryDialCodes'
import { useIranPhoneNormalizer } from '@/hooks/useIranPhoneNormalizer'

const signInEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const signInPhoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number with country code'),
})

type EmailFormData = z.infer<typeof signInEmailSchema>
type PhoneFormData = z.infer<typeof signInPhoneSchema>

export default function SignIn() {
  const [isIranTimezone, setIsIranTimezone] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email')
  const { mutateAsync, isPending } = useSendOTPEmail({ mode: 'signin' })
  const [countryCode, setCountryCode] = useState(defaultCountry.dialCode)
  const [phoneNumberValue, setPhoneNumberValue] = useState('')
  const { normalizeIranPhone } = useIranPhoneNormalizer()

  // Check client timezone on mount
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const isIran = timezone === 'Asia/Tehran'
    setIsIranTimezone(isIran)
    if (isIran) {
      setActiveTab('phone')
    }
  }, [])

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(signInEmailSchema),
    defaultValues: { email: '' },
  })

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(signInPhoneSchema),
    defaultValues: { phoneNumber: '' },
  })

  const email = emailForm.watch('email')
  const phoneNumber = countryCode + phoneNumberValue

  useEffect(() => {
    // Remove all cookies on page load
    removeAllCookies()
  }, [])

  useEffect(() => {
    if (activeTab === 'email') {
      setCookie('auth_signin', JSON.stringify({ email }))
    } else {
      setCookie('auth_signin', JSON.stringify({ phoneNumber }))
    }
  }, [email, phoneNumber, activeTab])

  // Update form value when phone number changes
  useEffect(() => {
    if (phoneNumber) {
      phoneForm.setValue('phoneNumber', phoneNumber)
    }
  }, [phoneNumber, phoneForm])

  const onEmailSubmit = async (data: EmailFormData) => {
    await mutateAsync({ email: data.email })
  }

  const onPhoneSubmit = async (data: PhoneFormData) => {
    // Remove "+" sign before sending
    const phoneNumberWithoutPlus = data.phoneNumber.replace(/^\+/, '')
    await mutateAsync({ phoneNumber: phoneNumberWithoutPlus })
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="w-full flex flex-col h-full gap-y-20">
        <div>
          <Header />
          <h2 className="text-2xl font-bold text-black mt-6 mb-2">Welcome Back!</h2>
          <h3 className="text-sm text-black font-normal">
            don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-purple-blaze hover:underline">
              Sign Up
            </Link>
          </h3>
        </div>

        {/* Show loading state while checking timezone */}
        {isIranTimezone === null ? (
          <div className="flex flex-col justify-between h-full" />
        ) : isIranTimezone ? (
          /* Iran timezone: show both tabs */
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
                  <PhoneInput
                    id="phoneNumber"
                    label="Phone Number"
                    value={phoneNumberValue}
                    onChange={(value) => {
                      const normalizedValue = normalizeIranPhone(countryCode, value)
                      setPhoneNumberValue(normalizedValue)
                      phoneForm.setValue('phoneNumber', countryCode + normalizedValue, { shouldValidate: true })
                    }}
                    countryCode={countryCode}
                    onCountryCodeChange={(dialCode) => {
                      const normalizedValue = normalizeIranPhone(dialCode, phoneNumberValue)
                      setCountryCode(dialCode)
                      setPhoneNumberValue(normalizedValue)
                      phoneForm.setValue('phoneNumber', dialCode + normalizedValue, { shouldValidate: true })
                    }}
                    error={!!phoneForm.formState.errors.phoneNumber}
                    autoComplete="off"
                  />
                  <p className="text-sm text-gray-600 mt-1 ml-1">
                    The verification code will be sent via <span className="font-bold">SMS</span>
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
        ) : (
          /* Non-Iran timezone: show only email form without tabs */
          <div className="flex flex-col justify-between h-full">
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="flex flex-col justify-between h-full"
              autoComplete="off"
            >
              <div className="space-y-8">
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
          </div>
        )}
      </div>
    </div>
  )
}
