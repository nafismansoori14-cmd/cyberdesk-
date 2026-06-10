const Joi = require("joi");
const Cafe = require("../models/Cafe");

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  address: Joi.string().optional(),
  logoUrl: Joi.string().uri().optional(),
  currency: Joi.string().optional(),
  timezone: Joi.string().optional(),
  settings: Joi.object({
    autoStopOnZeroBalance: Joi.boolean().optional(),
    soundAlerts: Joi.boolean().optional(),
    theme: Joi.string().valid("dark", "light", "auto").optional(),
    taxPercent: Joi.number().min(0).optional(),
  }).optional(),
});

exports.getCafe = async (req, res, next) => {
  try {
    const cafe = await Cafe.findById(req.user.cafeId);
    if (!cafe) return res.status(404).json({ message: "Cafe not found" });
    res.json({ cafe });
  } catch (err) {
    next(err);
  }
};

exports.updateCafe = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const cafe = await Cafe.findOneAndUpdate({ _id: req.user.cafeId }, value, {
      new: true,
    });
    if (!cafe) return res.status(404).json({ message: "Cafe not found" });
    res.json({ cafe });
  } catch (err) {
    next(err);
  }
};
