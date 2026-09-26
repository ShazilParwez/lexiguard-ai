import { Link } from 'react-router-dom';
import { FileText, Scale, ArrowRight, CheckCircle2, UploadCloud, Eye, ListChecks } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] font-sans text-slate-900 selection:bg-indigo-100">
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">Lexi<span className="text-indigo-600">Guard</span></span>
          </div>
          <div>
            <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
          Understand the fine print.<br/>
          <span className="text-indigo-600">Prepare with confidence.</span>
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-500 leading-relaxed">
          LexiGuard uses AI to explain complex documents, surface important clauses, compare agreements, and help you prepare better questions for a legal professional.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/dashboard" className="px-8 py-3.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center text-lg shadow-sm">
            Analyze a Document
          </Link>
          <Link to="/compare" className="px-8 py-3.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center text-lg shadow-sm">
            Compare Documents
          </Link>
        </div>

        <div className="mt-8 flex justify-center">
          <p className="text-xs text-slate-400 font-medium max-w-sm flex items-center text-center">
            Informational assistance only. LexiGuard does not replace qualified legal advice.
          </p>
        </div>

        {/* Visual UI Preview */}
        <div className="mt-20 max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBFBFA] via-transparent to-transparent z-10 pointer-events-none h-full"></div>
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[500px] text-left">
            <div className="w-full md:w-1/2 p-8 border-r border-slate-100 bg-slate-50">
               <div className="h-6 w-3/4 bg-slate-200 rounded mb-4"></div>
               <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
               <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
               <div className="h-4 w-5/6 bg-slate-200 rounded mb-8"></div>
               <div className="h-4 w-full bg-indigo-100 rounded mb-2"></div>
               <div className="h-4 w-4/5 bg-indigo-100 rounded mb-2"></div>
               <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
            </div>
            <div className="w-full md:w-1/2 p-6 bg-white flex flex-col space-y-4">
               <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                     <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                     <span className="font-semibold text-sm text-slate-900">Automatic Renewal</span>
                  </div>
                  <p className="text-xs text-slate-500">Review this clause because the agreement renews automatically unless notice is provided before the stated deadline.</p>
               </div>
               <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                     <span className="font-semibold text-sm text-slate-900">Term Length</span>
                  </div>
                  <p className="text-xs text-slate-500">The agreement is valid for 12 months from the effective date.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 max-w-4xl mx-auto text-left">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {['Understand documents', 'Find important clauses', 'Compare versions', 'Ask grounded questions', 'Prepare for legal review'].map((feature, i) => (
              <div key={i} className="flex items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 mr-3 shrink-0" />
                <span className="font-medium text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-32 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-16">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: UploadCloud, title: '1. Upload', desc: 'Securely upload your document.' },
              { icon: FileText, title: '2. Understand', desc: 'Get plain-English summaries.' },
              { icon: Eye, title: '3. Review', desc: 'Spot important clauses.' },
              { icon: ListChecks, title: '4. Prepare', desc: 'Generate an action plan.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                  <step.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-32 pb-16">
          <Link to="/dashboard" className="px-10 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center text-lg shadow-md">
            Start Analyzing <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
