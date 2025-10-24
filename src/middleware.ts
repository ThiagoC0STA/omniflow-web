import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

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
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If user is not signed in and trying to access protected routes, redirect to login
  if (!session && (isProtectedRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is signed in and trying to access login page, redirect to portal
  if (session && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  // Redirect root to appropriate page
  if (req.nextUrl.pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/portal", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [], // Temporarily disable middleware
};
