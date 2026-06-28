const dotenv = require('dotenv');

// Load environment variables if not already loaded
dotenv.config();

// ---------------------------------------------------------------------------
// Email transport: ZeptoMail (Zoho's transactional email service) over its
// HTTPS API on port 443. We use the API rather than SMTP because the host
// (DigitalOcean) blocks all outbound SMTP ports (25/465/587); HTTPS is open.
// The account is in the India DC, so the default endpoint is api.zeptomail.in.
//
// Required env: ZEPTOMAIL_TOKEN  (the "Send Mail" token from ZeptoMail)
// From address: MAIL_FROM_ADDRESS or ZOHO_EMAIL_USER, on a domain verified in
// ZeptoMail (angelfashionstudio.org — already in your Zoho account).
// ---------------------------------------------------------------------------
const ZEPTO_API_URL = process.env.ZEPTOMAIL_API_URL || 'https://api.zeptomail.in/v1.1/email';
const ZEPTO_TOKEN = process.env.ZEPTOMAIL_TOKEN;
const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || process.env.ZOHO_EMAIL_USER;
const FROM_NAME = 'Angel Fashion Studio';

if (!ZEPTO_TOKEN) {
    console.warn('[EMAIL] ZEPTOMAIL_TOKEN is not set — outgoing emails will fail until it is configured.');
}

// Helper for sending HTML email. Same signature as before ({ email, subject,
// html, attachments }), so every template function is unchanged.
const sendEmail = async (options) => {
    try {
        const payload = {
            from: { address: FROM_ADDRESS, name: FROM_NAME },
            to: [{ email_address: { address: options.email } }],
            subject: options.subject,
            htmlbody: options.html,
        };

        // Map Nodemailer-style attachments ({ filename, content: Buffer, contentType })
        // to ZeptoMail's base64 format.
        if (options.attachments && options.attachments.length > 0) {
            payload.attachments = options.attachments.map((a) => ({
                name: a.filename,
                mime_type: a.contentType || 'application/octet-stream',
                content: Buffer.isBuffer(a.content) ? a.content.toString('base64') : a.content,
            }));
        }

        const response = await fetch(ZEPTO_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Zoho-enczapikey ${ZEPTO_TOKEN}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            console.error(`[EMAIL FAILED] To: ${options.email} | Subject: "${options.subject}" | ${response.status}: ${JSON.stringify(data).slice(0, 300)}`);
            return null;
        }

        console.info(`[EMAIL SENT] To: ${options.email} | Subject: "${options.subject}" | RequestId: ${data.request_id || 'ok'}`);
        return data;
    } catch (error) {
        console.error(`[EMAIL FAILED] To: ${options.email} | Subject: "${options.subject}" | Error: ${error.message}`);
        // Do not throw — never crash a request because email failed.
        return null;
    }
};

exports.sendEmail = sendEmail;

const formatPrice = (number) => {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
    }).format(number);
};

// 1. Welcome Email
exports.sendWelcomeEmail = async (user) => {
    const html = `
        <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FCFAF8; color: #432918;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-family: 'Times New Roman', Times, serif; font-size: 24px; letter-spacing: 2px; color: #432918; margin: 0;">ANGEL FASHION STUDIO</h1>
                <p style="font-size: 10px; font-weight: bold; letter-spacing: 3px; color: #C5A059; margin-top: 5px;">A U S T R A L I A N   A T E L I E R</p>
                <div style="border-bottom: 1px solid #E6D5B8; margin-top: 20px;"></div>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6;">Dear ${user.name},</p>
            <p style="font-size: 14px; line-height: 1.6;">Welcome to the Angel Archive. Your account has been successfully created.</p>
            <p style="font-size: 14px; line-height: 1.6;">You now have access to exclusive collections, archival pieces, and a streamlined checkout experience tailored to our inner circle.</p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.FRONTEND_PUBLIC_URL || 'https://www.angelfashionstudio.org'}" style="background-color: #432918; color: #FCFAF8; text-decoration: none; padding: 12px 30px; font-size: 12px; font-weight: bold; letter-spacing: 1px; border-radius: 4px;">EXPLORE THE COLLECTION</a>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">If you have any questions or require bespoke assistance, simply reply to this email.</p>
            
            <div style="margin-top: 60px; text-align: center; border-top: 1px solid #E6D5B8; padding-top: 20px;">
                <p style="font-family: 'Times New Roman', Times, serif; font-size: 12px; font-weight: bold; color: #432918; letter-spacing: 1px;">ANGEL FASHION STUDIO PTY LTD</p>
                <p style="font-size: 10px; color: #7F8C8D;">IG: @AngelFashionStudio | W: angelfashionstudio.org</p>
            </div>
        </div>
    `;

    return sendEmail({
        email: user.email,
        subject: 'Welcome to Angel Fashion Studio',
        html
    });
};

// 2. Order Confirmation Email
exports.sendOrderConfirmation = async (user, order, pdfBuffer) => {
    let itemsHtml = order.orderItems.map(item => `
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E6D5B8; font-size: 12px;">
                <strong>${item.name.toUpperCase()}</strong><br>
                <span style="font-size: 10px; color: #7F8C8D;">SIZE: ${item.size} | COLOR: ${item.color}</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E6D5B8; font-size: 12px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E6D5B8; font-size: 12px; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FCFAF8; color: #432918;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-family: 'Times New Roman', Times, serif; font-size: 24px; letter-spacing: 2px; color: #432918; margin: 0;">ANGEL FASHION STUDIO</h1>
                <p style="font-size: 10px; font-weight: bold; letter-spacing: 3px; color: #C5A059; margin-top: 5px;">A U S T R A L I A N   A T E L I E R</p>
                <div style="border-bottom: 1px solid #E6D5B8; margin-top: 20px;"></div>
            </div>
            
            <h2 style="font-size: 16px; letter-spacing: 1px; color: #432918; text-align: center;">ORDER CONFIRMATION</h2>
            <p style="font-size: 14px; text-align: center; margin-bottom: 30px;">Order #${order._id.toString().substring(15).toUpperCase()}</p>

            <p style="font-size: 14px; line-height: 1.6;">Dear ${user.name},</p>
            <p style="font-size: 14px; line-height: 1.6;">Thank you for your acquisition. We have successfully received your order and our atelier is preparing it for dispatch.</p>
            
            <div style="margin: 30px 0; border: 1px solid #E6D5B8; border-radius: 8px; padding: 20px;">
                <h3 style="font-size: 12px; letter-spacing: 1px; color: #C5A059; margin-top: 0;">CURATED ITEMS</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="font-size: 10px; color: #7F8C8D; text-align: left; padding-bottom: 10px; border-bottom: 1px solid #E6D5B8;">ITEM</th>
                            <th style="font-size: 10px; color: #7F8C8D; text-align: center; padding-bottom: 10px; border-bottom: 1px solid #E6D5B8;">QTY</th>
                            <th style="font-size: 10px; color: #7F8C8D; text-align: right; padding-bottom: 10px; border-bottom: 1px solid #E6D5B8;">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding-top: 12px; font-size: 11px; text-align: right; color: #7F8C8D;">Subtotal</td>
                            <td style="padding-top: 12px; font-size: 11px; text-align: right; color: #7F8C8D;">${formatPrice(order.itemsPrice)}</td>
                        </tr>
                        ${(order.addOns || []).map(a => `<tr><td colspan="2" style="padding-top: 6px; font-size: 11px; text-align: right; color: #7F8C8D;">${a.name}</td><td style="padding-top: 6px; font-size: 11px; text-align: right; color: #7F8C8D;">${formatPrice(a.price)}</td></tr>`).join('')}
                        ${order.discountAmount > 0 ? `<tr><td colspan="2" style="padding-top: 6px; font-size: 11px; text-align: right; color: #7F8C8D;">Discount${order.couponCode ? ` (${order.couponCode})` : ''}</td><td style="padding-top: 6px; font-size: 11px; text-align: right; color: #7F8C8D;">-${formatPrice(order.discountAmount)}</td></tr>` : ''}
                        <tr>
                            <td colspan="2" style="padding-top: 6px; font-size: 11px; text-align: right; color: #7F8C8D;">Shipping</td>
                            <td style="padding-top: 6px; font-size: 11px; text-align: right; color: #7F8C8D;">${formatPrice(order.shippingPrice)}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding-top: 15px; font-size: 12px; font-weight: bold; text-align: right;">GRAND TOTAL</td>
                            <td style="padding-top: 15px; font-size: 14px; font-weight: bold; color: #8A6B4E; text-align: right;">${formatPrice(order.totalPrice)}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="padding-top: 4px; font-size: 9px; text-align: right; color: #A89B8C;">Includes GST of ${formatPrice(order.taxPrice || (order.totalPrice / 11))}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">Your tax invoice is attached to this email. You will receive another notification once your order has been dispatched.</p>
            
            <div style="margin-top: 60px; text-align: center; border-top: 1px solid #E6D5B8; padding-top: 20px;">
                <p style="font-family: 'Times New Roman', Times, serif; font-size: 12px; font-weight: bold; color: #432918; letter-spacing: 1px;">ANGEL FASHION STUDIO PTY LTD</p>
                <p style="font-size: 10px; color: #7F8C8D;">IG: @AngelFashionStudio | W: angelfashionstudio.org</p>
            </div>
        </div>
    `;

    const attachments = pdfBuffer ? [{
        filename: `tax_invoice_${order._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
    }] : [];

    return sendEmail({
        email: user.email,
        subject: `Order Confirmation - Angel Fashion Studio (#${order._id.toString().substring(15).toUpperCase()})`,
        html,
        attachments
    });
};

// 3. Order Status Update Email
exports.sendStatusUpdate = async (user, order, trackingNumber = null) => {
    let trackingHtml = '';
    if (order.orderStatus === 'shipped' && trackingNumber) {
        trackingHtml = `<div style="margin: 20px 0; padding: 15px; background-color: #f5f2eb; border-left: 3px solid #C5A059;">
            <p style="margin: 0; font-size: 12px; font-weight: bold; color: #432918;">TRACKING NUMBER:</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #8A6B4E;">${trackingNumber}</p>
        </div>`;
    }

    const html = `
        <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FCFAF8; color: #432918;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-family: 'Times New Roman', Times, serif; font-size: 24px; letter-spacing: 2px; color: #432918; margin: 0;">ANGEL FASHION STUDIO</h1>
                <p style="font-size: 10px; font-weight: bold; letter-spacing: 3px; color: #C5A059; margin-top: 5px;">A U S T R A L I A N   A T E L I E R</p>
                <div style="border-bottom: 1px solid #E6D5B8; margin-top: 20px;"></div>
            </div>
            
            <h2 style="font-size: 16px; letter-spacing: 1px; color: #432918; text-align: center;">ORDER UPDATE</h2>
            <p style="font-size: 14px; text-align: center; margin-bottom: 30px;">Order #${order._id.toString().substring(15).toUpperCase()}</p>

            <p style="font-size: 14px; line-height: 1.6;">Dear ${user.name},</p>
            <p style="font-size: 14px; line-height: 1.6;">The status of your order has been updated to: <strong>${order.orderStatus.toUpperCase()}</strong>.</p>
            
            ${trackingHtml}

            <p style="font-size: 14px; line-height: 1.6;">Thank you for shopping with us.</p>
            
            <div style="margin-top: 60px; text-align: center; border-top: 1px solid #E6D5B8; padding-top: 20px;">
                <p style="font-family: 'Times New Roman', Times, serif; font-size: 12px; font-weight: bold; color: #432918; letter-spacing: 1px;">ANGEL FASHION STUDIO PTY LTD</p>
                <p style="font-size: 10px; color: #7F8C8D;">IG: @AngelFashionStudio | W: angelfashionstudio.org</p>
            </div>
        </div>
    `;

    return sendEmail({
        email: user.email,
        subject: `Order Update: ${order.orderStatus?.toUpperCase()} - Angel Fashion Studio`,
        html
    });
};

// 4. Return Status update
exports.sendReturnUpdate = async (user, returnRequest, status) => {
    const html = `
        <div style="font-family: 'Helvetica', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FCFAF8; color: #432918;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-family: 'Times New Roman', Times, serif; font-size: 24px; letter-spacing: 2px; color: #432918; margin: 0;">ANGEL FASHION STUDIO</h1>
                <p style="font-size: 10px; font-weight: bold; letter-spacing: 3px; color: #C5A059; margin-top: 5px;">A U S T R A L I A N   A T E L I E R</p>
                <div style="border-bottom: 1px solid #E6D5B8; margin-top: 20px;"></div>
            </div>
            
            <h2 style="font-size: 16px; letter-spacing: 1px; color: #432918; text-align: center;">RETURN STATUS UPDATE</h2>
            <p style="font-size: 14px; text-align: center; margin-bottom: 30px;">Order #${(returnRequest._id || returnRequest.orderId).toString().substring(15).toUpperCase()}</p>

            <p style="font-size: 14px; line-height: 1.6;">Dear ${user.name},</p>
            <p style="font-size: 14px; line-height: 1.6;">Your archival return request has been reviewed by our team.</p>
            <p style="font-size: 14px; line-height: 1.6;">Status: <strong>${status.toUpperCase()}</strong></p>
            
            ${status === 'approved' ? '<p style="font-size: 14px; line-height: 1.6;">Your refund will be processed back to your original payment method within 3-5 business days. We will notify you once the transfer is initiated.</p>' : '<p style="font-size: 14px; line-height: 1.6;">Unfortunately, your request could not be approved at this time. Please contact strictly archival compliance if you require further investigation.</p>'}

            <div style="margin-top: 60px; text-align: center; border-top: 1px solid #E6D5B8; padding-top: 20px;">
                <p style="font-family: 'Times New Roman', Times, serif; font-size: 12px; font-weight: bold; color: #432918; letter-spacing: 1px;">ANGEL FASHION STUDIO PTY LTD</p>
                <p style="font-size: 10px; color: #7F8C8D;">IG: @AngelFashionStudio | W: angelfashionstudio.org</p>
            </div>
        </div>
    `;

    return sendEmail({
        email: user.email,
        subject: `Return ${status} - Angel Fashion Studio`,
        html
    });
};
