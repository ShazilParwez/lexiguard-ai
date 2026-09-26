# LexiGuard Architecture

## Overview
LexiGuard is a full-stack, AI-powered legal document analysis tool designed for ordinary users to better understand their contracts. It leverages a modern frontend, a robust backend API, and deep integrations with Google's GenAI ecosystem.

## System Components

### 1. Frontend (React + Vite + Tailwind CSS v4)
*   **Architecture**: Single Page Application (SPA) built with React and Vite.
*   **Routing**: Client-side routing managed via React Router (`AppShell`, `Dashboard`, `Workspace`, `Compare`, `Landing`).
*   **Styling**: Built with modern Tailwind CSS v4. Features a premium, legal-tech aesthetic inspired by modern SaaS applications (dark navy, deep indigo, off-white, and minimal glassmorphism).
*   **State Management**: React Hooks (`useState`, `useEffect`) handle local UI state and coordinate asynchronous operations.

### 2. Backend (FastAPI + Python)
*   **Architecture**: RESTful API built on FastAPI.
*   **Concurrency**: Uses synchronous route handlers coupled with FastAPI's thread pool to prevent blocking the async event loop during long-running GenAI SDK calls.
*   **Services Layer**:
    *   `document_processor.py`: Uses PyMuPDF (fitz) to extract text and structure from uploaded PDFs and DOCX files.
    *   `gemini_service.py`: Orchestrates structured JSON interactions with the `google-genai` SDK using `gemini-2.5-flash`. Implements resilient exponential backoff for quota management.
    *   `retrieval.py`: Handles local chunking, embedding (`langchain-google-genai`), and in-memory vector storage for Retrieval-Augmented Generation (RAG) capabilities in the Q&A section.

### 3. AI Integrations
*   **Model Engine**: Uses `gemini-2.5-flash` as the core reasoning engine.
*   **Capabilities**:
    *   **Summarization**: Translates complex clauses into Plain English.
    *   **Attention Radar**: Detects risk vectors, automatic renewals, and hidden obligations.
    *   **Document Comparison**: Compares structural changes between two document versions and analyzes the semantic impact of the differences.

## Future Production Considerations
*   **Database**: Migrate from in-memory dictionary storage to PostgreSQL (structured data) and an S3-compatible blob storage (document persistence).
*   **Vector Database**: Migrate the in-memory LangChain VectorStore to Pinecone, Weaviate, or pgvector for scalable RAG.
*   **Authentication**: Integrate Clerk, Auth0, or Firebase Auth.
