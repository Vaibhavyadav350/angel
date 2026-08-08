import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { socialLinks } from '../../utils/constants';
import PaymentMethods from '../PaymentMethods';
import logo from '../../assets/logo.png';

const footerLinks = {
  "Shop Women": [
    { name: "Salwar Kameez", url: "/products?category=Women&subCategory=SALWAR+KAMEEZ" },
    { name: "Silk Sarees", url: "/products?category=Women&subCategory=SAREES" },
    { name: "Bridal Lehengas", url: "/products?category=Women&subCategory=LEHENGAS" },
    { name: "Plus Sizes", url: "/products?collection=plus+sizes" },
    { name: "New Arrivals", url: "/products?collection=new+arrivals" }
  ],
  "Shop Men & Kids": [
    { name: "Classic Sherwanis", url: "/products?category=Men&subCategory=SHERWANIS" },
    { name: "Indo Western", url: "/products?category=Men&subCategory=SHERWANIS&productType=Indowestern+Sherwani" },
    { name: "Girls Ethnic", url: "/products?category=Kids&subCategory=Girls" },
    { name: "Boys Ethnic", url: "/products?category=Kids&subCategory=Boys" },
    { name: "Men's Jackets", url: "/products?category=Men&subCategory=JACKET" }
  ],
  "Legal & Support": [
    { name: "Shipping Policy", url: "/shipping" },
    { name: "Privacy Policy", url: "/privacy-policy" },
    { name: "Refund Policy", url: "/refund-policy" },
    { name: "Terms & Conditions", url: "/terms" },
    { name: "Contact Us", url: "/contact" }
  ],
  "Our Studio": [
    { name: "About Us", url: "/about" },
    { name: "Store Locator", url: "/contact" },
    { name: "Wholesale", url: "/contact" }
  ]
};

const NewFooter = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#3D2B1F] text-[#F7E7CE] pt-16 pb-24 md:pb-12 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center shrink-0">
              <img src={logo} alt="Angel Fashion Studio Logo" className="h-[77px] md:h-[115px] object-contain brightness-0 invert" />
            </Link>
            <p className="text-white/40 text-[11px] leading-relaxed uppercase tracking-widest max-w-xs">
              Exquisite hand-spun garments tailored for the modern spirit.
            </p>
            <div className="flex gap-4">
              {/* Driven by `socialLinks` so the footer, the About page and anywhere
                  else stay in step — the URLs were previously hardcoded here and
                  only covered two of the four channels. */}
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.text}
                  title={link.text}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#C5A059] hover:border-[#C5A059] transition-all"
                >
                  {React.cloneElement(link.icon, { fontSize: '1.05rem', color: 'inherit' })}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns (Desktop) */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="hidden md:block">
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-6">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.url} className="text-sm text-white/50 hover:text-white transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Links Accordions (Mobile) */}
          <div className="md:hidden space-y-2">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="border-b border-white/5">
                <button 
                  onClick={() => toggleSection(title)}
                  className="w-full py-4 flex justify-between items-center text-left"
                >
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059]">{title}</span>
                  <FaChevronDown className={`transition-transform ${openSection === title ? 'rotate-180' : ''}`} size={12} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openSection === title ? 'max-h-80 pb-6' : 'max-h-0'}`}>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link to={link.url} className="text-sm text-white/60 block">{link.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Payment + provenance.
            This replaces a row of three links — Legal, Compliance, Logistics —
            which pointed at the privacy, terms and shipping pages already listed
            under "Legal & Support" a few centimetres above. Three renamed
            duplicates of visible links is noise; what a shopper actually looks
            for at the end of a store page is how they can pay and who they are
            buying from. */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <PaymentMethods />
          <p className="text-[9px] text-white/25 tracking-[0.3em] uppercase font-bold md:text-right">
            Prices in AUD, inclusive of GST
          </p>
        </div>

        <div className="pt-6 text-[9px] text-white/20 tracking-[0.4em] uppercase font-bold">
          {/* Dynamic, so the year is never quietly wrong the moment January
              arrives — it was still reading 2025. */}
          <p>© {new Date().getFullYear()} Angel Fashion Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
