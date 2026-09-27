from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UploadResponse(BaseModel):
    document_id: str
    filename: str
    message: str = "Upload successful"
    full_text: str = ""
    pages: List[dict] = []

class SourceMetadata(BaseModel):
    page: Optional[int] = None
    section: Optional[str] = None
    quote: Optional[str] = None

class AIResponseBase(BaseModel):
    is_demo_response: bool = False

class DocumentOverview(AIResponseBase):
    document_type: str
    approximate_length_pages: int
    parties_involved: List[str]
    effective_date: Optional[str] = "Not identified in the document."
    expiration_date: Optional[str] = "Not identified in the document."
    governing_law: Optional[str] = "Not identified in the document."
    key_dates: List[str]
    important_monetary_amounts: List[str]
    detected_obligations: List[str]

class DocumentSummary(AIResponseBase):
    simple_english: str
    what_you_agree_to: List[str]
    what_other_party_must_do: List[str]
    money_and_payments: List[str]
    important_dates: List[str]
    important_restrictions: List[str]
    things_worth_reviewing: List[str]

class ClauseAnalysis(BaseModel):
    category: str
    original_text: str
    plain_english: str
    why_it_matters: str
    who_is_affected: str
    attention_level: str
    source: SourceMetadata

class AttentionFinding(BaseModel):
    title: str
    category: str
    clause: str
    explanation: str
    why_it_matters: str
    lawyer_question: str
    source: SourceMetadata

class ActionPlanItem(BaseModel):
    action: str
    reason: str
    source: Optional[SourceMetadata] = None

class ActionPlan(AIResponseBase):
    document_based_actions: List[ActionPlanItem]
    questions_to_clarify: List[str]
    questions_for_professional: List[str]
    important_dates: List[str]
    documents_to_gather: List[str]

class QuestionAnswer(AIResponseBase):
    answer: str
    evidence: str
    source: SourceMetadata

class AskRequest(BaseModel):
    question: str
    full_text: str

class DocumentRequest(BaseModel):
    full_text: str


class ComparisonChange(BaseModel):
    category: str
    document_a: str
    document_b: str
    change_summary: str
    significance: str

class ExecutiveComparison(BaseModel):
    stayed_same: List[str]
    changed: List[str]
    added: List[str]
    removed: List[str]
    broader: List[str]
    narrower: List[str]

class ComparisonResult(AIResponseBase):
    executive_summary: ExecutiveComparison
    changes: List[ComparisonChange]

class TerminologyRequest(BaseModel):
    term: str
    context: Optional[str] = None

class TerminologyExplanation(AIResponseBase):
    simple_meaning: str
    meaning_in_document: str
    example: str
    why_it_matters: str

class FindingsResult(AIResponseBase):
    clause_analysis: List[ClauseAnalysis]
    attention_findings: List[AttentionFinding]
