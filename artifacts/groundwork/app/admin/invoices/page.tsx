"use client";

import { useState } from "react";
import Link from "next/link";
import { useData } from "../data-context";
import {
  computeTotal,
  formatCurrency,
  formatDate,
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  timeAgo,
} from "@/lib/utils";
import { ChevronRight, ExternalLink } from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  draft: { bg: "#f5f3ef", color: "#7c7566" },
  sent: { bg: "#e8f2fa", color: "#3a7db8" },
  viewed: { bg: "#fdf3e0", color: "#b07d20" },
  paid: { bg: "#e8f5ee", color: "#2d6a4f" },
  void: { bg: "#fce8e8", color: "#b93232" },
};

export default function InvoicesPage() {
  const { invoices } = useData();
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = invoices.filter(
    (i) => statusFilter === "all" || i.status === statusFilter
  );

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a18]">Invoices</h1>
          <p className="text-sm text-[#5c5c54] mt-1">{invoices.length} total</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e0dbd0] overflow-hidden">
        <div className="flex gap-3 p-4 border-b border-[#f0ece4]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-[#e0dbd0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20"
          >
            <option value="all">All statuses</option>
            {Object.entries(INVOICE_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0ece4]">
              {["Invoice #", "Client", "Type", "Status", "Total", "Sent", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#5c5c54] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8f5f0]">
            {filtered.map((inv) => {
              const sc = STATUS_STYLES[inv.status];
              return (
                <tr key={inv.id} className="hover:bg-[#faf8f5] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[#1a1a18]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1a1a18]">{inv.clientName}</td>
                  <td className="px-4 py-3 text-xs text-[#5c5c54] capitalize">{inv.type}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: sc.bg, color: sc.color }}>
                      {INVOICE_STATUS_LABELS[inv.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#1a1a18]">
                    {formatCurrency(computeTotal(inv.lineItems))}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#5c5c54]">
                    {inv.sentAt ? timeAgo(inv.sentAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/invoice/${inv.token}`}
                        className="text-[#5c5c54] hover:text-[#1c3829]"
                        title="View client invoice page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#1c3829] hover:underline"
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
          <div className="text-center py-12 text-[#5c5c54] text-sm">No invoices found.</div>
        )}
      </div>
    </div>
  );
}
