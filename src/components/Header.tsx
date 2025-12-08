import clsx from 'clsx'
import Logo from './Logo'
import BackButton from './BackButton'
import Link from 'next/link'

type HeaderProps = {
  className?: string
  showTickButton?: boolean
}

export default function Header({ className, showTickButton = false }: HeaderProps) {
  return (
    <header className={clsx('flex items-center justify-between', className)}>
      <Link href="/">
        <Logo />
      </Link>
      {showTickButton && <BackButton />}
    </header>
  )
}
