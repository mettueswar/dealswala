'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginModal({ onClose }) {
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ message: 'Welcome back!', type: 'success' });
      onClose();
    } catch (err) {
      toast({ message: err.message || 'Login failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast({ message: 'Signed in with Google!', type: 'success' });
      onClose();
    } catch (err) {
      toast({ message: err.message || 'Google sign-in failed', type: 'error' });
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-slide shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e2db]">
          <h2 className="font-display font-semibold text-base text-[#1a1916]">Sign In</h2>
          <button onClick={onClose} className="w-7 h-7 bg-[#f7f6f3] hover:bg-[#e5e2db] rounded-full flex items-center justify-center text-[#6b6860] text-sm transition-colors">✕</button>
        </div>
        <div className="p-5">
          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 h-11 bg-white border-2 border-[#e5e2db] hover:border-[#d4720a] rounded-xl text-sm font-display font-semibold text-[#1a1916] transition-all disabled:opacity-60 mb-4"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-[#e5e2db] border-t-[#d4720a] rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#e5e2db]" />
            <span className="text-xs text-[#9e9b96] font-display">or use email</span>
            <div className="flex-1 h-px bg-[#e5e2db]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-display font-medium text-[#6b6860] mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full h-10 bg-[#f7f6f3] border border-[#e5e2db] rounded-xl px-3 text-sm text-[#1a1916] outline-none focus:border-[#d4720a] transition-colors"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-display font-medium text-[#6b6860] mb-1.5">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full h-10 bg-[#f7f6f3] border border-[#e5e2db] rounded-xl px-3 text-sm text-[#1a1916] outline-none focus:border-[#d4720a] transition-colors"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#d4720a] hover:bg-[#b85e08] disabled:opacity-60 text-white font-display font-semibold text-sm rounded-xl py-3 transition-colors">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-xs text-center text-[#9e9b96] mt-3">Admin: admin@dealwala.in / admin123</p>
        </div>
      </div>
    </div>
  );
}
