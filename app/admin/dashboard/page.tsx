"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useData } from "../data-context";
import {
  computeTotal,
  formatCurrency,
  formatDate,
  JOB_STATUS_LABELS,
  INVOICE_STATUS_LABELS,
} from "@/lib/utils";
import { LEAD_STATUS_COLORS } from "@/lib/status-colors";
import { ArrowRight, TrendingUp, Clock, AlertCircle, Users } from "lucide-react";

function StatCard({
  label,
  value,
  sub,
  color = "var(--color-espresso)",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <p className="text-xs font-medium text-stone uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-1" style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-xs text-stone mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { leads, jobs, invoices } = useData();
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const now = today ?? new Date(0);
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const newLeads = leads.filter((l) => l.status === "new").length;
  const activeJobs = jobs.filter(
    (j) => !["complete", "cancelled"].includes(j.status)
  ).length;
  const outstanding = invoices.filter(
    (i) => i.status === "sent" || i.status === "viewed"
  );
  const outstandingTotal = outstanding.reduce(
    (s, i) => s + computeTotal(i.lineItems),
    0
  );

  const thisMonth = today ? new Date(today.getFullYear(), today.getMonth(), 1) : new Date(0);
  const paidThisMonth = today
    ? invoices.filter(
        (i) => i.status === "paid" && i.paidAt && new Date(i.paidAt) >= thisMonth
      )
    : [];
  const revenueThisMonth = paidThisMonth.reduce(
    (s, i) => s + computeTotal(i.lineItems),
    0
  );

  const upcoming = today
    ? jobs.filter((j) => {
        if (!j.scheduledStart) return false;
        const start = new Date(j.scheduledStart);
        return start >= now && start <= twoWeeks && !["complete", "cancelled"].includes(j.status);
      })
    : [];

  const leadsByStatus = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
        <p className="text-sm text-stone mt-1" suppressHydrationWarning>
          {today
            ? today.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="New Leads"
          value={newLeads}
          sub={`${leads.length} total`}
          color={newLeads > 0 ? "var(--color-gold)" : "var(--color-espresso)"}
        />
        <StatCard
          label="Active Jobs"
          value={activeJobs}
          sub={`${jobs.length} total`}
        />
        <StatCard
          label="Outstanding"
          value={formatCurrency(outstandingTotal)}
          sub={`${outstanding.length} invoice${outstanding.length !== 1 ? "s" : ""}`}
          color={outstanding.length > 0 ? "var(--color-danger)" : "var(--color-espresso)"}
        />
        <StatCard
          label="Revenue (MTD)"
          value={formatCurrency(revenueThisMonth)}
          sub={`${paidThisMonth.length} invoice${paidThisMonth.length !== 1 ? "s" : ""} paid`}
          color="var(--color-paid)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Lead Pipeline */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-charcoal flex items-center gap-2">
              <Users className="w-4 h-4 text-stone" />
              Lead Pipeline
            </h2>
            <Link href="/admin/leads" className="text-xs text-espresso hover:underline font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {(["new", "contacted", "qualified", "converted", "dead"] as const).map((s) => (
              <div key={s} className="flex items-center justify-between">
                <span className="text-xs capitalize text-stone">{s}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-full h-1.5"
                    style={{
                      width: `${Math.max(4, ((leadsByStatus[s] || 0) / leads.length) * 80)}px`,
                      backgroundColor: LEAD_STATUS_COLORS[s] || "var(--color-sand)",
                    }}
                  />
                  <span className="text-xs font-semibold text-charcoal w-4 text-right">
                    {leadsByStatus[s] || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Jobs */}
        <div className="bg-white rounded-xl border border-border p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-charcoal flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone" />
              Upcoming Jobs (14 days)
            </h2>
            <Link href="/admin/jobs" className="text-xs text-espresso hover:underline font-medium">
              All jobs
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-stone">No jobs scheduled in the next two weeks.</p>
          ) : (
            <div className="divide-y divide-parchment-dark">
              {upcoming.map((job) => (
                <Link
                  key={job.id}
                  href={`/admin/jobs/${job.id}`}
                  className="flex items-center justify-between py-3 hover:bg-parchment-dark -mx-5 px-5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">{job.title}</p>
                    <p className="text-xs text-stone mt-0.5">{job.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-espresso">
                      {job.scheduledStart ? formatDate(job.scheduledStart) : "—"}
                    </p>
                    <p className="text-xs text-stone">{JOB_STATUS_LABELS[job.status]}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Outstanding Invoices */}
      {outstanding.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-charcoal flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-danger" />
              Outstanding Invoices
            </h2>
            <Link href="/admin/invoices" className="text-xs text-espresso hover:underline font-medium">
              All invoices
            </Link>
          </div>
          <div className="divide-y divide-parchment-dark">
            {outstanding.map((inv) => {
              const daysOld = today
                ? Math.floor(
                    (today.getTime() - new Date(inv.sentAt ?? inv.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0;
              return (
                <Link
                  key={inv.id}
                  href={`/admin/invoices/${inv.id}`}
                  className="flex items-center justify-between py-3 hover:bg-surface-hover -mx-5 px-5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">{inv.invoiceNumber}</p>
                    <p className="text-xs text-stone mt-0.5">{inv.clientName}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-sm font-semibold text-charcoal">
                        {formatCurrency(computeTotal(inv.lineItems))}
                      </p>
                      <p className={`text-xs mt-0.5 ${daysOld > 14 ? "text-danger" : "text-stone"}`}>
                        {inv.status === "viewed" ? "Viewed" : "Sent"} {daysOld}d ago
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 flex gap-3">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-charcoal bg-gold transition-colors hover:opacity-90"
        >
          <TrendingUp className="w-4 h-4" />
          View Leads
        </Link>
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border text-charcoal bg-white hover:bg-parchment transition-colors"
        >
          View Jobs
        </Link>
      </div>
    </div>
  );
}
