
import React, { useState } from 'react';
import { authService } from '../../services/authService';
import AuthSetupNotice from '../../components/admin/AuthSetupNotice';

const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const { error } = await authService.signIn({ email, password });
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Email atau password salah.' : error.message);
    }
    // The onAuthStateChange listener in AdminLayout will handle the redirect.
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-slate-200 shadow-sm animate-view-enter">
        <div className="text-center">
          <div className="flex items-baseline justify-center select-none">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">YMG</span>
            <span className="ml-2.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Panel</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">Login untuk mengelola toko Anda</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-bold text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-bold text-slate-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 bg-slate-50 rounded-lg border border-slate-200 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-slate-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 bg-slate-50 rounded-lg border border-slate-200 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-5 py-3 mt-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 disabled:bg-slate-400 flex items-center justify-center"
            >
              {isLoading && <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>}
              {isLoading ? 'Memproses...' : 'Login'}
            </button>
          </div>
        </form>
        
        <AuthSetupNotice />
      </div>
    </div>
  );
};

export default LoginView;
