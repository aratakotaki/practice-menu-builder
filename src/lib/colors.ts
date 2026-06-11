// Single source of truth for mapping a category's Tailwind colour class to a hex value.
// Categories store their colour as a Tailwind class (e.g. 'bg-orange-500'); charts, the
// timeline colour bars, and print output all need the concrete hex, so the lookup lives
// here instead of being copy-pasted per page.
export const TAILWIND_TO_HEX: Record<string, string> = {
  'bg-purple-500': '#A855F7',
  'bg-orange-500': '#F97316',
  'bg-blue-800': '#1E40AF',
  'bg-green-600': '#16A34A',
  'bg-red-600': '#DC2626',
  'bg-gray-500': '#6B7280',
  'bg-pink-500': '#EC4899',
  'bg-indigo-500': '#6366F1',
  'bg-teal-500': '#14B8A6',
  'bg-yellow-500': '#EAB308',
};

// Resolve a Tailwind colour class to hex. `fallback` is returned for unknown/custom
// classes — callers pass the value appropriate to their context (the editor uses a near
// black, charts use a neutral grey).
export function catHex(colorClass: string, fallback = '#1D1B20'): string {
  return TAILWIND_TO_HEX[colorClass] || fallback;
}
