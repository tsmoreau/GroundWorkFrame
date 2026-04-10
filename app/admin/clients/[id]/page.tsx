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
import { JOB_STATUS_STYLES, INVOICE_STATUS_STYLES } from "@/lib/status-colors";
import {
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
  PawPrint,
  Briefcase,
  FileText,
  ArrowRight,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

const INPUT_CLASS =
  "w-full text-sm border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-espresso/20 bg-white";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { clients, jobs, invoices, updateClient } = useData();
  const [noteText, setNoteText] = useState("");
  const [editing, setEditing] = useState(false);

  const client = clients.find((c) => c.id === id);

  const [editForm, setEditForm] = useState(() =>
    client
      ? {
          name: client.name,
          email: client.email,
          phone: client.phone ?? "",
          address: client.address,
          pets: client.pets.map((p) => ({ ...p })),
        }
      : null,
  );

  if (!client || !editForm) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-stone">Client not found.</p>
        <Link
          href="/admin/clients"
          className="text-sm text-espresso hover:underline mt-2 inline-block"
        >
          Back to clients
        </Link>
      </div>
    );
  }

  const clientJobs = jobs.filter((j) => j.clientId === client.id);
  const clientInvoices = invoices.filter((i) => i.clientId === client.id);

  const ef = (key: keyof typeof editForm, val: (typeof editForm)[typeof key]) =>
    setEditForm((prev) => (prev ? { ...prev, [key]: val } : prev));

  const updatePet = (idx: number, key: string, val: string) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      const pets = prev.pets.map((p, i) =>
        i === idx ? { ...p, [key]: val } : p,
      );
      return { ...prev, pets };
    });
  };

  const addPet = () => {
    setEditForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pets: [...prev.pets, { name: "", type: "cat" as const, breed: "" }],
      };
    });
  };

  const removePet = (idx: number) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      return { ...prev, pets: prev.pets.filter((_, i) => i !== idx) };
    });
  };

  const handleStartEdit = () => {
    setEditForm({
      name: client.name,
      email: client.email,
      phone: client.phone ?? "",
      address: client.address,
      pets: client.pets.map((p) => ({
        name: p.name ?? "",
        type: p.type,
        breed: p.breed ?? "",
      })),
    });
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const handleSaveEdit = () => {
    updateClient(client.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone || undefined,
      address: editForm.address,
      pets: editForm.pets.map((p) => ({
        name: p.name || undefined,
        type: p.type as "cat" | "dog",
        breed: p.breed || undefined,
      })),
    });
    setEditing(false);
  };

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
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/clients"
          className="flex items-center gap-1 text-sm text-stone hover:text-charcoal"
        >
          <ChevronLeft className="w-4 h-4" />
          Clients
        </Link>
        <span className="text-separator">/</span>
        <span className="text-sm text-charcoal font-medium truncate">
          {client.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          {/* Contact Card */}
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
                    {client.name}
                  </h1>
                )}
              </div>
              {!editing && (
                <button
                  onClick={handleStartEdit}
                  className="p-1.5 rounded-lg text-stone hover:text-charcoal hover:bg-parchment-dark transition-colors flex-shrink-0"
                  title="Edit client"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
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
                      href={`mailto:${client.email}`}
                      className="hover:text-espresso"
                    >
                      {client.email}
                    </a>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-stone">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-stone">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(client.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-espresso"
                    >
                      {client.address}
                    </a>
                  </div>
                </>
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

          {/* Jobs */}
          <div className="bg-white rounded-xl border border-border p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-charcoal flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-stone" />
                Jobs ({clientJobs.length})
              </h2>
              <Link
                href="/admin/jobs"
                className="text-xs text-espresso hover:underline"
              >
                All jobs
              </Link>
            </div>
            {clientJobs.length === 0 ? (
              <p className="text-sm text-stone">No jobs yet.</p>
            ) : (
              <div className="divide-y divide-row-divider">
                {clientJobs.map((job) => {
                  const sc =
                    JOB_STATUS_STYLES[job.status] || JOB_STATUS_STYLES.quoted;
                  return (
                    <Link
                      key={job.id}
                      href={`/admin/jobs/${job.id}`}
                      className="flex items-center justify-between py-3 hover:bg-surface-hover -mx-4 px-4 md:-mx-6 md:px-6 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-charcoal">
                          {job.title}
                        </p>
                        <span
                          className="inline-flex mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: sc.bg,
                            color: sc.color,
                          }}
                        >
                          {JOB_STATUS_LABELS[job.status]}
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-2 md:gap-3">
                        <span className="text-sm font-semibold text-charcoal">
                          {formatCurrency(computeTotal(job.lineItems))}
                        </span>
                        <ArrowRight className="w-4 h-4 text-sand-dim hidden md:block" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-xl border border-border p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-charcoal flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone" />
                Invoices ({clientInvoices.length})
              </h2>
            </div>
            {clientInvoices.length === 0 ? (
              <p className="text-sm text-stone">No invoices yet.</p>
            ) : (
              <div className="divide-y divide-row-divider">
                {clientInvoices.map((inv) => {
                  const sc =
                    INVOICE_STATUS_STYLES[inv.status] ||
                    INVOICE_STATUS_STYLES.draft;
                  return (
                    <Link
                      key={inv.id}
                      href={`/admin/invoices/${inv.id}`}
                      className="flex items-center justify-between py-3 hover:bg-surface-hover -mx-4 px-4 md:-mx-6 md:px-6 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-charcoal">
                          {inv.invoiceNumber}
                        </p>
                        <span
                          className="inline-flex mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: sc.bg,
                            color: sc.color,
                          }}
                        >
                          {INVOICE_STATUS_LABELS[inv.status]}
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-2 md:gap-3">
                        <span className="text-sm font-semibold text-charcoal">
                          {formatCurrency(computeTotal(inv.lineItems))}
                        </span>
                        <ArrowRight className="w-4 h-4 text-sand-dim hidden md:block" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-border p-4 md:p-6">
            <h2 className="font-semibold text-sm text-charcoal mb-4">Notes</h2>
            {client.notes.length === 0 && (
              <p className="text-sm text-stone mb-4">No notes yet.</p>
            )}
            <div className="space-y-3 mb-4">
              {client.notes.map((note, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-border">
                  <p className="text-sm text-charcoal">{note.text}</p>
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
          {/* Pets */}
          <div className="bg-white rounded-xl border border-border p-4 md:p-5">
            <h3 className="font-semibold text-sm text-charcoal mb-3 flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-stone" />
              Pets
            </h3>
            {editing ? (
              <div className="space-y-4">
                {editForm.pets.map((pet, i) => (
                  <div key={i} className="space-y-2">
                    {i > 0 && (
                      <div className="border-t border-parchment-dark pt-2" />
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone uppercase tracking-wider">
                        Pet {i + 1}
                      </span>
                      <button
                        onClick={() => removePet(i)}
                        className="text-sand-dim hover:text-danger transition-colors p-1"
                        title="Remove pet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs text-stone mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={pet.name ?? ""}
                        onChange={(e) => updatePet(i, "name", e.target.value)}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone mb-1">
                        Type
                      </label>
                      <div className="flex gap-3">
                        {(["cat", "dog"] as const).map((t) => (
                          <label
                            key={t}
                            className="flex items-center gap-1.5 cursor-pointer"
                          >
                            <input
                              type="radio"
                              checked={pet.type === t}
                              onChange={() => updatePet(i, "type", t)}
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
                      <label className="block text-xs text-stone mb-1">
                        Breed
                      </label>
                      <input
                        type="text"
                        value={pet.breed ?? ""}
                        onChange={(e) => updatePet(i, "breed", e.target.value)}
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addPet}
                  className="flex items-center gap-1.5 text-xs font-medium text-espresso hover:underline mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Pet
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {client.pets.map((pet, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-medium text-charcoal">
                      {pet.name || "(unnamed)"}
                    </p>
                    <p className="text-xs text-stone capitalize">
                      {pet.type}
                      {pet.breed ? ` · ${pet.breed}` : ""}
                    </p>
                  </div>
                ))}
                {client.pets.length === 0 && (
                  <p className="text-xs text-stone">No pets listed.</p>
                )}
              </div>
            )}
          </div>

          {/* Origin */}
          {client.leadId && (
            <div className="bg-white rounded-xl border border-border p-4 md:p-5">
              <h3 className="font-semibold text-sm text-charcoal mb-3">
                Origin
              </h3>
              <Link
                href={`/admin/leads/${client.leadId}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-espresso hover:underline"
              >
                View original lead <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Meta */}
          <div className="text-xs text-sand-dim space-y-1">
            <p>Client since {formatDate(client.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
