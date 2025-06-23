import clsx from 'clsx'
import Logo from './Logo'
import Link from 'next/link'

type HeaderProps = {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={clsx(className)}>
      <Link href="/">
        <Logo />
      </Link>
    </header>
  )
}
