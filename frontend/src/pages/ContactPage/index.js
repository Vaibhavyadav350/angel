import React, { useEffect } from 'react';
import { ArchivePageHero } from '../../components/archive';

const ContactPage = () => {
    useEffect(() => {
        document.title = 'Angel Fashion Studio | Concierge';
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="bg-champagne font-body min-h-screen">
            <ArchivePageHero title="Concierge" />
            <section className="py-20 px-8 lg:px-24">
                <div className="container mx-auto max-w-4xl space-y-16">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="space-y-10">
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-4">Visit Us</h3>
                                <p className="text-base font-medium leading-relaxed text-bronze/70">
                                    Angel Fashion Studio<br />
                                    Unit 32/150 Palmers Road<br />
                                    Truganina VIC 3029<br />
                                    Australia
                                </p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-4">Call Us</h3>
                                <a href="tel:+61466853704" className="text-base font-medium text-bronze/70 hover:text-gold transition-colors">
                                    +61 466 853 704
                                </a>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-4">Email</h3>
                                <a href="mailto:support@angelfashionstudio.org" className="text-base font-medium text-bronze/70 hover:text-gold transition-colors">
                                    support@angelfashionstudio.org
                                </a>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-4">Hours</h3>
                                <p className="text-base font-medium leading-relaxed text-bronze/70">
                                    Monday – Saturday: 10am – 6pm<br />
                                    Sunday: By Appointment Only
                                </p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <h3 className="text-3xl font-editorial font-bold text-bronze uppercase">Private Viewing</h3>
                            <p className="text-sm font-medium leading-relaxed text-bronze/60">
                                For a personalised bridal or menswear consultation, we invite you to book a private viewing at our Melbourne atelier. Our stylists will curate a selection tailored to your occasion.
                            </p>
                            <p className="text-sm font-medium leading-relaxed text-bronze/60">
                                Please contact us via phone or email to schedule your appointment.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ContactPage;
