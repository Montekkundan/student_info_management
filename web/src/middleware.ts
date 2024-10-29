import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/project')) {
    const authHeader = request.headers.get('authorization')

    if (authHeader) {
      const encodedCredentials = authHeader.split(' ')[1]
      const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8')
      const [, password] = decodedCredentials.split(':')

      if (password === '341') {
        return NextResponse.next()
      }
    }

    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/project/:path*',
}