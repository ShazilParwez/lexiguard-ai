from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.documents import Document
from app.config import settings

class VectorStoreManager:
    def __init__(self):
        # We will use an in-memory dictionary to store our vector stores per document
        # This completely bypasses the need for the massive ChromaDB and ONNX packages!
        self.stores = {}

    def get_embeddings(self):
        api_key = settings.gemini_api_key
        model_name = f"models/{settings.gemini_embedding_model}" if not settings.gemini_embedding_model.startswith("models/") else settings.gemini_embedding_model
        
        if not api_key:
            api_key = "dummy"
            
        return GoogleGenerativeAIEmbeddings(model=model_name, google_api_key=api_key)

    def store_document(self, document_id: str, chunks: list):
        docs = [Document(page_content=c["text"], metadata=c["metadata"]) for c in chunks]
        
        # Initialize an in-memory vector store for this document
        store = InMemoryVectorStore(embedding=self.get_embeddings())
        store.add_documents(docs)
        
        self.stores[document_id] = store

    def retrieve(self, document_id: str, query: str, k: int = 4):
        if document_id not in self.stores:
            return []
            
        store = self.stores[document_id]
        return store.similarity_search(query, k=k)

vector_store_manager = VectorStoreManager()
