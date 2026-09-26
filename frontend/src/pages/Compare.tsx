import { useState } from 'react';
import { api } from '../services/api';
import type { ComparisonResult } from '../types';
import { ArrowLeft, Scale, Upload, Loader2, ArrowRight, FileText, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export default function Compare() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!fileA || !fileB) return;
    setLoading(true);
    setError('');
    
    try {
      // Upload both
      const docA = await api.uploadDocument(fileA);
      const docB = await api.uploadDocument(fileB);
      
      // Compare
      const res = await api.compareDocuments(docA.document_id, docB.document_id);
      setResult(res);
    } catch (err) {
      setError('Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-6xl mx-auto w-full p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => setResult(null)} className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> New Comparison
            </button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Comparison Results</h1>
          </div>
          <div className="flex items-center space-x-3 text-sm">
             <div className="flex items-center text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
               <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
               {result.changes?.filter(c => c.category === 'Added').length || 0} Added
             </div>
             <div className="flex items-center text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
               <div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div>
               {result.changes?.filter(c => c.category === 'Removed').length || 0} Removed
             </div>
             <div className="flex items-center text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
               <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
               {result.changes?.filter(c => c.category === 'Modified' || c.category === 'Changed').length || 0} Changed
             </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm mb-8 overflow-hidden">
          <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200/60 flex items-center">
            <Scale className="text-indigo-600 h-5 w-5 mr-3" />
            <h2 className="font-semibold text-slate-800">Executive Summary</h2>
          </div>
          <div className="p-6 grid md:grid-cols-3 gap-6">
            <div className="bg-[#FBFBFA] p-5 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                <div className="bg-emerald-100 text-emerald-600 p-1 rounded mr-2"><ArrowRight className="w-3 h-3" /></div> Added
              </h3>
              <ul className="space-y-2">
                {result.executive_summary?.added?.map((a,i) => <li key={i} className="text-sm text-slate-600">{a}</li>)}
              </ul>
            </div>
            <div className="bg-[#FBFBFA] p-5 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                <div className="bg-rose-100 text-rose-600 p-1 rounded mr-2"><ArrowLeft className="w-3 h-3" /></div> Removed
              </h3>
              <ul className="space-y-2">
                {result.executive_summary?.removed?.map((r,i) => <li key={i} className="text-sm text-slate-600">{r}</li>)}
              </ul>
            </div>
            <div className="bg-[#FBFBFA] p-5 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                <div className="bg-amber-100 text-amber-600 p-1 rounded mr-2"><AlertTriangle className="w-3 h-3" /></div> Changed
              </h3>
              <ul className="space-y-2">
                {result.executive_summary?.changed?.map((c,i) => <li key={i} className="text-sm text-slate-600">{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 px-1">{result.changes?.length || 0} Changes Detected</h2>
          <div className="space-y-4">
            {result.changes?.map((change, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                
                {/* Meta info column */}
                <div className="md:w-64 bg-slate-50/50 p-5 md:border-r border-slate-200 border-b md:border-b-0 shrink-0">
                  <div className="flex flex-col h-full">
                    <div className="mb-auto">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={clsx(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                          change.category === 'Added' ? "bg-emerald-100 text-emerald-700" :
                          change.category === 'Removed' ? "bg-rose-100 text-rose-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {change.category}
                        </span>
                        <span className={clsx(
                          "px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-widest",
                          change.significance === 'High' ? "border-red-200 text-red-600" :
                          change.significance === 'Medium' ? "border-amber-200 text-amber-600" :
                          "border-slate-200 text-slate-500"
                        )}>
                          {change.significance} Impact
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{change.change_summary}</p>
                    </div>
                  </div>
                </div>
                
                {/* Diff Viewer */}
                <div className="flex-1 p-0 flex flex-col md:flex-row min-w-0">
                  <div className="flex-1 p-5 md:border-r border-slate-100 bg-rose-50/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                      Original <span className="bg-rose-100 text-rose-700 ml-2 px-1.5 rounded">-</span>
                    </div>
                    <p className="text-[13px] font-serif text-slate-600 bg-rose-50/50 p-3 rounded border border-rose-100 whitespace-pre-wrap leading-relaxed line-through decoration-rose-300">
                      {change.document_a || <span className="italic text-slate-400 no-underline">Not present in original document</span>}
                    </p>
                  </div>
                  <div className="flex-1 p-5 bg-emerald-50/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                      Revised <span className="bg-emerald-100 text-emerald-700 ml-2 px-1.5 rounded">+</span>
                    </div>
                    <p className="text-[13px] font-serif text-slate-800 bg-emerald-50/50 p-3 rounded border border-emerald-100 whitespace-pre-wrap leading-relaxed">
                      {change.document_b || <span className="italic text-slate-400">Removed in revised document</span>}
                    </p>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col items-center animate-in fade-in duration-500 mt-10">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/60 mb-6">
         <Scale className="h-10 w-10 text-indigo-600" />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 text-center">Compare Agreements</h1>
      <p className="text-slate-500 text-base mb-12 text-center max-w-xl">
        Upload an original contract and a revised version to instantly see what changed, what was added, and what was removed.
      </p>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-sm w-full max-w-2xl text-center text-sm font-medium flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 mr-2" /> {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl relative">
        <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
           <div className="bg-[#FBFBFA] rounded-full p-2 border border-slate-200 text-slate-400">
             <ArrowRight className="w-5 h-5" />
           </div>
        </div>

        {/* Doc A */}
        <div className="flex flex-col bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center">
              <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded mr-3 text-xs tracking-wider">A</span> Original
            </h3>
          </div>
          {fileA ? (
            <div className="flex flex-col items-center justify-center h-48 bg-[#FBFBFA] rounded-xl border border-slate-200">
              <FileText className="h-10 w-10 text-slate-400 mb-3" />
              <div className="text-slate-700 font-medium text-sm mb-3 truncate px-4 max-w-full">{fileA.name}</div>
              <button onClick={() => setFileA(null)} className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-1.5 rounded-full transition-colors">Remove File</button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 bg-[#FBFBFA] rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all group">
              <div className="bg-white p-2.5 rounded-lg shadow-sm border border-slate-100 mb-3 group-hover:scale-110 transition-transform">
                <Upload className="h-5 w-5 text-indigo-500" />
              </div>
              <span className="text-sm font-medium text-slate-600">Select Original Document</span>
              <span className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">PDF, DOCX, TXT</span>
              <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => { if(e.target.files) setFileA(e.target.files[0]) }} />
            </label>
          )}
        </div>

        {/* Doc B */}
        <div className="flex flex-col bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center">
              <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded mr-3 text-xs tracking-wider">B</span> Revised
            </h3>
          </div>
          {fileB ? (
            <div className="flex flex-col items-center justify-center h-48 bg-[#FBFBFA] rounded-xl border border-slate-200">
              <FileText className="h-10 w-10 text-indigo-400 mb-3" />
              <div className="text-slate-700 font-medium text-sm mb-3 truncate px-4 max-w-full">{fileB.name}</div>
              <button onClick={() => setFileB(null)} className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-1.5 rounded-full transition-colors">Remove File</button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 bg-[#FBFBFA] rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all group">
               <div className="bg-white p-2.5 rounded-lg shadow-sm border border-slate-100 mb-3 group-hover:scale-110 transition-transform">
                <Upload className="h-5 w-5 text-indigo-500" />
              </div>
              <span className="text-sm font-medium text-slate-600">Select Revised Document</span>
              <span className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">PDF, DOCX, TXT</span>
              <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => { if(e.target.files) setFileB(e.target.files[0]) }} />
            </label>
          )}
        </div>
      </div>

      <button 
        onClick={handleCompare}
        disabled={!fileA || !fileB || loading}
        className="mt-12 px-8 py-3 bg-indigo-600 text-white font-medium text-base rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center shadow-sm"
      >
        {loading ? (
          <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Analyzing Differences...</>
        ) : (
          <><Scale className="mr-2 h-5 w-5" /> Compare Documents</>
        )}
      </button>
    </div>
  );
}
