import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Flame } from 'lucide-react';
import api from "../utils/api";
const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setErrorMsg('Passwords do not match.');
    }

    setLoading(true);
    setErrorMsg('');
    setStatusMsg('');

    try {
      await api.put(`/api/auth/resetpassword/${token}`, { password });
      setStatusMsg('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to reset password.');
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
          <h2 className="text-2xl font-extrabold tracking-tight">Reset Password</h2>
          <p className="mt-1 text-sm text-gray-400 text-center">Set your new account password credentials</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-[#131B2E] border border-brand-border rounded-lg focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirm New Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-[#131B2E] border border-brand-border rounded-lg focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition-all bg-cyan-600 rounded-lg hover:bg-cyan-500 shadow-glow-teal disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          Back to{' '}
          <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;

