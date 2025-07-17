console.log("Middleware.js loaded");
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard", "/profile"],
};
