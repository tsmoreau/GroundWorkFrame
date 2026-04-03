"use client";

import { useState } from "react";
import Link from "next/link";
import { useData } from "../data-context";
import {
  computeTotal,
  formatCurrency,
  formatDate,
  JOB_STATUS_LABELS,
  JOB_TYPE_LABELS,
  JOB_STATUS_ORDER,
} from "@/lib/utils";
import { LayoutGrid, List, ChevronRight } from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  quoted: { bg: "#F0EAE0", color: "#7C6E58", border: "#DDD0B8" },
  deposit_paid: { bg: "#e8f2fa", color: "#3a7db8", border: "#b8d4ed" },
  materials_ordered: { bg: "#fdf3e0", color: "#9A7018", border: "#f0d090" },
  scheduled: { bg: "#f0eaff", color: "#6b52c8", border: "#c8baee" },
  in_progress: { bg: "#E8F0D8", color: "#5A7840", border: "#90BC88" },
  complete: { bg: "#EDF0D8", color: "#5A7840", border: "#90BC78" },
  cancelled: { bg: "#fce8e8", color: "#A83028", border: "#e8a0a0" },
};

function KanbanCard({ job }: { job: ReturnType<typeof useData>["jobs"][0] }) {
  const total = computeTotal(job.lineItems);
  return (
    <Link
      href={`/admin/jobs/${job.id}`}
      className="block bg-white rounded-lg border border-[#DDD0B8] p-3 hover:shadow-sm transition-shadow cursor-pointer"
    >
      <p className="text-xs font-semibold text-[#1C1208] leading-tight">{job.title}</p>
      <p className="text-xs text-[#6B5B4A] mt-1">{job.clientName}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs font-bold text-[#1C1208]">{formatCurrency(total)}</span>
        {job.scheduledStart && (
          <span className="text-xs text-[#A09070]">{formatDate(job.scheduledStart)}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#F0E4D4] text-[#7C6E58]">
          {JOB_TYPE_LABELS[job.type]}
        </span>
      </div>
    </Link>
  );
}

export default function JobsPage() {
  const { jobs } = useData();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");

  const activeStatuses = JOB_STATUS_ORDER.filter((s) => s !== "cancelled");
  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1208]">Jobs</h1>
          <p className="text-sm text-[#6B5B4A] mt-1">{jobs.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20 bg-white"
          />
          <div className="flex border border-[#DDD0B8] rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setView("kanban")}
              className={`p-2 transition-colors ${view === "kanban" ? "bg-[#C8A548] text-[#1C1208]" : "text-[#6B5B4A] hover:bg-[#F5F0E8]"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-[#C8A548] text-[#1C1208]" : "text-[#6B5B4A] hover:bg-[#F5F0E8]"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {activeStatuses.map((status) => {
            const statusJobs = filtered.filter((j) => j.status === status);
            const style = STATUS_STYLES[status];
            return (
              <div key={status} className="flex-shrink-0 w-56">
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-t-lg border border-b-0"
                  style={{ backgroundColor: style.bg, borderColor: style.border }}
                >
                  <span className="text-xs font-semibold" style={{ color: style.color }}>
                    {JOB_STATUS_LABELS[status]}
                  </span>
                  <span className="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full bg-white"
                    style={{ color: style.color }}>
                    {statusJobs.length}
                  </span>
                </div>
                <div
                  className="min-h-[120px] rounded-b-lg border border-t-0 p-2 space-y-2"
                  style={{ borderColor: style.border, backgroundColor: style.bg + "80" }}
                >
                  {statusJobs.map((job) => (
                    <KanbanCard key={job.id} job={job} />
                  ))}
                  {statusJobs.length === 0 && (
                    <p className="text-xs text-center py-4" style={{ color: style.color, opacity: 0.5 }}>
                      Empty
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#DDD0B8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EDE4D0]">
                {["Job", "Client", "Type", "Status", "Total", "Scheduled"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#6B5B4A] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EEE0]">
              {filtered.map((job) => {
                const sc = STATUS_STYLES[job.status];
                return (
                  <tr key={job.id} className="hover:bg-[#F8F3EA] transition-colors">
                    <td className="px-4 py-3 font-medium text-sm text-[#1C1208]">{job.title}</td>
                    <td className="px-4 py-3 text-xs text-[#6B5B4A]">{job.clientName}</td>
                    <td className="px-4 py-3 text-xs text-[#6B5B4A]">{JOB_TYPE_LABELS[job.type]}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: sc.bg, color: sc.color }}>
                        {JOB_STATUS_LABELS[job.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#1C1208]">
                      {formatCurrency(computeTotal(job.lineItems))}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B5B4A]">
                      {job.scheduledStart ? formatDate(job.scheduledStart) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/jobs/${job.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-[#2E1A0E] hover:underline">
                        View <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
