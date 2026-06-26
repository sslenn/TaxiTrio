const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PaymentRecord } = require('../../../models');

class StripeProvider {
  async createPayment({ amount, bookingId, travelerId, metadata }) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `TaxiTrio Ride Booking #${bookingId}`,
          },
          unit_amount: Math.round(amount * 100), // in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${frontendUrl}/traveler/bookings/${bookingId}?stripe=success`,
      cancel_url: `${frontendUrl}/traveler/bookings/payment/${bookingId}?stripe=cancel`,
      metadata: {
        bookingId: bookingId.toString(),
        travelerId: travelerId.toString(),
        ...metadata
      }
    });

    return {
      paymentId: session.id,
      sessionUrl: session.url,
      status: 'PENDING'
    };
  }

  async verifyPayment({ paymentId }) {
    // If paymentId looks like a Stripe session ID, retrieve it
    if (paymentId.startsWith('cs_')) {
      const session = await stripe.checkout.sessions.retrieve(paymentId);
      if (session.payment_status === 'paid') {
        return { status: 'PAID' };
      }
    } else {
      // If paymentId is bookingId (fallback lookup)
      const payment = await PaymentRecord.findOne({ where: { booking_id: paymentId } });
      if (payment && payment.status === 'verified') {
        return { status: 'PAID' };
      }
    }
    return { status: 'PENDING' };
  }

  async handleWebhook(req) {
    const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = req.headers['stripe-signature'];
    let event;

    if (stripeSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(req.rawBody || JSON.stringify(req.body), signature, stripeSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        throw new Error('Invalid Webhook Signature');
      }
    } else {
      // Fallback dev mode without signature check
      event = req.body;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      return {
        bookingId: session.metadata.bookingId,
        travelerId: session.metadata.travelerId,
        paymentId: session.id,
        amount: session.amount_total / 100,
        status: 'PAID'
      };
    }
    
    return null;
  }
}

module.exports = StripeProvider;
