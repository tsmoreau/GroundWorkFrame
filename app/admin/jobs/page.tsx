"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../data-context";
import {
  computeTotal,
  formatCurrency,
  formatDate,
  JOB_STATUS_LABELS,
  JOB_TYPE_LABELS,
  JOB_STATUS_ORDER,
} from "@/lib/utils";
import { JOB_STATUS_STYLES } from "@/lib/status-colors";
import {
  LayoutGrid,
  List,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import type { Job, JobType } from "@/lib/types";

type SortKey = "title" | "client" | "type" | "status" | "total" | "scheduled";
type SortDir = "asc" | "desc";

const LIST_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "title", label: "Job" },
  { key: "client", label: "Client" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "total", label: "Total" },
  { key: "scheduled", label: "Scheduled" },
];

function getSortValue(job: Job, key: SortKey): string | number {
  switch (key) {
    case "title":
      return job.title.toLowerCase();
    case "client":
      return job.clientName.toLowerCase();
    case "type":
      return job.type;
    case "status":
      return JOB_STATUS_ORDER.indexOf(job.status);
    case "total":
      return computeTotal(job.lineItems);
    case "scheduled":
      return job.scheduledStart || "";
  }
}

function KanbanCard({ job }: { job: Job }) {
  const router = useRouter();
  const total = computeTotal(job.lineItems);
  return (
    <div
      onClick={() => router.push(`/admin/jobs/${job.id}`)}
      className="bg-white rounded-lg border border-border p-3 hover:shadow-sm transition-shadow cursor-pointer"
    >
      <p className="text-xs font-semibold text-charcoal leading-tight">
        {job.title}
      </p>
      <p className="text-xs text-stone mt-1">{job.clientName}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs font-bold text-charcoal">
          {formatCurrency(total)}
        </span>
        {job.scheduledStart && (
          <span className="text-xs text-sand-dim">
            {formatDate(job.scheduledStart)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-warm-sand text-stone">
          {JOB_TYPE_LABELS[job.type]}
        </span>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const { jobs, clients, addJob } = useData();
  const router = useRouter();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("scheduled");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [kanbanIdx, setKanbanIdx] = useState(0);

  // Swipe tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const activeStatuses = JOB_STATUS_ORDER.filter((s) => s !== "cancelled");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "scheduled" || key === "total" ? "desc" : "asc");
    }
  };

  const filtered = jobs
    .filter(
      (j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.clientName.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only count horizontal swipes (more horizontal than vertical, min 50px)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && kanbanIdx < activeStatuses.length - 1) {
        setKanbanIdx((i) => i + 1);
      } else if (dx > 0 && kanbanIdx > 0) {
        setKanbanIdx((i) => i - 1);
      }
    }
  };

  // Current mobile kanban column
  const mobileStatus = activeStatuses[kanbanIdx];
  const mobileStatusJobs = filtered.filter((j) => j.status === mobileStatus);
  const mobileStyle = JOB_STATUS_STYLES[mobileStatus];

  return (
    <div className="p-4 md:p-8 min-w-0 h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Jobs</h1>
            <p className="text-sm text-stone mt-1">{jobs.length} total</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex border border-border rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setView("kanban")}
                className={`p-2 transition-colors ${view === "kanban" ? "bg-gold text-charcoal" : "text-stone hover:bg-parchment"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 transition-colors ${view === "list" ? "bg-gold text-charcoal" : "text-stone hover:bg-parchment"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-charcoal bg-gold"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Job</span>
            </button>
          </div>
        </div>

        {/* Search bar — own row */}
        <div className="mt-4 relative md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-dim" />
          <input
            type="search"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-espresso/20"
          />
        </div>

        {/* Mobile view toggle */}
        <div className="flex md:hidden mt-3 border border-border rounded-lg overflow-hidden bg-white w-fit">
          <button
            onClick={() => setView("kanban")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "kanban" ? "bg-gold text-charcoal" : "text-stone hover:bg-parchment"}`}
          >
            Board
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "list" ? "bg-gold text-charcoal" : "text-stone hover:bg-parchment"}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Kanban view */}
      {view === "kanban" ? (
        <>
          {/* Mobile kanban — single column with swipe */}
          <div
            className="flex-1 md:hidden flex flex-col min-h-0"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Column nav */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setKanbanIdx((i) => Math.max(0, i - 1))}
                disabled={kanbanIdx === 0}
                className="p-1.5 rounded-lg text-stone hover:text-charcoal disabled:opacity-30 disabled:hover:text-stone"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <span
                  className="text-sm font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: mobileStyle.bg,
                    color: mobileStyle.color,
                  }}
                >
                  {JOB_STATUS_LABELS[mobileStatus]} ({mobileStatusJobs.length})
                </span>
              </div>
              <button
                onClick={() =>
                  setKanbanIdx((i) =>
                    Math.min(activeStatuses.length - 1, i + 1),
                  )
                }
                disabled={kanbanIdx === activeStatuses.length - 1}
                className="p-1.5 rounded-lg text-stone hover:text-charcoal disabled:opacity-30 disabled:hover:text-stone"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Position dots */}
            <div className="flex items-center justify-center gap-1.5 mb-3">
              {activeStatuses.map((s, i) => {
                const dotStyle = JOB_STATUS_STYLES[s];
                return (
                  <button
                    key={s}
                    onClick={() => setKanbanIdx(i)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      backgroundColor:
                        i === kanbanIdx ? dotStyle.color : dotStyle.border,
                      transform: i === kanbanIdx ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                );
              })}
            </div>

            {/* Column content */}
            <div
              className="flex-1 overflow-y-auto rounded-lg border p-3 space-y-2"
              style={{
                borderColor: mobileStyle.border,
                backgroundColor: mobileStyle.bg + "80",
              }}
            >
              {mobileStatusJobs.map((job) => (
                <KanbanCard key={job.id} job={job} />
              ))}
              {mobileStatusJobs.length === 0 && (
                <p
                  className="text-sm text-center py-8"
                  style={{ color: mobileStyle.color, opacity: 0.5 }}
                >
                  No jobs
                </p>
              )}
            </div>
          </div>

          {/* Desktop kanban — horizontal scroll */}
          <div className="hidden md:block flex-1 -mx-8 overflow-x-auto">
            <div className="flex gap-4 px-8 pb-4">
              {activeStatuses.map((status) => {
                const statusJobs = filtered.filter((j) => j.status === status);
                const style = JOB_STATUS_STYLES[status];
                return (
                  <div key={status} className="flex-shrink-0 w-56">
                    <div
                      className="flex items-center justify-between px-3 py-2 rounded-t-lg border border-b-0"
                      style={{
                        backgroundColor: style.bg,
                        borderColor: style.border,
                      }}
                    >
                      <span
                        className="text-xs font-semibold"
                        style={{ color: style.color }}
                      >
                        {JOB_STATUS_LABELS[status]}
                      </span>
                      <span
                        className="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full bg-white"
                        style={{ color: style.color }}
                      >
                        {statusJobs.length}
                      </span>
                    </div>
                    <div
                      className="min-h-[120px] rounded-b-lg border border-t-0 p-2 space-y-2"
                      style={{
                        borderColor: style.border,
                        backgroundColor: style.bg + "80",
                      }}
                    >
                      {statusJobs.map((job) => (
                        <KanbanCard key={job.id} job={job} />
                      ))}
                      {statusJobs.length === 0 && (
                        <p
                          className="text-xs text-center py-4"
                          style={{ color: style.color, opacity: 0.5 }}
                        >
                          Empty
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* List view */
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {/* Mobile card list */}
          <div className="divide-y divide-row-divider md:hidden">
            {filtered.map((job) => {
              const sc = JOB_STATUS_STYLES[job.status];
              return (
                <div
                  key={job.id}
                  onClick={() => router.push(`/admin/jobs/${job.id}`)}
                  className="p-4 hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-charcoal">
                        {job.title}
                      </p>
                      <p className="text-xs text-stone mt-0.5">
                        {job.clientName}
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: sc.bg, color: sc.color }}
                    >
                      {JOB_STATUS_LABELS[job.status]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 text-xs text-stone">
                      <span>{JOB_TYPE_LABELS[job.type]}</span>
                      <span className="text-separator">·</span>
                      <span>
                        {job.scheduledStart
                          ? formatDate(job.scheduledStart)
                          : "Unscheduled"}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-charcoal">
                      {formatCurrency(computeTotal(job.lineItems))}
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
                {LIST_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left px-4 py-3 text-xs font-semibold text-stone uppercase tracking-wider cursor-pointer hover:text-charcoal transition-colors select-none"
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
            <tbody className="divide-y divide-row-divider">
              {filtered.map((job) => {
                const sc = JOB_STATUS_STYLES[job.status];
                return (
                  <tr
                    key={job.id}
                    onClick={() => router.push(`/admin/jobs/${job.id}`)}
                    className="hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-sm text-charcoal">
                      {job.title}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone">
                      {job.clientName}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone">
                      {JOB_TYPE_LABELS[job.type]}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        {JOB_STATUS_LABELS[job.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-charcoal">
                      {formatCurrency(computeTotal(job.lineItems))}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone">
                      {job.scheduledStart
                        ? formatDate(job.scheduledStart)
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-stone text-sm">
              No jobs found.
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <AddJobModal
          clients={clients}
          onClose={() => setShowAddModal(false)}
          onAdd={(data) => {
            const job = addJob(data);
            setShowAddModal(false);
            router.push(`/admin/jobs/${job.id}`);
          }}
        />
      )}
    </div>
  );
}

function AddJobModal({
  clients,
  onClose,
  onAdd,
}: {
  clients: { id: string; name: string }[];
  onClose: () => void;
  onAdd: (job: Omit<Job, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [form, setForm] = useState({
    clientId: clients[0]?.id || "",
    title: "",
    type: "catio" as JobType,
    estimatedDays: 3,
  });

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const selectedClient = clients.find((c) => c.id === form.clientId);
  const canSubmit = form.clientId && form.title.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd({
      clientId: form.clientId,
      clientName: selectedClient?.name || "",
      title: form.title,
      type: form.type,
      status: "quoted",
      lineItems: [],
      estimatedDays: form.estimatedDays,
      materialsCost: 0,
      photos: [],
      portfolioApproved: false,
      invoiceIds: [],
      notes: [],
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-border p-5 md:p-6 w-full max-w-md shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-charcoal">New Job</h3>
          <button
            onClick={onClose}
            className="text-sand-dim hover:text-charcoal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {clients.length === 0 ? (
          <p className="text-sm text-stone py-4">
            No clients yet. Create a client first.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1">
                Client *
              </label>
              <select
                value={form.clientId}
                onChange={(e) => set("clientId", e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-espresso/20"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1">
                Job title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-espresso/20"
                placeholder="e.g. Smith Catio — 12×8 Standard"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value as JobType)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-espresso/20"
                >
                  {Object.entries(JOB_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1">
                  Est. days
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.estimatedDays}
                  onChange={(e) =>
                    set("estimatedDays", parseInt(e.target.value) || 1)
                  }
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-espresso/20"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-charcoal bg-gold disabled:opacity-50"
          >
            Create Job
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-border text-stone"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
