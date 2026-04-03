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
  { href: "/admin/leads", label: "Leads", icon: Users, countKey: "leads" as const },
  { href: "/admin/clients", label: "Clients", icon: UserCheck },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase, countKey: "jobs" as const },
  { href: "/admin/invoices", label: "Invoices", icon: FileText, countKey: "invoices" as const },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  const pathname = usePathname();
  const { leads, invoices } = useData();
  const newLeads = leads.filter((l) => l.status === "new").length;
  const outstandingInvoices = invoices.filter(
    (i) => i.status === "sent" || i.status === "viewed"
  ).length;

  const getBadge = (countKey?: string) => {
    if (countKey === "leads" && newLeads > 0) return newLeads;
    if (countKey === "invoices" && outstandingInvoices > 0) return outstandingInvoices;
    return null;
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 flex flex-col z-40"
      style={{ backgroundColor: "#1c3829" }}>
      <div className="px-5 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: "#c8a55a" }}>
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">Denhaus</span>
        </Link>
        <p className="text-xs mt-1" style={{ color: "#8aa89a" }}>Admin</p>
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
                  ? "text-white"
                  : "text-[#8aa89a] hover:text-white hover:bg-white/5"
              )}
              style={isActive ? { backgroundColor: "#2e5c42" } : undefined}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </span>
              {badge !== null && (
                <span
                  className="text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: "#c8a55a", color: "#1c3829" }}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-2 text-xs text-[#8aa89a] hover:text-white transition-colors">
          <span>View Public Site</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-56 min-h-screen" style={{ backgroundColor: "#f8f6f2" }}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AdminShell>{children}</AdminShell>
    </DataProvider>
  );
}
