import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/create", "/courses"],
};
