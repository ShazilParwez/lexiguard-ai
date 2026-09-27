import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const response = await api.uploadDocument(file);
      navigate(`/workspace/${response.document_id}`);
    } catch (err: any) {
      if (err.response?.status === 413) {
        setError("File is too large. Vercel serverless functions have a 4.5MB limit. Please upload a smaller file.");
      } else {
        setError(err.response?.data?.detail || "An error occurred during upload.");
      }
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Good evening, Shazil</h1>
        <p className="text-slate-500 mt-2 text-lg">Review a document, compare versions, or ask a question.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div 
          onClick={() => document.getElementById('file-upload')?.click()}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="text-indigo-600 w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 text-lg">Analyze Document</h3>
          <p className="text-slate-500 text-sm mt-1">Upload a contract or agreement for AI review.</p>
        </div>

        <div 
          onClick={() => navigate('/compare')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="text-indigo-600 w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 text-lg">Compare Documents</h3>
          <p className="text-slate-500 text-sm mt-1">See what changed between two versions.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group">
          <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="text-indigo-600 w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 text-lg">Ask LexiGuard</h3>
          <p className="text-slate-500 text-sm mt-1">Chat with our legal AI about any document.</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-3" />
          {error}
        </div>
      )}

      <div 
        className={`w-full border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 relative overflow-hidden
          ${isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept=".pdf,.docx,.txt"
          onChange={onFileChange}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center space-y-4 py-8">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
            <p className="text-lg font-semibold text-slate-900">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <Upload className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Drop your document here</h3>
            <p className="text-slate-500 mt-2 mb-6">or browse from your computer</p>
            <button 
              onClick={() => document.getElementById('file-upload')?.click()}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              Browse Files
            </button>
            <p className="text-xs text-slate-400 mt-6 font-medium">Supported: PDF · DOCX · TXT (Max 4.5 MB)</p>
          </div>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Documents</h2>
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {['Employment Agreement', 'Freelance Contract', 'Rental Agreement'].map((doc, i) => (
              <div key={doc} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center">
                  <div className="bg-indigo-50 p-2.5 rounded-lg mr-4">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{doc}</h4>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <span className="font-medium">PDF · {Math.floor(Math.random() * 10) + 2} pages</span>
                      <span className="mx-2">•</span>
                      <span className="text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded-md flex items-center">
                        {Math.floor(Math.random() * 5) + 1} items to review
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end w-36 shrink-0 text-sm text-slate-400">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span className="w-24 text-right">
                    {i === 0 ? '2 minutes ago' : i === 1 ? '1 hour ago' : 'Yesterday'}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-600 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
