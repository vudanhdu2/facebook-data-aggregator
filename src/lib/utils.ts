
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return typeof date === 'string' ? date : '';
  }
  
  try {
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    // Fallback if toLocaleDateString fails
    return d.toISOString().slice(0, 16).replace('T', ' ');
  }
}

// Format large numbers with thousand separators
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}
