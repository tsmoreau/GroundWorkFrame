"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  FileText,
  Settings,
  PawPrint,
  ChevronRight,
  Menu,
  X,
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

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
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
    <>
      <div className="px-5 py-6 border-b border-border">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={onNavigate}
        >
          <div className="w-7 h-7 rounded-md flex items-center justify-center bg-gold">
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-charcoal">
            Denhaus
          </span>
        </Link>
        <p className="text-xs mt-1 font-medium tracking-wide uppercase text-stone">
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
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-parchment-dark text-charcoal"
                  : "text-stone hover:text-charcoal hover:bg-parchment-dark",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </span>
              {badge !== null && (
                <span className="text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center bg-gold text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-border-warm">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 text-xs font-medium transition-colors text-stone hover:text-charcoal"
        >
          <span>View Public Site</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-56 flex-col z-40 border-r bg-surface border-border">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 flex flex-col z-50 bg-surface border-r border-border transition-transform duration-200 ease-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-5 right-4 p-1 text-stone hover:text-charcoal"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-14 flex items-center gap-3 px-4 bg-surface border-b border-border z-30 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 -ml-1 text-stone hover:text-charcoal"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gold">
            <PawPrint className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-charcoal">
            Denhaus
          </span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-56 min-h-screen min-w-0 bg-parchment pt-14 md:pt-0">
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
