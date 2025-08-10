export interface HiringRequest {
  id: string;
  clientId: string;
  musicianId: string;
  eventDetails: EventDetails;
  requirements: Requirements;
  budget: Budget;
  status: HiringStatus;
  timeline: Timeline;
  communication: CommunicationPreferences;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  cancellationReason?: string;
}

export interface EventDetails {
  title: string;
  description: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime: string;
  location: EventLocation;
  expectedAttendees: number;
  dressCode?: string;
  specialRequirements?: string;
}

export interface Requirements {
  instruments: string[];
  genres: string[];
  experience: ExperienceLevel;
  availability: string[];
  additionalSkills?: string[];
  equipment?: string[];
}

export interface Budget {
  amount: number;
  currency: string;
  paymentTerms: PaymentTerms;
  depositRequired: boolean;
  depositAmount?: number;
  paymentSchedule?: PaymentSchedule[];
}

export interface Timeline {
  applicationDeadline: string;
  decisionDeadline: string;
  rehearsalDate?: string;
  eventDate: string;
  paymentDueDate: string;
}

export interface CommunicationPreferences {
  preferredMethod: 'email' | 'phone' | 'chat' | 'video_call';
  availability: string[];
  responseTime: string;
  language: string;
}

export interface Contract {
  id: string;
  hiringRequestId: string;
  clientId: string;
  musicianId: string;
  terms: ContractTerms;
  payment: ContractPayment;
  status: ContractStatus;
  signatures: Signature[];
  createdAt: string;
  updatedAt: string;
  signedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface ContractTerms {
  services: string[];
  deliverables: string[];
  timeline: ContractTimeline;
  responsibilities: string[];
  cancellationPolicy: string;
  forceMajeure: string;
  governingLaw: string;
}

export interface ContractPayment {
  totalAmount: number;
  currency: string;
  paymentSchedule: PaymentSchedule[];
  latePaymentPenalty: number;
  taxInformation: TaxInfo;
}

export interface PaymentSchedule {
  amount: number;
  dueDate: string;
  description: string;
  status: PaymentStatus;
  paidAt?: string;
}

export interface TaxInfo {
  taxRate: number;
  taxAmount: number;
  taxExempt: boolean;
  taxExemptionReason?: string;
}

export interface Signature {
  userId: string;
  signature: string;
  signedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

export type HiringStatus = 
  | 'pending'
  | 'reviewing'
  | 'accepted'
  | 'rejected'
  | 'cancelled'
  | 'expired'
  | 'completed';

export type ContractStatus = 
  | 'draft'
  | 'pending_signature'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'paypal'
  | 'stripe'
  | 'cash'
  | 'check';

export type EventType = 
  | 'wedding'
  | 'corporate_event'
  | 'birthday_party'
  | 'anniversary'
  | 'concert'
  | 'festival'
  | 'private_party'
  | 'religious_ceremony'
  | 'graduation'
  | 'other';

export type ExperienceLevel = 
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'professional'
  | 'expert';

export type PaymentTerms = 
  | 'immediate'
  | 'net_15'
  | 'net_30'
  | 'net_60'
  | 'custom';

export interface HiringStats {
  totalRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  totalRevenue: number;
  averageResponseTime: number;
  byStatus: Record<HiringStatus, number>;
  byEventType: Record<EventType, number>;
  byMonth: Record<string, number>;
}

export interface EventLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ContractTimeline {
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  deliveredAt?: string;
}
