import type { RentalSelection } from '../consultation';

/** Payload for a future consent-based lead API integration. */
export type ConsultationLeadPayload = {
  name: string;
  phone: string;
  selection: RentalSelection;
  estimatedMonthlyRentWon: number | null;
  consentedAt: string;
};

export type LeadSubmissionResult = { status: 'not-configured' };

/** No network request, persistence, or transmission until an endpoint is configured. */
export async function submitConsultationLead(_lead: ConsultationLeadPayload): Promise<LeadSubmissionResult> {
  void _lead;
  return { status: 'not-configured' };
}
