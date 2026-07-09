import React, { useEffect } from 'react';
import { ArchivePageHero } from '../../components/archive';

const RefundPolicyPage = () => {
    useEffect(() => {
        document.title = 'Angel Fashion Studio | Return & Exchange Policy';
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="bg-champagne font-body min-h-screen">
            <ArchivePageHero title="Return & Exchange Policy" />
            <section className="py-20 px-8 lg:px-24">
                <div className="container mx-auto max-w-3xl space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Return Policy</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            We do not take returns in case you change your mind.
                        </p>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            The products can be exchanged, or the store credit can be provided for the products you may not like.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Exchange Requests</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            To request an exchange, please notify us within:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm font-medium leading-relaxed text-bronze/70">
                            <li>48 hours of purchase (for orders picked up locally)</li>
                            <li>48 hours after the product has been delivered (for orders shipped by post only)</li>
                        </ul>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            Please Note: Angel Fashion Studio holds the right to refuse any request made for the return or exchange beyond the above-mentioned timeline.
                        </p>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            In case of unavailability of the product to exchange, the customer may choose another product.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Store Credit</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            In case the customer returns the product and does not want to buy any other product, the refund will be provided in the form of store credit of the same value as the order. The customer can redeem the store credit anytime in the future through our website www.angelfashionstudio.org on the checkout page. Please note, the store credit refund will not include the shipping cost.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Return & Exchange Shipping Costs</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm font-medium leading-relaxed text-bronze/70">
                            <li>In case of a defective product delivered, the shipping cost is to be borne by Angel Fashion Studio for both sending the parcel back to us and the new item to be shipped in exchange.</li>
                            <li>Please contact Angel Fashion Studio to arrange the return. Any unreasonable return shipping cost will not be covered by Angel Fashion Studio.</li>
                            <li>In case of wrong size ordered or change of mind, the shipping cost is to be borne by the customer for both sending the parcel back to us and the new item to be shipped in exchange.</li>
                            <li>If the original order was placed for regular post, the new product will be sent through regular post only.</li>
                            <li>If the original order was placed for express post, the new product will be sent through express post only.</li>
                            <li>Customers can request to upgrade to express post for the exchanged products by paying the additional charges for express.</li>
                            <li>All parcels are required to be sent with tracking post only. Customers are required to share the tracking details with Angel Fashion Studio for the exchanged products.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default RefundPolicyPage;
