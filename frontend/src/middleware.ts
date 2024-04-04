import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export default async function middleware(
    req: NextRequest,
    event: NextFetchEvent
) {
    const token = await getToken({ req })
    const isAuthenticated = !!token
    if ((req.nextUrl.pathname.startsWith('/enter') || req.nextUrl.pathname.startsWith('/register')) && isAuthenticated) {
        return NextResponse.redirect(new URL('/profile', req.url))
    }


    const authMiddleware = await withAuth({
        pages: {
            signIn: "/enter",
        },
    })

    // @ts-expect-error
    return authMiddleware(req, event)
}

export const config = {
    matcher: ['/profile', '/register/:path*', "/enter"],
}