const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer if SMTP options are configured in .env.
 * Otherwise, falls back to printing the email contents to the server logs.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  // Always print to console logs for convenient development testing
  console.log('\n==================================================');
  console.log(`📧 EMAIL LOGGED (To: ${to})`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`TEXT:    ${text}`);
  console.log('==================================================\n');

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log('ℹ️ SMTP not configured. Real email skipped (Simulation mode).');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: String(port) === '465',
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"TaxiTrio Support" <${user}>`,
      to,
      subject,
      text,
      html
    });
    console.log(`✅ Real email successfully sent to: ${to}`);
  } catch (err) {
    console.error(`❌ Failed to send real email to ${to} via SMTP:`, err.message);
  }
};

module.exports = { sendEmail };
