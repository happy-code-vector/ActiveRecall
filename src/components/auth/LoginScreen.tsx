import { useState } from 'react';
import { motion } from 'motion/react';
import { Apple, Mail, Loader2 } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'magic-link' | 'forgot-password';

interface LoginScreenProps {
  onSubmit: (email: string, password: string, mode: 'login' | 'signup') => Promise<{ error: Error | null }>;
  onMagicLink: (email: string) => Promise<{ error: Error | null }>;
  onForgotPassword: (email: string) => Promise<{ error: Error | null }>;
  onSocialLogin: (provider: 'apple' | 'google') => void;
  onRestorePurchases: () => void;
}

export function LoginScreen({ 
  onSubmit, 
  onMagicLink, 
  onForgotPassword,
  onSocialLogin, 
  onRestorePurchases 
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'magic-link') {
        const { error } = await onMagicLink(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage('Check your email for the login link!');
        }
      } else if (mode === 'forgot-password') {
        const { error } = await onForgotPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage('Check your email for password reset instructions!');
        }
      } else {
        const { error } = await onSubmit(email, password, mode);
        if (error) {
          setError(error.message);
        } else if (mode === 'signup') {
          setSuccessMessage('Check your email to confirm your account!');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'magic-link': return 'Email Login';
      case 'forgot-password': return 'Reset Password';
      default: return 'Welcome Back';
    }
  };

  const getButtonText = () => {
    if (isLoading) return '';
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'magic-link': return 'Send Magic Link';
      case 'forgot-password': return 'Send Reset Link';
      default: return 'Sign In';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Purple radial glow at bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-5 py-12">
        {/* ThinkFirst Logo */}
        <div className="mb-8">
          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl text-white relative z-10">ThinkFirst</h1>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
              style={{
                maskImage: 'linear-gradient(to right, transparent, black, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
              }}
            />
          </motion.div>
          <motion.p
            className="text-gray-400 text-sm text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your Brain, Supercharged
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-[rgba(20,20,20,0.95)] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-white text-xl font-semibold mb-4 text-center">{getTitle()}</h2>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-xs text-gray-400 mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-[#141414] text-white rounded-xl border border-white/10 focus:border-purple-500/50 focus:outline-none transition-colors placeholder:text-gray-600"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Input - not shown for magic link or forgot password */}
              {(mode === 'login' || mode === 'signup') && (
                <div>
                  <label htmlFor="password" className="block text-xs text-gray-400 mb-2">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#141414] text-white rounded-xl border border-white/10 focus:border-purple-500/50 focus:outline-none transition-colors placeholder:text-gray-600"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
              )}

              {/* Confirm Password - only for signup */}
              {mode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs text-gray-400 mb-2">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#141414] text-white rounded-xl border border-white/10 focus:border-purple-500/50 focus:outline-none transition-colors placeholder:text-gray-600"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
              )}

              {/* Forgot Password Link */}
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => { setMode('forgot-password'); setError(null); setSuccessMessage(null); }}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl shadow-lg shadow-purple-500/30 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : getButtonText()}
              </button>
            </form>

            {/* Mode Switchers */}
            <div className="mt-4 text-center space-y-2">
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(null); setSuccessMessage(null); }}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Don't have an account? <span className="text-purple-400">Sign up</span>
                  </button>
                  <div>
                    <button
                      type="button"
                      onClick={() => { setMode('magic-link'); setError(null); setSuccessMessage(null); }}
                      className="text-xs text-gray-500 hover:text-gray-400 transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                      <Mail size={12} /> Sign in with email link
                    </button>
                  </div>
                </>
              )}
              {mode === 'signup' && (
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Already have an account? <span className="text-purple-400">Sign in</span>
                </button>
              )}
              {(mode === 'magic-link' || mode === 'forgot-password') && (
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Back to <span className="text-purple-400">Sign in</span>
                </button>
              )}
            </div>

            {/* Divider - only show for login/signup */}
            {(mode === 'login' || mode === 'signup') && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-[rgba(20,20,20,0.95)] text-gray-500">or continue with</span>
                  </div>
                </div>

                {/* Social Auth Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onSocialLogin('apple')}
                    className="flex-1 py-3 bg-transparent border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/5 active:scale-95 transition-all"
                    aria-label="Continue with Apple"
                  >
                    <Apple className="w-5 h-5 text-white" fill="currentColor" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSocialLogin('google')}
                    className="flex-1 py-3 bg-transparent border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/5 active:scale-95 transition-all"
                    aria-label="Continue with Google"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.button
          onClick={onRestorePurchases}
          className="mt-8 text-sm text-white/40 hover:text-white/60 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Restore Purchases
        </motion.button>
      </div>
    </div>
  );
}
