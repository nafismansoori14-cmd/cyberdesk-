const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Joi = require("joi");
const Customer = require("../models/Customer");
const Cafe = require("../models/Cafe");
const { createAccessToken } = require("../utils/token");

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().required(),
  password: Joi.string().min(6).optional(),
  cafeId: Joi.string().required(),
});

const loginSchema = Joi.object({
  emailOrPhone: Joi.string().required(),
  password: Joi.string().required(),
  cafeId: Joi.string().required(),
});

exports.signup = async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const cafe = await Cafe.findOne({ name: value.cafeId });
    if (!cafe) return res.status(404).json({ message: "Cafe not found" });

    const existingCustomer = await Customer.findOne({
      cafeId: cafe._id,
      $or: [{ email: value.email }, { phone: value.phone }],
    });
    if (existingCustomer) {
      return res.status(409).json({ message: "Customer already exists" });
    }

    const passwordHash = value.password
      ? await bcrypt.hash(value.password, 12)
      : undefined;
    const qrToken = crypto.randomBytes(16).toString("hex");

    const customer = await Customer.create({
      cafeId: cafe._id,
      name: value.name,
      email: value.email,
      phone: value.phone,
      passwordHash,
      type: "registered",
      qrToken,
      isVerified: !!value.email,
    });

    const accessToken = createAccessToken({
      userId: customer._id,
      role: "customer",
      cafeId: customer.cafeId,
    });
    res.status(201).json({
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        qrToken: customer.qrToken,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const cafe = await Cafe.findOne({ name: value.cafeId });
    if (!cafe) return res.status(404).json({ message: "Cafe not found" });

    const customer = await Customer.findOne({
      cafeId: cafe._id,
      $or: [{ email: value.emailOrPhone }, { phone: value.emailOrPhone }],
    });
    if (!customer || !customer.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(value.password, customer.passwordHash);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken({
      userId: customer._id,
      role: "customer",
      cafeId: customer.cafeId,
    });
    res.json({
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        qrToken: customer.qrToken,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.qrLogin = async (req, res, next) => {
  try {
    const { qrToken, cafeId } = req.body;
    if (!qrToken || !cafeId) {
      return res
        .status(400)
        .json({ message: "QR token and cafeId are required" });
    }

    const customer = await Customer.findOne({
      cafeId,
      qrToken,
      isBlocked: false,
    });
    if (!customer)
      return res
        .status(404)
        .json({ message: "QR token invalid or customer blocked" });

    const accessToken = createAccessToken({
      userId: customer._id,
      role: "customer",
      cafeId: customer.cafeId,
    });
    res.json({
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        qrToken: customer.qrToken,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};
