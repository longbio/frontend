'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Congrats from './components/congrats'
import Header from '@/components/Header'

export default function CongratsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-between h-full p-8 bg-white">
      <div className="flex flex-col items-center">
        <Header />
        <div className="flex flex-col items-center w-full mt-12">
          <span className="text-sm font-bold text-center">
            Let&apos;s have a quick look how it works
          </span>
          <Congrats />
          <h1 className="text-xl font-bold text-center mt-2">Congrats!</h1>
          <span className="text-xs font-light text-center text-black mt-4">
            Blah Blah Blah Blah Blah Blah Blah Blah
          </span>
        </div>
      </div>
      <Button
        className="sticky bottom-0 w-full h-fit bg-purple-blaze rounded-full"
        onClick={() => router.push('/bio')}
      >
        Start free!
      </Button>
    </div>
  )
}
