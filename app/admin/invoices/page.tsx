"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useData } from "../data-context";
import {
  computeTotal,
  formatCurrency,
  formatDate,
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  timeAgo,
} from "@/lib/utils";
import { ChevronRight, ExternalLink, Search } from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  draft: { bg: "var(--color-parchment-dark)", color: "var(--color-stone)" },
  sent: {
    bg: "var(--color-status-blue-bg)",
    color: "var(--color-status-blue)",
  },
  viewed: { bg: "var(--color-parchment-dark)", color: "var(--color-gold)" },
  paid: {
    bg: "var(--color-status-green-light-bg)",
    color: "var(--color-paid)",
  },
  void: { bg: "var(--color-status-red-bg)", color: "var(--color-danger)" },
};

export default function InvoicesPage() {
  const { invoices } = useData();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = invoices.filter((i) => {
    const matchSearch =
      i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Documents</h1>
          <p className="text-sm text-stone mt-1">{invoices.length} total</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 border-b border-parchment-dark">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-dim" />
            <input
              type="search"
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-surface-hover focus:outline-none focus:ring-2 focus:ring-espresso/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-espresso/20"
          >
            <option value="all">All statuses</option>
            {Object.entries(INVOICE_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile card list */}
        <div className="divide-y divide-row-divider md:hidden">
          {filtered.map((inv) => {
            const sc = STATUS_STYLES[inv.status];
            return (
              <div
                key={inv.id}
                onClick={() => router.push(`/admin/invoices/${inv.id}`)}
                className="p-4 hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-charcoal">
                      {inv.invoiceNumber}
                    </p>
                    <p className="text-sm text-charcoal mt-0.5">
                      {inv.clientName}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sc.bg, color: sc.color }}
                  >
                    {INVOICE_STATUS_LABELS[inv.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs text-stone">
                    <span className="capitalize">{inv.type}</span>
                    <span className="text-separator">·</span>
                    <span>{inv.sentAt ? timeAgo(inv.sentAt) : "Not sent"}</span>
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    {formatCurrency(computeTotal(inv.lineItems))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <table className="w-full hidden md:table">
          <thead>
            <tr className="border-b border-parchment-dark">
              {[
                "Invoice #",
                "Client",
                "Type",
                "Status",
                "Total",
                "Sent",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-stone uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-parchment-dark">
            {filtered.map((inv) => {
              const sc = STATUS_STYLES[inv.status];
              return (
                <tr
                  key={inv.id}
                  className="hover:bg-parchment-dark transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-charcoal">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal">
                    {inv.clientName}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone capitalize">
                    {inv.type}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: sc.bg, color: sc.color }}
                    >
                      {INVOICE_STATUS_LABELS[inv.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-charcoal">
                    {formatCurrency(computeTotal(inv.lineItems))}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone">
                    {inv.sentAt ? timeAgo(inv.sentAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/invoice/${inv.token}`}
                        className="text-stone hover:text-espresso"
                        title="View client invoice page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-espresso hover:underline"
                      >
                        View <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-stone text-sm">
            No invoices found.
          </div>
        )}
      </div>
    </div>
  );
}
