import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';
import useQuery from '../../hooks/useQuery';
import { toast } from 'react-toastify';
import { ArchivePageHero } from '../../components/archive';

function ResetPasswordPage() {
  const history = useHistory();
  const { resetPassword } = useUserContext();
  const query = useQuery();
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const oobCode = query.get('oobCode');

    if (!password) {
      return toast.error('Please enter a new password');
    }

    if (!oobCode) {
      return history.push('/');
    }

    resetPassword(oobCode, password)
      .then((res) => {
        toast.success('Password changed successfully, login to continue');
        history.push('/login');
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`);
      });
  };

  useEffect(() => {
    document.title = 'Angel Fashion Studio | Reset Password';
  }, []);

  return (
    <main className="bg-warm-bg font-body min-h-screen">
      <ArchivePageHero title="reset password" />
      <section className="py-16 px-4 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-4xl lg:text-5xl font-editorial font-black text-espresso tracking-tighter">
              Reset
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type='password'
                className="w-full px-4 py-3 bg-warm-bg border border-espresso/20 rounded-sm text-sm tracking-wide placeholder:capitalize focus:outline-none focus:border-terracotta"
                placeholder='new password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type='submit' 
              className="w-full px-8 py-4 bg-espresso text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-terracotta transition-colors"
            >
              reset
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ResetPasswordPage;
