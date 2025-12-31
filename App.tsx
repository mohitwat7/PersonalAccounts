
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DataEntry from './components/DataEntry';
import Dashboard from './components/Dashboard';
import { Transaction } from './types';
import { LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'entry' | 'dashboard'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mython_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mython_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const reorderTransactions = (index: number, direction: 'up' | 'down') => {
    setTransactions(prev => {
      const newTransactions = [...prev];
      if (direction === 'up' && index > 0) {
        [newTransactions[index - 1], newTransactions[index]] = [newTransactions[index], newTransactions[index - 1]];
      } else if (direction === 'down' && index < newTransactions.length - 1) {
        [newTransactions[index + 1], newTransactions[index]] = [newTransactions[index], newTransactions[index + 1]];
      }
      return newTransactions;
    });
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Top Navigation Bar (Integrated into Glass Style) */}
      <div className="flex gap-4 mb-6 z-10">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full glass-panel transition-all ${activeTab === 'dashboard' ? 'bg-blue-600/40 border-blue-400' : 'hover:bg-white/5'}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('entry')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full glass-panel transition-all ${activeTab === 'entry' ? 'bg-blue-600/40 border-blue-400' : 'hover:bg-white/5'}`}
        >
          <PlusCircle size={18} />
          <span>Add Data</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-2 rounded-full glass-panel hover:bg-red-500/20 hover:border-red-400 transition-all"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
      
      <div className="w-full max-w-7xl h-[85vh] overflow-y-auto">
        {activeTab === 'entry' ? (
          <DataEntry 
            onAddTransaction={addTransaction} 
            transactions={transactions} 
            onDeleteTransaction={deleteTransaction}
            onReorderTransactions={reorderTransactions}
          />
        ) : (
          <Dashboard transactions={transactions} onDeleteTransaction={deleteTransaction} />
        )}
      </div>
    </div>
  );
};

export default App;
