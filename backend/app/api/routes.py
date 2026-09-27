from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.api import UploadResponse, DocumentOverview, DocumentSummary, AskRequest, QuestionAnswer, TerminologyRequest, TerminologyExplanation, ComparisonResult, ActionPlan, DocumentRequest
from app.services.document_parser import DocumentParser
from app.services.chunking import Chunker
from app.services.retrieval import vector_store_manager
from app.services.gemini_service import gemini_service
import uuid
import os
import tempfile
from typing import List

router = APIRouter()

@router.post("/documents/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    document_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    
    # Save temp file
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, f"{document_id}{ext}")
    
    with open(temp_path, "wb") as f:
        f.write(await file.read())
        
    # Parse document
    try:
        pages = DocumentParser.parse_document(temp_path, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    full_text = "\n".join([p["text"] for p in pages])
    
    # Clean up the temp file
    if os.path.exists(temp_path):
        os.remove(temp_path)
    
    return {
        "document_id": document_id, 
        "filename": file.filename, 
        "message": "Upload successful",
        "full_text": full_text,
        "pages": pages
    }

@router.post("/documents/{document_id}/analyze", response_model=DocumentOverview)
def analyze_document(document_id: str, request: DocumentRequest):
    prompt = f"""
    ROLE: You are an expert legal analyst.
    TASK: Analyze the following legal document and provide an overview.
    CONSTRAINTS: Be objective. Do not provide legal advice. If information is missing, state 'Not identified in the document.'
    EVIDENCE:
    {request.full_text[:15000]} # Limiting to 15000 chars for initial overview to avoid token limits if too long
    """
    
    overview = gemini_service.generate_structured(prompt, DocumentOverview)
    return overview

@router.post("/documents/{document_id}/summary", response_model=DocumentSummary)
def get_summary(document_id: str, request: DocumentRequest):
    prompt = f"""
    ROLE: You are a helpful legal assistant for non-lawyers.
    TASK: Summarize the following document in plain English.
    CONSTRAINTS: Use simple language. Identify commitments, obligations, payments, dates, restrictions, and things worth reviewing.
    EVIDENCE:
    {request.full_text[:20000]}
    """
    
    summary = gemini_service.generate_structured(prompt, DocumentSummary)
    return summary

@router.post("/documents/{document_id}/ask", response_model=QuestionAnswer)
def ask_question(document_id: str, request: AskRequest):
    # Stateless chunking and retrieval on the fly
    pages = [{"page": 1, "text": request.full_text}]
    chunks = Chunker.chunk_document(pages)
    
    # Store temporarily in memory just for this request
    vector_store_manager.store_document(document_id, chunks)
    
    # Retrieve relevant chunks
    relevant_chunks = vector_store_manager.retrieve(document_id, request.question)
    
    # Clean up memory
    if document_id in vector_store_manager.stores:
        del vector_store_manager.stores[document_id]
    
    context = "\n\n".join([f"Page {c.metadata.get('page', 'Unknown')}: {c.page_content}" for c in relevant_chunks])
    
    prompt = f"""
    ROLE: You are a knowledgeable assistant answering questions about a specific document.
    TASK: Answer the user's question based ONLY on the provided evidence.
    CONSTRAINTS: 
    - You must only use the retrieved evidence.
    - If evidence is insufficient, state: 'The uploaded document does not provide enough information to answer this confidently.'
    - Do not invent facts.
    - Provide a short plain-language explanation, quote the minimum necessary evidence, and cite the page/section.
    
    QUESTION: {request.question}
    
    EVIDENCE CHUNKS:
    {context}
    """
    
    answer = gemini_service.generate_structured(prompt, QuestionAnswer)
    return answer

@router.post("/terminology/explain", response_model=TerminologyExplanation)
def explain_terminology(request: TerminologyRequest):
    prompt = f"""
    ROLE: You are an expert legal dictionary for non-lawyers.
    TASK: Explain the legal term '{request.term}'.
    CONTEXT: {request.context or 'General context'}
    CONSTRAINTS: Use plain language. Do not provide definitive legal advice.
    """
    
    explanation = gemini_service.generate_structured(prompt, TerminologyExplanation)
    return explanation

@router.post("/documents/{document_id}/action-plan", response_model=ActionPlan)
def get_action_plan(document_id: str, request: DocumentRequest):
    prompt = f"""
    ROLE: You are a practical assistant helping a user figure out next steps after reading a document.
    TASK: Generate an action plan and preparation checklist based on the document.
    CONSTRAINTS: Be objective. Do not tell them what they *must* do legally, just what is practical (e.g., 'Gather X records', 'Ask a lawyer about Y').
    EVIDENCE:
    {request.full_text[:20000]}
    """
    
    plan = gemini_service.generate_structured(prompt, ActionPlan)
    return plan
    
@router.post("/documents/{document_id}/findings")
def get_findings(document_id: str, request: DocumentRequest):
    prompt = f"""
    ROLE: You are a risk and attention detector for legal documents.
    TASK: Identify important clauses and potential areas of attention (e.g., unusual terms, strict obligations, ambiguities) in the document.
    CONSTRAINTS: 
    - Output a JSON object containing two lists: 'clause_analysis' and 'attention_findings'.
    - 'clause_analysis' must follow the ClauseAnalysis schema.
    - 'attention_findings' must follow the AttentionFinding schema.
    - Do not give definitive legal advice or state that a clause is illegal.
    EVIDENCE:
    {request.full_text[:20000]}
    """
    
    from app.schemas.api import FindingsResult
        
    findings = gemini_service.generate_structured(prompt, FindingsResult)
    return findings

from pydantic import BaseModel
class CompareRequest(BaseModel):
    doc_a_text: str
    doc_b_text: str

@router.post("/compare", response_model=ComparisonResult)
def compare_documents(request: CompareRequest):
    prompt = f"""
    ROLE: You are an expert contract comparison analyst.
    TASK: Compare Document A and Document B. Highlight the meaningful changes, additions, removals, and shifts in scope (broader/narrower).
    CONSTRAINTS: Be objective. Do not provide legal advice.
    
    DOCUMENT A:
    {request.doc_a_text[:15000]}
    
    DOCUMENT B:
    {request.doc_b_text[:15000]}
    """
    
    comparison = gemini_service.generate_structured(prompt, ComparisonResult)
    return comparison
