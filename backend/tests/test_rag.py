import pytest
from app.api.routes import ask_question, DOCUMENTS_STORE
from app.schemas.api import AskRequest
from fastapi import HTTPException
import asyncio

# Mocking the vector store and gemini service for testing RAG flow
def test_grounded_qa(monkeypatch):
    from app.services.retrieval import vector_store_manager
    from app.services.gemini_service import gemini_service
    from app.schemas.api import QuestionAnswer, SourceMetadata
    
    DOCUMENTS_STORE["test_doc_123"] = {
        "filename": "test.pdf",
        "pages": [{"text": "Confidentiality lasts for 3 years.", "page_number": 1}],
        "full_text": "Confidentiality lasts for 3 years."
    }
    
    class MockChunk:
        page_content = "Confidentiality lasts for 3 years."
        metadata = {"page": 1}
        
    def mock_retrieve(doc_id, query):
        return [MockChunk()]
        
    def mock_generate(prompt, schema):
        return QuestionAnswer(
            answer="It lasts for 3 years.",
            evidence="Confidentiality lasts for 3 years.",
            source=SourceMetadata(page=1)
        )
        
    monkeypatch.setattr(vector_store_manager, "retrieve", mock_retrieve)
    monkeypatch.setattr(gemini_service, "generate_structured", mock_generate)
    
    # Run async function
    request = AskRequest(question="How long does confidentiality last?")
    response = asyncio.run(ask_question("test_doc_123", request))
    
    assert response.answer == "It lasts for 3 years."
    assert response.source.page == 1

def test_missing_document_raises_404():
    request = AskRequest(question="What is this?")
    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(ask_question("nonexistent_id", request))
    assert exc_info.value.status_code == 404
