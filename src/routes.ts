// src/routes.ts

/**
 * An array of public routes that do not require authentication.
 * These routes can be accessed by anyone without logging in.
 * @type {string[]}
 * @example
 * const publicRoutes = ["/", "/about", "/contact"]
 * @description
 * This array contains routes that are publicly accessible without requiring authentication.
 * Users can access these routes without being logged in.
 * Common examples include the home page, about page, and contact page.
 */
export const publicRoutes = ['/', '/verify-email', '/email']

/**
 * An array of routes that are used for authentication.
 * These routes redirect logged-in users to their role-based dashboard.
 * @type {string[]}
 * @example
 * const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
 * @description
 * This array contains routes for authentication purposes (e.g., login, registration).
 * Logged-in users accessing these routes are redirected to their role-based dashboard.
 */
export const authRoutes = [
  '/login',
  '/register',
  '/new-password',
  '/reset-password',
  '/error',
]

/**
 * An array of route prefixes accessible only to users with the USER role.
 * Any route starting with these prefixes is allowed for USER.
 * @type {string[]}
 * @example
 * const userRoutes = ["/dashboard", "/profile"]
 * @description
 * This array contains route prefixes that only authenticated users with the USER role can access.
 * Sub-routes (e.g., /dashboard/settings, /profile/edit) are also allowed for USER.
 */
export const userRoutes = ['/dashboard', '/profile']

/**
 * The prefix for routes accessible only to users with the ADMIN role.
 * Any route starting with this prefix is allowed for ADMIN.
 * @type {string}
 * @example
 * const adminPrefix = "/admin"
 * @description
 * This string defines the route prefix that only authenticated users with the ADMIN role can access.
 * Sub-routes (e.g., /admin/users, /admin/settings) are allowed for ADMIN.
 */
export const adminPrefix = '/admin'

/**
 * The prefix for routes accessible only to users with the SUPER_ADMIN role.
 * Any route starting with this prefix is allowed for SUPER_ADMIN.
 * @type {string}
 * @example
 * const superAdminPrefix = "/super-admin"
 * @description
 * This string defines the route prefix that only authenticated users with the SUPER_ADMIN role can access.
 * Sub-routes (e.g., /super-admin/reports) are allowed for SUPER_ADMIN.
 */
export const superAdminPrefix = '/super-admin'

/**
 * The prefix for API routes that require authentication.
 * Routes starting with this prefix are used for authentication API processes.
 * @type {string}
 * @example
 * const apiAuthPrefix = "/api/auth"
 * @description
 * This string prefixes API routes that handle authentication (e.g., /api/auth/signin).
 * These routes bypass middleware authentication checks.
 */
export const apiAuthPrefix = '/api/auth'

// Default redirect paths for different roles after login
export const DEFAULT_LOGGEDIN_ADMIN_REDIRECT = '/admin'
export const DEFAULT_LOGGEDIN_SUPER_ADMIN_REDIRECT = '/super-admin'
export const DEFAULT_LOGGEDIN_USER_REDIRECT = '/'
export const DEFAULT_UNLOGGEDIN_REDIRECT = '/login'
