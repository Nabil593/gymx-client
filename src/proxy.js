import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isPrivate =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/apply-trainer") ||
    (pathname.startsWith("/classes/") && pathname.split("/").length > 2) ||
    (pathname.startsWith("/forum/") && pathname.split("/").length > 2);

  if (isPrivate && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (session && pathname === "/login") {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");

    if (callbackUrl) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    } else {
      const userRole = session.user?.role || "user";
      return NextResponse.redirect(
        new URL(`/dashboard/${userRole}/overview`, request.url),
      );
    }
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
    "/login",
  ],
};
