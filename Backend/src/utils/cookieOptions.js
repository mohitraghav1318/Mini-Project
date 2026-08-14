// Centralized so login/logout/refresh all use identical settings
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,       // JS on the frontend can never read this cookie — blocks XSS token theft
    secure: isProduction, // cookie only sent over HTTPS in production; false on localhost (http)
    sameSite: isProduction ? "none" : "lax", // "none" needed for cross-site prod (e.g. Vercel + Render), "lax" is fine for local dev
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches JWT_EXPIRES_IN
    path: "/",
  };
};