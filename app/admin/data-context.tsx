"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Lead, Client, Job, Invoice, BusinessSettings } from "@/lib/types";
import {
  initialLeads,
  initialClients,
  initialJobs,
  initialInvoices,
  initialSettings,
} from "@/lib/mock-data";
import { generateId, generateToken } from "@/lib/utils";

interface DataContextType {
  leads: Lead[];
  clients: Client[];
  jobs: Job[];
  invoices: Invoice[];
  settings: BusinessSettings;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Lead;
  convertLead: (leadId: string) => Client | null;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => Client;
  updateJob: (id: string, updates: Partial<Job>) => void;
  addJob: (job: Omit<Job, "id" | "createdAt" | "updatedAt">) => Job;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  createInvoiceFromJob: (
    jobId: string,
    type: Invoice["type"],
  ) => Invoice | null;
  updateSettings: (updates: Partial<BusinessSettings>) => void;
  nextInvoiceNumber: () => string;
}

const DataContext = createContext<DataContextType | null>(null);

const STORAGE_KEY = "groundwork-data-v1";

function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data: object) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      if (stored.leads) setLeads(stored.leads);
      if (stored.clients) setClients(stored.clients);
      if (stored.jobs) setJobs(stored.jobs);
      if (stored.invoices) setInvoices(stored.invoices);
      if (stored.settings) setSettings(stored.settings);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveToStorage({ leads, clients, jobs, invoices, settings });
  }, [leads, clients, jobs, invoices, settings, loaded]);

  const now = () => new Date().toISOString();

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, ...updates, updatedAt: now() } : l,
      ),
    );
  }, []);

  const addLead = useCallback(
    (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
      const newLead: Lead = {
        ...lead,
        id: generateId("lead"),
        createdAt: now(),
        updatedAt: now(),
      };
      setLeads((prev) => [newLead, ...prev]);
      return newLead;
    },
    [],
  );

  const convertLead = useCallback(
    (leadId: string): Client | null => {
      const lead = leads.find((l) => l.id === leadId);
      if (!lead || lead.status === "converted") return null;
      const newClient: Client = {
        id: generateId("client"),
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        address: lead.address ?? "",
        pets: lead.petInfo
          ? [
              {
                type: lead.petInfo.type === "both" ? "cat" : lead.petInfo.type,
                breed: lead.petInfo.breed,
              },
            ]
          : [],
        notes: [],
        leadId: lead.id,
        jobIds: [],
        createdAt: now(),
        updatedAt: now(),
      };
      setClients((prev) => [newClient, ...prev]);
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? {
                ...l,
                status: "converted",
                convertedTo: newClient.id,
                updatedAt: now(),
              }
            : l,
        ),
      );
      return newClient;
    },
    [leads],
  );

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: now() } : c,
      ),
    );
  }, []);

  const addClient = useCallback(
    (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
      const newClient: Client = {
        ...client,
        id: generateId("client"),
        createdAt: now(),
        updatedAt: now(),
      };
      setClients((prev) => [newClient, ...prev]);
      return newClient;
    },
    [],
  );

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, ...updates, updatedAt: now() } : j,
      ),
    );
  }, []);

  const addJob = useCallback(
    (job: Omit<Job, "id" | "createdAt" | "updatedAt">) => {
      const newJob: Job = {
        ...job,
        id: generateId("job"),
        createdAt: now(),
        updatedAt: now(),
      };
      setJobs((prev) => [newJob, ...prev]);
      setClients((prev) =>
        prev.map((c) =>
          c.id === job.clientId
            ? { ...c, jobIds: [...c.jobIds, newJob.id], updatedAt: now() }
            : c,
        ),
      );
      return newJob;
    },
    [],
  );

  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, ...updates, updatedAt: now() } : i,
      ),
    );
  }, []);

  const nextInvoiceNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `${settings.invoicePrefix}-${year}-${String(count).padStart(3, "0")}`;
  }, [invoices.length, settings.invoicePrefix]);

  const createInvoiceFromJob = useCallback(
    (jobId: string, type: Invoice["type"]): Invoice | null => {
      const job = jobs.find((j) => j.id === jobId);
      if (!job) return null;
      const client = clients.find((c) => c.id === job.clientId);
      if (!client) return null;

      let lineItems = job.lineItems.map((li) => ({ ...li }));
      if (type === "deposit") {
        const total = lineItems.reduce((s, li) => s + li.amount, 0);
        const dep = Math.round(total * (settings.depositPercent / 100));
        lineItems = [
          {
            id: generateId("il"),
            description: `Deposit — ${settings.depositPercent}% of project (${job.title})`,
            amount: dep,
          },
        ];
      }

      const invoice: Invoice = {
        id: generateId("inv"),
        invoiceNumber: nextInvoiceNumber(),
        jobId,
        clientId: job.clientId,
        clientName: client.name,
        type,
        lineItems,
        token: generateToken(),
        status: "draft",
        createdAt: now(),
        updatedAt: now(),
      };

      setInvoices((prev) => [...prev, invoice]);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                invoiceIds: [...j.invoiceIds, invoice.id],
                updatedAt: now(),
              }
            : j,
        ),
      );
      return invoice;
    },
    [
      jobs,
      clients,
      settings.depositPercent,
      settings.invoicePrefix,
      nextInvoiceNumber,
    ],
  );

  const updateSettings = useCallback((updates: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <DataContext.Provider
      value={{
        leads,
        clients,
        jobs,
        invoices,
        settings,
        updateLead,
        addLead,
        convertLead,
        updateClient,
        addClient,
        updateJob,
        addJob,
        updateInvoice,
        createInvoiceFromJob,
        updateSettings,
        nextInvoiceNumber,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
