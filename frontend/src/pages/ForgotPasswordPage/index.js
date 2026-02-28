import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import { ArchivePageHero } from '../../components/archive';

function ForgotPasswordPage() {
  const { forgotPassword } = useUserContext();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error('Please enter e-mail');
    }

    setIsSubmitting(true);
    forgotPassword(email)
      .then((res) => {
        toast.info(
          'A password reset link has been sent, check your inbox and follow the instruction'
        );
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`);
      })
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    document.title = 'Angel Fashion Studio | Forgot Password';
  }, []);

  return (
    <main className="bg-warm-bg font-body min-h-screen">
      <ArchivePageHero title="forgot password" />
      <section className="py-16 px-4 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-4xl lg:text-5xl font-editorial font-black text-espresso tracking-tighter">
              Forgot
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type='email'
                className="w-full px-4 py-3 bg-warm-bg border border-espresso/20 rounded-sm text-sm tracking-wide placeholder:capitalize focus:outline-none focus:border-terracotta"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              disabled={isSubmitting}
              type='submit'
              className="w-full px-8 py-4 bg-espresso text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-terracotta transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              submit
            </Button>
            <div className="relative flex items-center my-6">
              <hr className="w-full border-espresso/20" />
              <span className="absolute left-1/2 -translate-x-1/2 px-2 bg-warm-bg text-xs text-espresso/60">or</span>
            </div>
            <div className="text-center">
              <Link to='/login' className="text-sm text-espresso/60 hover:text-terracotta capitalize transition-colors">
                login
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
