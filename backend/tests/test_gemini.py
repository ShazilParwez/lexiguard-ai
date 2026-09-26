import pytest
from app.services.gemini_service import GeminiService
from app.schemas.api import DocumentOverview
from pydantic import BaseModel

def test_gemini_configuration():
    service = GeminiService()
    assert hasattr(service, "api_key")
    assert hasattr(service, "model_name")
    # It might be None if no API key is provided during tests
    if service.api_key:
        assert service.client is not None
    else:
        assert service.client is None

def test_missing_api_key(monkeypatch):
    from app.config import settings
    monkeypatch.setattr(settings, "gemini_api_key", "")
    service = GeminiService()
    
    # Should fallback to dummy data gracefully when api key is missing
    result = service.generate_structured("Test prompt", DocumentOverview)
    assert isinstance(result, DocumentOverview)
    assert hasattr(result, "is_demo_response")
    assert result.is_demo_response is True

def test_structured_output_parsing():
    service = GeminiService()
    # Using the dummy fallback since we don't want to make real API calls in basic unit tests
    # If the API key is not missing, we might make a real call. 
    # Let's mock the client generation to simulate a response.
    
    class MockClient:
        class models:
            @staticmethod
            def generate_content(model, contents, config):
                class MockResponse:
                    text = '{"document_type": "NDA", "approximate_length_pages": 5, "parties_involved": ["A", "B"], "key_dates": [], "important_monetary_amounts": [], "detected_obligations": []}'
                    parsed = None
                return MockResponse()
                
    service.client = MockClient()
    result = service.generate_structured("Test prompt", DocumentOverview)
    assert isinstance(result, DocumentOverview)
    assert result.document_type == "NDA"
    assert result.approximate_length_pages == 5

def test_malformed_json_handling():
    service = GeminiService()
    
    class MockClient:
        class models:
            @staticmethod
            def generate_content(model, contents, config):
                class MockResponse:
                    text = '{"document_type": "NDA", "approximate_length_pages": INVALID}'
                    parsed = None
                return MockResponse()
                
    service.client = MockClient()
    # It should fallback to dummy data on JSONDecodeError or other exceptions
    result = service.generate_structured("Test prompt", DocumentOverview)
    assert result.is_demo_response is True
