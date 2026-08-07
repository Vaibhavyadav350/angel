import { useForm, ValidationError } from '@formspree/react';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { socialLinks } from '../../utils/constants';

const ContactForm = () => {
  const [state, handleSubmit] = useForm(process.env.REACT_APP_FORMSPREE);

  const field =
    'w-full bg-transparent border-b border-bronze/20 py-3 px-0 text-sm text-bronze placeholder:text-bronze/35 focus:outline-none focus:border-gold transition-colors';

  if (state.succeeded) {
    return (
      <div className="text-center py-12 border border-gold/30 bg-white/40">
        <div className="h-px w-12 bg-gold mx-auto mb-5" />
        <p className="font-editorial text-xl text-bronze mb-2">Thank you — your message is on its way.</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-bronze/50">
          We usually reply within one business day
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="contact-name" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 mb-2">
            Your Name
          </label>
          <input id="contact-name" name="name" type="text" required className={field} placeholder="Jane Smith" />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 mb-2">
            Email
          </label>
          <input id="contact-email" name="email" type="email" required className={field} placeholder="jane@example.com" />
          <ValidationError prefix="Email" field="email" errors={state.errors} className="block text-[10px] text-red-500 mt-2 tracking-wide" />
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 mb-2">
          Phone <span className="normal-case tracking-normal text-bronze/30">(optional)</span>
        </label>
        <input id="contact-phone" name="phone" type="tel" className={field} placeholder="+61 400 000 000" />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 mb-2">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          className={`${field} resize-y`}
          placeholder="Tell us about the occasion, the piece you have in mind, or anything you would like to ask."
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} className="block text-[10px] text-red-500 mt-2 tracking-wide" />
      </div>

      {state.errors && (
        <div className="border border-red-300 bg-red-50 px-5 py-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">
            Your message could not be sent
          </p>
          <p className="text-[11px] text-red-500/80 mt-1.5 leading-relaxed">
            Please try again, or email us directly at support@angelfashionstudio.org
          </p>
        </div>
      )}

      <div className="text-center pt-2">
        <button
          type="submit"
          disabled={state.submitting}
          className="px-12 py-4 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-[0.35em] hover:bg-chocolate transition-colors disabled:opacity-50"
        >
          {state.submitting ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  );
};

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About | Angel Archive Heritage';
  }, []);

  return (
    <main>
      <section className="py-48 bg-oatmeal overflow-hidden">
        <div className="container mx-auto px-8 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            <div className="w-full lg:w-3/5 order-2 lg:order-1">
              <div className="relative">
                <img alt="Exterior editorial shot of the elegant Angel Archive flagship boutique"
                  className="w-full aspect-[4/5] object-cover shadow-[40px_40px_0px_0px_#7A5C41]"
                  src="/assets/landing/bridal-edit-center.jpg" />
                <div className="absolute -bottom-10 -right-10 bg-white p-8 border fine-line hidden lg:block">
                  <span className="font-barcode text-4xl block text-bronze/40">AUS-3000</span>
                  <span className="text-[10px] font-bold tracking-widest text-gold uppercase">EST. 2024
                    MELBOURNE</span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/5 order-1 lg:order-2 space-y-12">
              <div className="space-y-6">
                <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] block">SINCE
                  2024</span>
                <h2
                  className="text-6xl lg:text-8xl font-editorial font-black text-bronze leading-[0.9] uppercase">
                  OUR<br />STORY</h2>
              </div>
              <div className="space-y-12 pr-0 lg:pr-12">
                <p className="text-xl font-medium leading-loose text-bronze/90">
                  Born in the heart of India, Angel Archive began as a curated vision to preserve the
                  vanishing techniques of traditional South Asian artisanship while defining a new era of global luxury.
                </p>
                <p className="text-lg leading-loose text-bronze/70">
                  As a premier India-based archive, we specialize in high-fashion heritage that
                  transcends seasons. Our journey is one of preservation—archiving the techniques of
                  master weavers and reimagining them for the modern connoisseur. Every garment in our
                  collection is a testament to the enduring beauty of heritage textiles.
                </p>
                <div className="pt-12 border-t border-bronze/10">
                  <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-gold">MELBOURNE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-48 bg-white/40">
        <div className="container mx-auto px-8 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-16">
              <div className="space-y-8">
                <h3 className="text-4xl font-editorial font-bold text-bronze uppercase tracking-tight">The
                  Mission</h3>
                <blockquote className="text-4xl lg:text-5xl font-editorial font-light italic text-gold border-l-4 border-gold pl-8 my-16 leading-tight">
                  "To democratize high-fashion heritage by providing uncompromising quality and artisanal
                  craftsmanship at accessible price points."
                </blockquote>
              </div>
              <div className="grid grid-cols-2 gap-12 pt-12 border-t fine-line">
                <div>
                  <p className="text-3xl font-editorial font-bold text-gold">100%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-bronze/50 mt-2">Ethical
                    Sourcing</p>
                </div>
                <div>
                  <p className="text-3xl font-editorial font-bold text-gold">200+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-bronze/50 mt-2">Master
                    Artisans</p>
                </div>
              </div>
            </div>
            <div className="bg-oatmeal p-12 lg:p-20 space-y-8 border fine-line">
              <div className="space-y-4">
                <h3 className="text-4xl font-editorial font-bold text-bronze uppercase">Visit the Store</h3>
                <div className="space-y-3">
                  <p className="text-lg text-bronze font-medium leading-relaxed">
                    Angel Fashion Studio<br />
                    Unit 32/150 Palmers Road,<br />
                    Truganina VIC 3029, Australia
                  </p>
                  <div className="pt-2 space-y-1">
                    <p className="text-sm font-semibold text-bronze">
                      Phone: <a href="tel:+61466853704" className="text-gold hover:underline">+61 466 853 704</a>
                    </p>
                    <p className="text-sm font-semibold text-bronze">
                      Email: <a href="mailto:support@angelfashionstudio.org" className="text-gold hover:underline">support@angelfashionstudio.org</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full aspect-video rounded-sm overflow-hidden border fine-line shadow-sm">
                <iframe
                  src="https://maps.google.com/maps?q=Angel+Fashion+Studio+Unit+32+150+Palmers+Road+Truganina+VIC+3029+Australia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Angel Fashion Studio Store Location"
                ></iframe>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://maps.app.goo.gl/TNGxFUNJoRq93a2N6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-4 bg-bronze text-white hover:bg-gold transition-all text-[10px] font-bold uppercase tracking-[0.3em]"
                >
                  Open in Google Maps ↗
                </a>
                <Link
                  to="/contact"
                  className="flex-1 text-center py-4 border border-bronze text-bronze hover:bg-bronze hover:text-white transition-all text-[10px] font-bold uppercase tracking-[0.3em]"
                >
                  Contact Concierge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact — replaces the newsletter capture. A visitor on the About page
          is usually trying to reach the studio, not subscribe to a mailing list,
          and the newsletter field posted nowhere. */}
      <section className="bg-oatmeal py-24 lg:py-32 px-6 lg:px-24 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold block mb-4">
              Get in Touch
            </span>
            <p className="font-editorial text-xl sm:text-2xl lg:text-3xl text-bronze tracking-tight">
              Tell us what you are looking for.
            </p>
          </div>

          <ContactForm />

          {/* Maps, Facebook, Instagram and TikTok */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-16 border-t border-bronze/10 pt-12">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="size-12 sm:size-14 rounded-full border border-bronze/25 flex items-center justify-center text-bronze hover:bg-bronze hover:text-white hover:scale-105 transition-all duration-500"
                title={link.text}
                aria-label={link.text}
              >
                {React.cloneElement(link.icon, { fontSize: '1.4rem', color: 'inherit' })}
              </a>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutPage;
