'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Congrats from './components/congrats'

export default function CongratsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen items-center justify-between p-8 bg-white">
      <div />
      <div className="flex flex-col items-center w-full">
        <span className="text-sm font-bold text-center mb-4 mt-2 text-black/80">
          Let&apos;s have a quick look how it works
        </span>
        <Congrats className="my-2" />
        <h1 className="text-xl font-bold text-center mt-2">Congrats!</h1>
        <span className="text-xs font-light text-center text-black mt-4">
          Blah Blah Blah Blah Blah Blah Blah Blah
        </span>
      </div>
      <Button
        className="w-full h-full max-w-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-full py-3 mt-8 shadow-md"
        onClick={() => router.push('/')}
      >
        Start free!
      </Button>
    </div>
  )
}
