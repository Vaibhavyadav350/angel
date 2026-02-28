import React, { useState, useRef } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { SectionContainer } from './shared';
import { sectionHeadingClasses, containerPaddingClasses, sectionPaddingClasses } from '../../utils/responsiveText';
import { newsletter_url } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const response = await axios.post(newsletter_url, { email });
      if (response.data.success) {
        toast.success(response.data.message || 'Subscribed!', { position: 'top-center' });
        setSubmitted(true);
        setTimeout(() => {
          setEmail('');
          setSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Subscription failed. Please try again.';
      toast.error(message, { position: 'top-center' });
    }
    setLoading(false);
  };

  // Use DRY scroll animation hook
  useScrollAnimation({
    ref: sectionRef,
    from: { y: 40 },
    to: { y: 0 },
  });

  return (
    <SectionContainer
      ref={sectionRef}
      className={`bg-champagne ${sectionPaddingClasses} relative overflow-hidden`}
      padding={false}
      paddingX={false}
      maxWidth={false}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] sm:text-[25vw] lg:text-[30vw] font-editorial font-black text-gold/5 pointer-events-none select-none uppercase tracking-tighter" aria-hidden="true">
        ANGEL
      </div>
      <div className={`container mx-auto ${containerPaddingClasses} text-center relative z-10`}>
        <h2 className={`${sectionHeadingClasses} font-editorial font-black text-bronze uppercase mb-12 sm:mb-16 lg:mb-20 leading-none`}>
          JOIN THE ARCHIVE
        </h2>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group" aria-label="Newsletter subscription form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-bronze/10 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-editorial text-bronze placeholder:text-bronze/10 focus:outline-none focus:border-gold transition-colors"
              placeholder="YOUR EMAIL ADDRESS"
              aria-label="Your email address"
            />
            <button
              type="submit"
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 size-20 sm:size-24 lg:size-28 rounded-full bg-gold text-champagne flex items-center justify-center hover:bg-bronze transition-all shadow-2xl group-hover:scale-105 duration-700 min-w-[44px] min-h-[44px]"
              aria-label="Subscribe to newsletter"
            >
              <span className="material-symbols-outlined text-3xl sm:text-4xl lg:text-5xl" aria-hidden="true">east</span>
            </button>
          </form>
          <p className="text-[13px] font-bold uppercase tracking-[0.8em] mt-24 text-gold">
            Exclusive access to archival drops
          </p>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Newsletter;
