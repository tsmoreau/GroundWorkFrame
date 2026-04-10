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
  quoted: { bg: "#f3f4f1", color: "#424844" },
  deposit_paid: { bg: "#e8f2fa", color: "#3a7db8" },
  materials_ordered: { bg: "#e8f4ec", color: "#496455" },
  scheduled: { bg: "#f0eaff", color: "#6b52c8" },
  in_progress: { bg: "#E8F0D8", color: "#5A7840" },
  complete: { bg: "#EDF0D8", color: "#5A7840" },
  cancelled: { bg: "#fce8e8", color: "#A83028" },
};

const INV_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft: { bg: "#f3f4f1", color: "#424844" },
  sent: { bg: "#e8f2fa", color: "#3a7db8" },
  viewed: { bg: "#e8f4ec", color: "#496455" },
  paid: { bg: "#EDF0D8", color: "#5A7840" },
  void: { bg: "#fce8e8", color: "#A83028" },
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
        <p className="text-[#424844]">Client not found.</p>
        <Link href="/admin/clients" className="text-sm text-[#173124] hover:underline mt-2 inline-block">
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
        <Link href="/admin/clients" className="flex items-center gap-1 text-sm text-[#424844] hover:text-[#191c1b]">
          <ChevronLeft className="w-4 h-4" />
          Clients
        </Link>
        <span className="text-[#c2c8c2]">/</span>
        <span className="text-sm text-[#191c1b] font-medium">{client.name}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          {/* Contact Card */}
          <div className="admin-card p-6">
            <h1 className="text-xl font-bold text-[#191c1b]">{client.name}</h1>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#424844]">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${client.email}`} className="hover:text-[#173124]">{client.email}</a>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-[#424844]">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[#424844]">
                <MapPin className="w-4 h-4" />
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(client.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#173124]"
                >
                  {client.address}
                </a>
              </div>
            </div>
          </div>

          {/* Jobs */}
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-[#191c1b] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#424844]" />
                Jobs ({clientJobs.length})
              </h2>
              <Link href="/admin/jobs" className="text-xs text-[#173124] hover:underline">
                All jobs
              </Link>
            </div>
            {clientJobs.length === 0 ? (
              <p className="text-sm text-[#424844]">No jobs yet.</p>
            ) : (
              <div className="divide-y divide-[#edeeeb]">
                {clientJobs.map((job) => {
                  const sc = JOB_STATUS_COLORS[job.status] || JOB_STATUS_COLORS.quoted;
                  return (
                    <Link
                      key={job.id}
                      href={`/admin/jobs/${job.id}`}
                      className="flex items-center justify-between py-3 hover:bg-[#f3f4f1] -mx-6 px-6 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#191c1b]">{job.title}</p>
                        <span
                          className="inline-flex mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                        >
                          {JOB_STATUS_LABELS[job.status]}
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#191c1b]">
                          {formatCurrency(computeTotal(job.lineItems))}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#727973]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Invoices */}
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-[#191c1b] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#424844]" />
                Invoices ({clientInvoices.length})
              </h2>
            </div>
            {clientInvoices.length === 0 ? (
              <p className="text-sm text-[#424844]">No invoices yet.</p>
            ) : (
              <div className="divide-y divide-[#edeeeb]">
                {clientInvoices.map((inv) => {
                  const sc = INV_STATUS_COLORS[inv.status] || INV_STATUS_COLORS.draft;
                  return (
                    <Link
                      key={inv.id}
                      href={`/admin/invoices/${inv.id}`}
                      className="flex items-center justify-between py-3 hover:bg-[#f3f4f1] -mx-6 px-6 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#191c1b]">{inv.invoiceNumber}</p>
                        <span
                          className="inline-flex mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                        >
                          {INVOICE_STATUS_LABELS[inv.status]}
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#191c1b]">
                          {formatCurrency(computeTotal(inv.lineItems))}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#727973]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="admin-card p-6">
            <h2 className="font-semibold text-sm text-[#191c1b] mb-4">Notes</h2>
            {client.notes.length === 0 && <p className="text-sm text-[#424844] mb-4">No notes yet.</p>}
            <div className="space-y-3 mb-4">
              {client.notes.map((note, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-[#c2c8c2]">
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
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#2d3d38] disabled:opacity-50 self-end"
                style={{ backgroundColor: "#c8d5cc" }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="admin-card p-5">
            <h3 className="font-semibold text-sm text-[#191c1b] mb-3 flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-[#424844]" />
              Pets
            </h3>
            <div className="space-y-3">
              {client.pets.map((pet, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium text-[#191c1b]">{pet.name || "(unnamed)"}</p>
                  <p className="text-xs text-[#424844] capitalize">
                    {pet.type}{pet.breed ? ` · ${pet.breed}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {client.leadId && (
            <div className="admin-card p-5">
              <h3 className="font-semibold text-sm text-[#191c1b] mb-3">Origin</h3>
              <Link
                href={`/admin/leads/${client.leadId}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#173124] hover:underline"
              >
                View original lead <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          <div className="text-xs text-[#727973] space-y-1">
            <p>Client since {formatDate(client.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
