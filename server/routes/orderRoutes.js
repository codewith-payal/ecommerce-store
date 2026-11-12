import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

// Start checkout: create order + Stripe payment page
router.post('/checkout', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = [];
    for (const i of items) {
      const product = await Product.findById(i.product);
      const qty = Number(i.qty);
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }
      if (qty < 1 || qty > product.countInStock) {
        return res.status(400).json({ message: `${product.name} is out of stock` });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
      });
    }

    const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalPrice,
    });

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: orderItems.map((i) => ({
        price_data: {
          currency: 'inr',
          product_data: { name: i.name },
          unit_amount: Math.round(i.price * 100),
        },
        quantity: i.qty,
      })),
      success_url: 'http://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/cart',
      metadata: { orderId: order._id.toString() },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// After payment: confirm with Stripe and mark order paid
router.post('/confirm', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const order = await Order.findOne({ stripeSessionId: sessionId, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.isPaid) return res.json(order);

    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();

    for (const i of order.items) {
      await Product.findByIdAndUpdate(i.product, { $inc: { countInStock: -i.qty } });
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// My paid orders
router.get('/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, isPaid: true }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;