"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useData } from "../../data-context";
import {
  computeTotal,
  formatCurrency,
  formatDate,
  formatDateTime,
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/utils";
import { INVOICE_STATUS_STYLES } from "@/lib/status-colors";
import {
  ChevronLeft,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { invoices, jobs, updateInvoice } = useData();
  const [showMarkPaid, setShowMarkPaid] = useState(false);
  const [payMethod, setPayMethod] = useState<string>("zelle");
  const [payRef, setPayRef] = useState("");

  const invoice = invoices.find((i) => i.id === id);
  if (!invoice) {
    return (
      <div className="p-8">
        <p className="text-stone">Invoice not found.</p>
        <Link href="/admin/invoices" className="text-sm text-espresso hover:underline mt-2 inline-block">Back</Link>
      </div>
    );
  }

  const job = jobs.find((j) => j.id === invoice.jobId);
  const total = computeTotal(invoice.lineItems);
  const sc = INVOICE_STATUS_STYLES[invoice.status] || INVOICE_STATUS_STYLES.draft;

  const handleMarkPaid = () => {
    updateInvoice(invoice.id, {
      status: "paid",
      paymentMethod: payMethod as typeof invoice.paymentMethod,
      paymentReference: payRef || undefined,
      paidAt: new Date().toISOString(),
    });
    setShowMarkPaid(false);
  };

  const handleMarkSent = () => {
    updateInvoice(invoice.id, {
      status: "sent",
      sentAt: new Date().toISOString(),
    });
  };

  const handleVoid = () => {
    if (confirm("Void this invoice?")) {
      updateInvoice(invoice.id, { status: "void" });
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/invoices" className="flex items-center gap-1 text-sm text-stone hover:text-charcoal">
          <ChevronLeft className="w-4 h-4" />
          Invoices
        </Link>
        <span className="text-separator">/</span>
        <span className="text-sm font-mono font-semibold text-charcoal">{invoice.invoiceNumber}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          {/* Invoice Card */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-mono text-xs text-stone font-semibold">{invoice.invoiceNumber}</p>
                <h1 className="text-xl font-bold text-charcoal mt-1">{invoice.clientName}</h1>
                <p className="text-xs text-stone mt-1 capitalize">{invoice.type} invoice</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: sc.bg, color: sc.color }}
                >
                  {INVOICE_STATUS_LABELS[invoice.status]}
                </span>
                <Link
                  href={`/invoice/${invoice.token}`}
                  className="text-stone hover:text-espresso p-1.5 rounded-lg hover:bg-warm-sand"
                  title="Client view"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b border-parchment-dark">
                  <th className="text-left text-xs font-semibold text-stone pb-2">Description</th>
                  <th className="text-right text-xs font-semibold text-stone pb-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-row-divider">
                {invoice.lineItems.map((li) => (
                  <tr key={li.id}>
                    <td className="py-3 pr-4">
                      <p className="text-sm text-charcoal">{li.description}</p>
                      {li.category && (
                        <p className="text-xs text-sand-dim capitalize">{li.category}</p>
                      )}
                    </td>
                    <td className="py-3 text-right text-sm font-semibold text-charcoal">
                      {formatCurrency(li.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td className="pt-3 text-sm font-bold text-charcoal">Total</td>
                  <td className="pt-3 text-right text-lg font-bold text-charcoal">
                    {formatCurrency(total)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Payment Info */}
            {invoice.status === "paid" && (
              <div className="mt-4 pt-4 border-t border-parchment-dark flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-paid" />
                <div className="text-sm">
                  <span className="font-semibold text-paid">Paid</span>
                  {invoice.paidAt && (
                    <span className="text-stone"> {formatDate(invoice.paidAt)}</span>
                  )}
                  {invoice.paymentMethod && (
                    <span className="text-stone"> via {PAYMENT_METHOD_LABELS[invoice.paymentMethod]}</span>
                  )}
                  {invoice.paymentReference && (
                    <span className="text-sand-dim"> · {invoice.paymentReference}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {invoice.status !== "paid" && invoice.status !== "void" && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold text-sm text-charcoal mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                {invoice.status === "draft" && (
                  <button
                    onClick={handleMarkSent}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-charcoal bg-gold"
                  >
                    Mark as Sent
                  </button>
                )}
                <button
                  onClick={() => setShowMarkPaid(true)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-charcoal bg-paid"
                >
                  Mark as Paid
                </button>
                <button
                  onClick={handleVoid}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-danger hover:bg-status-red-bg"
                >
                  Void Invoice
                </button>
              </div>
            </div>
          )}

          {showMarkPaid && (
            <div className="bg-white rounded-xl border border-paid p-6">
              <h2 className="font-semibold text-sm text-charcoal mb-4">Record Payment</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-stone block mb-1">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none"
                  >
                    {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone block mb-1">
                    Reference (check #, Zelle confirmation, etc.)
                  </label>
                  <input
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    placeholder="Optional"
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleMarkPaid}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-charcoal bg-paid"
                  >
                    Confirm Payment
                  </button>
                  <button
                    onClick={() => setShowMarkPaid(false)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-border text-stone"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-sm text-charcoal mb-3">Timeline</h3>
            <div className="space-y-2 text-xs text-stone">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{formatDate(invoice.createdAt)}</span>
              </div>
              {invoice.sentAt && (
                <div className="flex justify-between">
                  <span>Sent</span>
                  <span>{formatDate(invoice.sentAt)}</span>
                </div>
              )}
              {invoice.viewedAt && (
                <div className="flex justify-between">
                  <span>Viewed</span>
                  <span>{formatDate(invoice.viewedAt)}</span>
                </div>
              )}
              {invoice.paidAt && (
                <div className="flex justify-between font-semibold text-paid">
                  <span>Paid</span>
                  <span>{formatDate(invoice.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          {job && (
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-sm text-charcoal mb-2">Job</h3>
              <Link
                href={`/admin/jobs/${job.id}`}
                className="text-sm font-medium text-espresso hover:underline"
              >
                {job.title}
              </Link>
            </div>
          )}

          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-sm text-charcoal mb-2">Client Invoice Link</h3>
            <Link
              href={`/invoice/${invoice.token}`}
              className="flex items-center gap-1 text-xs text-espresso hover:underline break-all"
            >
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              /invoice/{invoice.token.slice(0, 12)}...
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
