import React, { useEffect } from 'react';
import { ArchivePageHero } from '../../components/archive';

const ShippingPage = () => {
    useEffect(() => {
        document.title = 'Angel Fashion Studio | Shipping';
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="bg-champagne font-body min-h-screen">
            <ArchivePageHero title="Shipping" />
            <section className="py-20 px-8 lg:px-24">
                <div className="container mx-auto max-w-3xl space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Domestic Shipping (Australia)</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            We offer free standard shipping on all domestic orders over $500. Standard delivery takes 5–7 business days. Express shipping (2–3 business days) is available at checkout for a flat fee.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">International Shipping</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            We ship worldwide via insured priority courier. International orders typically arrive within 7–14 business days. Customs duties and import taxes are the responsibility of the recipient.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Order Tracking</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            Once your order has shipped, you will receive a confirmation email with a tracking number. You can also view your order status in your profile under "Past Orders".
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Packaging</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            Each piece is carefully packaged in our signature archival packaging — acid-free tissue, a dust bag, and a branded gift box — ensuring your garment arrives in pristine condition.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ShippingPage;
