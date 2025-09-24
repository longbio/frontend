import clsx from 'clsx'
import Logo from './Logo'
import BackButton from './BackButton'
import Link from 'next/link'

type HeaderProps = {
  className?: string
  showBackButton?: boolean
}

export default function Header({ className, showBackButton = false }: HeaderProps) {
  return (
    <header className={clsx('flex items-center justify-between', className)}>
      <Link href="/">
        <Logo />
      </Link>
      {showBackButton && <BackButton />}
    </header>
  )
}
