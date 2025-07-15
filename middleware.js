// middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Configure protected routes here
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

// Apply middleware only to these routes
export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/admin/:path*", // protect subroutes like /admin/users
  ],
};
