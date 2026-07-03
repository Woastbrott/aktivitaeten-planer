import { NextResponse } from "next/server"
import { auth } from "@/auth"

const PUBLIC_PATHS = ["/login", "/register"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublic =
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/invite/")

  if (!req.auth && !isPublic) {
    const loginUrl = new URL("/login", req.nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (req.auth && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/activities", req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
