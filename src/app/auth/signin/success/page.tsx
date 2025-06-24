import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Success() {
  return (
    <div className="flex flex-col h-full w-full p-8">
      <Link href="/">
        <Logo className="text-left" />
      </Link>
      <span className="flex flex-1 text-center text-xl font-bold items-center justify-center">
        Welcome back <br />
        Farzaneh!
      </span>
    </div>
  )
}
