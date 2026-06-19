const { Notification } = require('../models');

/**
 * Create a notification for a user
 */
const createNotification = async ({ user, type, title, body, link = null, image = null, ref = null }) => {
  try {
    await Notification.create({ user, type, title, body, link, image, ref });
  } catch (err) {
    // Notifications are non-critical — log but don't throw
    console.error('Notification error:', err.message);
  }
};

/**
 * Notification templates
 */
const notify = {
  orderPlaced: (userId, orderNumber) =>
    createNotification({
      user:  userId,
      type:  'order_placed',
      title: 'Order Confirmed',
      body:  `Your order ${orderNumber} has been placed successfully.`,
      link:  `/profile/orders`,
    }),

  orderShipped: (userId, orderNumber, tracking) =>
    createNotification({
      user:  userId,
      type:  'order_shipped',
      title: 'Your Order Has Shipped!',
      body:  `Order ${orderNumber} is on its way. ${tracking ? `Track: ${tracking}` : ''}`,
      link:  `/profile/orders`,
    }),

  orderDelivered: (userId, orderNumber) =>
    createNotification({
      user:  userId,
      type:  'order_delivered',
      title: 'Order Delivered',
      body:  `Order ${orderNumber} has been delivered. We hope you love it!`,
      link:  `/profile/orders`,
    }),

  sellerApproved: (userId) =>
    createNotification({
      user:  userId,
      type:  'seller_approved',
      title: 'Your Store is Live!',
      body:  'Congratulations! Your seller application has been approved. Start listing products.',
      link:  `/seller/dashboard`,
    }),

  sellerRejected: (userId, reason) =>
    createNotification({
      user:  userId,
      type:  'seller_rejected',
      title: 'Application Rejected',
      body:  reason || 'Your seller application was not approved. Contact support for details.',
    }),

  reviewReceived: (sellerId, productName) =>
    createNotification({
      user:  sellerId,
      type:  'review_received',
      title: 'New Review',
      body:  `You received a new review on "${productName}".`,
      link:  `/seller/products`,
    }),
};

module.exports = { createNotification, notify };
