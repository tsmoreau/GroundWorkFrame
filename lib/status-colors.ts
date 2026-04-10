export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "var(--color-gold)",
  contacted: "var(--color-lead-contacted)",
  qualified: "var(--color-paid)",
  converted: "var(--color-espresso)",
  dead: "var(--color-sand-dim)",
};

export const LEAD_STATUS_BG: Record<string, string> = {
  new: "var(--color-lead-new-bg)",
  contacted: "var(--color-status-blue-bg)",
  qualified: "var(--color-status-green-light-bg)",
  converted: "var(--color-lead-converted-bg)",
  dead: "var(--color-warm-sand)",
};

export const JOB_STATUS_STYLES: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  quoted: {
    bg: "var(--color-status-neutral-bg)",
    color: "var(--color-status-neutral)",
    border: "var(--color-border)",
  },
  deposit_paid: {
    bg: "var(--color-status-blue-bg)",
    color: "var(--color-status-blue)",
    border: "var(--color-job-border-blue)",
  },
  materials_ordered: {
    bg: "var(--color-status-amber-bg)",
    color: "var(--color-status-amber)",
    border: "var(--color-job-border-amber)",
  },
  scheduled: {
    bg: "var(--color-status-purple-bg)",
    color: "var(--color-status-purple)",
    border: "var(--color-job-border-purple)",
  },
  in_progress: {
    bg: "var(--color-status-green-bg)",
    color: "var(--color-paid)",
    border: "var(--color-job-border-green)",
  },
  complete: {
    bg: "var(--color-status-green-light-bg)",
    color: "var(--color-paid)",
    border: "var(--color-job-border-green-light)",
  },
  cancelled: {
    bg: "var(--color-status-red-bg)",
    color: "var(--color-danger)",
    border: "var(--color-job-border-red)",
  },
};

export const INVOICE_STATUS_STYLES: Record<
  string,
  { bg: string; color: string }
> = {
  draft: {
    bg: "var(--color-status-neutral-bg)",
    color: "var(--color-status-neutral)",
  },
  sent: {
    bg: "var(--color-status-blue-bg)",
    color: "var(--color-status-blue)",
  },
  viewed: {
    bg: "var(--color-status-amber-bg)",
    color: "var(--color-status-amber)",
  },
  paid: {
    bg: "var(--color-status-green-light-bg)",
    color: "var(--color-paid)",
  },
  void: {
    bg: "var(--color-status-red-bg)",
    color: "var(--color-danger)",
  },
};
