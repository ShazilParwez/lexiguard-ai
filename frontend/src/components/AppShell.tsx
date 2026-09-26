import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Scale, 
  MessageSquare, 
  Search, 
  Settings, 
  User, 
  HelpCircle, 
  ShieldAlert,
  Bell,
  Scale as LogoIcon
} from 'lucide-react';
import clsx from 'clsx';
import StatusBadge from './StatusBadge';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/workspace');

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: FileText, label: 'Documents', to: '/documents' },
    { icon: Scale, label: 'Compare', to: '/compare' },
    { icon: MessageSquare, label: 'Ask LexiGuard', to: '/ask' },
    { icon: ShieldAlert, label: 'Findings', to: '/findings' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  const bottomNavItems = [
    { icon: User, label: 'Shazil Parwez' },
    { icon: HelpCircle, label: 'Help' },
    { icon: ShieldAlert, label: 'Privacy' },
  ];

  return (
    <div className="flex h-screen bg-[#FBFBFA] font-sans text-slate-900 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-slate-200/60 bg-white/50 backdrop-blur-xl flex flex-col flex-shrink-0 z-10 hidden md:flex">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <LogoIcon className="h-6 w-6 text-indigo-600 mr-2.5" />
          <span className="text-xl font-bold tracking-tight text-slate-900">Lexi<span className="text-indigo-600">Guard</span></span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to + '/'));
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={(e) => {
                  if (item.to !== '/dashboard' && item.to !== '/compare') {
                    e.preventDefault();
                  }
                }}
                className={clsx(
                  "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={clsx("h-5 w-5 mr-3", "text-current opacity-80 group-hover:opacity-100")} />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Sidebar */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          {bottomNavItems.map((item) => (
            <button key={item.label} className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <item.icon className="h-5 w-5 mr-3 opacity-70" />
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (Hide on Workspace if we want custom topbar there, but instructions say "TOP BAR: current page/breadcrumb...") */}
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-sm font-semibold text-slate-700 tracking-wide capitalize">
              {location.pathname === '/dashboard' ? 'Dashboard' : 
               location.pathname.startsWith('/workspace') ? 'Document Workspace' : 
               location.pathname === '/compare' ? 'Compare Documents' : ''}
            </h1>
          </div>
          
          <div className="flex items-center space-x-5">
            <div className="hidden lg:flex items-center bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-sm">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search documents..." className="bg-transparent border-none outline-none text-slate-700 w-48 placeholder:text-slate-400" />
            </div>
            <StatusBadge />
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-white cursor-pointer">
              SP
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[#FBFBFA]">
          {children}
        </main>
      </div>
    </div>
  );
}
