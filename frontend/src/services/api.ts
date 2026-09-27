import axios from 'axios';
import type { UploadResponse, DocumentOverview, DocumentSummary, QuestionAnswer, ActionPlan, ComparisonResult, FindingsResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  uploadDocument: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/documents/upload`, formData);
    // Cache the document so we can retrieve it even after navigation
    sessionStorage.setItem(`doc_${response.data.document_id}`, JSON.stringify(response.data));
    return response.data;
  },
  
  getDocument: async (documentId: string): Promise<{document_id: string, filename: string, pages: any[], full_text?: string}> => {
    // We get the document from sessionStorage because the backend is stateless
    const cached = sessionStorage.getItem(`doc_${documentId}`);
    if (cached) {
      return JSON.parse(cached);
    }
    throw new Error("Document not found in session cache. Please upload again.");
  },
  
  getOverview: async (documentId: string, fullText: string): Promise<DocumentOverview> => {
    const response = await axios.post(`${API_URL}/documents/${documentId}/analyze`, { full_text: fullText });
    return response.data;
  },
  
  getSummary: async (documentId: string, fullText: string): Promise<DocumentSummary> => {
    const response = await axios.post(`${API_URL}/documents/${documentId}/summary`, { full_text: fullText });
    return response.data;
  },
  
  getFindings: async (documentId: string, fullText: string): Promise<FindingsResult> => {
    const response = await axios.post(`${API_URL}/documents/${documentId}/findings`, { full_text: fullText });
    return response.data;
  },
  
  askQuestion: async (documentId: string, question: string, fullText: string): Promise<QuestionAnswer> => {
    const response = await axios.post(`${API_URL}/documents/${documentId}/ask`, { question, full_text: fullText });
    return response.data;
  },
  
  compareDocuments: async (textA: string, textB: string): Promise<ComparisonResult> => {
    const response = await axios.post(`${API_URL}/compare`, { doc_a_text: textA, doc_b_text: textB });
    return response.data;
  },
  
  getActionPlan: async (documentId: string, fullText: string): Promise<ActionPlan> => {
    const response = await axios.post(`${API_URL}/documents/${documentId}/action-plan`, { full_text: fullText });
    return response.data;
  },
  
  checkHealth: async (): Promise<{ status: string; ai_connected: boolean }> => {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  }
};
