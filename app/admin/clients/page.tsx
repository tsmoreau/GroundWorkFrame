"use client";

import { useState } from "react";
import Link from "next/link";
import { useData } from "../data-context";
import { formatDate, timeAgo } from "@/lib/utils";
import { Search, ChevronRight, PawPrint } from "lucide-react";

export default function ClientsPage() {
  const { clients, jobs } = useData();
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1208]">Clients</h1>
          <p className="text-sm text-[#6B5B4A] mt-1">{clients.length} total</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#DDD0B8] overflow-hidden">
        <div className="p-4 border-b border-[#EDE4D0]">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A09070]" />
            <input
              type="search"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#DDD0B8] rounded-lg bg-[#F8F3EA] focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE4D0]">
              {["Name", "Pets", "Address", "Jobs", "Member Since"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#6B5B4A] uppercase tracking-wider">
                  {h}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EEE0]">
            {filtered.map((client) => {
              const clientJobs = jobs.filter((j) => j.clientId === client.id);
              const activeJobs = clientJobs.filter(
                (j) => !["complete", "cancelled"].includes(j.status)
              );
              return (
                <tr key={client.id} className="hover:bg-[#F8F3EA] transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm text-[#1C1208]">{client.name}</p>
                      <p className="text-xs text-[#6B5B4A] mt-0.5">{client.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <PawPrint className="w-3.5 h-3.5 text-[#A09070]" />
                      <span className="text-xs text-[#6B5B4A]">
                        {client.pets.map((p) => p.name || p.breed || p.type).join(", ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B5B4A] max-w-[180px] truncate">
                    {client.address}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#1C1208]">{clientJobs.length}</span>
                      {activeJobs.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: "#EDF0D8", color: "#5A7840" }}>
                          {activeJobs.length} active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B5B4A]">
                    {formatDate(client.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#2E1A0E] hover:underline"
                    >
                      View <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#6B5B4A] text-sm">No clients found.</div>
        )}
      </div>
    </div>
  );
}
