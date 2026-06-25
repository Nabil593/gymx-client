import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("better-auth.session_token");

  const privateRoutes = [
    "/dashboard",
    "/payment",
    "/apply-trainer",
    "/classes/",
    "/forum/",
  ];

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));

  if (isPrivate && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/payment/:path*",
    "/apply-trainer/:path*",
    "/classes/:path*",
    "/forum/:path*",
  ],
};
