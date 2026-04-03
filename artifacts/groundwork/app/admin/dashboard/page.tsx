"use client";

import Link from "next/link";
import { useData } from "../data-context";
import {
  computeTotal,
  formatCurrency,
  formatDate,
  JOB_STATUS_LABELS,
  INVOICE_STATUS_LABELS,
} from "@/lib/utils";
import { ArrowRight, TrendingUp, Clock, AlertCircle, Users } from "lucide-react";

function StatCard({
  label,
  value,
  sub,
  color = "#1c3829",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#e0dbd0] p-5">
      <p className="text-xs font-medium text-[#5c5c54] uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-1" style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-xs text-[#5c5c54] mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { leads, jobs, invoices } = useData();

  const now = new Date();
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

  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const paidThisMonth = invoices.filter(
    (i) => i.status === "paid" && i.paidAt && new Date(i.paidAt) >= thisMonth
  );
  const revenueThisMonth = paidThisMonth.reduce(
    (s, i) => s + computeTotal(i.lineItems),
    0
  );

  const upcoming = jobs.filter((j) => {
    if (!j.scheduledStart) return false;
    const start = new Date(j.scheduledStart);
    return start >= now && start <= twoWeeks && !["complete", "cancelled"].includes(j.status);
  });

  const leadsByStatus = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a18]">Dashboard</h1>
        <p className="text-sm text-[#5c5c54] mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="New Leads"
          value={newLeads}
          sub={`${leads.length} total`}
          color={newLeads > 0 ? "#c8a55a" : "#1c3829"}
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
          color={outstanding.length > 0 ? "#b93232" : "#1c3829"}
        />
        <StatCard
          label="Revenue (MTD)"
          value={formatCurrency(revenueThisMonth)}
          sub={`${paidThisMonth.length} invoice${paidThisMonth.length !== 1 ? "s" : ""} paid`}
          color="#2d6a4f"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Lead Pipeline */}
        <div className="bg-white rounded-xl border border-[#e0dbd0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-[#1a1a18] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5c5c54]" />
              Lead Pipeline
            </h2>
            <Link href="/admin/leads" className="text-xs text-[#1c3829] hover:underline font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {(["new", "contacted", "qualified", "converted", "dead"] as const).map((s) => (
              <div key={s} className="flex items-center justify-between">
                <span className="text-xs capitalize text-[#5c5c54]">{s}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-full h-1.5"
                    style={{
                      width: `${Math.max(4, ((leadsByStatus[s] || 0) / leads.length) * 80)}px`,
                      backgroundColor:
                        s === "new" ? "#c8a55a"
                        : s === "contacted" ? "#6b9dc2"
                        : s === "qualified" ? "#2d6a4f"
                        : s === "converted" ? "#1c3829"
                        : "#d0cbc4",
                    }}
                  />
                  <span className="text-xs font-semibold text-[#1a1a18] w-4 text-right">
                    {leadsByStatus[s] || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Jobs */}
        <div className="bg-white rounded-xl border border-[#e0dbd0] p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-[#1a1a18] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5c5c54]" />
              Upcoming Jobs (14 days)
            </h2>
            <Link href="/admin/jobs" className="text-xs text-[#1c3829] hover:underline font-medium">
              All jobs
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-[#5c5c54]">No jobs scheduled in the next two weeks.</p>
          ) : (
            <div className="divide-y divide-[#f0ece4]">
              {upcoming.map((job) => (
                <Link
                  key={job.id}
                  href={`/admin/jobs/${job.id}`}
                  className="flex items-center justify-between py-3 hover:bg-[#faf8f4] -mx-5 px-5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1a1a18]">{job.title}</p>
                    <p className="text-xs text-[#5c5c54] mt-0.5">{job.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#1c3829]">
                      {job.scheduledStart ? formatDate(job.scheduledStart) : "—"}
                    </p>
                    <p className="text-xs text-[#5c5c54]">{JOB_STATUS_LABELS[job.status]}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Outstanding Invoices */}
      {outstanding.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e0dbd0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-[#1a1a18] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#b93232]" />
              Outstanding Invoices
            </h2>
            <Link href="/admin/invoices" className="text-xs text-[#1c3829] hover:underline font-medium">
              All invoices
            </Link>
          </div>
          <div className="divide-y divide-[#f0ece4]">
            {outstanding.map((inv) => {
              const daysOld = Math.floor(
                (Date.now() - new Date(inv.sentAt ?? inv.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <Link
                  key={inv.id}
                  href={`/admin/invoices/${inv.id}`}
                  className="flex items-center justify-between py-3 hover:bg-[#faf8f4] -mx-5 px-5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1a1a18]">{inv.invoiceNumber}</p>
                    <p className="text-xs text-[#5c5c54] mt-0.5">{inv.clientName}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a18]">
                        {formatCurrency(computeTotal(inv.lineItems))}
                      </p>
                      <p className={`text-xs mt-0.5 ${daysOld > 14 ? "text-[#b93232]" : "text-[#5c5c54]"}`}>
                        {inv.status === "viewed" ? "Viewed" : "Sent"} {daysOld}d ago
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#5c5c54]" />
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "#1c3829" }}
        >
          <TrendingUp className="w-4 h-4" />
          View Leads
        </Link>
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[#e0dbd0] text-[#1a1a18] bg-white hover:bg-[#f8f6f2] transition-colors"
        >
          View Jobs
        </Link>
      </div>
    </div>
  );
}
