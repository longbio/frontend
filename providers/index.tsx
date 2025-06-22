import { PropsWithChildren } from 'react'
import QueryProvider from './QueryProvider'

export default function Providers({ children }: PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>
}
