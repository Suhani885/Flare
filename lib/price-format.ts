// Pure helpers — safe to import from client components. Keep this file free
// of any server-only imports (e.g. lib/prisma) so it never drags Node-only
// code into the browser bundle.

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function formatPrice(paise: number): string {
  return `₹${paiseToRupees(paise).toLocaleString("en-IN")}`;
}
