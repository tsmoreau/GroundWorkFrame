"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../data-context";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  PawPrint,
  X,
} from "lucide-react";
import type { Client } from "@/lib/types";

type SortKey = "name" | "pets" | "address" | "jobs" | "since";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "pets", label: "Pets" },
  { key: "address", label: "Address" },
  { key: "jobs", label: "Jobs" },
  { key: "since", label: "Member Since" },
];

export default function ClientsPage() {
  const { clients, jobs, addClient } = useData();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("since");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "since" ? "desc" : "asc");
    }
  };

  const getJobCount = (clientId: string) =>
    jobs.filter((j) => j.clientId === clientId).length;

  const getActiveJobCount = (clientId: string) =>
    jobs.filter(
      (j) =>
        j.clientId === clientId &&
        !["complete", "cancelled"].includes(j.status),
    ).length;

  const getSortValue = (client: Client): string | number => {
    switch (sortKey) {
      case "name":
        return client.name.toLowerCase();
      case "pets":
        return client.pets
          .map((p) => p.name || p.breed || p.type)
          .join(", ")
          .toLowerCase();
      case "address":
        return client.address.toLowerCase();
      case "jobs":
        return getJobCount(client.id);
      case "since":
        return client.createdAt;
    }
  };

  const filtered = clients
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const aVal = getSortValue(a);
      const bVal = getSortValue(b);
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#191c1b]">Clients</h1>
          <p className="text-sm text-[#424844] mt-1">{clients.length} total</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#173124" }}
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#c2c8c2] overflow-hidden">
        <div className="p-4 border-b border-[#e7e8e6]">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727973]" />
            <input
              type="search"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#c2c8c2] rounded-lg bg-[#f3f4f1] focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
            />
          </div>
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
            {filtered.map((client) => {
              const jobCount = getJobCount(client.id);
              const activeCount = getActiveJobCount(client.id);
              return (
                <tr
                  key={client.id}
                  onClick={() => router.push(`/admin/clients/${client.id}`)}
                  className="hover:bg-[#f3f4f1] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm text-[#191c1b]">
                        {client.name}
                      </p>
                      <p className="text-xs text-[#424844] mt-0.5">
                        {client.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <PawPrint className="w-3.5 h-3.5 text-[#727973]" />
                      <span className="text-xs text-[#424844]">
                        {client.pets
                          .map((p) => p.name || p.breed || p.type)
                          .join(", ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#424844] max-w-[180px] truncate">
                    {client.address}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#191c1b]">
                        {jobCount}
                      </span>
                      {activeCount > 0 && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: "#EDF0D8",
                            color: "#5A7840",
                          }}
                        >
                          {activeCount} active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#424844]">
                    {formatDate(client.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#424844] text-sm">
            No clients found.
          </div>
        )}
      </div>

      {showAddModal && (
        <AddClientModal
          onClose={() => setShowAddModal(false)}
          onAdd={(data) => {
            addClient(data);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddClientModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    petName: "",
    petType: "cat" as "cat" | "dog",
    petBreed: "",
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
      address: form.address,
      pets:
        form.petName || form.petBreed
          ? [
              {
                name: form.petName || undefined,
                type: form.petType,
                breed: form.petBreed || undefined,
              },
            ]
          : [],
      notes: [],
      jobIds: [],
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#c2c8c2] p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#191c1b]">Add Client</h3>
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
                Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
              />
            </div>
          </div>

          <div className="border-t border-[#e7e8e6] pt-4">
            <p className="text-xs font-semibold text-[#424844] uppercase tracking-wider mb-3">
              Pet (optional)
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#424844] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={form.petName}
                  onChange={(e) => set("petName", e.target.value)}
                  className="w-full text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
                />
              </div>
              <div>
                <label className="block text-xs text-[#424844] mb-1">
                  Type
                </label>
                <div className="flex gap-3 pt-1">
                  {(["cat", "dog"] as const).map((t) => (
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
                      <span className="text-sm capitalize text-[#191c1b]">
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#424844] mb-1">
                  Breed
                </label>
                <input
                  type="text"
                  value={form.petBreed}
                  onChange={(e) => set("petBreed", e.target.value)}
                  className="w-full text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#173124" }}
          >
            Add Client
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
