"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useData } from "../../data-context";
import {
  formatDate,
  formatDateTime,
  computeTotal,
  formatCurrency,
  JOB_STATUS_LABELS,
  INVOICE_STATUS_LABELS,
} from "@/lib/utils";
import {
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
  PawPrint,
  Briefcase,
  FileText,
  ArrowRight,
} from "lucide-react";

const JOB_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  quoted: { bg: "#f5f3ef", color: "#7c7566" },
  deposit_paid: { bg: "#e8f2fa", color: "#3a7db8" },
  materials_ordered: { bg: "#fdf3e0", color: "#b07d20" },
  scheduled: { bg: "#f0eaff", color: "#6b52c8" },
  in_progress: { bg: "#e0f2f0", color: "#2a7c70" },
  complete: { bg: "#e8f5ee", color: "#2d6a4f" },
  cancelled: { bg: "#fce8e8", color: "#b93232" },
};

const INV_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft: { bg: "#f5f3ef", color: "#7c7566" },
  sent: { bg: "#e8f2fa", color: "#3a7db8" },
  viewed: { bg: "#fdf3e0", color: "#b07d20" },
  paid: { bg: "#e8f5ee", color: "#2d6a4f" },
  void: { bg: "#fce8e8", color: "#b93232" },
};

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { clients, jobs, invoices, updateClient } = useData();
  const [noteText, setNoteText] = useState("");

  const client = clients.find((c) => c.id === id);
  if (!client) {
    return (
      <div className="p-8">
        <p className="text-[#5c5c54]">Client not found.</p>
        <Link href="/admin/clients" className="text-sm text-[#1c3829] hover:underline mt-2 inline-block">
          Back to clients
        </Link>
      </div>
    );
  }

  const clientJobs = jobs.filter((j) => j.clientId === client.id);
  const clientInvoices = invoices.filter((i) => i.clientId === client.id);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    updateClient(client.id, {
      notes: [
        ...client.notes,
        { text: noteText.trim(), createdAt: new Date().toISOString() },
      ],
    });
    setNoteText("");
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/clients" className="flex items-center gap-1 text-sm text-[#5c5c54] hover:text-[#1a1a18]">
          <ChevronLeft className="w-4 h-4" />
          Clients
        </Link>
        <span className="text-[#d0cbc4]">/</span>
        <span className="text-sm text-[#1a1a18] font-medium">{client.name}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          {/* Contact Card */}
          <div className="bg-white rounded-xl border border-[#e0dbd0] p-6">
            <h1 className="text-xl font-bold text-[#1a1a18]">{client.name}</h1>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#5c5c54]">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${client.email}`} className="hover:text-[#1c3829]">{client.email}</a>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-[#5c5c54]">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[#5c5c54]">
                <MapPin className="w-4 h-4" />
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(client.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1c3829]"
                >
                  {client.address}
                </a>
              </div>
            </div>
          </div>

          {/* Jobs */}
          <div className="bg-white rounded-xl border border-[#e0dbd0] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-[#1a1a18] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#5c5c54]" />
                Jobs ({clientJobs.length})
              </h2>
              <Link href="/admin/jobs" className="text-xs text-[#1c3829] hover:underline">
                All jobs
              </Link>
            </div>
            {clientJobs.length === 0 ? (
              <p className="text-sm text-[#5c5c54]">No jobs yet.</p>
            ) : (
              <div className="divide-y divide-[#f8f5f0]">
                {clientJobs.map((job) => {
                  const sc = JOB_STATUS_COLORS[job.status] || JOB_STATUS_COLORS.quoted;
                  return (
                    <Link
                      key={job.id}
                      href={`/admin/jobs/${job.id}`}
                      className="flex items-center justify-between py-3 hover:bg-[#faf8f5] -mx-6 px-6 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#1a1a18]">{job.title}</p>
                        <span
                          className="inline-flex mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                        >
                          {JOB_STATUS_LABELS[job.status]}
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#1a1a18]">
                          {formatCurrency(computeTotal(job.lineItems))}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#a09890]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-xl border border-[#e0dbd0] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-[#1a1a18] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5c5c54]" />
                Invoices ({clientInvoices.length})
              </h2>
            </div>
            {clientInvoices.length === 0 ? (
              <p className="text-sm text-[#5c5c54]">No invoices yet.</p>
            ) : (
              <div className="divide-y divide-[#f8f5f0]">
                {clientInvoices.map((inv) => {
                  const sc = INV_STATUS_COLORS[inv.status] || INV_STATUS_COLORS.draft;
                  return (
                    <Link
                      key={inv.id}
                      href={`/admin/invoices/${inv.id}`}
                      className="flex items-center justify-between py-3 hover:bg-[#faf8f5] -mx-6 px-6 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#1a1a18]">{inv.invoiceNumber}</p>
                        <span
                          className="inline-flex mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                        >
                          {INVOICE_STATUS_LABELS[inv.status]}
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#1a1a18]">
                          {formatCurrency(computeTotal(inv.lineItems))}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#a09890]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-[#e0dbd0] p-6">
            <h2 className="font-semibold text-sm text-[#1a1a18] mb-4">Notes</h2>
            {client.notes.length === 0 && <p className="text-sm text-[#5c5c54] mb-4">No notes yet.</p>}
            <div className="space-y-3 mb-4">
              {client.notes.map((note, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-[#e0dbd0]">
                  <p className="text-sm text-[#1a1a18]">{note.text}</p>
                  <p className="text-xs text-[#a09890] mt-1">{formatDateTime(note.createdAt)}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={2}
                className="flex-1 text-sm border border-[#e0dbd0] rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 self-end"
                style={{ backgroundColor: "#1c3829" }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#e0dbd0] p-5">
            <h3 className="font-semibold text-sm text-[#1a1a18] mb-3 flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-[#5c5c54]" />
              Pets
            </h3>
            <div className="space-y-3">
              {client.pets.map((pet, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium text-[#1a1a18]">{pet.name || "(unnamed)"}</p>
                  <p className="text-xs text-[#5c5c54] capitalize">
                    {pet.type}{pet.breed ? ` · ${pet.breed}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {client.leadId && (
            <div className="bg-white rounded-xl border border-[#e0dbd0] p-5">
              <h3 className="font-semibold text-sm text-[#1a1a18] mb-3">Origin</h3>
              <Link
                href={`/admin/leads/${client.leadId}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#1c3829] hover:underline"
              >
                View original lead <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          <div className="text-xs text-[#a09890] space-y-1">
            <p>Client since {formatDate(client.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
