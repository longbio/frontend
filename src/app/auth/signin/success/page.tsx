import Logo from '@/components/Logo'

export default function Success() {
  return (
    <div className="flex flex-col h-full w-full">
      <Logo className="text-left mt-2" />
      <span className="flex flex-1 text-center text-xl font-bold items-center justify-center">
        Welcome back <br />
        Farzaneh!
      </span>
    </div>
  )
}
