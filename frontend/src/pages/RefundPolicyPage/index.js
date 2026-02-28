import React, { useEffect } from 'react';
import { ArchivePageHero } from '../../components/archive';

const RefundPolicyPage = () => {
    useEffect(() => {
        document.title = 'Angel Fashion Studio | Refund Policy';
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="bg-champagne font-body min-h-screen">
            <ArchivePageHero title="Refund Policy" />
            <section className="py-20 px-8 lg:px-24">
                <div className="container mx-auto max-w-3xl space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Returns</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            We accept returns within 14 days of delivery for unworn, unaltered items with all original tags and packaging intact. To initiate a return, please contact our concierge team at info@angelfashionstudio.au.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Refund Process</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            Once we receive and inspect the returned item, a refund will be processed to your original payment method within 5–10 business days. You will receive an email confirmation once the refund has been issued.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Exchanges</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            We offer exchanges for a different size or colour, subject to availability. Exchange requests must be made within 14 days of delivery. The exchanged item will be shipped free of charge within India.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Exceptions</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            Custom-made, altered, or personalised pieces are non-refundable. Sale items are final sale unless they arrive damaged or defective. Jewelry items are non-returnable for hygiene reasons.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Damaged or Defective Items</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            If your item arrives damaged or defective, please contact us within 48 hours of delivery with photos of the damage. We will arrange a full refund or replacement at no additional cost.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default RefundPolicyPage;
