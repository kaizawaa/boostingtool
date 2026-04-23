import { Platform } from "../types";
import { platforms } from "./data";

export function getPlatformInfo(platformId: Platform) {
  return platforms.find(p => p.id === platformId)!;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatCurrency(amount: number): string {
  return '$' + amount.toFixed(2);
}

export function generateOrderId(): string {
  return 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'text-emerald-400 bg-emerald-950';
    case 'processing': return 'text-amber-400 bg-amber-950';
    case 'pending': return 'text-sky-400 bg-sky-950';
    case 'cancelled': return 'text-red-400 bg-red-950';
    default: return 'text-gray-400 bg-gray-900';
  }
}