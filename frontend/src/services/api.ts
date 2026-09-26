import axios from 'axios';
import type { UploadResponse, DocumentOverview, DocumentSummary, QuestionAnswer, ActionPlan, ComparisonResult, FindingsResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  uploadDocument: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/documents/upload`, formData);
    return response.data;
  },
  
  getDocument: async (documentId: string): Promise<{document_id: string, filename: string, pages: any[]}> => {
    const response = await axios.get(`${API_URL}/documents/${documentId}`);
    return response.data;
  },
  
  getOverview: async (documentId: string): Promise<DocumentOverview> => {
    const response = await axios.post(`${API_URL}/documents/${documentId}/analyze`);
    return response.data;
  },
  
  getSummary: async (documentId: string): Promise<DocumentSummary> => {
    const response = await axios.get(`${API_URL}/documents/${documentId}/summary`);
    return response.data;
  },
  
  getFindings: async (documentId: string): Promise<FindingsResult> => {
    const response = await axios.get(`${API_URL}/documents/${documentId}/findings`);
    return response.data;
  },
  
  askQuestion: async (documentId: string, question: string): Promise<QuestionAnswer> => {
    const response = await axios.post(`${API_URL}/documents/${documentId}/ask`, { question });
    return response.data;
  },
  
  compareDocuments: async (docAId: string, docBId: string): Promise<ComparisonResult> => {
    const response = await axios.post(`${API_URL}/compare`, { doc_a_id: docAId, doc_b_id: docBId });
    return response.data;
  },
  
  getActionPlan: async (documentId: string): Promise<ActionPlan> => {
    const response = await axios.get(`${API_URL}/documents/${documentId}/action-plan`);
    return response.data;
  },
  
  checkHealth: async (): Promise<{ status: string; ai_connected: boolean }> => {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  }
};
