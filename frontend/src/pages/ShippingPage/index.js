import React, { useEffect } from 'react';
import { ArchivePageHero } from '../../components/archive';

const ShippingPage = () => {
    useEffect(() => {
        document.title = 'Angel Fashion Studio | Shipping Policy';
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="bg-champagne font-body min-h-screen">
            <ArchivePageHero title="Shipping Policy" />
            <section className="py-20 px-8 lg:px-24">
                <div className="container mx-auto max-w-3xl space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Pricing</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm font-medium leading-relaxed text-bronze/70">
                            <li>Regular Post — $8 for any size of order anywhere in Australia</li>
                            <li>Express Post — $18 for any size of order anywhere in Australia</li>
                        </ul>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Estimated Delivery Times</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">Regular Post:</p>
                        <ul className="list-disc list-inside space-y-2 text-sm font-medium leading-relaxed text-bronze/70">
                            <li>NSW — 3-5 Days</li>
                            <li>ACT — 3-5 Days</li>
                            <li>VIC — 4-6 Days</li>
                            <li>QLD — 4-6 Days</li>
                            <li>WA — 8-10 Days</li>
                            <li>SA — 6-8 Days</li>
                            <li>NT — 8-10 Days</li>
                            <li>TAS — 8-10 Days</li>
                            <li>Regional Australia — Above time frame +(2-3 Days)</li>
                        </ul>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">Express Post:</p>
                        <ul className="list-disc list-inside space-y-2 text-sm font-medium leading-relaxed text-bronze/70">
                            <li>Next Day anywhere in Australia (if ordered before 2 pm AEST) — (90%)</li>
                            <li>2 Days anywhere in Australia (if ordered before 2 pm AEST) — (98%)</li>
                            <li>Regional Australia — Above time frame +(0-1 Days)</li>
                        </ul>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            Please Note: The delivery timelines are rough estimates based on our everyday experience with the service providers. The orders may reach earlier or later than the mentioned period.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Shipping Guidelines</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm font-medium leading-relaxed text-bronze/70">
                            <li>The shipping options are provided at the checkout.</li>
                            <li>The orders are prepared and booked for delivery on the same day or the very next day after receiving the order.</li>
                            <li>The express orders are always shipped on the same day if ordered before 2 pm of the day as per AEST.</li>
                            <li>We use integrated mailing services for a smooth delivery experience. All the shipping options provided on the website have the feature to track the order.</li>
                            <li>You will receive the tracking updates in your email. If you face any issues in receiving the tracking emails, you can contact us through the chat option on the website.</li>
                            <li>Occasional offers on shipping are posted on our Facebook and Instagram pages. Please follow to be in touch and stay updated with the latest offers.</li>
                        </ul>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Free Shipping</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            Orders over $200 qualify for free standard (Regular Post) shipping anywhere in Australia.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Delays</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            Please note, that we use third-party services for shipping your products. All the current delay times from each delivery service provider apply to all the orders. We may provide you the estimated delivery time for your order based on past experience and general guidelines by the delivery service providers, but that should never be taken as the promised date of delivery. If your order does not reach on a specific day (e.g. your special day of the wedding, engagement, etc.), we hold no responsibility for the delay. If you are in urgency, please plan early and choose the express post. Angel Fashion Studio holds no responsibility for the delay of any order beyond the expected time frame but can help the customer to escalate the issue with the delivery services. As a part of our customer service commitment, Angel Fashion Studio will help you to resolve any issue related to the delayed orders.
                        </p>
                    </div>
                    <div className="h-px bg-bronze/10" />
                    <div className="space-y-4">
                        <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Lost Orders During Shipping</h3>
                        <p className="text-sm font-medium leading-relaxed text-bronze/70">
                            In case the order does not reach even after a long wait, customers are suggested to escalate the issue with Angel Fashion Studio through the chat option on the website. We can check the progress on the delivery and in case the order is confirmed as lost during the shipping, orders are by default insured for up to $100. The insured amount will be transferred to the customer after Angel Fashion Studio receives the refund from the delivery service provider.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ShippingPage;
