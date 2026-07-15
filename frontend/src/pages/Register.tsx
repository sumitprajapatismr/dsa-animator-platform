import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../utils/api';
import { authStart, authSuccess, authFailure } from '../features/authSlice';
import { Flame } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    dispatch(authStart());

    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      dispatch(authSuccess({ token: res.data.token, user: res.data.user }));
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
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
          <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center border border-cyan-500/40 mb-3 shadow-glow">
            <Flame className="w-8 h-8 text-cyan-400 fill-cyan-400/20 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Create your account</h2>
          <p className="mt-1 text-sm text-gray-400">Unlock interactive algorithm builders and AI evaluations</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 text-xs font-semibold text-red-400 border rounded-lg bg-red-950/20 border-red-900/60">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-[#131B2E] border border-brand-border rounded-lg focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600"
              placeholder="Alex Mercer"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-[#131B2E] border border-brand-border rounded-lg focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-[#131B2E] border border-brand-border rounded-lg focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600"
              placeholder="•••••••• (Min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition-all bg-cyan-600 rounded-lg hover:bg-cyan-500 shadow-glow-teal disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
