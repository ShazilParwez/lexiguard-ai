"""
Custom Gemini Embedding Adapter
================================
Uses the official google-genai SDK (google.genai.Client) to call the
current embedding API.  This replaces the broken LangChain
GoogleGenerativeAIEmbeddings wrapper which does not support the current
gemini-embedding-2 model on the v1beta endpoint used by older langchain-
google-genai versions.

Models supported:
  gemini-embedding-2      (recommended, default)
  gemini-embedding-001    (also available)

Task types understood by the API:
  RETRIEVAL_DOCUMENT  – use when embedding document chunks for storage
  RETRIEVAL_QUERY     – use when embedding a search query
"""

import os
from typing import List
from google import genai
from app.config import settings


class GeminiEmbeddings:
    """
    Thin wrapper around client.models.embed_content(…).

    Interface mirrors what InMemoryVectorStore / similarity search expects:
        embed_documents(texts: List[str]) -> List[List[float]]
        embed_query(text: str)           -> List[float]
    """

    def __init__(self):
        api_key = settings.gemini_api_key
        self.model = settings.gemini_embedding_model  # e.g. "gemini-embedding-2"
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = None

    # ------------------------------------------------------------------
    # LangChain-compatible interface so InMemoryVectorStore still works
    # ------------------------------------------------------------------

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a batch of document chunks (RETRIEVAL_DOCUMENT task)."""
        if not self.client:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured. "
                "Set it as a Vercel environment variable."
            )

        from google.genai import types as genai_types

        # The API accepts a batch; send all texts at once for efficiency.
        # Wrap each text as a content part the way the SDK expects.
        contents = [
            genai_types.Content(parts=[genai_types.Part(text=t)])
            for t in texts
        ]
        response = self.client.models.embed_content(
            model=self.model,
            contents=contents,
            config=genai_types.EmbedContentConfig(
                task_type="RETRIEVAL_DOCUMENT"
            ),
        )
        return [e.values for e in response.embeddings]

    def embed_query(self, text: str) -> List[float]:
        """Embed a single search query (RETRIEVAL_QUERY task)."""
        if not self.client:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured. "
                "Set it as a Vercel environment variable."
            )

        from google.genai import types as genai_types

        response = self.client.models.embed_content(
            model=self.model,
            contents=text,
            config=genai_types.EmbedContentConfig(
                task_type="RETRIEVAL_QUERY"
            ),
        )
        return response.embeddings[0].values


# Singleton – one per Vercel function invocation
gemini_embeddings = GeminiEmbeddings()
