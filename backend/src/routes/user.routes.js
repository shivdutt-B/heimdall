const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
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
  [
    check("currentPassword", "Current password is required").exists(),
    check(
      "newPassword",
      "Please enter a new password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  userController.updatePassword
);

// @route   PUT api/users/settings
// @desc    Update user settings
// @access  Private
router.put(
  "/settings",
  [
    check("emailNotifications", "Email notifications must be a boolean")
      .optional()
      .isBoolean(),
    check("darkMode", "Dark mode must be a boolean").optional().isBoolean(),
  ],
  userController.updateSettings
);

module.exports = router;
