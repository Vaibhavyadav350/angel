import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAdminAuthStore } from '../../stores';
import { toast } from 'react-toastify';
import { PreLoader } from '../../components/admin';
import useMounted from '../../hooks/useMounted';

export default function LoginPage() {
  const { loginAdmin, adminAuthLoading: authLoading } = useAdminAuthStore();
  const history = useHistory();
  const mounted = useMounted();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!email || !password) {
      return toast.error('Please provide all credentials', { position: 'top-center' });
    }
    setLoading(true);
    const response = await loginAdmin(email, password);
    if (mounted.current) {
      setLoading(false);
    }
    if (response.success) {
      toast.success(`Logged in as ${response.data.name}`, { position: 'top-center' });
      history.push('/admin');
    } else {
      toast.error(response.message, { position: 'top-center' });
    }
  };

  if (authLoading) {
    return <PreLoader />;
  }

  return (
    <div className="min-h-screen bg-champagne font-body flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        {/* Brand */}
        <div className="text-center mb-12">
          <h1 className="font-editorial text-5xl font-black text-bronze uppercase tracking-[0.1em] leading-none">
            Angel
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-gold mt-3">
            Archive Admin
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-bronze/10 p-10 space-y-8">
          <div className="text-center">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-bronze/40">
              Sign In
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/60 mb-3">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-champagne/50 border-0 border-b border-bronze/20 py-3 px-4 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/60 mb-3">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-champagne/50 border-0 border-b border-bronze/20 py-3 px-4 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-bronze text-white text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-bronze/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-bronze/20">
            Heritage · Craftsmanship · Legacy
          </p>
        </div>
      </div>
    </div>
  );
}
