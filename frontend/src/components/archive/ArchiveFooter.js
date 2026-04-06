import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO, FOOTER_LINKS, SOCIAL_LINKS } from '../../constants/archiveConstants';
import { footerHeadingClasses, containerPaddingClasses, sectionPaddingClasses } from '../../utils/responsiveText';

const ArchiveFooter = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    setIsHighContrast(document.documentElement.classList.contains('high-contrast'));
  }, []);

  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast');
    setIsHighContrast((prev) => !prev);
  };

  return (
    <footer className={`bg-chocolate ${sectionPaddingClasses} pb-16 sm:pb-20 lg:pb-24 border-t fine-line border-champagne/10`}>
      <div className={`container mx-auto ${containerPaddingClasses}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 sm:gap-16 lg:gap-20 mb-32 sm:mb-40 lg:mb-48">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-8 sm:space-y-10 lg:space-y-12">
            <h2 className={`${footerHeadingClasses} font-editorial font-black tracking-tighter leading-none text-champagne uppercase`}>
              ANGEL<br />FASHION STUDIO
            </h2>
            <p className="text-sm sm:text-base font-medium leading-relaxed text-champagne/50 max-w-xs">
              {COMPANY_INFO.fullName} is dedicated to bringing your fashion dreams to life. With a passion for creativity and an eye for detail, we offer an array of designs that cater to every style and occasion.
            </p>
            <div className="flex gap-6 sm:gap-8 lg:gap-10">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-champagne transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded"
                aria-label="Follow us on Instagram"
              >
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">share</span>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-champagne transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded"
                aria-label="View our Instagram photos"
              >
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">photo_camera</span>
              </a>
              <a
                href={SOCIAL_LINKS.email}
                className="text-gold hover:text-champagne transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded"
                aria-label="Send us an email"
              >
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">alternate_email</span>
              </a>
            </div>
          </div>

          {/* The Studio */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <h5 className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.4em] text-gold">
              The Studio
            </h5>
            <ul className="space-y-4 sm:space-y-5 lg:space-y-6 text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.4em] text-champagne/60">
              {FOOTER_LINKS.studio.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <h5 className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.4em] text-gold">
              Shop
            </h5>
            <ul className="space-y-4 sm:space-y-5 lg:space-y-6 text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.4em] text-champagne/60">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Care */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <h5 className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.4em] text-gold">
              Client Care
            </h5>
            <ul className="space-y-4 sm:space-y-5 lg:space-y-6 text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.4em] text-champagne/60">
              {FOOTER_LINKS.clientCare.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <h5 className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.4em] text-gold">
              Legal
            </h5>
            <ul className="space-y-4 sm:space-y-5 lg:space-y-6 text-[10px] sm:text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.4em] text-champagne/60">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('http') ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className="hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 sm:pt-16 lg:pt-20 border-t border-champagne/10 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 lg:gap-12">
          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.5em] sm:tracking-[0.6em] text-champagne/30 text-center sm:text-left">
            © {new Date().getFullYear()} Angel Fashion Studio. All Rights Reserved.
          </p>
          <div className="flex gap-8 sm:gap-12 lg:gap-20 text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.5em] sm:tracking-[0.6em] text-champagne/30 items-center">
            <button
              onClick={toggleHighContrast}
              aria-label="Toggle High Contrast Mode"
              className={`hover:text-gold transition-colors flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-gold p-1 rounded ${isHighContrast ? 'text-gold' : ''}`}
            >
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">contrast</span>
              <span className="hidden sm:inline">A11Y Mode</span>
            </button>
            <span>MUMBAI, IN</span>
            <span>LONDON, UK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ArchiveFooter;
