from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from app.config import settings
import os
import shutil

class VectorStoreManager:
    def __init__(self):
        self.persist_directory = "./chroma_db"
        if not os.path.exists(self.persist_directory):
            os.makedirs(self.persist_directory)

    def get_embeddings(self):
        api_key = settings.gemini_api_key
        model_name = f"models/{settings.gemini_embedding_model}" if not settings.gemini_embedding_model.startswith("models/") else settings.gemini_embedding_model
        
        if not api_key:
            api_key = "dummy"
            
        return GoogleGenerativeAIEmbeddings(model=model_name, google_api_key=api_key)

    def store_document(self, document_id: str, chunks: list):
        # Delete old collection if exists
        collection_dir = os.path.join(self.persist_directory, document_id)
        if os.path.exists(collection_dir):
            shutil.rmtree(collection_dir)
            
        docs = [Document(page_content=c["text"], metadata=c["metadata"]) for c in chunks]
        Chroma.from_documents(
            documents=docs,
            embedding=self.get_embeddings(),
            persist_directory=collection_dir
        )

    def retrieve(self, document_id: str, query: str, k: int = 4):
        collection_dir = os.path.join(self.persist_directory, document_id)
        if not os.path.exists(collection_dir):
            return []
        
        vectorstore = Chroma(
            persist_directory=collection_dir,
            embedding_function=self.get_embeddings()
        )
        return vectorstore.similarity_search(query, k=k)

vector_store_manager = VectorStoreManager()
