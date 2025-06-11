import Logo from '@/components/Logo'

export default function Success() {
  return (
    <div className="flex flex-col h-screen">
      <Logo className="text-left mt-16" />
      <span className="flex h-full text-center text-xl font-bold items-center justify-center">
        Welcome back <br />
        Farzaneh!
      </span>
    </div>
  )
}
