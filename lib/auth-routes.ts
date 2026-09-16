const AUTH_PAGE_PREFIXES = ["/login", "/register", "/forgot-password", "/reset-password"];

/** Pages that render their own full-screen layout without the site chrome. */
export function isAuthPage(pathname: string | null): boolean {
  return !!pathname && AUTH_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
