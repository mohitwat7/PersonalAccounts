
import React, { useState } from 'react';
import { Calendar, IndianRupee, User, Trash2, Tag, ArrowUp, ArrowDown } from 'lucide-react';
import { Transaction, PaymentMode, TransactionType } from '../types';

interface DataEntryProps {
  onAddTransaction: (t: Transaction) => void;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onReorderTransactions?: (index: number, direction: 'up' | 'down') => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DataEntry: React.FC<DataEntryProps> = ({ 
  onAddTransaction, 
  transactions, 
  onDeleteTransaction,
  onReorderTransactions 
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [particulars, setParticulars] = useState('');
  const [mode, setMode] = useState<PaymentMode>('CASH');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    if (type === 'EXPENSE' && !particulars) return;

    let finalDate = date;
    // For income, we use the 1st of the selected month in the current year
    if (type === 'INCOME') {
      const year = new Date().getFullYear();
      const monthIdx = MONTHS.indexOf(selectedMonth);
      // Construct date string manually in local time format YYYY-MM-DD to avoid UTC shift
      const monthStr = String(monthIdx + 1).padStart(2, '0');
      finalDate = `${year}-${monthStr}-01`;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: finalDate,
      type,
      amount: parseFloat(amount),
      particulars: type === 'INCOME' ? `Income for ${selectedMonth}` : particulars,
      mode: type === 'INCOME' ? 'NONE' : mode,
    };

    onAddTransaction(newTransaction);
    setAmount('');
    setParticulars('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Left Panel: MONTHLY FINANCE Form */}
      <div className="glass-panel rounded-[40px] p-10 flex flex-col">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wider uppercase">Monthly Finance</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
          {/* Type Toggle */}
          <div className="flex justify-center mb-4">
             <div className="bg-white/20 p-1 rounded-full flex gap-2">
               <button 
                 type="button"
                 onClick={() => setType('INCOME')}
                 className={`px-8 py-2 rounded-full font-bold transition-all ${type === 'INCOME' ? 'bg-green-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
               >Income</button>
               <button 
                 type="button"
                 onClick={() => setType('EXPENSE')}
                 className={`px-8 py-2 rounded-full font-bold transition-all ${type === 'EXPENSE' ? 'bg-red-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
               >Expense</button>
             </div>
          </div>

          <div className="space-y-6">
            {/* Amount - Universal */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <div className="bg-slate-300 rounded-full p-2">
                  <IndianRupee size={20} className="text-slate-500" />
                </div>
              </div>
              <div className="block w-full pl-16 pr-6 py-1 rounded-full bg-white/80 border border-blue-200">
                <label className="text-[10px] text-slate-500 uppercase font-bold px-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-slate-800 outline-none pb-1 font-semibold"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {type === 'INCOME' ? (
              /* Income specific: Only Month Selection */
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <div className="bg-slate-300 rounded-full p-2">
                    <Calendar size={20} className="text-slate-500" />
                  </div>
                </div>
                <div className="block w-full pl-16 pr-6 py-1 rounded-full bg-white/80 border border-blue-200">
                  <label className="text-[10px] text-slate-500 uppercase font-bold px-1">Select Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full bg-transparent text-slate-800 outline-none pb-1 font-semibold"
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              /* Expense specific: Date, Particulars, Mode */
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <div className="bg-slate-300 rounded-full p-2">
                      <Tag size={20} className="text-slate-500" />
                    </div>
                  </div>
                  <div className="block w-full pl-16 pr-6 py-1 rounded-full bg-white/80 border border-blue-200">
                    <label className="text-[10px] text-slate-500 uppercase font-bold px-1">Particulars</label>
                    <input
                      type="text"
                      value={particulars}
                      onChange={(e) => setParticulars(e.target.value)}
                      className="w-full bg-transparent text-slate-800 outline-none pb-1 font-semibold"
                      placeholder="e.g. Rent, Groceries"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <div className="bg-slate-300 rounded-full p-2">
                      <Calendar size={20} className="text-slate-500" />
                    </div>
                  </div>
                  <div className="block w-full pl-16 pr-6 py-1 rounded-full bg-white/80 border border-blue-200">
                    <label className="text-[10px] text-slate-500 uppercase font-bold px-1">Date Selection</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent text-slate-800 outline-none pb-1 font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-white/60 uppercase font-bold block mb-2 px-4">Payment Mode</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setMode('CASH')}
                      className={`flex-1 py-3 rounded-2xl border font-bold transition-all ${mode === 'CASH' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/10 border-white/20 text-white/60'}`}
                    >Cash</button>
                    <button
                      type="button"
                      onClick={() => setMode('UPI')}
                      className={`flex-1 py-3 rounded-2xl border font-bold transition-all ${mode === 'UPI' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/10 border-white/20 text-white/60'}`}
                    >UPI</button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="pt-8 mt-auto flex justify-center">
            <button
              type="submit"
              className="glass-button w-2/3 text-white font-bold py-4 px-8 rounded-2xl text-xl tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-2xl"
            >
              SUBMIT DATA
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel: RECORD HISTORY Table */}
      <div className="glass-panel rounded-[40px] p-10 flex flex-col">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wider uppercase">Record History</h2>
        
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-white/20 backdrop-blur-md">
                <th className="px-4 py-3 text-left font-bold border-r border-white/10">Type</th>
                <th className="px-4 py-3 text-left font-bold border-r border-white/10">Particular</th>
                <th className="px-4 py-3 text-left font-bold border-r border-white/10">Amount</th>
                <th className="px-4 py-3 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-white/40 italic text-lg">No records found. Start adding now!</td>
                </tr>
              ) : (
                transactions.map((t, idx) => (
                  <tr key={t.id} className="bg-white/5 group hover:bg-white/10 transition-colors">
                    <td className="px-4 py-3 border-r border-white/10 font-bold">
                      <span className={t.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}>
                        {t.type === 'INCOME' ? 'INC' : 'EXP'}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r border-white/10 text-sm">{t.particulars}</td>
                    <td className="px-4 py-3 border-r border-white/10 font-bold">₹{t.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => onReorderTransactions?.(idx, 'up')}
                          disabled={idx === 0}
                          className="text-white/40 hover:text-white disabled:opacity-0 transition-all p-1"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          onClick={() => onReorderTransactions?.(idx, 'down')}
                          disabled={idx === transactions.length - 1}
                          className="text-white/40 hover:text-white disabled:opacity-0 transition-all p-1"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                      <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
                      <button 
                        onClick={() => onDeleteTransaction(t.id)} 
                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-md"
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button className="glass-button px-8 py-3 rounded-xl font-bold border border-white/20">
            Export CSV
          </button>
          <button className="glass-button px-8 py-3 rounded-xl font-bold border border-white/20 text-red-100">
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
