const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
// const userController = require("../controllers/user.controller");
const userController = require("../controllers/user.controller")

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  authController.register
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);

// @route   GET api/auth/me
// @desc    Get authenticated user
// @access  Private
router.get("/me", authMiddleware, authController.getMe);

// Verification code routes
// router.post(
//   "/send-code",
//   [check("email", "Please include a valid email").isEmail()],
//   userController.sendVerificationCode
// );
// router.post(
//   "/verify-code",
//   [
//     check("email", "Please include a valid email").isEmail(),
//     check("code", "Please include the verification code").not().isEmpty(),
//   ],
//   userController.verifyCode
// );

module.exports = router;
