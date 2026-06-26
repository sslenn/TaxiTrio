const StripeProvider = require('./stripeProvider');
const KHQRProvider = require('./khqrProvider');

class PaymentFactory {
  static getProvider(method) {
    switch (method.toLowerCase()) {
      case 'stripe':
        return new StripeProvider();
      case 'khqr':
        return new KHQRProvider();
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }
}

module.exports = PaymentFactory;
