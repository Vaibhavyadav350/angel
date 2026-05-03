const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const colors = require('../utils/theme.json'); // gold, bronze, champagne, chocolate, gray

const formatPrice = (number) => {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
    }).format(number);
};

// Luxury aesthetic helpers
const drawLuxuryHeader = (doc, title, order) => {
    doc.fillColor(colors.chocolate).fontSize(20).font('Times-Bold')
        .text('ANGEL FASHION STUDIO', 40, 45, { characterSpacing: 1 });

    doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold')
        .text('A U S T R A L I A N   A T E L I E R', 40, 68, { characterSpacing: 2 });

    // ATO Compliance: ABN is strictly required
    doc.font('Helvetica-Bold').fontSize(7).fillColor(colors.chocolate).text('ABN: 45 612 345 678', 40, 80);

    // Right Meta
    doc.fillColor(colors.chocolate).fontSize(14).font('Helvetica-Bold')
        .text(title, 340, 45, { align: 'right', width: 215, characterSpacing: 2 });

    doc.fontSize(8).font('Helvetica').fillColor(colors.gray);
    if (title === 'TAX INVOICE') {
        doc.text(`NUMBER: INV-${order._id.toString().substring(10).toUpperCase()}`, 340, 68, { align: 'right', width: 215 });
    } else {
        doc.text(`REF: #${order._id.toString().substring(15).toUpperCase()}`, 340, 68, { align: 'right', width: 215 });
    }
    doc.text(`DATE: ${new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })}`, 340, 80, { align: 'right', width: 215 });

    // Subtle divider
    doc.moveTo(40, 105).lineTo(555, 105).lineWidth(0.5).stroke(colors.champagne);
};

const drawBigOrderMeta = (doc, order, isInvoice) => {
    let currentY = 135;

    // "ARCHIVAL ACQUISITION" tag
    doc.fillColor(colors.gold).fontSize(8).font('Helvetica-Bold')
        .text(isInvoice ? 'ARCHIVAL ACQUISITION' : 'ARCHIVAL DISPATCH', 40, currentY, { characterSpacing: 2 });

    currentY += 15;

    // Huge Order ID mimicking the UI
    doc.fillColor(colors.chocolate).fontSize(48).font('Times-Bold')
        .text(`#${order._id.toString().substring(15).toUpperCase()}`, 36, currentY, { characterSpacing: -1 });

    currentY += 55;

    doc.fillColor(colors.bronze).fontSize(8).font('Helvetica-Bold')
        .text(`SECURED ON ${new Date(order.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}`, 40, currentY, { characterSpacing: 1 });

    return currentY + 35;
};

const drawFooter = async (doc, order) => {
    const pageHeight = 841.89;
    const footerY = pageHeight - 85; // Move up slightly

    doc.moveTo(40, footerY).lineTo(555, footerY).lineWidth(0.5).stroke(colors.champagne);

    try {
        const qrDataUrl = await QRCode.toDataURL(`https://angelfashion.au/order/${order._id}`, { width: 50, margin: 0 });
        doc.image(qrDataUrl, 40, footerY + 15, { width: 50 });
    } catch (err) {
        console.error("QR Code generation failed");
    }

    doc.fillColor(colors.chocolate).fontSize(9).font('Times-Bold')
        .text('ANGEL FASHION STUDIO PTY LTD', 105, footerY + 20, { characterSpacing: 1 });

    doc.fillColor(colors.gray).fontSize(7).font('Helvetica')
        .text('IG: @AngelFashionStudio  |  W: angelfashion.au  |  E: atelier@angelfashion.au', 105, footerY + 32);

    doc.fillColor(colors.bronze).fontSize(8).font('Helvetica-Bold')
        .text('PAGE ' + doc.page.number, 500, footerY + 20, { align: 'right', width: 55 });
};

// ======================= MAIN ==========================
exports.generateInvoice = async (order, res) => {
    // Exact margins fixed
    const doc = new PDFDocument({ margin: 40, margins: { top: 40, bottom: 0, left: 40, right: 40 }, size: 'A4', autoFirstPage: false });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=tax_invoice_${order._id}.pdf`);
    doc.pipe(res);

    doc.addPage();
    // Hyper-light champagne background for that atelier paper feel, not overwhelming
    doc.rect(0, 0, 595.28, 841.89).fill('#FCFAF8');

    drawLuxuryHeader(doc, 'TAX INVOICE', order);
    let startY = drawBigOrderMeta(doc, order, true);

    // ============================================
    // ELEGANT OUTLINE UI CARDS 
    // ============================================

    // 1. Valuation Card (Right side)
    const valuationX = 330;
    const valuationY = startY;
    const valuationW = 225;
    const valuationH = 150;

    doc.roundedRect(valuationX, valuationY, valuationW, valuationH, 12).lineWidth(1).stroke(colors.bronze);

    const valInnerX = valuationX + 20;
    let valInnerY = valuationY + 25;

    doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('VALUATION', valInnerX, valInnerY, { letterSpacing: 2 });

    valInnerY += 25;
    doc.fillColor(colors.gray).fontSize(9).font('Helvetica').text('Subtotal', valInnerX, valInnerY);
    doc.fillColor(colors.chocolate).font('Helvetica-Bold').text(formatPrice(order.itemsPrice), valuationX, valInnerY, { align: 'right', width: valuationW - 20 });

    valInnerY += 20;
    doc.fillColor(colors.gray).font('Helvetica').text('Shipping', valInnerX, valInnerY);
    doc.fillColor(colors.chocolate).font('Helvetica-Bold').text(formatPrice(order.shippingPrice), valuationX, valInnerY, { align: 'right', width: valuationW - 20 });

    if (order.discountAmount > 0) {
        valInnerY += 20;
        doc.font('Helvetica').fillColor(colors.gold).text(`Discount`, valInnerX, valInnerY);
        doc.font('Helvetica-Bold').text(`-${formatPrice(order.discountAmount)}`, valuationX, valInnerY, { align: 'right', width: valuationW - 20 });
    }

    valInnerY += 20;
    doc.moveTo(valInnerX, valInnerY).lineTo(valuationX + valuationW - 20, valInnerY).lineWidth(0.5).stroke(colors.champagne);

    valInnerY += 15;
    doc.fillColor(colors.bronze).fontSize(9).font('Helvetica-Bold').text('TOTAL', valInnerX, valInnerY + 5, { letterSpacing: 2 });
    doc.fillColor(colors.gold).fontSize(20).font('Times-Bold').text(formatPrice(order.totalPrice), valuationX, valInnerY, { align: 'right', width: valuationW - 20 });

    const gstAmount = (order.totalPrice / 11).toFixed(2);

    // 2. Shipping To / Payment Card (Left side)
    const shipX = 40;
    const shipY = startY;
    const shipW = 270;
    const shipH = 150;

    doc.roundedRect(shipX, shipY, shipW, shipH, 12).lineWidth(1).stroke(colors.champagne);

    const shipInnerX = shipX + 20;
    const shipInnerY = shipY + 20;

    doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('SHIPPING DESTINATION', shipInnerX, shipInnerY, { letterSpacing: 2 });
    doc.fillColor(colors.chocolate).fontSize(10).font('Helvetica-Bold').text(order.user.name.toUpperCase(), shipInnerX, shipInnerY + 15);
    doc.fillColor(colors.gray).fontSize(8).font('Helvetica')
        .text(`${order.shippingInfo.address}\n${order.shippingInfo.city}, ${order.shippingInfo.state}\n${order.shippingInfo.country} — ${order.shippingInfo.pinCode}`, shipInnerX, shipInnerY + 30, { lineGap: 3 });

    // Contact & Payment info inside same card
    doc.moveTo(shipInnerX, shipInnerY + 74).lineTo(shipX + shipW - 20, shipInnerY + 74).lineWidth(0.5).stroke(colors.champagne);
    doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('CONTACT & SECURE PAYMENT', shipInnerX, shipInnerY + 86, { letterSpacing: 2 });
    doc.fillColor(colors.gray).fontSize(8).font('Helvetica')
        .text(`${order.user.email} | ${order.shippingInfo.phoneNumber || ''}`, shipInnerX, shipInnerY + 100);

    // eWAY
    if (order.paymentInfo && order.paymentInfo.id) {
        doc.fillColor(colors.bronze).fontSize(7).font('Helvetica-Bold')
            .text(`EWAY TXN: ${order.paymentInfo.id.toUpperCase()}`, shipInnerX, shipInnerY + 114);
    }

    // ============================================
    // CURATED ITEMS LIST
    // ============================================
    let itemPos = startY + 185;

    doc.fillColor(colors.chocolate).fontSize(14).font('Times-Bold').text('CURATED ITEMS', 40, itemPos);

    itemPos += 30;

    for (let i = 0; i < order.orderItems.length; i++) {
        const item = order.orderItems[i];

        // Use a very light separating line between items
        doc.moveTo(40, itemPos - 10).lineTo(555, itemPos - 10).lineWidth(0.5).stroke(colors.champagne);

        doc.fillColor(colors.chocolate).fontSize(10).font('Helvetica-Bold').text(item.name.toUpperCase(), 40, itemPos);

        doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text(`SIZE: `, 40, itemPos + 15, { continued: true }).fillColor(colors.gray).text(`${item.size}   `, { continued: true })
            .fillColor(colors.gold).text(`COLOR: `, { continued: true }).fillColor(colors.gray).text(`${item.color}`);

        doc.fillColor(colors.gray).fontSize(8).font('Helvetica').text(`${item.quantity} x ${formatPrice(item.price)}`, 40, itemPos + 30);

        doc.fillColor(colors.chocolate).fontSize(14).font('Times-Bold').text(formatPrice(item.price * item.quantity), 455, itemPos + 15, { align: 'right', width: 100 });

        itemPos += 60;

        if (itemPos > 670) {
            await drawFooter(doc, order);
            doc.addPage();
            doc.rect(0, 0, 595.28, 841.89).fill('#FCFAF8');
            drawLuxuryHeader(doc, 'TAX INVOICE', order);
            itemPos = 135;
        }
    }

    // ============================================
    // ARCHIVAL POLICY CARD & ATO GST
    // ============================================
    if (itemPos > 610) {
        await drawFooter(doc, order);
        doc.addPage();
        doc.rect(0, 0, 595.28, 841.89).fill('#FCFAF8');
        drawLuxuryHeader(doc, 'TAX INVOICE', order);
        itemPos = 135;
    }

    itemPos += 15;

    // Archival Policy (Outline Card)
    doc.roundedRect(40, itemPos, 515, 80, 12).lineWidth(1).stroke(colors.champagne);

    doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('ARCHIVAL POLICY', 60, itemPos + 25, { letterSpacing: 2 });
    doc.fillColor(colors.gray).fontSize(9).font('Times-Italic')
        .text('Each piece in the Angel Archive is a testament to heritage craftsmanship. Returns are subject to strict archival inspection to ensure the preservation of artisanal integrity.', 60, itemPos + 40, { width: 475, lineGap: 2 });

    // ATO Compliance explicitly called out at the very end
    doc.fillColor(colors.gray).fontSize(7).font('Helvetica-Bold')
        .text(`TOTAL PRICE INCLUDES 10% AUSTRALIAN GST: ${formatPrice(gstAmount)}`, 40, itemPos + 100, { align: 'center', width: 515, letterSpacing: 1 });

    await drawFooter(doc, order);
    doc.end();
};

exports.generateInvoiceBuffer = (order) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 40, margins: { top: 40, bottom: 0, left: 40, right: 40 }, size: 'A4', autoFirstPage: false });

            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            doc.addPage();
            doc.rect(0, 0, 595.28, 841.89).fill('#FCFAF8');

            drawLuxuryHeader(doc, 'TAX INVOICE', order);
            let startY = drawBigOrderMeta(doc, order, true);

            const valuationX = 330, valuationY = startY, valuationW = 225, valuationH = 150;
            doc.roundedRect(valuationX, valuationY, valuationW, valuationH, 12).lineWidth(1).stroke(colors.bronze);
            const valInnerX = valuationX + 20;
            let valInnerY = valuationY + 25;

            doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('VALUATION', valInnerX, valInnerY, { letterSpacing: 2 });
            valInnerY += 25;
            doc.fillColor(colors.gray).fontSize(9).font('Helvetica').text('Subtotal', valInnerX, valInnerY);
            doc.fillColor(colors.chocolate).font('Helvetica-Bold').text(formatPrice(order.itemsPrice), valuationX, valInnerY, { align: 'right', width: valuationW - 20 });
            valInnerY += 20;
            doc.fillColor(colors.gray).font('Helvetica').text('Shipping', valInnerX, valInnerY);
            doc.fillColor(colors.chocolate).font('Helvetica-Bold').text(formatPrice(order.shippingPrice), valuationX, valInnerY, { align: 'right', width: valuationW - 20 });

            if (order.discountAmount > 0) {
                valInnerY += 20;
                doc.font('Helvetica').fillColor(colors.gold).text(`Discount`, valInnerX, valInnerY);
                doc.font('Helvetica-Bold').text(`-${formatPrice(order.discountAmount)}`, valuationX, valInnerY, { align: 'right', width: valuationW - 20 });
            }
            valInnerY += 20;
            doc.moveTo(valInnerX, valInnerY).lineTo(valuationX + valuationW - 20, valInnerY).lineWidth(0.5).stroke(colors.champagne);
            valInnerY += 15;
            doc.fillColor(colors.bronze).fontSize(9).font('Helvetica-Bold').text('TOTAL', valInnerX, valInnerY + 5, { letterSpacing: 2 });
            doc.fillColor(colors.gold).fontSize(20).font('Times-Bold').text(formatPrice(order.totalPrice), valuationX, valInnerY, { align: 'right', width: valuationW - 20 });

            const gstAmount = (order.totalPrice / 11).toFixed(2);

            const shipX = 40, shipY = startY, shipW = 270, shipH = 150;
            doc.roundedRect(shipX, shipY, shipW, shipH, 12).lineWidth(1).stroke(colors.champagne);
            const shipInnerX = shipX + 20;
            const shipInnerY = shipY + 20;

            doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('SHIPPING DESTINATION', shipInnerX, shipInnerY, { letterSpacing: 2 });
            doc.fillColor(colors.chocolate).fontSize(10).font('Helvetica-Bold').text(order.user.name.toUpperCase(), shipInnerX, shipInnerY + 15);
            doc.fillColor(colors.gray).fontSize(8).font('Helvetica')
                .text(`${order.shippingInfo.address}\n${order.shippingInfo.city}, ${order.shippingInfo.state}\n${order.shippingInfo.country} — ${order.shippingInfo.pinCode}`, shipInnerX, shipInnerY + 30, { lineGap: 3 });

            doc.moveTo(shipInnerX, shipInnerY + 74).lineTo(shipX + shipW - 20, shipInnerY + 74).lineWidth(0.5).stroke(colors.champagne);
            doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('CONTACT & SECURE PAYMENT', shipInnerX, shipInnerY + 86, { letterSpacing: 2 });
            doc.fillColor(colors.gray).fontSize(8).font('Helvetica')
                .text(`${order.user.email} | ${order.shippingInfo.phoneNumber || ''}`, shipInnerX, shipInnerY + 100);

            if (order.paymentInfo && order.paymentInfo.id) {
                doc.fillColor(colors.bronze).fontSize(7).font('Helvetica-Bold')
                    .text(`EWAY TXN: ${order.paymentInfo.id.toUpperCase()}`, shipInnerX, shipInnerY + 114);
            }

            let itemPos = startY + 185;
            doc.fillColor(colors.chocolate).fontSize(14).font('Times-Bold').text('CURATED ITEMS', 40, itemPos);
            itemPos += 30;

            for (let i = 0; i < order.orderItems.length; i++) {
                const item = order.orderItems[i];
                doc.moveTo(40, itemPos - 10).lineTo(555, itemPos - 10).lineWidth(0.5).stroke(colors.champagne);
                doc.fillColor(colors.chocolate).fontSize(10).font('Helvetica-Bold').text(item.name.toUpperCase(), 40, itemPos);
                doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text(`SIZE: `, 40, itemPos + 15, { continued: true }).fillColor(colors.gray).text(`${item.size}   `, { continued: true })
                    .fillColor(colors.gold).text(`COLOR: `, { continued: true }).fillColor(colors.gray).text(`${item.color}`);
                doc.fillColor(colors.gray).fontSize(8).font('Helvetica').text(`${item.quantity} x ${formatPrice(item.price)}`, 40, itemPos + 30);
                doc.fillColor(colors.chocolate).fontSize(14).font('Times-Bold').text(formatPrice(item.price * item.quantity), 455, itemPos + 15, { align: 'right', width: 100 });
                itemPos += 60;

                if (itemPos > 670) {
                    await drawFooter(doc, order);
                    doc.addPage();
                    doc.rect(0, 0, 595.28, 841.89).fill('#FCFAF8');
                    drawLuxuryHeader(doc, 'TAX INVOICE', order);
                    itemPos = 135;
                }
            }

            if (itemPos > 610) {
                await drawFooter(doc, order);
                doc.addPage();
                doc.rect(0, 0, 595.28, 841.89).fill('#FCFAF8');
                drawLuxuryHeader(doc, 'TAX INVOICE', order);
                itemPos = 135;
            }

            itemPos += 15;
            doc.roundedRect(40, itemPos, 515, 80, 12).lineWidth(1).stroke(colors.champagne);
            doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('ARCHIVAL POLICY', 60, itemPos + 25, { letterSpacing: 2 });
            doc.fillColor(colors.gray).fontSize(9).font('Times-Italic')
                .text('Each piece in the Angel Archive is a testament to heritage craftsmanship. Returns are subject to strict archival inspection to ensure the preservation of artisanal integrity.', 60, itemPos + 40, { width: 475, lineGap: 2 });

            doc.fillColor(colors.gray).fontSize(7).font('Helvetica-Bold')
                .text(`TOTAL PRICE INCLUDES 10% AUSTRALIAN GST: ${formatPrice(gstAmount)}`, 40, itemPos + 100, { align: 'center', width: 515, letterSpacing: 1 });

            await drawFooter(doc, order);
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

exports.generatePackingSlip = async (order, res) => {
    const doc = new PDFDocument({ margin: 40, margins: { top: 40, bottom: 0, left: 40, right: 40 }, size: 'A4', autoFirstPage: false });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=packingslip_${order._id}.pdf`);
    doc.pipe(res);

    doc.addPage();
    doc.rect(0, 0, 595.28, 841.89).fill('#FCFAF8');

    drawLuxuryHeader(doc, 'PACKING COMPLIANCE', order);
    let startY = drawBigOrderMeta(doc, order, false);

    // ============================================
    // WAREHOUSE CARDS (Shipping & Tracker)
    // ============================================

    const shipX = 40;
    const shipY = startY;
    const shipW = 250;
    const shipH = 130;

    doc.roundedRect(shipX, shipY, shipW, shipH, 12).lineWidth(1).stroke(colors.champagne);

    let shipInnerX = shipX + 20;
    let shipInnerY = shipY + 20;

    doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('DELIVERY DESTINATION', shipInnerX, shipInnerY, { letterSpacing: 2 });
    doc.fillColor(colors.chocolate).fontSize(10).font('Helvetica-Bold').text(order.user.name.toUpperCase(), shipInnerX, shipInnerY + 15);
    doc.fillColor(colors.gray).fontSize(8).font('Helvetica')
        .text(`${order.shippingInfo.address}\n${order.shippingInfo.city}, ${order.shippingInfo.state}\n${order.shippingInfo.country} — ${order.shippingInfo.pinCode}`, shipInnerX, shipInnerY + 30, { lineGap: 3 });
    doc.text(`PHONE: ${order.shippingInfo.phoneNumber || 'N/A'}`, shipInnerX, shipInnerY + 80);

    const netX = 305;
    const netY = startY;
    const netW = 250;
    const netH = 130;

    doc.roundedRect(netX, netY, netW, netH, 12).lineWidth(1).stroke(colors.bronze);

    const netInnerX = netX + 20;
    let netInnerY = netY + 20;

    doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('SHIPPING METHOD', netInnerX, netInnerY, { letterSpacing: 2 });
    doc.fillColor(colors.chocolate).fontSize(11).font('Helvetica-Bold')
        .text(order.shippingPrice > 20 ? 'EXPRESS PARCEL' : 'STANDARD PARCEL', netInnerX, netInnerY + 15);

    doc.moveTo(netInnerX, netInnerY + 45).lineTo(netX + netW - 20, netInnerY + 45).lineWidth(0.5).stroke(colors.champagne);

    doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('TRACKING', netInnerX, netInnerY + 58, { letterSpacing: 2 });
    if (order.shippingInfo.trackingNumber) {
        doc.fillColor(colors.chocolate).fontSize(9).font('Helvetica-Bold').text(order.shippingInfo.trackingNumber, netInnerX, netInnerY + 74);
    } else {
        doc.fillColor(colors.gray).fontSize(8).font('Times-Italic').text('Awaiting Dispatch', netInnerX, netInnerY + 74);
    }

    // ============================================
    // PICK LIST
    // ============================================
    let itemPos = startY + 160;

    doc.fillColor(colors.chocolate).fontSize(14).font('Times-Bold').text('PACKING MANIFEST', 40, itemPos);

    itemPos += 30;

    for (let i = 0; i < order.orderItems.length; i++) {
        const item = order.orderItems[i];

        // Draw an elegant luxury outline rect for each item
        doc.roundedRect(40, itemPos, 515, 65, 12).lineWidth(1).stroke(colors.champagne);

        // Pick box
        doc.rect(60, itemPos + 25, 15, 15).stroke(colors.bronze).lineWidth(1);

        doc.fillColor(colors.chocolate).fontSize(10).font('Helvetica-Bold').text(item.name.toUpperCase(), 95, itemPos + 20, { width: 220 });
        doc.fillColor(colors.gray).fontSize(7).font('Helvetica')
            .text(`SIZE: ${item.size}   |   COLOR: ${item.color}`, 95, itemPos + 36);

        const sku = `SK-${item.product.toString().substring(19).toUpperCase()}`;
        doc.fillColor(colors.chocolate).fontSize(8).font('Helvetica-Bold').text(sku, 330, itemPos + 20);
        const bin = `${item.size.charAt(0)}${item.quantity}A`;
        doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text(`BIN: ${bin}`, 330, itemPos + 34);

        doc.fillColor(colors.bronze).fontSize(20).font('Times-Bold').text(`${item.quantity}`, 490, itemPos + 22, { align: 'right', width: 40 });

        itemPos += 80;

        if (itemPos > 640) {
            await drawFooter(doc, order);
            doc.addPage();
            doc.rect(0, 0, 595.28, 841.89).fill('#FCFAF8');
            drawLuxuryHeader(doc, 'PACKING COMPLIANCE', order);
            itemPos = 135;
        }
    }

    // ============================================
    // QUALITY CONTROL
    // ============================================
    if (itemPos > 600) {
        await drawFooter(doc, order);
        doc.addPage();
        doc.rect(0, 0, 595.28, 841.89).fill('#FCFAF8');
        drawLuxuryHeader(doc, 'PACKING COMPLIANCE', order);
        itemPos = 135;
    }

    itemPos += 10;

    doc.roundedRect(40, itemPos, 515, 90, 12).lineWidth(1).stroke(colors.bronze);

    doc.fillColor(colors.gold).fontSize(7).font('Helvetica-Bold').text('ATELIER QUALITY CONTROL & VERIFICATION', 60, itemPos + 25, { letterSpacing: 2 });
    doc.fillColor(colors.chocolate).fontSize(8).font('Times-Italic')
        .text('This precise order has been thoroughly inspected. Unworn items with original archive tags intact are eligible for processing within 7 days. Ensure packer signature is verified prior to transit.', 60, itemPos + 40, { width: 300, lineGap: 2 });

    // Signature box
    doc.rect(380, itemPos + 25, 150, 40).stroke(colors.champagne).lineWidth(1);
    doc.fillColor(colors.bronze).fontSize(5).font('Helvetica-Bold').text('AUTHORIZED PACKER ID / SIGNATURE', 385, itemPos + 30, { letterSpacing: 0.5 });
    doc.moveTo(385, itemPos + 55).lineTo(525, itemPos + 55).lineWidth(0.5).stroke(colors.champagne);

    await drawFooter(doc, order);
    doc.end();
};
