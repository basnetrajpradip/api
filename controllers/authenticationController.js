const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register_post = [
  body("username", "Username must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("password", "password must not be empty").trim().isLength({ min: 1 }).escape(),
  body("confirmPassword", "Passwords must match")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const userAlreadyExists = await User.findOne({ username: req.body.username });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
        message: "Error: Registration failure.",
      });
      return;
    }

    if (userAlreadyExists) {
      res.status(409).json({
        message: "Error: Username already exists.",
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        res.status(500).json({ err });
        return;
      } else {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        await user.save();
        res.status(200).json({ message: "New user created successfully." });
      }
    });
  }),
];

exports.login_post = [
  body("username", "Username must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("password", "Password must not be empty.").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(401).json({
        errors: errors.array(),
        message: "Error: Login failure.",
      });
      return;
    }
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.status(401).json({ message: "Error:Wrong username or password." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Error:Wrong username or password." });
      return;
    }

    const userPayload = {
      id: user._id,
      username: user.username,
      isAuthor: user.isAuthor,
    };

    const accessToken = jwt.sign({ user: userPayload }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
    const refreshToken = jwt.sign({ user: userPayload }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "5m" });

    res.cookie("accessToken", accessToken, { maxAge: 60000 });
    res.cookie("refreshToken", refreshToken, { maxAge: 300000, httpOnly: true, sameSite: "none" });
    res.status(200).json({ message: "Login successful", user: userPayload });
    return;
  }),
];

exports.authenticate_user = (req, res, next) => {
  if (req.user) {
    res.status(200).json({ message: "User is authenticated", user: req.user });
  } else {
    res.status(401).json({ message: "User isn't authenticated" });
  }
};

exports.logout_post = (req, res, next) => {
  res.clearCookie("refreshToken", { httpOnly: true });
  res.status(200).json({ message: "Logout successful" });
};
