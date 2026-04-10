"use client";

import { useState } from "react";
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
import {
  LayoutGrid,
  List,
  Plus,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import type { Job, JobType } from "@/lib/types";

const STATUS_STYLES: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  quoted: { bg: "var(--color-parchment-dark)", color: "var(--color-stone)", border: "var(--color-border)" },
  deposit_paid: { bg: "#e8f2fa", color: "#3a7db8", border: "#b8d4ed" },
  materials_ordered: { bg: "#e8f4ec", color: "#496455", border: "#b0cdbb" },
  scheduled: { bg: "#f0eaff", color: "#6b52c8", border: "#c8baee" },
  in_progress: { bg: "#E8F0D8", color: "#5A7840", border: "#90BC88" },
  complete: { bg: "var(--color-parchment-dark)", color: "var(--color-paid)", border: "var(--color-border)" },
  cancelled: { bg: "#fce8e8", color: "#A83028", border: "#e8a0a0" },
};

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
      className="bg-white rounded-lg border border-[var(--color-border)] p-3 hover:shadow-sm transition-shadow cursor-pointer"
    >
      <p className="text-xs font-semibold text-[var(--color-charcoal)] leading-tight">
        {job.title}
      </p>
      <p className="text-xs text-[var(--color-stone)] mt-1">{job.clientName}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs font-bold text-[var(--color-charcoal)]">
          {formatCurrency(total)}
        </span>
        {job.scheduledStart && (
          <span className="text-xs text-[var(--color-stone)]">
            {formatDate(job.scheduledStart)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-parchment-dark)] text-[var(--color-stone)]">
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

  return (
    <div className="p-8 min-w-0 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Jobs</h1>
          <p className="text-sm text-[var(--color-stone)] mt-1">{jobs.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-[var(--color-border)] rounded-lg px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/20 bg-white"
          />
          <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setView("kanban")}
              className={`p-2 transition-colors ${view === "kanban" ? "bg-[var(--color-gold)] text-[var(--color-charcoal)]" : "text-[var(--color-stone)] hover:bg-[var(--color-parchment)]"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-[var(--color-gold)] text-[var(--color-charcoal)]" : "text-[var(--color-stone)] hover:bg-[var(--color-parchment)]"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-charcoal)]"
            style={{ backgroundColor: "var(--color-gold)" }}
          >
            <Plus className="w-4 h-4" />
            New Job
          </button>
        </div>
      </div>

      {/* Kanban view — scrolls independently */}
      {view === "kanban" ? (
        <div className="flex-1 -mx-8 overflow-x-auto">
          <div className="flex gap-4 px-8 pb-4">
            {activeStatuses.map((status) => {
              const statusJobs = filtered.filter((j) => j.status === status);
              const style = STATUS_STYLES[status];
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
      ) : (
        /* List view */
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-parchment-dark)]">
                {LIST_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-stone)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-charcoal)] transition-colors select-none"
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
            <tbody className="divide-y divide-[var(--color-parchment-dark)]">
              {filtered.map((job) => {
                const sc = STATUS_STYLES[job.status];
                return (
                  <tr
                    key={job.id}
                    onClick={() => router.push(`/admin/jobs/${job.id}`)}
                    className="hover:bg-[var(--color-parchment-dark)] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-sm text-[var(--color-charcoal)]">
                      {job.title}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-stone)]">
                      {job.clientName}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-stone)]">
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
                    <td className="px-4 py-3 text-sm font-semibold text-[var(--color-charcoal)]">
                      {formatCurrency(computeTotal(job.lineItems))}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-stone)]">
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
            <div className="text-center py-12 text-[var(--color-stone)] text-sm">
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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[var(--color-border)] p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--color-charcoal)]">New Job</h3>
          <button
            onClick={onClose}
            className="text-[var(--color-stone)] hover:text-[var(--color-charcoal)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {clients.length === 0 ? (
          <p className="text-sm text-[var(--color-stone)] py-4">
            No clients yet. Create a client first.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-stone)] uppercase tracking-wider mb-1">
                Client *
              </label>
              <select
                value={form.clientId}
                onChange={(e) => set("clientId", e.target.value)}
                className="w-full text-sm border border-[var(--color-border)] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/20"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-stone)] uppercase tracking-wider mb-1">
                Job title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full text-sm border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/20"
                placeholder="e.g. Smith Catio — 12×8 Standard"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-stone)] uppercase tracking-wider mb-1">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value as JobType)}
                  className="w-full text-sm border border-[var(--color-border)] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/20"
                >
                  {Object.entries(JOB_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-stone)] uppercase tracking-wider mb-1">
                  Est. days
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.estimatedDays}
                  onChange={(e) =>
                    set("estimatedDays", parseInt(e.target.value) || 1)
                  }
                  className="w-full text-sm border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-espresso)]/20"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-[var(--color-charcoal)] disabled:opacity-50"
            style={{ backgroundColor: "var(--color-gold)" }}
          >
            Create Job
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-[var(--color-border)] text-[var(--color-stone)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
