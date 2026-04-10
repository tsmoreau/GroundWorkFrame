"use client";

import { useState } from "react";
import Link from "next/link";
import { useData } from "../data-context";
import { SOURCE_LABELS, timeAgo } from "@/lib/utils";
import {
  Search,
  Plus,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import type { Lead, LeadSource } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  new: "#C8A548",
  contacted: "#6b9dc2",
  qualified: "#5A7840",
  converted: "#2E1A0E",
  dead: "#A09070",
};

const STATUS_BG: Record<string, string> = {
  new: "#fff8e8",
  contacted: "#e8f2fa",
  qualified: "#EDF0D8",
  converted: "#EEE4D0",
  dead: "#F0E4D4",
};

type SortKey = "name" | "status" | "source" | "pet" | "address" | "received";
type SortDir = "asc" | "desc";

function getSortValue(lead: Lead, key: SortKey): string {
  switch (key) {
    case "name":
      return lead.name.toLowerCase();
    case "status":
      return lead.status;
    case "source":
      return lead.source;
    case "pet":
      return lead.petInfo.type;
    case "address":
      return (lead.address || "").toLowerCase();
    case "received":
      return lead.createdAt;
  }
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
  { key: "source", label: "Source" },
  { key: "pet", label: "Pet" },
  { key: "address", label: "Address" },
  { key: "received", label: "Received" },
];

export default function LeadsPage() {
  const { leads, addLead } = useData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("received");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "received" ? "desc" : "asc");
    }
  };

  const filtered = leads
    .filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      const matchSource = sourceFilter === "all" || l.source === sourceFilter;
      return matchSearch && matchStatus && matchSource;
    })
    .sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1208]">Leads</h1>
          <p className="text-sm text-[#6B5B4A] mt-1">{leads.length} total</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#1C1208]"
          style={{ backgroundColor: "#C8A548" }}
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#DDD0B8] overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-3 p-4 border-b border-[#EDE4D0]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A09070]" />
            <input
              type="search"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#DDD0B8] rounded-lg bg-[#F8F3EA] focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20"
          >
            <option value="all">All statuses</option>
            {["new", "contacted", "qualified", "converted", "dead"].map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20"
          >
            <option value="all">All sources</option>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE4D0]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left px-4 py-3 text-xs font-semibold text-[#6B5B4A] uppercase tracking-wider cursor-pointer hover:text-[#1C1208] transition-colors select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </span>
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EEE0]">
            {filtered.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-[#F8F3EA] transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-sm text-[#1C1208]">
                      {lead.name}
                    </p>
                    <p className="text-xs text-[#6B5B4A] mt-0.5">
                      {lead.email}
                    </p>
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
                <td className="px-4 py-3 text-xs text-[#6B5B4A]">
                  {SOURCE_LABELS[lead.source]}
                </td>
                <td className="px-4 py-3 text-xs text-[#6B5B4A] capitalize">
                  {lead.petInfo.type}
                  {lead.petInfo.count && lead.petInfo.count > 1
                    ? ` (${lead.petInfo.count})`
                    : ""}
                </td>
                <td className="px-4 py-3 text-xs text-[#6B5B4A] max-w-[160px] truncate">
                  {lead.address || "—"}
                </td>
                <td className="px-4 py-3 text-xs text-[#6B5B4A]">
                  {timeAgo(lead.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#2E1A0E] hover:underline"
                  >
                    View <ChevronRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#6B5B4A] text-sm">
            No leads match your filters.
          </div>
        )}
      </div>

      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onAdd={(data) => {
            addLead(data);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddLeadModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    source: "referral" as LeadSource,
    message: "",
    petType: "cat" as "cat" | "dog" | "both",
  });

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const canSubmit = form.name.trim() && form.email.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      address: form.address || undefined,
      source: form.source,
      message: form.message,
      photos: [],
      petInfo: { type: form.petType, count: 1 },
      status: "new",
      notes: [],
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#DDD0B8] p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1C1208]">Add Lead</h3>
          <button
            onClick={onClose}
            className="text-[#A09070] hover:text-[#1C1208]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B5B4A] uppercase tracking-wider mb-1">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B5B4A] uppercase tracking-wider mb-1">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B5B4A] uppercase tracking-wider mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B5B4A] uppercase tracking-wider mb-1">
                Source
              </label>
              <select
                value={form.source}
                onChange={(e) => set("source", e.target.value as LeadSource)}
                className="w-full text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20"
              >
                {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B5B4A] uppercase tracking-wider mb-1">
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="w-full text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B5B4A] uppercase tracking-wider mb-1">
              Pet type
            </label>
            <div className="flex gap-3">
              {(["cat", "dog", "both"] as const).map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={form.petType === t}
                    onChange={() => set("petType", t)}
                    className="accent-[#2E1A0E]"
                  />
                  <span className="text-sm capitalize text-[#1C1208]">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B5B4A] uppercase tracking-wider mb-1">
              Notes
            </label>
            <textarea
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              rows={3}
              className="w-full text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20"
              placeholder="Phone call notes, referral details, etc."
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-[#1C1208] disabled:opacity-50"
            style={{ backgroundColor: "#C8A548" }}
          >
            Add Lead
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-[#DDD0B8] text-[#6B5B4A]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
