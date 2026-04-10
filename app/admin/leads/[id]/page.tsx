"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useData } from "../../data-context";
import {
  formatDate,
  formatDateTime,
  SOURCE_LABELS,
  timeAgo,
  JOB_TYPE_LABELS,
} from "@/lib/utils";
import {
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
  PawPrint,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const STATUS_OPTIONS = ["new", "contacted", "qualified", "converted", "dead"];

const STATUS_COLORS: Record<string, string> = {
  new: "#173124",
  contacted: "#6b9dc2",
  qualified: "#5A7840",
  converted: "#173124",
  dead: "#727973",
};

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { leads, updateLead, convertLead } = useData();
  const router = useRouter();
  const [noteText, setNoteText] = useState("");
  const [converting, setConverting] = useState(false);

  const lead = leads.find((l) => l.id === id);

  if (!lead) {
    return (
      <div className="p-8">
        <p className="text-[#424844]">Lead not found.</p>
        <Link href="/admin/leads" className="text-sm text-[#173124] hover:underline mt-2 inline-block">
          Back to leads
        </Link>
      </div>
    );
  }

  const handleStatusChange = (status: string) => {
    if (status !== "converted") {
      updateLead(lead.id, { status: status as typeof lead.status });
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    updateLead(lead.id, {
      notes: [
        ...lead.notes,
        { text: noteText.trim(), createdAt: new Date().toISOString() },
      ],
    });
    setNoteText("");
  };

  const handleConvert = () => {
    setConverting(true);
    const client = convertLead(lead.id);
    if (client) {
      router.push(`/admin/clients/${client.id}`);
    } else {
      setConverting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/leads"
          className="flex items-center gap-1 text-sm text-[#424844] hover:text-[#191c1b] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Leads
        </Link>
        <span className="text-[#c2c8c2]">/</span>
        <span className="text-sm text-[#191c1b] font-medium">{lead.name}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="col-span-2 space-y-5">
          {/* Header */}
          <div className="admin-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-[#191c1b]">{lead.name}</h1>
                <p className="text-xs text-[#424844] mt-1">
                  {SOURCE_LABELS[lead.source]} · {timeAgo(lead.createdAt)}
                </p>
              </div>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-sm border border-[#c2c8c2] rounded-lg px-3 py-1.5 focus:outline-none"
                disabled={lead.status === "converted"}
                style={{ color: STATUS_COLORS[lead.status] }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="text-[#191c1b] capitalize">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#424844]">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${lead.email}`} className="hover:text-[#173124]">
                  {lead.email}
                </a>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 text-sm text-[#424844]">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {lead.address && (
                <div className="flex items-center gap-2 text-sm text-[#424844]">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(lead.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#173124]"
                  >
                    {lead.address}
                  </a>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="mt-4 pt-4 border-t border-[#e7e8e6]">
              <p className="text-xs font-semibold text-[#424844] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </p>
              <p className="text-sm text-[#191c1b] leading-relaxed">{lead.message}</p>
            </div>
          </div>

          {/* Notes Timeline */}
          <div className="admin-card p-6">
            <h2 className="font-semibold text-sm text-[#191c1b] mb-4">Notes</h2>
            {lead.notes.length === 0 && (
              <p className="text-sm text-[#424844] mb-4">No notes yet.</p>
            )}
            <div className="space-y-3 mb-4">
              {lead.notes.map((note, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-[#c2c8c2]">
                  <p className="text-sm text-[#191c1b] leading-relaxed">{note.text}</p>
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
          {/* Pet Info */}
          <div className="admin-card p-5">
            <h3 className="font-semibold text-sm text-[#191c1b] mb-3 flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-[#424844]" />
              Pet Info
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-[#424844]">Type</span>
                <span className="font-medium capitalize">{lead.petInfo.type}</span>
              </div>
              {lead.petInfo.breed && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#424844]">Breed</span>
                  <span className="font-medium">{lead.petInfo.breed}</span>
                </div>
              )}
              {lead.petInfo.count && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#424844]">Count</span>
                  <span className="font-medium">{lead.petInfo.count}</span>
                </div>
              )}
            </div>
          </div>

          {/* Map Preview */}
          {lead.address && (
            <div className="admin-card p-5">
              <h3 className="font-semibold text-sm text-[#191c1b] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#424844]" />
                Location
              </h3>
              <p className="text-xs text-[#424844] mb-3">{lead.address}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(lead.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#173124] hover:underline"
              >
                Open in Maps <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="admin-card p-5">
            <h3 className="font-semibold text-sm text-[#191c1b] mb-3">Actions</h3>
            {lead.status === "converted" && lead.convertedTo ? (
              <Link
                href={`/admin/clients/${lead.convertedTo}`}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium border border-[#c2c8c2] text-[#173124] hover:bg-[#f3f4f1]"
              >
                View Client Record
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={handleConvert}
                disabled={converting || lead.status === "dead"}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#2d3d38] disabled:opacity-50"
                style={{ backgroundColor: "#c8d5cc" }}
              >
                {converting ? "Converting..." : "Convert to Client"}
              </button>
            )}
          </div>

          {/* Meta */}
          <div className="text-xs text-[#727973] space-y-1">
            <p>Created {formatDate(lead.createdAt)}</p>
            <p>Updated {formatDate(lead.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
