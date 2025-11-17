import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateInvoice = (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      // Collect PDF data
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('INVOICE', 50, 50);

      doc
        .fontSize(10)
        .font('Helvetica')
        .text('E-Shop', 50, 80)
        .text('123 Business Street', 50, 95)
        .text('City, State 12345', 50, 110)
        .text('Email: support@eshop.com', 50, 125)
        .text('Phone: (123) 456-7890', 50, 140);

      // Invoice details (right side)
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`Invoice #: ${order.orderNumber}`, 350, 80)
        .font('Helvetica')
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 350, 95)
        .text(`Status: ${order.status.toUpperCase()}`, 350, 110);

      // Customer details
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Bill To:', 50, 180);

      doc
        .fontSize(10)
        .font('Helvetica')
        .text(order.shippingAddress.fullName, 50, 200)
        .text(order.shippingAddress.phone, 50, 215)
        .text(order.shippingAddress.addressLine1, 50, 230);

      if (order.shippingAddress.addressLine2) {
        doc.text(order.shippingAddress.addressLine2, 50, 245);
      }

      doc.text(
        `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
        50,
        order.shippingAddress.addressLine2 ? 260 : 245
      );

      doc.text(
        order.shippingAddress.country,
        50,
        order.shippingAddress.addressLine2 ? 275 : 260
      );

      // Line separator
      const tableTop = 320;
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, tableTop)
        .lineTo(550, tableTop)
        .stroke();

      // Table headers
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Item', 50, tableTop + 15)
        .text('Price', 280, tableTop + 15)
        .text('Qty', 370, tableTop + 15)
        .text('Total', 450, tableTop + 15, { align: 'right' });

      // Line separator
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, tableTop + 35)
        .lineTo(550, tableTop + 35)
        .stroke();

      // Table items
      let yPosition = tableTop + 50;
      doc.font('Helvetica');

      order.items.forEach((item) => {
        const itemTotal = item.price * item.quantity;

        doc
          .fontSize(9)
          .text(item.name, 50, yPosition, { width: 220 })
          .text(`$${item.price.toFixed(2)}`, 280, yPosition)
          .text(item.quantity, 370, yPosition)
          .text(`$${itemTotal.toFixed(2)}`, 450, yPosition, { align: 'right' });

        yPosition += 25;
      });

      // Line separator before totals
      yPosition += 10;
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, yPosition)
        .lineTo(550, yPosition)
        .stroke();

      // Totals
      yPosition += 15;
      doc
        .fontSize(10)
        .font('Helvetica')
        .text('Subtotal:', 350, yPosition)
        .text(`$${order.subtotal.toFixed(2)}`, 450, yPosition, { align: 'right' });

      if (order.discount > 0) {
        yPosition += 20;
        doc
          .text('Discount:', 350, yPosition)
          .fillColor('green')
          .text(`-$${order.discount.toFixed(2)}`, 450, yPosition, { align: 'right' })
          .fillColor('black');
      }

      yPosition += 20;
      doc
        .text('Shipping:', 350, yPosition)
        .text(
          order.shippingCharge === 0 ? 'FREE' : `$${order.shippingCharge.toFixed(2)}`,
          450,
          yPosition,
          { align: 'right' }
        );

      // Line separator before grand total
      yPosition += 15;
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(350, yPosition)
        .lineTo(550, yPosition)
        .stroke();

      // Grand total
      yPosition += 15;
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Total:', 350, yPosition)
        .fillColor('#1976d2')
        .text(`$${order.total.toFixed(2)}`, 450, yPosition, { align: 'right' })
        .fillColor('black');

      // Payment info
      yPosition += 40;
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Payment Information:', 50, yPosition);

      yPosition += 20;
      doc
        .font('Helvetica')
        .text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 50, yPosition)
        .text(
          `Payment Status: ${order.isPaid ? 'PAID' : 'UNPAID'}`,
          50,
          yPosition + 15
        );

      if (order.isPaid && order.paidAt) {
        doc.text(
          `Paid On: ${new Date(order.paidAt).toLocaleDateString()}`,
          50,
          yPosition + 30
        );
      }

      // Footer
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#666666')
        .text(
          'Thank you for your business!',
          50,
          doc.page.height - 100,
          { align: 'center', width: 500 }
        )
        .text(
          'For any queries, please contact us at support@eshop.com',
          50,
          doc.page.height - 85,
          { align: 'center', width: 500 }
        );

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
