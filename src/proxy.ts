import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  // Temporary proxy without Supabase dependency for testing
  // TODO: Add Supabase configuration when environment variables are set

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/set-password"];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  // Define admin routes that require admin role
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Define protected routes that require authentication
  const protectedRoutes = [
    "/portal",
    "/ai-assistant",
    "/training",
    "/rfq",
    "/support",
    "/manuals",
    "/news",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // For now, allow all routes for testing
  // TODO: Implement proper authentication when Supabase is configured

  // Redirect root to portal for testing
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
