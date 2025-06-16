// // Import authentication function from auth.ts, which includes PrismaAdapter and session callbacks
// import { auth } from '@/auth'
// // Import route constants from routes.ts for public, auth, role-specific prefixes, and redirect paths
// import {
//   apiAuthPrefix,
//   authRoutes,
//   userRoutes,
//   adminPrefix,
//   superAdminPrefix,
//   DEFAULT_LOGGEDIN_ADMIN_REDIRECT,
//   DEFAULT_LOGGEDIN_SUPER_ADMIN_REDIRECT,
//   DEFAULT_LOGGEDIN_USER_REDIRECT,
//   DEFAULT_UNLOGGEDIN_REDIRECT,
//   publicRoutes,
// } from './routes'
// // Import NextResponse for handling redirects in middleware
// import { NextResponse } from 'next/server'

// // Define middleware using the auth function to check user session and role
// export default auth((req) => {
//   // Extract the requested URL path
//   const { nextUrl } = req
//   // Log the current path for debugging
//   console.log('Middleware running for:', nextUrl.pathname)
//   // Log the authenticated user’s session data (includes id, email, name, role)
//   console.log('Authenticated user:', req.auth)
//   // Get the user’s role from the session (e.g., "USER", "ADMIN", "SUPER_ADMIN")
//   const role = req.auth?.user?.role
//   // Log the role for debugging
//   console.log('User role:', role)
//   // Check if the user is logged in (true if req.auth exists)
//   const isLoggedIn = !!req.auth

//   // Check if the route is an API authentication route (e.g., /api/auth/*)
//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
//   // Check if the route is an authentication route (e.g., /login, /register)
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname)
//   // Check if the route is public (e.g., /)
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

//   // Order matters for middleware logic:
//   // 1. Allow API auth routes to bypass authentication checks
//   if (isApiAuthRoute) {
//     // Do nothing for API auth routes (e.g., /api/auth/signin) to allow authentication
//     return
//   }

//   // 2. Allow unauthenticated users to access auth routes (e.g., /login)
//   if (isAuthRoute && !isLoggedIn) {
//     // If the user is not logged in and tries to access auth routes, allow access
//     return
//   }

//   // 3. Redirect logged-in users from auth routes or public root (/) to role-based dashboards
//   if (
//     isLoggedIn &&
//     (isAuthRoute || (isPublicRoute && nextUrl.pathname === '/'))
//   ) {
//     // Determine redirect URL based on user role
//     const redirectUrl =
//       role === 'SUPER_ADMIN'
//         ? DEFAULT_LOGGEDIN_SUPER_ADMIN_REDIRECT // /super-admin
//         : role === 'ADMIN'
//           ? DEFAULT_LOGGEDIN_ADMIN_REDIRECT // /admin
//           : DEFAULT_LOGGEDIN_USER_REDIRECT // /dashboard
//     // Only redirect if the current path isn’t the target to prevent loops
//     if (nextUrl.pathname !== redirectUrl) {
//       return NextResponse.redirect(new URL(redirectUrl, nextUrl))
//     }
//     return
//   }

//   // 4. Allow access for logged-in users based on role and route
//   if (isLoggedIn) {
//     // SUPER_ADMIN: Allow public routes and /super-admin/* routes
//     if (
//       role === 'SUPER_ADMIN' &&
//       (isPublicRoute || nextUrl.pathname.startsWith(superAdminPrefix))
//     ) {
//       return // Allow access
//     }

//     // ADMIN: Allow public routes and /admin/* routes
//     if (
//       role === 'ADMIN' &&
//       (isPublicRoute || nextUrl.pathname.startsWith(adminPrefix))
//     ) {
//       return // Allow access
//     }

//     // USER: Allow public routes and user routes (/dashboard/*, /profile/*)
//     if (role === 'USER') {
//       const isUserRoute = userRoutes.some((route) =>
//         nextUrl.pathname.startsWith(route),
//       )
//       if (isPublicRoute || isUserRoute) {
//         return // Allow access
//       }
//     }

//     // Redirect to role-based dashboard if accessing unauthorized route
//     const redirectUrl =
//       role === 'SUPER_ADMIN'
//         ? DEFAULT_LOGGEDIN_SUPER_ADMIN_REDIRECT // /super-admin
//         : role === 'ADMIN'
//           ? DEFAULT_LOGGEDIN_ADMIN_REDIRECT // /admin
//           : DEFAULT_LOGGEDIN_USER_REDIRECT // /dashboard
//     if (nextUrl.pathname !== redirectUrl) {
//       return NextResponse.redirect(new URL(redirectUrl, nextUrl))
//     }
//     return
//   }

//   // 5. Redirect unauthenticated users from protected (non-public) routes to the login page
//   if (!isLoggedIn && !isPublicRoute) {
//     // Redirect to /login for unauthorized access to protected routes
//     return NextResponse.redirect(new URL(DEFAULT_UNLOGGEDIN_REDIRECT, nextUrl))
//   }

//   // 6. Allow access to public routes for all users
//   return
// })

// // Configure which paths trigger the middleware
// export const config = {
//   matcher: [
//     // Match all routes except Next.js internals and static files (e.g., images, CSS, JS)
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }

import { auth } from '@/auth'
import {
  apiAuthPrefix,
  authRoutes,
  userRoutes,
  adminPrefix,
  superAdminPrefix,
  DEFAULT_LOGGEDIN_ADMIN_REDIRECT,
  DEFAULT_LOGGEDIN_SUPER_ADMIN_REDIRECT,
  DEFAULT_LOGGEDIN_USER_REDIRECT,
  DEFAULT_UNLOGGEDIN_REDIRECT,
  publicRoutes,
} from './routes'
import { NextResponse } from 'next/server'

export default auth(async (req) => {
  const start = Date.now()
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  // Detailed logging for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.log('Request details:', {
      pathname: nextUrl.pathname,
      headers: Object.fromEntries(req.headers),
      searchParams: Object.fromEntries(nextUrl.searchParams),
      user: req.auth,
      role,
    })
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  // 1. Allow API auth routes to bypass checks
  if (isApiAuthRoute) {
    return
  }

  // 2. Allow unauthenticated users to access auth routes (e.g., /login)
  if (isAuthRoute && !isLoggedIn) {
    return
  }

  // 3. Redirect logged-in admins from auth routes or root (/) to their dashboards
  if (
    isLoggedIn &&
    (isAuthRoute || (isPublicRoute && nextUrl.pathname === '/'))
  ) {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      const redirectUrl =
        role === 'SUPER_ADMIN'
          ? DEFAULT_LOGGEDIN_SUPER_ADMIN_REDIRECT // /super-admin
          : DEFAULT_LOGGEDIN_ADMIN_REDIRECT // /admin
      if (
        nextUrl.pathname !== redirectUrl &&
        !nextUrl.searchParams.has('redirected')
      ) {
        const newUrl = new URL(redirectUrl, nextUrl)
        newUrl.searchParams.set('redirected', 'true')
        return NextResponse.redirect(newUrl)
      }
    }
    // Allow USER to stay on / (no redirect needed)
    return
  }

  // 4. Allow access for logged-in users based on role and route
  if (isLoggedIn) {
    if (
      (role === 'SUPER_ADMIN' &&
        (isPublicRoute || nextUrl.pathname.startsWith(superAdminPrefix))) ||
      (role === 'ADMIN' &&
        (isPublicRoute || nextUrl.pathname.startsWith(adminPrefix))) ||
      (role === 'USER' &&
        (isPublicRoute ||
          userRoutes.some((route) => nextUrl.pathname.startsWith(route))))
    ) {
      return
    }

    // Redirect to role-based dashboard for unauthorized routes
    const redirectUrl =
      role === 'SUPER_ADMIN'
        ? DEFAULT_LOGGEDIN_SUPER_ADMIN_REDIRECT
        : role === 'ADMIN'
          ? DEFAULT_LOGGEDIN_ADMIN_REDIRECT
          : DEFAULT_LOGGEDIN_USER_REDIRECT
    if (
      nextUrl.pathname !== redirectUrl &&
      !nextUrl.searchParams.has('redirected')
    ) {
      const newUrl = new URL(redirectUrl, nextUrl)
      newUrl.searchParams.set('redirected', 'true')
      return NextResponse.redirect(newUrl)
    }
    return
  }

  // 5. Redirect unauthenticated users from protected routes to /login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(DEFAULT_UNLOGGEDIN_REDIRECT, nextUrl))
  }

  // 6. Allow access to public routes
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `Middleware for ${nextUrl.pathname} took ${Date.now() - start}ms`,
    )
  }
  return
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/api/(auth|trpc)(.*)',
  ],
}
