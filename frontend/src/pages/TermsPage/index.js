import React, { useEffect } from 'react';
import { ArchivePageHero } from '../../components/archive';

const TermsPage = () => {
    useEffect(() => {
        document.title = 'Angel Fashion Studio | Terms & Conditions';
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="bg-champagne font-body min-h-screen">
            <ArchivePageHero title="Terms" />
            <section className="py-20 px-8 lg:px-24">
                <div className="container mx-auto max-w-3xl space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">General</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            By accessing and using the Angel Fashion Studio website, you agree to be bound by these Terms & Conditions. We reserve the right to update these terms at any time without prior notice.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Orders & Payment</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            All prices are displayed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to cancel any order due to product availability, pricing errors, or suspected fraud. Payment is processed securely via Stripe.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Product Information</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            We strive to display product images as accurately as possible. However, colours may vary slightly due to screen settings. Product descriptions are for general informational purposes and may vary from the actual product in minor details.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Intellectual Property</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            All content on this website — including text, images, logos, and designs — is the property of Angel Fashion Studio and is protected by copyright law. Reproduction, distribution, or use without written permission is strictly prohibited.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Limitation of Liability</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            Angel Fashion Studio shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or purchase of our products. Our total liability shall not exceed the amount paid for the product in question.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Governing Law</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of New Delhi, India.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TermsPage;
