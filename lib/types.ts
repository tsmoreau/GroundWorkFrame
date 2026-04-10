export interface Note {
  text: string;
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  amount: number;
  category?: string;
}

export interface Pet {
  name?: string;
  type: "cat" | "dog";
  breed?: string;
}

export interface PetInfo {
  type: "cat" | "dog" | "both";
  breed?: string;
  count?: number;
}

export type LeadSource =
  | "contact_form"
  | "nextdoor"
  | "craigslist"
  | "referral"
  | "vet_card"
  | "other";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "dead";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  source: LeadSource;
  message: string;
  photos: string[];
  petInfo: PetInfo;
  status: LeadStatus;
  notes: Note[];
  convertedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export type JobType =
  | "catio"
  | "dog_house"
  | "kennel"
  | "cat_box"
  | "tunnel"
  | "other";

export type JobStatus =
  | "quoted"
  | "deposit_paid"
  | "materials_ordered"
  | "scheduled"
  | "in_progress"
  | "complete"
  | "cancelled";

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  type: JobType;
  status: JobStatus;
  lineItems: LineItem[];
  depositAmount?: number;
  estimatedDays: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  materialsCost: number;
  materialsNotes?: string;
  photos: string[];
  portfolioApproved: boolean;
  invoiceIds: string[];
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export type InvoiceType = "quote" | "deposit" | "final" | "full";
export type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "approved"
  | "declined"
  | "paid"
  | "void";
export type PaymentMethod =
  | "stripe_ach"
  | "stripe_card"
  | "zelle"
  | "check"
  | "bank_transfer"
  | "other";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  jobId: string;
  clientId: string;
  clientName: string;
  type: InvoiceType;
  lineItems: LineItem[];
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  token: string;
  sentAt?: string;
  viewedAt?: string;
  status: InvoiceStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  pets: Pet[];
  notes: Note[];
  leadId?: string;
  jobIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  businessName: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail: string;
  businessLogo?: string;
  invoicePrefix: string;
  depositPercent: number;
  taxRate: number;
  stripeEnabled: boolean;
  zelleEnabled: boolean;
  zelleRecipient?: string;
  checkEnabled: boolean;
  checkPayableTo?: string;
  checkMailingAddress?: string;
  bankTransferEnabled: boolean;
  bankName?: string;
  bankRoutingNumber?: string;
  bankAccountLast4?: string;
}
