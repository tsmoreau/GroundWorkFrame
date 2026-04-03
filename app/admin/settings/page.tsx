"use client";

import { useState, useEffect } from "react";
import { useData } from "../data-context";
import type { BusinessSettings } from "@/lib/types";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1C1208] mb-1">{label}</label>
      {hint && <p className="text-xs text-[#A09070] mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20 bg-white"
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-[#C8A548]" : "bg-[#D0C0A8]"}`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
        />
      </div>
      <span className="text-sm text-[#1C1208]">{label}</span>
    </label>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings } = useData();
  const [form, setForm] = useState<BusinessSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const set = <K extends keyof BusinessSettings>(key: K, value: BusinessSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1C1208]">Settings</h1>
        <p className="text-sm text-[#6B5B4A] mt-1">Business configuration and payment methods</p>
      </div>

      <div className="space-y-6">
        {/* Business Info */}
        <div className="bg-white rounded-xl border border-[#DDD0B8] p-6">
          <h2 className="font-semibold text-[#1C1208] mb-5">Business Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Business Name">
                <TextInput value={form.businessName} onChange={(v) => set("businessName", v)} />
              </Field>
            </div>
            <Field label="Email">
              <TextInput value={form.businessEmail} onChange={(v) => set("businessEmail", v)} />
            </Field>
            <Field label="Phone">
              <TextInput value={form.businessPhone ?? ""} onChange={(v) => set("businessPhone", v)} />
            </Field>
            <div className="col-span-2">
              <Field label="Address">
                <TextInput value={form.businessAddress ?? ""} onChange={(v) => set("businessAddress", v)} />
              </Field>
            </div>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="bg-white rounded-xl border border-[#DDD0B8] p-6">
          <h2 className="font-semibold text-[#1C1208] mb-5">Invoice Settings</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Invoice Prefix" hint="e.g. DNH for DNH-2025-001">
              <TextInput value={form.invoicePrefix} onChange={(v) => set("invoicePrefix", v)} />
            </Field>
            <Field label="Deposit %" hint="Default deposit percentage">
              <input
                type="number"
                min="0"
                max="100"
                value={form.depositPercent}
                onChange={(e) => set("depositPercent", Number(e.target.value))}
                className="w-full text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20 bg-white"
              />
            </Field>
            <Field label="Tax Rate %" hint="0 for no tax">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.taxRate}
                onChange={(e) => set("taxRate", Number(e.target.value))}
                className="w-full text-sm border border-[#DDD0B8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E1A0E]/20 bg-white"
              />
            </Field>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl border border-[#DDD0B8] p-6">
          <h2 className="font-semibold text-[#1C1208] mb-5">Payment Methods</h2>
          <div className="space-y-6">
            {/* Stripe */}
            <div>
              <Toggle checked={form.stripeEnabled} onChange={(v) => set("stripeEnabled", v)} label="Stripe (ACH + Card)" />
              {form.stripeEnabled && (
                <p className="text-xs text-[#6B5B4A] mt-2 pl-11">
                  ACH capped at $5 · Card 2.9% + 30¢ · Stripe handles checkout and PCI compliance
                </p>
              )}
            </div>

            {/* Zelle */}
            <div>
              <Toggle checked={form.zelleEnabled} onChange={(v) => set("zelleEnabled", v)} label="Zelle" />
              {form.zelleEnabled && (
                <div className="mt-3 pl-11">
                  <Field label="Zelle recipient email/phone">
                    <TextInput value={form.zelleRecipient ?? ""} onChange={(v) => set("zelleRecipient", v)} placeholder="you@email.com" />
                  </Field>
                </div>
              )}
            </div>

            {/* Check */}
            <div>
              <Toggle checked={form.checkEnabled} onChange={(v) => set("checkEnabled", v)} label="Check" />
              {form.checkEnabled && (
                <div className="mt-3 pl-11 grid grid-cols-2 gap-3">
                  <Field label="Payable to">
                    <TextInput value={form.checkPayableTo ?? ""} onChange={(v) => set("checkPayableTo", v)} placeholder="Your LLC Name" />
                  </Field>
                  <Field label="Mailing address">
                    <TextInput value={form.checkMailingAddress ?? ""} onChange={(v) => set("checkMailingAddress", v)} />
                  </Field>
                </div>
              )}
            </div>

            {/* Bank Transfer */}
            <div>
              <Toggle checked={form.bankTransferEnabled} onChange={(v) => set("bankTransferEnabled", v)} label="Bank Transfer (ACH/Wire)" />
              {form.bankTransferEnabled && (
                <div className="mt-3 pl-11 grid grid-cols-3 gap-3">
                  <Field label="Bank name">
                    <TextInput value={form.bankName ?? ""} onChange={(v) => set("bankName", v)} />
                  </Field>
                  <Field label="Routing number">
                    <TextInput value={form.bankRoutingNumber ?? ""} onChange={(v) => set("bankRoutingNumber", v)} />
                  </Field>
                  <Field label="Account last 4">
                    <TextInput value={form.bankAccountLast4 ?? ""} onChange={(v) => set("bankAccountLast4", v)} placeholder="1234" />
                  </Field>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-[#1C1208]"
            style={{ backgroundColor: "#C8A548" }}
          >
            Save Settings
          </button>
          {saved && (
            <span className="text-sm text-[#5A7840] font-medium">Saved</span>
          )}
        </div>
      </div>
    </div>
  );
}
