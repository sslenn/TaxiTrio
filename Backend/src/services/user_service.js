const { User, Vehicle } = require('../../models');

const getAllUsers = async () =>
  User.findAll({ attributes: { exclude: ['password'] }, order: [['created_at', 'DESC']] });

const updateProfile = async (id, { full_name, phone, avatar_url }) => {
  const user = await User.findByPk(id);
  if (!user) throw { status: 404, message: 'User not found' };
  await user.update({ full_name, phone, avatar_url });
  const { password: _, ...data } = user.toJSON();
  return data;
};

const toggleUserStatus = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw { status: 404, message: 'User not found' };
  await user.update({ is_active: !user.is_active });
  return { id: user.id, is_active: user.is_active };
};

const getAllDrivers = async () =>
  User.findAll({
    where: { role: 'driver' },
    attributes: { exclude: ['password'] },
    include: [{ model: Vehicle, as: 'vehicles', attributes: ['plate_number', 'type', 'brand', 'model', 'is_available'] }],
    order: [['full_name', 'ASC']],
  });

const createDriverShell = async ({ name, full_name, email, phone, license_number }) => {
  const crypto = require('crypto');
  const { sendEmail } = require('../utils/mailer');

  const driverName = name || full_name;
  if (!driverName || !email || !phone || !license_number) {
    throw { status: 400, message: 'Name, email, phone, and license number are required' };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const exists = await User.findOne({ where: { email: normalizedEmail } });
  if (exists) throw { status: 409, message: 'Email already registered' };

  // Generate secure activation token (24 hour expiry)
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 3600000);

  // driver creatation 
  const driver = await User.create({
    full_name: driverName,
    email: normalizedEmail,
    phone,
    license_number,
    role: 'driver',
    password: null, // Password is null initially
    is_active: false,
    status: 'pending_activation',  // waiting for the driver to confirm and filling the passwords
    activation_token: token,
    token_expires_at: expires
  });

  // Generate activation URL
  const appUrl = process.env.APP_URL || 'http://localhost:5000';
  const frontendUrl = appUrl.includes('5000') ? 'http://localhost:5173' : appUrl;
  const activationLink = `${frontendUrl}/activate-account?token=${token}`;

  const emailSubject = 'TaxiTrio - Activate Your Driver Account';
  const emailText = `Hello ${driver.full_name},\n\nAn administrator has registered you as a driver. Click the link below to set your password and activate your account:\n\n${activationLink}\n\nBest regards,\nThe TaxiTrio Team`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #0b0b0b; color: #fff;">
      <h2 style="color: #D4AF37; text-align: center; font-family: Georgia, serif;">TaxiTrio</h2>
      <p style="color: #fff;">Hello <strong>${driver.full_name}</strong>,</p>
      <p style="color: #A3A3A3;">An administrator has registered you as a driver on TaxiTrio. Click the button below to set up your personal, secure password and activate your account:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${activationLink}" target="_blank" style="background-color: #D4AF37; color: #000; padding: 12px 25px; border-radius: 50px; font-weight: bold; text-decoration: none; display: inline-block;">Activate Account</a>
      </div>
      <p style="color: #A3A3A3;">If you did not request this account, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #2A2A2A; margin: 20px 0;" />
      <p style="font-size: 11px; color: #555; text-align: center;">This setup link is valid for 24 hours.<br/>&copy; 2026 TaxiTrio. All rights reserved.</p>
    </div>
  `;

  await sendEmail({
    to: driver.email,
    subject: emailSubject,
    text: emailText,
    html: emailHtml
  });

  return { 
    id: driver.id, 
    full_name: driver.full_name, 
    email: driver.email, 
    role: driver.role, 
    status: driver.status,
    license_number: driver.license_number
  };
};

const getUserDetails = async (id) => {
  const { fn, col, literal, Op } = require('sequelize');
  const { Booking, Review } = require('../../models');

  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
  if (!user) throw { status: 404, message: 'User not found' };

  let stats = {};
  let bookings = [];
  let reviews = [];

  if (user.role === 'driver') {
    // Driver stats
    const completedRidesCount = await Booking.count({
      where: { driver_id: id, status: 'completed' }
    });

    const averageRatingResult = await Review.findOne({
      where: { driver_id: id },
      attributes: [
        [fn('ROUND', fn('AVG', col('rating')), 2), 'avg_rating']
      ],
      raw: true
    });

    stats = {
      total_trips: completedRidesCount,
      average_rating: parseFloat(averageRatingResult?.avg_rating || 0)
    };

    // Booking history for driver
    bookings = await Booking.findAll({
      where: { driver_id: id },
      order: [['created_at', 'DESC']]
    });

    // Reviews received by driver
    reviews = await Review.findAll({
      where: { driver_id: id },
      include: [
        {
          model: User,
          as: 'traveler',
          attributes: ['full_name', 'email', 'avatar_url']
        }
      ],
      order: [['created_at', 'DESC']]
    });
  } else if (user.role === 'traveler') {
    // Passenger/Traveler stats
    const tripsCount = await Booking.count({
      where: { traveler_id: id, status: 'completed' }
    });

    const totalSpentResult = await Booking.findOne({
      where: { traveler_id: id, status: 'completed' },
      attributes: [
        [fn('COALESCE', fn('SUM', col('total_fare')), 0), 'total_spent']
      ],
      raw: true
    });

    stats = {
      total_trips: tripsCount,
      total_spent: parseFloat(totalSpentResult?.total_spent || 0)
    };

    // Booking history for traveler
    bookings = await Booking.findAll({
      where: { traveler_id: id },
      order: [['created_at', 'DESC']]
    });

    // Reviews left by traveler
    reviews = await Review.findAll({
      where: { traveler_id: id },
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['full_name', 'email', 'avatar_url']
        }
      ],
      order: [['created_at', 'DESC']]
    });
  } else {
    // Admin profile has standard stats
    bookings = [];
    reviews = [];
    stats = {};
  }

  return {
    profile: user,
    stats,
    bookings,
    reviews
  };
};

module.exports = { getAllUsers, updateProfile, toggleUserStatus, getAllDrivers, createDriverShell, getUserDetails };
