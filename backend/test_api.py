import os
from pydantic import BaseModel
from google import genai
from google.genai import types

api_key = os.getenv("GEMINI_API_KEY") or "YOUR_API_KEY_HERE"

class TestSchema(BaseModel):
    message: str

def test():
    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Say hello",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=TestSchema,
                temperature=0.1
            ),
        )
        print("Success:", response.text)
    except Exception as e:
        print("Error:", repr(e))

if __name__ == "__main__":
    test()
