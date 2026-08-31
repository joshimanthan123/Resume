import { useState } from 'react';
import { login, register } from '../api';

export default function Auth({ onAuthSuccess, showNotification }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Register user
        const regResult = await register(email.trim(), password);
        showNotification?.(regResult?.message || 'Registration successful! Logging you in...', 'success');
        
        // Auto login after registration
        const loginResult = await login(email.trim(), password);
        if (loginResult?.token) {
          onAuthSuccess?.(loginResult.user, loginResult.token);
        }
      } else {
        // Login user
        const loginResult = await login(email.trim(), password);
        if (loginResult?.token) {
          showNotification?.('Welcome back! Login successful.', 'success');
          onAuthSuccess?.(loginResult.user, loginResult.token);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 md:p-8 bg-white dark:bg-inverse-surface rounded-2xl border border-outline-variant dark:border-outline/35 shadow-xl transition-all">
      {/* Header Tabs */}
      <div className="flex border-b border-outline-variant/60 dark:border-outline/30 mb-6">
        <button
          type="button"
          onClick={() => {
            setIsRegister(false);
            setErrorMsg('');
          }}
          className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 text-center cursor-pointer ${
            !isRegister
              ? 'border-primary text-primary dark:text-[#5c8bee]'
              : 'border-transparent text-on-surface-variant dark:text-gray-400 hover:text-on-surface dark:hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRegister(true);
            setErrorMsg('');
          }}
          className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 text-center cursor-pointer ${
            isRegister
              ? 'border-primary text-primary dark:text-[#5c8bee]'
              : 'border-transparent text-on-surface-variant dark:text-gray-400 hover:text-on-surface dark:hover:text-white'
          }`}
        >
          Register
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#5c8bee] rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-[28px]">
            {isRegister ? 'person_add' : 'lock'}
          </span>
        </div>
        <h3 className="font-headline-md text-2xl font-bold text-on-surface dark:text-white">
          {isRegister ? 'Create an Account' : 'Welcome Back'}
        </h3>
        <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-1">
          {isRegister
            ? 'Register to start managing your personal tasks securely'
            : 'Enter your credentials to access your protected tasks'}
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-2 text-red-700 dark:text-red-300 text-xs font-medium">
          <span className="material-symbols-outlined text-[18px] text-red-500 shrink-0">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant dark:text-gray-400 text-[20px]">
              mail
            </span>
            <input
              type="email"
              required
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest dark:bg-inverse-surface/80 border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant dark:text-gray-400 text-[20px]">
              lock
            </span>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest dark:bg-inverse-surface/80 border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{isRegister ? 'Creating Account...' : 'Authenticating...'}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">
                {isRegister ? 'how_to_reg' : 'login'}
              </span>
              <span>{isRegister ? 'Register Account' : 'Sign In'}</span>
            </>
          )}
        </button>
      </form>

      {/* Switch Mode Footer */}
      <div className="mt-6 pt-4 border-t border-outline-variant/40 dark:border-outline/20 text-center text-xs text-on-surface-variant dark:text-gray-400">
        {isRegister ? (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMsg('');
              }}
              className="text-primary dark:text-[#5c8bee] font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMsg('');
              }}
              className="text-primary dark:text-[#5c8bee] font-bold hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
