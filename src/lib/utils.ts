import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Price formatting - Algerian Dinar
export function formatPrice(price: number): string {
  return `${price.toLocaleString('ar-DZ')} دج`;
}

// Order code generator
export function generateOrderCode(): string {
  const prefix = 'ORD';
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${random}`;
}

// Slify generator
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Algerian phone validation
export function isValidAlgerianPhone(phone: string): boolean {
  const clean = phone.replace(/\s/g, '');
  return /^(0[5-7]\d{8})$/.test(clean);
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\s/g, '').replace(/^\+213/, '0');
}

// Date formatting
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateOnly(date: string | Date): string {
  return new Date(date).toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Status label mapping
const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
  returned: 'مُعاد',
};

export function getStatusLabel(status: string): string {
  return statusLabels[status] || status;
}

// Status colors
export function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case 'pending': return { bg: '#fef3c7', text: '#d97706' };
    case 'confirmed': return { bg: '#dbeafe', text: '#2563eb' };
    case 'shipped': return { bg: '#e0e7ff', text: '#4f46e5' };
    case 'delivered': return { bg: '#d1fae5', text: '#16a34a' };
    case 'cancelled': return { bg: '#fee2e2', text: '#dc2626' };
    case 'returned': return { bg: '#f3f4f6', text: '#6b7280' };
    default: return { bg: '#f3f4f6', text: '#6b7280' };
  }
}

// Section type labels
const sectionLabels: Record<string, string> = {
  hero: 'بطل',
  categories: 'فئات',
  products: 'منتجات',
  banner: 'بانر',
  testimonials: 'آراء',
  trust: 'ثقة',
  text: 'نص',
  video: 'فيديو',
  countdown: 'عداد',
  benefits: 'فوائد',
  features: 'مميزات',
  faq: 'أسئلة',
  offer: 'عرض',
  before_after: 'قبل/بعد',
  cta: 'CTA',
  sticky_cta: 'CTA لزق',
  floating_cta: 'CTA عائم',
  bundle: 'باقة',
  reviews: 'تقييمات',
  upsell: 'upsell',
  cross_sell: 'cross_sell',
};

export function getSectionLabel(type: string): string {
  return sectionLabels[type] || type;
}

// Scroll to top
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Deep clone
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Debounce
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}
