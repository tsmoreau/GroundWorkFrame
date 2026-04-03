"use client";

import { useState } from "react";
import Link from "next/link";
import { useData } from "../data-context";
import { formatDate, SOURCE_LABELS, timeAgo } from "@/lib/utils";
import { Search, Plus, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  new: "#c8a55a",
  contacted: "#6b9dc2",
  qualified: "#2d8c60",
  converted: "#1c3829",
  dead: "#a09890",
};

const STATUS_BG: Record<string, string> = {
  new: "#fff8e8",
  contacted: "#e8f2fa",
  qualified: "#e8f5ee",
  converted: "#e4ede8",
  dead: "#f0ece8",
};

export default function LeadsPage() {
  const { leads } = useData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchSource = sourceFilter === "all" || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a18]">Leads</h1>
          <p className="text-sm text-[#5c5c54] mt-1">{leads.length} total</p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#1c3829" }}
        >
          <Plus className="w-4 h-4" />
          New Lead
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#e0dbd0] overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-3 p-4 border-b border-[#f0ece4]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09890]" />
            <input
              type="search"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#e0dbd0] rounded-lg bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-[#e0dbd0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20"
          >
            <option value="all">All statuses</option>
            {["new", "contacted", "qualified", "converted", "dead"].map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-sm border border-[#e0dbd0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20"
          >
            <option value="all">All sources</option>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0ece4]">
              {["Name", "Status", "Source", "Pet", "Address", "Received"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#5c5c54] uppercase tracking-wider">
                  {h}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8f5f0]">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-[#faf8f5] transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-sm text-[#1a1a18]">{lead.name}</p>
                    <p className="text-xs text-[#5c5c54] mt-0.5">{lead.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                    style={{
                      color: STATUS_COLORS[lead.status],
                      backgroundColor: STATUS_BG[lead.status],
                    }}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#5c5c54]">
                  {SOURCE_LABELS[lead.source]}
                </td>
                <td className="px-4 py-3 text-xs text-[#5c5c54] capitalize">
                  {lead.petInfo.type}
                  {lead.petInfo.count && lead.petInfo.count > 1 ? ` (${lead.petInfo.count})` : ""}
                </td>
                <td className="px-4 py-3 text-xs text-[#5c5c54] max-w-[160px] truncate">
                  {lead.address || "—"}
                </td>
                <td className="px-4 py-3 text-xs text-[#5c5c54]">
                  {timeAgo(lead.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#1c3829] hover:underline"
                  >
                    View <ChevronRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#5c5c54] text-sm">
            No leads match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
