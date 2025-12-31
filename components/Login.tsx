
import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (status: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // User Credentials Requirements:
    // Username: Mython
    // Password: IluvMOM@0718
    
    // Using trim() to prevent issues with accidental spaces
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (cleanUsername === 'Mython' && cleanPassword === 'IluvMOM@0718') {
      onLogin(true);
    } else {
      setError('Invalid username or password. Note: Credentials are case-sensitive.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-[40px] p-12 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-12 tracking-wider">SECURE LOGIN</h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <div className="bg-slate-300 rounded-full p-2">
                <User size={20} className="text-slate-500" />
              </div>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input block w-full pl-16 pr-6 py-4 rounded-full text-lg outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
              placeholder="Username"
              autoComplete="username"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <div className="bg-slate-300 rounded-full p-2">
                <Lock size={20} className="text-slate-500" />
              </div>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input block w-full pl-16 pr-6 py-4 rounded-full text-lg outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
              placeholder="Password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 animate-pulse">
              <p className="text-red-200 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="glass-button w-2/3 text-white font-bold py-4 px-8 rounded-2xl text-xl tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              LOG IN
            </button>
          </div>
        </form>

        <div className="mt-12 text-white/20 text-[10px] text-center uppercase tracking-[0.2em]">
          <p>Personal Accounting Access • Mython Systems</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
