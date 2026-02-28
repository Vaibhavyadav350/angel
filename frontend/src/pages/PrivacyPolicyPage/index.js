import React, { useEffect } from 'react';
import { ArchivePageHero } from '../../components/archive';

const PrivacyPolicyPage = () => {
    useEffect(() => {
        document.title = 'Angel Fashion Studio | Privacy Policy';
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="bg-champagne font-body min-h-screen">
            <ArchivePageHero title="Privacy Policy" />
            <section className="py-20 px-8 lg:px-24">
                <div className="container mx-auto max-w-3xl space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Information We Collect</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            We collect personal information you voluntarily provide when creating an account, placing an order, or contacting us. This includes your name, email address, shipping address, phone number, and payment information.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">How We Use Your Information</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            Your information is used to process orders, communicate about your purchases, improve our website experience, and send marketing communications (only with your consent). We never sell your personal data to third parties.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Data Security</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            We use industry-standard encryption (SSL/TLS) to protect your data during transmission. Payment processing is handled securely through Stripe — we never store your full card details on our servers.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Cookies</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            We use essential cookies to maintain your session and preferences. Analytics cookies help us understand how visitors interact with our site. You may disable cookies via your browser settings.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Contact</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            For privacy-related enquiries, please contact us at info@angelfashionstudio.au.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PrivacyPolicyPage;
