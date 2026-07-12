const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');

const VERIFICATION_CODE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds
const prisma = new PrismaClient();

/**
 * Send verification code for email sign in
 * @route POST /api/users/send-code
 */
exports.sendVerificationCode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Delete any existing verification codes for this email
    await prisma.verificationCode.deleteMany({
      where: { email }
    });

    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the code with expiration
    await prisma.verificationCode.create({
      data: {
        code: verificationCode,
        email: email,
        expiresAt: new Date(Date.now() + VERIFICATION_CODE_EXPIRY),
      }
    });

    try {
      // Send the code via email
      const emailResult = await sendEmail({
        to: email,
        subject: 'Your Verification Code',
        text: `${verificationCode}`,
      });

      res.json({ message: 'Verification code sent successfully' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Delete the verification code since email failed
      await prisma.verificationCode.deleteMany({
        where: {
          email,
          code: verificationCode
        }
      });
      throw new Error('Failed to send verification code email');
    }
  } catch (err) {
    console.error('Send verification code error:', err.message);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * Verify code and sign in
 * @route POST /api/users/verify-code
 */
exports.verifyCodeAndSignIn = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, code } = req.body;

  try {
    // Find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!verificationCode) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Delete the used verification code
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id }
    });

    // Generate JWT token
    const payload = {
      userId: user.id
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            name: user.name,
            email: user.email,
          },
        });
      }
    );
  } catch (err) {
    console.error('Verify code error:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Delete user account
 * @route DELETE /api/users/delete-account
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all verification codes associated with the user's email
    await prisma.verificationCode.deleteMany({
      where: { email: req.user.email }
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err.message);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

/**
 * Get Total Pings and Pings/Day
 * @route GET /api/public/stats
 */
exports.getPingsStats = async (req, res) => {
  try {
    const stats = await prisma.globalStats.findUnique({
      where: {
        id: 1,
      },
      select: {
        totalPings: true,
        firstPingAt: true,
      },
    });

    let totalPings = 0;
    let pingsPerDay = 0;

    if (stats) {
      totalPings = Number(stats.totalPings);

      if (stats.firstPingAt) {
        const totalDays = Math.max(
          1,
          Math.ceil(
            (Date.now() - stats.firstPingAt.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        );

        pingsPerDay = Math.round(totalPings / totalDays);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        totalPings,
        pingsPerDay,
      },
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch public statistics.",
    });
  }
};

module.exports = exports;
