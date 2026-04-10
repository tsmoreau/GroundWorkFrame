"use client";

import { useState } from "react";
import Link from "next/link";
import { useData } from "../admin/data-context";
import { DataProvider } from "../admin/data-context";
import type { LeadSource } from "@/lib/types";

type ProjectType = "catio" | "dog_house" | "kennel" | "other";

interface FormState {
  projectType: ProjectType;
  message: string;
  address: string;
  petType: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
}

function ContactForm() {
  const { addLead } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [form, setForm] = useState<FormState>({
    projectType: "catio",
    message: "",
    address: "",
    petType: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
    source: "contact_form",
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const canSubmit =
    form.name.trim() && form.email.trim() && form.message.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;

    const messageParts = [
      `[${form.projectType.replace("_", " ")}]`,
      form.message,
      form.petType && `Pet: ${form.petType}`,
      form.timeline && `Timeline: ${form.timeline}`,
      photos.length > 0 && `[${photos.length} photo(s) attached]`,
    ]
      .filter(Boolean)
      .join("\n");

    addLead({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      address: form.address || undefined,
      source: form.source,
      message: messageParts,
      photos: photos.map((f) => f.name),
      petInfo: {
        type:
          form.projectType === "dog_house" || form.projectType === "kennel"
            ? "dog"
            : "cat",
        count: 1,
      },
      status: "new",
      notes: [],
    });
    setSubmitted(true);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    setPhotos((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    setPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  if (submitted) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-headline text-primary mb-4">Got it.</h2>
        <p className="text-on-surface-variant max-w-sm mx-auto leading-relaxed mb-10">
          I&apos;ll be in touch within a day or two.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded font-medium hover:opacity-90 transition-all"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ── Project type ── */}
      <div className="space-y-3">
        <label className="block text-xs label-style font-bold text-primary">
          What do you need?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(
            [
              { value: "catio", label: "Catio" },
              { value: "dog_house", label: "Dog House" },
              { value: "kennel", label: "Kennel" },
              { value: "other", label: "Other" },
            ] as { value: ProjectType; label: string }[]
          ).map((opt) => (
            <label key={opt.value} className="relative block cursor-pointer">
              <input
                type="radio"
                name="project_type"
                checked={form.projectType === opt.value}
                onChange={() => set("projectType", opt.value)}
                className="sr-only peer"
              />
              <div className="px-4 py-3 bg-surface-container-lowest border-2 border-transparent peer-checked:border-primary rounded text-center text-sm font-medium text-on-surface transition-all hover:bg-surface-bright">
                {opt.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ── Who are you ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="block text-xs label-style font-bold text-primary">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded p-4 text-on-surface outline-none text-sm"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-xs label-style font-bold text-primary">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded p-4 text-on-surface outline-none text-sm"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-xs label-style font-bold text-primary">
            Phone{" "}
            <span className="normal-case tracking-normal font-normal text-on-surface-variant/50">
              (optional)
            </span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded p-4 text-on-surface outline-none text-sm"
          />
        </div>
      </div>

      {/* ── Description ── */}
      <div className="space-y-3">
        <label className="block text-xs label-style font-bold text-primary">
          Tell me about the project
        </label>
        <textarea
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          rows={4}
          className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded p-4 text-on-surface placeholder:text-on-surface-variant/40 transition-all outline-none resize-none text-sm"
          placeholder="What are you looking for? Any specifics about your yard, your pets, or what you have in mind."
        />
      </div>

      {/* ── Pet & site ── */}
      <div className="space-y-3">
        <label className="block text-xs label-style font-bold text-primary">
          Your pet(s)
        </label>
        <input
          type="text"
          value={form.petType}
          onChange={(e) => set("petType", e.target.value)}
          className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded p-4 text-on-surface placeholder:text-on-surface-variant/40 outline-none text-sm"
          placeholder="e.g. 2 indoor cats, German Shepherd"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-xs label-style font-bold text-primary">
          Project address
        </label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded p-4 text-on-surface placeholder:text-on-surface-variant/40 outline-none text-sm"
          placeholder="Where would the build go?"
        />
      </div>

      {/* ── Photo upload ── */}
      <div className="space-y-3">
        <label className="block text-xs label-style font-bold text-primary">
          Photos of the space{" "}
          <span className="normal-case tracking-normal font-normal text-on-surface-variant/50">
            (optional)
          </span>
        </label>
        <p className="text-xs text-on-surface-variant/60 -mt-1">
          Wide shots of the yard or area where you&apos;d want the build. Helps
          a lot with the first conversation.
        </p>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => document.getElementById("photo-input")?.click()}
          className="border-2 border-dashed border-outline-variant/40 rounded-lg p-8 flex flex-col items-center justify-center bg-surface-container-lowest hover:bg-surface-bright transition-colors cursor-pointer group"
        >
          <svg
            className="w-8 h-8 text-outline/40 mb-3 group-hover:text-primary/60 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
          <p className="text-sm text-on-surface-variant/60 mb-1">
            Click or drag photos here
          </p>
          <p className="text-xs text-on-surface-variant/40">
            JPG or PNG, up to 10MB each
          </p>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {photos.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center gap-2 bg-surface-container-high rounded px-3 py-1.5 text-xs text-on-surface-variant"
              >
                <span className="truncate max-w-[140px]">{file.name}</span>
                <button
                  onClick={() => removePhoto(i)}
                  className="text-on-surface-variant/40 hover:text-error transition-colors shrink-0"
                  aria-label={`Remove ${file.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Timeline ── */}
      <div className="space-y-3">
        <label className="block text-xs label-style font-bold text-primary">
          Timeline
        </label>
        <select
          value={form.timeline}
          onChange={(e) => set("timeline", e.target.value)}
          className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded p-4 text-on-surface outline-none appearance-none text-sm"
        >
          <option value="">No rush</option>
          <option value="asap">As soon as possible</option>
          <option value="1-2 months">Within a month or two</option>
          <option value="3-6 months">Next few months</option>
          <option value="exploring">Just exploring the idea</option>
        </select>
      </div>

      {/* ── Source ── */}
      <div className="space-y-3">
        <label className="block text-xs label-style font-bold text-primary">
          How did you find us?
        </label>
        <select
          value={form.source}
          onChange={(e) => set("source", e.target.value as LeadSource)}
          className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded p-4 text-on-surface outline-none appearance-none text-sm"
        >
          <option value="contact_form">Web Search</option>
          <option value="vet_card">Flyer / Card</option>
          <option value="referral">Referral</option>
          <option value="nextdoor">Nextdoor</option>
          <option value="craigslist">Craigslist</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* ── Submit ── */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-primary text-on-primary px-10 py-4 rounded font-medium hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Send Inquiry
        </button>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <DataProvider>
      <div className="bg-surface text-on-surface min-h-screen flex flex-col">
        {/* ── Nav ── */}
        <header className="w-full max-w-3xl mx-auto px-8 pt-8 pb-4">
          <nav className="flex justify-between items-center">
            <Link
              href="/"
              className="text-3xl pl-4 font-semibold font-headline text-primary"
            >
              Denhaus
            </Link>
            <Link
              href="/contact"
              className="hidden bg-primary text-on-primary px-5 py-2 rounded text-sm font-medium hover:opacity-90 transition-all active:scale-95"
            >
              Get in Touch
            </Link>
          </nav>
        </header>

        {/* ── Form ── */}
        <main className="flex-1 pt-8 pb-16 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-headline text-primary mb-4 leading-tight">
                Let&apos;s talk about your project.
              </h1>
              <p className="text-on-surface-variant leading-relaxed">
                Serving Chatsworth through Thousand Oaks. Tell me what
                you&apos;re looking for and I&apos;ll get back to you.
              </p>
            </div>

            <ContactForm />
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="px-8 py-8">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-on-surface-variant/60">
            <p>© {new Date().getFullYear()} Denhaus</p>
            <p>San Fernando Valley&ensp;·&ensp;Ventura County</p>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}
