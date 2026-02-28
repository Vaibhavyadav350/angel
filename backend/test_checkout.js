async function testCheckout() {
    try {
        // 1. Fetch a product
        const productsRes = await fetch('http://localhost:5000/api/product');
        const productsData = await productsRes.json();
        const products = productsData.data;
        if (!products || products.length === 0) {
            console.log('No products found to test.');
            return;
        }
        const product = products[0];

        // 2. Mock a cart
        const cart = [
            {
                id: product._id + 'ColorSize',
                productId: product._id,
                name: product.name,
                color: 'Red',
                size: 'L',
                amount: 1,
                // Intentionally testing a relative image URL to ensure our backend fix works
                image: '/images/test-relative-image.png',
                price: product.price,
            }
        ];

        // 3. Make the checkout request
        const response = await fetch('http://localhost:5000/api/payment/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cart,
                shipping_fee: 15,
                total_amount: product.price,
                shipping: {
                    name: 'Test User',
                    phone_number: '1234567890',
                    address: { line1: '123 Fake St', postal_code: '12345', city: 'Testville', state: 'TS', country: 'AU' }
                },
                discountAmount: 0,
                email: 'test@example.com'
            })
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
            console.log('--- TEST SUCCESS ---');
            console.log('Created Checkout Session URL:');
            console.log(responseData.url);
            console.log('The "NOT A VALID URL" error from Stripe has been successfully bypassed by our relative image fix.');
        } else {
            console.error('--- TEST FAILED ---');
            console.error(responseData);
        }
    } catch (e) {
        console.error('--- TEST ERROR ---');
        console.error(e.message);
    }
}

testCheckout();
