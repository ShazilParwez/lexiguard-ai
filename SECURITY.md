# Security Policy for LexiGuard

## Overview
LexiGuard is an informational tool and handles user documents which may contain sensitive legal and personal information. Security and privacy are paramount.

## Current Hackathon State
This repository is currently designed for local execution and demonstration purposes.
*   **Storage**: Documents and metadata are stored in-memory and on the local filesystem during the application runtime. They are wiped upon server restart.
*   **LLM API**: Calls are made directly to Google GenAI APIs using the key provided in the `.env` file. Data privacy relies on the terms of service of the Google Gemini API (ensure the API tier used does not train on user data).
*   **Auth**: No user authentication is currently implemented.

## Production Requirements

Before deploying LexiGuard to a public environment, the following security controls MUST be implemented:

### 1. Document Storage & Encryption
*   **At Rest**: All uploaded documents must be encrypted at rest in a secure object store (e.g., AWS S3 with SSE-KMS, Google Cloud Storage).
*   **In Transit**: Enforce TLS 1.2+ for all client-server communications.
*   **Data Lifecycle**: Implement automated expiration and deletion of user documents (e.g., delete automatically after 30 days).

### 2. Authentication & Authorization
*   Implement secure OAuth2/OIDC based authentication (e.g., Clerk, Firebase Auth, or Auth0).
*   Ensure rigorous tenant isolation (users can only access documents they own or have been explicitly granted access to).

### 3. LLM Data Privacy
*   **Enterprise Tier**: Use an enterprise-grade LLM provider tier that guarantees zero data retention and no model training on customer data.
*   **PII Scrubbing**: Implement intermediate filtering to scrub sensitive PII (Social Security Numbers, Credit Cards) before routing document context to the LLM.

### 4. Application Security
*   **Rate Limiting**: Implement strict rate limits to prevent DoS attacks and LLM API cost exploitation.
*   **Input Validation**: Enforce strict file-type and file-size validation during document upload (only allow `.pdf`, `.docx`, `.txt` and block malicious payloads).
*   **Dependency Scanning**: Integrate automated vulnerability scanning for both frontend (npm audit) and backend (pip audit) dependencies.
