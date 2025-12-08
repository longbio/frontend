import clsx from 'clsx'
import Logo from './Logo'
import BackButton from './BackButton'
import TickButton from './TickButton'
import Link from 'next/link'

type HeaderProps = {
  className?: string
  showTickButton?: boolean
  showBackButton?: boolean
}

export default function Header({ className, showTickButton = false, showBackButton = false }: HeaderProps) {
  return (
    <header className={clsx('flex items-center justify-between', className)}>
      <Link href="/">
        <Logo />
      </Link>
      {showTickButton && <TickButton />}
      {showBackButton && <BackButton />}
    </header>
  )
}
