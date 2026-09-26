from google import genai
from google.genai import types
from app.config import settings
from pydantic import BaseModel
import json

class GeminiService:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.model_name = settings.gemini_model
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def _get_dummy_data(self, schema: type[BaseModel], is_error: bool = False) -> BaseModel:
        # A simple fallback for demo/development when API key is not set or there's an error
        # In a real app we'd construct valid mocks. Here we try to create an empty but valid model.
        # This uses model_construct which bypasses validation, but we try to set is_demo_response
        try:
            dummy = schema.model_construct()
            if hasattr(dummy, 'is_demo_response'):
                dummy.is_demo_response = True
            return dummy
        except Exception:
            return schema.construct()

    def generate_structured(self, prompt: str, schema: type[BaseModel]) -> BaseModel:
        if not self.client:
            print("DEMO_MODE: GEMINI_API_KEY is missing.")
            return self._get_dummy_data(schema)
            
        import time
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=schema,
                        temperature=0.1
                    ),
                )
                
                # Try to use parsed if available, else json loads text
                if hasattr(response, "parsed") and response.parsed:
                     if isinstance(response.parsed, schema):
                         return response.parsed
                     elif isinstance(response.parsed, dict):
                         return schema(**response.parsed)
                         
                if not response.text:
                    raise ValueError("Empty response text from Gemini API")
                    
                data = json.loads(response.text)
                return schema(**data)
                
            except json.JSONDecodeError as e:
                print(f"Gemini API returned malformed JSON: {e}")
                if attempt == max_retries - 1:
                    return self._get_dummy_data(schema, is_error=True)
            except Exception as e:
                print(f"Gemini API error (Attempt {attempt+1}/{max_retries}): {e}")
                if "429" in str(e) or "Too Many Requests" in str(e) or "quota" in str(e).lower():
                    if attempt < max_retries - 1:
                        time.sleep(2 * (attempt + 1))
                        continue
                if attempt == max_retries - 1:
                    return self._get_dummy_data(schema, is_error=True)

gemini_service = GeminiService()
