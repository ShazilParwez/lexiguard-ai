# Testing LexiGuard

This guide outlines the testing strategies for the LexiGuard application to ensure reliability, performance, and accuracy in document analysis.

## 1. Unit Testing
Unit tests should cover isolated components and utility functions.

*   **Backend (Python/pytest)**
    *   **Document Parsers**: Test `PyMuPDF` and `python-docx` extraction logic with small, controlled fixture files to ensure consistent text output.
    *   **Prompt Construction**: Ensure the Jinja/string prompt templates successfully inject document variables without exceeding context window constraints.
    *   **Error Handling**: Mock the `google-genai` client to simulate `429 Too Many Requests` and `503 Service Unavailable` to verify the exponential backoff and retry mechanisms in `GeminiService`.

*   **Frontend (React Testing Library / Jest)**
    *   **Component Rendering**: Ensure the Workspace, Compare, and Dashboard components render without errors.
    *   **State Updates**: Verify that the file upload hooks appropriately manage the loading states and display error messages on failure.

## 2. Integration Testing
Integration tests ensure that the frontend, backend, and external LLM services work together harmoniously.

*   **API Route Tests**: Use `TestClient` from FastAPI to send dummy documents to `/api/documents/upload` and verify the document ID is generated.
*   **Pipeline Verification**: Mock the Gemini API response to test the entire flow from `upload -> retrieve overview -> get summary` in a single automated test run.
*   **Vector Search**: Test the `retrieval.py` logic to ensure that an injected query successfully retrieves the semantically nearest chunk from the LangChain vector store.

## 3. End-to-End (E2E) Testing
E2E testing evaluates the complete user journey from the browser.

*   **Framework**: Use Playwright or Cypress.
*   **Critical Paths**:
    1.  User lands on the application and navigates to the Dashboard.
    2.  User uploads a sample legal PDF.
    3.  User navigates to the Document Workspace.
    4.  User interacts with the Chat interface to ask a question.
    5.  User uploads two versions of a document to the Compare page.

## 4. LLM Evaluation (Evals)
Testing LLM outputs requires a different approach than standard deterministic testing.

*   **Golden Dataset**: Maintain a set of 10-20 diverse legal documents (NDAs, Terms of Service, Lease Agreements) with human-annotated summaries and known risks.
*   **Automated Scoring**: Use an LLM-as-a-judge framework to score LexiGuard's outputs against the Golden Dataset on metrics such as:
    *   **Faithfulness**: Are the plain English summaries grounded in the original text? (No hallucinations).
    *   **Recall**: Did the Attention Radar successfully flag the known risky clauses in the golden dataset?
    *   **Clarity**: Is the Flesch-Kincaid readability score appropriate for laypersons?
