"use client";

import { useState } from "react";
import Link from "next/link";
import { PawPrint, Check } from "lucide-react";
import { useData } from "../admin/data-context";
import { DataProvider } from "../admin/data-context";
import type { LeadSource } from "@/lib/types";

function ContactForm() {
  const { addLead } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    petType: "cat" as "cat" | "dog" | "both",
    petBreed: "",
    petCount: "1",
    source: "contact_form" as LeadSource,
    message: "",
  });

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      address: form.address || undefined,
      source: form.source,
      message: form.message,
      photos: [],
      petInfo: {
        type: form.petType,
        breed: form.petBreed || undefined,
        count: Number(form.petCount),
      },
      status: "new",
      notes: [],
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "#e8f5ee" }}>
          <Check className="w-7 h-7" style={{ color: "#2d6a4f" }} />
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a18] mb-3">Got it — thanks!</h2>
        <p className="text-[#5c5c54] max-w-sm mx-auto">
          We typically respond within one business day. If you have photos of your space,
          reply to our email and attach them.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl text-sm font-medium text-white"
          style={{ backgroundColor: "#1c3829" }}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1a1a18] mb-1.5">Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full border border-[#e0dbd0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20 bg-white"
            placeholder="Full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a18] mb-1.5">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full border border-[#e0dbd0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20 bg-white"
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1a1a18] mb-1.5">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="w-full border border-[#e0dbd0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20 bg-white"
            placeholder="(213) 555-0000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a18] mb-1.5">Address</label>
          <input
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            className="w-full border border-[#e0dbd0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20 bg-white"
            placeholder="Street, City, ZIP"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1a1a18] mb-1.5">Pet type *</label>
          <select
            required
            value={form.petType}
            onChange={(e) => set("petType", e.target.value)}
            className="w-full border border-[#e0dbd0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20 bg-white"
          >
            <option value="cat">Cat(s)</option>
            <option value="dog">Dog(s)</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a18] mb-1.5">Breed</label>
          <input
            value={form.petBreed}
            onChange={(e) => set("petBreed", e.target.value)}
            className="w-full border border-[#e0dbd0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20 bg-white"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a18] mb-1.5">How many?</label>
          <input
            type="number"
            min="1"
            max="20"
            value={form.petCount}
            onChange={(e) => set("petCount", e.target.value)}
            className="w-full border border-[#e0dbd0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20 bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1a1a18] mb-1.5">How did you hear about us?</label>
        <select
          value={form.source}
          onChange={(e) => set("source", e.target.value)}
          className="w-full border border-[#e0dbd0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20 bg-white"
        >
          <option value="contact_form">Web search</option>
          <option value="nextdoor">Nextdoor</option>
          <option value="referral">Friend / neighbor referral</option>
          <option value="craigslist">Craigslist</option>
          <option value="vet_card">Vet office card</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1a1a18] mb-1.5">Tell us about your space and what you're envisioning *</label>
        <textarea
          required
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          rows={5}
          className="w-full border border-[#e0dbd0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3829]/20 bg-white resize-none"
          placeholder="Describe your yard, what you're thinking, any ideas or references you've seen..."
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#1c3829" }}
      >
        Send Message
      </button>
      <p className="text-xs text-center text-[#a09890]">
        No commitment. We'll get back to you within one business day.
      </p>
    </form>
  );
}

export default function ContactPage() {
  return (
    <DataProvider>
      <div style={{ backgroundColor: "#f8f6f2", minHeight: "100vh" }}>
        {/* Nav */}
        <nav className="px-8 py-5 flex items-center justify-between max-w-6xl mx-auto border-b border-[#e8e4dc]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#c8a55a" }}>
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[#1a1a18] tracking-tight">Denhaus</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/gallery" className="text-sm text-[#5c5c54] hover:text-[#1a1a18]">Gallery</Link>
            <Link href="/contact" className="text-sm font-medium text-[#1a1a18]">Get a Quote</Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-8 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#a09890] mb-2">Free consultation</p>
            <h1 className="text-4xl font-bold text-[#1a1a18] mb-4">Let's talk about your space</h1>
            <p className="text-[#5c5c54] leading-relaxed">
              We do free site visits in the greater LA area. Fill this out and we'll be in touch to schedule a visit or share some ideas.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e0dbd0] p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </div>
    </DataProvider>
  );
}
