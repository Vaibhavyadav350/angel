/**
 * Generate Client Review Excel — Angel Fashion Studio
 *
 * End-to-end website mapping: every page, every section, every link, every line of
 * copy, so the client can review and mark up what she wants changed.
 *
 * Reads taxonomy.json and shipping.json from the frontend so the workbook can never
 * drift from what the live site is configured to do.
 *
 * Run from anywhere:  node docs/generate_client_excel.js
 */
const path = require('path');
const XLSX = require(path.join(__dirname, '..', 'frontend', 'node_modules', 'xlsx'));
const taxonomy = require('../frontend/src/utils/taxonomy.json');
const shippingConfig = require('../frontend/src/utils/shipping.json');
const wb = XLSX.utils.book_new();

// Helper
const addSheet = (name, data, colWidths) => {
  const ws = XLSX.utils.aoa_to_sheet(data);
  if (colWidths) ws['!cols'] = colWidths.map(w => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws, name);
};

// ===================== SHEET 1: HOME PAGE =====================
addSheet('1. Home Page', [
  ['SECTION', 'COMPONENT', 'CURRENT CONTENT', 'IMAGE / ASSET', 'LINKS TO (URL)', 'MAPPED TO PRODUCTS?', 'CLIENT NOTES (FILL THIS)'],
  // Hero Slider
  ['Hero Slider — Slide 1', 'Label', 'HAUTE COUTURE', '/assets/landing/hero_slide_1.jpg', '/products?category=Women&subCategory=LEHENGAS', 'YES — shows Lehengas', ''],
  ['', 'Title', 'THE BRIDAL EDIT', '', '', '', ''],
  ['', 'Button Text', 'SHOP COLLECTION', '', '', '', ''],
  ['Hero Slider — Slide 2', 'Label', 'FESTIVE ARCHIVE', '/assets/landing/hero_slide_2.jpg', '/products?category=Women&subCategory=SAREES', 'YES — shows Sarees', ''],
  ['', 'Title', 'THE ROYAL SAREE', '', '', '', ''],
  ['', 'Button Text', 'EXPLORE NOW', '', '', '', ''],
  ['Hero Slider — Slide 3', 'Label', 'MENS HERITAGE', '/assets/landing/hero_slide_3.jpg', '/products?category=Men', 'YES — shows Men', ''],
  ['', 'Title', 'THE REGAL GROOM', '', '', '', ''],
  ['', 'Button Text', 'VIEW CATALOG', '', '', '', ''],
  [],
  // Circular Categories
  ['Circular Category 1', 'Label', 'A-LINE', '/assets/landing/circ-aline.jpg', '/products?category=Women&subCategory=LEHENGAS', 'YES — Lehengas', ''],
  ['Circular Category 2', 'Label', 'FISHTAIL', '/assets/landing/circ-fishtail.jpg', '/products?category=Women&subCategory=LEHENGAS&productType=Partywear Lehengas', 'YES — Partywear Lehengas', ''],
  ['Circular Category 3', 'Label', 'BANARASI', '/assets/landing/circ-banarasi.jpg', '/products?category=Women&subCategory=SAREES&productType=WEDDING SAREES', 'YES — Wedding Sarees', ''],
  ['Circular Category 4', 'Label', 'SILK', '/assets/landing/circ-silk.jpg', '/products?category=Women&subCategory=SAREES', 'YES — Sarees', ''],
  ['Circular Category 5', 'Label', 'VELVET', '/assets/landing/circ-velvet.jpg', '/products?category=Women&subCategory=SALWAR KAMEEZ&productType=palazzo suits', 'YES — Palazzo Suits', ''],
  ['Circular Category 6', 'Label', 'GEORGETTE', '/assets/landing/circ-georgette.jpg', '/products?category=Women&subCategory=SALWAR KAMEEZ&productType=Anarkali suits', 'YES — Anarkali Suits', ''],
  ['Circular Category 7', 'Label', 'NET', '/assets/landing/circ-net.jpg', '/products?category=Women&subCategory=SALWAR KAMEEZ&productType=sharara suits', 'YES — Sharara Suits', ''],
  ['Circular Category 8', 'Label', 'ORGANZA', '/assets/landing/circ-organza.jpg', '/products?category=Women&subCategory=SAREES&productType=casual wear', 'YES — Casual Sarees', ''],
  ['', 'NOTE', 'These 8 labels are FABRIC names but products are not classified by fabric. Each circle now points to a real clothing type. Client to confirm whether to rename the labels (e.g. ANARKALI, SAREES, SHERWANI).', '', '', '', ''],
  [],
  // Occasions Strip
  ['Occasion 1', 'Title', 'The Wedding Edit', '/assets/landing/occ-wedding.jpg', '/products?category=Women&subCategory=LEHENGAS', 'YES', ''],
  ['', 'Subtitle', 'Bridal Lehengas & Sarees', '', '', '', ''],
  ['Occasion 2', 'Title', 'Haldi & Mehendi', '/assets/landing/occ-haldi.jpg', '/products?category=Women&subCategory=SALWAR+KAMEEZ', 'YES', ''],
  ['', 'Subtitle', 'Vibrant Traditions', '', '', '', ''],
  ['Occasion 3', 'Title', 'Festive Season', '/assets/landing/occ-evening.jpg', '/products?category=Women&subCategory=SAREES', 'YES', ''],
  ['', 'Subtitle', 'Contemporary Elegance', '', '', '', ''],
  ['Occasion 4', 'Title', 'Mens Heritage', '/assets/landing/occ-mens.jpg', '/products?category=Men&subCategory=SHERWANIS', 'YES', ''],
  ['', 'Subtitle', 'Classic Sherwanis', '', '', '', ''],
  [],
  // Category Showcase
  ['Category Showcase — Women', 'LEHENGAS cards', 'Bridal (PALACE) / Partywear (MODERN) / Indo Western (FUSION)', '/assets/landing/catalog/subcat_*.jpg', 'Each card opens that product type', 'YES', ''],
  ['', 'SAREES cards', 'Wedding (HEAVY) / Casual (MINIMAL)', '/assets/landing/catalog/subcat_*.jpg', 'Each card opens that product type', 'YES', ''],
  ['', 'SALWAR KAMEEZ cards', 'Anarkali / Gharara / Sharara / Pakistani / Palazzo / Pant Suit / Punjabi / Kurti', '/assets/landing/catalog/subcat_*.jpg', 'Each card opens that product type', 'YES', ''],
  ['Category Showcase — Men', 'SHERWANIS cards', 'Classic Sherwani (GROOM) / Indowestern (FUSION)', '/assets/landing/catalog/subcat_*.jpg', 'Each card opens that product type', 'YES', ''],
  ['', 'JACKET cards', 'Jacket Sets (MODERN) / Jodhpuri (ROYAL)', '/assets/landing/catalog/subcat_*.jpg', 'Each card opens that product type', 'YES', ''],
  ['', 'KURTAS cards', 'Kurta Pajama / Long Kurta / Short Kurta', '/assets/landing/catalog/subcat_*.jpg', 'Each card opens that product type', 'YES', ''],
  [],
  // Customer Diaries
  ['Customer Diaries 1', 'Quote', 'A moment of pure joy captured in our intricately embroidered crimson suit! The fit is an absolute dream.', '/assets/landing/diaries/diary_red_suit.jpg', 'No link', 'NO — placeholder review', ''],
  ['', 'Author', 'Simran Kaur (@simran_vibes)', '', '', '', ''],
  ['Customer Diaries 2', 'Quote', 'Stunning in our signature magenta draped saree. The heritage gold embroidery completely stole the show tonight.', '/assets/landing/diaries/diary_magenta_saree.jpg', 'No link', 'NO — placeholder review', ''],
  ['', 'Author', 'Ayesha S. (Verified Buyer)', '', '', '', ''],
  ['Customer Diaries 3', 'Quote', 'Finding the perfect fit in-store! This beautiful ombre teal lehenga was literally made for her.', '/assets/landing/diaries/diary_teal_lehenga.jpg', 'No link', 'NO — placeholder review', ''],
  ['', 'Author', 'Emma C. (@emma.style)', '', '', '', ''],
  ['Customer Diaries 4', 'Quote', 'A picture-perfect engagement. Breathtaking in our custom ivory bridal lehenga alongside her regal groom.', '/assets/landing/diaries/diary_couple_ivory.jpg', 'No link', 'NO — placeholder review', ''],
  ['', 'Author', 'Priya & Rohan (Angel Bride)', '', '', '', ''],
  [],
  // Shop By Category arch cards
  ['Shop by Category 1', 'Bridal Lehengas', 'Traditional · Modern · Luxe', '/assets/landing/cat-lehenga.jpg', '/products?category=Women&subCategory=LEHENGAS', 'YES', ''],
  ['Shop by Category 2', 'Pure Silk Sarees', 'Banarasi · Silk · Heritage', '/assets/landing/cat-saree.jpg', '/products?category=Women&subCategory=SAREES', 'YES', ''],
  ['Shop by Category 3', 'Salwar Kameez', 'Anarkali · Suits · Kurti', '/assets/landing/cat-anarkali.jpg', '/products?category=Women&subCategory=SALWAR+KAMEEZ', 'YES', ''],
  ['Shop by Category 4', 'Sherwanis', 'Classic · Indo-Western', '/assets/landing/cat-sherwani.jpg', '/products?category=Men&subCategory=SHERWANIS', 'YES', ''],
  ['Shop by Category 5', 'Mens Kurtas', 'Casual · Festive Wear', '/assets/landing/hero-men.jpg', '/products?category=Men&subCategory=KURTAS', 'YES', ''],
  ['Shop by Category 6', 'Kids Wear', 'Boys · Girls Collections', '/assets/landing/cat-kids.jpg', '/products?category=Kids', 'LINK OK — no products uploaded yet', ''],
  ['Shop by Category 7', 'Fine Jewelry', 'Bridal · Casual Wear', '/assets/landing/cat-jewelry.jpg', '/products?category=Jewelry', 'YES', ''],
  ['Shop by Category 8', 'New Arrivals', 'Fresh Style · Just In', '/assets/landing/hero-lehenga.jpg', '/products?collection=new+arrivals', 'YES — tag driven', ''],
  ['Shop by Category 9', 'The Sale', 'Limited Time · Best Value', '/assets/landing/cat-lehenga.jpg', '/products?collection=sale', 'YES — tag driven', ''],
  [],
  // Trust + Newsletter
  ['Trust Bar', 'Item 1', 'Free Regular Post over $200', '', '', '', ''],
  ['', 'Item 2', '48-Hour Exchange Window', '', '', '', ''],
  ['', 'Item 3', 'Authentic Handcrafted', '', '', '', ''],
  ['', 'Item 4', 'WhatsApp Support', '', '', '', ''],
  ['Newsletter', 'Title', 'STAY CONNECTED', '', 'Collects email addresses', '', ''],
  ['', 'Subtitle', 'Exclusive access to heritage drops', '', '', '', ''],
], [26, 18, 95, 42, 62, 34, 30]);


// ===================== SHEET 2: TAXONOMY =====================
const taxonomyData = [
  ['CATEGORY', 'SUB-CATEGORY', 'PRODUCT TYPE (Admin dropdown value)', 'HOW ADMIN ADDS THIS', 'CLIENT NOTES (FILL THIS)'],
];
Object.entries(taxonomy.categories).forEach(([category, subs]) => {
  Object.entries(subs).forEach(([subCategory, types]) => {
    types.forEach((type, i) => {
      taxonomyData.push([
        i === 0 ? category : '',
        i === 0 ? subCategory : '',
        type,
        i === 0 ? `Admin Panel → Category: ${category} → Sub-Category: ${subCategory} → Product Type: ${type}` : '',
        '',
      ]);
    });
  });
  taxonomyData.push([]);
});
taxonomyData.push(['NOTE:', 'This tree is the single source of truth. The navbar mega-menu, the sidebar filters, the admin dropdowns and the database validation all read from it automatically.', '', '', '']);
taxonomyData.push(['NOTE:', 'Adding or renaming anything here changes the website AND the admin panel at the same time. Existing products keep the old value until they are re-saved.', '', '', '']);
addSheet('2. Taxonomy', taxonomyData, [12, 20, 30, 80, 30]);


// ===================== SHEET 3: COLLECTIONS =====================
addSheet('3. Collections & Tags', [
  ['COLLECTION NAME', 'HOW ADMIN USES IT', 'WHERE IT APPEARS ON WEBSITE', 'CLIENT NOTES (FILL THIS)'],
  ['new arrivals', 'Admin checks "new arrivals" checkbox when adding/editing a product', 'Navbar "NEW ARRIVALS" link → /products?collection=new+arrivals | Shop by Category card "New Arrivals"', ''],
  ['sale', 'Admin checks "sale" checkbox when adding/editing a product', 'Navbar "SALE" link → /products?collection=sale | Shop by Category card "The Sale" | Sale badge on product cards', ''],
  ['best sellers', 'Admin checks "best sellers" checkbox', 'Appears in sidebar Collection filter dropdown', ''],
  ['ready to ship', 'Admin checks "ready to ship" checkbox', 'Appears in sidebar Collection filter dropdown', ''],
  ['plus sizes', 'Admin checks "plus sizes" checkbox', 'Footer link "Plus Sizes" → /products?collection=plus+sizes | Sidebar filter', ''],
  [],
  ['NOTE:', 'Collections are TAGS. A product can belong to multiple collections simultaneously.', '', ''],
  ['NOTE:', 'A product tagged both "sale" and "new arrivals" will appear in both sections.', '', ''],
  ['NOTE:', 'The "Featured" checkbox makes a product appear with a "Featured" badge on product cards.', '', ''],
  ['NOTE:', 'The "Trending" checkbox makes the product appear in the "Trending" carousel section.', '', ''],
  [],
  ['CURRENT USAGE:', '43 of 58 products are tagged "new arrivals", 52 are "best sellers", 55 are "ready to ship".', 'These sections therefore look almost identical to a shopper.', 'Recommend tagging only 8-12 products per collection.'],
], [18, 65, 70, 30]);


// ===================== SHEET 4: ABOUT PAGE =====================
addSheet('4. About Page', [
  ['SECTION', 'ELEMENT', 'CURRENT CONTENT', 'CLIENT NOTES (FILL THIS)'],
  ['Hero Banner', 'Page Title', 'About the Archive', ''],
  [],
  ['Our Story — Badge', 'Year', 'EST. 2024 MELBOURNE', ''],
  ['Our Story — Header', 'Label', 'SINCE 2024', ''],
  ['Our Story — Header', 'Title', 'OUR STORY', ''],
  ['Our Story', 'Paragraph 1', 'Born in the heart of India, Angel Archive began as a curated vision to preserve the vanishing techniques of traditional South Asian artisanship while defining a new era of global luxury.', ''],
  ['Our Story', 'Paragraph 2', 'As a premier India-based archive, we specialize in high-fashion heritage that transcends seasons. Our journey is one of preservation—archiving the techniques of master weavers and reimagining them for the modern connoisseur. Every garment in our collection is a testament to the enduring beauty of heritage textiles.', ''],
  ['Our Story', 'Location Tag', 'MELBOURNE', ''],
  ['', 'ISSUE', 'The copy says the business is India-based, but the store is in Truganina VIC. Client to confirm how the story should read.', ''],
  [],
  ['The Mission', 'Title', 'The Mission', ''],
  ['The Mission', 'Quote', '"To democratize high-fashion heritage by providing uncompromising quality and artisanal craftsmanship at accessible price points."', ''],
  ['The Mission', 'Stat 1', '100% — Ethical Sourcing', ''],
  ['The Mission', 'Stat 2', '200+ — Master Artisans', ''],
  [],
  ['Visit the Store', 'Title', 'Visit the Store', ''],
  ['Visit the Store', 'Address', 'Angel Fashion Studio, Unit 32/150 Palmers Road, Truganina VIC 3029, Australia', ''],
  ['Visit the Store', 'Phone', '+61 466 853 704', ''],
  ['Visit the Store', 'Email', 'support@angelfashionstudio.com', ''],
  ['Visit the Store', 'Google Maps', 'Interactive map embedded + "Open in Google Maps" button', ''],
  [],
  ['Shop the Look', 'Title', 'SHOP THE LOOK', ''],
  ['Shop the Look', 'Subtitle', 'The Royal Archival Ensemble', ''],
  ['Shop the Look', 'Hotspot 1', 'Archive Suite — Wedding Ensemble — $1,280', ''],
  ['Shop the Look', 'Hotspot 2', 'Velvet Overlay — Zari Handwork — $645', ''],
  ['', 'ISSUE', 'These two prices are hardcoded and not linked to real products. Client to confirm: link to real products or remove prices?', ''],
  [],
  ['Newsletter', 'Title', 'STAY CONNECTED', ''],
  ['Newsletter', 'Subtitle', 'Exclusive access to heritage drops', ''],
], [20, 14, 100, 30]);


// ===================== SHEET 5: CONTACT PAGE =====================
addSheet('5. Contact Page', [
  ['SECTION', 'ELEMENT', 'CURRENT CONTENT', 'CLIENT NOTES (FILL THIS)'],
  ['Hero', 'Page Title', 'Concierge', ''],
  [],
  ['Visit Us', 'Address Line 1', 'Angel Fashion Studio', ''],
  ['', 'Address Line 2', 'Unit 32/150 Palmers Road', ''],
  ['', 'Address Line 3', 'Truganina VIC 3029', ''],
  ['', 'Country', 'Australia', ''],
  [],
  ['Call Us', 'Phone Number', '+61 466 853 704', ''],
  [],
  ['Email', 'Email Address', 'support@angelfashionstudio.com', ''],
  [],
  ['Hours', 'Weekday', 'Monday – Saturday: 10am – 6pm', ''],
  ['', 'Weekend', 'Sunday: By Appointment Only', ''],
  [],
  ['Private Viewing', 'Title', 'Private Viewing', ''],
  ['', 'Text', 'For a personalised bridal or menswear consultation, we invite you to book a private viewing at our Melbourne atelier. Our stylists will curate a selection tailored to your occasion.', ''],
  ['', 'CTA', 'Please contact us via phone or email to schedule your appointment.', ''],
], [20, 16, 100, 30]);


// ===================== SHEET 6: PRIVACY POLICY =====================
addSheet('6. Privacy Policy', [
  ['SECTION HEADING', 'FULL CONTENT', 'CLIENT NOTES (FILL THIS)'],
  ['Information We Collect', 'We collect personal information you voluntarily provide when creating an account, placing an order, or contacting us. This includes your name, email address, shipping address, phone number, and payment information.', ''],
  ['How We Use Your Information', 'Your information is used to process orders, communicate about your purchases, improve our website experience, and send marketing communications (only with your consent). We never sell your personal data to third parties.', ''],
  ['Data Security', 'We use industry-standard encryption (SSL/TLS) to protect your data during transmission. Payment processing is handled securely through eWAY — we never store your full card details on our servers.', ''],
  ['Cookies', 'We use essential cookies to maintain your session and preferences. Analytics cookies help us understand how visitors interact with our site. You may disable cookies via your browser settings.', ''],
  ['Contact', 'For privacy-related enquiries, you can contact us through the chat option on our website or email us at support@angelfashionstudio.com.', ''],
], [25, 120, 30]);


// ===================== SHEET 7: REFUND POLICY =====================
addSheet('7. Return & Exchange', [
  ['SECTION HEADING', 'FULL CONTENT', 'CLIENT NOTES (FILL THIS)'],
  ['Return Policy', 'We do not take returns in case you change your mind. The products can be exchanged, or the store credit can be provided for the products you may not like.', ''],
  ['Exchange Requests', 'To request an exchange, please notify us within:\n• 48 hours of purchase (for orders picked up locally)\n• 48 hours after the product has been delivered (for orders shipped by post only)\n\nPlease Note: Angel Fashion Studio holds the right to refuse any request made for the return or exchange beyond the above-mentioned timeline.\n\nIn case of unavailability of the product to exchange, the customer may choose another product.', ''],
  ['Store Credit', 'In case the customer returns the product and does not want to buy any other product, the refund will be provided in the form of store credit of the same value as the order. The customer can redeem the store credit anytime in the future through our website www.angelfashionstudio.org on the checkout page. Please note, the store credit refund will not include the shipping cost.', ''],
  ['Return & Exchange Shipping Costs', '• In case of a defective product delivered, the shipping cost is to be borne by Angel Fashion Studio for both sending the parcel back to us and the new item to be shipped in exchange.\n• Please contact Angel Fashion Studio to arrange the return. Any unreasonable return shipping cost will not be covered by Angel Fashion Studio.\n• In case of wrong size ordered or change of mind, the shipping cost is to be borne by the customer for both sending the parcel back to us and the new item to be shipped in exchange.\n• If the original order was placed for regular post, the new product will be sent through regular post only.\n• If the original order was placed for express post, the new product will be sent through express post only.\n• Customers can request to upgrade to express post for the exchanged products by paying the additional charges for express.\n• All parcels are required to be sent with tracking post only. Customers are required to share the tracking details with Angel Fashion Studio for the exchanged products.', ''],
  [],
  ['ISSUE', 'This policy points customers to www.angelfashionstudio.org — client to confirm the correct domain.', ''],
], [30, 120, 30]);


// ===================== SHEET 8: SHIPPING POLICY =====================
addSheet('8. Shipping Policy', [
  ['SECTION HEADING', 'FULL CONTENT', 'CLIENT NOTES (FILL THIS)'],
  ['Pricing', '• Regular Post — $8 for any size of order anywhere in Australia\n• Express Post — $18 for any size of order anywhere in Australia', ''],
  ['Estimated Delivery Times — Regular Post', '• NSW — 3-5 Days\n• ACT — 3-5 Days\n• VIC — 4-6 Days\n• QLD — 4-6 Days\n• WA — 8-10 Days\n• SA — 6-8 Days\n• NT — 8-10 Days\n• TAS — 8-10 Days\n• Regional Australia — Above time frame +(2-3 Days)', ''],
  ['Estimated Delivery Times — Express Post', '• Next Day anywhere in Australia (if ordered before 2 pm AEST) — (90%)\n• 2 Days anywhere in Australia (if ordered before 2 pm AEST) — (98%)\n• Regional Australia — Above time frame +(0-1 Days)\n\nPlease Note: The delivery timelines are rough estimates based on our everyday experience with the service providers.', ''],
  ['Shipping Guidelines', '• The shipping options are provided at the checkout.\n• The orders are prepared and booked for delivery on the same day or the very next day after receiving the order.\n• The express orders are always shipped on the same day if ordered before 2 pm of the day as per AEST.\n• We use integrated mailing services for a smooth delivery experience. All the shipping options provided on the website have the feature to track the order.\n• You will receive the tracking updates in your email. If you face any issues in receiving the tracking emails, you can contact us through the chat option on the website.\n• Occasional offers on shipping are posted on our Facebook and Instagram pages. Please follow to be in touch and stay updated with the latest offers.', ''],
  ['Free Shipping', 'Orders over $200 qualify for free standard (Regular Post) shipping anywhere in Australia.', ''],
  ['Delays', 'Please note, that we use third-party services for shipping your products. All the current delay times from each delivery service provider apply to all the orders. We may provide you the estimated delivery time for your order based on past experience and general guidelines by the delivery service providers, but that should never be taken as the promised date of delivery. If your order does not reach on a specific day (e.g. your special day of the wedding, engagement, etc.), we hold no responsibility for the delay. If you are in urgency, please plan early and choose the express post. Angel Fashion Studio holds no responsibility for the delay of any order beyond the expected time frame but can help the customer to escalate the issue with the delivery services.', ''],
  ['Lost Orders During Shipping', 'In case the order does not reach even after a long wait, customers are suggested to escalate the issue with Angel Fashion Studio through the chat option on the website. We can check the progress on the delivery and in case the order is confirmed as lost during the shipping, orders are by default insured for up to $100. The insured amount will be transferred to the customer after Angel Fashion Studio receives the refund from the delivery service provider.', ''],
  [],
], [35, 120, 30]);


// ===================== SHEET 9: TERMS =====================
addSheet('9. Terms & Conditions', [
  ['SECTION HEADING', 'FULL CONTENT', 'CLIENT NOTES (FILL THIS)'],
  ['General', 'By accessing and using the Angel Fashion Studio website, you agree to be bound by these Terms & Conditions. We reserve the right to update these terms at any time without prior notice.', ''],
  ['Orders & Payment', 'All prices are displayed in Australian Dollars (AUD) and include applicable taxes unless stated otherwise. We reserve the right to cancel any order due to product availability, pricing errors, or suspected fraud. Payment is processed securely via eWAY.', ''],
  ['Product Information', 'We strive to display product images as accurately as possible. However, colours may vary slightly due to screen settings. Product descriptions are for general informational purposes and may vary from the actual product in minor details.', ''],
  ['Intellectual Property', 'All content on this website — including text, images, logos, and designs — is the property of Angel Fashion Studio and is protected by copyright law. Reproduction, distribution, or use without written permission is strictly prohibited.', ''],
  ['Limitation of Liability', 'Angel Fashion Studio shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or purchase of our products. Our total liability shall not exceed the amount paid for the product in question.', ''],
  ['Governing Law', 'These terms shall be governed by and construed in accordance with the laws of Australia. Any disputes shall be subject to the exclusive jurisdiction of the courts of Victoria, Australia.', ''],
], [25, 120, 30]);


// ===================== SHEET 10: NAVIGATION & FOOTER =====================
addSheet('10. Navigation & Footer', [
  ['LOCATION', 'LINK TEXT', 'URL / DESTINATION', 'WORKS CORRECTLY?', 'CLIENT NOTES (FILL THIS)'],
  ['— NAVBAR MAIN LINKS —', '', '', '', ''],
  ['Navbar', 'Women (mega-menu)', 'Opens dropdown with SALWAR KAMEEZ / SAREES / LEHENGAS', 'YES — dynamic from taxonomy', ''],
  ['Navbar', 'Men (mega-menu)', 'Opens dropdown with SHERWANIS / JACKET / KURTAS', 'YES — dynamic from taxonomy', ''],
  ['Navbar', 'Kids (mega-menu)', 'Opens dropdown with Girls / Boys', 'LINK OK — no Kids products uploaded yet', ''],
  ['Navbar', 'Jewelry (mega-menu)', 'Opens dropdown with Bridal / Necklaces / Chokers / Earrings / Bracelets / Rings / Casual', 'PARTLY — Necklaces, Bracelets, Rings have no products', ''],
  ['Navbar', 'NEW ARRIVALS', '/products?collection=new+arrivals', 'YES', ''],
  ['Navbar', 'SALE', '/products?collection=sale', 'YES', ''],
  [],
  ['— FOOTER: SHOP WOMEN —', '', '', '', ''],
  ['Footer', 'Salwar Kameez', '/products?category=Women&subCategory=SALWAR+KAMEEZ', 'YES', ''],
  ['Footer', 'Silk Sarees', '/products?category=Women&subCategory=SAREES', 'YES', ''],
  ['Footer', 'Bridal Lehengas', '/products?category=Women&subCategory=LEHENGAS', 'YES', ''],
  ['Footer', 'Plus Sizes', '/products?collection=plus+sizes', 'YES', ''],
  ['Footer', 'New Arrivals', '/products?collection=new+arrivals', 'YES', ''],
  [],
  ['— FOOTER: SHOP MEN & KIDS —', '', '', '', ''],
  ['Footer', 'Classic Sherwanis', '/products?category=Men&subCategory=SHERWANIS', 'YES', ''],
  ['Footer', 'Indo Western', '/products?category=Women&subCategory=LEHENGAS&productType=Indo+Western', 'YES', ''],
  ['Footer', 'Girls Ethnic', '/products?category=Kids', 'LINK OK — no products yet', ''],
  ['Footer', 'Boys Ethnic', '/products?category=Kids', 'LINK OK — no products yet', ''],
  ['Footer', "Men's Jackets", '/products?category=Men&subCategory=JACKET', 'YES', ''],
  [],
  ['— FOOTER: LEGAL & SUPPORT —', '', '', '', ''],
  ['Footer', 'Shipping Policy', '/shipping', 'YES', ''],
  ['Footer', 'Privacy Policy', '/privacy-policy', 'YES', ''],
  ['Footer', 'Refund Policy', '/refund-policy', 'YES', ''],
  ['Footer', 'Terms & Conditions', '/terms', 'YES', ''],
  ['Footer', 'Contact Us', '/contact', 'YES', ''],
  [],
  ['— FOOTER: OUR STUDIO —', '', '', '', ''],
  ['Footer', 'About Us', '/about', 'YES', ''],
  ['Footer', 'Our Heritage', '/about', 'YES', ''],
  ['Footer', 'Store Locator', '/contact', 'YES', ''],
  ['Footer', 'Wholesale', '/contact', 'YES', ''],
  [],
  ['Footer', 'Instagram button', 'https://www.instagram.com/angiafs/', 'YES — now opens the real page', ''],
  ['Footer', 'Facebook button', 'https://www.facebook.com/p/Angel-Fashion-Studio-61552253573789/', 'YES — now opens the real page', ''],
  ['Footer Bottom', 'Copyright', '© 2025 ANGEL FASHION STUDIO. ALL RIGHTS RESERVED.', 'Client to confirm the year', ''],
], [22, 20, 60, 45, 30]);


// ===================== SHEET 11: GLOBAL TEXT =====================
addSheet('11. Global Text', [
  ['LOCATION', 'ELEMENT', 'CURRENT TEXT', 'CLIENT NOTES (FILL THIS)'],
  ['Announcement Bar (top of every page)', 'Scrolling Message', 'FREE REGULAR POST AUSTRALIA-WIDE ON ORDERS OVER $200 — EST. 2024 — MELBOURNE — BESPOKE CUSTOM STITCHING AVAILABLE ON ALL GARMENTS', ''],
  [],
  ['Trust Signals Bar', 'Signal 1', 'Australia-Wide Post — Free Regular Post over $200', ''],
  ['', 'Signal 2', 'Exchanges — Request within 48 hours of delivery', ''],
  ['', 'Signal 3', 'Heritage Craft — Handwoven by artisans since 2024', ''],
  [],
  ['Trust Bar (Home)', 'Item 1', 'Free Regular Post over $200', ''],
  ['', 'Item 2', '48-Hour Exchange Window', ''],
  ['', 'Item 3', 'Authentic Handcrafted', ''],
  ['', 'Item 4', 'WhatsApp Support', ''],
  [],
  ['Product Detail Page', 'Shipping & Returns tab', 'Regular Post $8 and Express Post $18 anywhere in Australia, with free Regular Post on orders over $200. Regular delivery is 3-10 business days depending on your state; Express is next day to two days if ordered before 2pm AEST. We do not accept change-of-mind returns - exchanges or store credit can be requested within 48 hours of delivery. Custom-stitched orders are non-returnable.', ''],
  [],
  ['Footer Brand Tagline', 'Text', 'Exquisite hand-spun garments tailored for the modern spirit.', ''],
  [],
  ['Products Page Hero', 'Established', 'Established 2024', ''],
  ['Login Page', 'Established', 'Est. 2024', ''],
  ['Cart Page', 'Established', 'EST. 2024 // BRIDAL & MENSWEAR', ''],
], [35, 20, 110, 30]);


// ===================== SHEET 12: ISSUES & ACTION ITEMS =====================
addSheet('12. Needs Your Decision', [
  ['#', 'WHAT WE NEED FROM YOU', 'WHERE', 'WHY IT MATTERS', 'WHAT WE SUGGEST', 'YOUR DECISION (FILL THIS)'],

  ['1', 'Enter stock quantities for the products that show as sold out.', 'Admin Panel > Products', '25 of your 58 products have no quantity entered against any size or colour, so customers can see them but cannot buy them.', 'Open each product and type the quantity for each size and colour.', ''],

  ['2', 'Enter your cost price for each product.', 'Admin Panel > Products > Cost Price', 'There is now a private Cost Price box on every product. Once filled in, each product shows your profit and profit percentage, and warns you if a discount would sell below cost. Customers never see it.', 'Fill it in as you go, starting with your best sellers.', ''],

  ['3', 'Reduce how many products are tagged into each section.', 'Admin Panel > Products > Collections', 'You have 43 products tagged New Arrivals, 52 as Best Sellers and 55 as Ready To Ship, out of 58. Every section shows almost the same products, so none of them feels special.', 'Pick roughly 8-12 products per section and untick the rest.', ''],

  ['4', 'Replace or remove the four customer reviews on the home page.', 'Home Page > Customer Diaries', 'The names, quotes and photos are invented. Showing made-up reviews as real customers can breach Australian consumer law.', 'Send us real reviews and photos. Until then we recommend hiding the section.', ''],

  ['5', 'Decide what happens to the empty parts of your menu.', 'Kids, and Jewellery > Necklaces, Bracelets, Rings', 'These have no products, so a shopper clicking them sees "New pieces arriving soon".', 'Either upload products there, or tell us to remove those menu entries.', ''],

  ['6', 'Confirm how your story should read.', 'About Page > Our Story', 'It currently says the business was born in the heart of India and is a premier India-based archive, but your shop is in Truganina, Victoria.', 'Tell us how you would like it written and we will rewrite it.', ''],

  ['7', 'Confirm the two prices in Shop the Look.', 'About Page > Shop the Look', 'It shows $1,280 and $645, which are not linked to any real product. A customer may expect to buy at those prices.', 'Either point them at real products or remove the prices.', ''],

  ['8', 'Confirm your website address and the copyright year.', 'Refund Policy, Footer', 'The refund policy sends customers to www.angelfashionstudio.org and the footer says 2025.', 'Tell us the correct address and year.', ''],

  ['9', 'Decide whether to rename the eight round photos on the home page.', 'Home Page > Round Photos', 'They are labelled by fabric (Silk, Velvet, Net, Organza), but your products are not sorted by fabric. Each one now points at a real clothing type that has products in it.', 'Either keep them, or let us rename them to match your categories (Anarkali, Sarees, Sherwani and so on).', ''],

  ['10', 'Decide whether to charge extra for WA, NT and TAS.', 'Delivery settings', 'Posting to those states costs you more and takes 8-10 days. The setting is built and switched off. Turning it on would contradict your published line "$8 for any size of order anywhere in Australia".', 'If you want it on, we will reword the shipping policy to match.', ''],

  ['11', 'Send us the content you want for the home page banners and category tiles.', 'Home Page', 'The three large banners and the category tiles are fixed images and wording chosen by us. The admin screens that appeared to control them have been removed, because nothing entered there ever reached the website.', 'Send the images and wording you want and we will put them live. If you would like to manage them yourself in future, we can build that properly.', ''],
], [4, 78, 44, 100, 82, 32]);


// ===================== SHEET 13: SHIPPING & PRICING SETTINGS =====================
const kg = (g) => `${(g / 1000).toFixed(1).replace('.0', '')} kg`;

const shippingRows = [
  ['SETTING', 'CURRENT VALUE', 'WHAT IT MEANS', 'WHERE YOU CHANGE IT', 'YOUR NOTES (FILL THIS)'],

  ['— DELIVERY PRICE BY PARCEL SIZE —', '', '', '', ''],
];

shippingConfig.bands.forEach((b) => {
  shippingRows.push([
    b.label,
    `Regular $${b.standard}  ·  Express $${b.express}`,
    `What a customer pays when everything they ordered fits within ${kg(b.maxGrams)}.`,
    'Admin Panel → Settings → Delivery Price by Parcel Weight',
    '',
  ]);
});

shippingRows.push(
  ['Orders bigger than ' + kg(shippingConfig.quoteAboveGrams), 'We quote by hand', 'The customer cannot check out. They are shown your email and phone number and asked for a delivery quote, so a wholesale-size order is never posted for a normal delivery fee.', 'Admin Panel → Settings', ''],
  [],

  ['— FREE DELIVERY —', '', '', '', ''],
  ['Order value for free delivery', '$200', 'Once the customer is paying $200 or more (after any discount or coupon), you cover the standard $8 delivery. Ordinary orders become completely free. On a very large parcel you still cover $8 and the customer pays the rest, so free delivery can never cost you more than $8.', 'Admin Panel → Settings → Free Standard Over', ''],
  ['Free delivery on Express', 'No', 'Express Post is never free. Customers who want it next day pay for it.', 'Admin Panel → Settings', ''],
  [],

  ['— HOW PARCEL SIZE IS DECIDED —', '', '', '', ''],
  ['', '', 'You never type in a weight. The website works out the parcel size from what was ordered, using the typical weight of each kind of item below. If you ever need to correct one product, there is an optional weight box on the product itself.', '', ''],
);

Object.entries(shippingConfig.categoryWeights).forEach(([key, grams]) => {
  shippingRows.push([
    key.replace('.', ' → '),
    `${grams} g each`,
    `A ${key.split('.').pop()} item counts as ${grams} grams when working out the parcel size.`,
    'Ask us to change this',
    '',
  ]);
});

shippingRows.push(
  ['Anything else', `${shippingConfig.defaultWeightGrams} g each`, 'Used if an item does not match any of the above.', 'Ask us to change this', ''],
  [],

  ['— EXTRA CHARGES —', '', '', '', ''],
  ['WA / NT / TAS surcharge', 'Off ($0)', 'Post to Western Australia, the Northern Territory and Tasmania costs you more and takes 8-10 days. You can add a small surcharge for those states. It is switched OFF right now, because your published policy promises "$8 for any size of order anywhere in Australia" — that line would need rewording first.', 'Admin Panel → Settings → WA / NT / TAS Surcharge', ''],
  ['Maximum delivery charge', `$${shippingConfig.maxShippingCharge}`, 'A safety limit. No customer can ever be charged more than this for delivery, even if something goes wrong.', 'Admin Panel → Settings → Maximum Delivery Charge', ''],
  [],

  ['— PRICES AND TAX —', '', '', '', ''],
  ['Currency', 'Australian Dollars', 'All prices on the website are in AUD.', 'Fixed', ''],
  ['GST', '10%, already included', 'The price a customer sees is the price they pay. GST is inside that price, never added at the end.', 'Admin Panel → Settings → GST Rate', ''],
  ['Product discount', 'Set per product', 'You can mark down any single product by a percentage. New products now start at 0% — previously they were being marked down 20% automatically unless you changed it.', 'Admin Panel → Products → edit a product', ''],
  ['Coupon codes', 'None created yet', 'Coupons come off the order before delivery is worked out, so a coupon that takes an order below $200 also removes the free delivery.', 'Admin Panel → Promotions', ''],
  [],

  ['— WHAT A CUSTOMER WILL ACTUALLY PAY —', '', '', '', ''],
  ['One pair of earrings ($28)', '$5 delivery', 'Small, light order.', '', ''],
  ['Ten pairs of earrings ($50)', '$8 delivery', 'Still light enough to go in one satchel.', '', ''],
  ['One suit ($67)', '$8 delivery', 'Standard single-garment order.', '', ''],
  ['One lehenga ($260)', 'FREE delivery', 'Over $200, so you cover it.', '', ''],
  ['Three suits ($202)', '$6 delivery', 'Over $200, so $8 comes off the $14 parcel price.', '', ''],
  ['Ten lehengas ($2,600)', '$27 delivery', 'A 20 kg parcel. You still cover $8 of it.', '', ''],
  ['Thirty lehengas', 'Quote by hand', 'Too big to post automatically — the customer contacts you.', '', ''],
  [],

  ['— DELIVERY TIME SHOWN TO CUSTOMERS —', '', '', '', ''],
  ['Made-to-order items', 'Shown before delivery time', 'Almost all of your products are made to order. The checkout now says "Made in X days, then 3-10 business days" instead of promising next-day delivery on something that has not been sewn yet.', 'Admin Panel → Products → Lead Time', ''],
);

addSheet('13. Shipping & Pricing', shippingRows, [42, 30, 105, 48, 30]);


const outFile = path.join(__dirname, 'Angel_Fashion_Studio_Client_Review.xlsx');
XLSX.writeFile(wb, outFile);
console.log(`Written: ${outFile} (13 sheets)`);
