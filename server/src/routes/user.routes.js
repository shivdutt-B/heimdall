const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  authMiddleware,
  [
    check("name", "Name must not be empty if provided")
      .optional()
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").optional().isEmail(),
  ],
  userController.updateProfile
);

// @route   PUT api/users/password
// @desc    Update user password
// @access  Private
router.put(
  "/password",
  authMiddleware,
  [
    check("currentPassword", "Current password is required").exists(),
    check(
      "newPassword",
      "Please enter a new password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  userController.updatePassword
);

// @route   POST api/users/send-code
// @desc    Send verification code for email sign in
// @access  Public
router.post(
  "/send-code",
  [
    check("email", "Please include a valid email").isEmail(),
  ],
  userController.sendVerificationCode
);

// @route   POST api/users/verify-code
// @desc    Verify code and sign in
// @access  Public
router.post(
  "/verify-code",
  [
    check("email", "Please include a valid email").isEmail(),
    check("code", "Please include the verification code").not().isEmpty(),
  ],
  userController.verifyCodeAndSignIn
);

// @route   DELETE api/users/delete-account
// @desc    Delete user account
// @access  Private
router.delete('/delete-account', authMiddleware, userController.deleteAccount);

module.exports = router;
