import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { DocumentOverview, DocumentSummary, FindingsResult, ActionPlan } from '../types';
import { Loader2, FileText, AlertTriangle, HelpCircle, CheckSquare, Search, ZoomIn, ZoomOut, Maximize, AlertCircle } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import clsx from 'clsx';
import ChatInterface from '../components/ChatInterface';

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  
  const [overview, setOverview] = useState<DocumentOverview | null>(null);
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const [findings, setFindings] = useState<FindingsResult | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [documentContent, setDocumentContent] = useState<{document_id: string, filename: string, pages: any[]} | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!id) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const [o, s, f, a, docData] = await Promise.all([
          api.getOverview(id),
          api.getSummary(id),
          api.getFindings(id),
          api.getActionPlan(id),
          api.getDocument(id).catch(() => null)
        ]);
        setOverview(o);
        setSummary(s);
        setFindings(f);
        setActionPlan(a);
        setDocumentContent(docData);
      } catch (e) {
        console.error("Failed to load document analysis", e);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#FBFBFA]">
        <div className="relative mb-6">
           <div className="absolute inset-0 bg-indigo-200 blur-xl opacity-50 rounded-full animate-pulse"></div>
           <Loader2 className="h-10 w-10 text-indigo-600 animate-spin relative z-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing Document</h2>
        <p className="text-slate-500 font-medium">Extracting clauses and identifying key information...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500 bg-[#FBFBFA]">
      
      {/* Center: Document Viewer */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200/60 bg-slate-100/50">
        <div className="h-14 bg-white border-b border-slate-200/60 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
          <div className="flex items-center space-x-3">
             <div className="bg-indigo-50 p-1.5 rounded flex items-center justify-center">
                <FileText className="h-4 w-4 text-indigo-600" />
             </div>
             <span className="font-semibold text-slate-800 text-sm truncate max-w-[200px] md:max-w-md">
               {documentContent ? documentContent.filename : "Document Viewer"}
             </span>
             <span className="text-xs font-medium text-slate-400 border-l border-slate-200 pl-3 hidden sm:inline-block">
               {documentContent?.pages?.length || 0} pages
             </span>
          </div>
          <div className="flex items-center space-x-1">
             <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><ZoomOut className="h-4 w-4" /></button>
             <span className="text-xs font-medium text-slate-500 w-12 text-center">100%</span>
             <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><ZoomIn className="h-4 w-4" /></button>
             <div className="w-px h-4 bg-slate-200 mx-1"></div>
             <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Maximize className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center">
          <div className="bg-white max-w-3xl w-full shadow-md border border-slate-200/80 rounded-sm">
            {documentContent ? (
              <div className="py-12 px-10 md:px-16 text-slate-700 font-serif leading-relaxed text-[15px] space-y-12">
                {documentContent.pages.map((p, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-12 top-0 text-xs text-slate-300 font-sans font-medium select-none">{p.page_number}</div>
                    <div className="whitespace-pre-wrap break-words">{p.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium font-sans min-h-[500px]">
                Document Preview Not Available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: AI Insights */}
      <div className="w-full md:w-[380px] flex flex-col shrink-0 bg-white shadow-xl shadow-slate-200/20 z-20">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <Tabs.List className="flex overflow-x-auto border-b border-slate-200/60 bg-slate-50/50 shrink-0 hide-scrollbar px-2 pt-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'summary', label: 'Summary' },
              { id: 'findings', label: 'Attention Radar' },
              { id: 'questions', label: 'Q&A' },
              { id: 'action', label: 'Action Plan' }
            ].map((tab) => (
              <Tabs.Trigger 
                key={tab.id} 
                value={tab.id} 
                className={clsx(
                  "px-4 py-2.5 font-medium text-sm whitespace-nowrap transition-all outline-none rounded-t-lg mx-1 border-b-2",
                  activeTab === tab.id 
                    ? "border-indigo-600 text-indigo-700 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.02)]" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <div className="flex-1 overflow-auto bg-white p-5">
            <Tabs.Content value="overview" className="space-y-6 animate-in fade-in duration-300 outline-none">
              {overview && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#FBFBFA] p-4 rounded-xl border border-slate-200/60">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Type</div>
                      <div className="font-semibold text-slate-900 text-sm">{overview.document_type}</div>
                    </div>
                    <div className="bg-[#FBFBFA] p-4 rounded-xl border border-slate-200/60">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Length</div>
                      <div className="font-semibold text-slate-900 text-sm">{overview.approximate_length_pages} pages</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Parties Involved</h3>
                      <div className="bg-white border border-slate-200/60 rounded-xl divide-y divide-slate-100">
                        {overview.parties_involved?.length > 0 ? overview.parties_involved.map((p, i) => (
                          <div key={i} className="px-4 py-3 text-sm text-slate-700 font-medium">{p}</div>
                        )) : (
                          <div className="px-4 py-3 text-sm text-slate-400 italic">Not identified</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Dates</h3>
                      <div className="bg-white border border-slate-200/60 rounded-xl divide-y divide-slate-100">
                        {overview.key_dates?.length > 0 ? overview.key_dates.map((d, i) => (
                          <div key={i} className="px-4 py-3 text-sm text-slate-700 font-medium">{d}</div>
                        )) : (
                          <div className="px-4 py-3 text-sm text-slate-400 italic">No key dates found</div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Tabs.Content>

            <Tabs.Content value="summary" className="space-y-6 animate-in fade-in duration-300 outline-none">
               {summary && (
                 <>
                   <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
                     <h3 className="text-sm font-bold text-indigo-900 mb-2">In Simple English</h3>
                     <p className="text-sm text-indigo-900/80 leading-relaxed font-medium">{summary.simple_english}</p>
                   </div>
                   
                   <div>
                     <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center">
                       <CheckSquare className="w-4 h-4 text-emerald-500 mr-2" /> What You Are Agreeing To
                     </h3>
                     <ul className="space-y-2.5">
                       {summary.what_you_agree_to?.length > 0 ? summary.what_you_agree_to.map((s,i) => (
                         <li key={i} className="flex items-start text-sm text-slate-600 bg-[#FBFBFA] p-3 rounded-lg border border-slate-100">
                           {s}
                         </li>
                       )) : <li className="text-sm text-slate-400 italic">Nothing specific found.</li>}
                     </ul>
                   </div>

                   <div>
                     <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center">
                       <FileText className="w-4 h-4 text-blue-500 mr-2" /> Other Party's Obligations
                     </h3>
                     <ul className="space-y-2.5">
                       {summary.what_other_party_must_do?.length > 0 ? summary.what_other_party_must_do.map((s,i) => (
                         <li key={i} className="flex items-start text-sm text-slate-600 bg-[#FBFBFA] p-3 rounded-lg border border-slate-100">
                           {s}
                         </li>
                       )) : <li className="text-sm text-slate-400 italic">Nothing specific found.</li>}
                     </ul>
                   </div>
                 </>
               )}
            </Tabs.Content>

            <Tabs.Content value="findings" className="space-y-4 animate-in fade-in duration-300 outline-none">
              {findings && (
                <>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Attention Radar</h3>
                    <p className="text-xs text-slate-500 font-medium">Areas of the document worth a closer look.</p>
                  </div>
                  
                  {findings.attention_findings?.length > 0 ? findings.attention_findings.map((f, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors group">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            {f.category.toLowerCase().includes('risk') || f.category.toLowerCase().includes('warning') 
                              ? <AlertCircle className="w-4 h-4 text-red-500 mr-2 shrink-0" />
                              : <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 shrink-0" />}
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{f.title}</h4>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">{f.why_it_matters}</p>
                        
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3 relative">
                           <div className="absolute top-0 left-0 w-1 h-full bg-slate-300 rounded-l-lg"></div>
                           <p className="text-[11px] text-slate-500 italic pl-1 font-serif line-clamp-3">"{f.clause}"</p>
                        </div>
                        
                        {f.source?.page && (
                           <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                             <div className="flex items-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                               <FileText className="w-3 h-3 mr-1" />
                               Page {f.source.page} {f.source.section && `• Sec ${f.source.section}`}
                             </div>
                           </div>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
                      <CheckSquare className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-600">No major attention items found.</p>
                    </div>
                  )}
                </>
              )}
            </Tabs.Content>

            <Tabs.Content value="questions" className="h-full animate-in fade-in duration-300 outline-none">
              <ChatInterface documentId={id!} />
            </Tabs.Content>

            <Tabs.Content value="action" className="space-y-6 animate-in fade-in duration-300 outline-none">
              {actionPlan && (
                <>
                  <h3 className="text-lg font-bold text-slate-900">What to Review Next</h3>
                  
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center">
                      <HelpCircle className="w-4 h-4 text-indigo-500 mr-2"/>
                      Questions to Clarify
                    </h4>
                    <div className="space-y-2">
                      {actionPlan.questions_to_clarify?.length > 0 ? actionPlan.questions_to_clarify.map((q,i) => (
                        <label key={i} className="flex items-start cursor-pointer group bg-white border border-slate-200 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                          <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 shrink-0" />
                          <span className="ml-3 text-sm text-slate-700 font-medium group-hover:text-slate-900">{q}</span>
                        </label>
                      )) : <p className="text-sm text-slate-400 italic">None identified.</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2"/>
                      Questions to Ask a Lawyer
                    </h4>
                    <div className="space-y-2">
                      {actionPlan.questions_for_professional?.length > 0 ? actionPlan.questions_for_professional.map((q,i) => (
                        <label key={i} className="flex items-start cursor-pointer group bg-white border border-slate-200 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                          <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 shrink-0" />
                          <span className="ml-3 text-sm text-slate-700 font-medium group-hover:text-slate-900">{q}</span>
                        </label>
                      )) : <p className="text-sm text-slate-400 italic">None identified.</p>}
                    </div>
                  </div>
                </>
              )}
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}
