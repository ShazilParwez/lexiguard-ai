from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List, Dict, Any

class Chunker:
    @staticmethod
    def chunk_document(pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        chunks = []
        for page in pages:
            page_num = page["page_number"]
            page_text = page["text"]
            if not page_text.strip():
                continue
            
            page_chunks = text_splitter.split_text(page_text)
            for chunk in page_chunks:
                chunks.append({
                    "page_number": page_num,
                    "text": chunk,
                    "metadata": {
                        "page": page_num
                    }
                })
        return chunks
