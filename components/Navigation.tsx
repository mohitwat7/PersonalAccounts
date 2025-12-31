
import React from 'react';
import { LayoutDashboard, PlusCircle, LogOut, Wallet } from 'lucide-react';

interface NavigationProps {
  activeTab: 'entry' | 'dashboard';
  setActiveTab: (tab: 'entry' | 'dashboard') => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <>
      {/* Sidebar for Desktop */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Wallet size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Mython</span>
        </div>

        <div className="flex-1 px-4 py-8 space-y-2">
          <button
            onClick={() => setActiveTab('entry')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === 'entry' ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm ring-1 ring-blue-100' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <PlusCircle size={20} />
            Data Entry
          </button>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm ring-1 ring-blue-100' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-around z-50">
        <button
          onClick={() => setActiveTab('entry')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'entry' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <PlusCircle size={24} />
          <span className="text-[10px] font-semibold uppercase">Add</span>
        </button>
        
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center -mt-8 shadow-lg ring-4 ring-slate-50">
          <Wallet size={24} />
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-semibold uppercase">Stats</span>
        </button>
      </nav>
    </>
  );
};

export default Navigation;
