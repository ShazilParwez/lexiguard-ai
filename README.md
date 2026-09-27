# LexiGuard

"Understand the fine print. Prepare with confidence."

## 1. Product Overview
LexiGuard is an AI-powered legal document intelligence platform designed to help non-lawyers understand complex legal documents, compare agreements, detect important clauses, and prepare better questions for legal professionals.

## 2. Problem Statement
Legal documents are often difficult for ordinary people to understand because of complex terminology, long clauses, hidden obligations, and inconsistent terms. LexiGuard makes this information accessible and understandable.

## 3. Features
*   **Smart Document Upload:** Drag and drop support for PDF, DOCX, and TXT.
*   **Plain-Language Summary:** Extracts core obligations, dates, payments, and restrictions.
*   **Clause Intelligence:** Highlights and categorizes important clauses with plain-English explanations.
*   **Attention Radar:** Detects patterns like unlimited liability, automatic renewals, and unusual restrictions.
*   **Contract Comparison Engine:** Upload two documents to see what changed, was added, or removed.
*   **Grounded Q&A:** Ask questions about the document and get answers cited directly from the text.
*   **Action Plan Generator:** Provides practical next steps and questions to ask a lawyer.

## 4. Architecture
See `ARCHITECTURE.md` for a detailed breakdown of the GenAI pipeline and system components.

## 5. Tech Stack
*   **Frontend:** React, Vite, TypeScript, Tailwind CSS, Radix UI, Lucide React
*   **Backend:** Python, FastAPI, Uvicorn, Pydantic
*   **GenAI:** Google Gemini (gemini-2.5-flash), LangChain, Chroma DB
*   **Document Processing:** PyMuPDF, python-docx

## 6. RAG Pipeline
LexiGuard uses a Retrieval-Augmented Generation (RAG) architecture for its grounded Q&A feature. Documents are chunked and embedded using Google Generative AI embeddings and stored locally in Chroma DB.

## 7. AI Safety Design
LexiGuard includes application-wide disclaimers and strictly instructs the LLM not to provide legal advice. All answers are grounded in the provided document, and uncertainty is clearly communicated.

## 8. Privacy Approach
Documents are processed temporarily and stored in-memory or in local vector DBs for the duration of the session. The API key is securely handled in the backend.

## 9. Local Setup
1.  Clone the repository.
2.  Follow backend and frontend setup instructions below.

## 10. Environment Variables
Create a `.env` file in the `backend` directory based on `.env.example`:
```
GEMINI_API_KEY=your_api_key_here
MAX_FILE_SIZE_MB=10
```

## 11. Running Frontend
```bash
cd frontend
npm install
npm run dev
```

## 12. Running Backend
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
pip install -r requirements.txt # (or install dependencies manually as per setup script)
uvicorn app.main:app --reload
```

## 13. Testing
See `TESTING.md` for testing strategies.

## 14. Demo Instructions
1.  Upload a document (e.g., sample PDF) on the Dashboard.
2.  Wait for processing.
3.  Review the Overview and Summary tabs.
4.  Check the Attention Radar for highlighted clauses.
5.  Use the Q&A tab to ask questions (e.g., "What is the notice period?").
6.  Use the Compare tab to upload an original and revised document.

## 15. Deployment
The backend can be deployed to services like Google Cloud Run or Heroku. The frontend can be hosted on Vercel or Netlify.

## 16. Limitations
*   LexiGuard is an informational tool, not a substitute for a lawyer.
*   OCR fallback for highly distorted scanned PDFs is limited.
*   In-memory storage is not suitable for production scale without a persistent database like Firestore or Postgres.

## 17. Future Improvements
*   Add user authentication and persistent document storage (opt-in).
*   Implement OCR for scanned PDFs.
*   Integrate a real vector database like Pinecone or Weaviate for scale.
