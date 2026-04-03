import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy");
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy h:mm a");
}

export function timeAgo(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function computeTotal(lineItems: { amount: number }[]): number {
  return lineItems.reduce((sum, li) => sum + li.amount, 0);
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateToken(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export const SOURCE_LABELS: Record<string, string> = {
  contact_form: "Contact Form",
  nextdoor: "Nextdoor",
  craigslist: "Craigslist",
  referral: "Referral",
  vet_card: "Vet Card",
  other: "Other",
};

export const JOB_TYPE_LABELS: Record<string, string> = {
  catio: "Catio",
  dog_house: "Dog House",
  kennel: "Kennel",
  cat_box: "Cat Box",
  tunnel: "Tunnel",
  other: "Other",
};

export const JOB_STATUS_LABELS: Record<string, string> = {
  quoted: "Quoted",
  deposit_paid: "Deposit Paid",
  materials_ordered: "Materials Ordered",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  complete: "Complete",
  cancelled: "Cancelled",
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  viewed: "Viewed",
  paid: "Paid",
  void: "Void",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  stripe_ach: "ACH Transfer (Stripe)",
  stripe_card: "Card (Stripe)",
  zelle: "Zelle",
  check: "Check",
  bank_transfer: "Bank Transfer",
  other: "Other",
};

export const JOB_STATUS_ORDER: string[] = [
  "quoted",
  "deposit_paid",
  "materials_ordered",
  "scheduled",
  "in_progress",
  "complete",
  "cancelled",
];
