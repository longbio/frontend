'use client'
import { z } from 'zod'
import React from 'react'
import Header from '@/components/Header'
import { useForm } from 'react-hook-form'
import { Suspense, useEffect } from 'react'
import StickyNav from '../components/StickyNav'
import { Progress } from '@/components/ui/progress'
import { setCookie, getCookie } from '@/utils/cookie'
import LabeledInput from '../components/LabeledInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import SelectableOption from '../components/SelectableOption'
import { useUpdateUser, useUpdatePet } from '@/service/user/hook'

const petSchema = z
  .object({
    hasPet: z.boolean({ required_error: 'Selection is required.' }),
    petName: z.string().optional(),
    petBreed: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.hasPet === true) {
        return (
          data.petName && data.petName.trim() !== '' && data.petBreed && data.petBreed.trim() !== ''
        )
      }
      return true
    },
    {
      message: 'Please fill in both pet name and breed when you have a pet',
      path: ['hasPet'],
    }
  )
type PetFormType = z.infer<typeof petSchema>

function PetContent() {
  const router = useRouter()
  const mutation = useUpdateUser()
  const petMutation = useUpdatePet()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || ''
  const isEditMode = searchParams.get('edit') === 'true'
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormType>({
    resolver: zodResolver(petSchema),
    mode: 'onChange',
    defaultValues: { hasPet: undefined },
  })
  const hasPet = watch('hasPet')
  const petName = watch('petName')
  const petBreed = watch('petBreed')

  useEffect(() => {
    const cookie = getCookie('info_pet')
    if (cookie) {
      try {
        const data = JSON.parse(decodeURIComponent(cookie))
        if (data.hasPet !== undefined) {
          setValue('hasPet', data.hasPet)
        }
        if (data.petName) {
          setValue('petName', data.petName)
        }
        if (data.petBreed) {
          setValue('petBreed', data.petBreed)
        }
      } catch {}
    }
  }, [setValue])

  React.useEffect(() => {
    setCookie('info_pet', JSON.stringify({ hasPet, petName, petBreed }))
  }, [hasPet, petName, petBreed])

  const onSubmit = async (data: PetFormType) => {
    try {
      // Update user with pet status
      await mutation.mutateAsync({
        pet: {
          hasPet: data.hasPet,
          type: data.petBreed || '',
          breed: data.petBreed || '',
        },
      })

      if (data.hasPet === true) {
        if (
          !data.petName ||
          data.petName.trim() === '' ||
          !data.petBreed ||
          data.petBreed.trim() === ''
        ) {
          return
        }

        const petData = {
          name: data.petName.trim(),
          breed: data.petBreed.trim(),
        }

        await petMutation.mutateAsync(petData)
      }
    } catch (err) {
      console.error('Failed to update pet info', err)
    }

    // If in edit mode, return to bio page, otherwise continue to next step
    if (isEditMode) {
      router.push('/bio')
    } else {
      router.push(`/info/sport?name=${name}`)
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-8">
      <Progress value={64.32} className="shrink-0" />
      <Header className="mt-4" showBackButton />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between h-full mt-2">
        <div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold text-left w-full">
              Welcome to <br /> LongBio, {name}!
            </h1>
            <span className="text-sm font-normal text-left w-full">
              Let&apos;s talk about your pets.
            </span>
          </div>
          <div className="flex flex-col space-y-6 w-full mt-20">
            <span className="text-xl font-bold">Do you have pet?</span>
            <SelectableOption
              id="hasPetYes"
              label="Yes I have it!"
              checked={hasPet === true}
              onCheckedChange={() => setValue('hasPet', true, { shouldValidate: true })}
              className="mb-2"
            />
            <SelectableOption
              id="hasPetNo"
              label="No I don't."
              checked={hasPet === false}
              onCheckedChange={() => setValue('hasPet', false, { shouldValidate: true })}
            />
            {errors.hasPet && (
              <div className="text-red-500 text-sm mt-2">{errors.hasPet.message}</div>
            )}
          </div>
          {hasPet && (
            <div className="flex flex-col space-y-6 w-full my-24">
              <h3 className="text-xl font-bold">What is your pet&apos;s name?</h3>
              <LabeledInput
                id="petName"
                placeholder="Exp: Woody"
                type="text"
                error={!!errors.petName}
                {...register('petName')}
              />
              <h3 className="text-xl font-bold">What is the breed of your pet?</h3>
              <LabeledInput
                placeholder="Exp: German Shepherd"
                type="text"
                error={!!errors.petBreed}
                {...register('petBreed')}
              />
            </div>
          )}
        </div>
        <StickyNav
          onNext={handleSubmit(onSubmit)}
          onSkip={() => {
            if (isEditMode) {
              router.push('/bio')
            } else {
              router.push(`/info/sport?name=${name}`)
            }
          }}
        />
      </form>
    </div>
  )
}
export default function Pet() {
  return (
    <Suspense>
      <PetContent />
    </Suspense>
  )
}
