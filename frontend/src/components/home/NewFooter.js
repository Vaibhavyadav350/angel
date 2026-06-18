import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaPinterest, FaFacebookF, FaChevronDown } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const footerLinks = {
  "Shop Women": [
    { name: "Salwar Kameez", url: "/products?category=Women&subCategory=Salwar+Kameez" },
    { name: "Silk Sarees", url: "/products?category=Women&subCategory=Sarees" },
    { name: "Bridal Lehengas", url: "/products?category=Women&subCategory=Lehengas" },
    { name: "Plus Sizes", url: "/products?collection=plus+sizes" },
    { name: "New Arrivals", url: "/products?collection=new+arrivals" }
  ],
  "Shop Men & Kids": [
    { name: "Classic Sherwanis", url: "/products?category=Men&subCategory=Sherwanis" },
    { name: "Indowestern", url: "/products?category=Men&subCategory=Sherwanis" },
    { name: "Girls Ethnic", url: "/products?category=Kids" },
    { name: "Boys Ethnic", url: "/products?category=Kids" },
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
    { name: "Our Heritage", url: "/about" },
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center shrink-0">
              <img src={logo} alt="Angel Fashion Studio Logo" className="h-16 md:h-24 object-contain brightness-0 invert" />
            </Link>
            <p className="text-white/40 text-[11px] leading-relaxed uppercase tracking-widest max-w-xs">
              Exquisite hand-spun garments tailored for the modern spirit.
            </p>
            <div className="flex gap-4">
              <Link to="/" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] transition-all"><FaInstagram size={18} className="text-white" /></Link>
              <Link to="/" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] transition-all"><FaPinterest size={18} className="text-white" /></Link>
              <Link to="/" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#C5A059] hover:border-[#C5A059] transition-all"><FaFacebookF size={18} className="text-white" /></Link>
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-white/20 tracking-[0.4em] uppercase font-bold">
          <p>© 2025 ANGEL FASHION STUDIO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Legal</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Compliance</Link>
            <Link to="/shipping" className="hover:text-white transition-colors">Logistics</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
