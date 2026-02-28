const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables if not already loaded
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.in', // The backend server for paid/upgraded accounts
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
        user: process.env.ZOHO_EMAIL_USER,
        pass: process.env.ZOHO_EMAIL_PASS
    }
});

// Helper for sending HTML email
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `"Angel Fashion Studio" <${process.env.ZOHO_EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
            attachments: options.attachments || []
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Do not throw to prevent crashing the app if email fails
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
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background-color: #432918; color: #FCFAF8; text-decoration: none; padding: 12px 30px; font-size: 12px; font-weight: bold; letter-spacing: 1px; border-radius: 4px;">EXPLORE THE COLLECTION</a>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">If you have any questions or require bespoke assistance, simply reply to this email.</p>
            
            <div style="margin-top: 60px; text-align: center; border-top: 1px solid #E6D5B8; padding-top: 20px;">
                <p style="font-family: 'Times New Roman', Times, serif; font-size: 12px; font-weight: bold; color: #432918; letter-spacing: 1px;">ANGEL FASHION STUDIO PTY LTD</p>
                <p style="font-size: 10px; color: #7F8C8D;">IG: @AngelFashionStudio | W: angelfashion.au</p>
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
                            <td colspan="2" style="padding-top: 15px; font-size: 12px; font-weight: bold; text-align: right;">GRAND TOTAL</td>
                            <td style="padding-top: 15px; font-size: 14px; font-weight: bold; color: #8A6B4E; text-align: right;">${formatPrice(order.totalPrice)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">Your tax invoice is attached to this email. You will receive another notification once your order has been dispatched.</p>
            
            <div style="margin-top: 60px; text-align: center; border-top: 1px solid #E6D5B8; padding-top: 20px;">
                <p style="font-family: 'Times New Roman', Times, serif; font-size: 12px; font-weight: bold; color: #432918; letter-spacing: 1px;">ANGEL FASHION STUDIO PTY LTD</p>
                <p style="font-size: 10px; color: #7F8C8D;">IG: @AngelFashionStudio | W: angelfashion.au</p>
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
                <p style="font-size: 10px; color: #7F8C8D;">IG: @AngelFashionStudio | W: angelfashion.au</p>
            </div>
        </div>
    `;

    return sendEmail({
        email: user.email,
        subject: `Order Update: ${order.status} - Angel Fashion Studio`,
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
                <p style="font-size: 10px; color: #7F8C8D;">IG: @AngelFashionStudio | W: angelfashion.au</p>
            </div>
        </div>
    `;

    return sendEmail({
        email: user.email,
        subject: `Return ${status} - Angel Fashion Studio`,
        html
    });
};
