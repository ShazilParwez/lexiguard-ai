import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Compare from './pages/Compare';

import AppShell from './components/AppShell';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
          <Route path="/workspace/:id" element={<AppShell><Workspace /></AppShell>} />
          <Route path="/compare" element={<AppShell><Compare /></AppShell>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
