
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, Mail, Github } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          toast.success('Account created! Check your email to verify your account.');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          toast.success('Welcome back!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
    
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      toast.error(error.message);
    }
  };

  const handleGitHubAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-blue-100 text-black">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg">
          <LogIn className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          {isSignUp ? 'Create Account' : 'Sign in to Semurg'}
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Discover Wildlife with AI
        </p>
        
        <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="w-full flex justify-between items-center">
            {error && (
              <div className="text-sm text-red-500 flex-1">{error}</div>
            )}
            {!isSignUp && (
              <button type="button" className="text-xs hover:underline font-medium ml-auto">
                Forgot password?
              </button>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2 disabled:opacity-50"
          >
            {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="w-full text-center mb-4">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-sm text-gray-600 hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
        
        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">Or continue with</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>
        
        <div className="flex gap-3 w-full justify-center mt-2">
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
          <button
            type="button"
            onClick={handleGitHubAuth}
            className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow"
          >
            <Github className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
