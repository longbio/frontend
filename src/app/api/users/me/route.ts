import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ApiError, AuthError } from '@/lib/exceptions'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) throw new AuthError()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    })

    if (!res.ok) throw new ApiError(`Error ${res.status}`)

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
