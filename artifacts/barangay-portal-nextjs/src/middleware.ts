import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/announcements"];
const officialRoutes = ["/official"];
const residentRoutes = ["/resident"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("auth-token")?.value;
  const userRole = request.cookies.get("user-role")?.value;

  // Public routes - allow all
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // No token - redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Official routes - check role
  if (pathname.startsWith("/official")) {
    if (userRole !== "official") {
      return NextResponse.redirect(new URL("/resident/dashboard", request.url));
    }
  }

  // Resident routes - check role
  if (pathname.startsWith("/resident")) {
    if (userRole !== "resident") {
      return NextResponse.redirect(new URL("/official/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-.+\\.png).*)",
  ],
};
