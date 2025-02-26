import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token) {
    const username = token.username;
    console.log(username);
    if (!username) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("sign-up") ||
      url.pathname.startsWith("verify") ||
      url.pathname === "/"
    ) {
      return NextResponse.redirect(new URL(`/dashboard/${username}`));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/verify/:path*"],
};
