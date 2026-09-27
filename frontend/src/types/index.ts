export interface UploadResponse {
  document_id: string;
  filename: string;
  message: string;
  full_text?: string;
  pages?: any[];
}

export interface SourceMetadata {
  page?: number;
  section?: string;
  quote?: string;
}

export interface DocumentOverview {
  document_type: string;
  approximate_length_pages: number;
  parties_involved: string[];
  effective_date: string;
  expiration_date: string;
  governing_law: string;
  key_dates: string[];
  important_monetary_amounts: string[];
  detected_obligations: string[];
}

export interface DocumentSummary {
  simple_english: string;
  what_you_agree_to: string[];
  what_other_party_must_do: string[];
  money_and_payments: string[];
  important_dates: string[];
  important_restrictions: string[];
  things_worth_reviewing: string[];
}

export interface ClauseAnalysis {
  category: string;
  original_text: string;
  plain_english: string;
  why_it_matters: string;
  who_is_affected: string;
  attention_level: string;
  source: SourceMetadata;
}

export interface AttentionFinding {
  title: string;
  category: string;
  clause: string;
  explanation: string;
  why_it_matters: string;
  lawyer_question: string;
  source: SourceMetadata;
}

export interface FindingsResult {
  clause_analysis: ClauseAnalysis[];
  attention_findings: AttentionFinding[];
}

export interface ActionPlanItem {
  action: string;
  reason: string;
  source?: SourceMetadata;
}

export interface ActionPlan {
  document_based_actions: ActionPlanItem[];
  questions_to_clarify: string[];
  questions_for_professional: string[];
  important_dates: string[];
  documents_to_gather: string[];
}

export interface QuestionAnswer {
  answer: string;
  evidence: string;
  source: SourceMetadata;
}

export interface ComparisonChange {
  category: string;
  document_a: string;
  document_b: string;
  change_summary: string;
  significance: string;
}

export interface ExecutiveComparison {
  stayed_same: string[];
  changed: string[];
  added: string[];
  removed: string[];
  broader: string[];
  narrower: string[];
}

export interface ComparisonResult {
  executive_summary: ExecutiveComparison;
  changes: ComparisonChange[];
}
