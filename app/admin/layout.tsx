"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  FileText,
  Settings,
  PawPrint,
  ChevronRight,
} from "lucide-react";
import { DataProvider, useData } from "./data-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: Users,
    countKey: "leads" as const,
  },
  { href: "/admin/clients", label: "Clients", icon: UserCheck },
  {
    href: "/admin/jobs",
    label: "Jobs",
    icon: Briefcase,
    countKey: "jobs" as const,
  },
  {
    href: "/admin/invoices",
    label: "Documents",
    icon: FileText,
    countKey: "invoices" as const,
  },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  const pathname = usePathname();
  const { leads, invoices } = useData();
  const newLeads = leads.filter((l) => l.status === "new").length;
  const outstandingInvoices = invoices.filter(
    (i) => i.status === "sent" || i.status === "viewed",
  ).length;

  const getBadge = (countKey?: string) => {
    if (countKey === "leads" && newLeads > 0) return newLeads;
    if (countKey === "invoices" && outstandingInvoices > 0)
      return outstandingInvoices;
    return null;
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-56 flex flex-col z-40 border-r"
      style={{ backgroundColor: "#ffffff", borderColor: "#dde0db" }}
    >
      <div className="px-5 py-6 border-b" style={{ borderColor: "var(--color-border)" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: "var(--color-gold)" }}
          >
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span
            className="font-semibold tracking-tight"
            style={{ color: "var(--color-charcoal)" }}
          >
            Denhaus
          </span>
        </Link>
        <p
          className="text-xs mt-1 font-medium tracking-wide uppercase"
          style={{ color: "var(--color-stone)" }}
        >
          Admin
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, countKey }) => {
          const isActive = pathname.startsWith(href);
          const badge = getBadge(countKey);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "text-[var(--color-charcoal)]"
                  : "text-[var(--color-stone)] hover:text-[var(--color-charcoal)] hover:bg-[var(--color-parchment-dark)]",
              )}
              style={
                isActive
                  ? { backgroundColor: "var(--color-parchment-dark)", color: "var(--color-charcoal)" }
                  : undefined
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </span>
              {badge !== null && (
                <span
                  className="text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-gold)", color: "#fff" }}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t" style={{ borderColor: "#c2c8c2" }}>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-medium transition-colors"
          style={{ color: "var(--color-stone)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-charcoal)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-stone)")}
        >
          <span>View Public Site</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#edeee9" }}>
      <Sidebar />
      <main
        className="flex-1 ml-56 min-h-screen min-w-0"
        style={{ backgroundColor: "#edeee9" }}
      >
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <AdminShell>{children}</AdminShell>
    </DataProvider>
  );
}
