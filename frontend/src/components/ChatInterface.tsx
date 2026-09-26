import React, { useState } from 'react';
import { api } from '../services/api';
import type { QuestionAnswer } from '../types';
import { Send, Loader2, BookOpen, HelpCircle } from 'lucide-react';

export default function ChatInterface({ documentId }: { documentId: string }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{q: string, a?: QuestionAnswer, error?: string}>>([]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const currentQuery = query;
    setQuery('');
    
    const newEntry = { q: currentQuery };
    setHistory([...history, newEntry]);
    setLoading(true);
    
    try {
      const ans = await api.askQuestion(documentId, currentQuery);
      setHistory(prev => {
        const next = [...prev];
        next[next.length - 1].a = ans;
        return next;
      });
    } catch (err: any) {
      setHistory(prev => {
        const next = [...prev];
        next[next.length - 1].error = "Failed to get an answer. Please try again.";
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What can I be penalized for?",
    "When can I terminate?",
    "Who owns the IP?",
    "What happens if I miss a deadline?"
  ];

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-inner overflow-hidden">
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        {history.length === 0 && (
          <div className="text-center py-12 px-4 animate-in fade-in duration-700">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm border border-indigo-100/50">
               <HelpCircle className="text-indigo-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ask about this document</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8 font-medium">Get plain-English answers backed by direct quotes from the text.</p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setQuery(s)}
                  className="bg-white border border-indigo-100 text-indigo-700 px-4 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-50 hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {history.map((item, i) => (
          <div key={i} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-end">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-[85%] text-sm shadow-md font-medium">
                {item.q}
              </div>
            </div>
            
            {item.error && (
              <div className="flex justify-start">
                <div className="bg-red-50 text-red-700 border border-red-100 rounded-2xl rounded-tl-sm px-5 py-3 text-sm font-medium shadow-sm">
                  {item.error}
                </div>
              </div>
            )}
            
            {item.a && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm p-5 max-w-[90%] w-full shadow-md">
                  <div className="text-sm text-slate-800 font-medium mb-4 leading-relaxed">{item.a.answer}</div>
                  
                  <div className="bg-slate-50 border-l-4 border-indigo-300 p-4 text-xs text-slate-600 mb-3 rounded-r-lg italic">
                    <span className="font-bold uppercase tracking-wider block text-slate-400 mb-1.5 flex items-center"><BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-400"/> Evidence</span>
                    "{item.a.evidence}"
                  </div>
                  
                  {item.a.source?.page && (
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                      Source: Page {item.a.source.page} {item.a.source.section && `| Section ${item.a.source.section}`}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in zoom-in duration-300">
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center space-x-2">
               <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
               <span className="text-sm font-medium text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 md:p-6 bg-white/80 border-t border-slate-200/60 backdrop-blur-md">
        <form onSubmit={handleAsk} className="flex gap-3 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about the document..."
            className="flex-1 bg-slate-50 rounded-xl border border-slate-200/80 px-5 py-3.5 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 text-sm font-medium transition-all shadow-inner"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="bg-indigo-600 text-white rounded-xl p-3 px-5 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
