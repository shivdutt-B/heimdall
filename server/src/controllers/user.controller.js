const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');

const VERIFICATION_CODE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds
const prisma = new PrismaClient();

/**
 * Update user profile
 * @route PUT /api/users/profile
 * NOTE IN USE
 */
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email } = req.body;

  try {
    // Check if email(new email) is already in use by another user
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true }
    });

    // If email is being changed, we'll need to verify it
    const isEmailChange = email && email !== currentUser.email;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        email: isEmailChange ? currentUser.email : (email || undefined), // Don't update email immediately if it's being changed
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    // If email is being changed, send verification code
    if (isEmailChange) {
      // Delete any existing verification codes
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

      // Send verification email
      try {
        // await sendEmail({
        //   to: email,
        //   subject: 'Verify Your New Email',
        //   text: `Please verify your new email address by entering this code: ${verificationCode}. This code will expire in ${VERIFICATION_CODE_EXPIRY / 60000} minutes.`,
        // });
      } catch (emailError) {
        console.error('Error sending email verification:', emailError);
        throw new Error('Failed to send verification email');
      }

      return res.json({
        ...updatedUser,
        pendingEmail: email,
        message: 'Profile updated. Please check your new email for verification code.'
      });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * Update user password
 * @route PUT /api/users/password
 * NOTE IN USE
 */
exports.updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err.message);
    res.status(500).send('Server error');
  }
};

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

module.exports = exports;
