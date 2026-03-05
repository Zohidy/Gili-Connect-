import React, { useState } from 'react';
import { motion } from 'motion/react';
import { IslandRole } from '../types';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onAuth: (email: string, pass: string, name?: string, role?: IslandRole) => Promise<void>;
  onGoogleAuth: () => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode, onAuth, onGoogleAuth }) => {
  const [role, setRole] = useState<IslandRole>('Tourist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onAuth(email, password, name, role);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4 pt-20"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-8 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-water/10 rounded-full blur-3xl" />
        
        <h2 className="text-3xl font-bold mb-2 text-primary">{mode === 'login' ? 'Welcome Back' : 'Join the Island'}</h2>
        <p className="text-secondary mb-8">{mode === 'login' ? 'See what\'s happening on Gili T.' : 'Start sharing your island journey.'}</p>
        
        {error && (
          <div className="error-message text-xs p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors" 
                placeholder="John Doe" 
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors" 
              placeholder="name@example.com" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors" 
              placeholder="••••••••" 
            />
          </div>
          
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase mb-2">Island Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Tourist', 'Local', 'Business', 'Moderator', 'Supporter'] as IslandRole[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${role === r ? 'bg-accent/10 border-accent text-accent' : 'border-border text-secondary hover:border-accent/50'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 rounded-xl font-semibold mt-4"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-2 text-secondary">Or continue with</span>
          </div>
        </div>

        <button
          onClick={async () => {
            setError('');
            setLoading(true);
            try {
              await onGoogleAuth();
            } catch (err: any) {
              setError(err.message || 'Google authentication failed');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full btn-secondary py-4 rounded-xl font-semibold flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AuthPage;
