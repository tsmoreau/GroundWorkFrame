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
} from "@/lib/utils";
import { LEAD_STATUS_COLORS } from "@/lib/status-colors";
import {
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
  PawPrint,
  MessageSquare,
  ArrowRight,
  Pencil,
} from "lucide-react";
import type { LeadSource } from "@/lib/types";

const STATUS_OPTIONS = ["new", "contacted", "qualified", "converted", "dead"];

const INPUT_CLASS =
  "w-full text-sm border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-espresso/20 bg-white";

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
  const [editing, setEditing] = useState(false);

  const lead = leads.find((l) => l.id === id);

  // Edit form — initialized lazily from lead
  const [editForm, setEditForm] = useState(() =>
    lead
      ? {
          name: lead.name,
          email: lead.email,
          phone: lead.phone ?? "",
          address: lead.address ?? "",
          source: lead.source,
          message: lead.message,
          petType: lead.petInfo.type,
          petBreed: lead.petInfo.breed ?? "",
          petCount: lead.petInfo.count ?? 1,
        }
      : null,
  );

  if (!lead || !editForm) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-stone">Lead not found.</p>
        <Link
          href="/admin/leads"
          className="text-sm text-espresso hover:underline mt-2 inline-block"
        >
          Back to leads
        </Link>
      </div>
    );
  }

  const ef = (key: keyof typeof editForm, val: string | number) =>
    setEditForm((prev) => (prev ? { ...prev, [key]: val } : prev));

  const handleStartEdit = () => {
    setEditForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone ?? "",
      address: lead.address ?? "",
      source: lead.source,
      message: lead.message,
      petType: lead.petInfo.type,
      petBreed: lead.petInfo.breed ?? "",
      petCount: lead.petInfo.count ?? 1,
    });
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const handleSaveEdit = () => {
    updateLead(lead.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone || undefined,
      address: editForm.address || undefined,
      source: editForm.source,
      message: editForm.message,
      petInfo: {
        type: editForm.petType as "cat" | "dog" | "both",
        breed: editForm.petBreed || undefined,
        count: editForm.petCount || undefined,
      },
    });
    setEditing(false);
  };

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
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/leads"
          className="flex items-center gap-1 text-sm text-stone hover:text-charcoal transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Leads
        </Link>
        <span className="text-separator">/</span>
        <span className="text-sm text-charcoal font-medium truncate">
          {lead.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-5">
          {/* Header */}
          <div className="bg-white rounded-xl border border-border p-4 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {editing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => ef("name", e.target.value)}
                    className="text-xl font-bold text-charcoal w-full border-b border-border bg-transparent pb-1 focus:outline-none focus:border-espresso"
                  />
                ) : (
                  <h1 className="text-xl font-bold text-charcoal">
                    {lead.name}
                  </h1>
                )}
                {editing ? (
                  <div className="mt-2">
                    <select
                      value={editForm.source}
                      onChange={(e) =>
                        ef("source", e.target.value as LeadSource)
                      }
                      className={INPUT_CLASS + " max-w-[200px]"}
                    >
                      {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-xs text-stone mt-1">
                    {SOURCE_LABELS[lead.source]} · {timeAgo(lead.createdAt)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-sm border border-border rounded-lg px-3 py-1.5 focus:outline-none"
                  disabled={lead.status === "converted"}
                  style={{ color: LEAD_STATUS_COLORS[lead.status] }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option
                      key={s}
                      value={s}
                      className="text-charcoal capitalize"
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                {!editing && (
                  <button
                    onClick={handleStartEdit}
                    className="p-1.5 rounded-lg text-stone hover:text-charcoal hover:bg-parchment-dark transition-colors"
                    title="Edit lead"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Contact fields */}
            <div className="mt-4 space-y-2">
              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => ef("email", e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => ef("phone", e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => ef("address", e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-stone">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:text-espresso"
                    >
                      {lead.email}
                    </a>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm text-stone">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {lead.address && (
                    <div className="flex items-center gap-2 text-sm text-stone">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(lead.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-espresso"
                      >
                        {lead.address}
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Message */}
            <div className="mt-4 pt-4 border-t border-parchment-dark">
              <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </p>
              {editing ? (
                <textarea
                  value={editForm.message}
                  onChange={(e) => ef("message", e.target.value)}
                  rows={3}
                  className={INPUT_CLASS + " resize-none"}
                />
              ) : (
                <p className="text-sm text-charcoal leading-relaxed">
                  {lead.message}
                </p>
              )}
            </div>

            {/* Edit actions */}
            {editing && (
              <div className="flex gap-2 mt-5 pt-4 border-t border-parchment-dark">
                <button
                  onClick={handleSaveEdit}
                  disabled={!editForm.name.trim() || !editForm.email.trim()}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-charcoal bg-gold disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-5 py-2 rounded-lg text-sm font-medium border border-border text-stone"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Notes Timeline */}
          <div className="bg-white rounded-xl border border-border p-4 md:p-6">
            <h2 className="font-semibold text-sm text-charcoal mb-4">Notes</h2>
            {lead.notes.length === 0 && (
              <p className="text-sm text-stone mb-4">No notes yet.</p>
            )}
            <div className="space-y-3 mb-4">
              {lead.notes.map((note, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-border">
                  <p className="text-sm text-charcoal leading-relaxed">
                    {note.text}
                  </p>
                  <p className="text-xs text-sand-dim mt-1">
                    {formatDateTime(note.createdAt)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={2}
                className="flex-1 text-sm border border-border rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-espresso/20"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-charcoal bg-gold disabled:opacity-50 self-end"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Pet Info */}
          <div className="bg-white rounded-xl border border-border p-4 md:p-5">
            <h3 className="font-semibold text-sm text-charcoal mb-3 flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-stone" />
              Pet Info
            </h3>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-stone mb-1">Type</label>
                  <div className="flex gap-3">
                    {(["cat", "dog", "both"] as const).map((t) => (
                      <label
                        key={t}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="radio"
                          checked={editForm.petType === t}
                          onChange={() => ef("petType", t)}
                          className="accent-espresso"
                        />
                        <span className="text-sm capitalize text-charcoal">
                          {t}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-stone mb-1">Breed</label>
                  <input
                    type="text"
                    value={editForm.petBreed}
                    onChange={(e) => ef("petBreed", e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone mb-1">Count</label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.petCount}
                    onChange={(e) =>
                      ef("petCount", parseInt(e.target.value) || 1)
                    }
                    className={INPUT_CLASS + " max-w-[80px]"}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-stone">Type</span>
                  <span className="font-medium capitalize">
                    {lead.petInfo.type}
                  </span>
                </div>
                {lead.petInfo.breed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone">Breed</span>
                    <span className="font-medium">{lead.petInfo.breed}</span>
                  </div>
                )}
                {lead.petInfo.count && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone">Count</span>
                    <span className="font-medium">{lead.petInfo.count}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Map Preview */}
          {lead.address && !editing && (
            <div className="bg-white rounded-xl border border-border p-4 md:p-5">
              <h3 className="font-semibold text-sm text-charcoal mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone" />
                Location
              </h3>
              <p className="text-xs text-stone mb-3">{lead.address}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(lead.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-espresso hover:underline"
              >
                Open in Maps <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl border border-border p-4 md:p-5">
            <h3 className="font-semibold text-sm text-charcoal mb-3">
              Actions
            </h3>
            {lead.status === "converted" && lead.convertedTo ? (
              <Link
                href={`/admin/clients/${lead.convertedTo}`}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-espresso hover:bg-parchment"
              >
                View Client Record
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={handleConvert}
                disabled={converting || lead.status === "dead" || editing}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-charcoal bg-gold disabled:opacity-50"
              >
                {converting ? "Converting..." : "Convert to Client"}
              </button>
            )}
          </div>

          {/* Meta */}
          <div className="text-xs text-sand-dim space-y-1">
            <p>Created {formatDate(lead.createdAt)}</p>
            <p>Updated {formatDate(lead.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
