const bcrypt = require("bcryptjs");
const Joi = require("joi");
const User = require("../models/User");
const Cafe = require("../models/Cafe");
const {
  createAccessToken,
  createRefreshToken,
  verifyToken,
} = require("../utils/token");

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).required(),
  password: Joi.string().min(8).required(),
  cafeName: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.registerAdmin = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const cafe = await Cafe.create({ name: value.cafeName });
    const passwordHash = await bcrypt.hash(value.password, 12);
    const user = await User.create({
      cafeId: cafe._id,
      name: value.name,
      email: value.email,
      phone: value.phone,
      passwordHash,
      role: "owner",
      permissions: ["*"],
    });

    cafe.ownerId = user._id;
    await cafe.save();

    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
      cafeId: cafe._id,
    });
    const refreshToken = createRefreshToken({ userId: user._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      });
  } catch (err) {
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(value.password, user.passwordHash);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
      cafeId: user.cafeId,
    });
    const refreshToken = createRefreshToken({ userId: user._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token missing" });

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
      cafeId: user.cafeId,
    });
    res.json({ accessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Refresh token invalid or expired" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
