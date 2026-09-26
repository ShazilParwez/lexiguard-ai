"""
Vector Store Manager
====================
Uses an in-memory dict of {document_id: {"vectors": [...], "docs": [...]}}
to store embeddings produced by the GeminiEmbeddings adapter.

No ChromaDB, no persisted directories, no local state outside this process.

Similarity search is cosine similarity computed with numpy (pure-Python
fallback also available).
"""

import math
from typing import List
from app.services.embeddings import gemini_embeddings


def _cosine_similarity(a: List[float], b: List[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)


class SimpleDoc:
    """Minimal stand-in for LangChain Document so routes.py works unchanged."""
    def __init__(self, page_content: str, metadata: dict):
        self.page_content = page_content
        self.metadata = metadata


class VectorStoreManager:
    def __init__(self):
        # {document_id: {"vectors": List[List[float]], "docs": List[SimpleDoc]}}
        self.stores: dict = {}

    def store_document(self, document_id: str, chunks: List[dict]):
        """Embed chunks and store vectors in memory."""
        if not chunks:
            self.stores[document_id] = {"vectors": [], "docs": []}
            return

        texts = [c["text"] for c in chunks]
        vectors = gemini_embeddings.embed_documents(texts)

        docs = [
            SimpleDoc(page_content=c["text"], metadata=c.get("metadata", {}))
            for c in chunks
        ]

        self.stores[document_id] = {"vectors": vectors, "docs": docs}

    def retrieve(self, document_id: str, query: str, k: int = 4) -> List[SimpleDoc]:
        """Return top-k most similar chunks using cosine similarity."""
        if document_id not in self.stores:
            return []

        store = self.stores[document_id]
        if not store["vectors"]:
            return []

        query_vector = gemini_embeddings.embed_query(query)

        scored = [
            (_cosine_similarity(query_vector, v), doc)
            for v, doc in zip(store["vectors"], store["docs"])
        ]
        scored.sort(key=lambda x: x[0], reverse=True)
        return [doc for _, doc in scored[:k]]


vector_store_manager = VectorStoreManager()
