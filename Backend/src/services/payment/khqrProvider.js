const { PaymentRecord } = require('../../../models');

class KHQRProvider {
  async createPayment({ amount, bookingId, travelerId, metadata }) {
    let qrString = '';
    const accountId = process.env.BAKONG_ACCOUNT_ID;

    if (accountId) {
      if (accountId.startsWith('000201')) {
        const { generateDynamicQR } = require('../../utils/qr');
        qrString = generateDynamicQR(accountId, amount, process.env.BAKONG_CURRENCY || 'USD');
      } else {
        try {
          const { BakongKHQR, khqrData, IndividualInfo } = require('bakong-khqr');
          const cleanBillNumber = bookingId.toString().replace(/[^a-zA-Z0-9]/g, '').slice(0, 25);
          const isRiel = process.env.BAKONG_CURRENCY === 'KHR';
          const finalAmount = isRiel ? Math.round(parseFloat(amount) * 4000) : parseFloat(amount);
          const individualInfo = new IndividualInfo(
            accountId,
            process.env.BAKONG_MERCHANT_NAME || 'TaxiTrio',
            'Phnom Penh',
            {
              currency: isRiel ? khqrData.currency.khr : khqrData.currency.usd,
              amount: finalAmount,
              billNumber: cleanBillNumber,
              expirationTimestamp: Date.now() + (30 * 60 * 1000)
            }
          );
          const khqr = new BakongKHQR();
          const response = khqr.generateIndividual(individualInfo);
          if (response && response.data && response.data.qr) {
            qrString = response.data.qr;
          } else {
            throw new Error('QR generation failed in bakong-khqr SDK');
          }
        } catch (err) {
          qrString = `00020101021238580010A000000765011000000000010212MCKH000188980306Bakong520459995303116540${parseFloat(amount).toFixed(2)}5802KH5908TaxiTrio6010Phnom Penh6304ABCD`;
        }
      }
    } else {
      qrString = `00020101021238580010A000000765011000000000010212MCKH000188980306Bakong520459995303116540${parseFloat(amount).toFixed(2)}5802KH5908TaxiTrio6010Phnom Penh6304ABCD`;
    }

    const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrString)}&color=D4AF37&bgcolor=121212`;

    return {
      paymentId: bookingId.toString(), // map to bookingId for lookup simplicity
      qrImage,
      qrString,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      status: 'PENDING'
    };
  }

  async verifyPayment({ paymentId }) {
    const payment = await PaymentRecord.findOne({ where: { booking_id: paymentId } });
    if (payment && payment.status === 'verified') {
      return { status: 'PAID' };
    }
    return { status: 'PENDING' };
  }

  async handleWebhook(req) {
    // Check webhook authentication token from header or query string
    const token = req.headers['x-khqr-webhook-token'] || req.query.token;
    const expectedToken = process.env.KHQR_WEBHOOK_SECRET || 'khqr_shared_secret_2026';
    
    if (expectedToken && token !== expectedToken) {
      console.warn('KHQR Webhook warning: Unauthorized token mismatch');
      throw new Error('Unauthorized Webhook Token');
    }

    // Support multiple common scraper formats (amount, bookingId/paymentId, description/memo)
    let bookingId = req.body.bookingId || req.body.paymentId;
    const description = req.body.description || req.body.memo || req.body.comment;
    
    if (!bookingId && description) {
      // Regex match to extract UUID v4 format from description (e.g. "Booking #f3e1a...")
      const match = description.match(/#?([a-f0-9\-]{36})/i);
      if (match) {
        bookingId = match[1];
      } else {
        // Strip any # and leading/trailing whitespace
        bookingId = description.replace('#', '').trim();
      }
    }

    const amount = req.body.amount;
    const status = req.body.status || 'SUCCESS';
    const isSuccess = status === 'SUCCESS' || status.toUpperCase() === 'SUCCESS' || status.toUpperCase() === 'PAID';

    if (bookingId && isSuccess) {
      let payment = await PaymentRecord.findOne({ where: { booking_id: bookingId } });
      
      if (!payment) {
        // Fallback: match cleaned alphanumeric prefix for EMVCo compliant billNumber
        const pendingPayments = await PaymentRecord.findAll({ where: { status: 'pending' } });
        payment = pendingPayments.find(p => {
          const cleanId = p.booking_id.replace(/[^a-zA-Z0-9]/g, '');
          return cleanId.startsWith(bookingId) || bookingId.startsWith(cleanId);
        });
      }

      if (payment) {
        return {
          bookingId: payment.booking_id,
          travelerId: payment.traveler_id,
          paymentId: payment.booking_id,
          amount: parseFloat(amount || payment.amount),
          status: 'PAID'
        };
      }
    }
    
    console.error('KHQR Webhook failed: Could not match bookingId in payload:', req.body);
    return null;
  }
}

module.exports = KHQRProvider;
