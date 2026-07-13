import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const triggerVerify = async () => {
      try {
        const res = await Axios.get(`/api/auth/verify/${token}`);
        setSuccess(true);
        setMessage(res.data.message);
      } catch (err: any) {
        setSuccess(false);
        setMessage(err.response?.data?.message || 'Verification token is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };
    if (token) triggerVerify();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#0B0F19]">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-glow border border-brand-border/60 text-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">Verifying your email token credentials...</p>
          </div>
        ) : success ? (
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center shadow-glow">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Email Verified!
              </h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">{message}</p>
            </div>
            
            <div className="p-4 bg-brand-dark/40 border border-brand-border rounded-xl flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-gray-300">Verification Rewards Unlocked</h4>
                <p className="text-[10px] text-gray-500">You received +100 XP and +50 Coins. Level progress updated.</p>
              </div>
            </div>

            <Link
              to="/login"
              className="block w-full py-3 font-semibold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-glow"
            >
              Sign In to Your Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-red-400">Verification Failed</h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">{message}</p>
            </div>
            <Link
              to="/login"
              className="block w-full py-3 font-semibold text-white transition-all bg-[#111A2C] border border-brand-border rounded-lg hover:text-white"
            >
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
