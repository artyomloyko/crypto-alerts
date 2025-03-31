import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeFormatDistance(timestamp: number) {
  try {
    return formatDistanceToNow(timestamp, { addSuffix: true })
  } catch (error) {
    console.error('Error formatting date:', error, timestamp)
    return 'recently'
  }
}