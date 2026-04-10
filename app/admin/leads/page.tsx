"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../data-context";
import { SOURCE_LABELS, formatDate } from "@/lib/utils";
import { Search, Plus, ChevronUp, ChevronDown, X } from "lucide-react";
import type { Lead, LeadSource } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  new: "#173124",
  contacted: "#6b9dc2",
  qualified: "#5A7840",
  converted: "#173124",
  dead: "#727973",
};

const STATUS_BG: Record<string, string> = {
  new: "#e8f4ec",
  contacted: "#e8f2fa",
  qualified: "#EDF0D8",
  converted: "#f3f4f1",
  dead: "#edeeeb",
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
  const router = useRouter();
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
          <h1 className="text-2xl font-bold text-[#191c1b]">Leads</h1>
          <p className="text-sm text-[#424844] mt-1">{leads.length} total</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#173124" }}
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-3 p-4 border-b border-[#e7e8e6]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727973]" />
            <input
              type="search"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#c2c8c2] rounded-lg bg-[#f3f4f1] focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
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
            className="text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
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
            <tr className="border-b border-[#e7e8e6]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left px-4 py-3 text-xs font-semibold text-[#424844] uppercase tracking-wider cursor-pointer hover:text-[#191c1b] transition-colors select-none"
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
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edeeeb]">
            {filtered.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => router.push(`/admin/leads/${lead.id}`)}
                className="hover:bg-[#f3f4f1] transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-sm text-[#191c1b]">
                      {lead.name}
                    </p>
                    <p className="text-xs text-[#424844] mt-0.5">
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
                <td className="px-4 py-3 text-xs text-[#424844]">
                  {SOURCE_LABELS[lead.source]}
                </td>
                <td className="px-4 py-3 text-xs text-[#424844] capitalize">
                  {lead.petInfo.type}
                  {lead.petInfo.count && lead.petInfo.count > 1
                    ? ` (${lead.petInfo.count})`
                    : ""}
                </td>
                <td className="px-4 py-3 text-xs text-[#424844] max-w-[160px] truncate">
                  {lead.address || "—"}
                </td>
                <td className="px-4 py-3 text-xs text-[#424844]">
                  {formatDate(lead.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#424844] text-sm">
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
        className="admin-card p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#191c1b]">Add Lead</h3>
          <button
            onClick={onClose}
            className="text-[#727973] hover:text-[#191c1b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#424844] uppercase tracking-wider mb-1">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#424844] uppercase tracking-wider mb-1">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#424844] uppercase tracking-wider mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#424844] uppercase tracking-wider mb-1">
                Source
              </label>
              <select
                value={form.source}
                onChange={(e) => set("source", e.target.value as LeadSource)}
                className="w-full text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
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
            <label className="block text-xs font-semibold text-[#424844] uppercase tracking-wider mb-1">
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="w-full text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#424844] uppercase tracking-wider mb-1">
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
                    className="accent-[#173124]"
                  />
                  <span className="text-sm capitalize text-[#191c1b]">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#424844] uppercase tracking-wider mb-1">
              Notes
            </label>
            <textarea
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              rows={3}
              className="w-full text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
              placeholder="Phone call notes, referral details, etc."
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#173124" }}
          >
            Add Lead
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-[#c2c8c2] text-[#424844]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
