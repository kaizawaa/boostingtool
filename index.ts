export type Platform = 'tiktok' | 'youtube' | 'instagram' | 'telegram' | 'facebook' | 'twitter' | 'spotify' | 'twitch' | 'discord' | 'snapchat' | 'pinterest' | 'linkedin' | 'threads' | 'kwai';

export type Page = 'dashboard' | 'new-order' | 'orders' | 'services' | 'providers' | 'subscriptions' | 'promo-codes' | 'users' | 'settings' | 'api' | 'wallet' | 'support';

export interface Service {
  id: string;
  name: string;
  platform: Platform;
  category: string;
  rate: number;
  min: number;
  max: number;
  provider: string;
  description: string;
  averageTime: string;
  refill: boolean;
  dripFeed: boolean;
  quality: 'premium' | 'high' | 'medium' | 'standard';
}

export interface Order {
  id: string;
  service: Service;
  link: string;
  quantity: number;
  totalCost: number;
  status: 'success' | 'processing' | 'partial' | 'cancelled';
  createdAt: string;
  startCount: number;
  remains: number;
}

export interface Provider {
  id: string;
  name: string;
  rating: number;
  completed: number;
  status: 'active' | 'maintenance' | 'offline';
  balance: number;
  api: string;
  color: string;
  services: number;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular: boolean;
  maxOrders: number;
  discount: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  maxUses: number;
  used: number;
  expiresAt: string;
  active: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  subscription: string | null;
  orders: number;
  joinedAt: string;
  status: 'active' | 'suspended';
}

export interface PlatformInfo {
  id: Platform;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBg: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'purchase' | 'refund' | 'promo';
  amount: number;
  description: string;
  date: string;
}