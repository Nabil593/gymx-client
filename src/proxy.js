import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const privateRoutes = ["/dashboard", "/payment", "/apply-trainer"];

  const isPrivate =
    privateRoutes.some((route) => pathname.startsWith(route)) ||
    (pathname.startsWith("/classes/") && pathname.split("/").length > 2) ||
    (pathname.startsWith("/forum/") && pathname.split("/").length > 2);

  if (isPrivate && !session) {
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
