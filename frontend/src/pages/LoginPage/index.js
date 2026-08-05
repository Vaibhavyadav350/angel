import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../context/user_context';
import { Link, useHistory, useLocation } from 'react-router-dom';
import useMounted from '../../hooks/useMounted';
import { toast } from 'react-toastify';
import Button from '../../components/Button';

// Snitch archive style: split-screen hero left + form panel right
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
  </svg>
);

function LoginPage() {
  const history = useHistory();
  const location = useLocation();
  const mounted = useMounted();
  const { loginUser, signInWithGoogle } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailValid, setEmailValid] = useState(false);

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setEmailError('');
    setEmailValid(validateEmail(val));
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('This email format seems incomplete.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter e-mail');
    if (!password) return toast.error('Please enter password');
    setIsSubmitting(true);
    loginUser(email, password)
      .then(() => history.push(location.state?.from ?? '/'))
      .catch((err) => toast.error(`Error: ${err.message}`))
      .finally(() => mounted.current && setIsSubmitting(false));
  };

  useEffect(() => {
    document.title = 'Angel Fashion Studio | Login';
  }, []);

  const inputClass =
    'w-full bg-transparent border-0 border-b border-bronze/20 py-4 text-lg text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors';

  return (
    <main className="bg-champagne font-body min-h-screen flex items-center justify-center pt-32 pb-24 px-8">
      <div className="container max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left: Editorial Hero Text */}
        <div className="space-y-10">
          <div className="space-y-4">
            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] block">
              Access The Archive
            </span>
            <h1 className="text-[18vw] lg:text-[10rem] font-editorial font-black leading-[0.8] text-bronze tracking-tighter uppercase">
              LOGIN
            </h1>
          </div>
          <div className="max-w-md space-y-6">
            <p className="text-sm font-medium leading-relaxed text-bronze/60 italic">
              Welcome back to the sanctuary of heritage. Enter your credentials to manage your curated collections.
            </p>
            <div className="flex items-center gap-6">
              <div className="h-px w-16 bg-gold/40" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-bronze/30">
                Est. 2024
              </span>
            </div>
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="w-full max-w-lg mx-auto lg:ml-auto lg:mr-0 bg-white/40 backdrop-blur-sm p-10 lg:p-14 border border-gold/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className={`${inputClass} pr-10`}
                  placeholder="YOURNAME@EMAIL.COM"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                />
                {emailValid && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-500 material-symbols-outlined text-lg opacity-80" aria-label="Valid email">
                    check_circle
                  </span>
                )}
              </div>
              {emailError && (
                <p className="text-[10px] text-bronze/60 italic animate-fade-in">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold block">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[9px] font-bold uppercase tracking-[0.2em] text-bronze/40 hover:text-gold transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={visible ? 'text' : 'password'}
                  name="password"
                  className={`${inputClass} pr-10`}
                  placeholder="••••••••"
                  value={password}
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-bronze/40 hover:text-bronze transition-colors"
                  aria-label={visible ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {visible ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-bronze text-champagne py-5 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-chocolate transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
              >
                Enter Archive
                <span className="material-symbols-outlined text-sm">east</span>
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-bronze/10" />
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-bronze/30">Or</span>
                <div className="h-px flex-1 bg-bronze/10" />
              </div>

              {/* Google */}
              <button
                type="button"
                disabled={isSubmitting}
                className="w-full border border-bronze/20 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:border-gold hover:text-gold transition-all duration-500 flex items-center justify-center gap-3 text-bronze/70 disabled:opacity-50"
                onClick={() => {
                  signInWithGoogle()
                    .then(() => history.push('/'))
                    .catch((err) => toast.error(`Error: ${err.message}`));
                }}
              >
                <GoogleIcon />
                Sign in with Google
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 pt-4">
              No account?{' '}
              <Link
                to="/register"
                className="text-gold border-b border-gold/30 pb-0.5 hover:text-bronze hover:border-bronze transition-all"
              >
                Create a Profile
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
