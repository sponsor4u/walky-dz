import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: string | number, currency = "دج"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${num.toLocaleString("en-US")} ${currency}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 100);
}

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return phone.slice(0, 4) + "****" + phone.slice(-2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: "bg-blue-500",
    confirmed: "bg-emerald-500",
    shipping: "bg-amber-500",
    delivered: "bg-green-500",
    returned: "bg-purple-500",
    cancelled: "bg-red-500",
  };
  return colors[status] ?? "bg-gray-500";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: "جديد",
    confirmed: "مؤكد",
    shipping: "قيد الشحن",
    delivered: "تم التوصيل",
    returned: "مُرجع",
    cancelled: "ملغي",
  };
  return labels[status] ?? status;
}
