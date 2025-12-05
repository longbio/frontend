import clsx from 'clsx'
import Logo from './Logo'
import NavigationButton from './NavigationButton'
import Link from 'next/link'

type HeaderProps = {
  className?: string
  showBackButton?: boolean
  isEditMode?: boolean
}

export default function Header({ className, showBackButton = false, isEditMode = false }: HeaderProps) {
  return (
    <header className={clsx('flex items-center justify-between', className)}>
      <Link href="/">
        <Logo />
      </Link>
      {showBackButton && <NavigationButton isEditMode={isEditMode} />}
    </header>
  )
}
