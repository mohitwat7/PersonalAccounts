
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const COLORS = ['#3b82f6', '#4b5563', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(new Date().getMonth());

  // Filtered transactions for the selected month
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === selectedMonthIndex;
    });
  }, [transactions, selectedMonthIndex]);

  // Summary Table Data (Top 5 expenses for selected month)
  const summaryTableData = useMemo(() => {
    return filteredTransactions.filter(t => t.type === 'EXPENSE').slice(0, 5);
  }, [filteredTransactions]);

  // Yearly Dual Bar Chart: Income vs Expense comparison per month
  const yearlyChartData = useMemo(() => {
    return MONTHS_SHORT.map((m, idx) => {
      const monthTransactions = transactions.filter(t => new Date(t.date).getMonth() === idx);
      const income = monthTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
      return {
        name: m,
        income,
        expense
      };
    });
  }, [transactions]);

  // Daily Spending Trend (Real data for selected month)
  const trendData = useMemo(() => {
    const daysInMonth = new Date(new Date().getFullYear(), selectedMonthIndex + 1, 0).getDate();
    const dailyMap: Record<number, number> = {};
    
    // Initialize all days with 0
    for(let i = 1; i <= daysInMonth; i++) dailyMap[i] = 0;

    // Aggregate expenses
    filteredTransactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const day = new Date(t.date).getDate();
      dailyMap[day] += t.amount;
    });

    return Object.entries(dailyMap).map(([day, value]) => ({
      day: parseInt(day),
      value
    }));
  }, [filteredTransactions, selectedMonthIndex]);

  // Real Payment Mode Distribution for selected month
  const modeDistribution = useMemo(() => {
    const expenseOnly = filteredTransactions.filter(t => t.type === 'EXPENSE');
    const total = expenseOnly.reduce((sum, t) => sum + t.amount, 0);
    const modes: Record<string, number> = {};
    
    expenseOnly.forEach(t => {
      modes[t.mode] = (modes[t.mode] || 0) + t.amount;
    });

    return Object.entries(modes).map(([name, value]) => ({
      name,
      value,
      percent: total > 0 ? ((value / total) * 100).toFixed(0) : '0'
    }));
  }, [filteredTransactions]);

  // Summary list for the right-side box
  const modeSpecificList = useMemo(() => {
    return filteredTransactions.filter(t => t.type === 'EXPENSE').slice(0, 3);
  }, [filteredTransactions]);

  return (
    <div className="glass-panel rounded-[40px] p-8 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold tracking-widest mb-8 text-white/90 uppercase border-b border-white/10 pb-4 flex justify-between items-center">
        <span>Financial Overview Dashboard</span>
        <span className="text-sm font-normal text-white/40">{MONTHS_FULL[selectedMonthIndex]} 2024</span>
      </h1>
      
      {/* 12-Month Slicer */}
      <div className="mb-10">
        <h2 className="text-xs font-bold mb-3 uppercase tracking-wider text-white/40">Select Reporting Month</h2>
        <div className="flex flex-wrap gap-2 justify-between bg-white/5 p-2 rounded-2xl border border-white/10">
          {MONTHS_SHORT.map((m, idx) => (
            <button 
              key={m}
              onClick={() => setSelectedMonthIndex(idx)}
              className={`flex-1 min-w-[60px] py-2 rounded-xl text-xs font-bold transition-all ${selectedMonthIndex === idx ? 'bg-blue-600 shadow-lg text-white' : 'text-white/40 hover:bg-white/10 hover:text-white/80'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Top Left: Monthly Summary Table */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wider flex justify-between">
            <span>Monthly Summary</span>
            <span className="text-xs text-blue-400 font-normal">Recent Expenses</span>
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/20">
                  <th className="px-4 py-3 text-left border-r border-white/10">Sr. No.</th>
                  <th className="px-4 py-3 text-left border-r border-white/10">Particular</th>
                  <th className="px-4 py-3 text-left">Spent (₹)</th>
                </tr>
              </thead>
              <tbody className="bg-white/10 divide-y divide-white/5">
                {summaryTableData.length > 0 ? summaryTableData.map((t, i) => (
                  <tr key={t.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 border-r border-white/10 opacity-60">{i + 1}</td>
                    <td className="px-4 py-3 border-r border-white/10">{t.particulars}</td>
                    <td className="px-4 py-3 font-bold text-red-400">{t.amount.toLocaleString()}</td>
                  </tr>
                )) : (
                   <tr><td colSpan={3} className="px-4 py-12 text-center opacity-40 italic">No expenses found for this month</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Right: Income vs Expense Dual Bar Chart */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wider text-right">Income vs Expense (Yearly)</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyChartData}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Left: Daily Spending Trend */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-6 tracking-widest uppercase flex items-center gap-2">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            Daily Spending Trend
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 10 }} />
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <Tooltip cursor={{ stroke: '#3b82f6', strokeWidth: 2 }} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8, fill: '#fff', stroke: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Right: Payment Mode Split & Controls */}
        <div className="flex flex-col gap-6 bg-white/5 p-6 rounded-3xl border border-white/10">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 w-full">
              <h2 className="text-lg font-bold mb-2 uppercase tracking-wider">Payment Mode Split</h2>
              <div className="h-[180px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={modeDistribution.length > 0 ? modeDistribution : [{name: 'None', value: 1}]} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={50} 
                      outerRadius={75} 
                      dataKey="value"
                      stroke="none"
                    >
                      {modeDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      {modeDistribution.length === 0 && <Cell fill="#334155" />}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Manual Legend Overlay */}
                <div className="absolute top-0 right-0 text-[10px] space-y-2 bg-black/20 p-2 rounded-lg backdrop-blur-sm">
                  {modeDistribution.map((m, idx) => (
                    <div key={m.name} className="flex items-center gap-2 justify-end">
                      <span className="font-bold">{m.name} ({m.percent}%)</span>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    </div>
                  ))}
                  {modeDistribution.length === 0 && <span className="opacity-40 italic">No expense data</span>}
                </div>
              </div>
            </div>

            <div className="flex-1 w-full">
               <div className="overflow-hidden rounded-xl border border-white/10 text-[11px] mb-4 shadow-inner">
                  <table className="w-full">
                    <thead className="bg-white/20">
                      <tr>
                        <th className="px-2 py-2 text-left">Sc No.</th>
                        <th className="px-2 py-2 text-left">Particular</th>
                        <th className="px-2 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/10">
                      {modeSpecificList.length > 0 ? modeSpecificList.map((t, idx) => (
                        <tr key={t.id} className="border-t border-white/5">
                          <td className="px-2 py-2">{idx + 1}</td>
                          <td className="px-2 py-2 truncate max-w-[80px]">{t.particulars}</td>
                          <td className="px-2 py-2 text-right font-bold">₹{t.amount}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={3} className="p-4 text-center opacity-40 italic">N/A</td></tr>
                      )}
                    </tbody>
                  </table>
               </div>
               <div className="flex gap-2">
                 <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-[10px] py-2 rounded-lg font-bold shadow-lg transition-colors">Add New</button>
                 <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-[10px] py-2 rounded-lg font-bold shadow-lg transition-colors">Export</button>
                 <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-[10px] py-2 rounded-lg font-bold shadow-lg transition-colors">Settings</button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
