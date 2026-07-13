import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { authStart, authSuccess, authFailure } from '../features/authSlice';
import { Flame } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    dispatch(authStart());

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('show_startup_animation', 'true');
      dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setErrorMsg(msg);
      dispatch(authFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    setLoading(true);
    setErrorMsg('');
    dispatch(authStart());

    try {
      const res = await axios.post('/api/auth/google-mock', {
        email: 'google_student@domain.com',
        name: 'Google Student'
      });
      localStorage.setItem('show_startup_animation', 'true');
      dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Google authentication simulation failed.';
      setErrorMsg(msg);
      dispatch(authFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#0B0F19]">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-glow border border-brand-border/60">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/40 mb-3 shadow-glow">
            <Flame className="w-8 h-8 text-indigo-400 fill-indigo-400/20 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Sign In to Brain DSA AI</h2>
          <p className="mt-1 text-sm text-gray-400">Step up your coding interviews with AI visualizations</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 text-xs font-semibold text-red-400 border rounded-lg bg-red-950/20 border-red-900/60">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-[#131B2E] border border-brand-border rounded-lg focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
              <Link to="/forgotpassword" className="text-xs text-indigo-400 hover:underline">Forgot Password?</Link>
            </div>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-[#131B2E] border border-brand-border rounded-lg focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-glow disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 border-t border-brand-border/40" />
            <span className="relative px-3 bg-[#161F30] text-[10px] text-gray-500 uppercase tracking-widest font-bold">Or continue with</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleMock}
            className="w-full py-3 font-semibold text-gray-300 transition-all bg-[#111A2C] border border-brand-border rounded-lg hover:bg-brand-border flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.55 0 2.969.577 4.053 1.528l3.1-3.1C19.23 2.19 15.9 1 12 1 5.925 1 1 5.925 1 12s4.925 11 11 11c5.8 0 10.74-4.14 10.74-10.285 0-.585-.05-1.17-.15-1.715H12.24z"/>
            </svg>
            Sign In with Google
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
