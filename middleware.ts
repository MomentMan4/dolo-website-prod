import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Check if the route is an admin route
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Skip middleware for login page
    if (req.nextUrl.pathname === "/admin/login") {
      return res
    }

    try {
      const supabase = createMiddlewareClient({ req, res })

      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // Redirect to login if no session
        return NextResponse.redirect(new URL("/admin/login", req.url))
      }

      // Check if user is in admin_users table
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", session.user.email)
        .eq("is_active", true)
        .single()

      if (!adminUser) {
        // Redirect to unauthorized if not an admin
        return NextResponse.redirect(new URL("/admin/unauthorized", req.url))
      }
    } catch (error) {
      console.warn("Middleware error - allowing request to proceed:", error)
      // Allow request to proceed if middleware fails during deployment
      return res
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}
