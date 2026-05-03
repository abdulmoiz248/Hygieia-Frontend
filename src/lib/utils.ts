import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—"
  try {
    return new Intl.NumberFormat("en-US").format(Math.round(value))
  } catch {
    return String(Math.round(value))
  }
}
