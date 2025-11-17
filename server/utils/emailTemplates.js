// Email Templates

export const welcomeEmail = (name) => ({
  subject: 'Welcome to E-Shop!',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1976d2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #1976d2; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to E-Shop!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for joining E-Shop! We're excited to have you as part of our community.</p>
          <p>Start exploring our amazing products and enjoy exclusive deals.</p>
          <a href="${process.env.CLIENT_URL}/products" class="button">Start Shopping</a>
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

export const orderConfirmationEmail = (order, user) => ({
  subject: `Order Confirmation - #${order.orderNumber}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4caf50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; margin-top: 15px; }
        .button { display: inline-block; padding: 12px 24px; background: #1976d2; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Order Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name},</h2>
          <p>Thank you for your order! We've received your order and will process it shortly.</p>
          
          <div class="order-details">
            <h3>Order #${order.orderNumber}</h3>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            
            <h4>Items:</h4>
            ${order.items.map(item => `
              <div class="item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
            
            <div class="total">
              <div class="item">
                <span>Subtotal:</span>
                <span>$${order.subtotal.toFixed(2)}</span>
              </div>
              ${order.discount > 0 ? `
                <div class="item">
                  <span>Discount:</span>
                  <span style="color: #4caf50;">-$${order.discount.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="item">
                <span>Shipping:</span>
                <span>${order.shippingCharge === 0 ? 'FREE' : `$${order.shippingCharge.toFixed(2)}`}</span>
              </div>
              <div class="item" style="border-top: 2px solid #333; margin-top: 10px; padding-top: 10px;">
                <span>Total:</span>
                <span>$${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <a href="${process.env.CLIENT_URL}/orders/${order._id}" class="button">View Order Details</a>
          
          <p><strong>Shipping Address:</strong><br>
          ${order.shippingAddress.fullName}<br>
          ${order.shippingAddress.addressLine1}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

export const orderShippedEmail = (order, user, trackingNumber) => ({
  subject: `Your Order Has Been Shipped - #${order.orderNumber}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196f3; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .tracking { background: white; padding: 20px; margin: 20px 0; border-radius: 4px; text-align: center; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #2196f3; margin: 10px 0; }
        .button { display: inline-block; padding: 12px 24px; background: #1976d2; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Your Order Has Shipped!</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name},</h2>
          <p>Great news! Your order #${order.orderNumber} has been shipped and is on its way to you.</p>
          
          <div class="tracking">
            <h3>Tracking Information</h3>
            <div class="tracking-number">${trackingNumber}</div>
            <p>Use this tracking number to monitor your shipment.</p>
          </div>
          
          <a href="${process.env.CLIENT_URL}/orders/${order._id}" class="button">Track Your Order</a>
          
          <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
          <p>If you have any questions about your order, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

export const passwordChangedEmail = (name) => ({
  subject: 'Password Changed Successfully',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ff9800; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .alert { background: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 24px; background: #1976d2; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Password Changed</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Your password has been successfully changed.</p>
          
          <div class="alert">
            <strong>⚠️ Security Notice:</strong><br>
            If you did not make this change, please contact our support team immediately.
          </div>
          
          <p>For your security, we recommend:</p>
          <ul>
            <li>Using a strong, unique password</li>
            <li>Enabling two-factor authentication</li>
            <li>Never sharing your password with anyone</li>
          </ul>
          
          <a href="${process.env.CLIENT_URL}/login" class="button">Login to Your Account</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

export const lowStockAlertEmail = (product, currentStock) => ({
  subject: `⚠️ Low Stock Alert: ${product.name}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f44336; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .product { background: white; padding: 15px; margin: 20px 0; border-radius: 4px; display: flex; align-items: center; }
        .product img { width: 100px; height: 100px; object-fit: cover; margin-right: 20px; }
        .alert { background: #ffebee; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 24px; background: #1976d2; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Low Stock Alert</h1>
        </div>
        <div class="content">
          <h2>Inventory Alert</h2>
          <p>The following product is running low on stock and needs attention:</p>
          
          <div class="product">
            <img src="${product.images?.[0]?.url || 'https://via.placeholder.com/100'}" alt="${product.name}">
            <div>
              <h3>${product.name}</h3>
              <p><strong>Current Stock:</strong> <span style="color: #f44336; font-size: 20px;">${currentStock}</span></p>
              <p><strong>SKU:</strong> ${product._id}</p>
            </div>
          </div>
          
          <div class="alert">
            <strong>Action Required:</strong><br>
            Please restock this product to avoid running out of inventory.
          </div>
          
          <a href="${process.env.CLIENT_URL}/admin/products" class="button">Manage Inventory</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} E-Shop Admin. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

export const newOrderAdminEmail = (order) => ({
  subject: `🛒 New Order Received - #${order.orderNumber}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4caf50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-summary { background: white; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; padding: 12px 24px; background: #1976d2; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 New Order Received</h1>
        </div>
        <div class="content">
          <h2>Order #${order.orderNumber}</h2>
          <p>A new order has been placed and requires processing.</p>
          
          <div class="order-summary">
            <p><strong>Customer:</strong> ${order.user?.name}</p>
            <p><strong>Email:</strong> ${order.user?.email}</p>
            <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
            <p><strong>Items:</strong> ${order.items.length}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          </div>
          
          <a href="${process.env.CLIENT_URL}/admin/orders" class="button">View Order Details</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} E-Shop Admin. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});
