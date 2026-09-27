import os
import fitz
import docx
from typing import List, Dict, Any

class DocumentParser:
    @staticmethod
    def parse_txt(file_path: str) -> List[Dict[str, Any]]:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
        return [{"page_number": 1, "text": text}]

    @staticmethod
    def parse_docx(file_path: str) -> List[Dict[str, Any]]:
        doc = docx.Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        # DOCX page extraction is hard without rendering, we'll treat it as 1 page or split by arbitrary length
        return [{"page_number": 1, "text": text}]

    @staticmethod
    def parse_pdf(file_path: str) -> List[Dict[str, Any]]:
        pages = []
        doc = fitz.open(file_path)
        for i in range(len(doc)):
            page = doc[i]
            text = page.get_text("text")
            pages.append({"page_number": i + 1, "text": text if text else ""})
        doc.close()
        return pages

    @staticmethod
    def parse_document(file_path: str, filename: str) -> List[Dict[str, Any]]:
        ext = os.path.splitext(filename)[1].lower()
        if ext == ".pdf":
            return DocumentParser.parse_pdf(file_path)
        elif ext == ".docx":
            return DocumentParser.parse_docx(file_path)
        elif ext == ".txt":
            return DocumentParser.parse_txt(file_path)
        else:
            raise ValueError(f"Unsupported file extension: {ext}")
