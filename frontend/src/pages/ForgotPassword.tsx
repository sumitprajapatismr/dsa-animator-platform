import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'react-redux'; // Wait, let's use axios directly, not react-redux
import Axios from 'axios';
import { Flame } from 'lucide-react';
import api from "../utils/api";
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setStatusMsg('');

    try {
      const res = await api.post('/api/auth/forgotpassword', { email });
      setStatusMsg('Reset password link generated successfully.');
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit forgot password request.');
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
          <h2 className="text-2xl font-extrabold tracking-tight">Forgot Password</h2>
          <p className="mt-1 text-sm text-gray-400 text-center">Enter your email and we'll generate a reset token</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 text-xs font-semibold text-red-400 border rounded-lg bg-red-950/20 border-red-900/60">
            {errorMsg}
          </div>
        )}

        {statusMsg && (
          <div className="p-3 mb-4 text-xs font-semibold text-indigo-400 border rounded-lg bg-indigo-950/20 border-indigo-900/60">
            {statusMsg}
          </div>
        )}

        {resetToken && (
          <div className="p-4 mb-4 text-xs bg-[#111A2C] border border-brand-border rounded-xl space-y-2">
            <p className="text-gray-400 font-bold">Local Test Mode: Copy the token below to reset your password:</p>
            <div className="p-2 bg-brand-dark rounded font-mono text-indigo-400 select-all overflow-x-auto">
              {resetToken}
            </div>
            <Link 
              to={`/resetpassword/${resetToken}`}
              className="inline-block mt-1 font-bold text-brand-teal hover:underline"
            >
              Go to Reset Form ➔
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-glow disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          Back to{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

