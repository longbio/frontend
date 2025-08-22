import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ApiError, AuthError } from '@/lib/exceptions'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    if (!accessToken) throw new AuthError()

    const formData = await req.formData()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/me/profile-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      credentials: 'include',
    })

    if (!res.ok) throw new ApiError(`Error ${res.status}`)

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
