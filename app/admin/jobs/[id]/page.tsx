"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useData } from "../../data-context";
import {
  computeTotal,
  formatCurrency,
  formatDate,
  formatDateTime,
  JOB_STATUS_LABELS,
  JOB_TYPE_LABELS,
  JOB_STATUS_ORDER,
  generateId,
} from "@/lib/utils";
import {
  ChevronLeft,
  Plus,
  Trash2,
  ArrowRight,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  quoted: { bg: "#f3f4f1", color: "#424844" },
  deposit_paid: { bg: "#e8f2fa", color: "#3a7db8" },
  materials_ordered: { bg: "#e8f4ec", color: "#496455" },
  scheduled: { bg: "#f0eaff", color: "#6b52c8" },
  in_progress: { bg: "#E8F0D8", color: "#5A7840" },
  complete: { bg: "#EDF0D8", color: "#5A7840" },
  cancelled: { bg: "#fce8e8", color: "#A83028" },
};

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { jobs, invoices, clients, updateJob, createInvoiceFromJob } = useData();
  const [noteText, setNoteText] = useState("");
  const [newItem, setNewItem] = useState({ description: "", amount: "" });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceType, setInvoiceType] = useState<"deposit" | "final" | "full">("deposit");

  const job = jobs.find((j) => j.id === id);
  if (!job) {
    return (
      <div className="p-8">
        <p className="text-[#424844]">Job not found.</p>
        <Link href="/admin/jobs" className="text-sm text-[#173124] hover:underline mt-2 inline-block">Back</Link>
      </div>
    );
  }

  const client = clients.find((c) => c.id === job.clientId);
  const jobInvoices = invoices.filter((i) => job.invoiceIds.includes(i.id));
  const total = computeTotal(job.lineItems);
  const margin = total - job.materialsCost;
  const statusStyle = STATUS_STYLES[job.status] || STATUS_STYLES.quoted;

  const currentStatusIdx = JOB_STATUS_ORDER.indexOf(job.status);
  const nextStatus = currentStatusIdx < JOB_STATUS_ORDER.length - 2
    ? JOB_STATUS_ORDER[currentStatusIdx + 1]
    : null;

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    updateJob(job.id, {
      notes: [
        ...job.notes,
        { text: noteText.trim(), createdAt: new Date().toISOString() },
      ],
    });
    setNoteText("");
  };

  const handleAddLineItem = () => {
    if (!newItem.description || !newItem.amount) return;
    const cents = Math.round(parseFloat(newItem.amount) * 100);
    if (isNaN(cents)) return;
    updateJob(job.id, {
      lineItems: [
        ...job.lineItems,
        { id: generateId("li"), description: newItem.description, amount: cents },
      ],
    });
    setNewItem({ description: "", amount: "" });
  };

  const handleRemoveLineItem = (liId: string) => {
    updateJob(job.id, {
      lineItems: job.lineItems.filter((li) => li.id !== liId),
    });
  };

  const handleAdvanceStatus = () => {
    if (nextStatus) updateJob(job.id, { status: nextStatus as typeof job.status });
  };

  const handleCreateInvoice = () => {
    createInvoiceFromJob(job.id, invoiceType);
    setShowInvoiceModal(false);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/jobs" className="flex items-center gap-1 text-sm text-[#424844] hover:text-[#191c1b]">
          <ChevronLeft className="w-4 h-4" />
          Jobs
        </Link>
        <span className="text-[#c2c8c2]">/</span>
        <span className="text-sm text-[#191c1b] font-medium truncate max-w-xs">{job.title}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          {/* Header */}
          <div className="admin-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-[#191c1b]">{job.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#424844]">{JOB_TYPE_LABELS[job.type]}</span>
                  <span className="text-[#c2c8c2]">·</span>
                  {client && (
                    <Link href={`/admin/clients/${client.id}`} className="text-xs text-[#173124] hover:underline">
                      {client.name}
                    </Link>
                  )}
                </div>
              </div>
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
              >
                {JOB_STATUS_LABELS[job.status]}
              </span>
            </div>

            {/* Status Flow */}
            <div className="mt-4 pt-4 border-t border-[#e7e8e6]">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {JOB_STATUS_ORDER.filter((s) => s !== "cancelled").map((s, i) => {
                  const idx = JOB_STATUS_ORDER.indexOf(s);
                  const isActive = s === job.status;
                  const isDone = idx < JOB_STATUS_ORDER.indexOf(job.status);
                  return (
                    <div key={s} className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          isActive ? "text-[#191c1b]" : isDone ? "text-[#5A7840]" : "text-[#727973]"
                        }`}
                        style={{
                          backgroundColor: isActive ? "#173124" : isDone ? "#EDF0D8" : "#f3f4f1",
                        }}
                      >
                        {JOB_STATUS_LABELS[s]}
                      </div>
                      {i < JOB_STATUS_ORDER.filter((s) => s !== "cancelled").length - 1 && (
                        <ChevronRight className="w-3 h-3 text-[#c2c8c2] flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
              {nextStatus && job.status !== "cancelled" && (
                <button
                  onClick={handleAdvanceStatus}
                  className="mt-3 text-sm font-medium px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: "#173124" }}
                >
                  Mark as {JOB_STATUS_LABELS[nextStatus]} →
                </button>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className="admin-card p-6">
            <h2 className="font-semibold text-sm text-[#191c1b] mb-4">Line Items</h2>
            <div className="divide-y divide-[#edeeeb]">
              {job.lineItems.map((li) => (
                <div key={li.id} className="flex items-center justify-between py-3">
                  <div className="flex-1 pr-4">
                    <p className="text-sm text-[#191c1b]">{li.description}</p>
                    {li.category && (
                      <p className="text-xs text-[#727973] mt-0.5 capitalize">{li.category}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#191c1b]">
                      {formatCurrency(li.amount)}
                    </span>
                    <button
                      onClick={() => handleRemoveLineItem(li.id)}
                      className="text-[#727973] hover:text-[#A83028] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add line item */}
            <div className="mt-4 pt-4 border-t border-[#e7e8e6] flex gap-2">
              <input
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Description"
                className="flex-1 text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
              />
              <input
                value={newItem.amount}
                onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                placeholder="$0.00"
                className="w-24 text-sm border border-[#c2c8c2] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
              />
              <button
                onClick={handleAddLineItem}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-[#173124] text-[#173124] hover:bg-[#edeeeb]"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-[#e7e8e6] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#424844]">Subtotal</span>
                <span className="font-semibold text-[#191c1b]">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#424844]">Materials cost (internal)</span>
                <span className="text-[#424844]">{formatCurrency(job.materialsCost)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-[#5A7840]">Margin</span>
                <span className="text-[#5A7840]">{formatCurrency(margin)}</span>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-[#191c1b] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#424844]" />
                Photos
              </h2>
              <label className="flex items-center gap-1 text-xs font-medium text-[#424844]">
                <input
                  type="checkbox"
                  checked={job.portfolioApproved}
                  onChange={(e) => updateJob(job.id, { portfolioApproved: e.target.checked })}
                  className="rounded"
                />
                Portfolio approved
              </label>
            </div>
            {job.photos.length === 0 ? (
              <p className="text-sm text-[#727973]">No photos yet. (Upload disabled in demo)</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {job.photos.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#edeeeb]">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="admin-card p-6">
            <h2 className="font-semibold text-sm text-[#191c1b] mb-4">Notes</h2>
            {job.notes.length === 0 && <p className="text-sm text-[#424844] mb-4">No notes yet.</p>}
            <div className="space-y-3 mb-4">
              {job.notes.map((note, i) => (
                <div key={i} className="pl-4 border-l-2 border-[#c2c8c2]">
                  <p className="text-sm text-[#191c1b]">{note.text}</p>
                  <p className="text-xs text-[#727973] mt-1">{formatDateTime(note.createdAt)}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={2}
                className="flex-1 text-sm border border-[#c2c8c2] rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#173124]/20"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 self-end"
                style={{ backgroundColor: "#173124" }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Schedule */}
          <div className="admin-card p-5">
            <h3 className="font-semibold text-sm text-[#191c1b] mb-3">Schedule</h3>
            <div className="space-y-2 text-sm">
              {job.scheduledStart ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#424844]">Start</span>
                    <span className="font-medium">{formatDate(job.scheduledStart)}</span>
                  </div>
                  {job.scheduledEnd && (
                    <div className="flex justify-between">
                      <span className="text-[#424844]">End</span>
                      <span className="font-medium">{formatDate(job.scheduledEnd)}</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[#727973] text-xs">Not yet scheduled</p>
              )}
              <div className="flex justify-between">
                <span className="text-[#424844]">Est. days</span>
                <span className="font-medium">{job.estimatedDays}</span>
              </div>
            </div>
          </div>

          {/* Invoices */}
          <div className="admin-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-[#191c1b]">Invoices</h3>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="text-xs font-medium text-[#173124] hover:underline flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                Create
              </button>
            </div>
            {jobInvoices.length === 0 ? (
              <p className="text-xs text-[#727973]">No invoices yet.</p>
            ) : (
              <div className="space-y-2">
                {jobInvoices.map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/admin/invoices/${inv.id}`}
                    className="flex items-center justify-between text-xs hover:text-[#173124]"
                  >
                    <span className="font-medium">{inv.invoiceNumber}</span>
                    <span className="capitalize text-[#424844]">{inv.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {client && (
            <div className="admin-card p-5">
              <h3 className="font-semibold text-sm text-[#191c1b] mb-2">Client</h3>
              <Link
                href={`/admin/clients/${client.id}`}
                className="flex items-center justify-between text-sm text-[#173124] hover:underline"
              >
                <span className="font-medium">{client.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <div className="text-xs text-[#727973] space-y-1">
            <p>Created {formatDate(job.createdAt)}</p>
            <p>Updated {formatDate(job.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowInvoiceModal(false)}>
          <div className="admin-card p-6 w-96 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-[#191c1b] mb-1">Create Invoice</h3>
            <p className="text-xs text-[#424844] mb-4">for {job.title}</p>
            <div className="space-y-2 mb-5">
              {(["deposit", "full", "final"] as const).map((t) => (
                <label key={t} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value={t}
                    checked={invoiceType === t}
                    onChange={() => setInvoiceType(t)}
                    className="accent-[#173124]"
                  />
                  <div>
                    <span className="text-sm font-medium capitalize text-[#191c1b]">{t}</span>
                    <span className="text-xs text-[#424844] ml-2">
                      {t === "deposit" ? `(${50}% = ${formatCurrency(Math.round(total * 0.5))})` :
                       t === "full" ? `(${formatCurrency(total)})` :
                       "(remaining balance)"}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateInvoice}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "#173124" }}
              >
                Create Invoice
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-[#c2c8c2] text-[#424844]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
