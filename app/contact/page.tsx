"use client";

import { useState } from "react";
import Link from "next/link";
import { useData } from "../admin/data-context";
import { DataProvider } from "../admin/data-context";
import type { LeadSource } from "@/lib/types";

const STEPS = ["Your Vision", "Your Space", "Your Details", "Review"];

type ProjectType = "dog_house" | "catio" | "other";

interface FormState {
  projectType: ProjectType;
  vision: string;
  address: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
}

function ContactForm() {
  const { addLead } = useData();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    projectType: "dog_house",
    vision: "",
    address: "",
    name: "",
    email: "",
    phone: "",
    source: "contact_form",
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    addLead({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      address: form.address || undefined,
      source: form.source,
      message: `[${form.projectType.replace("_", " ")}] ${form.vision}`,
      photos: [],
      petInfo: { type: "cat", count: 1 },
      status: "new",
      notes: [],
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
        </div>
        <h2 className="text-3xl font-headline text-primary mb-4">Inquiry received.</h2>
        <p className="text-on-surface-variant max-w-sm mx-auto leading-relaxed mb-10">
          Our team reviews your space and vision. Expect to hear from us within one business day.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg font-medium hover:opacity-90 transition-all"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 gap-2 overflow-x-auto pb-4">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    active || done
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-highest text-on-surface-variant"
                  }`}
                >
                  {done ? <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span> : n}
                </span>
                <span
                  className={`text-sm whitespace-nowrap transition-colors ${
                    active ? "text-primary font-medium border-b-2 border-secondary pb-1" : "text-on-surface-variant"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-px flex-grow bg-outline-variant min-w-[20px] ml-3" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="bg-surface-container-low p-8 md:p-12 rounded-xl shadow-[0_20px_50px_rgba(25,28,27,0.06)]">
        {step === 1 && (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-headline text-primary mb-6">What are we building together?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {([
                  { value: "dog_house", icon: "house", label: "Dog House", desc: "Custom exterior insulation & craftsmanship." },
                  { value: "catio", icon: "pets", label: "Catio", desc: "Integrated multi-level climbing environments." },
                  { value: "other", icon: "architecture", label: "Other Build", desc: "Aviaries, terrariums, or bespoke structures." },
                ] as { value: ProjectType; icon: string; label: string; desc: string }[]).map((opt) => (
                  <label key={opt.value} className="relative block group cursor-pointer">
                    <input
                      type="radio"
                      name="project_type"
                      checked={form.projectType === opt.value}
                      onChange={() => set("projectType", opt.value)}
                      className="sr-only peer"
                    />
                    <div className="p-6 bg-surface-container-lowest border-2 border-transparent peer-checked:border-primary rounded-lg transition-all group-hover:bg-surface-bright">
                      <span className="material-symbols-outlined text-secondary mb-3 block">{opt.icon}</span>
                      <h3 className="font-bold text-primary mb-1">{opt.label}</h3>
                      <p className="text-xs text-on-surface-variant leading-tight">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm label-style font-bold text-primary">The Vision</label>
              <textarea
                value={form.vision}
                onChange={(e) => set("vision", e.target.value)}
                rows={5}
                className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/50 transition-all outline-none resize-none"
                placeholder="Tell us about your pet's personality and any specific features you're dreaming of..."
              />
            </div>
            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!form.vision.trim()}
                className="bg-primary text-on-primary px-10 py-4 rounded font-medium flex items-center gap-2 hover:opacity-95 transition-all group active:scale-95 disabled:opacity-50"
              >
                Continue to Space
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10">
            <div className="bg-surface-container rounded-lg p-6 flex items-start gap-4">
              <span className="material-symbols-outlined text-secondary shrink-0">info</span>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Photos help our architects understand the context of your terrain and existing structures. Natural lighting and wide angles are preferred.
              </p>
            </div>
            <div className="space-y-4">
              <label className="block text-sm label-style font-bold text-primary">Project Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded-lg p-4 text-on-surface outline-none"
                placeholder="123 Naturalist Way, Los Angeles, CA"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm label-style font-bold text-primary">Upload Space Photos</label>
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center bg-surface-container-lowest hover:bg-surface-bright transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-4xl text-outline mb-4 group-hover:text-primary transition-colors">cloud_upload</span>
                <p className="text-on-surface font-medium mb-1">Click or drag photos here</p>
                <p className="text-xs text-on-surface-variant">JPG, PNG up to 20MB each</p>
              </div>
            </div>
            <div className="pt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-primary font-medium flex items-center gap-2 hover:opacity-70 transition-all"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-primary text-on-primary px-10 py-4 rounded font-medium flex items-center gap-2 hover:opacity-95 transition-all group active:scale-95"
              >
                Continue to Details
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10">
            <h2 className="text-2xl font-headline text-primary">Tell us about yourself.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm label-style font-bold text-primary">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded-lg p-4 text-on-surface outline-none"
                  placeholder="Julian Vane"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm label-style font-bold text-primary">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded-lg p-4 text-on-surface outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm label-style font-bold text-primary">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded-lg p-4 text-on-surface outline-none"
                  placeholder="(213) 555-0000"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm label-style font-bold text-primary">How did you find us?</label>
                <select
                  value={form.source}
                  onChange={(e) => set("source", e.target.value as LeadSource)}
                  className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary rounded-lg p-4 text-on-surface outline-none appearance-none"
                >
                  <option value="contact_form">Web Search</option>
                  <option value="referral">Referral</option>
                  <option value="nextdoor">Social Media</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="pt-6 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-primary font-medium flex items-center gap-2 hover:opacity-70 transition-all"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!form.name.trim() || !form.email.trim()}
                className="bg-primary text-on-primary px-10 py-4 rounded font-medium flex items-center gap-2 hover:opacity-95 transition-all group active:scale-95 disabled:opacity-50"
              >
                Review Inquiry
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10">
            <h2 className="text-2xl font-headline text-primary">Review your inquiry.</h2>
            <div className="space-y-4">
              {[
                { label: "Project Type", value: form.projectType.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) },
                { label: "Vision", value: form.vision },
                { label: "Address", value: form.address || "—" },
                { label: "Name", value: form.name },
                { label: "Email", value: form.email },
                { label: "Phone", value: form.phone || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-6 py-4 border-b border-outline-variant/30">
                  <span className="label-style text-xs font-bold text-on-surface-variant w-32 shrink-0 pt-0.5">{label}</span>
                  <span className="text-on-surface text-sm leading-relaxed">{value}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 flex justify-between items-center">
              <button
                onClick={() => setStep(3)}
                className="text-primary font-medium flex items-center gap-2 hover:opacity-70 transition-all"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Edit Details
              </button>
              <button
                onClick={handleSubmit}
                className="bg-secondary text-on-secondary px-10 py-4 rounded font-bold flex items-center gap-2 hover:opacity-95 transition-all group active:scale-95 text-lg"
              >
                Submit Inquiry
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">send</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function ContactPage() {
  return (
    <DataProvider>
      <div className="bg-surface text-on-background min-h-screen flex flex-col">
        {/* Top Navigation */}
        <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-xl z-50 backdrop-blur-[20px] bg-stone-50/80 shadow-[0_20px_50px_rgba(25,28,27,0.06)]">
          <nav className="flex justify-between items-center px-8 py-4 w-full">
            <Link href="/" className="text-2xl font-bold font-headline text-primary">Groundwork</Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#process" className="text-primary/70 hover:text-primary transition-colors label-style text-xs font-semibold">Process</Link>
              <Link href="/#portfolio" className="text-primary/70 hover:text-primary transition-colors label-style text-xs font-semibold">Portfolio</Link>
              <a href="#" className="text-primary/70 hover:text-primary transition-colors label-style text-xs font-semibold">Materials</a>
              <a href="#" className="text-primary/70 hover:text-primary transition-colors label-style text-xs font-semibold">FAQ</a>
            </div>
            <Link
              href="/contact"
              className="bg-primary text-on-primary px-6 py-2.5 rounded hover:opacity-90 transition-all active:scale-95 text-sm font-medium"
            >
              Get Started
            </Link>
          </nav>
        </header>

        <main className="flex-grow pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Form Header */}
            <div className="mb-12">
              <span className="text-secondary label-style text-xs font-bold mb-3 block">Project Inquiry</span>
              <h1 className="text-4xl md:text-5xl font-headline text-primary mb-4 leading-tight">
                Bring your vision to life.
              </h1>
              <p className="text-on-surface-variant max-w-xl leading-relaxed">
                Let's begin the architectural journey for your companion's sanctuary. Please share the details of your project below.
              </p>
            </div>

            <ContactForm />

            {/* Asymmetric supporting content */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 rounded-xl overflow-hidden relative h-96 group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1612539465806-7b658e2a1c0f?w=800&q=80"
                  alt="Modern architectural studio desk with sketches and wood samples in soft morning light"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="label-style text-[10px] bg-secondary px-3 py-1 mb-2 inline-block">The Groundwork Standard</span>
                  <h4 className="text-2xl font-headline italic">Precision meets soul.</h4>
                </div>
              </div>
              <div className="md:col-span-5 space-y-6 md:pl-8">
                <h3 className="text-3xl font-headline text-primary">What happens next?</h3>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary shrink-0">counter_1</span>
                    <div>
                      <p className="font-bold text-primary mb-1">Curation Phase</p>
                      <p className="text-sm text-on-surface-variant">Our team reviews your space and vision to see if we're a match for your timeline.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary shrink-0">counter_2</span>
                    <div>
                      <p className="font-bold text-primary mb-1">Blueprint Call</p>
                      <p className="text-sm text-on-surface-variant">A 15-minute alignment call to discuss materials, terrain, and pricing tiers.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-stone-100 mt-32">
          <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="font-headline text-xl text-primary mb-6">Groundwork</div>
              <p className="text-stone-600 text-sm leading-relaxed">
                Crafting bespoke ecological structures for the modern architectural naturalist and their companions.
              </p>
            </div>
            <div>
              <h4 className="font-headline text-lg text-primary mb-4">Philosophy</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-stone-600 hover:text-primary text-sm transition-colors">Environmental Impact</a></li>
                <li><a href="#" className="text-stone-600 hover:text-primary text-sm transition-colors">Material Sourcing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline text-lg text-primary mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-stone-600 hover:text-primary text-sm transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-stone-600 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline text-lg text-primary mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                </a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-8 py-8 border-t border-stone-200">
            <p className="text-stone-600 text-sm">© 2025 Groundwork Studio. All rights reserved. Crafted for the Architectural Naturalist.</p>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}
