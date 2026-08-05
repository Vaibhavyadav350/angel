/**
 * Generate Client Review Excel — Angel Fashion Studio
 *
 * End-to-end website mapping: every page, every section, every link, every line of
 * copy, so the client can review and mark up what she wants changed.
 *
 * Run: node generate_client_excel.js
 */
const XLSX = require('xlsx');
const taxonomy = require('./src/utils/taxonomy.json');
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
  ['Trust Bar', 'Item 1', 'Free Shipping on $150+', '', '', 'CONFLICTS WITH SHIPPING POLICY ($200)', ''],
  ['', 'Item 2', '30-Day Easy Returns', '', '', 'CONFLICTS WITH RETURN POLICY (48 hours)', ''],
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
  ['ISSUE', 'The trust badge shown on EVERY page of the website says "30-Day Easy Returns", which contradicts the 48-hour window above. Client to confirm which is correct.', ''],
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
  ['SYSTEM CHECK', 'Checkout charges $8 standard / $18 express, free standard over $200. This MATCHES the policy above.', ''],
  ['ISSUE', 'The scrolling bar at the top of every page says "COMPLIMENTARY GLOBAL SHIPPING", the trust badge says "All orders shipped free of charge", and the home page says "Free Shipping on $150+". All three contradict this policy.', ''],
  ['ISSUE', 'Every product card shows a "FREE SHIPPING" pill, because the Free Shipping switch in the admin product form defaults to ON. Checkout still charges $8.', ''],
  ['ISSUE', 'Shipping is a flat fee regardless of order size or destination. A 10-item order to WA is charged the same $8 as a single pair of earrings to Melbourne.', ''],
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
  ['Announcement Bar (top of every page)', 'Scrolling Message', 'COMPLIMENTARY GLOBAL SHIPPING ON HERITAGE ORDERS — EST. 2024 — MELBOURNE — BESPOKE CUSTOM STITCHING AVAILABLE ON ALL GARMENTS', ''],
  [],
  ['Trust Signals Bar', 'Signal 1', 'Free Shipping — All orders shipped free of charge', ''],
  ['', 'Signal 2', 'Easy Returns — 30 days free exchange policy', ''],
  ['', 'Signal 3', 'Heritage Craft — Handwoven by artisans since 2024', ''],
  [],
  ['Trust Bar (Home)', 'Item 1', 'Free Shipping on $150+', ''],
  ['', 'Item 2', '30-Day Easy Returns', ''],
  ['', 'Item 3', 'Authentic Handcrafted', ''],
  ['', 'Item 4', 'WhatsApp Support', ''],
  [],
  ['Product Detail Page', 'Shipping & Returns tab', 'Complimentary domestic shipping on all orders. International shipping from ₹1,200. Delivery: 5–7 days standard, 1–2 days priority. 30-day free exchanges on unworn items. Custom-stitched orders are non-returnable.', ''],
  ['', 'ISSUE', 'This text shows a price in INDIAN RUPEES (₹1,200) on an Australian store, promises free domestic shipping, and promises 30-day exchanges. All three are wrong.', ''],
  [],
  ['Footer Brand Tagline', 'Text', 'Exquisite hand-spun garments tailored for the modern spirit.', ''],
  [],
  ['Products Page Hero', 'Established', 'Established 2024', ''],
  ['Login Page', 'Established', 'Est. 2024', ''],
  ['Cart Page', 'Established', 'EST. 2024 // BRIDAL & MENSWEAR', ''],
], [35, 20, 110, 30]);


// ===================== SHEET 12: ISSUES & ACTION ITEMS =====================
addSheet('12. Issues & Actions', [
  ['#', 'ISSUE / OBSERVATION', 'SEVERITY', 'WHERE', 'CURRENT STATE', 'RECOMMENDED ACTION', 'CLIENT DECISION (FILL THIS)'],
  ['1', 'The website states four different shipping rules: "complimentary global shipping" (top bar), "all orders shipped free of charge" (trust badge), "Free Shipping on $150+" (home page), and $8 / free over $200 (shipping policy + actual checkout).', 'CRITICAL', 'Announcement bar, Trust signals, Home trust bar, Shipping policy', 'Checkout correctly charges $8 / $18, free over $200. Every marketing line disagrees with it.', 'Confirm the single correct rule and we will make every line match the checkout.', ''],
  ['2', 'Every product card displays a "FREE SHIPPING" pill because the Free Shipping switch in the admin product form defaults to ON, but checkout charges $8.', 'CRITICAL', 'All product cards + product listing filter', 'Misleading on every product', 'Remove the pill, or make it appear only when the order actually qualifies.', ''],
  ['3', 'Return window contradiction: the badge on every page says "30-Day Easy Returns" but the return policy allows 48 hours.', 'HIGH', 'Trust signals vs Refund policy', 'Two different promises', 'Confirm the correct window; we will correct the badge.', ''],
  ['4', 'Product detail page "Shipping & Returns" tab quotes international shipping "from ₹1,200" (Indian Rupees) and promises 30-day exchanges.', 'HIGH', 'Every product page', 'Wrong currency and wrong policy', 'Replace with the real Australian shipping and returns text.', ''],
  ['5', 'Shipping is flat regardless of order size or destination. A 10-item bulk order to WA costs the same $8 as one pair of earrings to Melbourne.', 'HIGH', 'Checkout', 'Flat $8 / $18', 'Adopt a per-item shipping increment with a cap, plus a bulk-order quote gate. See the shipping proposal document.', ''],
  ['6', 'Free shipping is calculated BEFORE the coupon is applied, so a $210 order with a $50 coupon pays $160 and still ships free.', 'HIGH', 'Checkout pricing', 'Threshold uses the pre-coupon subtotal', 'Apply the $200 test to the amount actually paid.', ''],
  ['7', 'Stock is checked against the product total, not the specific size and colour ordered. A customer can order a size that has no stock.', 'HIGH', 'Checkout', 'Can oversell a size', 'Validate the exact size/colour variant before taking payment.', ''],
  ['8', '25 of 58 products have no stock entered against any size or colour, so they display as sold out.', 'HIGH', 'Admin → Products', 'Cannot be purchased', 'Enter stock quantities per size/colour in the admin panel.', ''],
  ['9', 'Almost every product is tagged into every collection (43 "new arrivals", 52 "best sellers", 55 "ready to ship" out of 58).', 'MEDIUM', 'Admin → Products → Collections', 'All sections show nearly the same products', 'Tag roughly 8-12 products per collection.', ''],
  ['10', 'The four "Customer Diaries" reviews on the home page are invented names, quotes and stock photos.', 'MEDIUM', 'Home Page → Customer Diaries', 'Placeholder content presented as real reviews', 'Replace with genuine reviews, or hide the section until real ones exist.', ''],
  ['11', 'Kids has no products, and Jewelry sub-categories Necklaces, Bracelets and Rings are empty, but all appear in the menu.', 'MEDIUM', 'Navbar, Footer, Home showcase', 'Now shows "New pieces arriving soon" instead of a blank page', 'Upload products, or tell us to remove the menu entries.', ''],
  ['12', 'The About page describes an India-based business, but the store is in Truganina, Victoria.', 'MEDIUM', 'About Page → Our Story', 'Reads as a non-Australian business', 'Confirm how the story should be told.', ''],
  ['13', 'The About page "Shop the Look" shows fixed prices ($1,280 and $645) not linked to any real product.', 'MEDIUM', 'About Page → Shop the Look', 'Decorative only', 'Link to real products or remove the prices.', ''],
  ['14', 'The refund policy points customers to www.angelfashionstudio.org and the footer copyright says 2025.', 'LOW', 'Refund policy, Footer', 'Possibly wrong domain and year', 'Confirm the correct domain and year.', ''],
  ['15', 'The circular icons on the home page are labelled by fabric (SILK, VELVET, NET...), but products are not classified by fabric.', 'LOW', 'Home Page → Circular Icons', 'Each now points at a real clothing type that has products', 'Confirm whether to rename the labels to match the catalogue.', ''],
  [],
  ['— ALREADY FIXED —', '', '', '', '', '', ''],
  ['', 'Store address, phone and email updated across the whole site', '', '', '', '', ''],
  ['', 'Indo Western moved under Lehengas and wired into the menu, footer, home page and filters', '', '', '', '', ''],
  ['', 'One product saved with an outdated spelling was invisible on the site and un-editable in the admin panel — corrected in the database', '', '', '', '', ''],
  ['', 'Circular home page icons no longer all point to the same unfiltered page', '', '', '', '', ''],
  ['', 'Instagram and Facebook footer buttons now open the real pages', '', '', '', '', ''],
  ['', 'Privacy policy email corrected, and legal jurisdiction set to Victoria', '', '', '', '', ''],
  ['', 'All year references across the site set to 2024', '', '', '', '', ''],
  ['', 'Empty sections now show "New pieces arriving soon" instead of a blank page', '', '', '', '', ''],
], [4, 95, 10, 38, 50, 65, 30]);


XLSX.writeFile(wb, 'Angel_Fashion_Studio_Client_Review.xlsx');
console.log('Written: Angel_Fashion_Studio_Client_Review.xlsx (12 sheets)');
