"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { PawPrint, CheckCircle, CreditCard, Building2, Mail } from "lucide-react";
import { DataProvider, useData } from "../../admin/data-context";
import {
  computeTotal,
  formatCurrency,
  formatDate,
  PAYMENT_METHOD_LABELS,
} from "@/lib/utils";
import type { BusinessSettings } from "@/lib/types";

function InvoiceContent({ token }: { token: string }) {
  const { invoices, settings, updateInvoice } = useData();
  const [paying, setPaying] = useState(false);
  const [payStep, setPayStep] = useState<"method" | "confirm" | "done">("method");
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const invoice = invoices.find((i) => i.token === token);

  useEffect(() => {
    if (invoice && invoice.status === "sent") {
      updateInvoice(invoice.id, {
        status: "viewed",
        viewedAt: new Date().toISOString(),
      });
    }
  }, [invoice?.id]);

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-charcoal mb-3">Invoice not found</h1>
        <p className="text-stone">This link may be expired or incorrect.</p>
      </div>
    );
  }

  const total = computeTotal(invoice.lineItems);

  const handleSimulatePay = () => {
    updateInvoice(invoice.id, {
      status: "paid",
      paymentMethod: selectedMethod as typeof invoice.paymentMethod,
      paidAt: new Date().toISOString(),
    });
    setPayStep("done");
  };

  const enabledMethods = [
    settings.stripeEnabled && { key: "stripe_ach", label: "ACH Transfer", sub: "Capped at $5 fee · Stripe", icon: Building2 },
    settings.stripeEnabled && { key: "stripe_card", label: "Credit / Debit Card", sub: "2.9% + 30¢ · Stripe", icon: CreditCard },
    settings.zelleEnabled && {
      key: "zelle",
      label: "Zelle",
      sub: settings.zelleRecipient ? `Send to: ${settings.zelleRecipient}` : "No fee",
      icon: Mail,
    },
    settings.checkEnabled && {
      key: "check",
      label: "Check by Mail",
      sub: `Payable to: ${settings.checkPayableTo || "Denhaus LLC"}`,
      icon: Mail,
    },
  ].filter(Boolean) as { key: string; label: string; sub: string; icon: typeof CreditCard }[];

  return (
    <div className="min-h-screen bg-parchment">
      {/* Header */}
      <div className="py-5 px-8 border-b bg-surface-cream border-border-warm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-gold">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-charcoal">Denhaus</span>
          </Link>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full capitalize"
            style={{
              backgroundColor: invoice.status === "paid"
                ? "var(--color-status-green-light-bg)"
                : "var(--color-status-amber-bg)",
              color: invoice.status === "paid"
                ? "var(--color-paid)"
                : "var(--color-status-amber)",
            }}
          >
            {invoice.status}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-10">
        {/* Invoice */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6">
          <div className="p-8 border-b border-parchment-dark">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-mono text-xs text-sand-dim font-semibold">{invoice.invoiceNumber}</p>
                <h1 className="text-2xl font-bold text-charcoal mt-1">{invoice.clientName}</h1>
                <p className="text-sm text-stone mt-1 capitalize">{invoice.type} invoice</p>
              </div>
              <div className="text-right">
                {settings.businessName && (
                  <p className="font-semibold text-charcoal">{settings.businessName}</p>
                )}
                {settings.businessEmail && (
                  <p className="text-xs text-stone mt-1">{settings.businessEmail}</p>
                )}
                {settings.businessPhone && (
                  <p className="text-xs text-stone">{settings.businessPhone}</p>
                )}
              </div>
            </div>

            {invoice.sentAt && (
              <p className="text-xs text-sand-dim mt-4">Issued {formatDate(invoice.sentAt)}</p>
            )}
          </div>

          {/* Line Items */}
          <div className="p-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-parchment-dark">
                  <th className="text-left text-xs font-semibold text-stone pb-3 uppercase tracking-wide">Description</th>
                  <th className="text-right text-xs font-semibold text-stone pb-3 uppercase tracking-wide">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((li) => (
                  <tr key={li.id} className="border-b border-row-divider">
                    <td className="py-4 pr-4">
                      <p className="text-sm text-charcoal">{li.description}</p>
                    </td>
                    <td className="py-4 text-right text-sm font-semibold text-charcoal">
                      {formatCurrency(li.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-4 text-base font-bold text-charcoal">Total Due</td>
                  <td className="pt-4 text-right">
                    <span className="text-2xl font-bold text-charcoal">
                      {formatCurrency(total)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment Section */}
        {invoice.status === "paid" ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-paid" />
            <h2 className="text-xl font-bold text-charcoal mb-2">Payment received</h2>
            {invoice.paidAt && (
              <p className="text-sm text-stone">Paid {formatDate(invoice.paidAt)}</p>
            )}
            {invoice.paymentMethod && (
              <p className="text-xs text-sand-dim mt-1">
                via {PAYMENT_METHOD_LABELS[invoice.paymentMethod]}
              </p>
            )}
          </div>
        ) : payStep === "done" ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-paid" />
            <h2 className="text-xl font-bold text-charcoal mb-2">Payment submitted</h2>
            <p className="text-sm text-stone">We'll confirm receipt and be in touch shortly.</p>
          </div>
        ) : payStep === "confirm" ? (
          <div className="bg-white rounded-2xl border border-border p-8">
            <h2 className="text-lg font-bold text-charcoal mb-2">
              {PAYMENT_METHOD_LABELS[selectedMethod]}
            </h2>
            {selectedMethod === "stripe_ach" && (
              <div className="space-y-3 text-sm text-stone mb-6">
                <p>Enter your bank account information to initiate an ACH transfer.</p>
                <div className="p-4 rounded-xl bg-parchment border border-border">
                  <p className="text-xs text-sand-dim mb-2">Demo mode — no real payment</p>
                  <input disabled placeholder="Routing number" className="w-full border border-border rounded-lg px-3 py-2 text-sm mb-2 bg-white" />
                  <input disabled placeholder="Account number" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white" />
                </div>
              </div>
            )}
            {selectedMethod === "stripe_card" && (
              <div className="space-y-3 text-sm text-stone mb-6">
                <div className="p-4 rounded-xl bg-parchment border border-border">
                  <p className="text-xs text-sand-dim mb-2">Demo mode — no real payment</p>
                  <input disabled placeholder="Card number" className="w-full border border-border rounded-lg px-3 py-2 text-sm mb-2 bg-white" />
                  <div className="grid grid-cols-2 gap-2">
                    <input disabled placeholder="MM/YY" className="border border-border rounded-lg px-3 py-2 text-sm bg-white" />
                    <input disabled placeholder="CVC" className="border border-border rounded-lg px-3 py-2 text-sm bg-white" />
                  </div>
                </div>
              </div>
            )}
            {selectedMethod === "zelle" && (
              <div className="p-4 rounded-xl bg-parchment border border-border mb-6">
                <p className="text-sm font-semibold text-charcoal mb-1">Send Zelle to:</p>
                <p className="text-lg font-bold text-espresso">{settings.zelleRecipient}</p>
                <p className="text-sm font-semibold mt-2 text-charcoal">Amount: {formatCurrency(total)}</p>
                <p className="text-xs text-sand-dim mt-1">Include your name in the memo.</p>
              </div>
            )}
            {selectedMethod === "check" && (
              <div className="p-4 rounded-xl bg-parchment border border-border mb-6">
                <p className="text-sm font-semibold text-charcoal mb-1">Make check payable to:</p>
                <p className="text-lg font-bold text-espresso">{settings.checkPayableTo}</p>
                {settings.checkMailingAddress && (
                  <>
                    <p className="text-sm font-semibold mt-2 text-charcoal">Mail to:</p>
                    <p className="text-sm text-stone">{settings.checkMailingAddress}</p>
                  </>
                )}
                <p className="text-sm font-semibold mt-2 text-charcoal">Amount: {formatCurrency(total)}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleSimulatePay}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-charcoal bg-gold"
              >
                {selectedMethod === "zelle" || selectedMethod === "check"
                  ? "I've sent payment"
                  : `Pay ${formatCurrency(total)}`}
              </button>
              <button
                onClick={() => setPayStep("method")}
                className="px-5 py-3 rounded-xl text-sm border border-border text-stone"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-8">
            <h2 className="text-lg font-bold text-charcoal mb-1">
              {formatCurrency(total)} due
            </h2>
            <p className="text-sm text-stone mb-6">Choose a payment method</p>
            <div className="space-y-3 mb-6">
              {enabledMethods.map(({ key, label, sub, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedMethod(key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    selectedMethod === key
                      ? "border-espresso bg-warm-sand"
                      : "border-border hover:border-gold"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: selectedMethod === key
                        ? "var(--color-gold)"
                        : "var(--color-status-neutral-bg)",
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: selectedMethod === key ? "white" : "var(--color-stone)",
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-charcoal">{label}</p>
                    <p className="text-xs text-sand-dim">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              disabled={!selectedMethod}
              onClick={() => setPayStep("confirm")}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-charcoal bg-gold disabled:opacity-40"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-sand-dim mt-8">
          Questions? Email {settings.businessEmail}
        </p>
      </div>
    </div>
  );
}

export default function InvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  return (
    <DataProvider>
      <InvoiceContent token={token} />
    </DataProvider>
  );
}
